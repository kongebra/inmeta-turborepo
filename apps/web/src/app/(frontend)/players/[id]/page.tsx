// apps/web/src/app/(frontend)/players/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
import { FormCell } from '@/components/ui/FormCell'
import { SectionBar } from '@/components/ui/SectionBar'
import { calculateScoreboard } from '@/lib/scoreboard'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

type PlayerRef = { id: string | number; firstName: string; lastName: string }
type GameDoc = {
  id: string | number
  name: string
  date?: string | null
  location?: string | null
  firstPlace?: Array<PlayerRef | string>
  secondPlace?: Array<PlayerRef | string>
  thirdPlace?: Array<PlayerRef | string>
  participants?: Array<PlayerRef | string>
  organizers?: Array<PlayerRef | string>
  spectators?: Array<PlayerRef | string>
}

export default async function PlayerProfilePage({ params }: Props) {
  const { id } = await params
  const payload = await getPayload()

  const player = await payload.findByID({ collection: 'players', id, depth: 2 }) as unknown as {
    id: string | number
    firstName: string
    lastName: string
    nickname?: string | null
    homeBase?: string | null
    funFact?: string | null
    signatureGame?: { name: string; icon?: string } | string | null
  }
  if (!player) notFound()

  const gamesRes = await payload.find({
    collection: 'games',
    where: { participants: { in: [id] } },
    sort: 'date',
    limit: 100,
    depth: 2,
  })
  const games = gamesRes.docs as unknown as GameDoc[]

  const toIds = (arr: unknown) =>
    Array.isArray(arr) ? arr.map((p) => typeof p === 'string' ? p : (p as {id:string|number}).id.toString()) : []

  // Build form (last 5 placements)
  const form = games.slice(-7).map(g => {
    const first  = toIds(g.firstPlace).includes(id)
    const second = toIds(g.secondPlace).includes(id)
    const third  = toIds(g.thirdPlace).includes(id)
    return first ? 1 : second ? 2 : third ? 3 : 99
  }).slice(-5)

  const defaultRules = { participation: 3, firstPlace: 3, secondPlace: 2, thirdPlace: 1, organizedWithParticipation: 1, organizedWithoutParticipation: 3, spectator: 1 }
  const gameResults = games.map(g => ({
    participants: toIds(g.participants),
    firstPlace:   toIds(g.firstPlace),
    secondPlace:  toIds(g.secondPlace),
    thirdPlace:   toIds(g.thirdPlace),
    organizers:   toIds(g.organizers),
    spectators:   toIds(g.spectators),
  }))
  const board = calculateScoreboard(gameResults, defaultRules)
  const myEntry = board.find(e => e.playerId === id)
  const sigGame = typeof player.signatureGame === 'object' && player.signatureGame !== null ? player.signatureGame as { name: string; icon?: string } : null

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Hero */}
      <div className="bg-ink text-bg p-8 mb-6 relative overflow-hidden">
        <div className="relative flex gap-6 items-center">
          <Avatar initials={`${player.firstName[0]}${player.lastName[0]}`} size={120} tone={0} accentBorder />
          <div>
            <div className="font-mono text-[13px] text-accent font-semibold mb-2">
              {[player.homeBase, player.nickname ? `«${player.nickname}»` : null].filter(Boolean).join(' · ')}
            </div>
            <h1 className="font-display text-5xl leading-none">{player.firstName}</h1>
            <div className="font-display text-5xl text-accent leading-none">{player.lastName}</div>
            {sigGame && (
              <div className="font-serif italic text-xl text-ink-dim mt-3">
                {sigGame.icon ? `${sigGame.icon} ` : ''}{sigGame.name}-spesialist
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      {myEntry && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {([
            ['POENG', myEntry.points],
            ['SPELT', myEntry.gamesPlayed],
            ['SIGRAR', myEntry.wins],
            ['2. PLASS', myEntry.secondPlaces],
          ] as [string, number][]).map(([label, val]) => (
            <div key={label} className="bg-surface border border-line p-4">
              <div className="font-mono text-[11px] text-ink-muted">{label}</div>
              <div className="font-display text-3xl font-num mt-1 text-accent">{val}</div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {form.length > 0 && (
        <div className="mb-6">
          <div className="font-mono text-[13px] text-ink-muted mb-3">FORM (SISTE {form.length} SPILL)</div>
          <div className="flex gap-2">
            {form.map((p, i) => <FormCell key={i} placement={p} size={32} />)}
          </div>
        </div>
      )}

      {/* Game history */}
      <SectionBar title="Spill-historikk" subtitle={`${games.length} SPILL`} />
      <div className="border border-line border-t-0">
        {games.slice().reverse().map((game, i) => {
          const first  = toIds(game.firstPlace).includes(id)
          const second = toIds(game.secondPlace).includes(id)
          const third  = toIds(game.thirdPlace).includes(id)
          const place  = first ? 1 : second ? 2 : third ? 3 : null
          return (
            <a key={String(game.id)} href={`/games/${game.id}`}
              className={`flex items-center gap-4 px-4 py-3 border-b border-line-soft last:border-b-0 hover:bg-surface transition-colors ${i % 2 === 0 ? 'bg-surface' : ''}`}
            >
              <div className="font-mono text-[11px] text-ink-muted w-16">
                {game.date ? new Date(game.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' }).toUpperCase() : '—'}
              </div>
              <div className="flex-1 font-semibold">{game.name}</div>
              <div className="font-mono text-[11px] text-ink-muted">{game.location ?? ''}</div>
              {place ? (
                <Chip tone={place === 1 ? 'accent' : 'outline'}>
                  {place}. plass
                </Chip>
              ) : (
                <span className="font-mono text-[11px] text-ink-muted">Deltok</span>
              )}
            </a>
          )
        })}
      </div>

      {/* Fun fact */}
      {player.funFact && (
        <div className="mt-6 p-5 bg-surface border border-line">
          <div className="font-mono text-[11px] text-accent mb-2">VISSTE DU?</div>
          <div className="font-sans text-base">{player.funFact}</div>
        </div>
      )}
    </div>
  )
}
