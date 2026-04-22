import { createServerFn } from '@tanstack/react-start'
import { db } from '~/lib/db'

export const getTournaments = createServerFn({ method: 'GET' }).handler(async () => {
  return db.tournament.findMany({
    orderBy: [{ status: 'asc' }, { startDate: 'desc' }],
    include: {
      games: {
        where: { status: { not: 'CANCELLED' } },
        orderBy: { date: 'desc' },
        take: 5,
        include: { gameType: true },
      },
    },
  })
})

export const getTournament = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return db.tournament.findUniqueOrThrow({
      where: { slug },
      include: {
        games: {
          where: { status: { not: 'CANCELLED' } },
          orderBy: { date: 'desc' },
          include: {
            gameType: true,
            participants: true,
            firstPlace: true,
            secondPlace: true,
            thirdPlace: true,
          },
        },
      },
    })
  })
