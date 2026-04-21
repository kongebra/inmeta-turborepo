// apps/web/src/app/(frontend)/players/page.tsx
import { getPayload } from '@/lib/payload'
import { Avatar } from '@/components/ui/Avatar'
import { SectionBar } from '@/components/ui/SectionBar'

export const revalidate = 60

type PlayerDoc = {
  id: string | number
  firstName: string
  lastName: string
  nickname?: string | null
  homeBase?: string | null
  signatureGame?: { name: string } | string | null
}

export default async function PlayersPage() {
  const payload = await getPayload()
  const res = await payload.find({ collection: 'players', sort: 'firstName', limit: 100, depth: 1 })
  const players = res.docs as unknown as PlayerDoc[]

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <SectionBar title={`${players.length} i gjengen`} />
      <div className="grid grid-cols-3 gap-4 p-4 border border-line border-t-0 bg-surface">
        {players.map((p, i) => (
          <a key={String(p.id)} href={`/players/${p.id}`}
            className="bg-bg border border-line p-5 hover:border-accent transition-colors relative overflow-hidden block"
          >
            <div className="absolute top-[-8px] right-[-6px] font-display text-8xl leading-none text-line-soft font-num opacity-60">{i + 1}</div>
            <div className="relative flex items-center gap-4">
              <Avatar initials={`${p.firstName[0]}${p.lastName[0]}`} size={52} tone={i} />
              <div>
                <div className="font-display text-lg leading-tight">{p.firstName}</div>
                <div className="font-display text-lg leading-tight text-ink-dim">{p.lastName.split(' ').pop()}</div>
              </div>
            </div>
            {p.nickname && (
              <div className="font-mono text-[13px] text-accent mt-3 font-semibold">
                «{p.nickname.toUpperCase()}»
              </div>
            )}
            {(p.homeBase || p.signatureGame) && (
              <div className="font-sans text-sm text-ink-dim mt-1">
                {[p.homeBase, typeof p.signatureGame === 'object' && p.signatureGame ? (p.signatureGame as {name:string}).name : null].filter(Boolean).join(' · ')}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
