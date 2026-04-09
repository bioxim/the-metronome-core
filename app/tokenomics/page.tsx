"use client";

import { Flame, Users, ShieldCheck, ArrowRightLeft, Coins } from 'lucide-react';

export default function TokenomicsPage() {
    return (
        <div className="min-h-screen bg-bgMain text-textMain pb-20">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 xl:px-0 pt-10 pb-12">
                <div className="inline-block bg-brandPrimary/10 border border-brandPrimary/20 text-brandPrimary px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                    $ONOME Token
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    Engineered for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandPrimary to-purple-500">
                        Sustainable Yield.
                    </span>
                </h1>
                <p className="text-xl text-textMuted max-w-2xl leading-relaxed">
                    $ONOME is the economic engine of The Metronome. It is designed to reward long-term conviction, penalize impulsive exits, and capture real protocol value.
                </p>
            </div>

            {/* Distribution Bar Section */}
            <div className="max-w-7xl mx-auto px-4 xl:px-0 mb-20">
                <h2 className="text-2xl font-bold text-white mb-8">Supply Distribution</h2>

                {/* Visual Bar */}
                <div className="w-full h-8 flex rounded-xl overflow-hidden mb-8 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                    <div className="bg-[#06b6d4] h-full flex items-center justify-center text-[10px] font-black text-bgMain" style={{ width: '42.7%' }}>42.7%</div>
                    <div className="bg-[#f59e0b] h-full flex items-center justify-center text-[10px] font-black text-bgMain" style={{ width: '34.9%' }}>34.9%</div>
                    <div className="bg-[#ec4899] h-full flex items-center justify-center text-[10px] font-black text-bgMain" style={{ width: '12.4%' }}>12.4%</div>
                    <div className="bg-[#8b5cf6] h-full flex items-center justify-center text-[10px] font-black text-white" style={{ width: '10.0%' }}>10%</div>
                </div>

                {/* Legend Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-bgSecondary border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
                            <span className="text-sm font-bold text-textMuted uppercase">Community & Rewards</span>
                        </div>
                        <div className="text-2xl font-black text-white">42.7%</div>
                    </div>
                    <div className="bg-bgSecondary border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                            <span className="text-sm font-bold text-textMuted uppercase">Investors & Seed</span>
                        </div>
                        <div className="text-2xl font-black text-white">34.9%</div>
                    </div>
                    <div className="bg-bgSecondary border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-[#ec4899]"></div>
                            <span className="text-sm font-bold text-textMuted uppercase">Core Team</span>
                        </div>
                        <div className="text-2xl font-black text-white">12.4%</div>
                    </div>
                    <div className="bg-bgSecondary border border-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
                            <span className="text-sm font-bold text-textMuted uppercase">Treasury & Liq</span>
                        </div>
                        <div className="text-2xl font-black text-white">10.0%</div>
                    </div>
                </div>
            </div>

            {/* Mechanics Section */}
            <div className="max-w-7xl mx-auto px-4 xl:px-0">
                <h2 className="text-2xl font-bold text-white mb-8">Protocol Mechanics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Mechanic 1 */}
                    <div className="bg-gradient-to-b from-bgSecondary to-bgMain border border-white/10 p-8 rounded-2xl hover:border-brandPrimary/50 transition-colors group">
                        <div className="w-12 h-12 bg-[#ec4899]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Flame className="w-6 h-6 text-[#ec4899]" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Early Exit Penalty</h3>
                        <p className="text-textMuted text-sm leading-relaxed">
                            Paper hands pay the community. Withdrawing a DCA position before it reaches profitability incurs an early-exit fee. 100% of this penalty is collected and redistributed directly to $ONOME stakers.
                        </p>
                    </div>

                    {/* Mechanic 2 */}
                    <div className="bg-gradient-to-b from-bgSecondary to-bgMain border border-white/10 p-8 rounded-2xl hover:border-brandPrimary/50 transition-colors group">
                        <div className="w-12 h-12 bg-brandPrimary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ArrowRightLeft className="w-6 h-6 text-brandPrimary" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Zero-Fee DCA</h3>
                        <p className="text-textMuted text-sm leading-relaxed">
                            Holding $ONOME is your VIP pass. Users who stake a minimum threshold of $ONOME in the protocol enjoy 0% execution fees on all automated algorithmic purchases.
                        </p>
                    </div>

                    {/* Mechanic 3 */}
                    <div className="bg-gradient-to-b from-bgSecondary to-bgMain border border-white/10 p-8 rounded-2xl hover:border-brandPrimary/50 transition-colors group">
                        <div className="w-12 h-12 bg-[#8b5cf6]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6 text-[#8b5cf6]" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Deflationary Buyback</h3>
                        <p className="text-textMuted text-sm leading-relaxed">
                            A portion of the standard platform fees generated by non-stakers is automatically routed to a smart contract that buys $ONOME on the open market and burns it, creating perpetual scarcity.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}