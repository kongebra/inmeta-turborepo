import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'

export const getBadges = createServerFn({ method: 'GET' }).handler(async () => {
  return db.badge.findMany({
    include: {
      playerBadges: { include: { player: true } },
    },
    orderBy: [{ rarity: 'asc' }, { name: 'asc' }],
  })
})
