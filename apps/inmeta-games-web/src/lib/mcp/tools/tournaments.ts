import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  fetchTournamentDetails,
  fetchTournamentsList,
} from "@/lib/sanity/queries";

export function registerTournamentTools(server: McpServer) {
  server.registerTool(
    "list_tournaments",
    {
      title: "List Tournaments",
      description:
        "Returns all tournaments with their id, name, and slug. Use this to discover available tournaments before fetching details.",
    },
    async () => {
      const tournaments = await fetchTournamentsList();

      if (!tournaments || tournaments.length === 0) {
        return {
          content: [{ type: "text", text: "No tournaments found." }],
        };
      }

      const rows = tournaments.map((t) => ({
        id: t._id,
        name: t.name,
        slug: t.slug?.current ?? null,
        gameCount: t.games?.length ?? 0,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(rows, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_tournament",
    {
      title: "Get Tournament",
      description:
        "Fetches full details for a single tournament including all games with their participants, organizers, placements, and spectators. Also returns the point rules for the tournament.",
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

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(tournament, null, 2),
          },
        ],
      };
    },
  );
}
