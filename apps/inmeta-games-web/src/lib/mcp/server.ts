import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTournamentTools } from "./tools/tournaments";
import { registerPlayerTools } from "./tools/players";
import { registerScoreboardTools } from "./tools/scoreboard";
import { registerSchemaResource } from "./resources/schema";

/**
 * Registers all Inmeta Games tools and resources onto an McpServer instance.
 *
 * Accepts an existing server so it can be used both inside mcp-handler's
 * initialiser callback (where the server is created by the handler) and in
 * tests (where you create the server yourself).
 *
 * @example
 * // In the Route Handler (mcp-handler provides the server):
 * createMcpHandler((server) => registerInmetaGamesServer(server), ...)
 *
 * @example
 * // In tests:
 * const server = new McpServer({ name: "test", version: "0.0.0" });
 * registerInmetaGamesServer(server);
 */
export function registerInmetaGamesServer(server: McpServer): void {
  // Resources — read-only context for the AI
  registerSchemaResource(server);

  // Tools — tournament data
  registerTournamentTools(server);

  // Tools — player data
  registerPlayerTools(server);

  // Tools — scoreboard & scoring calculations
  registerScoreboardTools(server);
}
