import { createFileRoute } from '@tanstack/react-router'
import { getBadges } from '~/server/achievements'
import { BadgeHex } from '~/components/nidaros/BadgeHex'
import { SectionBar } from '~/components/nidaros/SectionBar'
import { Chip } from '~/components/nidaros/Chip'

export const Route = createFileRoute('/achievements')({
  loader: () => getBadges(),
  component: AchievementsPage,
})

const rarityOrder = ['LEGENDARY', 'RARE', 'UNCOMMON', 'COMMON'] as const

function AchievementsPage() {
  const badges = Route.useLoaderData()
  const sorted = [...badges].sort(
    (a, b) => rarityOrder.indexOf(a.rarity as any) - rarityOrder.indexOf(b.rarity as any)
  )

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-4xl mb-8">Merker</h1>
      <div className="space-y-10">
        {rarityOrder.map(rarity => {
          const group = sorted.filter(b => b.rarity === rarity)
          if (!group.length) return null
          return (
            <section key={rarity}>
              <SectionBar label={rarity} />
              <div className="grid sm:grid-cols-2 gap-4">
                {group.map(badge => (
                  <div key={badge.id} className="flex gap-4 p-4 rounded-lg border border-[var(--line)] bg-[var(--surface)]">
                    <BadgeHex icon={badge.icon} name={badge.name} rarity={badge.rarity as any} />
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{badge.name}</p>
                      {badge.description && (
                        <p className="text-xs text-[var(--ink-muted)] mt-0.5">{badge.description}</p>
                      )}
                      {badge.playerBadges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {badge.playerBadges.map(pb => (
                            <Chip key={pb.id} label={`${pb.player.firstName} ${pb.player.lastName}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
