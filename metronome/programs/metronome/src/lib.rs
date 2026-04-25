use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use pyth_sdk_solana::load_price_feed_from_account_info; // 👈 NUEVO: Importamos Pyth

declare_id!("EiysWuzqfv7eg7YBiBos7pKYEDQjLCyKvYnjPnD8GiLU");

#[program]
pub mod metronome {
    use super::*;

    pub fn initialize_rhythm(
        ctx: Context<InitializeRhythm>, 
        id: u64, 
        deposit_amount: u64, 
        buy_drop_percentage: u8, 
        sell_pump_percentage: u8
    ) -> Result<()> {
        
        let rhythm = &mut ctx.accounts.rhythm_account;
        rhythm.owner = ctx.accounts.user.key();
        rhythm.id = id; 
        rhythm.deposit_amount = deposit_amount;
        rhythm.buy_drop_percentage = buy_drop_percentage;
        rhythm.sell_pump_percentage = sell_pump_percentage;

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

    // 🌟 NUEVO: La función del Bot Vigía
    pub fn check_and_execute(ctx: Context<CheckAndExecute>) -> Result<()> {
        // 1. Cargamos la cuenta del oráculo de Pyth
        let price_account_info = &ctx.accounts.pyth_oracle;
        let price_feed = load_price_feed_from_account_info(price_account_info).unwrap();
        
        // 2. Obtenemos el precio actual de Solana
        let current_price = price_feed.get_price_unchecked();
        
        // 3. Lo anotamos en la consola de la Matrix
        msg!("🐻👀 El Oso miró el Oráculo Pyth.");
        msg!("Precio actual detectado: {}", current_price.price);
        
        // TODO: En el próximo paso agregaremos la matemática para comprar 
        // si el precio cayó lo que marca la regla de la bóveda.

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(id: u64)] 
pub struct InitializeRhythm<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 32 + 8 + 1 + 1 + 8, 
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

// 🌟 NUEVO: Las cuentas necesarias para que el bot mire el precio
#[derive(Accounts)]
pub struct CheckAndExecute<'info> {
    #[account(mut)]
    pub rhythm_account: Account<'info, Rhythm>,

    /// CHECK: Esta es la cuenta oficial de Pyth que contiene el precio. 
    /// Le ponemos CHECK porque nosotros confiamos ciegamente en la dirección de Pyth.
    pub pyth_oracle: AccountInfo<'info>, 
}

#[account]
pub struct Rhythm {
    pub owner: Pubkey,
    pub deposit_amount: u64,
    pub buy_drop_percentage: u8,
    pub sell_pump_percentage: u8,
    pub id: u64, 
}
