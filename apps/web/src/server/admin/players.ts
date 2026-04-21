import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '~/lib/db'

const PlayerInput = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  nickname: z.string().optional(),
  homeBase: z.string().optional(),
  funFact: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  signatureGameId: z.string().optional(),
})

export const createPlayer = createServerFn({ method: 'POST' })
  .inputValidator(PlayerInput)
  .handler(async ({ data }) => {
    return db.player.create({
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
        signatureGameId: data.signatureGameId || null,
      },
    })
  })

export const updatePlayer = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string(), data: PlayerInput }))
  .handler(async ({ data: { id, data } }) => {
    return db.player.update({
      where: { id },
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
        signatureGameId: data.signatureGameId || null,
      },
    })
  })

export const deletePlayer = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.player.delete({ where: { id } })
  })
