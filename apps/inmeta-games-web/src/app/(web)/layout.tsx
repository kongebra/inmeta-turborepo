import {
  archivoBlack,
  archivo,
  dmSerifDisplay,
  ibmPlexMono,
} from "@/lib/fonts";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trønder Leikan",
  description: "Inmeta Games Trondheim — turneringer, standings og spillerprofiler",
};

export const viewport: Viewport = {
  themeColor: "#0c0c0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      suppressHydrationWarning
      className={cn(
        archivoBlack.variable,
        archivo.variable,
        dmSerifDisplay.variable,
        ibmPlexMono.variable
      )}
    >
      <head />
      <body className="min-h-screen bg-n-bg text-n-ink font-sans antialiased">
        <header className="border-b border-n-line">
          <nav className="container flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-6 h-6 rounded-full bg-n-rust border-2 border-n-ink group-hover:scale-110 transition-transform" />
              <span className="font-display text-[17px] text-n-ink tracking-[0.015em]">
                TRØNDER<span className="text-n-rust">·</span>LEIKAN
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="font-mono text-[10px] text-n-ink uppercase tracking-[0.12em] hover:text-n-rust transition-colors"
              >
                Turneringer
              </Link>
              <Link
                href="/players"
                className="font-mono text-[10px] text-n-ink-dim uppercase tracking-[0.12em] hover:text-n-ink transition-colors"
              >
                Spillere
              </Link>
              <a
                href="/studio"
                className="font-mono text-[10px] text-n-muted uppercase tracking-[0.12em] hover:text-n-ink-dim transition-colors"
              >
                Studio ↗
              </a>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
