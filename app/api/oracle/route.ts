import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        // ⏱️ Simulamos que Runway está cocinando el video (espera 3 segundos)
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // 🛡️ GUARDRAILS (Reglas Estrictas)
        const promptLower = prompt.toLowerCase();
        // Verificamos si el usuario pregunta algo válido
        const isValidQuery = promptLower.includes('sol') || promptLower.includes('usdc') || promptLower.includes('rhythm') || promptLower.includes('market');

        let responseText = "";
        // Usamos un video de prueba genérico de internet por ahora
        let videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

        if (!isValidQuery) {
            responseText = "My apologies. As the Oracle of The Metronome, my expertise is strictly limited to Solana, USDC, and DCA strategies within our protocol.";
            // Acá el viernes le pasaremos un video de Kirk negando con la cabeza
        } else {
            responseText = "Analyzing Solana market conditions... Volatility is optimal. I recommend setting a 2% Buy Drop rhythm for safe accumulation today.";
            // Acá el viernes le pasaremos un video de Kirk dando este reporte
        }

        // Devolvemos el texto Y el link del video
        return NextResponse.json({
            text: responseText,
            video: videoUrl
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Turbulencia en la Matrix' }, { status: 500 });
    }
}