"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';

// MOCK DATA: Simulamos la acción del precio de SOL y dónde compró The Metronome
const mockData = [
    { time: '10:00', price: 150.00 },
    { time: '10:30', price: 148.50 },
    { time: '11:00', price: 145.20, buyPoint: 145.20 }, // Compra 1
    { time: '11:30', price: 146.00 },
    { time: '12:00', price: 142.10, buyPoint: 142.10 }, // Compra 2
    { time: '12:30', price: 139.50 },
    { time: '13:00', price: 135.00, buyPoint: 135.00 }, // Compra 3
    { time: '13:30', price: 138.00 },
    { time: '14:00', price: 142.00 },
    { time: '14:30', price: 148.00 },
    { time: '15:00', price: 155.00, sellPoint: 155.00 }, // Take Profit
];

// Tooltip personalizado para que se vea estilo DeFi
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-bgMain border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-textMuted text-xs mb-1">{data.time}</p>
                <p className="text-white font-mono font-bold text-lg">${data.price.toFixed(2)}</p>
                {data.buyPoint && <p className="text-brandPrimary text-xs font-bold mt-1">🤖 Bot Executed Buy</p>}
                {data.sellPoint && <p className="text-green-400 text-xs font-bold mt-1">🎯 Take Profit Hit</p>}
            </div>
        );
    }
    return null;
};

export default function RhythmChart() {
    return (
        <div className="w-full h-full min-h-[400px] flex flex-col">
            {/* Header del Gráfico */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-white font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-brandPrimary" /> Strategy Simulation
                    </h2>
                    <p className="text-xs text-textMuted mt-1">SOL/USDC - Metronome Crescendo Execution</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    <span className="text-xs font-bold text-green-400 animate-pulse">Live</span>
                </div>
            </div>

            {/* El Gráfico Interactivo */}
            <div className="flex-1 w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            {/* Gradiente de color para el fondo del gráfico */}
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickMargin={10} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(value) => `$${value}`} />
                        <Tooltip content={<CustomTooltip />} />

                        {/* La línea del precio */}
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                        />

                        {/* Puntos de Compra (Violetas) */}
                        {mockData.map((entry, index) => (
                            entry.buyPoint && (
                                <ReferenceDot key={`buy-${index}`} x={entry.time} y={entry.price} r={5} fill="#8b5cf6" stroke="#0b0e14" strokeWidth={2} />
                            )
                        ))}

                        {/* Punto de Venta / Take Profit (Verde) */}
                        {mockData.map((entry, index) => (
                            entry.sellPoint && (
                                <ReferenceDot key={`sell-${index}`} x={entry.time} y={entry.price} r={6} fill="#4ade80" stroke="#0b0e14" strokeWidth={2} />
                            )
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}