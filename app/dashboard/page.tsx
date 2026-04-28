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

                {/* Acá importamos tu componente de historial */}
                <div className="mt-4">
                    <OrderHistory />
                </div>

            </div>

        </main>
    );
}