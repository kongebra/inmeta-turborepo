import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fetchPlayerDetails, fetchPlayers } from "@/lib/sanity/queries";

export function registerPlayerTools(server: McpServer) {
  server.registerTool(
    "list_players",
    {
      title: "List Players",
      description:
        "Returns all registered players (persons) with their id, first name, and last name. Use this to look up player ids before calling get_player.",
    },
    async () => {
      const players = await fetchPlayers();

      if (!players || players.length === 0) {
        return {
          content: [{ type: "text", text: "No players found." }],
        };
      }

      const rows = players
        .map((p) => ({
          id: p._id,
          firstName: p.firstName,
          lastName: p.lastName,
          fullName: `${p.firstName} ${p.lastName}`,
        }))
        .sort((a, b) =>
          a.firstName.localeCompare(b.firstName) ||
          a.lastName.localeCompare(b.lastName)
            ? 1
            : -1,
        );

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
    "get_player",
    {
      title: "Get Player",
      description:
        "Fetches the full profile for a single player including their tournament history. For each tournament they appear in, returns all completed games they participated in, their placement (1=first, 2=second, 3=third, 0=participant/no-podium), and whether they were an organizer.",
      inputSchema: {
        playerId: z
          .string()
          .describe(
            "The Sanity document _id of the player. Obtain this from list_players.",
          ),
      },
    },
    async ({ playerId }) => {
      const player = await fetchPlayerDetails(playerId);

      if (!player) {
        return {
          content: [
            {
              type: "text",
              text: `No player found with id "${playerId}".`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(player, null, 2),
          },
        ],
      };
    },
  );
}
