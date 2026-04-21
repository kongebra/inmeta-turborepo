import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'

export const getGame = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    return db.game.findUniqueOrThrow({
      where: { id },
      include: {
        tournament: true,
        gameType: true,
        organizers: true,
        participants: true,
        spectators: true,
        firstPlace: true,
        secondPlace: true,
        thirdPlace: true,
        highlights: true,
        gallery: { orderBy: { order: 'asc' } },
        timeResults: {
          include: { player: true },
          orderBy: [{ round: 'asc' }, { lapTime: 'asc' }],
        },
      },
    })
  })

export const getRecentGames = createServerFn({ method: 'GET' }).handler(async () => {
  return db.game.findMany({
    where: { status: { in: ['LIVE', 'DONE'] } },
    orderBy: { date: 'desc' },
    take: 10,
    include: {
      tournament: true,
      gameType: true,
      firstPlace: true,
      secondPlace: true,
      thirdPlace: true,
    },
  })
})

export const getAllGames = createServerFn({ method: 'GET' }).handler(async () => {
  return db.game.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tournament: true, gameType: true },
  })
})
