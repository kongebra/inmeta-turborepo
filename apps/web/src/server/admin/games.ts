import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '~/lib/db'

const GameInput = z.object({
  name: z.string().min(1),
  tournamentId: z.string().min(1),
  gameTypeId: z.string().optional(),
  date: z.string().optional(),
  status: z.enum(['PLANNED', 'SCHEDULED', 'LIVE', 'DONE', 'CANCELLED']).default('PLANNED'),
  location: z.string().optional(),
  duration: z.number().int().optional(),
  format: z.enum(['PLACEMENT', 'SCORE', 'TIME', 'BRACKET']).default('PLACEMENT'),
  heroImageUrl: z.string().url().optional().or(z.literal('')),
  story: z.string().optional(),
  organizerIds: z.array(z.string()).default([]),
  participantIds: z.array(z.string()).default([]),
  spectatorIds: z.array(z.string()).default([]),
  firstPlaceIds: z.array(z.string()).default([]),
  secondPlaceIds: z.array(z.string()).default([]),
  thirdPlaceIds: z.array(z.string()).default([]),
})

function playerConnect(ids: string[]) {
  return { connect: ids.map(id => ({ id })) }
}

function playerSet(ids: string[]) {
  return { set: ids.map(id => ({ id })) }
}

export const createGame = createServerFn({ method: 'POST' })
  .inputValidator(GameInput)
  .handler(async ({ data }) => {
    const { organizerIds, participantIds, spectatorIds, firstPlaceIds, secondPlaceIds, thirdPlaceIds, ...rest } = data
    return db.game.create({
      data: {
        ...rest,
        date: rest.date ? new Date(rest.date) : null,
        heroImageUrl: rest.heroImageUrl || null,
        gameTypeId: rest.gameTypeId || null,
        organizers: playerConnect(organizerIds),
        participants: playerConnect(participantIds),
        spectators: playerConnect(spectatorIds),
        firstPlace: playerConnect(firstPlaceIds),
        secondPlace: playerConnect(secondPlaceIds),
        thirdPlace: playerConnect(thirdPlaceIds),
      },
    })
  })

export const updateGame = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string(), data: GameInput }))
  .handler(async ({ data: { id, data } }) => {
    const { organizerIds, participantIds, spectatorIds, firstPlaceIds, secondPlaceIds, thirdPlaceIds, ...rest } = data
    return db.game.update({
      where: { id },
      data: {
        ...rest,
        date: rest.date ? new Date(rest.date) : null,
        heroImageUrl: rest.heroImageUrl || null,
        gameTypeId: rest.gameTypeId || null,
        organizers: playerSet(organizerIds),
        participants: playerSet(participantIds),
        spectators: playerSet(spectatorIds),
        firstPlace: playerSet(firstPlaceIds),
        secondPlace: playerSet(secondPlaceIds),
        thirdPlace: playerSet(thirdPlaceIds),
      },
    })
  })

export const deleteGame = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => db.game.delete({ where: { id } }))
