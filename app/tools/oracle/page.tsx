"use client";

import { useState } from 'react';
import { Bot, Send, ArrowLeft, Loader2 } from 'lucide-react'; // Agregamos Loader2 para un icono de carga zen
import Link from 'next/link';

// 1. AGREGAMOS ESTO: Le decimos a TypeScript cómo es nuestro mensaje
type Message = {
    role: string;
    text: string;
    video?: string; // El signo de interrogación significa que es OPCIONAL
};

export default function OraclePage() {
    // 2. MODIFICAMOS ESTO: Le decimos al useState que use la regla <Message[]>
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', text: 'Hello, Builder. I am The Metronome Oracle. Ask me about market volatility, historical DCA performance, or optimal rhythm frequencies for your portfolio.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado para saber si el Oso está pensando

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        // Si no hay texto o ya está cargando, no hacemos nada
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue;

        // 1. Agregamos el mensaje del usuario al chat
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInputValue('');
        setIsLoading(true); // Encendemos el estado de carga

        try {
            // 2. Llamamos a nuestra propia API (el backend simulado que armamos en el Paso 2)
            const response = await fetch('/api/oracle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userMessage }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en la conexión');
            }

            // 3. Agregamos la respuesta de la IA al chat (¡Con video!)
            setMessages(prev => [...prev, {
                role: 'ai',
                text: data.text,
                video: data.video // <- AGREGAMOS ESTO
            }]);

        } catch (error) {
            console.error("Error consultando al Oráculo:", error);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "Hubo una turbulencia en la red. El oráculo está meditando, intenta de nuevo."
            }]);
        } finally {
            setIsLoading(false); // Apagamos el estado de carga
        }
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

                                    {/* MAGIA: Si el mensaje trae un video, lo mostramos */}
                                    {msg.video && (
                                        <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
                                            <video src={msg.video} autoPlay loop muted controls className="w-full h-auto" />
                                        </div>
                                    )}

                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Indicador visual de que el Oso está escribiendo/pensando */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 text-textMuted p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-brandPrimary" />
                                    <span className="text-sm italic">Consultando los astros financieros...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-white/10 bg-bgSecondary rounded-b-2xl">
                        <form onSubmit={handleSendMessage} className="flex gap-3">
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