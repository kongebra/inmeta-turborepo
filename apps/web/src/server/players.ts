import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'

export const getPlayers = createServerFn({ method: 'GET' }).handler(async () => {
  return db.player.findMany({
    include: { signatureGame: true },
    orderBy: { firstName: 'asc' },
  })
})

export const getPlayer = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    return db.player.findUniqueOrThrow({
      where: { id },
      include: {
        signatureGame: true,
        participatedGames: {
          include: { tournament: true, gameType: true },
          orderBy: { date: 'desc' },
        },
        firstPlaceGames: true,
        secondPlaceGames: true,
        thirdPlaceGames: true,
        playerBadges: { include: { badge: true } },
      },
    })
  })
