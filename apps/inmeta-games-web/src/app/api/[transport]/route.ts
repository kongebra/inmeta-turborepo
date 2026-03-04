import { createMcpHandler } from "mcp-handler";
import { registerInmetaGamesServer } from "@/lib/mcp/server";

// Force Node.js runtime — the Sanity client uses Node-only internals and
// cannot run in the Edge runtime or in a restricted worker context.
export const runtime = "nodejs";

/**
 * MCP Route Handler for the Inmeta Games app.
 *
 * Exposes two transports from a single dynamic segment:
 *   POST /api/mcp  — Streamable HTTP (current MCP spec, recommended)
 *   GET  /api/sse  — Legacy SSE (for older MCP clients)
 *
 * ## Connecting from Claude Code
 * Add to your claude_desktop_config.json or .claude/config:
 *
 * ```json
 * {
 *   "mcpServers": {
 *     "inmeta-games": {
 *       "url": "http://localhost:3000/api/mcp"
 *     }
 *   }
 * }
 * ```
 *
 * ## Connecting from stdio-only clients (Claude Desktop, etc.)
 * Bridge via mcp-remote:
 *
 * ```json
 * {
 *   "mcpServers": {
 *     "inmeta-games": {
 *       "command": "npx",
 *       "args": ["-y", "mcp-remote", "http://localhost:3000/api/mcp"]
 *     }
 *   }
 * }
 * ```
 */
const handler = createMcpHandler(
  (server) => {
    registerInmetaGamesServer(server);
  },
  {},
  {
    basePath: "/api",
    maxDuration: 60,
  },
);

export { handler as GET, handler as POST };
