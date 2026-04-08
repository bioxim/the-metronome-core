"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Calculator, Bot, ArrowLeftRight, PiggyBank } from 'lucide-react';
import { FaYoutube, FaXTwitter } from 'react-icons/fa6';

export default function Navbar() {
    // Esta variable controla si el menú de celular está abierto o cerrado
    const [isOpen, setIsOpen] = useState(false);
    // Esta controla el submenú de Tools en el celular
    const [isToolsOpen, setIsToolsOpen] = useState(false);

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

                {/* DESPLEGABLE TOOLS */}
                <div className="relative group py-2">
                    <button className="flex items-center gap-1 hover:text-brandPrimary transition-colors">
                        Tools <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    </button>

                    {/* Tarjeta del Submenú */}
                    <div className="absolute top-[30px] left-1/2 -translate-x-1/2 w-64 bg-bgSecondary border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 flex flex-col z-50">
                        <Link href="/tools/oracle" className="flex items-start gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors group/item">
                            <Bot className="w-5 h-5 text-brandPrimary mt-0.5 group-hover/item:animate-bounce" />
                            <div>
                                <span className="block text-sm font-bold text-white">The AI Oracle</span>
                                <span className="block text-xs font-normal text-textMuted">Smart pricing insights</span>
                            </div>
                        </Link>
                        <Link href="/tools/calculator" className="flex items-start gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors group/item">
                            <Calculator className="w-5 h-5 text-brandPrimary mt-0.5" />
                            <div>
                                <span className="block text-sm font-bold text-white">Yield Calculator</span>
                                <span className="block text-xs font-normal text-textMuted">Simulate your strategy</span>
                            </div>
                        </Link>

                        <div className="h-px w-full bg-white/10 my-2"></div>

                        <div className="flex items-start gap-3 p-3 opacity-50 cursor-not-allowed">
                            <ArrowLeftRight className="w-5 h-5 text-textMuted mt-0.5" />
                            <div className="w-full flex justify-between items-center">
                                <div>
                                    <span className="block text-sm font-bold text-white">Swap</span>
                                    <span className="block text-xs font-normal text-textMuted">Instant exchange</span>
                                </div>
                                <span className="text-[9px] bg-brandPrimary/20 text-brandPrimary px-2 py-1 rounded-full uppercase tracking-wider border border-brandPrimary/30">Phase 2</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 opacity-50 cursor-not-allowed">
                            <PiggyBank className="w-5 h-5 text-textMuted mt-0.5" />
                            <div className="w-full flex justify-between items-center">
                                <div>
                                    <span className="block text-sm font-bold text-white">Lend</span>
                                    <span className="block text-xs font-normal text-textMuted">Earn passive yield</span>
                                </div>
                                <span className="text-[9px] bg-brandPrimary/20 text-brandPrimary px-2 py-1 rounded-full uppercase tracking-wider border border-brandPrimary/30">Phase 2</span>
                            </div>
                        </div>
                    </div>
                </div>

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
                className="lg:hidden text-[--text-main] hover:text-white p-2 transition-colors cursor-pointer relative z-50"
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
                <div className="absolute top-[90px] left-0 w-full bg-bgSecondary border-b border-white/10 flex flex-col items-center py-8 gap-6 lg:hidden z-40 shadow-2xl">
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-lg hover:text-brandPrimary transition-colors">Create Rhythm</Link>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg hover:text-brandPrimary transition-colors">Dashboard</Link>
                    <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="text-lg hover:text-brandPrimary transition-colors">Leaderboard</Link>
                    <Link href="/rewards" onClick={() => setIsOpen(false)} className="text-lg hover:text-brandPrimary transition-colors">Rewards</Link>

                    {/* Tools Accordion Mobile */}
                    <div className="w-full flex flex-col items-center">
                        <button
                            onClick={() => setIsToolsOpen(!isToolsOpen)}
                            className="flex items-center gap-2 text-lg hover:text-brandPrimary transition-colors"
                        >
                            Tools <ChevronDown className={`w-5 h-5 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isToolsOpen && (
                            <div className="mt-4 flex flex-col gap-4 text-base border-l-2 border-white/10 pl-6 w-[200px]">
                                <Link href="/tools/oracle" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-white w-full"><Bot className="w-4 h-4 text-brandPrimary" /> AI Oracle</Link>
                                <Link href="/tools/calculator" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-white w-full"><Calculator className="w-4 h-4 text-brandPrimary" /> Calculator</Link>
                                <span className="flex items-center justify-between w-full opacity-50"><span className="flex items-center gap-2"><ArrowLeftRight className="w-4 h-4" /> Swap</span> <span className="text-[10px] text-brandPrimary uppercase">Soon</span></span>
                                <span className="flex items-center justify-between w-full opacity-50"><span className="flex items-center gap-2"><PiggyBank className="w-4 h-4" /> Lend</span> <span className="text-[10px] text-brandPrimary uppercase">Soon</span></span>
                            </div>
                        )}
                    </div>

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