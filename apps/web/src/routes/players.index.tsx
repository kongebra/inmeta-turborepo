import { createFileRoute, Link } from '@tanstack/react-router'
import { getPlayers } from '~/server/players'
import { Avatar } from '~/components/nidaros/Avatar'
import { Chip } from '~/components/nidaros/Chip'

export const Route = createFileRoute('/players/')({
  loader: () => getPlayers(),
  component: PlayersPage,
})

function PlayersPage() {
  const players = Route.useLoaderData()

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl mb-8">Spillere</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map(player => (
          <Link
            key={player.id}
            to="/players/$id"
            params={{ id: player.id }}
            className="flex items-center gap-4 p-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors"
          >
            <Avatar
              name={`${player.firstName} ${player.lastName}`}
              src={player.imageUrl}
              size="lg"
            />
            <div className="min-w-0">
              <p className="font-medium">{player.firstName} {player.lastName}</p>
              {player.nickname && (
                <p className="text-[var(--ink-muted)] text-sm">"{player.nickname}"</p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {player.homeBase && <Chip label={player.homeBase} />}
                {player.signatureGame && (
                  <Chip
                    label={`${player.signatureGame.icon ?? ''} ${player.signatureGame.name}`}
                    variant="accent"
                  />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
