import OrderHistory from "@/components/OrderHistory";

export default function DashboardPage() {
    return (
        <main className="min-h-screen flex flex-col items-center pb-20">

            <div className="w-full max-w-7xl px-4 xl:px-0 flex flex-col gap-8 mt-4">

                {/* Cabecera del Dashboard */}
                <div>
                    <h2 className="text-3xl font-extrabold text-white">Your Dashboard</h2>
                    <p className="text-textMuted mt-2">Manage your active Rhythms and track your execution history.</p>
                </div>

                {/* Tarjetas de Resumen (Métricas del usuario) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-bgSecondary border border-white/10 rounded-xl p-6 shadow-lg">
                        <span className="text-textMuted text-sm font-bold uppercase block mb-1">Total Value Locked</span>
                        <span className="text-3xl font-mono text-white">$1,240.50</span>
                    </div>
                    <div className="bg-bgSecondary border border-white/10 rounded-xl p-6 shadow-lg">
                        <span className="text-textMuted text-sm font-bold uppercase block mb-1">Active Rhythms</span>
                        <span className="text-3xl font-mono text-white">2</span>
                    </div>
                    <div className="bg-bgSecondary border border-brandPrimary/30 rounded-xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-brandPrimary/10 rounded-bl-full"></div>
                        <span className="text-brandPrimary text-sm font-bold uppercase block mb-1">Est. APY</span>
                        <span className="text-3xl font-mono text-white">+8.4%</span>
                    </div>
                </div>

                {/* Acá importamos tu componente de historial */}
                <div className="mt-4">
                    <OrderHistory />
                </div>

            </div>

        </main>
    );
}