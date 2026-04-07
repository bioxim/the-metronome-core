"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { FaYoutube, FaXTwitter } from 'react-icons/fa6';

export default function Navbar() {
    // Esta variable controla si el menú de celular está abierto o cerrado
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* =========================================
          VERSIÓN ESCRITORIO (Oculta en celulares)
          ========================================= */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[--text-main]">
                <Link href="/" className="hover:text-brandPrimary transition-colors">
                    Create Rhythm
                </Link>
                <Link href="/dashboard" className="hover:text-brandPrimary transition-colors">
                    Dashboard
                </Link>
                <Link href="/leaderboard" className="hover:text-brandPrimary transition-colors">
                    Leaderboard
                </Link>
                <Link href="/rewards" className="hover:text-brandPrimary transition-colors">
                    Rewards
                </Link>
                <Link href="/tools" className="hover:text-brandPrimary transition-colors">
                    Tools
                </Link>

                {/* Separador vertical sutil */}
                <div className="w-px h-4 bg-white/20 mx-2"></div>

                {/* Sección de Token y Redes con Íconos Vectoriales */}
                <Link href="/tokenomics" className="hover:text-white transition-colors">
                    $ONOME
                </Link>
                <a href="https://youtube.com/@strangersonachain" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="YouTube">
                    <FaYoutube className="w-5 h-5" />
                </a>
                <a href="https://x.com/StrangersChain" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="X (Twitter)">
                    <FaXTwitter className="w-5 h-5" />
                </a>
            </nav>

            {/* =========================================
          VERSIÓN CELULAR: BOTÓN HAMBURGUESA
          ========================================= */}
            <button
                className="lg:hidden text-[--text-main] hover:text-white p-2 transition-colors cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                {/* Si está abierto muestra la "X", si está cerrado muestra las rayitas */}
                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>

            {/* =========================================
          VERSIÓN CELULAR: MENÚ DESPLEGABLE
          ========================================= */}
            {isOpen && (
                <div className="absolute top-[90px] left-0 w-full bg-bgSecondary border-b border-white/10 flex flex-col items-center py-8 gap-6 lg:hidden z-50 shadow-2xl">
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-lg hover:text-brandPrimary transition-colors">Create Rhythm</Link>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg hover:text-brandPrimary transition-colors">Dashboard</Link>
                    <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="text-lg hover:text-brandPrimary transition-colors">Leaderboard</Link>
                    <Link href="/rewards" onClick={() => setIsOpen(false)} className="text-lg hover:text-brandPrimary transition-colors">Rewards</Link>
                    <Link href="/tools" onClick={() => setIsOpen(false)} className="text-lg hover:text-brandPrimary transition-colors">Tools</Link>
                    <Link href="/tokenomics" onClick={() => setIsOpen(false)} className="text-lg hover:text-white font-bold transition-colors">$ONOME</Link>

                    {/* Íconos sociales en el menú desplegable */}
                    <div className="flex gap-8 mt-4 border-t border-white/10 pt-6 w-[80%] justify-center">
                        <a href="https://youtube.com/@strangersonachain" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <FaYoutube className="w-7 h-7" />
                        </a>
                        <a href="https://x.com/StrangersChain" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <FaXTwitter className="w-7 h-7" />
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}