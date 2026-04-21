// apps/web/src/app/(frontend)/tournaments/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
import { JerseyNumber } from '@/components/ui/JerseyNumber'
import { FormCell } from '@/components/ui/FormCell'
import { SectionBar } from '@/components/ui/SectionBar'
import { calculateScoreboard } from '@/lib/scoreboard'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export default async function TournamentPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload()

  const res = await payload.find({
    collection: 'tournaments',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const tournament = res.docs[0]
  if (!tournament) notFound()

  const gamesRes = await payload.find({
    collection: 'games',
    where: { tournament: { equals: tournament.id } },
    sort: 'date',
    limit: 100,
    depth: 2,
  })
  const games = gamesRes.docs

  const rules = tournament.pointRules ?? {
    participation: 3, firstPlace: 3, secondPlace: 2, thirdPlace: 1,
    organizedWithParticipation: 1, organizedWithoutParticipation: 3, spectator: 1,
  }

  // Build player → last 5 form map
  const playerGames = new Map<string, (number | null)[]>()
  for (const game of games) {
    const allParticipants = [
      ...(Array.isArray(game.participants) ? game.participants : []),
      ...(Array.isArray(game.organizers) ? game.organizers : []),
    ]
    for (const p of allParticipants) {
      const pid = typeof p === 'string' ? p : (p as { id: string }).id
      const first  = Array.isArray(game.firstPlace)  && (game.firstPlace as Array<{id:string}|string>).some(x => (typeof x === 'string' ? x : x.id) === pid)
      const second = Array.isArray(game.secondPlace) && (game.secondPlace as Array<{id:string}|string>).some(x => (typeof x === 'string' ? x : x.id) === pid)
      const third  = Array.isArray(game.thirdPlace)  && (game.thirdPlace as Array<{id:string}|string>).some(x => (typeof x === 'string' ? x : x.id) === pid)
      const placement = first ? 1 : second ? 2 : third ? 3 : 99
      if (!playerGames.has(pid)) playerGames.set(pid, [])
      playerGames.get(pid)!.push(placement)
    }
  }

  const toIds = (arr: unknown) =>
    Array.isArray(arr) ? arr.map((p) => typeof p === 'string' ? p : (p as {id:string}).id) : []

  const gameResults = games.map((g) => ({
    participants: toIds(g.participants),
    firstPlace:   toIds(g.firstPlace),
    secondPlace:  toIds(g.secondPlace),
    thirdPlace:   toIds(g.thirdPlace),
    organizers:   toIds(g.organizers),
    spectators:   toIds(g.spectators),
  }))
  const scoreboard = calculateScoreboard(gameResults, rules)

  // Fetch player details for display
  const playerIds = scoreboard.map(e => e.playerId)
  const playersRes = playerIds.length > 0
    ? await payload.find({ collection: 'players', where: { id: { in: playerIds } }, limit: 50, depth: 1 })
    : { docs: [] }
  type PlayerDoc = { id: string | number; firstName: string; lastName: string; nickname?: string | null }
  const playersMap = new Map((playersRes.docs as unknown as PlayerDoc[]).map((p) => [String(p.id), p]))

  const statusLabel: Record<string, string> = { planned: 'PLANLAGT', active: 'AKTIV', finished: 'FERDIG' }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-2 font-mono text-[11px] text-ink-muted">← Alle turneringa</div>
      <div className="flex items-baseline gap-4 mb-2">
        <h1 className="font-display text-5xl leading-none">{tournament.name}</h1>
        <Chip tone="outline">{statusLabel[tournament.status ?? 'planned']}</Chip>
      </div>
      <div className="font-mono text-[13px] text-ink-muted mb-8">
        {games.length} spill spelt
        {tournament.startDate && ` · startet ${new Date(tournament.startDate).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}`}
      </div>

      {/* Scoreboard */}
      <SectionBar title="Scoreboard" subtitle={`SESONG ${tournament.year ?? ''}`} />
      <div className="border border-line border-t-0">
        <table className="w-full border-collapse font-sans text-base">
          <thead>
            <tr className="font-mono text-[11px] text-ink-muted border-b border-line">
              <th className="text-left p-3 w-12">#</th>
              <th className="text-left p-3">SPELLAR</th>
              <th className="text-center p-2 w-12">DEL</th>
              <th className="text-center p-2 w-12">🥇</th>
              <th className="text-center p-2 w-12">🥈</th>
              <th className="text-center p-2 w-12">🥉</th>
              <th className="text-left p-3 w-32">FORM</th>
              <th className="text-right p-3 w-24">POENG</th>
            </tr>
          </thead>
          <tbody>
            {scoreboard.map((entry, i) => {
              const player = playersMap.get(entry.playerId)
              const form = (playerGames.get(entry.playerId) ?? []).slice(-5)
              return (
                <tr key={entry.playerId} className="border-t border-line-soft hover:bg-surface transition-colors">
                  <td className="p-3">
                    <JerseyNumber n={i + 1} size={36} highlight={i < 3} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        initials={player ? `${player.firstName[0]}${player.lastName[0]}` : '??'}
                        size={40}
                        tone={i}
                      />
                      <div>
                        <div className="font-semibold">{player ? `${player.firstName} ${player.lastName}` : entry.playerId}</div>
                        {player?.nickname && (
                          <div className="font-mono text-[11px] text-ink-muted">«{String(player.nickname).toUpperCase()}»</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-center font-num text-ink-dim">{entry.gamesPlayed}</td>
                  <td className="p-2 text-center font-num text-gold font-bold">{entry.wins || '—'}</td>
                  <td className="p-2 text-center font-num text-silver font-bold">{entry.secondPlaces || '—'}</td>
                  <td className="p-2 text-center font-num text-bronze font-bold">{entry.thirdPlaces || '—'}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {form.map((p, j) => <FormCell key={j} placement={p ?? undefined} size={18} />)}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`font-display text-2xl font-num ${i < 3 ? 'text-accent' : ''}`}>
                      {entry.points}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Games grid */}
      <div className="mt-8">
        <SectionBar title={`${games.length} spill spelt`} />
        <div className="grid grid-cols-4 gap-3 p-4 border border-line border-t-0 bg-surface">
          {games.map((game, i) => {
            const winner = Array.isArray(game.firstPlace) && game.firstPlace.length > 0 && typeof game.firstPlace[0] === 'object' ? game.firstPlace[0] as {firstName:string;lastName:string} : null
            return (
              <a key={game.id} href={`/games/${game.id}`}
                className="bg-bg border border-line p-4 hover:border-accent transition-colors block"
              >
                <div className="flex justify-between items-baseline mb-3">
                  <JerseyNumber n={i + 1} size={28} />
                  <span className="font-mono text-[11px] text-ink-muted">
                    {game.date ? new Date(game.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' }).toUpperCase() : '—'}
                  </span>
                </div>
                <div className="font-display text-lg mb-1">{game.name}</div>
                <div className="font-mono text-[11px] text-ink-muted mb-3">{typeof game.location === 'string' ? game.location.toUpperCase() : ''}</div>
                {winner && (
                  <div className="flex items-center gap-2 pt-3 border-t border-line-soft">
                    <Avatar initials={`${winner.firstName[0]}${winner.lastName[0]}`} size={26} />
                    <span className="text-sm font-semibold">{winner.firstName} {winner.lastName[0]}.</span>
                  </div>
                )}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
