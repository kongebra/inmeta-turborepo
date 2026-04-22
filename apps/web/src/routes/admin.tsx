import { createFileRoute, Link, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useSession, signOut } from '~/lib/auth-client'
import { Button } from '~/components/nidaros/Button'

export const Route = createFileRoute('/admin')({
  ssr: false,
  component: AdminLayout,
})

const adminLinks = [
  { to: '/admin' as const, label: 'Dashboard' },
  { to: '/admin/players' as const, label: 'Spillere' },
  { to: '/admin/game-types' as const, label: 'Spilltyper' },
  { to: '/admin/tournaments' as const, label: 'Turneringer' },
  { to: '/admin/games' as const, label: 'Spill' },
]

function AdminLayout() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!isPending && !session && !isLoginPage) {
      navigate({ to: '/admin/login' })
    }
  }, [session, isPending, navigate, isLoginPage])

  if (isLoginPage) return <Outlet />

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <span className="font-mono-upper text-[var(--ink-muted)]">Laster...</span>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <aside className="w-56 border-r border-[var(--line)] bg-[var(--surface)] flex flex-col">
        <div className="p-4 border-b border-[var(--line)]">
          <p className="font-display text-[var(--accent)] text-sm">Admin</p>
          <p className="font-mono-upper text-[var(--ink-muted)] text-[10px] truncate mt-0.5">
            {session.user.email}
          </p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {adminLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: 'bg-[var(--surface-alt)] text-[var(--accent)]' }}
              className="block px-3 py-2 rounded font-mono-upper text-[var(--ink-dim)] hover:text-[var(--ink)] text-xs transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--line)]">
          <Link
            to="/"
            className="block font-mono-upper text-[var(--ink-muted)] text-xs mb-3 hover:text-[var(--ink)]"
          >
            ← Tilbake til siden
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut().then(() => navigate({ to: '/admin/login' }))}
            className="w-full"
          >
            Logg ut
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
