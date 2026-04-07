import Navbar from './Navbar';

export default function Header() {
    return (
        <header className="w-full max-w-7xl flex justify-between items-center mb-16 border-b border-white/10 pb-6 px-4 xl:px-0">

            {/* SECCIÓN 1: El Logo (Responsive) */}
            <div className="flex items-center cursor-pointer shrink-0">
                {/* Celulares (Sin el borde) */}
                <img
                    src="/favicon.png"
                    alt="The Metronome Icon"
                    className="block md:hidden h-10 w-auto rounded-md shadow-lg"
                />

                {/* Tablets y PCs (Sin el borde) */}
                <img
                    src="/metronome_full_logo.png"
                    alt="The Metronome Full Logo"
                    className="hidden md:block h-12 w-auto rounded-md shadow-lg"
                />
            </div>

            {/* SECCIÓN 2: Navbar Modularizada */}
            <Navbar />

            {/* SECCIÓN 3: El Botón de Wallet (Gris, hover blanco y cursor de manito) */}
            <button className="flex items-center shrink-0 gap-3 bg-bgSecondary border border-white/10 text-white font-bold py-2 px-5 rounded-lg hover:bg-white hover:text-bgMain transition-all duration-200 cursor-pointer">
                {/* El ícono adentro del botón */}
                <img
                    src="/favicon.png"
                    alt="Wallet Icon"
                    className="h-5 w-5 rounded-sm"
                />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
            </button>

        </header>
    );
}