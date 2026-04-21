import { createFileRoute, Link } from '@tanstack/react-router'
import { getGame } from '~/server/games'
import { SectionBar } from '~/components/nidaros/SectionBar'
import { Avatar } from '~/components/nidaros/Avatar'
import { JerseyNumber } from '~/components/nidaros/JerseyNumber'
import { Chip } from '~/components/nidaros/Chip'

export const Route = createFileRoute('/games/$id')({
  loader: ({ params }) => getGame(params.id),
  component: GamePage,
})

function GamePage() {
  const game = Route.useLoaderData()

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {game.heroImageUrl && (
        <div className="w-full aspect-video rounded-xl overflow-hidden">
          <img src={game.heroImageUrl} alt={game.name} className="w-full h-full object-cover" />
        </div>
      )}

      <header>
        <div className="flex items-center gap-2 mb-2">
          <Link
            to="/tournaments/$slug"
            params={{ slug: game.tournament.slug }}
            className="font-mono-upper text-[var(--ink-muted)] text-xs hover:text-[var(--accent)]"
          >
            {game.tournament.name}
          </Link>
          {game.gameType?.icon && (
            <>
              <span className="text-[var(--ink-muted)]">·</span>
              <span className="text-lg">{game.gameType.icon}</span>
            </>
          )}
          {game.status === 'LIVE' && <Chip label="LIVE" variant="accent" />}
        </div>
        <h1 className="font-display text-4xl">{game.name}</h1>
        {game.location && <p className="text-[var(--ink-dim)] mt-1">📍 {game.location}</p>}
        {game.date && (
          <p className="font-mono-upper text-[var(--ink-muted)] text-xs mt-2">
            {new Date(game.date).toLocaleDateString('nb-NO', { dateStyle: 'long' })}
          </p>
        )}
      </header>

      {game.firstPlace.length > 0 && (
        <section>
          <SectionBar label="Resultat" />
          <div className="space-y-2">
            {[
              { place: 1, players: game.firstPlace },
              { place: 2, players: game.secondPlace },
              { place: 3, players: game.thirdPlace },
            ].filter(r => r.players.length > 0).map(({ place, players }) => (
              <div key={place} className="flex items-center gap-3 p-3 rounded border border-[var(--line)] bg-[var(--surface)]">
                <JerseyNumber place={place} />
                <div className="flex items-center gap-2 flex-wrap">
                  {players.map(p => (
                    <Link
                      key={p.id}
                      to="/players/$id"
                      params={{ id: p.id }}
                      className="flex items-center gap-2 hover:text-[var(--accent)]"
                    >
                      <Avatar name={`${p.firstName} ${p.lastName}`} src={p.imageUrl} size="sm" />
                      <span className="text-sm">{p.firstName} {p.lastName}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {game.story && (
        <section>
          <SectionBar label="Slik gikk det" />
          <p className="text-[var(--ink-dim)] leading-relaxed whitespace-pre-line">{game.story}</p>
        </section>
      )}

      {game.gallery.length > 0 && (
        <section>
          <SectionBar label={`Bilder (${game.gallery.length})`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {game.gallery.map(media => (
              <div key={media.id} className="aspect-square rounded overflow-hidden bg-[var(--surface-alt)]">
                <img src={media.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {game.participants.length > 0 && (
        <section>
          <SectionBar label="Deltakere" />
          <div className="flex flex-wrap gap-2">
            {game.participants.map(p => (
              <Link
                key={p.id}
                to="/players/$id"
                params={{ id: p.id }}
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors"
              >
                <Avatar name={`${p.firstName} ${p.lastName}`} src={p.imageUrl} size="sm" />
                <span className="text-sm">{p.firstName}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
