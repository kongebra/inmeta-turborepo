import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '~/lib/db'

const GameTypeInput = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  icon: z.string().optional(),
})

export const createGameType = createServerFn({ method: 'POST' })
  .validator(GameTypeInput.parse)
  .handler(async ({ data }) => db.gameType.create({ data }))

export const updateGameType = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string(), data: GameTypeInput }).parse)
  .handler(async ({ data: { id, data } }) => db.gameType.update({ where: { id }, data }))

export const deleteGameType = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => db.gameType.delete({ where: { id } }))

export const getGameTypes = createServerFn({ method: 'GET' }).handler(async () =>
  db.gameType.findMany({ orderBy: { name: 'asc' } })
)
