"use client";

import { useState } from 'react';
import { CheckCircle2, Wallet, Activity, ArrowUpRight, AlertTriangle, Coins, Hash, ListOrdered } from 'lucide-react';

export default function OrderHistory() {
    // 1. MOCK DATA: Tenencias
    const walletHoldings = [
        { asset: 'SOL', balance: '12.45', valueUsdc: '1,805.25', icon: '☀️' },
        { asset: 'USDC', balance: '450.00', valueUsdc: '450.00', icon: '💵' },
        { asset: '$ONOME', balance: '1,200', valueUsdc: '120.00', icon: '🎵' },
    ];

    // 2. MOCK DATA: Múltiples Posiciones Activas con DESGLOSE DE ÓRDENES
    const activePositions = [
        {
            id: '8fA2bC99',
            pair: 'SOL/USDC',
            deposited: '100 USDC',
            progress: 65,
            bought: '0.425 SOL',
            pnl: '+4.2%',
            pnlColor: 'text-green-400',
            // NUEVO: Historial de compras para esta posición específica
            orders: [
                { id: 1, invested: '20.00', bought: '0.137', price: '$145.20', date: 'Apr 03', currentValue: '$21.50', isProfit: true },
                { id: 2, invested: '20.00', bought: '0.140', price: '$142.10', date: 'Apr 04', currentValue: '$21.95', isProfit: true },
                { id: 3, invested: '20.00', bought: '0.148', price: '$135.00', date: 'Apr 05', currentValue: '$23.20', isProfit: true },
            ]
        },
        {
            id: '3xP9mQ12',
            pair: 'BTC/USDC',
            deposited: '500 USDC',
            progress: 20,
            bought: '0.0014 BTC',
            pnl: '-1.1%',
            pnlColor: 'text-red-400',
            orders: [
                { id: 1, invested: '100.00', bought: '0.0014', price: '$71,200', date: 'Apr 06', currentValue: '$98.90', isProfit: false },
            ]
        }
    ];

    const [selectedPositionId, setSelectedPositionId] = useState(activePositions[0].id);
    const currentPos = activePositions.find(p => p.id === selectedPositionId);

    // 3. MOCK DATA: Historial General
    const history = [
        { id: 1, type: 'Buy', amount: '20.00', asset: 'SOL', price: '$145.20', status: 'Completed', date: '2024-04-03' },
        { id: 2, type: 'Buy', amount: '20.00', asset: 'SOL', price: '$142.10', status: 'Completed', date: '2024-04-04' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">

            {/* COLUMNA IZQUIERDA: WALLET HOLDINGS */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-bgSecondary border border-white/10 rounded-xl overflow-hidden shadow-xl sticky top-6">
                    <div className="p-5 border-b border-white/10 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                            <Wallet className="w-5 h-5 text-brandPrimary" />
                            <h3 className="font-bold uppercase text-sm tracking-widest">Your Wallet</h3>
                        </div>
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold">Connected</span>
                    </div>

                    <div className="p-2">
                        {walletHoldings.map((token, index) => (
                            <div key={token.asset} className={`p-4 flex items-center justify-between hover:bg-white/5 transition-colors rounded-lg ${index !== walletHoldings.length - 1 ? 'border-b border-white/5' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-bgMain flex items-center justify-center text-lg border border-white/10">
                                        {token.icon}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{token.asset}</div>
                                        <div className="text-[10px] text-textMuted uppercase">Available</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold text-white">{token.balance}</div>
                                    <div className="text-xs text-textMuted">${token.valueUsdc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 bg-bgMain/50 border-t border-white/10">
                        <div className="text-[10px] text-textMuted uppercase font-bold mb-1">Est. Total Balance</div>
                        <div className="text-2xl font-mono font-extrabold text-brandPrimary">$2,375.25</div>
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: ACCIÓN Y RITMOS */}
            <div className="lg:col-span-2 flex flex-col gap-8">

                {/* SECCIÓN: ACTIVE RHYTHMS (CON SOLAPAS) */}
                <div className="bg-bgSecondary border border-white/10 rounded-xl overflow-hidden shadow-xl">
                    <div className="p-5 border-b border-white/10 bg-white/5 flex items-center gap-2 text-brandPrimary">
                        <Activity className="w-5 h-5" />
                        <h3 className="font-bold uppercase text-sm tracking-widest">Active Rhythms</h3>
                    </div>

                    {/* SOLAPAS */}
                    <div className="flex gap-2 p-4 border-b border-white/5 overflow-x-auto bg-bgMain/30">
                        {activePositions.map(pos => (
                            <button
                                key={pos.id}
                                onClick={() => setSelectedPositionId(pos.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${selectedPositionId === pos.id
                                        ? 'bg-brandPrimary text-bgMain border-brandPrimary shadow-lg shadow-brandPrimary/20'
                                        : 'bg-white/5 text-textMuted border-white/5 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <span>{pos.pair}</span>
                                <span className={`flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedPositionId === pos.id ? 'bg-bgMain/20 text-bgMain' : 'bg-black/40 text-textMuted'}`}>
                                    <Hash className="w-2.5 h-2.5 mr-0.5" />{pos.id.slice(0, 4)}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* CONTENIDO DE LA SOLAPA ACTIVA */}
                    {currentPos && (
                        <div className="p-6 animate-in fade-in duration-300">
                            <div className="bg-bgMain border border-white/5 rounded-lg p-5 flex flex-col gap-4">

                                {/* Resumen Superior */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-lg font-extrabold text-white">{currentPos.pair}</div>
                                        <div className="text-xs text-textMuted font-mono flex items-center gap-1 mt-1">
                                            <Coins className="w-3 h-3" /> {currentPos.deposited} locked
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`${currentPos.pnlColor} font-bold text-lg`}>{currentPos.pnl}</div>
                                        <div className="text-[10px] text-brandPrimary font-bold animate-pulse uppercase tracking-tighter mt-1">Bot Active</div>
                                    </div>
                                </div>

                                {/* Barra de Progreso (Mantenida por lo visual) */}
                                <div className="space-y-1.5 mt-2">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-textMuted">
                                        <span>Accumulation Progress</span>
                                        <span className="text-white">Target {currentPos.progress}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="bg-gradient-to-r from-brandPrimary to-blue-400 h-full transition-all duration-1000 relative"
                                            style={{ width: `${currentPos.progress}%` }}
                                        >
                                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[stripes_1s_linear_infinite]"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* NUEVO: TABLA DE DESGLOSE DE ÓRDENES */}
                                <div className="mt-4 border border-white/5 bg-black/20 rounded-lg overflow-hidden">
                                    <div className="p-3 border-b border-white/5 flex items-center gap-2">
                                        <ListOrdered className="w-3.5 h-3.5 text-textMuted" />
                                        <span className="text-[10px] text-textMuted font-bold uppercase tracking-wider">Execution Breakdown</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs whitespace-nowrap">
                                            <thead className="text-textMuted text-[9px] uppercase bg-white/5">
                                                <tr>
                                                    <th className="px-4 py-2 font-bold">#</th>
                                                    <th className="px-4 py-2 font-bold">Invested</th>
                                                    <th className="px-4 py-2 font-bold">Bought</th>
                                                    <th className="px-4 py-2 font-bold">Entry Price</th>
                                                    <th className="px-4 py-2 font-bold">Date</th>
                                                    <th className="px-4 py-2 font-bold text-right">Current Value</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {currentPos.orders.map(order => (
                                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-4 py-2.5 text-textMuted font-mono">{order.id}</td>
                                                        <td className="px-4 py-2.5 text-white font-mono">{order.invested} <span className="text-[9px] text-textMuted">USDC</span></td>
                                                        <td className="px-4 py-2.5 text-brandPrimary font-mono font-bold">{order.bought}</td>
                                                        <td className="px-4 py-2.5 text-textMuted font-mono">{order.price}</td>
                                                        <td className="px-4 py-2.5 text-textMuted">{order.date}</td>
                                                        <td className={`px-4 py-2.5 font-mono font-bold text-right ${order.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                                            {order.currentValue}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex gap-3 mt-2">
                                    <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-3 rounded-lg border border-white/10 transition-all">
                                        Adjust Strategy
                                    </button>
                                    <button className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold py-3 rounded-lg border border-red-500/20 transition-all flex items-center justify-center gap-2">
                                        <AlertTriangle className="w-3.5 h-3.5" /> Emergency Close (2% Fee)
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SECCIÓN: EXECUTION HISTORY (HISTÓRICO GENERAL) */}
                <div className="bg-bgSecondary border border-white/10 rounded-xl overflow-hidden shadow-xl opacity-90">
                    <div className="p-5 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-textMuted uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Global History
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-bgMain/50 text-textMuted uppercase text-[10px] font-bold">
                                <tr>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                                            <ArrowUpRight className="w-3 h-3 text-green-400" /> {order.type} {order.asset}
                                        </td>
                                        <td className="px-6 py-4 font-mono">{order.amount} USDC</td>
                                        <td className="px-6 py-4 font-mono text-textMuted">{order.price}</td>
                                        <td className="px-6 py-4 text-textMuted">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}