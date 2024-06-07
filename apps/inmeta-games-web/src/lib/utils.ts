import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Person,
  TournamentDetails,
  TournamentPointRules,
} from "./sanity/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type PlayerStats = {
  player: Person;

  participations: number;
  firstPlaces: number;
  secondPlaces: number;
  thirdPlaces: number;

  organizedWithParticipations: number;
  organizedWithtoutParticipations: number;

  spectatorCount: number;
};

function createPlayerStats(player: Person): PlayerStats {
  return {
    player,

    participations: 0,
    firstPlaces: 0,
    secondPlaces: 0,
    thirdPlaces: 0,

    organizedWithParticipations: 0,
    organizedWithtoutParticipations: 0,

    spectatorCount: 0,
  };
}

export function calculateScoreboard(tournament: TournamentDetails) {
  const players: Map<string, PlayerStats> = new Map();

  tournament.games.forEach((game) => {
    if (!game.isDone) {
      return;
    }

    // Regn ut deltakelese for alle spillere
    game.participants?.forEach((participant) => {
      if (!players.has(participant._id)) {
        players.set(participant._id, createPlayerStats(participant));
      }

      const stats = players.get(participant._id)!;
      players.set(participant._id, {
        ...stats,
        participations: stats.participations + 1,
      });
    });

    // Regn ut førsteplasser
    game.firstPlace?.forEach((firstPlace) => {
      const player = players.get(firstPlace._id)!;
      if (!player) {
        throw new Error("Player not found in firstPlace of game: " + game.name);
      }

      players.set(firstPlace._id, {
        ...player,
        firstPlaces: player.firstPlaces + 1,
      });
    });

    // Regn ut andreplasser
    game.secondPlace?.forEach((secondPlace) => {
      const player = players.get(secondPlace._id)!;
      if (!player) {
        throw new Error(
          "Player not found in secondPlace of game: " + game.name
        );
      }

      players.set(secondPlace._id, {
        ...player,
        secondPlaces: player.secondPlaces + 1,
      });
    });

    // Regn ut tredjeplasser
    game.thirdPlace?.forEach((thirdPlace) => {
      const player = players.get(thirdPlace._id)!;
      if (!player) {
        throw new Error("Player not found in thirdPlace of game: " + game.name);
      }

      players.set(thirdPlace._id, {
        ...player,
        thirdPlaces: player.thirdPlaces + 1,
      });
    });

    // Regn ut arrangører
    game.organiziers?.forEach((organizer) => {
      // TODO: Endre på dette, legger en bool på game, om arrangør deltok eller ikke
      if (!players.has(organizer._id)) {
        players.set(organizer._id, createPlayerStats(organizer));
        const stats = players.get(organizer._id)!;

        players.set(organizer._id, {
          ...stats,
          participations: 1,
          organizedWithtoutParticipations: game.isOrganizersParticipating
            ? 0
            : 1,
          organizedWithParticipations: game.isOrganizersParticipating ? 1 : 0,
        });

        return;
      }

      const player = players.get(organizer._id)!;
      players.set(organizer._id, {
        ...player,
        organizedWithtoutParticipations: game.isOrganizersParticipating ? 0 : 1,
        organizedWithParticipations: game.isOrganizersParticipating ? 1 : 0,
      });
    });

    game.spectators?.forEach((spectator) => {
      if (!players.has(spectator._id)) {
        players.set(spectator._id, {
          ...createPlayerStats(spectator),
          spectatorCount: 1,
        });

        return;
      }

      const player = players.get(spectator._id)!;
      players.set(spectator._id, {
        ...player,
        spectatorCount: player.spectatorCount + 1,
      });
    });
  });

  const result: (PlayerStats & { score: number; rank: number })[] = Array.from(
    players.values()
  )
    .map((stats) => ({
      ...stats,
      score: calculatePlayerScore(stats, tournament.pointRules),
      rank: 0,
    }))
    .sort((a, b) => b.score - a.score);

  for (let i = 0; i < result.length; i++) {
    let rank = i + 1;
    if (i > 0) {
      const previous = result[i - 1];
      if (previous.score === result[i].score) {
        rank = previous.rank;
      }
    }

    result[i].rank = rank;
  }

  return result;
}

export function calculatePlayerScore(
  stats: PlayerStats,
  rules: TournamentPointRules
) {
  return (
    stats.participations * rules.participation +
    stats.firstPlaces * rules.firstPlace +
    stats.secondPlaces * rules.secondPlace +
    stats.thirdPlaces * rules.thirdPlace +
    stats.organizedWithParticipations * rules.organizedWithParticipation +
    stats.organizedWithtoutParticipations *
      rules.organizedWithoutParticipation +
    stats.spectatorCount * rules.spectator
  );
}

export function sortPeople(a: Person, b: Person) {
  const firstName = a.firstName.localeCompare(b.firstName);

  if (firstName === 0) {
    return a.lastName.localeCompare(b.lastName);
  }

  return firstName;
}
