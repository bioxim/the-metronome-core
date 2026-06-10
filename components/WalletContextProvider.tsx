"use client";

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js'; // Asegurate de que esto siga importado

import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
    children: ReactNode;
}

export const WalletContextProvider: FC<Props> = ({ children }) => {
    // 🔥 EL ARREGLO ESTÁ ACÁ: Conectamos a la Devnet mundial
    const network = clusterApiUrl('devnet');

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