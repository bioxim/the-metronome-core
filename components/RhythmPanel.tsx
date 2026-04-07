"use client";

import { useState } from 'react';
import { Calculator, ArrowDownCircle, TrendingUp, Equal, List } from 'lucide-react';

export default function RhythmPanel() {
    const [mode, setMode] = useState<'fixed' | 'crescendo'>('fixed');
    const [growthType, setGrowthType] = useState<'amount' | 'percent'>('amount');

    return (
        <div className="bg-bgSecondary border border-white/10 rounded-xl p-6 shadow-2xl flex flex-col gap-5">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-white">Rhythm Configuration</h2>
                <div className="flex bg-bgMain rounded-lg p-1 border border-white/5">
                    <button
                        onClick={() => setMode('fixed')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'fixed' ? 'bg-white/10 text-brandPrimary' : 'text-textMuted'}`}
                    >
                        <Equal className="w-3 h-3" /> Fixed
                    </button>
                    <button
                        onClick={() => setMode('crescendo')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${mode === 'crescendo' ? 'bg-white/10 text-brandPrimary' : 'text-textMuted'}`}
                    >
                        <TrendingUp className="w-3 h-3" /> Crescendo
                    </button>
                </div>
            </div>

            {/* INPUTS PRINCIPALES */}
            <div className="grid grid-cols-1 gap-4">
                {/* Total Deposit */}
                <div className="bg-bgMain p-4 rounded-lg border border-white/5">
                    <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Total Deposit (USDC)</label>
                    <input type="number" placeholder="100.00" className="bg-transparent text-xl font-mono text-white outline-none w-full" />
                </div>

                {/* Growth Logic (Solo si es Crescendo) */}
                {mode === 'crescendo' && (
                    <div className="bg-bgMain/50 p-4 rounded-lg border border-brandPrimary/20 animate-in fade-in slide-in-from-top-2">
                        <label className="text-[10px] text-brandPrimary font-bold uppercase block mb-3">Growth Step</label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input type="number" placeholder={growthType === 'amount' ? "+2.00" : "+1%"} className="bg-bgMain p-2 rounded border border-white/10 text-white w-full font-mono text-sm" />
                            </div>
                            <select
                                onChange={(e) => setGrowthType(e.target.value as any)}
                                className="bg-bgMain text-white text-xs p-2 rounded border border-white/10 outline-none"
                            >
                                <option value="amount">USDC</option>
                                <option value="percent">% per step</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* The Rhythm & Exit */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-bgMain p-4 rounded-lg border border-white/5">
                        <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Buy every (%)</label>
                        <input type="number" placeholder="-2.5%" className="bg-transparent text-lg font-mono text-brandPrimary outline-none w-full" />
                    </div>
                    <div className="bg-bgMain p-4 rounded-lg border border-white/5">
                        <label className="text-[10px] text-textMuted font-bold uppercase block mb-2">Exit at ROI (%)</label>
                        <input type="number" placeholder="+10%" className="bg-transparent text-lg font-mono text-green-400 outline-none w-full" />
                    </div>
                </div>
            </div>

            {/* Summary info */}
            <div className="text-xs text-textMuted flex justify-between px-1">
                <span>Estimated Orders: <b className="text-white">5</b></span>
                <span>Avg. Price Target: <b className="text-white">$142.50</b></span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
                <button className="flex-1 bg-brandPrimary text-bgMain font-extrabold py-4 rounded-lg hover:bg-white transition-all">
                    Start Metronome
                </button>
                <button className="bg-bgSecondary border border-white/10 p-4 rounded-lg hover:bg-white hover:text-bgMain transition-all">
                    <Calculator className="w-6 h-6" />
                </button>
            </div>

        </div>
    );
}