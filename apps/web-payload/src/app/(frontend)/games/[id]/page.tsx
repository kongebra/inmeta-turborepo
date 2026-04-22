// apps/web/src/app/(frontend)/games/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
import { JerseyNumber } from '@/components/ui/JerseyNumber'


type Props = { params: Promise<{ id: string }> }

type PlayerRef = { id: string | number; firstName: string; lastName: string }

export default async function GamePage({ params }: Props) {
  const { id } = await params
  const payload = await getPayload()

  const game = await payload.findByID({ collection: 'games', id, depth: 2 })
  if (!game) notFound()

  const toPlayers = (arr: unknown): PlayerRef[] =>
    Array.isArray(arr) ? (arr as Array<PlayerRef | string>).filter((p): p is PlayerRef => typeof p === 'object' && p !== null) : []

  const first    = toPlayers(game.firstPlace)
  const second   = toPlayers(game.secondPlace)
  const third    = toPlayers(game.thirdPlace)
  const allParticipants = toPlayers(game.participants)
  const organizers = toPlayers(game.organizers)
  const spectators = toPlayers(game.spectators)

  const top3Ids = new Set([...first, ...second, ...third].map(p => String(p.id)))
  const others = allParticipants.filter(p => !top3Ids.has(String(p.id)))

  const allResults = [
    ...first.map(p  => ({ player: p, place: 1 })),
    ...second.map(p => ({ player: p, place: 2 })),
    ...third.map(p  => ({ player: p, place: 3 })),
    ...others.map((p, i) => ({ player: p, place: 4 + i })),
  ]

  const tournament = typeof game.tournament === 'object' && game.tournament !== null ? game.tournament as { slug?: string; name?: string } : null

  const duration = typeof game.duration === 'number' ? game.duration : null

  const facts: [string, string][] = [
    ['Dato',      game.date ? new Date(game.date as string).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
    ['Stad',      typeof game.location === 'string' && game.location ? game.location : '—'],
    ['Format',    typeof game.format === 'string' ? game.format : 'placement'],
    ['Deltakarar', String(allParticipants.length)],
    ...(duration ? [['Varigheit', `${Math.floor(duration / 60)}t ${duration % 60}min`] as [string, string]] : []),
    ...(Array.isArray(game.gallery) && game.gallery.length > 0 ? [['Foto', String(game.gallery.length)] as [string, string]] : []),
  ]

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-2 font-mono text-[11px] text-ink-muted">
        {tournament?.slug ? (
          <a href={`/tournaments/${tournament.slug}`} className="hover:text-ink">
            ← {tournament.name}
          </a>
        ) : '← Tilbake'}
      </div>

      {typeof game.format === 'string' && game.format !== 'placement' && (
        <Chip tone="outline" className="mb-3">
          {game.format === 'time' ? '⏱ TID' : game.format === 'bracket' ? '⚔ CUP' : String(game.format).toUpperCase()}
        </Chip>
      )}

      <h1 className="font-display text-5xl leading-none mb-3">{game.name as string}</h1>
      <div className="font-sans text-base text-ink-dim mb-8">
        {game.date ? new Date(game.date as string).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' }) : ''}
        {typeof game.location === 'string' && game.location && ` · ${game.location}`}
        {organizers.length > 0 && ` · Arr. ${organizers.map(p => p.firstName).join(', ')}`}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-8">
        {/* Left: results */}
        <div>
          {game.story && (
            <div className="mb-6">
              <div className="font-mono text-[13px] text-accent mb-3">KORT HISTORIE</div>
              <div className="font-serif text-xl italic text-ink leading-relaxed">
                Historikk tilgjengeleg i admin.
              </div>
            </div>
          )}

          <div className="font-mono text-[13px] text-ink-muted font-semibold mb-3">PLASSERINGAR</div>
          <div className="border border-line">
            {allResults.map((r, i) => (
              <div key={String(r.player.id)} className={`
                flex items-center gap-4 px-4 py-3 border-b border-line-soft last:border-b-0
                ${r.place === 1 ? 'bg-accent text-accent-ink' : i % 2 === 0 ? 'bg-surface' : ''}
              `}>
                <JerseyNumber n={r.place} size={32} highlight={false} />
                <Avatar
                  initials={`${r.player.firstName[0]}${r.player.lastName[0]}`}
                  size={32}
                  tone={i}
                />
                <div className="flex-1 font-semibold text-base">
                  {r.player.firstName} {r.player.lastName}
                </div>
                {r.place === 1 && <Chip tone="ink">🏆 +3P</Chip>}
                {r.place === 2 && <span className="font-mono text-[13px] text-silver font-bold">+2P</span>}
                {r.place === 3 && <span className="font-mono text-[13px] text-bronze font-bold">+1P</span>}
              </div>
            ))}
          </div>

          {spectators.length > 0 && (
            <div className="mt-4 font-mono text-[11px] text-ink-muted">
              TILSKODARAR: {spectators.map(p => p.firstName).join(', ')}
            </div>
          )}
        </div>

        {/* Right: facts */}
        <aside>
          <div className="bg-surface border border-line p-5">
            <div className="font-mono text-[11px] text-ink-muted mb-4">FAKTA</div>
            {facts.map(([k, v], i) => (
              <div key={k} className={`flex justify-between py-3 ${i < facts.length - 1 ? 'border-b border-line-soft' : ''}`}>
                <span className="font-mono text-[11px] text-ink-muted">{k.toUpperCase()}</span>
                <span className="font-sans text-base font-medium">{v}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
