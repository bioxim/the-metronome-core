"use client";

import Navbar from './Navbar';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Header() {
    return (
        <header className="w-full max-w-7xl mx-auto mt-6 flex justify-between items-center mb-16 border-b border-white/10 pb-6 px-4 xl:px-0">
            {/* mx-auto para centrar, mt-6 para despegar del techo */}

            {/* SECCIÓN 1: El Logo (Responsive) */}
            <div className="flex items-center cursor-pointer shrink-0">
                {/* Celulares (Sin el borde) */}
                <img
                    src="/favicon.png"
                    alt="The Metronome Icon"
                    className="block md:hidden h-10 w-auto rounded-md shadow-lg"
                />

                {/* Tablets y PCs (Sin el borde) */}
                <img
                    src="/metronome_full_logo.png"
                    alt="The Metronome Full Logo"
                    className="hidden md:block h-12 w-auto rounded-md shadow-lg"
                />
            </div>

            {/* SECCIÓN 2: Navbar Modularizada */}
            <Navbar />

            {/* SECCIÓN 3: El Botón de Wallet Oficial de Solana */}
            <div className="flex items-center shrink-0">
                <WalletMultiButton className="!bg-brandPrimary hover:!bg-[#0891b2] !text-bgMain !rounded-lg !font-extrabold transition-colors !h-10 px-5" />
            </div>

        </header>
    );
}