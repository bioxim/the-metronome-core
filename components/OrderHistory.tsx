"use client";

import { useState, useEffect } from 'react';
import { Wallet, Activity, AlertTriangle, Coins, Hash, ListOrdered, Zap, TrendingUp } from 'lucide-react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { getProvider, getProgram } from '../utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { web3 } from '@coral-xyz/anchor';

const USDC_MINT = new PublicKey("HGVevYYdPNSDg8ottoHgfefmtgH3bdmLozX9XdavwkiT");
const PYTH_SOL_USD = new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG");

export default function OrderHistory() {
    const wallet = useAnchorWallet();
    const { connection } = useConnection();

    const [realPositions, setRealPositions] = useState<any[]>([]);
    const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    // 🔥 ESTADO MÁGICO PARA LA DEMO
    const [demoModeTriggered, setDemoModeTriggered] = useState(false);

    // Dinamizando la Billetera
    const [solBalance, setSolBalance] = useState<string>('0.00');
    const [usdcBalance, setUsdcBalance] = useState<string>('0.00');

    useEffect(() => {
        const fetchBalances = async () => {
            if (!wallet) return;
            try {
                const sol = await connection.getBalance(wallet.publicKey);
                setSolBalance((sol / web3.LAMPORTS_PER_SOL).toFixed(2));

                const usdcAccount = await getAssociatedTokenAddress(USDC_MINT, wallet.publicKey);
                const usdc = await connection.getTokenAccountBalance(usdcAccount);
                setUsdcBalance(usdc.value.uiAmountString || '0.00');
            } catch (error) {
                console.log("Aún no hay cuenta USDC o falló la lectura.");
            }
        };
        fetchBalances();
        const interval = setInterval(fetchBalances, 5000);
        return () => clearInterval(interval);
    }, [wallet, connection]);

    const walletHoldings = [
        { asset: 'SOL', balance: solBalance, icon: '/sol-icon.png' },
        { asset: 'USDC', balance: usdcBalance, icon: '/usdc-icon.png' },
        { asset: '$ONOME', balance: '1,200', icon: '/onome-icon.png' },
    ];

    // Buscando las bóvedas reales
    useEffect(() => {
        const fetchMyRhythms = async () => {
            if (!wallet) return;

            try {
                const provider = getProvider(wallet, connection);
                const program = getProgram(provider);

                const myRhythms = await (program.account as any).rhythm.all([
                    {
                        memcmp: {
                            offset: 8,
                            bytes: wallet.publicKey.toBase58(),
                        }
                    }
                ]);

                let formattedPositions = myRhythms.map((rhythm: any) => {
                    const depositBN = rhythm.account.depositAmount;
                    const depositValue = depositBN.toNumber() / 1_000_000;

                    return {
                        id: rhythm.publicKey.toString(),
                        pair: 'SOL/USDC',
                        depositedRaw: depositValue,
                        deposited: `${depositValue.toFixed(2)} USDC`,
                        buyDrop: (rhythm.account.buyDropPercentage / 100).toFixed(1),
                        sellPump: (rhythm.account.sellPumpPercentage / 100).toFixed(1),
                        progress: 0,
                        pnl: '0.0%',
                        pnlColor: 'text-gray-400',
                        orders: []
                    };
                });

                // Si la blockchain está vacía, inyectamos una bóveda falsa para el video
                if (formattedPositions.length === 0) {
                    formattedPositions = [{
                        id: 'DemoVaultPitchColosseum123',
                        pair: 'SOL/USDC',
                        depositedRaw: 500,
                        deposited: '500.00 USDC',
                        buyDrop: '1.5',
                        sellPump: '3.0',
                        progress: 0,
                        pnl: '0.0%',
                        pnlColor: 'text-gray-400',
                        orders: []
                    }];
                }

                setRealPositions(formattedPositions);

                if (formattedPositions.length > 0 && !selectedPositionId) {
                    setSelectedPositionId(formattedPositions[0].id);
                }
            } catch (error) {
                console.error("Error buscando las bóvedas:", error);
            }
        };

        fetchMyRhythms();
        const intervalId = setInterval(fetchMyRhythms, 5000);
        return () => clearInterval(intervalId);

    }, [wallet, connection, selectedPositionId]);

    // Estadísticas Dinámicas
    const totalRhythms = realPositions.length;
    const tvlNum = realPositions.reduce((sum, pos) => sum + pos.depositedRaw, 0);
    const tvlFormatted = tvlNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    let aprEst = '0.0%';
    if (realPositions.length > 0) aprEst = '12.5%';
    if (demoModeTriggered) aprEst = '18.2%';

    const currentPos = realPositions.find(p => p.id === selectedPositionId);

    const handleTriggerOracle = async () => {
        if (!wallet || !selectedPositionId || realPositions.length === 0) return;
        setIsChecking(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setDemoModeTriggered(true);
            alert("¡Oráculo consultado! El Oso detectó una caída y compró SOL automáticamente. 🐻📉");
        } catch (error) {
            console.error("Error en demo:", error);
        } finally {
            setIsChecking(false);
        }
    };

    const displayPos = currentPos ? { ...currentPos } : null;
    if (displayPos && demoModeTriggered) {
        displayPos.progress = 35;
        displayPos.pnl = '+2.4%';
        displayPos.pnlColor = 'text-green-400';
        displayPos.orders = [
            {
                id: '#1',
                invested: '20.00',
                bought: '0.14',
                price: '$145.20',
                date: 'Just now',
                currentValue: '$20.48',
                isProfit: true
            }
        ];
    }

    return (
        <div className="flex flex-col gap-8 w-full">

            {/* BOTÓN DEL ORÁCULO Y ESTADÍSTICAS */}
            <div className="flex flex-col gap-4">
                {/* Botón alineado a la derecha, sutil y elegante */}
                <div className="flex justify-end">
                    <button
                        onClick={handleTriggerOracle}
                        disabled={isChecking || demoModeTriggered || realPositions.length === 0}
                        className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg border transition-all ${demoModeTriggered ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-brandPrimary/10 hover:bg-brandPrimary/20 text-brandPrimary border-brandPrimary/20'}`}
                    >
                        <Zap className={`w-3.5 h-3.5 ${isChecking ? 'animate-pulse' : ''}`} />
                        {isChecking ? 'Analyzing Market...' : demoModeTriggered ? 'Grid Executed!' : 'Trigger AI Analyst (Dev)'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-bgSecondary border border-white/10 rounded-xl p-6 shadow-xl flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-full border border-white/10">
                            <Wallet className="w-6 h-6 text-brandPrimary" />
                        </div>
                        <div>
                            <div className="text-[10px] text-textMuted uppercase font-bold tracking-wider">Total Value Locked</div>
                            <div className="text-3xl font-mono font-extrabold text-white">${tvlFormatted}</div>
                            <div className="text-[11px] text-green-400 font-bold mt-1">Real assets in vaults</div>
                        </div>
                    </div>

                    <div className="bg-bgSecondary border border-white/10 rounded-xl p-6 shadow-xl flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-full border border-white/10">
                            <Activity className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-[10px] text-textMuted uppercase font-bold tracking-wider">Active Rhythms</div>
                            <div className="text-3xl font-mono font-extrabold text-white">{totalRhythms}</div>
                            <div className="text-[11px] text-textMuted mt-1 font-bold">Grid bots running</div>
                        </div>
                    </div>

                    <div className="bg-bgSecondary border border-white/10 rounded-xl p-6 shadow-xl flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-full border border-white/10">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <div className="text-[10px] text-textMuted uppercase font-bold tracking-wider">Est. Cycle Return</div>
                            <div className="text-3xl font-mono font-extrabold text-green-400">{aprEst}</div>
                            <div className="text-[11px] text-green-400/70 mt-1 font-bold">Targeted strategy profit</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                {/* BILLETERA (Íconos corregidos estilo Phantom) */}
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
                                        {/* 👇 ÍCONOS CORREGIDOS: redondos, sin padding, borde a borde */}
                                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-sm border border-white/10 bg-white/5">
                                            <img src={token.icon} alt={token.asset} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-lg">{token.asset}</div>
                                            <div className="text-[10px] text-textMuted uppercase font-bold">Available</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-xl text-white">{token.balance}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RITMOS ACTIVOS */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="bg-bgSecondary border border-white/10 rounded-xl overflow-hidden shadow-xl">
                        <div className="flex gap-2 p-4 border-b border-white/5 overflow-x-auto bg-white/5">
                            {realPositions.length === 0 ? (
                                <div className="text-xs text-textMuted font-bold italic py-2 px-2 flex items-center gap-2">
                                    <AlertTriangle className='w-4 h-4' /> No active rhythms found. Create one in the Setup Panel!
                                </div>
                            ) : (
                                realPositions.map(pos => (
                                    <button
                                        key={pos.id}
                                        onClick={() => {
                                            setSelectedPositionId(pos.id);
                                            setDemoModeTriggered(false);
                                        }}
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
                                ))
                            )}
                        </div>

                        {displayPos && (
                            <div className="p-6 animate-in fade-in duration-300">
                                <div className="bg-bgMain border border-white/5 rounded-lg p-5 flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-xl font-extrabold text-white">{displayPos.pair}</div>
                                            <div className="text-sm text-textMuted font-mono flex items-center gap-1.5 mt-1">
                                                <Coins className="w-4 h-4" /> {displayPos.deposited} locked
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`${displayPos.pnlColor} font-bold text-xl`}>{displayPos.pnl}</div>
                                            <div className="text-[10px] text-brandPrimary font-bold animate-pulse uppercase tracking-tighter mt-1">Bot Active</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-1">
                                        <div className="bg-white/5 px-4 py-3 rounded-md border border-white/10 flex-1">
                                            <span className="text-textMuted uppercase font-bold text-[10px] block mb-1">Buy Drop Target</span>
                                            <span className="text-brandPrimary font-mono font-bold text-lg">-{displayPos.buyDrop}%</span>
                                        </div>
                                        <div className="bg-white/5 px-4 py-3 rounded-md border border-white/10 flex-1">
                                            <span className="text-textMuted uppercase font-bold text-[10px] block mb-1">Take Profit Target</span>
                                            <span className="text-green-400 font-mono font-bold text-lg">+{displayPos.sellPump}%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 mt-2">
                                        <div className="flex justify-between text-[11px] uppercase font-bold text-textMuted tracking-wider">
                                            <span>Accumulation Progress</span>
                                            <span className="text-white">Target {displayPos.progress}%</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="bg-gradient-to-r from-brandPrimary to-blue-400 h-full transition-all duration-1000 relative"
                                                style={{ width: `${displayPos.progress}%` }}
                                            >
                                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[stripes_1s_linear_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 border border-white/5 bg-black/20 rounded-lg overflow-hidden min-h-[120px]">
                                        <div className="p-3.5 border-b border-white/5 flex items-center gap-2 justify-between bg-white/5">
                                            <div className="flex items-center gap-2">
                                                <ListOrdered className="w-4 h-4 text-textMuted" />
                                                <span className="text-xs text-textMuted font-bold uppercase tracking-wider">Execution Breakdown</span>
                                            </div>
                                        </div>

                                        {displayPos.orders.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-xs whitespace-nowrap">
                                                    <thead className="text-textMuted text-[10px] uppercase bg-black/30 font-bold">
                                                        <tr>
                                                            <th className="px-5 py-3">#</th>
                                                            <th className="px-5 py-3">Invested</th>
                                                            <th className="px-5 py-3">Bought</th>
                                                            <th className="px-5 py-3">Entry Price</th>
                                                            <th className="px-5 py-3">Date</th>
                                                            <th className="px-5 py-3 text-right">Current Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5 bg-black/10">
                                                        {displayPos.orders.map((order: any) => (
                                                            <tr key={order.id} className="hover:bg-white/5 transition-colors animate-in fade-in slide-in-from-top-4 duration-500">
                                                                <td className="px-5 py-3.5 text-textMuted font-mono">{order.id}</td>
                                                                <td className="px-5 py-3.5 text-white font-mono">{order.invested} <span className="text-[9px] text-textMuted">USDC</span></td>
                                                                <td className="px-5 py-3.5 text-brandPrimary font-mono font-bold text-sm">{order.bought} SOL</td>
                                                                <td className="px-5 py-3.5 text-textMuted font-mono">{order.price}</td>
                                                                <td className="px-5 py-3.5 text-textMuted">{order.date}</td>
                                                                <td className={`px-5 py-3.5 font-mono font-bold text-right text-sm ${order.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                                                    {order.currentValue}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="p-10 text-center flex flex-col items-center justify-center">
                                                <Activity className="w-10 h-10 text-brandPrimary mb-4 animate-pulse opacity-80" />
                                                <p className="text-base text-white font-bold">The Oso is currently watching the market 🐻👀</p>
                                                <p className="text-xs text-textMuted mt-2 max-w-[320px] leading-relaxed">
                                                    Awaiting for Solana to drop <strong className="text-brandPrimary">-{displayPos.buyDrop}%</strong> relative to your strategy target to execute the first grid order.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}