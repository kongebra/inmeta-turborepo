// src/routes/_admin.players.tsx
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { getPlayers } from '~/server/players'
import { deletePlayer } from '~/server/admin/players'
import { Button } from '~/components/nidaros/Button'
import { Avatar } from '~/components/nidaros/Avatar'

export const Route = createFileRoute('/admin/players')({
  ssr: false,
  loader: () => getPlayers(),
  component: AdminPlayersPage,
})

function AdminPlayersPage() {
  const players = Route.useLoaderData()
  const router = useRouter()

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Slett ${name}?`)) return
    try {
      await deletePlayer({ data: id })
      router.invalidate()
    } catch {
      alert('Kunne ikke slette spilleren. Prøv igjen.')
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Spillere ({players.length})</h1>
        <Link to="/admin/players/new">
          <Button size="sm">+ Ny spiller</Button>
        </Link>
      </div>
      <div className="space-y-2">
        {players.map(player => (
          <div key={player.id} className="flex items-center justify-between p-3 rounded border border-[var(--line)] bg-[var(--surface)]">
            <div className="flex items-center gap-3">
              <Avatar name={`${player.firstName} ${player.lastName}`} src={player.imageUrl} size="sm" />
              <div>
                <p className="font-medium text-sm">{player.firstName} {player.lastName}</p>
                {player.nickname && <p className="text-xs text-[var(--ink-muted)]">"{player.nickname}"</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/players/$id/edit" params={{ id: player.id }}>
                <Button variant="ghost" size="sm">Rediger</Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(player.id, `${player.firstName} ${player.lastName}`)}
              >
                Slett
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
