import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchTournamentDetails } from "@/lib/sanity/queries";
import { calculatePlayerScore, calculateScoreboard } from "@/lib/utils";

export function registerScoreboardTools(server: McpServer) {
  server.registerTool(
    "get_scoreboard",
    {
      title: "Get Scoreboard",
      description:
        "Calculates and returns the full ranked scoreboard for a tournament. Only includes players from completed games (isDone=true). Each row includes the player's rank (ties share the same rank), name, total score, and a breakdown of participations, podium finishes, organizing credits, and spectator appearances.",
      inputSchema: {
        tournamentId: z
          .string()
          .describe(
            "The Sanity document _id of the tournament. Obtain this from list_tournaments.",
          ),
      },
    },
    async ({ tournamentId }) => {
      const tournament = await fetchTournamentDetails(tournamentId);

      if (!tournament) {
        return {
          content: [
            {
              type: "text",
              text: `No tournament found with id "${tournamentId}".`,
            },
          ],
        };
      }

      const scoreboard = calculateScoreboard(tournament);

      if (scoreboard.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `Tournament "${tournament.name}" has no completed games yet. No scoreboard available.`,
            },
          ],
        };
      }

      const rows = scoreboard.map((entry) => ({
        rank: entry.rank,
        playerId: entry.player._id,
        fullName: `${entry.player.firstName} ${entry.player.lastName}`,
        score: entry.score,
        participations: entry.participations,
        firstPlaces: entry.firstPlaces,
        secondPlaces: entry.secondPlaces,
        thirdPlaces: entry.thirdPlaces,
        organizedWithParticipation: entry.organizedWithParticipations,
        organizedWithoutParticipation: entry.organizedWithtoutParticipations,
        spectatorCount: entry.spectatorCount,
      }));

      const summary = [
        `Tournament: ${tournament.name}`,
        `Completed games: ${tournament.games.filter((g) => g.isDone).length} / ${tournament.games.length}`,
        `Point rules: participation=${tournament.pointRules.participation}, 1st=${tournament.pointRules.firstPlace}, 2nd=${tournament.pointRules.secondPlace}, 3rd=${tournament.pointRules.thirdPlace}, organizer(with)=${tournament.pointRules.organizedWithParticipation}, organizer(without)=${tournament.pointRules.organizedWithoutParticipation}, spectator=${tournament.pointRules.spectator}`,
        "",
        JSON.stringify(rows, null, 2),
      ].join("\n");

      return {
        content: [{ type: "text", text: summary }],
      };
    },
  );

  server.registerTool(
    "get_player_score",
    {
      title: "Get Player Score",
      description:
        "Calculates the score and stats for a specific player within a specific tournament. Useful for answering questions like 'how many points does Erik have in Tournament X?' Returns the score breakdown and the point rules applied.",
      inputSchema: {
        tournamentId: z
          .string()
          .describe(
            "The Sanity document _id of the tournament. Obtain this from list_tournaments.",
          ),
        playerId: z
          .string()
          .describe(
            "The Sanity document _id of the player. Obtain this from list_players.",
          ),
      },
    },
    async ({ tournamentId, playerId }) => {
      const tournament = await fetchTournamentDetails(tournamentId);

      if (!tournament) {
        return {
          content: [
            {
              type: "text",
              text: `No tournament found with id "${tournamentId}".`,
            },
          ],
        };
      }

      const scoreboard = calculateScoreboard(tournament);
      const entry = scoreboard.find((e) => e.player._id === playerId);

      if (!entry) {
        return {
          content: [
            {
              type: "text",
              text: `Player "${playerId}" has no activity in tournament "${tournament.name}". They may not have participated in any completed games.`,
            },
          ],
        };
      }

      const score = calculatePlayerScore(entry, tournament.pointRules);

      const result = {
        tournamentName: tournament.name,
        playerName: `${entry.player.firstName} ${entry.player.lastName}`,
        rank: entry.rank,
        score,
        breakdown: {
          participations: entry.participations,
          participationPoints:
            entry.participations * tournament.pointRules.participation,
          firstPlaces: entry.firstPlaces,
          firstPlacePoints:
            entry.firstPlaces * tournament.pointRules.firstPlace,
          secondPlaces: entry.secondPlaces,
          secondPlacePoints:
            entry.secondPlaces * tournament.pointRules.secondPlace,
          thirdPlaces: entry.thirdPlaces,
          thirdPlacePoints:
            entry.thirdPlaces * tournament.pointRules.thirdPlace,
          organizedWithParticipation: entry.organizedWithParticipations,
          organizedWithParticipationPoints:
            entry.organizedWithParticipations *
            tournament.pointRules.organizedWithParticipation,
          organizedWithoutParticipation: entry.organizedWithtoutParticipations,
          organizedWithoutParticipationPoints:
            entry.organizedWithtoutParticipations *
            tournament.pointRules.organizedWithoutParticipation,
          spectatorCount: entry.spectatorCount,
          spectatorPoints:
            entry.spectatorCount * tournament.pointRules.spectator,
        },
        pointRules: tournament.pointRules,
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  );
}
