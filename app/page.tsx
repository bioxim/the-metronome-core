import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-12 flex flex-col items-center">

      {/* Acá llamamos al componente modularizado */}
      <Header />

      {/* Acá en el medio es donde vamos a construir la tarjeta de "Create a Rhythm" */}
      <div className="w-full max-w-5xl text-center text-textMuted mt-10">
        <p>El taller está limpio, modularizado y listo para construir...</p>
      </div>

    </main>
  );
}