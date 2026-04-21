import { createFileRoute, Link } from '@tanstack/react-router'
import { getRecentGames } from '~/server/games'
import { getTournaments } from '~/server/tournaments'
import { getPlayers } from '~/server/players'
import { SectionBar } from '~/components/nidaros/SectionBar'
import { Avatar } from '~/components/nidaros/Avatar'
import { JerseyNumber } from '~/components/nidaros/JerseyNumber'
import { Chip } from '~/components/nidaros/Chip'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [tournaments, recentGames, players] = await Promise.all([
      getTournaments(),
      getRecentGames(),
      getPlayers(),
    ])
    return { tournaments, recentGames, players }
  },
  component: Home,
})

function Home() {
  const { tournaments, recentGames, players } = Route.useLoaderData()
  const activeTournament = tournaments.find(t => t.status === 'ACTIVE') ?? tournaments[0]

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section>
        <p className="font-mono-upper text-[var(--ink-muted)] mb-2">Sesong 2025</p>
        <h1 className="font-display text-5xl text-[var(--accent)] mb-1">Trønder Leikan</h1>
        <p className="text-[var(--ink-dim)]">Internturneringen på Inmeta Trondheim</p>
      </section>

      {/* Aktiv turnering */}
      {activeTournament && (
        <section>
          <SectionBar label="Aktiv turnering" />
          <Link
            to="/tournaments/$slug"
            params={{ slug: activeTournament.slug }}
            className="block p-6 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono-upper text-[var(--accent)] text-xs mb-1">{activeTournament.status}</p>
                <h2 className="font-display text-2xl">{activeTournament.name}</h2>
                <p className="text-[var(--ink-dim)] text-sm mt-1">
                  {activeTournament.games.length} spill
                </p>
              </div>
              <span className="text-[var(--ink-muted)]">→</span>
            </div>
          </Link>
        </section>
      )}

      {/* Topp 3 spillere */}
      <section>
        <SectionBar label="Topp spillere" action={
          <Link to="/players/" className="font-mono-upper text-[var(--ink-muted)] hover:text-[var(--accent)] text-xs">
            Se alle →
          </Link>
        } />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {players.slice(0, 3).map((player, i) => (
            <Link
              key={player.id}
              to="/players/$id"
              params={{ id: player.id }}
              className="flex items-center gap-3 p-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors"
            >
              <JerseyNumber place={i + 1} />
              <Avatar name={`${player.firstName} ${player.lastName}`} src={player.imageUrl} size="sm" />
              <div>
                <p className="font-medium text-sm">{player.firstName} {player.lastName}</p>
                {player.nickname && <p className="text-[var(--ink-muted)] text-xs">{player.nickname}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Siste spill */}
      <section>
        <SectionBar label="Siste spill" />
        <div className="space-y-2">
          {recentGames.slice(0, 5).map(game => (
            <Link
              key={game.id}
              to="/games/$id"
              params={{ id: game.id }}
              className="flex items-center justify-between p-3 rounded border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-center gap-3">
                {game.gameType?.icon && <span className="text-lg">{game.gameType.icon}</span>}
                <div>
                  <p className="text-sm font-medium">{game.name}</p>
                  <p className="text-xs text-[var(--ink-muted)]">{game.tournament.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {game.status === 'LIVE' && <Chip label="LIVE" variant="accent" />}
                {game.date && (
                  <span className="font-mono-upper text-[var(--ink-muted)] text-xs">
                    {new Date(game.date).toLocaleDateString('nb-NO')}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
