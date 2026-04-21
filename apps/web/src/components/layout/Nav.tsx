import { Link } from '@tanstack/react-router'

const links = [
  { to: '/' as const, label: 'Hjem', exact: true },
  { to: '/players/' as const, label: 'Spillere' },
  { to: '/achievements' as const, label: 'Merker' },
]

export function Nav() {
  return (
    <nav className="border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-display text-[var(--accent)] text-lg tracking-tight">
          Trønder Leikan
        </Link>
        <div className="flex items-center gap-6">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: 'text-[var(--accent)]' }}
              className="font-mono-upper text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link to="/admin/" className="font-mono-upper text-[var(--ink-muted)] hover:text-[var(--ink-dim)]">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
