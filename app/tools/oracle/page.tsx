"use client";

import { useState } from 'react';
import { Bot, Send, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

type Message = {
    role: string;
    text: string;
    video?: string;
};

export default function OraclePage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', text: 'Hello, Builder. I am The Metronome Oracle. Ask me about market volatility, historical DCA performance, or optimal rhythm frequencies for your portfolio.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 🌟 Estas son tus preguntas "Trampa" (las que sabemos que el Oso responde perfecto)
    const suggestedPrompts = [
        "Analyze Solana volatility",
        "What is the optimal DCA rhythm?",
        "Explain The Metronome"
    ];

    // Separamos la lógica de envío para poder usarla desde el form o desde los botones
    const submitQuery = async (queryText: string) => {
        if (!queryText.trim() || isLoading) return;

        // 1. Agregamos el mensaje del usuario al chat
        setMessages(prev => [...prev, { role: 'user', text: queryText }]);
        setInputValue(''); // Limpiamos el input por si había algo escrito
        setIsLoading(true);

        try {
            const response = await fetch('/api/oracle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: queryText }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en la conexión');
            }

            // 2. Agregamos la respuesta del Oráculo
            setMessages(prev => [...prev, {
                role: 'ai',
                text: data.text,
                video: data.video
            }]);

        } catch (error) {
            console.error("Error consultando al Oráculo:", error);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "Hubo una turbulencia en la red. El oráculo está meditando, intenta de nuevo."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Manejador para el botón normal de "Send" o presionar Enter
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitQuery(inputValue);
    };

    return (
        <div className="min-h-screen bg-bgMain text-textMain pb-10 pt-12">
            <div className="max-w-3xl mx-auto px-4 xl:px-0">

                <Link href="/tools" className="inline-flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <div className="bg-bgSecondary border border-white/10 rounded-2xl flex flex-col h-[750px] shadow-2xl">
                    {/* Header del Oráculo */}
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

                    {/* Área de Mensajes */}
                    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-base leading-relaxed ${msg.role === 'user'
                                    ? 'bg-brandPrimary text-bgMain font-medium rounded-br-none'
                                    : 'bg-white/5 border border-white/10 text-textMuted rounded-bl-none'
                                    }`}>

                                    {/* MAGIA: Si el mensaje trae un video, lo mostramos */}
                                    {msg.video && (
                                        <div className="mb-4 rounded-xl overflow-hidden border border-white/10 bg-black">
                                            <video src={msg.video} autoPlay loop muted={false} controls className="w-full h-auto" />
                                        </div>
                                    )}

                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Estado de Carga */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 text-textMuted p-4 rounded-2xl rounded-bl-none flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-brandPrimary" />
                                    <span className="text-sm italic">Consulting the financial cosmos... generating video response...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Área Inferior: Botones Sugeridos + Input */}
                    <div className="p-6 border-t border-white/10 bg-bgSecondary rounded-b-2xl">

                        {/* 🌟 BOTONES SUGERIDOS 🌟 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestedPrompts.map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => submitQuery(prompt)}
                                    disabled={isLoading}
                                    className="flex items-center gap-1.5 bg-brandPrimary/10 hover:bg-brandPrimary/20 text-brandPrimary text-xs font-medium py-2 px-3 rounded-full border border-brandPrimary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Sparkles className="w-3 h-3" /> {prompt}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleFormSubmit} className="flex gap-3">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isLoading}
                                placeholder="Ask about SOL volatility or optimal rhythms..."
                                className="flex-1 bg-bgMain border border-white/10 rounded-xl px-5 py-4 text-base text-white focus:outline-none focus:border-brandPrimary transition-colors disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                className="bg-brandPrimary hover:bg-[#0891b2] text-bgMain px-6 rounded-xl transition-colors font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}