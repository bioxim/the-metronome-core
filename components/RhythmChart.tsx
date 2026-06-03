"use client";

import { useState, useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, CrosshairMode, ColorType, createSeriesMarkers } from 'lightweight-charts';
import { Bot, X } from 'lucide-react';

// MOCK DATA: Simulated OHLC (Open, High, Low, Close) price action for SOL
const candlestickData = [
    { time: '2024-05-01', open: 150.00, high: 152.00, low: 148.00, close: 148.50 },
    { time: '2024-05-02', open: 148.50, high: 149.00, low: 144.00, close: 145.20 },
    { time: '2024-05-03', open: 145.20, high: 147.00, low: 145.00, close: 146.00 },
    { time: '2024-05-04', open: 146.00, high: 146.50, low: 141.00, close: 142.10 },
    { time: '2024-05-05', open: 142.10, high: 143.00, low: 138.50, close: 139.50 },
    { time: '2024-05-06', open: 139.50, high: 140.00, low: 134.00, close: 135.00 },
    { time: '2024-05-07', open: 135.00, high: 139.00, low: 134.50, close: 138.00 },
    { time: '2024-05-08', open: 138.00, high: 143.00, low: 137.50, close: 142.00 },
    { time: '2024-05-09', open: 142.00, high: 149.00, low: 141.50, close: 148.00 },
    { time: '2024-05-10', open: 148.00, high: 156.00, low: 147.00, close: 155.00 },
];

// MOCK MARKERS: Visual indicators for The Metronome's automated actions
const markersData: any[] = [
    { time: '2024-05-02', position: 'belowBar', color: '#8b5cf6', shape: 'circle', text: 'Buy 1 Executed' },
    { time: '2024-05-04', position: 'belowBar', color: '#8b5cf6', shape: 'circle', text: 'Buy 2 Executed' },
    { time: '2024-05-06', position: 'belowBar', color: '#8b5cf6', shape: 'circle', text: 'Buy 3 Executed' },
    { time: '2024-05-10', position: 'aboveBar', color: '#4ade80', shape: 'arrowDown', text: 'Take Profit Hit' },
];

export default function RhythmChart() {
    // STATE FOR AI VIDEO MODAL
    const [showVideo, setShowVideo] = useState(false);

    // REF FOR TRADINGVIEW CHART CONTAINER
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // 1. Initialize Chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#9ca3af', // Tailwind's text-gray-400
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
        });

        // 2. Add Candlestick Series matching our Cyber-Financial theme
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#4ade80', // Tailwind's green-400
            downColor: '#ef4444', // Tailwind's red-500
            borderVisible: false,
            wickUpColor: '#4ade80',
            wickDownColor: '#ef4444',
        });

        // 3. Inject Data and Markers
        candlestickSeries.setData(candlestickData);
        const markersPrimitive = createSeriesMarkers(candlestickSeries);
        markersPrimitive.setMarkers(markersData);

        // 4. Handle window resize to keep chart responsive
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        // Fit chart to data
        chart.timeScale().fitContent();

        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return (
        <div className="relative w-full h-full min-h-[400px] flex flex-col">

            {/* --- ORACLE BUTTON --- */}
            <div className="absolute top-0 right-0 z-10">
                <button
                    onClick={() => setShowVideo(true)}
                    className="bg-brandPrimary/10 hover:bg-brandPrimary/20 text-brandPrimary border border-brandPrimary/30 px-3 py-1.5 rounded-full flex items-center gap-2 transition-all backdrop-blur-md shadow-lg"
                >
                    <Bot className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Explain Chart</span>
                </button>
            </div>

            {/* --- FLOATING VIDEO MODAL --- */}
            {showVideo && (
                <div className="absolute inset-0 z-20 bg-bgMain/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-bgSecondary border border-white/10 p-2 rounded-2xl shadow-2xl relative max-w-sm w-full">
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute -top-3 -right-3 bg-bgMain border border-white/10 rounded-full p-1.5 text-textMuted hover:text-white transition-colors z-30"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        {/* Runway AI Video integration */}
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

            {/* --- TRADINGVIEW CHART CONTAINER --- */}
            {/* The ref allows the lightweight-charts engine to attach the canvas here */}
            <div
                ref={chartContainerRef}
                className="flex-1 mt-10 rounded-lg overflow-hidden border border-white/5"
            />
        </div>
    );
}