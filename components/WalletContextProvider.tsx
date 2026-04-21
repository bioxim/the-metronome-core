"use client";

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Importamos los estilos por defecto del modal de Solana
import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
    children: ReactNode;
}

export const WalletContextProvider: FC<Props> = ({ children }) => {
    // Usamos la 'devnet' para pruebas. Para producción se cambia a 'mainnet-beta'
    const network = "http://127.0.0.1:8899";

    // ¡Acá está la magia moderna! 
    // Dejamos esto vacío porque Phantom y Solflare se detectan solas con el nuevo estándar.
    const wallets = useMemo(() => [], []);

    return (
        <ConnectionProvider endpoint={network}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};