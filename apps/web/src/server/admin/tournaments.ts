import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '~/lib/db'
import { requireAuth } from './auth-guard'

const TournamentInput = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  status: z.enum(['PLANNED', 'ACTIVE', 'FINISHED']).default('PLANNED'),
  startDate: z.string().optional(),
  year: z.number().int().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  posterImageUrl: z.string().url().optional().or(z.literal('')),
  pointParticipation: z.number().int().default(3),
  pointFirstPlace: z.number().int().default(3),
  pointSecondPlace: z.number().int().default(2),
  pointThirdPlace: z.number().int().default(1),
  pointOrganizedWithParticipation: z.number().int().default(1),
  pointOrganizedWithoutParticipation: z.number().int().default(3),
  pointSpectator: z.number().int().default(1),
})

export const createTournament = createServerFn({ method: 'POST' })
  .inputValidator(TournamentInput)
  .handler(async ({ data }) => {
    await requireAuth()
    return db.tournament.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        coverImageUrl: data.coverImageUrl || null,
        posterImageUrl: data.posterImageUrl || null,
      },
    })
  })

export const updateTournament = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string(), data: TournamentInput }))
  .handler(async ({ data: { id, data } }) => {
    await requireAuth()
    return db.tournament.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        coverImageUrl: data.coverImageUrl || null,
        posterImageUrl: data.posterImageUrl || null,
      },
    })
  })

export const deleteTournament = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await requireAuth()
    return db.tournament.delete({ where: { id } })
  })

export const getTournamentById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) =>
    db.tournament.findUniqueOrThrow({
      where: { id },
      include: {
        games: {
          where: { status: { not: 'CANCELLED' } },
          orderBy: { date: 'desc' },
          include: { gameType: true },
        },
      },
    })
  )
