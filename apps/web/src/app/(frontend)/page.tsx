// apps/web/src/app/(frontend)/page.tsx
import { getPayload } from '@/lib/payload'
import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
import { JerseyNumber } from '@/components/ui/JerseyNumber'
import { SectionBar } from '@/components/ui/SectionBar'
import { calculateScoreboard } from '@/lib/scoreboard'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload()

  const [tournamentsRes, gamesRes] = await Promise.all([
    payload.find({ collection: 'tournaments', where: { status: { equals: 'active' } }, limit: 1, depth: 1 }),
    payload.find({ collection: 'games', sort: '-date', limit: 4, depth: 2 }),
  ])

  const activeTournament = tournamentsRes.docs[0]
  const recentGames = gamesRes.docs

  // Build scoreboard from all games in active tournament
  let scoreboard: ReturnType<typeof calculateScoreboard> = []
  if (activeTournament) {
    const allGames = await payload.find({
      collection: 'games',
      where: { tournament: { equals: activeTournament.id } },
      limit: 100,
      depth: 2,
    })
    const rules = activeTournament.pointRules ?? {
      participation: 3, firstPlace: 3, secondPlace: 2, thirdPlace: 1,
      organizedWithParticipation: 1, organizedWithoutParticipation: 3, spectator: 1,
    }
    const gameResults = allGames.docs.map((g) => ({
      participants: Array.isArray(g.participants) ? g.participants.map((p: { id: string } | string) => typeof p === 'string' ? p : p.id) : [],
      firstPlace:   Array.isArray(g.firstPlace)   ? g.firstPlace.map((p: { id: string } | string)   => typeof p === 'string' ? p : p.id) : [],
      secondPlace:  Array.isArray(g.secondPlace)  ? g.secondPlace.map((p: { id: string } | string)  => typeof p === 'string' ? p : p.id) : [],
      thirdPlace:   Array.isArray(g.thirdPlace)   ? g.thirdPlace.map((p: { id: string } | string)   => typeof p === 'string' ? p : p.id) : [],
      organizers:   Array.isArray(g.organizers)   ? g.organizers.map((p: { id: string } | string)   => typeof p === 'string' ? p : p.id) : [],
      spectators:   Array.isArray(g.spectators)   ? g.spectators.map((p: { id: string } | string)   => typeof p === 'string' ? p : p.id) : [],
    }))
    scoreboard = calculateScoreboard(gameResults, rules)
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Hero */}
      <div className="bg-ink text-bg p-8 mb-6 relative overflow-hidden">
        <div className="relative">
          <div className="font-mono text-[13px] text-accent mb-2">
            {activeTournament ? `◉ AKTIV · ${activeTournament.name}` : 'INGEN AKTIV TURNERING'}
          </div>
          <h1 className="font-display text-6xl leading-none">
            Trønder<br />
            <span className="text-accent">Leikan</span>
          </h1>
          {activeTournament && scoreboard[0] && (
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-mono text-[13px] text-ink-dim">LEIAR NO</span>
              <span className="font-display text-2xl">{scoreboard[0].playerId}</span>
              <span className="font-display text-4xl text-accent font-num">{scoreboard[0].points}p</span>
            </div>
          )}
        </div>
      </div>

      {/* Top 3 */}
      {scoreboard.length > 0 && (
        <div className="mb-6">
          <SectionBar title="Topp 3" subtitle="SCOREBOARD" />
          <div className="grid grid-cols-3 gap-3 p-4 bg-surface border border-line">
            {scoreboard.slice(0, 3).map((entry, i) => (
              <div
                key={entry.playerId}
                className={`p-5 relative overflow-hidden ${i === 0 ? 'bg-accent text-accent-ink' : 'bg-surface border border-line'}`}
              >
                <div className="font-display text-9xl leading-none opacity-10 absolute top-0 left-0">{i + 1}</div>
                <JerseyNumber n={i + 1} size={36} highlight={i === 0} />
                <div className="font-display text-xl mt-3">{entry.playerId}</div>
                <div className="font-display text-4xl font-num mt-2">{entry.points}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent games */}
      {recentGames.length > 0 && (
        <div>
          <SectionBar title="Siste spill" subtitle="KRONOLOGISK" />
          <div className="grid grid-cols-4 gap-3 p-4 bg-surface border border-line border-t-0">
            {recentGames.map((game) => {
              const winner = Array.isArray(game.firstPlace) && game.firstPlace.length > 0 && typeof game.firstPlace[0] === 'object' ? game.firstPlace[0] : null
              return (
                <a
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="bg-bg border border-line p-4 hover:border-accent transition-colors block"
                >
                  <div className="font-mono text-[11px] text-accent mb-2">
                    {game.date ? new Date(game.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' }) : '—'}
                  </div>
                  <div className="font-display text-xl mb-3">{game.name}</div>
                  {winner && typeof winner === 'object' && 'firstName' in winner && (
                    <div className="flex items-center gap-2">
                      <Avatar initials={`${winner.firstName[0]}${winner.lastName[0]}`} size={26} />
                      <span className="font-sans text-sm font-semibold">{winner.firstName} {winner.lastName[0]}.</span>
                    </div>
                  )}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
