use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("EiysWuzqfv7eg7YBiBos7pKYEDQjLCyKvYnjPnD8GiLU");

#[program]
pub mod metronome {
    use super::*;

    pub fn initialize_rhythm(
        ctx: Context<InitializeRhythm>, 
        id: u64, // 👈 NUEVO: Recibimos un ID único
        deposit_amount: u64, 
        buy_drop_percentage: u8, 
        sell_pump_percentage: u8
    ) -> Result<()> {
        
        let rhythm = &mut ctx.accounts.rhythm_account;
        rhythm.owner = ctx.accounts.user.key();
        rhythm.id = id; // 👈 NUEVO: Lo guardamos
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
}

#[derive(Accounts)]
#[instruction(id: u64)] // 👈 NUEVO: Le avisamos que la orden viene con ID
pub struct InitializeRhythm<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 32 + 8 + 1 + 1 + 8, // 👈 Aumentamos el espacio (+8 bytes para el ID)
        seeds = [b"rhythm", user.key().as_ref(), id.to_le_bytes().as_ref()], // 👈 NUEVA FÓRMULA
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

#[account]
pub struct Rhythm {
    pub owner: Pubkey,
    pub deposit_amount: u64,
    pub buy_drop_percentage: u8,
    pub sell_pump_percentage: u8,
    pub id: u64, // 👈 NUEVO: El número de serie de la bóveda
}