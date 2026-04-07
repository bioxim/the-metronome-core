export default function RhythmPanel() {
    return (
        <div className="bg-bgSecondary border border-white/10 rounded-xl p-6 shadow-2xl flex flex-col gap-6">

            {/* Título de la tarjeta */}
            <div>
                <h2 className="text-2xl font-extrabold text-white">Create Rhythm</h2>
                <p className="text-sm text-textMuted mt-1">Automate your accumulation strategy.</p>
            </div>

            {/* Selector de Token y APY (Estructura visual) */}
            <div className="bg-bgMain p-4 rounded-lg border border-white/5 flex justify-between items-center cursor-pointer hover:border-brandPrimary/50 transition-colors">
                <div className="flex items-center gap-3">
                    {/* Círculo simulando el logo de un token (ej: SOL) */}
                    <div className="w-10 h-10 bg-brandPurple rounded-full flex items-center justify-center font-bold text-white">
                        SOL
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Solana</h3>
                        <p className="text-xs text-textMuted">Target Asset</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-brandPrimary font-bold text-lg">8.5%</span>
                    <p className="text-xs text-textMuted">Est. APY</p>
                </div>
            </div>

            {/* Espacio para los inputs que se despliegan debajo */}
            <div className="border-t border-white/10 pt-4 text-sm text-textMuted text-center min-h-[150px] flex items-center justify-center">
                (Acá se van a desplegar los inputs de monto y frecuencia)
            </div>

            {/* Botón Principal de Acción */}
            <button className="w-full bg-brandPrimary text-bgMain font-extrabold text-lg py-4 rounded-lg hover:bg-white transition-all duration-200 shadow-[0_0_20px_rgba(31,192,226,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                Start Metronome
            </button>

        </div>
    );
}