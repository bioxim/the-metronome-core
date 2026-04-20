import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../idl/metronome.json';

// Esta es la dirección de tu contrato (la copiamos después, por ahora dejamos una falsa)
export const PROGRAM_ID = new PublicKey("11111111111111111111111111111111");

export const getProvider = (wallet: any, connection: Connection) => {
    return new AnchorProvider(
        connection,
        wallet,
        { commitment: 'confirmed' }
    );
};

export const getProgram = (provider: AnchorProvider) => {
    // ¡Ahora solo le pasamos el diccionario y el provider!
    return new Program(idl as Idl, provider);
};