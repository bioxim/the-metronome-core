use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use pyth_sdk_solana::state::SolanaPriceAccount; 

declare_id!("5Can35RsgcDE4zYXWmbPEm87cqrutM3csXi8SmFsCCPg");

#[program]
pub mod metronome {
    use super::*;

    // 1. EL USUARIO CREA SU BÓVEDA (CONFIGURACIÓN DEL RITMO)
    pub fn initialize_rhythm(
        ctx: Context<InitializeRhythm>, 
        id: u64, 
        total_deposit: u64,           // Ej: 500 USDC total
        buy_amount_per_step: u64,     // Ej: 50 USDC en cada caída
        buy_drop_percentage: u8,      // Ej: 2% de caída
        take_profit_is_price: bool,   // true: precio fijo, false: % ROI
        take_profit_value: u64        // Ej: 65400 (Precio fijo) o 15 (%)
    ) -> Result<()> {
        
        // Leemos el Oráculo de Pyth al momento de crear la bóveda
        let price_account_info = &ctx.accounts.pyth_oracle;
        let price_feed = SolanaPriceAccount::account_info_to_feed(price_account_info).unwrap();
        let current_price_data = price_feed.get_price_unchecked();
        let starting_price = current_price_data.price as u64; 

        // Guardamos todo en la "Memoria" del PDA
        let rhythm = &mut ctx.accounts.rhythm_account;
        rhythm.owner = ctx.accounts.user.key();
        rhythm.id = id; 
        rhythm.total_deposit = total_deposit;
        rhythm.buy_amount_per_step = buy_amount_per_step; // 👈 NUEVO: Cuánto gasta por disparo
        rhythm.buy_drop_percentage = buy_drop_percentage;
        rhythm.take_profit_is_price = take_profit_is_price;
        rhythm.take_profit_value = take_profit_value;
        rhythm.base_price = starting_price; // 👈 NUEVO: El precio inicial de referencia

        msg!("🐻 Bóveda creada. Precio base anotado: {}", starting_price);

        // Transferimos los fondos del usuario a la bóveda
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(cpi_ctx, total_deposit)?;
        
        Ok(())
    }

    // 2. EL BOT VIGÍA (EL METRÓNOMO EN ACCIÓN)
    pub fn check_and_execute(ctx: Context<CheckAndExecute>) -> Result<()> {
        let rhythm = &mut ctx.accounts.rhythm_account;

        // Leemos el precio actual
        let price_account_info = &ctx.accounts.pyth_oracle;
        let price_feed = SolanaPriceAccount::account_info_to_feed(price_account_info).unwrap();
        let current_price_data = price_feed.get_price_unchecked();
        let current_price = current_price_data.price as u64; 
        
        // Calculamos los umbrales basados en la MEMORIA del contrato (base_price)
        let target_buy_price = rhythm.base_price - (rhythm.base_price * rhythm.buy_drop_percentage as u64 / 100);
        
        let target_sell_price = if rhythm.take_profit_is_price {
            rhythm.take_profit_value // Precio Fijo (Target Price)
        } else {
            // Porcentaje (ROI %) sumado al precio de compra promedio simulado
            target_buy_price + (target_buy_price * rhythm.take_profit_value / 100)
        };

        // 🌟 LÓGICA MATEMÁTICA INSTITUCIONAL (El Instinto del Oso)
        if current_price <= target_buy_price {
            msg!("📉 ¡CAÍDA DETECTADA! Precio actual: {} <= Objetivo: {}", current_price, target_buy_price);
            
            if rhythm.total_deposit >= rhythm.buy_amount_per_step {
                msg!("🔫 DISPARO DCA: Comprando {} USDC", rhythm.buy_amount_per_step);
                // Restamos del presupuesto total
                rhythm.total_deposit -= rhythm.buy_amount_per_step;
                // Actualizamos el base_price para esperar la siguiente caída (El grid dinámico)
                rhythm.base_price = current_price;
            } else {
                msg!("⚠️ Sin liquidez. Bóveda vacía.");
            }

        } else if current_price >= target_sell_price {
            msg!("🚀 ¡SUBIDA DETECTADA! Precio actual: {} >= Objetivo: {}", current_price, target_sell_price);
            msg!("💰 ASEGURANDO GANANCIAS: Take Profit ejecutado.");
            // Aquí iría la lógica de cerrar la bóveda y transferir fondos al usuario
        } else {
            msg!("💤 En rango. Paciencia. Faltan {} para comprar.", current_price.saturating_sub(target_buy_price));
        }

        Ok(())
    }
}

// --- ESTRUCTURAS DE CUENTAS (ACCOUNTS) ---

#[derive(Accounts)]
#[instruction(id: u64)] 
pub struct InitializeRhythm<'info> {
    #[account(
        init, 
        payer = user, 
        // Aumentamos el espacio sumando buy_amount_per_step(8) y base_price(8)
        space = 8 + 32 + 8 + 8 + 1 + 1 + 8 + 8 + 8, 
        seeds = [b"rhythm", user.key().as_ref(), id.to_le_bytes().as_ref()], 
        bump
    )]
    pub rhythm_account: Account<'info, Rhythm>,
    
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Oráculo de Pyth necesario para la inicialización
    pub pyth_oracle: AccountInfo<'info>, 

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CheckAndExecute<'info> {
    #[account(mut)]
    pub rhythm_account: Account<'info, Rhythm>,

    /// CHECK: Esta es la cuenta oficial de Pyth en Devnet/Mainnet
    pub pyth_oracle: AccountInfo<'info>, 
}

#[account]
pub struct Rhythm {
    pub owner: Pubkey,
    pub total_deposit: u64,
    pub buy_amount_per_step: u64, // 👈 NUEVO: USDC a gastar por caída
    pub buy_drop_percentage: u8,
    pub take_profit_is_price: bool, 
    pub take_profit_value: u64,     
    pub base_price: u64,          // 👈 NUEVO: Memoria del precio
    pub id: u64, 
}