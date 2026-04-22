import Link from 'next/link'

export function Nav() {
  return (
    <nav className="flex items-center justify-between px-8 py-3 border-b border-line bg-bg">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-accent border-2 border-ink" />
        <span className="font-display text-[17px] tracking-tight">
          TRØNDER<span className="text-accent">·</span>LEIKAN
        </span>
      </Link>
      <div className="flex gap-5 font-mono text-[11px] text-ink-muted">
        <Link href="/"           className="hover:text-ink transition-colors text-ink">Turneringa</Link>
        <Link href="/players"    className="hover:text-ink transition-colors">Spellaran</Link>
      </div>
    </nav>
  )
}
