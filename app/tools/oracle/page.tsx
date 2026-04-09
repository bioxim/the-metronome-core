"use client";

import { useState } from 'react';
import { Bot, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OraclePage() {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hello, Builder. I am The Metronome Oracle. Ask me about market volatility, historical DCA performance, or optimal rhythm frequencies for your portfolio.' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setMessages([...messages, { role: 'user', text: inputValue }]);
        setInputValue('');

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "Based on current on-chain liquidity, an hourly DCA rhythm captures the most value during high-volatility phases. Consider pairing this with a 15% APY lending protocol for maximum capital efficiency."
            }]);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-bgMain text-textMain pb-10 pt-12">
            <div className="max-w-3xl mx-auto px-4 xl:px-0">

                <Link href="/tools" className="inline-flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Tools
                </Link>

                <div className="bg-bgSecondary border border-white/10 rounded-2xl flex flex-col h-[700px] shadow-2xl">
                    <div className="p-6 border-b border-white/10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-brandPrimary/10 rounded-xl flex items-center justify-center">
                            <Bot className="w-6 h-6 text-brandPrimary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">The AI Oracle</h1>
                            <p className="text-sm text-brandPrimary flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brandPrimary animate-pulse"></span> Online • On-chain model
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-base leading-relaxed ${msg.role === 'user'
                                    ? 'bg-brandPrimary text-bgMain font-medium rounded-br-none'
                                    : 'bg-white/5 border border-white/10 text-textMuted rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 border-t border-white/10 bg-bgSecondary rounded-b-2xl">
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about SOL volatility or optimal rhythms..."
                                className="flex-1 bg-bgMain border border-white/10 rounded-xl px-5 py-4 text-base text-white focus:outline-none focus:border-brandPrimary transition-colors"
                            />
                            <button type="submit" className="bg-brandPrimary hover:bg-[#0891b2] text-bgMain px-6 rounded-xl transition-colors font-bold flex items-center gap-2">
                                Send <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}