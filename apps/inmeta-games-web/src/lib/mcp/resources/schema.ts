import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * A human-readable description of the Sanity data model for this app.
 * Exposing this as a resource lets the AI understand the schema before
 * constructing queries or interpreting tool results.
 */
const SCHEMA_DESCRIPTION = {
  documents: {
    tournament: {
      description:
        "Top-level container for a gaming tournament. Has a name, slug, an array of game objects, and configurable point rules.",
      fields: {
        _id: "string — Sanity document id",
        name: "string — display name of the tournament",
        slug: "{ current: string } — URL-safe identifier",
        games: "Game[] — embedded array of game objects (see Game type)",
        pointRules:
          "TournamentPointRules — scoring configuration (see TournamentPointRules type)",
      },
    },
    person: {
      description:
        "A player or participant. Referenced by games as organizers, participants, podium placers, or spectators.",
      fields: {
        _id: "string — Sanity document id",
        firstName: "string",
        lastName: "string",
        image: "SanityImage — profile photo stored in Sanity CDN",
      },
    },
  },
  objectTypes: {
    game: {
      description:
        "A single game event embedded within a tournament. Games are only included in scoreboard calculations when isDone=true.",
      fields: {
        _key: "string — unique key within the tournament's games array",
        name: "string — display name of the game",
        description: "string — long-form description",
        image: "SanityImage | null — optional game image",
        organiziers:
          "Person[] | null — who organized the game (note: field name has a typo in the schema)",
        isOrganizersParticipating:
          "boolean — whether the organizers also played (affects point calculation)",
        participants: "Person[] | null — all players who participated",
        isDone:
          "boolean — gates scoreboard inclusion; false means results not yet recorded",
        firstPlace: "Person[] | null — 1st place winner(s)",
        secondPlace: "Person[] | null — 2nd place winner(s)",
        thirdPlace: "Person[] | null — 3rd place winner(s)",
        spectators:
          "Person[] | null — players who watched but did not participate",
      },
    },
    tournamentPointRules: {
      description:
        "Configures how points are awarded per game. All fields are numbers. Defaults shown.",
      fields: {
        participation: "number — points per game participated in (default: 3)",
        firstPlace: "number — bonus points for 1st place finish (default: 3)",
        secondPlace: "number — bonus points for 2nd place finish (default: 2)",
        thirdPlace: "number — bonus points for 3rd place finish (default: 1)",
        organizedWithParticipation:
          "number — points for organizing AND playing in a game (default: 1)",
        organizedWithoutParticipation:
          "number — points for organizing WITHOUT playing (default: 3)",
        spectator: "number — points for watching a completed game (default: 1)",
      },
    },
  },
  scoringLogic: {
    description:
      "Total score for a player in a tournament is computed as a weighted sum of their stats across all isDone=true games.",
    formula:
      "score = (participations × participation) + (firstPlaces × firstPlace) + (secondPlaces × secondPlace) + (thirdPlaces × thirdPlace) + (organizedWithParticipation × organizedWithParticipation) + (organizedWithoutParticipation × organizedWithoutParticipation) + (spectatorCount × spectator)",
    tieBreaking:
      "Players with equal scores receive the same rank. The next rank is incremented by the number of tied players.",
    notes: [
      "A player who organizes a game always gets organizer points regardless of participation status.",
      "If isOrganizersParticipating=true the organizer also counts as a participant (gets participation points too).",
      "If isOrganizersParticipating=false the organizer does NOT get participation points for that game.",
      "Spectators get spectator points only; they do not count as participants.",
    ],
  },
  availableTools: [
    "list_tournaments — list all tournaments (name, id, slug, game count)",
    "get_tournament — full tournament document with all resolved game data",
    "list_players — list all registered players (name, id)",
    "get_player — player profile plus cross-tournament game history with placements",
    "get_scoreboard — ranked leaderboard for a tournament with score breakdown",
    "get_player_score — score and detailed breakdown for one player in one tournament",
  ],
};

export function registerSchemaResource(server: McpServer) {
  server.registerResource(
    "schema",
    "sanity://schema",
    {
      title: "Inmeta Games Data Schema",
      description:
        "Describes the Sanity CMS data model for the Inmeta Games app — document types, field definitions, scoring logic, and available MCP tools. Read this first to understand the data before using tools.",
      mimeType: "application/json",
    },
    async () => ({
      contents: [
        {
          uri: "sanity://schema",
          mimeType: "application/json",
          text: JSON.stringify(SCHEMA_DESCRIPTION, null, 2),
        },
      ],
    }),
  );
}
