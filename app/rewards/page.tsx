export default function PageTemplate() {
    return (
        <main className="min-h-screen flex flex-col items-center">

            {/* Contenedor Principal de la solapa */}
            <div className="w-full max-w-7xl px-4 xl:px-0 flex flex-col items-center justify-center mt-12">

                {/* Tarjeta de construcción */}
                <div className="bg-bgSecondary border border-white/10 rounded-xl p-12 text-center shadow-2xl max-w-2xl w-full">

                    {/* CAMBIAR ESTO SEGÚN LA PÁGINA (Ej: 📊 Dashboard, 🏆 Leaderboard, 🎁 Rewards) */}
                    <span className="text-6xl mb-6 block">🎁</span>

                    {/* CAMBIAR EL TÍTULO */}
                    <h2 className="text-3xl font-extrabold text-white mb-4">
                        Rewards
                    </h2>

                    <p className="text-textMuted text-lg">
                        Estamos construyendo esta sección para The Metronome. Pronto podrás ver tu información aquí.
                    </p>

                    <div className="mt-8 flex justify-center gap-2">
                        <div className="w-3 h-3 bg-brandPrimary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-brandPrimary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-brandPrimary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>

            </div>

        </main>
    );
}