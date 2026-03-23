import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "../lib/i18n/I18nContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { ThemeProvider } from "../components/ThemeProvider";
import { ThemeToggle } from "../components/ThemeToggle";
import Link from "next/link";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 min-h-screen selection:bg-lime-500 selection:text-zinc-950 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider>
            {/* Top Navigation - Brutalist / Minimal Tech  */}
            <header className="fixed top-0 w-full z-50 border-b-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-neon-lime rounded-sm flex items-center justify-center font-space font-bold text-zinc-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_0px_#27272a] group-hover:rotate-12 transition-transform">
                    DX
                  </div>
                  <div className="text-xl font-space font-bold tracking-tight text-zinc-900 dark:text-zinc-100">IntelliDX</div>
                </Link>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              </div>
            </header>
            
            <main className="pt-20">
              {children}
            </main>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
