import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('~/lib/db', () => ({
  db: {
    player: {
      findMany: vi.fn(),
      findUniqueOrThrow: vi.fn(),
    },
  },
}))

import { db } from '~/lib/db'

const mockDb = db as unknown as {
  player: {
    findMany: ReturnType<typeof vi.fn>
    findUniqueOrThrow: ReturnType<typeof vi.fn>
  }
}

describe('player DB queries', () => {
  beforeEach(() => vi.clearAllMocks())

  it('findMany queries players sorted by firstName', async () => {
    const mockPlayers = [
      { id: '1', firstName: 'Arne', lastName: 'Berg', signatureGame: null },
      { id: '2', firstName: 'Bente', lastName: 'Dal', signatureGame: null },
    ]
    mockDb.player.findMany.mockResolvedValue(mockPlayers as any)

    const result = await db.player.findMany({
      include: { signatureGame: true },
      orderBy: { firstName: 'asc' },
    })

    expect(mockDb.player.findMany).toHaveBeenCalledWith({
      include: { signatureGame: true },
      orderBy: { firstName: 'asc' },
    })
    expect(result).toHaveLength(2)
    expect(result[0].firstName).toBe('Arne')
  })

  it('findUniqueOrThrow queries a player by id with all relations', async () => {
    const mockPlayer = {
      id: 'abc',
      firstName: 'Arne',
      lastName: 'Berg',
      signatureGame: null,
      participatedGames: [],
      firstPlaceGames: [],
      secondPlaceGames: [],
      thirdPlaceGames: [],
      playerBadges: [],
    }
    mockDb.player.findUniqueOrThrow.mockResolvedValue(mockPlayer as any)

    const result = await db.player.findUniqueOrThrow({
      where: { id: 'abc' },
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

    expect(result.firstName).toBe('Arne')
    expect(result.playerBadges).toHaveLength(0)
  })
})
