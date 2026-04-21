import { createFileRoute, Link } from '@tanstack/react-router'
import { getTournament } from '~/server/tournaments'
import { SectionBar } from '~/components/nidaros/SectionBar'
import { JerseyNumber } from '~/components/nidaros/JerseyNumber'
import { Chip } from '~/components/nidaros/Chip'

export const Route = createFileRoute('/tournaments/$slug')({
  loader: ({ params }) => getTournament(params.slug),
  component: TournamentPage,
})

function TournamentPage() {
  const tournament = Route.useLoaderData()

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <header>
        <p className="font-mono-upper text-[var(--ink-muted)] text-xs mb-2">Turnering</p>
        <h1 className="font-display text-4xl">{tournament.name}</h1>
        {tournament.year && <p className="text-[var(--ink-dim)] mt-1">{tournament.year}</p>}
      </header>

      <section>
        <SectionBar label={`Spill (${tournament.games.length})`} />
        <div className="grid sm:grid-cols-2 gap-3">
          {tournament.games.map(game => (
            <Link
              key={game.id}
              to="/games/$id"
              params={{ id: game.id }}
              className="p-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {game.gameType?.icon && <span>{game.gameType.icon}</span>}
                    <span className="font-medium text-sm">{game.name}</span>
                  </div>
                  {game.location && <p className="text-xs text-[var(--ink-muted)]">{game.location}</p>}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {game.firstPlace.slice(0, 2).map(p => (
                      <div key={p.id} className="flex items-center gap-1">
                        <JerseyNumber place={1} />
                        <span className="text-xs">{p.firstName}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {game.status === 'LIVE' && <Chip label="LIVE" variant="accent" />}
                  {game.date && (
                    <span className="font-mono-upper text-[10px] text-[var(--ink-muted)]">
                      {new Date(game.date).toLocaleDateString('nb-NO')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
