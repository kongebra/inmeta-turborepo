import { createFileRoute, Link } from '@tanstack/react-router'
import { getPlayer } from '~/server/players'
import { Avatar } from '~/components/nidaros/Avatar'
import { BadgeHex } from '~/components/nidaros/BadgeHex'
import { JerseyNumber } from '~/components/nidaros/JerseyNumber'
import { SectionBar } from '~/components/nidaros/SectionBar'
import { Chip } from '~/components/nidaros/Chip'

export const Route = createFileRoute('/players/$id')({
  loader: ({ params }) => getPlayer(params.id),
  component: PlayerPage,
})

function PlayerPage() {
  const player = Route.useLoaderData()
  const wins = player.firstPlaceGames.length
  const podiums = wins + player.secondPlaceGames.length + player.thirdPlaceGames.length
  const gamesPlayed = player.participatedGames.length

  const recentForm = player.participatedGames.slice(0, 5).map(game => {
    if (player.firstPlaceGames.find(g => g.id === game.id)) return { game, place: 1 }
    if (player.secondPlaceGames.find(g => g.id === game.id)) return { game, place: 2 }
    if (player.thirdPlaceGames.find(g => g.id === game.id)) return { game, place: 3 }
    return { game, place: 99 }
  })

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <header className="flex items-start gap-6">
        <Avatar
          name={`${player.firstName} ${player.lastName}`}
          src={player.imageUrl}
          size="lg"
        />
        <div>
          <h1 className="font-display text-4xl">
            {player.firstName} {player.lastName}
          </h1>
          {player.nickname && (
            <p className="font-serif text-xl text-[var(--ink-dim)] mt-1">"{player.nickname}"</p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {player.homeBase && <Chip label={player.homeBase} />}
            {player.signatureGame && (
              <Chip
                label={`${player.signatureGame.icon ?? ''} ${player.signatureGame.name}`}
                variant="accent"
              />
            )}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-4">
        {[
          { label: 'Spill', value: gamesPlayed },
          { label: 'Seire', value: wins },
          { label: 'Pall', value: podiums },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-center">
            <p className="font-display text-3xl text-[var(--accent)] tnum">{value}</p>
            <p className="font-mono-upper text-[var(--ink-muted)] text-xs mt-1">{label}</p>
          </div>
        ))}
      </section>

      {recentForm.length > 0 && (
        <section>
          <SectionBar label="Siste form" />
          <div className="flex gap-2">
            {recentForm.map(({ game, place }) => (
              <Link key={game.id} to="/games/$id" params={{ id: game.id }}>
                <JerseyNumber place={place} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {player.playerBadges.length > 0 && (
        <section>
          <SectionBar label={`Merker (${player.playerBadges.length})`} />
          <div className="flex flex-wrap gap-4">
            {player.playerBadges.map(({ badge, id }) => (
              <BadgeHex
                key={id}
                icon={badge.icon}
                name={badge.name}
                rarity={badge.rarity}
              />
            ))}
          </div>
        </section>
      )}

      {player.participatedGames.length > 0 && (
        <section>
          <SectionBar label="Spill-historikk" />
          <div className="space-y-2">
            {player.participatedGames.slice(0, 10).map(game => (
              <Link
                key={game.id}
                to="/games/$id"
                params={{ id: game.id }}
                className="flex items-center justify-between p-3 rounded border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{game.name}</p>
                  <p className="text-xs text-[var(--ink-muted)]">{game.tournament.name}</p>
                </div>
                {game.date && (
                  <span className="font-mono-upper text-[10px] text-[var(--ink-muted)]">
                    {new Date(game.date).toLocaleDateString('nb-NO')}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
