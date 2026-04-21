import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/')({
  ssr: false,
  component: AdminDashboard,
})

const sections = [
  { to: '/admin/players' as const, label: 'Spillere', desc: 'Opprett og rediger spillere' },
  { to: '/admin/game-types' as const, label: 'Spilltyper', desc: 'Dart, Discgolf, Sjakk...' },
  { to: '/admin/tournaments' as const, label: 'Turneringer', desc: 'Sesoner og cuper' },
  { to: '/admin/games' as const, label: 'Spill', desc: 'Enkeltspill, resultater, bilder' },
]

function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
        {sections.map(({ to, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="p-5 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors"
          >
            <p className="font-display text-lg mb-1">{label}</p>
            <p className="text-sm text-[var(--ink-muted)]">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
