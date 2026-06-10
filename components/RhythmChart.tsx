"use client";

import { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi, CandlestickSeries, createSeriesMarkers } from 'lightweight-charts';
import { Bot, X, Loader2 } from 'lucide-react';

const PYTH_SOL_FEED_ID = "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d";
const PYTH_BTC_FEED_ID = "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";

export default function RhythmChart({ selectedAsset = 'SOL' }: { selectedAsset?: string }) {
    const [showVideo, setShowVideo] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [livePrice, setLivePrice] = useState<string>('...');

    // ⏱️ NUEVO: Estado para la temporalidad seleccionada (Por defecto 1 Hora)
    const [timeframe, setTimeframe] = useState<string>('1h');

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    const isBTC = selectedAsset === 'BTC';
    const binanceSymbol = isBTC ? 'BTCUSDT' : 'SOLUSDT';
    const pythFeedId = isBTC ? PYTH_BTC_FEED_ID : PYTH_SOL_FEED_ID;
    const pairName = isBTC ? 'cbBTC/USDC' : 'SOL/USDC';

    // 📋 Definimos los botones de la botonera visual
    const timeframes = [
        { label: '1H', value: '1h' },
        { label: '4H', value: '4h' },
        { label: '1D', value: '1d' },
        { label: '1W', value: '1w' },
        { label: '1M', value: '1m' }
    ];

    useEffect(() => {
        if (!chartContainerRef.current) return;
        setIsLoading(true);

        const chart = createChart(chartContainerRef.current, {
            layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#9ca3af' },
            grid: { vertLines: { color: 'rgba(255, 255, 255, 0.05)' }, horzLines: { color: 'rgba(255, 255, 255, 0.05)' } },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            crosshair: { mode: CrosshairMode.Normal },
            rightPriceScale: { borderColor: 'rgba(255, 255, 255, 0.1)' },
            timeScale: { borderColor: 'rgba(255, 255, 255, 0.1)', timeVisible: timeframe === '1h' || timeframe === '4h' },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#4ade80', downColor: '#ef4444', borderVisible: false, wickUpColor: '#4ade80', wickDownColor: '#ef4444',
        });

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        const fetchLiveMarketData = async () => {
            try {
                // 📡 Inyectamos de forma dinámica el binanceSymbol y el timeframe elegido
                const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${timeframe}&limit=100`);
                const data = await response.json();

                const formattedData = data.map((d: any) => ({
                    time: d[0] / 1000,
                    open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]),
                }));

                candlestickSeries.setData(formattedData);

                if (formattedData.length > 2) {
                    const targetCandle = formattedData[formattedData.length - 2];
                    const markersPrimitive = createSeriesMarkers(candlestickSeries);
                    markersPrimitive.setMarkers([{
                        time: targetCandle.time as any,
                        position: 'belowBar',
                        color: '#8b5cf6',
                        shape: 'circle',
                        text: 'Metronome: Auto-Buy Executed',
                    }]);
                }

                chart.timeScale().fitContent();
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching from Binance:", error);
                setIsLoading(false);
            }
        };

        fetchLiveMarketData();

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove(); // Limpia el canvas viejo al cambiar de moneda o de tiempo
        };
    }, [selectedAsset, binanceSymbol, timeframe]); // 🔥 Re-ejecuta al cambiar la moneda u otra temporalidad

    // Oráculo de Pyth para el feed de arriba en vivo
    useEffect(() => {
        const fetchPythPrice = async () => {
            try {
                const response = await fetch(`https://hermes.pyth.network/v2/updates/price/latest?ids[]=${pythFeedId}`);
                const data = await response.json();
                if (data && data.parsed && data.parsed.length > 0) {
                    const priceData = data.parsed[0].price;
                    const actualPrice = (Number(priceData.price) * Math.pow(10, priceData.expo)).toFixed(2);
                    setLivePrice(actualPrice);
                }
            } catch (err) { console.error("Pyth Error:", err); }
        };
        fetchPythPrice();
        const intervalId = setInterval(fetchPythPrice, 3000);
        return () => clearInterval(intervalId);
    }, [pythFeedId]);

    return (
        <div className="relative w-full h-full min-h-[420px] flex flex-col">
            {/* BOTÓN DEL ORÁCULO Y EXPLAIN */}
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

            {/* MODAL DE TUTORIAL */}
            {showVideo && (
                <div className="absolute inset-0 z-30 bg-bgMain/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-bgSecondary border border-white/10 p-2 rounded-2xl shadow-2xl relative max-w-sm w-full">
                        <button onClick={() => setShowVideo(false)} className="absolute -top-3 -right-3 bg-bgMain border border-white/10 rounded-full p-1.5 text-textMuted hover:text-white transition-colors z-40">
                            <X className="w-4 h-4" />
                        </button>
                        <video src="/chart-tutorial.mp4" autoPlay loop controls className="w-full rounded-xl" />
                        <div className="p-3 text-center">
                            <p className="text-sm font-medium text-white">Master Market Volatility</p>
                            <p className="text-xs text-brandPrimary mt-1">See how the Oracle automates your gains.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER DEL GRÁFICO (MONEDA + LIVE PRICE) */}
            <div className={`absolute top-14 left-4 z-10 flex flex-col sm:flex-row sm:items-center gap-3 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-white font-extrabold text-xl tracking-tight drop-shadow-md">{pairName}</h3>
                </div>
                <div className="flex items-center gap-1.5 bg-green-400/10 px-2 py-1 rounded-md border border-green-400/20 backdrop-blur-md w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
                    <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">${livePrice}</span>
                </div>
            </div>

            {/* ⏱️ NUEVA BOTONERA DE TEMPORALIDADES (ESTILO TRADINGVIEW / HYPERLIQUID) */}
            <div className="absolute top-14 right-4 z-10 flex bg-black/40 backdrop-blur-md rounded-lg p-1 border border-white/5 gap-1">
                {timeframes.map((tf) => (
                    <button
                        key={tf.value}
                        onClick={() => setTimeframe(tf.value)}
                        className={`px-2.5 py-1 rounded text-[10px] font-extrabold transition-all ${timeframe === tf.value
                            ? 'bg-brandPrimary text-bgMain shadow font-black'
                            : 'text-textMuted hover:text-white hover:bg-white/5'}`}
                    >
                        {tf.label}
                    </button>
                ))}
            </div>

            {/* LIENZO DEL GRÁFICO (Canvas) */}
            <div ref={chartContainerRef} className="flex-1 mt-24 rounded-lg overflow-hidden border border-white/5 bg-bgSecondary/20 min-h-[340px]" />
        </div>
    );
}