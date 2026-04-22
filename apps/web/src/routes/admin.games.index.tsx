import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { getAllGames } from '~/server/games'
import { deleteGame } from '~/server/admin/games'
import { Button } from '~/components/nidaros/Button'

export const Route = createFileRoute('/admin/games/')({
  ssr: false,
  loader: () => getAllGames(),
  component: AdminGamesPage,
})

function AdminGamesPage() {
  const games = Route.useLoaderData()
  const router = useRouter()

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Slett "${name}"?`)) return
    try {
      await deleteGame({ data: id })
      router.invalidate()
    } catch {
      alert('Kunne ikke slette spillet. Prøv igjen.')
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Spill ({games.length})</h1>
        <Link to="/admin/games/new"><Button size="sm">+ Nytt spill</Button></Link>
      </div>
      <div className="space-y-2">
        {games.map(game => (
          <div key={game.id} className="flex items-center justify-between p-3 rounded border border-[var(--line)] bg-[var(--surface)]">
            <div>
              <p className="font-medium text-sm">{game.name}</p>
              <p className="text-xs text-[var(--ink-muted)]">{game.tournament.name} · {game.gameType?.name ?? '—'} · {game.status}</p>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/games/$id/edit" params={{ id: game.id }}>
                <Button variant="ghost" size="sm">Rediger</Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => handleDelete(game.id, game.name)}>Slett</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
