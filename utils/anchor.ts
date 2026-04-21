import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import IDL from '../idl/metronome.json';

// Ya no usamos una variable PROGRAM_ID manual. 
// Dejamos que Anchor la lea automáticamente de la línea "address" de tu JSON.

export const getProvider = (wallet: any, connection: web3.Connection) => {
    return new AnchorProvider(
        connection,
        wallet,
        { commitment: 'confirmed' }
    );
};

export const getProgram = (provider: AnchorProvider) => {
    // Le pasamos solo el Diccionario y el Provider. ¡Anchor hace el resto!
    return new Program(IDL as any, provider);
};