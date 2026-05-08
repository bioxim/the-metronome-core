import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt } = body;

        // 1. Validamos que el usuario haya escrito algo
        if (!prompt) {
            return NextResponse.json({ error: "El prompt está vacío" }, { status: 400 });
        }

        // 2. HACEMOS LA LLAMADA A TU CEREBRO EN MODAL 🧠🚀
        const modalUrl = 'https://mariaximenacamino--metronome-oracle-backend-generate-ora-40c479.modal.run';

        const modalResponse = await fetch(modalUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Le pasamos a Modal exactamente lo que escribió el usuario
            body: JSON.stringify({ prompt: prompt }),
        });

        // 3. Si Modal tira error, lo capturamos
        if (!modalResponse.ok) {
            throw new Error(`Error en los servidores de Modal: ${modalResponse.statusText}`);
        }

        // 4. Recibimos el texto y el video de Runway (vía Modal)
        const data = await modalResponse.json();

        // 5. Se lo mandamos a tu frontend (page.tsx) para que lo muestre
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error en la conexión con el Oráculo Web3:", error);
        return NextResponse.json(
            { error: "Hubo una turbulencia en la Matrix al conectar con el Oráculo." },
            { status: 500 }
        );
    }
}