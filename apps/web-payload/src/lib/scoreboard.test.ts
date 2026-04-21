import { describe, expect, test } from 'bun:test'
import { calculateScoreboard, type GameResult, type PointRules } from './scoreboard'

const defaultRules: PointRules = {
  participation: 3,
  firstPlace: 3,
  secondPlace: 2,
  thirdPlace: 1,
  organizedWithParticipation: 1,
  organizedWithoutParticipation: 3,
  spectator: 1,
}

describe('calculateScoreboard', () => {
  test('awards participation points', () => {
    const games: GameResult[] = [{
      participants: ['alice'],
      firstPlace: ['alice'],
      secondPlace: [],
      thirdPlace: [],
      organizers: [],
      spectators: [],
    }]
    const board = calculateScoreboard(games, defaultRules)
    // alice gets participation (3) + firstPlace (3) = 6
    expect(board.find(e => e.playerId === 'alice')?.points).toBe(6)
  })

  test('organizer without participation gets organizedWithoutParticipation points', () => {
    const games: GameResult[] = [{
      participants: ['alice'],
      firstPlace: ['alice'],
      secondPlace: [],
      thirdPlace: [],
      organizers: ['bob'],
      spectators: [],
    }]
    const board = calculateScoreboard(games, defaultRules)
    expect(board.find(e => e.playerId === 'bob')?.points).toBe(3)
  })

  test('organizer with participation gets organizedWithParticipation points', () => {
    const games: GameResult[] = [{
      participants: ['alice'],
      firstPlace: ['alice'],
      secondPlace: [],
      thirdPlace: [],
      organizers: ['alice'],
      spectators: [],
    }]
    const board = calculateScoreboard(games, defaultRules)
    // alice: participation(3) + firstPlace(3) + organizedWithParticipation(1) = 7
    expect(board.find(e => e.playerId === 'alice')?.points).toBe(7)
  })

  test('sorts by points descending', () => {
    const games: GameResult[] = [{
      participants: ['alice', 'bob'],
      firstPlace: ['alice'],
      secondPlace: ['bob'],
      thirdPlace: [],
      organizers: [],
      spectators: [],
    }]
    const board = calculateScoreboard(games, defaultRules)
    expect(board[0].playerId).toBe('alice')
    expect(board[1].playerId).toBe('bob')
  })

  test('handles empty games array', () => {
    expect(calculateScoreboard([], defaultRules)).toEqual([])
  })
})
