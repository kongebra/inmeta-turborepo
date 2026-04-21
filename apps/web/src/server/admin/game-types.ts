import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '~/lib/db'
import { requireAuth } from './auth-guard'

const GameTypeInput = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  icon: z.string().optional(),
})

export const createGameType = createServerFn({ method: 'POST' })
  .inputValidator(GameTypeInput)
  .handler(async ({ data }) => {
    await requireAuth()
    return db.gameType.create({ data })
  })

export const updateGameType = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string(), data: GameTypeInput }))
  .handler(async ({ data: { id, data } }) => {
    await requireAuth()
    return db.gameType.update({ where: { id }, data })
  })

export const deleteGameType = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await requireAuth()
    return db.gameType.delete({ where: { id } })
  })

export const getGameTypes = createServerFn({ method: 'GET' }).handler(async () =>
  db.gameType.findMany({ orderBy: { name: 'asc' } })
)
