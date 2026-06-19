"use client";

import { useState, useEffect } from "react";
import { Equal, TrendingUp, ShieldCheck, AlertCircle, Calculator, Brain, Loader2, Bot, X } from "lucide-react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getProvider, getProgram } from '../utils/anchor';
import { BN, web3 } from '@coral-xyz/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountIdempotentInstruction } from '@solana/spl-token';
import Link from "next/link";

const USDC_MINT = new PublicKey("3eFucVFPDNZryAKFykwUMkbvZevBUrdAZBgyT5REBjjc");

interface RhythmPanelProps {
    selectedAsset: string;
    setSelectedAsset: (asset: string) => void;
}

export default function RhythmPanel({ selectedAsset, setSelectedAsset }: RhythmPanelProps) {
    const [showSetupVideo, setShowSetupVideo] = useState(false);

    const [mode, setMode] = useState<'fixed' | 'crescendo'>('fixed');
    const [totalBudget, setTotalBudget] = useState<number | ''>('');
    const [buyDropPercent, setBuyDropPercent] = useState<number | ''>('');
    const [buyAmount, setBuyAmount] = useState<number | ''>('');
    const [crescendoIncrease, setCrescendoIncrease] = useState<number | ''>('');
    const [takeProfitPercent, setTakeProfitPercent] = useState<number | ''>('');
    const [takeProfitType, setTakeProfitType] = useState<'percentage' | 'price'>('percentage');
    const [takeProfitValue, setTakeProfitValue] = useState<number | ''>('');

    const [availableBalance, setAvailableBalance] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [buttonText, setButtonText] = useState("START METRONOME");

    const { connection } = useConnection();
    const wallet = useWallet();

    useEffect(() => {
        const fetchBalance = async () => {
            if (wallet.publicKey) {
                try {
                    const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, wallet.publicKey);
                    const balance = await connection.getTokenAccountBalance(userTokenAccount);
                    setAvailableBalance(balance.value.uiAmount || 0);
                } catch (error) {
                    setAvailableBalance(0);
                }
            } else {
                setAvailableBalance(0);
            }
        };

        fetchBalance();
        const interval = setInterval(fetchBalance, 5000);
        return () => clearInterval(interval);
    }, [wallet.publicKey, connection]);

    const numBudget = Number(totalBudget) || 0;
    const numBuyAmount = Number(buyAmount) || 0;
    const numDrop = Number(buyDropPercent) || 0;
    const numProfit = Number(takeProfitPercent) || 0;
    const numIncrease = Number(crescendoIncrease) || 0;

    const isBudgetError = numBuyAmount > numBudget && numBuyAmount > 0;
    const isFormIncomplete = !totalBudget || !buyAmount || !buyDropPercent || !takeProfitPercent;

    const projectedOnomeRewards = Math.floor(numBudget / 10);
    const maxEstimatedProfit = (numBudget * (numProfit / 100)).toFixed(2);

    let maxPurchases = 0;
    if (numBuyAmount > 0 && !isBudgetError) {
        if (mode === 'fixed') {
            maxPurchases = Math.floor(numBudget / numBuyAmount);
        } else {
            let currentBudget = numBudget;
            let currentBuy = numBuyAmount;
            while (currentBudget >= currentBuy) {
                maxPurchases++;
                currentBudget -= currentBuy;
                currentBuy += numIncrease;
            }
        }
    }

    const handleMaxBudget = () => {
        setTotalBudget(Math.floor(availableBalance));
    };

    const handleStartMetronome = async () => {
        if (!wallet.connected || !wallet.publicKey || isFormIncomplete) return;
        setIsProcessing(true);
        setButtonText("Waking up the Bear... 🐻");

        try {
            const provider = getProvider(wallet as any, connection);
            const program = getProgram(provider);
            const rhythmId = new BN(Date.now());

            const [rhythmPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("rhythm"), wallet.publicKey.toBuffer(), rhythmId.toArrayLike(Buffer, 'le', 8)],
                program.programId
            );

            const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, wallet.publicKey);
            const vaultTokenAccount = await getAssociatedTokenAddress(USDC_MINT, rhythmPDA, true);

            const transaction = new Transaction();

            transaction.add(
                createAssociatedTokenAccountIdempotentInstruction(
                    wallet.publicKey, vaultTokenAccount, rhythmPDA, USDC_MINT
                )
            );

            setButtonText("Confirm in Phantom... 🦊");

            // Preparamos el número para que Rust y Pyth lo entiendan (Pyth usa 8 ceros para los decimales)
            const isPriceBool = takeProfitType === 'price';
            const takeProfitValueForRust = isPriceBool
                ? new BN(numProfit * 100_000_000)  // Si es un precio (ej: 65400) le sumamos los ceros de Pyth
                : new BN(numProfit);               // Si es porcentaje (ej: 15) lo mandamos tal cual

            const initInstruction = await program.methods.initializeRhythm(
                rhythmId,
                new BN(numBudget),
                Math.floor(numDrop),
                isPriceBool,              // 👈 Le mandamos el booleano
                takeProfitValueForRust    // 👈 Le mandamos el valor formateado
            )
                .accounts({
                    rhythmAccount: rhythmPDA,
                    user: wallet.publicKey,
                    userTokenAccount: userTokenAccount,
                    vaultTokenAccount: vaultTokenAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: web3.SystemProgram.programId,
                })
                .instruction();

            transaction.add(initInstruction);

            // Acá pondremos el Oráculo de verdad cuando integremos la lógica final de ejecución

            const signature = await provider.sendAndConfirm(transaction);
            console.log("¡Éxito! Firma:", signature);

            setButtonText("VAULT CREATED! 🚀");
            setTimeout(() => {
                setButtonText("START METRONOME");
                setIsProcessing(false);
                setTotalBudget(''); setBuyAmount(''); setBuyDropPercent(''); setTakeProfitPercent(''); setCrescendoIncrease('');
            }, 3000);

        } catch (error) {
            console.error("Error Matrix:", error);
            setButtonText("ERROR - TRY AGAIN");
            setTimeout(() => { setButtonText("START METRONOME"); setIsProcessing(false); }, 3000);
        }
    };

    return (
        <div className="bg-bgSecondary border border-white/10 rounded-xl p-6 shadow-2xl flex flex-col w-full relative">

            {/* --- MODAL DE VIDEO DE KIRK --- */}
            {showSetupVideo && (
                <div className="absolute inset-0 z-30 bg-bgMain/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-bgSecondary border border-white/10 p-2 rounded-2xl shadow-2xl relative w-full">
                        <button onClick={() => setShowSetupVideo(false)} className="absolute -top-3 -right-3 bg-bgMain border border-white/10 rounded-full p-1.5 text-textMuted hover:text-white transition-colors z-40">
                            <X className="w-4 h-4" />
                        </button>
                        <video src="/setting-a-rythm.mp4" autoPlay loop controls className="w-full rounded-xl border border-white/10" />
                        <div className="p-3 text-center">
                            <p className="text-sm font-bold text-white">Rhythm Setup Guide</p>
                            <p className="text-xs text-brandPrimary mt-1">Kirk explains step-by-step.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER EN 2 LÍNEAS EXACTAS */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                        🎛️ Setup Rhythm
                    </h2>
                    <button onClick={() => setShowSetupVideo(true)} className="bg-brandPrimary/10 text-brandPrimary hover:bg-brandPrimary hover:text-bgMain px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Help</span>
                    </button>
                </div>

                <div className="flex gap-4 text-xs font-medium border-t border-white/5 pt-3">
                    <Link href="/tools/calculator" className="flex items-center gap-1.5 text-brandPrimary hover:text-white transition-colors">
                        <Calculator className="w-3.5 h-3.5" /> Yield Calc
                    </Link>
                    <Link href="/tools/oracle" className="flex items-center gap-1.5 text-purple-400 hover:text-white transition-colors">
                        <Brain className="w-3.5 h-3.5" /> AI Oracle
                    </Link>
                </div>

                {/* NUEVO: SELECCIÓN DE PAR (SOL o BTC) INYECTADO SIN ROMPER */}
                <div className="mt-4 pt-3 border-t border-white/5">
                    <div className="flex bg-bgMain rounded-lg p-1 border border-white/5 w-full">
                        <button onClick={() => setSelectedAsset('SOL')} className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${selectedAsset === 'SOL' ? 'bg-brandPrimary text-bgMain shadow' : 'text-textMuted hover:text-white'}`}>
                            <img src="/sol-icon.png" className="w-4 h-4" alt="SOL" /> SOL
                        </button>
                        <button onClick={() => setSelectedAsset('BTC')} className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${selectedAsset === 'BTC' ? 'bg-orange-500 text-bgMain shadow' : 'text-textMuted hover:text-white'}`}>
                            <img src="/bitcoin-icon.png" className="w-4 h-4 rounded-full" alt="BTC" /> cbBTC
                        </button>
                    </div>
                </div>
            </div>

            {/* Solapas de Modo */}
            <div className="flex bg-bgMain rounded-lg p-1 border border-white/5 mb-6 w-fit">
                <button onClick={() => setMode('fixed')} className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-md transition-all ${mode === 'fixed' ? 'bg-white/10 text-brandPrimary shadow' : 'text-textMuted hover:text-white'}`}>
                    <Equal className="w-3.5 h-3.5" /> Fixed
                </button>
                <button onClick={() => setMode('crescendo')} className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-md transition-all ${mode === 'crescendo' ? 'bg-white/10 text-purple-400 shadow' : 'text-textMuted hover:text-white'}`}>
                    <TrendingUp className="w-3.5 h-3.5" /> Crescendo
                </button>
            </div>

            <div className="space-y-6">
                {/* Presupuesto Total con Balance */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-[10px] text-textMuted font-bold uppercase block">Total Budget (USDC)</label>
                        <span className="text-[10px] text-brandPrimary/70 italic font-light">Available: {availableBalance.toLocaleString()} USDC</span>
                    </div>
                    <div className="relative">
                        <input type="number" min="0" placeholder="e.g. 500" value={totalBudget} onChange={(e) => setTotalBudget(e.target.value ? Number(e.target.value) : '')} className="w-full bg-bgMain border border-white/5 rounded-lg p-3 pr-16 text-lg font-mono text-white placeholder:text-white/20 focus:border-brandPrimary focus:outline-none transition-colors" />
                        <button onClick={handleMaxBudget} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-brandPrimary/10 text-brandPrimary px-2 py-1 rounded hover:bg-brandPrimary/20 transition-colors">MAX</button>
                    </div>
                </div>

                {/* Estrategia de Compra */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Buy Drop (%)</label>
                        <input type="number" step="0.1" min="0" placeholder="e.g. 2.5" value={buyDropPercent} onChange={(e) => setBuyDropPercent(e.target.value ? Number(e.target.value) : '')} className="w-full bg-bgMain border border-white/5 rounded-lg p-3 text-lg font-mono text-brandPrimary placeholder:text-brandPrimary/20 focus:border-brandPrimary focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Base Buy (USDC)</label>
                        <input type="number" min="0" placeholder="e.g. 50" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value ? Number(e.target.value) : '')} className={`w-full bg-bgMain border rounded-lg p-3 text-lg font-mono text-white placeholder:text-white/20 focus:outline-none transition-colors ${isBudgetError ? 'border-red-500 text-red-400 focus:border-red-500' : 'border-white/5 focus:border-brandPrimary'}`} />
                    </div>
                </div>

                {/* Lógica Crescendo Restaurada */}
                {mode === 'crescendo' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="text-[10px] text-textMuted font-bold uppercase block mb-2 text-purple-400">Increase per step (USDC)</label>
                        <input type="number" min="0" placeholder="e.g. 10" value={crescendoIncrease} onChange={(e) => setCrescendoIncrease(e.target.value ? Number(e.target.value) : '')} className="w-full bg-bgMain border border-purple-500/30 rounded-lg p-3 text-lg font-mono text-purple-400 placeholder:text-purple-400/30 focus:border-purple-500 focus:outline-none transition-colors" />
                    </div>
                )}

                {isBudgetError && (
                    <p className="text-red-400 text-[11px] flex items-center gap-1 mt-[-10px] font-bold">
                        <AlertCircle className="w-3 h-3" /> Base buy cannot exceed total budget.
                    </p>
                )}

                {/* Estrategia de Venta (Take Profit) */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] text-textMuted font-bold uppercase block">Take Profit Strategy</label>
                        {/* NUEVO: Toggle de Salida */}
                        <div className="flex bg-bgMain rounded-md p-0.5 border border-white/5">
                            <button
                                onClick={() => setTakeProfitType('percentage')}
                                className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${takeProfitType === 'percentage' ? 'bg-green-500/20 text-green-400' : 'text-textMuted hover:text-white'}`}
                            >
                                By ROI %
                            </button>
                            <button
                                onClick={() => setTakeProfitType('price')}
                                className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${takeProfitType === 'price' ? 'bg-green-500/20 text-green-400' : 'text-textMuted hover:text-white'}`}
                            >
                                Target Price
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="number" step="0.1" min="0"
                            placeholder={takeProfitType === 'percentage' ? "e.g. 15.0" : (selectedAsset === 'BTC' ? "e.g. 73000" : "e.g. 185")}
                            value={takeProfitValue}
                            onChange={(e) => setTakeProfitValue(e.target.value ? Number(e.target.value) : '')}
                            className="w-full bg-bgMain border border-white/5 rounded-lg p-3 text-lg font-mono text-green-400 placeholder:text-green-400/20 focus:border-green-400 focus:outline-none transition-colors"
                        />
                        {/* Etiqueta visual dentro del input */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-400/50 pointer-events-none">
                            {takeProfitType === 'percentage' ? '%' : 'USDC'}
                        </div>
                    </div>

                    {/* Botón Mágico de Sugerencia IA (VWAP) */}
                    {takeProfitType === 'price' && (
                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                            <button
                                onClick={() => setTakeProfitValue(selectedAsset === 'BTC' ? 65400 : 152.5)}
                                className="w-full flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 py-2 rounded-md text-[11px] font-bold transition-all"
                            >
                                <Brain className="w-3.5 h-3.5" />
                                AI Suggestion: Align with Monthly VWAP ({selectedAsset === 'BTC' ? '$65,400' : '$152.50'})
                            </button>
                        </div>
                    )}
                </div>

                {/* Feedback Box Original Restaurado */}
                <div className={`bg-bgMain p-4 rounded-lg border border-white/5 text-xs text-textMuted space-y-2 transition-opacity ${isFormIncomplete ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="flex justify-between">
                        <span>Estimated Orders:</span>
                        <span className={`font-mono font-bold ${maxPurchases === 0 ? 'text-textMuted' : 'text-white'}`}>{maxPurchases || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span>Target Profit:</span>
                        <span className="font-mono text-green-400 font-bold text-sm">{numProfit > 0 ? `+$${maxEstimatedProfit} USDC` : '-'}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                        <span>Projected Rewards:</span>
                        <span className="font-mono text-brandPrimary font-bold">{numBudget > 0 ? `+${projectedOnomeRewards} $ONOME` : '-'}</span>
                    </div>
                </div>

                {/* Botón de Acción Dinámico */}
                <button
                    onClick={handleStartMetronome}
                    disabled={isBudgetError || isFormIncomplete || isProcessing}
                    className={`w-full font-extrabold py-4 px-6 rounded-lg transition-all transform flex items-center justify-center gap-2 ${isBudgetError || isFormIncomplete ? 'bg-white/5 text-textMuted cursor-not-allowed' : isProcessing ? 'bg-brandPrimary/70 text-bgMain cursor-wait scale-[0.98]' : 'bg-brandPrimary text-bgMain hover:bg-white hover:scale-[1.02] shadow-[0_0_20px_rgba(255,204,0,0.3)]'}`}
                >
                    {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isBudgetError ? 'INVALID CONFIGURATION' : isFormIncomplete ? 'FILL ALL FIELDS' : buttonText}
                </button>

                <p className="text-center text-[11px] text-textMuted flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    You can monitor or withdraw your position anytime.
                </p>
            </div>
        </div>
    );
}