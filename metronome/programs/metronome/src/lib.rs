#![allow(deprecated)]
use anchor_lang::prelude::*;

declare_id!("EADt5m5ur3ur8YNKWdX2FRsF8UkTzPzW7tiNMFiqjued");

#[program]
pub mod metronome {
    use super::*;

    // Esta es la función que se ejecuta cuando el usuario hace clic en "Start Rhythm"
    pub fn initialize_rhythm(
        ctx: Context<InitializeRhythm>, 
        deposit_amount: u64, 
        buy_drop_percentage: u8, 
        sell_pump_percentage: u8
    ) -> Result<()> {
        
        // Llamamos a nuestra bóveda para poder escribir adentro
        let rhythm = &mut ctx.accounts.rhythm_account;
        
        // Guardamos los datos que nos mandó el usuario en el frontend
        rhythm.owner = ctx.accounts.user.key();
        rhythm.deposit_amount = deposit_amount;
        rhythm.buy_drop_percentage = buy_drop_percentage;
        rhythm.sell_pump_percentage = sell_pump_percentage;
        
        // Mensajes para la consola de la blockchain
        msg!("¡Rhythm creado exitosamente por: {}!", rhythm.owner);
        msg!("Depósito inicial: {} USDC", deposit_amount);
        
        Ok(())
    }
}

// Acá definimos QUIÉNES participan en esta transacción y validamos
#[derive(Accounts)]
pub struct InitializeRhythm<'info> {
    // Creamos la cuenta nueva, paga el usuario, y reservamos el espacio en memoria
    #[account(
        init, 
        payer = user, 
        space = 8 + 32 + 8 + 1 + 1 
    )]
    pub rhythm_account: Account<'info, Rhythm>,
    
    // El usuario que firma y paga la transacción
    #[account(mut)]
    pub user: Signer<'info>,
    
    // Un programa base de Solana necesario para crear cuentas
    pub system_program: Program<'info, System>,
}

// Esta es la "Bóveda": Acá definimos QUÉ datos vamos a guardar
#[account]
pub struct Rhythm {
    pub owner: Pubkey,               // La wallet del dueño (32 bytes)
    pub deposit_amount: u64,         // La cantidad de USDC depositada (8 bytes)
    pub buy_drop_percentage: u8,     // % de caída para comprar (1 byte)
    pub sell_pump_percentage: u8,    // % de subida para vender (1 byte)
}