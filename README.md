# CAMARA MCP Server

Developer resource server for [CAMARA Project](https://camaraproject.org/) telecom APIs. Connect your AI coding tool and get instant guidance on 60+ standardized network APIs from the Linux Foundation's Telco Global API Alliance.

**Live:** `https://camara-mcp-server.nick-9a6.workers.dev/mcp`

## Connect in 30 Seconds

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "camara-docs": {
      "type": "streamable-http",
      "url": "https://camara-mcp-server.nick-9a6.workers.dev/mcp"
    },
    "camara-prod": {
      "type": "sse",
      "url": "https://mcp.camaramcp.com/sse"
    }
  }
}
```

### Cursor

Settings > MCP Servers > Add:
- **Name:** `camara-docs`
- **Type:** `streamable-http`
- **URL:** `https://camara-mcp-server.nick-9a6.workers.dev/mcp`

### Windsurf / Other MCP Clients

```
POST https://camara-mcp-server.nick-9a6.workers.dev/mcp
Content-Type: application/json
Accept: application/json, text/event-stream
```

## Two Servers, One Workflow

| Server | URL | Purpose |
|--------|-----|---------|
| **CAMARA Docs** (this server) | `camara-mcp-server.nick-9a6.workers.dev/mcp` | API guidance, code generation, debugging help |
| **CAMARA Prod** | `mcp.camaramcp.com/sse` | Live API calls via Telefonica, Deutsche Telekom, Vodafone |

Use both together: ask the docs server how to integrate an API, generate client code, then use the prod server to make real calls.

## What You Can Do

Once connected, ask your AI assistant to:

- **"Search for CAMARA APIs related to fraud detection"** - discovers relevant APIs
- **"Show me the SIM Swap API details"** - full spec, endpoints, auth flow
- **"Generate Python code to call Number Verification"** - ready-to-use client code
- **"Give me a production checklist for Location Verification"** - deployment readiness
- **"Compare SIM Swap vs Device Swap"** - side-by-side comparison
- **"How does OIDC auth work for CAMARA APIs?"** - complete auth guide
- **"Walk me through integrating Device Roaming Status"** - end-to-end workflow

## 13 Tools

| Tool | Description |
|------|-------------|
| `camara_search_apis` | Search 60+ APIs by keyword, category, or status |
| `camara_get_api_detail` | Full details for any stable API |
| `camara_list_categories` | Browse all 8 API categories |
| `camara_get_release_info` | Meta-release notes (Fall25, Spring25) |
| `camara_list_working_groups` | Working group info and meeting schedules |
| `camara_getting_started` | Developer onboarding guide |
| `camara_gsma_info` | GSMA Open Gateway details and aggregators |
| `camara_compare_apis` | Side-by-side comparison of 2-5 APIs |
| `camara_auth_guide` | OIDC/OAuth2 authentication reference |
| `camara_use_cases` | Industry-specific use case discovery |
| `camara_generate_client_code` | Generate client code (curl/Python/TypeScript/Java) |
| `camara_migration_guide` | API version migration guidance |
| `camara_integration_checklist` | Production-readiness checklist |

## 18 Resources

- 10 OpenAPI spec summaries (`camara://spec/{slug}`) — one per stable API
- Getting Started guide (`camara://guide/getting-started`)
- Authentication guide (`camara://guide/authentication`)
- API design guidelines (`camara://guide/commonalities`)
- GSMA Open Gateway guide (`camara://guide/gsma`)
- Error handling guide (`camara://guide/error-handling`)
- Operator coverage guide (`camara://guide/operator-coverage`)
- DevCon setup guide (`camara://guide/devcon-setup`)
- Fall25 release notes (`camara://release/fall25`)

## 6 Prompts

| Prompt | Description |
|--------|-------------|
| `camara-quickstart` | Get started for a use case + industry |
| `camara-choose-api` | API recommendation for a requirement |
| `camara-auth-setup` | Authentication setup guide per API |
| `camara-fraud-detection` | Design a fraud detection system |
| `camara-compare-solutions` | CAMARA vs traditional alternatives |
| `camara-integration-walkthrough` | End-to-end integration walkthrough |

## Operator Support (Production Server)

The production server at `mcp.camaramcp.com/sse` connects to real telecom operators:

| Operator | Country | SIM Swap | Roaming | Device Swap | Location |
|----------|---------|----------|---------|-------------|----------|
| Telefonica | Spain (+34) | Yes | Yes | Yes | Yes |
| Deutsche Telekom | Germany (+49) | Yes | No | No | No |
| Vodafone | UK (+44) | Yes | No | No | No |

## 10 Stable APIs

Number Verification, SIM Swap, Location Verification, Device Reachability Status, Device Roaming Status, One-Time Password SMS, Quality on Demand, QoS Profiles, Simple Edge Discovery, Device Swap

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Server info and tool listing |
| `GET` | `/health` | Health check with capability counts |
| `POST` | `/mcp` | MCP JSON-RPC endpoint |
| `OPTIONS` | `*` | CORS preflight |

## Architecture

- **Runtime**: Cloudflare Workers (V8 isolates, serverless)
- **Transport**: `WebStandardStreamableHTTPServerTransport`
- **Mode**: Stateless — fresh MCP server per request
- **Auth**: Open access
- **Data**: All API catalog embedded (no external DB)
- **License**: Apache-2.0

## Development

```bash
npm install
npm run dev        # local dev server on http://localhost:8787
npx wrangler deploy  # deploy to Cloudflare Workers
```

## References

- [CAMARA Project](https://camaraproject.org/)
- [CAMARA GitHub](https://github.com/camaraproject)
- [GSMA Open Gateway](https://www.gsma.com/solutions-and-impact/gsma-open-gateway)
- [MCP Protocol](https://modelcontextprotocol.io/)
