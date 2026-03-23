import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "../lib/i18n/I18nContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "IntelliDX | AI Research Platform",
  description: "Advanced AI-powered research and analysis platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-zinc-950 text-zinc-50 min-h-screen selection:bg-lime-500 selection:text-zinc-950`}
      >
        <I18nProvider>
          {/* Top Navigation - Brutalist / Minimal Tech  */}
          <header className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-lime-400 rounded-sm flex items-center justify-center font-space font-bold text-zinc-950">
                  DX
                </div>
                <div className="text-xl font-space font-bold tracking-tight text-zinc-100">IntelliDX</div>
              </div>
              <LanguageSwitcher />
            </div>
          </header>
          
          <main className="pt-20">
            {children}
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}
