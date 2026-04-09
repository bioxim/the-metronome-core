"use client";

import Link from 'next/link';
import { Bot, Calculator, ArrowLeftRight, PiggyBank, Sparkles, ArrowRight } from 'lucide-react';

export default function ToolsShowcasePage() {
    return (
        <div className="min-h-screen bg-bgMain text-textMain pb-20">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 xl:px-0 pt-10 pb-16 text-center">
                <div className="inline-flex items-center gap-2 bg-brandPrimary/10 border border-brandPrimary/20 text-brandPrimary px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                    <Sparkles className="w-4 h-4" /> Pro Suite
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    Data-Driven <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandPrimary to-[#8b5cf6]">
                        Instruments.
                    </span>
                </h1>
                <p className="text-xl text-textMuted max-w-2xl mx-auto leading-relaxed">
                    Elevate your DCA strategy. Use our advanced simulation and AI modeling tools to analyze on-chain conditions before locking your rhythm.
                </p>
            </div>

            {/* Tools Grid */}
            <div className="max-w-7xl mx-auto px-4 xl:px-0 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Active Tool 1: AI Oracle */}
                <Link href="/tools/oracle" className="bg-bgSecondary border border-white/10 p-8 rounded-2xl hover:border-brandPrimary/50 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                        <ArrowRight className="w-6 h-6 text-brandPrimary" />
                    </div>
                    <div className="w-14 h-14 bg-brandPrimary/10 rounded-xl flex items-center justify-center mb-6">
                        <Bot className="w-7 h-7 text-brandPrimary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">The AI Oracle</h2>
                    <p className="text-textMuted leading-relaxed mb-6">
                        Query our fine-tuned AI model about historical Solana volatility, optimal rhythm frequencies, and current on-chain liquidity metrics. Get smart insights before deploying capital.
                    </p>
                    <span className="text-brandPrimary font-bold text-sm uppercase tracking-wider">Launch Tool</span>
                </Link>

                {/* Active Tool 2: Calculator */}
                <Link href="/tools/calculator" className="bg-bgSecondary border border-white/10 p-8 rounded-2xl hover:border-[#8b5cf6]/50 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                        <ArrowRight className="w-6 h-6 text-[#8b5cf6]" />
                    </div>
                    <div className="w-14 h-14 bg-[#8b5cf6]/10 rounded-xl flex items-center justify-center mb-6">
                        <Calculator className="w-7 h-7 text-[#8b5cf6]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Yield Calculator</h2>
                    <p className="text-textMuted leading-relaxed mb-6">
                        Simulate your long-term Dollar Cost Averaging (DCA) performance. Adjust your monthly investment, duration, and expected APY to visualize your potential compounding growth.
                    </p>
                    <span className="text-[#8b5cf6] font-bold text-sm uppercase tracking-wider">Launch Tool</span>
                </Link>

                {/* Phase 2 Tool: Swap */}
                <div className="bg-bgMain border border-white/5 p-8 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-6 right-6 bg-white/10 text-textMuted text-xs font-bold px-3 py-1 rounded-full uppercase">
                        Phase 2
                    </div>
                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 opacity-50">
                        <ArrowLeftRight className="w-7 h-7 text-textMuted" />
                    </div>
                    <h2 className="text-2xl font-bold text-white/50 mb-3">Instant Swap</h2>
                    <p className="text-textMuted/50 leading-relaxed">
                        Execute immediate token swaps directly from your dashboard with zero-slippage routing across the Solana ecosystem.
                    </p>
                </div>

                {/* Phase 2 Tool: Lend */}
                <div className="bg-bgMain border border-white/5 p-8 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-6 right-6 bg-white/10 text-textMuted text-xs font-bold px-3 py-1 rounded-full uppercase">
                        Phase 2
                    </div>
                    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 opacity-50">
                        <PiggyBank className="w-7 h-7 text-textMuted" />
                    </div>
                    <h2 className="text-2xl font-bold text-white/50 mb-3">Passive Lend</h2>
                    <p className="text-textMuted/50 leading-relaxed">
                        Supply your accumulated assets to decentralized lending pools automatically. Earn additional base yield on top of your DCA strategy.
                    </p>
                </div>

            </div>
        </div>
    );
}