import RhythmChart from "@/components/RhythmChart";
import RhythmPanel from "@/components/RhythmPanel";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">

      {/* Contenedor Principal (Grid de 3 columnas en desktop) */}
      <div className="w-full max-w-7xl px-4 xl:px-0 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

        {/* LADO IZQUIERDO: El Gráfico (Ocupa 2 de las 3 columnas) */}
        <div className="lg:col-span-2 bg-bgSecondary border border-white/10 rounded-xl p-6 min-h-[500px] flex flex-col shadow-xl">
          <RhythmChart />
        </div>

        {/* LADO DERECHO: El Panel de Control (Ocupa 1 columna) */}
        <div className="lg:col-span-1">
          <RhythmPanel />
        </div>

      </div>

    </main>
  );
}