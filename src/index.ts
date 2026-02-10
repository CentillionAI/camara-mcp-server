/**
 * CAMARA MCP Server — Cloudflare Workers
 *
 * Remote MCP server providing developer resources, API discovery, documentation,
 * and reference implementations for the CAMARA Project — The Telco Global API Alliance.
 *
 * Deployed on Cloudflare Workers using Web Standard Streamable HTTP transport.
 *
 * @see https://github.com/camaraproject
 * @see https://camaraproject.org
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { registerAllTools } from "./tools/register.js";
import { registerAllResources } from "./services/resources.js";
import { registerAllPrompts } from "./services/prompts.js";

interface Env {
  // Future: KV bindings, secrets, etc.
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, mcp-session-id, mcp-protocol-version",
  "Access-Control-Expose-Headers": "mcp-session-id",
  "Access-Control-Max-Age": "86400",
};

function corsJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function addCorsHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    newHeaders.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: "camara-mcp-server", version: "2.0.0" },
    { capabilities: { tools: {}, resources: {}, prompts: {} } }
  );
  registerAllTools(server);
  registerAllResources(server);
  registerAllPrompts(server);
  return server;
}

export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // ── CORS Preflight ─────────────────────────────────────────────
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ── Health Check ───────────────────────────────────────────────
    if (url.pathname === "/health" && request.method === "GET") {
      return corsJson({
        status: "ok",
        server: "camara-mcp-server",
        version: "2.0.0",
        runtime: "cloudflare-workers",
        tools: 13,
        resources: 18,
        prompts: 6,
        stable_apis: 10,
        total_apis: 60,
      });
    }

    // ── Server Info ────────────────────────────────────────────────
    if (url.pathname === "/" && request.method === "GET") {
      return corsJson({
        name: "CAMARA MCP Server",
        description:
          "Remote MCP server for the CAMARA Project — The Telco Global API Alliance",
        version: "2.0.0",
        runtime: "cloudflare-workers",
        mcp_endpoint: "/mcp",
        health_endpoint: "/health",
        tools: [
          "camara_search_apis",
          "camara_get_api_detail",
          "camara_list_categories",
          "camara_get_release_info",
          "camara_list_working_groups",
          "camara_getting_started",
          "camara_gsma_info",
          "camara_compare_apis",
          "camara_auth_guide",
          "camara_use_cases",
          "camara_generate_client_code",
          "camara_migration_guide",
          "camara_integration_checklist",
        ],
        documentation: {
          camara_project: "https://camaraproject.org",
          github: "https://github.com/camaraproject",
          gsma_open_gateway:
            "https://www.gsma.com/solutions-and-impact/gsma-open-gateway",
        },
      });
    }

    // ── MCP Endpoint ───────────────────────────────────────────────
    if (url.pathname === "/mcp") {
      try {
        const server = createMcpServer();
        const transport = new WebStandardStreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
          enableJsonResponse: true,
        });

        await server.connect(transport);

        const response = await transport.handleRequest(request);
        return addCorsHeaders(response);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return corsJson(
          {
            jsonrpc: "2.0",
            error: { code: -32603, message: `Internal error: ${message}` },
            id: null,
          },
          500
        );
      }
    }

    // ── 404 ────────────────────────────────────────────────────────
    return corsJson({ error: "Not found" }, 404);
  },
} satisfies ExportedHandler<Env>;
