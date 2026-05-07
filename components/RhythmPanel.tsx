"use client";

import { useState, useEffect } from "react";
import { Equal, TrendingUp, ShieldCheck, AlertCircle, Calculator, Brain, Loader2, Bot, X } from "lucide-react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getProvider, getProgram } from '../utils/anchor';
import { BN, web3 } from '@coral-xyz/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountIdempotentInstruction } from '@solana/spl-token';
import Link from "next/link";

const USDC_MINT = new PublicKey("HGVevYYdPNSDg8ottoHgfefmtgH3bdmLozX9XdavwkiT");

export default function RhythmPanel() {
    const [showSetupVideo, setShowSetupVideo] = useState(false);

    const [mode, setMode] = useState<'fixed' | 'crescendo'>('fixed');
    const [totalBudget, setTotalBudget] = useState<number | ''>('');
    const [buyDropPercent, setBuyDropPercent] = useState<number | ''>('');
    const [buyAmount, setBuyAmount] = useState<number | ''>('');
    const [crescendoIncrease, setCrescendoIncrease] = useState<number | ''>('');
    const [takeProfitPercent, setTakeProfitPercent] = useState<number | ''>('');

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
            const provider = getProvider(wallet, connection);
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

            const initInstruction = await program.methods.initializeRhythm(
                rhythmId, new BN(numBudget), Math.floor(numDrop), Math.floor(numProfit)
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

            const PYTH_SOL_USD = new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG");
            const checkInstruction = await program.methods.checkAndExecute()
                .accounts({ rhythmAccount: rhythmPDA, pythOracle: PYTH_SOL_USD })
                .instruction();

            transaction.add(checkInstruction);

            const signature = await provider.sendAndConfirm(transaction);
            console.log("¡Éxito! Firma:", signature);

            setButtonText("VAULT CREATED! 🚀");
            setTimeout(() => {
                setButtonText("START METRONOME");
                setIsProcessing(false);
                setTotalBudget(''); setBuyAmount(''); setBuyDropPercent(''); setTakeProfitPercent('');
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
                        <button
                            onClick={() => setShowSetupVideo(false)}
                            className="absolute -top-3 -right-3 bg-bgMain border border-white/10 rounded-full p-1.5 text-textMuted hover:text-white transition-colors z-40"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <video
                            src="https://www.w3schools.com/html/mov_bbb.mp4"
                            autoPlay
                            loop
                            controls
                            className="w-full rounded-xl border border-white/10"
                        />
                        <div className="p-3 text-center">
                            <p className="text-sm font-bold text-white">Rhythm Setup Guide</p>
                            <p className="text-xs text-brandPrimary mt-1">Kirk explains step-by-step.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER EN 2 LÍNEAS EXACTAS */}
            <div className="mb-6">
                {/* Línea 1: Título y botón Help */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                        🎛️ Setup Rhythm
                    </h2>
                    <button
                        onClick={() => setShowSetupVideo(true)}
                        className="bg-brandPrimary/10 text-brandPrimary hover:bg-brandPrimary hover:text-bgMain px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                    >
                        <Bot className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Help</span>
                    </button>
                </div>

                {/* Línea 2: Tools (Calc / Oracle) separadas por una línea sutil */}
                <div className="flex gap-4 text-xs font-medium border-t border-white/5 pt-3">
                    <Link href="/tools/calculator" className="flex items-center gap-1.5 text-brandPrimary hover:text-white transition-colors">
                        <Calculator className="w-3.5 h-3.5" /> Yield Calc
                    </Link>
                    <Link href="/tools/oracle" className="flex items-center gap-1.5 text-purple-400 hover:text-white transition-colors">
                        <Brain className="w-3.5 h-3.5" /> AI Oracle
                    </Link>
                </div>
            </div>

            {/* Solapas de Modo */}
            <div className="flex bg-bgMain rounded-lg p-1 border border-white/5 mb-6 w-fit">
                <button
                    onClick={() => setMode('fixed')}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-md transition-all ${mode === 'fixed' ? 'bg-white/10 text-brandPrimary shadow' : 'text-textMuted hover:text-white'}`}
                >
                    <Equal className="w-3.5 h-3.5" /> Fixed
                </button>
                <button
                    onClick={() => setMode('crescendo')}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-md transition-all ${mode === 'crescendo' ? 'bg-white/10 text-purple-400 shadow' : 'text-textMuted hover:text-white'}`}
                >
                    <TrendingUp className="w-3.5 h-3.5" /> Crescendo
                </button>
            </div>

            <div className="space-y-6">
                {/* Presupuesto Total con Balance */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-[10px] text-textMuted font-bold uppercase block">Total Budget (USDC)</label>
                        <span className="text-[10px] text-brandPrimary/70 italic font-light">
                            Available: {availableBalance.toLocaleString()} USDC
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            placeholder="e.g. 500"
                            value={totalBudget}
                            onChange={(e) => setTotalBudget(e.target.value ? Number(e.target.value) : '')}
                            className="w-full bg-bgMain border border-white/5 rounded-lg p-3 pr-16 text-lg font-mono text-white placeholder:text-white/20 focus:border-brandPrimary focus:outline-none transition-colors"
                        />
                        <button
                            onClick={handleMaxBudget}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-brandPrimary/10 text-brandPrimary px-2 py-1 rounded hover:bg-brandPrimary/20 transition-colors"
                        >
                            MAX
                        </button>
                    </div>
                </div>

                {/* Estrategia de Compra */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Buy Drop (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="e.g. 2.5"
                            value={buyDropPercent}
                            onChange={(e) => setBuyDropPercent(e.target.value ? Number(e.target.value) : '')}
                            className="w-full bg-bgMain border border-white/5 rounded-lg p-3 text-lg font-mono text-brandPrimary placeholder:text-brandPrimary/20 focus:border-brandPrimary focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Base Buy (USDC)</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="e.g. 50"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value ? Number(e.target.value) : '')}
                            className={`w-full bg-bgMain border rounded-lg p-3 text-lg font-mono text-white placeholder:text-white/20 focus:outline-none transition-colors ${isBudgetError ? 'border-red-500 text-red-400 focus:border-red-500' : 'border-white/5 focus:border-brandPrimary'}`}
                        />
                    </div>
                </div>

                {isBudgetError && (
                    <p className="text-red-400 text-[11px] flex items-center gap-1 mt-[-10px] font-bold">
                        <AlertCircle className="w-3 h-3" /> Base buy cannot exceed total budget.
                    </p>
                )}

                {/* Estrategia de Venta */}
                <div>
                    <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Exit at ROI (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="e.g. 15.0"
                        value={takeProfitPercent}
                        onChange={(e) => setTakeProfitPercent(e.target.value ? Number(e.target.value) : '')}
                        className="w-full bg-bgMain border border-white/5 rounded-lg p-3 text-lg font-mono text-green-400 placeholder:text-green-400/20 focus:border-green-400 focus:outline-none transition-colors"
                    />
                </div>

                {/* Feedback Box */}
                <div className={`bg-bgMain p-4 rounded-lg border border-white/5 text-xs text-textMuted space-y-2 transition-opacity ${isFormIncomplete ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="flex justify-between">
                        <span>Estimated Orders:</span>
                        <span className={`font-mono font-bold ${maxPurchases === 0 ? 'text-textMuted' : 'text-white'}`}>
                            {maxPurchases || '-'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span>Target Profit:</span>
                        <span className="font-mono text-green-400 font-bold text-sm">
                            {numProfit > 0 ? `+$${maxEstimatedProfit} USDC` : '-'}
                        </span>
                    </div>
                    <div className="flex justify-between pt-1">
                        <span>Projected Rewards:</span>
                        <span className="font-mono text-brandPrimary font-bold">
                            {numBudget > 0 ? `+${projectedOnomeRewards} $ONOME` : '-'}
                        </span>
                    </div>
                </div>

                {/* Botón de Acción Dinámico */}
                <button
                    onClick={handleStartMetronome}
                    disabled={isBudgetError || isFormIncomplete || isProcessing}
                    className={`w-full font-extrabold py-4 px-6 rounded-lg transition-all transform flex items-center justify-center gap-2 ${isBudgetError || isFormIncomplete
                        ? 'bg-white/5 text-textMuted cursor-not-allowed'
                        : isProcessing
                            ? 'bg-brandPrimary/70 text-bgMain cursor-wait scale-[0.98]'
                            : 'bg-brandPrimary text-bgMain hover:bg-white hover:scale-[1.02] shadow-[0_0_20px_rgba(255,204,0,0.3)]'
                        }`}
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