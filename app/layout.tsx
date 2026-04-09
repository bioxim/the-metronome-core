import { WalletContextProvider } from '@/components/WalletContextProvider';
import Header from '@/components/Header';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Metronome",
  description: "Automate your accumulation. Earn yield. Stay disciplined.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bgMain text-textMain">
        {/* El Provider envuelve toda la aplicación para que cualquier página detecte la billetera */}
        <WalletContextProvider>
          {/* El Navbar queda fijo arriba en todas las páginas */}
          <Header />

          {/* El contenido de cada página se inyecta acá */}
          <main className="flex-1">
            {children}
          </main>
        </WalletContextProvider>
      </body>
    </html>
  );
}