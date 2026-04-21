export type PointRules = {
  participation: number
  firstPlace: number
  secondPlace: number
  thirdPlace: number
  organizedWithParticipation: number
  organizedWithoutParticipation: number
  spectator: number
}

export type GameResult = {
  participants: string[]
  firstPlace: string[]
  secondPlace: string[]
  thirdPlace: string[]
  organizers: string[]
  spectators: string[]
}

export type ScoreboardEntry = {
  playerId: string
  points: number
  gamesPlayed: number
  wins: number
  secondPlaces: number
  thirdPlaces: number
  gamesOrganized: number
}

export function calculateScoreboard(
  games: GameResult[],
  rules: PointRules,
): ScoreboardEntry[] {
  const map = new Map<string, ScoreboardEntry>()

  const get = (id: string): ScoreboardEntry => {
    if (!map.has(id)) {
      map.set(id, { playerId: id, points: 0, gamesPlayed: 0, wins: 0, secondPlaces: 0, thirdPlaces: 0, gamesOrganized: 0 })
    }
    return map.get(id)!
  }

  for (const game of games) {
    const didParticipate = new Set(game.participants)

    for (const id of game.participants) {
      const e = get(id)
      e.points += rules.participation
      e.gamesPlayed += 1
    }
    for (const id of game.firstPlace) {
      const e = get(id)
      e.points += rules.firstPlace
      e.wins += 1
    }
    for (const id of game.secondPlace) {
      const e = get(id)
      e.points += rules.secondPlace
      e.secondPlaces += 1
    }
    for (const id of game.thirdPlace) {
      const e = get(id)
      e.points += rules.thirdPlace
      e.thirdPlaces += 1
    }
    for (const id of game.organizers) {
      const e = get(id)
      e.gamesOrganized += 1
      if (didParticipate.has(id)) {
        e.points += rules.organizedWithParticipation
      } else {
        e.points += rules.organizedWithoutParticipation
      }
    }
    for (const id of game.spectators) {
      const e = get(id)
      e.points += rules.spectator
    }
  }

  return Array.from(map.values()).sort((a, b) => b.points - a.points)
}
