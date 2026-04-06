import Image from 'next/image';
import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  variable: '--font-sans',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Optica Costa Blanca | Asesor Visual',
  description:
    'Cuestionario profesional para recomendar lentes según el estilo de vida del cliente y los datos técnicos de la óptica.',
  icons: {
    icon: '/optica%20calpe.png',
    shortcut: '/optica%20calpe.png',
    apple: '/optica%20calpe.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${fraunces.variable} antialiased`}>
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(28,92,95,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(226,188,121,0.2),_transparent_28%)]" />

        <div className="relative flex min-h-screen flex-col">
          <header className="px-4 pt-4 md:px-6">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-full border border-[#ddd0bd] bg-[rgba(251,248,242,0.78)] px-4 py-3 shadow-[0_18px_50px_rgba(69,62,50,0.08)] backdrop-blur md:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#e7dccd] bg-white">
                  <Image
                    src="/optica%20calpe.png"
                    alt="Logotipo de Optica Costa Blanca"
                    fill
                    className="object-contain p-1.5"
                    sizes="40px"
                    priority
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold uppercase tracking-[0.24em] text-[#8d6b33]">
                    Optica Costa Blanca
                  </p>
                  <p className="truncate text-xs text-[#64767a]">Herramienta de recomendación visual</p>
                </div>
              </div>

              <div className="hidden rounded-full border border-[#e2d7c7] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#264247] sm:block">
                Asesor en tienda
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="px-4 pb-6 pt-2 md:px-6">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 text-center text-xs text-[#6c7670] sm:flex-row sm:text-left">
              <p>Optica Costa Blanca · Cuestionario profesional de recomendación visual</p>
              <p>Diseñado para acompañar la conversación comercial y la carga técnica</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
