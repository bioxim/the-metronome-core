use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use pyth_sdk_solana::state::SolanaPriceAccount; 

declare_id!("HgxDKPcdz9otrjhoDcn6YdJr9HJVVYxcA41doaE1i8Vk");

#[program]
pub mod metronome {
    use super::*;

    pub fn initialize_rhythm(
        ctx: Context<InitializeRhythm>, 
        id: u64, 
        deposit_amount: u64, 
        buy_drop_percentage: u8, 
        take_profit_is_price: bool, // 👈 NUEVO: El usuario nos dice si es precio fijo o %
        take_profit_value: u64      // 👈 NUEVO: Puede ser 15 (para 15%) o 6540000000000 (para $65,400)
    ) -> Result<()> {
        
        let rhythm = &mut ctx.accounts.rhythm_account;
        rhythm.owner = ctx.accounts.user.key();
        rhythm.id = id; 
        rhythm.deposit_amount = deposit_amount;
        rhythm.buy_drop_percentage = buy_drop_percentage;
        
        // Guardamos las nuevas reglas en la blockchain
        rhythm.take_profit_is_price = take_profit_is_price;
        rhythm.take_profit_value = take_profit_value;

        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(cpi_ctx, deposit_amount)?;
        
        Ok(())
    }

    // 🌟 La función del Bot Vigía con Instinto Institucional
    pub fn check_and_execute(ctx: Context<CheckAndExecute>) -> Result<()> {
        let rhythm = &mut ctx.accounts.rhythm_account;

        // 1. Cargamos la cuenta del oráculo de Pyth
        let price_account_info = &ctx.accounts.pyth_oracle;
        let price_feed = SolanaPriceAccount::account_info_to_feed(price_account_info).unwrap();
        
        // 2. Obtenemos el precio actual (Pyth lo devuelve con 8 ceros extra)
        let current_price_data = price_feed.get_price_unchecked();
        let current_price = current_price_data.price as u64; 
        
        msg!("🐻👀 El Oso miró el Oráculo Pyth.");
        msg!("Precio actual detectado: {}", current_price);

        // Precio base simulado. En producción, esto se guarda en la primera compra.
        let reference_price: u64 = 150_0000_0000; 
        
        let target_buy_price = reference_price - (reference_price * rhythm.buy_drop_percentage as u64 / 100);
        
        // 🌟 NUEVO: El Oso decide cómo calcular la salida dependiendo de lo que eligió el usuario
        let target_sell_price = if rhythm.take_profit_is_price {
            // Eligió precio fijo objetivo (Target Price)
            rhythm.take_profit_value
        } else {
            // Eligió porcentaje (ROI %)
            target_buy_price + (target_buy_price * rhythm.take_profit_value / 100)
        };

        // 5. Ejecución de decisiones
        if current_price <= target_buy_price {
            msg!("📉 ¡ALERTA DE CAÍDA! Precio bajó a {}. Objetivo: {}", current_price, target_buy_price);
            msg!("🔫 EL OSO APRIETA EL GATILLO: ¡Comprando (DCA)!");
        } else if current_price >= target_sell_price {
            msg!("🚀 ¡ALERTA DE SUBIDA! Precio subió a {}. Objetivo: {}", current_price, target_sell_price);
            msg!("💰 EL OSO ASEGURA GANANCIAS: ¡Vendiendo y cerrando bóveda!");
        } else {
            msg!("💤 El precio está en rango aburrido. El Oso sigue esperando con paciencia.");
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(id: u64)] 
pub struct InitializeRhythm<'info> {
    #[account(
        init, 
        payer = user, 
        // 8(Discriminator) + 32(Pubkey) + 8(Deposit) + 1(BuyDrop) + 1(Bool) + 8(TakeProfit) + 8(ID) = 66
        space = 8 + 32 + 8 + 1 + 1 + 8 + 8, 
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
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CheckAndExecute<'info> {
    #[account(mut)]
    pub rhythm_account: Account<'info, Rhythm>,

    /// CHECK: Esta es la cuenta oficial de Pyth.
    pub pyth_oracle: AccountInfo<'info>, 
}

#[account]
pub struct Rhythm {
    pub owner: Pubkey,
    pub deposit_amount: u64,
    pub buy_drop_percentage: u8,
    pub take_profit_is_price: bool, // 👈 NUEVO
    pub take_profit_value: u64,     // 👈 NUEVO
    pub id: u64, 
}