import { Skilt } from "@/components/nidaros";
import Link from "next/link";
import React from "react";

export default function NotFoundPage() {
  return (
    <main>
      <div className="container py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Skilt variant="rust" className="mb-6">404</Skilt>
        <h1 className="font-display text-5xl lg:text-7xl leading-none text-n-ink mb-4">
          Dæven,<br />
          <span className="text-n-rust">siden finnes ikke</span>
        </h1>
        <p className="font-serif italic text-n-ink-dim text-lg mb-8 max-w-sm">
          Det du leter etter er enten borte, eller det var aldri her.
        </p>
        <Link
          href="/"
          className="border border-n-rust text-n-rust font-mono text-[10px] uppercase tracking-[0.12em] px-5 py-3 hover:bg-n-rust hover:text-n-paper transition-colors"
        >
          Tilbake til forsiden →
        </Link>
      </div>
    </main>
  );
}
