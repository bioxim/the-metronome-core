"use client";

import { useState } from "react";
import { Equal, TrendingUp, ShieldCheck, AlertCircle } from "lucide-react";

export default function RhythmPanel() {
    // 1. Estados
    const [mode, setMode] = useState<'fixed' | 'crescendo'>('fixed');
    const [totalBudget, setTotalBudget] = useState<number>(100);
    const [buyDropPercent, setBuyDropPercent] = useState<number>(1.5);
    const [buyAmount, setBuyAmount] = useState<number>(20);
    const [crescendoIncrease, setCrescendoIncrease] = useState<number>(2);
    const [takeProfitPercent, setTakeProfitPercent] = useState<number>(15.0);

    // 2. Validaciones de Seguridad
    const isBudgetError = buyAmount > totalBudget;

    // 3. Matemática en tiempo real
    const projectedOnomeRewards = Math.floor(totalBudget / 10);
    const maxEstimatedProfit = (totalBudget * (takeProfitPercent / 100)).toFixed(2);

    let maxPurchases = 0;
    if (buyAmount > 0 && !isBudgetError) {
        if (mode === 'fixed') {
            maxPurchases = Math.floor(totalBudget / buyAmount);
        } else {
            let currentBudget = totalBudget;
            let currentBuy = buyAmount;
            while (currentBudget >= currentBuy) {
                maxPurchases++;
                currentBudget -= currentBuy;
                currentBuy += crescendoIncrease;
            }
        }
    }

    // 4. El Disparador
    const handleStartMetronome = () => {
        if (isBudgetError) return;

        console.log("🚀 Starting Rhythm with:", {
            mode, totalBudget, buyDropPercent, buyAmount,
            crescendoIncrease: mode === 'crescendo' ? crescendoIncrease : 0,
            takeProfitPercent,
        });
        alert(`Rhythm ready! Projected rewards: +${projectedOnomeRewards} $ONOME`);
    };

    return (
        <div className="bg-bgSecondary border border-white/10 rounded-xl p-6 shadow-2xl flex flex-col gap-6 w-full">

            {/* HEADER: Título principal y Solapas */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <span>🎛️</span> Create
                </h2>

                {/* Contenedor de solapas sin que empuje los márgenes (shrink-0) */}
                <div className="flex bg-bgMain rounded-lg p-1 border border-white/5 shrink-0">
                    <button
                        onClick={() => setMode('fixed')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'fixed' ? 'bg-white/10 text-brandPrimary shadow' : 'text-textMuted hover:text-white'
                            }`}
                    >
                        <Equal className="w-3 h-3" /> Fixed
                    </button>
                    <button
                        onClick={() => setMode('crescendo')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'crescendo' ? 'bg-white/10 text-purple-400 shadow' : 'text-textMuted hover:text-white'
                            }`}
                    >
                        <TrendingUp className="w-3 h-3" /> Crescendo
                    </button>
                </div>
            </div>

            <div className="space-y-5">
                {/* Presupuesto Total */}
                <div>
                    <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Total Budget (USDC)</label>
                    <input
                        type="number"
                        min="0"
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(Number(e.target.value))}
                        className="w-full bg-bgMain border border-white/5 rounded-lg p-3 text-lg font-mono text-white focus:border-brandPrimary focus:outline-none transition-colors"
                    />
                </div>

                {/* Estrategia de Compra */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Buy Drop (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={buyDropPercent}
                            onChange={(e) => setBuyDropPercent(Number(e.target.value))}
                            className="w-full bg-bgMain border border-white/5 rounded-lg p-3 text-lg font-mono text-brandPrimary focus:border-brandPrimary focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Base Buy (USDC)</label>
                        <input
                            type="number"
                            min="0"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(Number(e.target.value))}
                            className={`w-full bg-bgMain border rounded-lg p-3 text-lg font-mono text-white focus:outline-none transition-colors ${isBudgetError ? 'border-red-500 text-red-400 focus:border-red-500' : 'border-white/5 focus:border-brandPrimary'
                                }`}
                        />
                    </div>
                </div>

                {/* Mensaje de Error (Base Buy > Budget) */}
                {isBudgetError && (
                    <p className="text-red-400 text-[11px] flex items-center gap-1 mt-[-10px] font-bold">
                        <AlertCircle className="w-3 h-3" />
                        Base buy cannot exceed total budget.
                    </p>
                )}

                {/* Input Dinámico: Crescendo (Encapsulado para evitar salientes) */}
                {mode === 'crescendo' && !isBudgetError && (
                    <div className="w-full animate-in fade-in slide-in-from-top-2 duration-300 bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 mt-2 overflow-hidden">
                        <label className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1 mb-2">
                            <TrendingUp className="w-3 h-3" /> Step Increase (USDC)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={crescendoIncrease}
                            onChange={(e) => setCrescendoIncrease(Number(e.target.value))}
                            className="w-full bg-bgMain/50 border border-purple-500/50 rounded-lg p-3 text-lg font-mono text-white focus:border-purple-400 focus:outline-none transition-colors"
                        />
                        <p className="text-[11px] text-textMuted mt-2 leading-relaxed">
                            Next buys will be: <span className="font-mono text-purple-300 font-bold">{buyAmount + crescendoIncrease}</span> USDC, then <span className="font-mono text-purple-300 font-bold">{buyAmount + (crescendoIncrease * 2)}</span> USDC...
                        </p>
                    </div>
                )}

                {/* Estrategia de Venta */}
                <div>
                    <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Exit at ROI (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={takeProfitPercent}
                        onChange={(e) => setTakeProfitPercent(Number(e.target.value))}
                        className="w-full bg-bgMain border border-white/5 rounded-lg p-3 text-lg font-mono text-green-400 focus:border-green-400 focus:outline-none transition-colors"
                    />
                </div>

                {/* Feedback y Transparencia */}
                <div className="bg-bgMain p-4 rounded-lg border border-white/5 text-xs text-textMuted space-y-2">
                    <div className="flex justify-between">
                        <span>Estimated Orders:</span>
                        <span className={`font-mono font-bold ${maxPurchases === 0 ? 'text-red-400' : 'text-white'}`}>
                            {maxPurchases}
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span>Target Profit:</span>
                        <span className="font-mono text-green-400 font-bold text-sm">+${maxEstimatedProfit} USDC</span>
                    </div>
                    <div className="flex justify-between pt-1">
                        <span>Projected Rewards:</span>
                        <span className="font-mono text-brandPrimary font-bold">+{projectedOnomeRewards} $ONOME</span>
                    </div>
                </div>

                {/* Botón de Acción */}
                <button
                    onClick={handleStartMetronome}
                    disabled={isBudgetError}
                    className={`w-full font-extrabold py-4 px-6 rounded-lg transition-all transform ${isBudgetError
                            ? 'bg-white/5 text-textMuted cursor-not-allowed'
                            : 'bg-brandPrimary text-bgMain hover:bg-white hover:scale-[1.02] shadow-lg shadow-brandPrimary/20'
                        }`}
                >
                    {isBudgetError ? 'INVALID CONFIGURATION' : 'START METRONOME'}
                </button>

                {/* Leyenda de Seguridad */}
                <p className="text-center text-[11px] text-textMuted flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    You can monitor or withdraw your position anytime from the Dashboard.
                </p>
            </div>
        </div>
    );
}