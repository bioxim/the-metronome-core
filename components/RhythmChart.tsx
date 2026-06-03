"use client";

import { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi, CandlestickSeries, createSeriesMarkers } from 'lightweight-charts';
import { Bot, X, Loader2 } from 'lucide-react';

export default function RhythmChart() {
    const [showVideo, setShowVideo] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Referencias para mantener el gráfico y la serie accesibles
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // 1. Inicializar el motor gráfico (TradingView)
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#9ca3af',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            crosshair: { mode: CrosshairMode.Normal },
            rightPriceScale: { borderColor: 'rgba(255, 255, 255, 0.1)' },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true, // Mostrar la hora, no solo el día
            },
        });

        // 2. Crear la serie de velas con nuestro diseño Cyber-Financial
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#4ade80',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#4ade80',
            wickDownColor: '#ef4444',
        });

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        // 3. Obtener los datos reales de Binance (SOL/USDT)
        const fetchLiveMarketData = async () => {
            try {
                // Traemos velas de 1 hora de SOL/USDT
                const response = await fetch('https://api.binance.com/api/v3/klines?symbol=SOLUSDT&interval=1h&limit=100');
                const data = await response.json();

                // Formateamos la data de Binance para TradingView
                const formattedData = data.map((d: any) => ({
                    time: d[0] / 1000, // Convertir ms a segundos (Unix Timestamp)
                    open: parseFloat(d[1]),
                    high: parseFloat(d[2]),
                    low: parseFloat(d[3]),
                    close: parseFloat(d[4]),
                }));

                // Inyectamos la data al gráfico
                candlestickSeries.setData(formattedData);

                // Simulamos el "Efecto Hyperliquid" poniendo una orden de compra en la penúltima vela
                if (formattedData.length > 2) {
                    const targetCandle = formattedData[formattedData.length - 2];
                    const markersPrimitive = createSeriesMarkers(candlestickSeries);
                    markersPrimitive.setMarkers([
                        {
                            time: targetCandle.time as any,
                            position: 'belowBar',
                            color: '#8b5cf6', // Violeta Metronome
                            shape: 'circle',
                            text: 'Metronome: Auto-Buy Executed',
                        }
                    ]);
                }

                chart.timeScale().fitContent();
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching from Oracle/Binance:", error);
                setIsLoading(false);
            }
        };

        fetchLiveMarketData();

        // 4. Hacer que el gráfico sea responsivo
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        // Limpieza de memoria al cerrar el componente
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return (
        <div className="relative w-full h-full min-h-[400px] flex flex-col">

            {/* --- BOTÓN DEL ORÁCULO Y ESTADO DE CARGA --- */}
            <div className="absolute top-0 right-0 z-20 flex gap-3 items-center">
                {isLoading && (
                    <div className="flex items-center gap-2 text-brandPrimary text-xs font-mono bg-brandPrimary/10 px-3 py-1.5 rounded-full border border-brandPrimary/30">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Syncing live data...
                    </div>
                )}
                <button
                    onClick={() => setShowVideo(true)}
                    className="bg-brandPrimary/10 hover:bg-brandPrimary/20 text-brandPrimary border border-brandPrimary/30 px-3 py-1.5 rounded-full flex items-center gap-2 transition-all backdrop-blur-md shadow-lg"
                >
                    <Bot className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Explain Chart</span>
                </button>
            </div>

            {/* --- MODAL FLOTANTE DE RUNWAY AI --- */}
            {showVideo && (
                <div className="absolute inset-0 z-30 bg-bgMain/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-bgSecondary border border-white/10 p-2 rounded-2xl shadow-2xl relative max-w-sm w-full">
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute -top-3 -right-3 bg-bgMain border border-white/10 rounded-full p-1.5 text-textMuted hover:text-white transition-colors z-40"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <video
                            src="/chart-tutorial.mp4"
                            autoPlay
                            loop
                            controls
                            className="w-full rounded-xl"
                        />
                        <div className="p-3 text-center">
                            <p className="text-sm font-medium text-white">Master Market Volatility</p>
                            <p className="text-xs text-brandPrimary mt-1">See how the Oracle automates your gains.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TÍTULO Y TEMPORALIDAD DEL GRÁFICO (OVERLAY ESTILO HYPERLIQUID) --- */}
            <div className={`absolute top-14 left-4 z-10 flex items-center gap-3 pointer-events-none transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-white font-extrabold text-xl tracking-tight drop-shadow-md">SOL/USDT</h3>
                    <span className="bg-white/10 backdrop-blur-md text-gray-300 text-[10px] font-bold px-2 py-1 rounded-md border border-white/5">1H</span>
                </div>
                <div className="flex items-center gap-1.5 bg-green-400/10 px-2 py-1 rounded-md border border-green-400/20 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
                    <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">Live</span>
                </div>
            </div>

            {/* --- EL LIENZO DEL GRÁFICO (Canvas) --- */}
            <div
                ref={chartContainerRef}
                className={`flex-1 mt-10 rounded-lg overflow-hidden border border-white/5 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            />
        </div>
    );
}