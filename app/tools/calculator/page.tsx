"use client";

import Header from '@/components/Header';
import { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, ArrowLeft, Activity, Target } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorPage() {
    // Nuevos estados basados en OBJETIVOS (Targets) y no en tiempo
    const [initialCapital, setInitialCapital] = useState(1000);
    const [buyDrop, setBuyDrop] = useState(5); // Comprar cuando cae 5%
    const [sellPump, setSellPump] = useState(10); // Vender cuando sube 10%
    const [volatility, setVolatility] = useState<'low' | 'medium' | 'high'>('medium');

    // Función que simula el algoritmo de The Metronome
    const calculateRhythmYield = () => {
        // Asignamos un "Índice de Movimiento de Mercado" arbitrario para la simulación anual
        // Alta volatilidad = más cruces de precio = más ciclos ejecutados
        const marketMovementIndex = volatility === 'high' ? 250 : volatility === 'medium' ? 120 : 60;

        // ¿Cuántos ciclos enteros (Compra + Venta) puede ejecutar el mercado en un año?
        // Si el usuario pone márgenes muy grandes (ej. comprar a -20% y vender a +30%), se ejecutan menos ciclos.
        const requiredMovementPerCycle = buyDrop + sellPump;
        const estimatedCycles = Math.floor(marketMovementIndex / requiredMovementPerCycle);

        // Si los objetivos son irreales y no llega ni a 1 ciclo
        if (estimatedCycles < 1) {
            return { principal: initialCapital, futureValue: initialCapital, profit: 0, cycles: 0 };
        }

        // Interés compuesto por cada ciclo cerrado exitosamente
        const ratePerCycle = sellPump / 100;
        const futureValue = initialCapital * Math.pow((1 + ratePerCycle), estimatedCycles);
        const profit = futureValue - initialCapital;

        return { principal: initialCapital, futureValue, profit, cycles: estimatedCycles };
    };

    const stats = calculateRhythmYield();

    return (
        <div className="min-h-screen bg-bgMain text-textMain pb-10 pt-12">
            <Header />
            <div className="max-w-4xl mx-auto px-4 xl:px-0">

                <Link href="/tools" className="inline-flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Tools
                </Link>

                <div className="bg-bgSecondary border border-white/10 rounded-2xl flex flex-col lg:flex-row shadow-2xl overflow-hidden">

                    {/* CONTROLES DEL SIMULADOR (Lado Izquierdo) */}
                    <div className="flex-1 p-8 border-b lg:border-b-0 lg:border-r border-white/10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-[#8b5cf6]/10 rounded-xl flex items-center justify-center">
                                <Activity className="w-6 h-6 text-[#8b5cf6]" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Rhythm Simulator</h1>
                                <p className="text-sm text-textMuted">Algorithmic target-based execution</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            {/* Volatilidad */}
                            <div>
                                <label className="block text-sm font-bold text-textMuted mb-3">Estimated Market Volatility</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['low', 'medium', 'high'].map((v) => (
                                        <button
                                            key={v}
                                            onClick={() => setVolatility(v as any)}
                                            className={`py-2 rounded-lg text-sm font-bold capitalize transition-colors ${volatility === v
                                                    ? 'bg-[#8b5cf6] text-white'
                                                    : 'bg-bgMain border border-white/10 text-textMuted hover:border-[#8b5cf6]/50'
                                                }`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Capital */}
                            <div>
                                <div className="flex justify-between mb-3">
                                    <label className="text-sm font-bold text-textMuted">Allocated Capital</label>
                                    <span className="text-white font-mono text-lg">${initialCapital.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range" min="100" max="10000" step="100"
                                    value={initialCapital}
                                    onChange={(e) => setInitialCapital(Number(e.target.value))}
                                    className="w-full accent-[#8b5cf6] cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                                />
                            </div>

                            {/* Drop Target */}
                            <div>
                                <div className="flex justify-between mb-3">
                                    <label className="text-sm font-bold text-textMuted flex items-center gap-2">
                                        <Target className="w-4 h-4 text-brandPrimary" /> Buy Rhythm (Drop %)
                                    </label>
                                    <span className="text-brandPrimary font-mono text-lg">-{buyDrop}%</span>
                                </div>
                                <input
                                    type="range" min="1" max="30" step="1"
                                    value={buyDrop}
                                    onChange={(e) => setBuyDrop(Number(e.target.value))}
                                    className="w-full accent-brandPrimary cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                                />
                            </div>

                            {/* Pump Target */}
                            <div>
                                <div className="flex justify-between mb-3">
                                    <label className="text-sm font-bold text-textMuted flex items-center gap-2">
                                        <Target className="w-4 h-4 text-[#10b981]" /> Sell Rhythm (Take Profit)
                                    </label>
                                    <span className="text-[#10b981] font-mono text-lg">+{sellPump}%</span>
                                </div>
                                <input
                                    type="range" min="1" max="50" step="1"
                                    value={sellPump}
                                    onChange={(e) => setSellPump(Number(e.target.value))}
                                    className="w-full accent-[#10b981] cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RESULTADOS (Lado Derecho) */}
                    <div className="flex-1 p-8 bg-gradient-to-br from-bgSecondary to-bgMain flex flex-col justify-center">
                        <div className="mb-8">
                            <span className="text-sm font-bold text-textMuted flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5" /> Est. Value (1 Year Horizon)
                            </span>
                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brandPrimary to-[#8b5cf6]">
                                ${stats.futureValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-6 border-y border-white/10 py-6 mb-8">
                            <div>
                                <span className="block text-sm text-textMuted mb-2">Cycles Executed</span>
                                <span className="text-white font-mono text-2xl">{stats.cycles}</span>
                            </div>
                            <div>
                                <span className="block text-sm text-textMuted mb-2">Net Profit</span>
                                <span className="text-[#10b981] font-mono text-2xl">+${stats.profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-brandPrimary/10 border border-brandPrimary/20 text-brandPrimary p-4 rounded-xl text-sm leading-relaxed">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>
                                The Metronome ignores time. It purely reacts to price targets. Setting tighter margins in high-volatility markets accelerates compounding cycles.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}