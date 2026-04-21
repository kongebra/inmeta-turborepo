import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '~/lib/db'

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
  .validator(TournamentInput.parse)
  .handler(async ({ data }) =>
    db.tournament.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        coverImageUrl: data.coverImageUrl || null,
        posterImageUrl: data.posterImageUrl || null,
      },
    })
  )

export const updateTournament = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string(), data: TournamentInput }).parse)
  .handler(async ({ data: { id, data } }) =>
    db.tournament.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        coverImageUrl: data.coverImageUrl || null,
        posterImageUrl: data.posterImageUrl || null,
      },
    })
  )

export const deleteTournament = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => db.tournament.delete({ where: { id } }))

export const getTournamentById = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
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
