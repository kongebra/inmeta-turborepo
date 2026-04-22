import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { getTournaments } from '~/server/tournaments'
import { deleteTournament } from '~/server/admin/tournaments'
import { Button } from '~/components/nidaros/Button'
import { Chip } from '~/components/nidaros/Chip'

export const Route = createFileRoute('/admin/tournaments/')({
  ssr: false,
  loader: () => getTournaments(),
  component: AdminTournamentsPage,
})

function AdminTournamentsPage() {
  const tournaments = Route.useLoaderData()
  const router = useRouter()

  const statusChip = (status: string) => {
    if (status === 'ACTIVE') return <Chip label="AKTIV" variant="accent" />
    if (status === 'FINISHED') return <Chip label="FERDIG" />
    return <Chip label="PLANLAGT" />
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Slett "${name}"?`)) return
    try {
      await deleteTournament({ data: id })
      router.invalidate()
    } catch {
      alert('Kunne ikke slette turneringen. Prøv igjen.')
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Turneringer</h1>
        <Link to="/admin/tournaments/new"><Button size="sm">+ Ny turnering</Button></Link>
      </div>
      <div className="space-y-2">
        {tournaments.map(t => (
          <div key={t.id} className="flex items-center justify-between p-3 rounded border border-[var(--line)] bg-[var(--surface)]">
            <div className="flex items-center gap-3">
              {statusChip(t.status)}
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="font-mono text-xs text-[var(--ink-muted)]">{t.slug} · {t.games.length} spill</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/tournaments/$id/edit" params={{ id: t.id }}>
                <Button variant="ghost" size="sm">Rediger</Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => handleDelete(t.id, t.name)}>Slett</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
