"use client";

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Bot, X } from 'lucide-react';

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
    { time: '15:00', price: 155.00, sellPoint: 155.00 }, // Venta (Take Profit)
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-bgSecondary border border-white/10 p-3 rounded-xl shadow-2xl">
                <p className="text-textMuted text-xs mb-1">{label}</p>
                <p className="text-white font-bold text-lg">${data.price.toFixed(2)}</p>
                {data.buyPoint && <p className="text-brandPrimary text-xs font-bold mt-1">● Buy Executed</p>}
                {data.sellPoint && <p className="text-green-400 text-xs font-bold mt-1">● Take Profit</p>}
            </div>
        );
    }
    return null;
};

export default function RhythmChart() {
    // ESTADO PARA EL VIDEO DE IA
    const [showVideo, setShowVideo] = useState(false);

    return (
        <div className="relative w-full h-full min-h-[400px] flex flex-col">

            {/* --- BOTÓN DEL ORÁCULO --- */}
            <div className="absolute top-0 right-0 z-10">
                <button
                    onClick={() => setShowVideo(true)}
                    className="bg-brandPrimary/10 hover:bg-brandPrimary/20 text-brandPrimary border border-brandPrimary/30 px-3 py-1.5 rounded-full flex items-center gap-2 transition-all backdrop-blur-md"
                >
                    <Bot className="w-4 h-4" />
                    <span className="text-xs font-bold">Explain Chart</span>
                </button>
            </div>

            {/* --- MODAL DE VIDEO FLOTANTE --- */}
            {showVideo && (
                <div className="absolute inset-0 z-20 bg-bgMain/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-bgSecondary border border-white/10 p-2 rounded-2xl shadow-2xl relative max-w-sm w-full">
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute -top-3 -right-3 bg-bgMain border border-white/10 rounded-full p-1.5 text-textMuted hover:text-white transition-colors z-30"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        {/* Acá irá el video de Runway de Kirk explicando el gráfico */}
                        <video
                            src="https://www.w3schools.com/html/mov_bbb.mp4"
                            autoPlay
                            loop
                            controls
                            className="w-full rounded-xl"
                        />
                        <div className="p-3 text-center">
                            <p className="text-sm font-medium text-white">How to read the market</p>
                            <p className="text-xs text-brandPrimary mt-1">Kirk explains the volatility setup.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EL GRÁFICO (Recharts) --- */}
            <div className="flex-1 mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickMargin={10} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(value) => `$${value}`} />
                        <Tooltip content={<CustomTooltip />} />

                        <Area type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />

                        {mockData.map((entry, index) => (
                            entry.buyPoint && <ReferenceDot key={`buy-${index}`} x={entry.time} y={entry.price} r={5} fill="#8b5cf6" stroke="#0b0e14" strokeWidth={2} />
                        ))}
                        {mockData.map((entry, index) => (
                            entry.sellPoint && <ReferenceDot key={`sell-${index}`} x={entry.time} y={entry.price} r={6} fill="#4ade80" stroke="#0b0e14" strokeWidth={2} />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}