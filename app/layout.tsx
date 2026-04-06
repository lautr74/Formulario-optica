import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Configuración de fuentes modernas
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadatos basados en el borrador técnico
export const metadata: Metadata = {
  title: "Lifestyle Vision | Herramienta de Venta Profesional", //
  description: "Cuestionario técnico para la recomendación de lentes Essilor", // [cite: 3, 36]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100 selection:bg-blue-500/30`}
      >
        {/* Un sutil gradiente de fondo para dar profundidad */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-zinc-950 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

        <div className="relative flex min-h-screen flex-col">
          {/* Header minimalista opcional */}
          <header className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
              <span className="text-sm font-bold tracking-tighter text-blue-500 uppercase">
                Lifestyle Vision
              </span>
              <span className="text-[10px] text-zinc-500 font-mono border border-zinc-800 px-2 py-1 rounded">
                v1.0.0-PRO
              </span>
            </div>
          </header>

          {/* Contenido principal */}
          <main className="flex-1 flex flex-col items-center justify-center">
            {children}S
          </main>

          {/* Footer técnico */}
          <footer className="p-6 text-center text-[10px] text-zinc-600 uppercase tracking-widest">
            Borrador Final - Herramienta Técnica de Óptica [cite: 4, 27]
          </footer>
        </div>
      </body>
    </html>
  );
}
