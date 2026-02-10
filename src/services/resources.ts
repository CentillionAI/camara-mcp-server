/**
 * CAMARA MCP Resources
 * Exposes CAMARA documentation and API specifications as MCP resources
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  STABLE_APIS,
  CAMARA_BASE_URL,
  CURRENT_META_RELEASE,
  GSMA_INFO,
} from "../constants.js";
import { getGettingStarted } from "./catalog.js";

export function registerAllResources(server: McpServer): void {
  // ── OpenAPI Spec Resources (one per stable API) ──────────────────

  for (const api of STABLE_APIS) {
    const uri = `camara://spec/${api.slug}`;
    server.resource(
      `spec-${api.slug}`,
      uri,
      {
        description: `OpenAPI specification info for ${api.name} v${api.latestVersion}`,
        mimeType: "text/markdown",
      },
      async () => ({
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: [
              `# ${api.name} — v${api.latestVersion} (Stable)`,
              "",
              api.description,
              "",
              "## Endpoints",
              ...api.keyEndpoints.map((e) => `- \`${e}\``),
              "",
              "## Authentication",
              api.authFlow,
              "",
              "## HTTP Methods",
              api.httpMethods.join(", "),
              "",
              "## Use Cases",
              ...api.useCases.map((u) => `- ${u}`),
              "",
              "## Target Industries",
              api.industries.join(", "),
              "",
              "## Links",
              `- **Repository:** ${CAMARA_BASE_URL}/${api.repository}`,
              `- **Documentation:** ${api.websiteUrl}`,
              `- **OpenAPI Spec:** ${CAMARA_BASE_URL}/${api.repository}/tree/main/code/API_definitions`,
              "",
              "## Version History",
              `Current: v${api.latestVersion}`,
              `Previous: ${api.previousVersions.join(", ")}`,
            ].join("\n"),
          },
        ],
      })
    );
  }

  // ── Getting Started Guide ────────────────────────────────────────

  server.resource(
    "guide-getting-started",
    "camara://guide/getting-started",
    {
      description: "Comprehensive developer onboarding guide for CAMARA APIs",
      mimeType: "text/markdown",
    },
    async () => {
      const guide = getGettingStarted();
      return {
        contents: [
          {
            uri: "camara://guide/getting-started",
            mimeType: "text/markdown",
            text: [
              "# Getting Started with CAMARA APIs",
              "",
              guide.overview,
              "",
              "## Step-by-Step Onboarding",
              "",
              ...guide.steps,
              "",
              "## Authentication Overview",
              "",
              guide.auth_overview,
              "",
              "## Recommended First API",
              "",
              guide.first_api_suggestion,
              "",
              "## Key Resources",
              "",
              ...Object.entries(guide.resources).map(
                ([k, v]) => `- **${k}:** ${v}`
              ),
            ].join("\n"),
          },
        ],
      };
    }
  );

  // ── Authentication Guide ─────────────────────────────────────────

  server.resource(
    "guide-authentication",
    "camara://guide/authentication",
    {
      description:
        "Complete guide to OIDC/OAuth2 authentication for CAMARA APIs",
      mimeType: "text/markdown",
    },
    async () => {
      const twoLegged = STABLE_APIS.filter((a) =>
        a.authFlow.includes("Client Credentials")
      );
      const threeLegged = STABLE_APIS.filter((a) =>
        a.authFlow.includes("Authorization Code")
      );

      return {
        contents: [
          {
            uri: "camara://guide/authentication",
            mimeType: "text/markdown",
            text: [
              "# CAMARA Authentication Guide",
              "",
              "All CAMARA APIs use OIDC/OAuth2 for authentication. The Identity and Consent Management (ICM) working group defines the standard patterns.",
              "",
              "## 1. Client Credentials (2-Legged OAuth2)",
              "",
              "**Use Case:** Server-to-server calls without user interaction.",
              "**Grant Type:** `client_credentials`",
              "",
              "### Flow",
              "1. Application sends `POST /token` with `client_id` and `client_secret`",
              "2. Authorization server returns access token",
              "3. Application uses token in `Authorization: Bearer <token>` header",
              "",
              "### APIs Using This Flow",
              ...twoLegged.map((a) => `- ${a.name} (v${a.latestVersion})`),
              "",
              "## 2. Authorization Code (3-Legged OIDC)",
              "",
              "**Use Case:** User data access requiring explicit consent.",
              "**Grant Type:** `authorization_code`",
              "",
              "### Flow",
              "1. Application redirects user to authorization server",
              "2. User authenticates and grants consent",
              "3. Authorization server redirects back with authorization code",
              "4. Application exchanges code for access token",
              "5. Application uses token to call API",
              "",
              "### APIs Using This Flow",
              ...threeLegged.map((a) => `- ${a.name} (v${a.latestVersion})`),
              "",
              "## CIBA (Client-Initiated Backchannel Authentication)",
              "",
              "Some operators support CIBA for backend authentication where the user does not interact with the application directly. The operator pushes an authentication request to the user's device.",
              "",
              "## Resources",
              `- **ICM Working Group:** ${CAMARA_BASE_URL}/IdentityAndConsentManagement`,
              `- **Commonalities:** ${CAMARA_BASE_URL}/Commonalities`,
              `- **CAMARA Access & Consent:** ${CAMARA_BASE_URL}/IdentityAndConsentManagement/blob/main/documentation/CAMARA-API-access-and-user-consent.md`,
            ].join("\n"),
          },
        ],
      };
    }
  );

  // ── Commonalities Guide ──────────────────────────────────────────

  server.resource(
    "guide-commonalities",
    "camara://guide/commonalities",
    {
      description:
        "CAMARA API design guidelines, error handling, and common patterns",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "camara://guide/commonalities",
          mimeType: "text/markdown",
          text: [
            "# CAMARA Commonalities — API Design Guidelines",
            "",
            "The Commonalities working group defines shared guidelines and assets for all CAMARA APIs.",
            "",
            "## Key Standards",
            "",
            "### API Design",
            "- RESTful principles with resource-oriented URLs",
            "- OpenAPI 3.0+ specification format (YAML/JSON)",
            "- Semantic versioning (MAJOR.MINOR.PATCH)",
            "- Consistent parameter naming conventions",
            "",
            "### Error Handling",
            "- Standard error response format (`CAMARA_common.yaml`)",
            "- HTTP status code mapping",
            "- Problem Details (RFC 7807) error bodies",
            "",
            "### Event Subscriptions",
            "- CloudEvents-based notification format",
            "- Webhook subscription management",
            "- Consistent subscription lifecycle",
            "",
            "### Testing",
            "- API Readiness checklist (mandatory for stable APIs)",
            "- Test definition framework",
            "- Conformance testing criteria",
            "",
            "### Shared Data Types",
            "- `CAMARA_common.yaml` — common data types and error formats",
            "- Device identifier patterns (phone number, IP address, network access identifier)",
            "- Location data formats (latitude, longitude, radius)",
            "",
            "## Resources",
            `- **Repository:** ${CAMARA_BASE_URL}/Commonalities`,
            `- **API Design Guide:** ${CAMARA_BASE_URL}/Commonalities/blob/main/documentation/API-design-guidelines.md`,
            `- **Glossary:** ${CAMARA_BASE_URL}/Commonalities/blob/main/documentation/Glossary.md`,
            "- **Meeting Schedule:** Bi-weekly, Monday, 15:00 UTC",
            "- **Mailing List:** wg-commonalities@lists.camaraproject.org",
          ].join("\n"),
        },
      ],
    })
  );

  // ── GSMA Open Gateway Guide ──────────────────────────────────────

  server.resource(
    "guide-gsma",
    "camara://guide/gsma",
    {
      description:
        "GSMA Open Gateway — the commercial channel for CAMARA APIs",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "camara://guide/gsma",
          mimeType: "text/markdown",
          text: [
            "# GSMA Open Gateway",
            "",
            GSMA_INFO.description,
            "",
            "## Key Facts",
            `- **Operators:** ${GSMA_INFO.supportedOperators}`,
            `- **Aggregators:** ${GSMA_INFO.aggregators.join(", ")}`,
            "",
            "## CAMARA ↔ GSMA Relationship",
            GSMA_INFO.relationship,
            "",
            "## How to Access CAMARA APIs via Open Gateway",
            "",
            "1. **Choose an Aggregator:** Register with Vonage, Infobip, Google Cloud, AWS, Azure, or Telefonica Open Gateway",
            "2. **Get API Credentials:** Each aggregator provides client_id/client_secret for OAuth2",
            "3. **Select Target Operator:** APIs route through the subscriber's home operator",
            "4. **Implement Auth Flow:** Use OAuth2 Client Credentials or Authorization Code depending on API",
            "5. **Call APIs:** Use standardized CAMARA endpoints — same spec across all operators",
            "",
            "## Aggregator Links",
            "- **Vonage (Ericsson):** Network APIs portal",
            "- **Infobip:** Developer platform",
            "- **Google Cloud:** Telecom APIs",
            "- **AWS:** Partner network APIs",
            "- **Azure:** Communication services",
            "- **Telefonica:** Open Gateway Developer Hub",
            "",
            `**Launch Status:** ${GSMA_INFO.launchStatusUrl}`,
          ].join("\n"),
        },
      ],
    })
  );

  // ── Error Handling Guide ────────────────────────────────────────

  server.resource(
    "guide-error-handling",
    "camara://guide/error-handling",
    {
      description:
        "Complete guide to CAMARA API error handling patterns and RFC 7807 Problem Details",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "camara://guide/error-handling",
          mimeType: "text/markdown",
          text: [
            "# CAMARA Error Handling Guide",
            "",
            "All CAMARA APIs follow standardized error handling based on RFC 7807 Problem Details and CAMARA Commonalities guidelines.",
            "",
            "## Error Response Format",
            "",
            "```json",
            "{",
            '  "status": 400,',
            '  "code": "INVALID_ARGUMENT",',
            '  "message": "A]described_parameter has an invalid value"',
            "}",
            "```",
            "",
            "## Standard Error Codes",
            "",
            "| HTTP Status | Code | Description |",
            "|-------------|------|-------------|",
            "| 400 | INVALID_ARGUMENT | Invalid request parameter |",
            "| 401 | UNAUTHENTICATED | Missing or invalid bearer token |",
            "| 403 | PERMISSION_DENIED | Insufficient scope or consent |",
            "| 404 | NOT_FOUND | Resource not found |",
            "| 409 | CONFLICT | Resource conflict |",
            "| 429 | TOO_MANY_REQUESTS | Rate limit exceeded |",
            "| 500 | INTERNAL | Internal server error |",
            "| 503 | UNAVAILABLE | Service temporarily unavailable |",
            "",
            "## Retry Strategy",
            "",
            "- **429 (Rate Limited):** Respect `Retry-After` header, exponential backoff",
            "- **500/503 (Server Error):** Retry with exponential backoff (max 3 retries)",
            "- **401 (Token Expired):** Refresh token and retry once",
            "- **400/403/404:** Do NOT retry — fix the request",
            "",
            "## Event Subscription Errors",
            "",
            "For APIs supporting CloudEvents webhooks:",
            "- Subscription creation failures return standard error format",
            "- Webhook delivery failures trigger automatic retries by the operator",
            "- Subscription expiry sends a `subscription-ends` event",
            "",
            "## Resources",
            `- **Commonalities Error Guidelines:** ${CAMARA_BASE_URL}/Commonalities/blob/main/documentation/API-design-guidelines.md`,
            `- **RFC 7807 Problem Details:** https://datatracker.ietf.org/doc/html/rfc7807`,
          ].join("\n"),
        },
      ],
    })
  );

  // ── Operator Coverage Resource ─────────────────────────────────

  server.resource(
    "guide-operator-coverage",
    "camara://guide/operator-coverage",
    {
      description:
        "GSMA Open Gateway operator and aggregator coverage information",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "camara://guide/operator-coverage",
          mimeType: "text/markdown",
          text: [
            "# CAMARA API — Operator & Aggregator Coverage",
            "",
            "CAMARA APIs are accessed through GSMA Open Gateway aggregators or directly from telecom operators.",
            "",
            "## Aggregators (API Gateways)",
            "",
            "| Aggregator | Coverage | Popular APIs |",
            "|-----------|----------|-------------|",
            "| Vonage (Ericsson) | Global | Number Verification, SIM Swap |",
            "| Infobip | Europe, LATAM | Number Verification, Device Location |",
            "| Google Cloud | Global | Network APIs via Partner Cloud |",
            "| AWS | North America, Europe | Integrated with AWS services |",
            "| Azure / Microsoft | Global | Communication services |",
            "| Telefonica Open Gateway | Spain, LATAM, EU | Full CAMARA portfolio |",
            "",
            "## Operators Supporting Open Gateway",
            "",
            `${GSMA_INFO.supportedOperators}`,
            "",
            "## API Availability by Operator (General)",
            "",
            "| API | Tier 1 Operators | Aggregator Availability |",
            "|-----|------------------|------------------------|",
            "| Number Verification | High | All major aggregators |",
            "| SIM Swap | High | Most aggregators |",
            "| Device Location | Medium | Select operators |",
            "| Device Status | Medium | Growing coverage |",
            "| Quality on Demand | Low | Limited pilots |",
            "",
            "## How to Check Specific Coverage",
            "",
            "1. Visit the GSMA Open Gateway launch status page",
            "2. Contact your preferred aggregator for their operator roster",
            "3. Check if your target market's operators support the APIs you need",
            "",
            `**GSMA Launch Status:** ${GSMA_INFO.launchStatusUrl}`,
          ].join("\n"),
        },
      ],
    })
  );

  // ── DevCon Setup Guide ──────────────────────────────────────────

  server.resource(
    "devcon-setup",
    "camara://guide/devcon-setup",
    {
      description:
        "DevCon setup guide — two-server architecture, operator support, and quick-start examples",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "camara://guide/devcon-setup",
          mimeType: "text/markdown",
          text: [
            "# CAMARA MCP — DevCon Setup Guide",
            "",
            "## Two Servers, One Workflow",
            "",
            "Connect **both** MCP servers for the complete CAMARA development experience:",
            "",
            "| Server | URL | Purpose |",
            "|--------|-----|---------|",
            "| **CAMARA Docs** | `https://camara-mcp-server.nick-9a6.workers.dev/mcp` | API guidance, code generation, debugging help |",
            "| **CAMARA Prod** | `https://mcp.camaramcp.com/sse` | Live API calls via Telefonica, Deutsche Telekom, Vodafone |",
            "",
            "## Claude Desktop Configuration",
            "",
            "Add to `claude_desktop_config.json`:",
            "",
            "```json",
            "{",
            '  "mcpServers": {',
            '    "camara-docs": {',
            '      "type": "streamable-http",',
            '      "url": "https://camara-mcp-server.nick-9a6.workers.dev/mcp"',
            "    },",
            '    "camara-prod": {',
            '      "type": "sse",',
            '      "url": "https://mcp.camaramcp.com/sse"',
            "    }",
            "  }",
            "}",
            "```",
            "",
            "## Cursor Configuration",
            "",
            "Settings > MCP Servers > Add:",
            "- Name: `camara-docs`",
            "- Type: `streamable-http`",
            "- URL: `https://camara-mcp-server.nick-9a6.workers.dev/mcp`",
            "",
            "## Operator Support Matrix",
            "",
            "The production server connects to real telecom operators. Not all operators support all APIs:",
            "",
            "| Operator | Country Code | SIM Swap | Roaming Status | Device Swap | Location Verification |",
            "|----------|-------------|----------|----------------|-------------|----------------------|",
            "| Telefonica | +34 (Spain) | Yes | Yes | Yes | Yes |",
            "| Deutsche Telekom | +49 (Germany) | Yes | No | No | No |",
            "| Vodafone | +44 (UK) | Yes | No | No | No |",
            "",
            "**Important:** Only phone numbers from supported countries will work. Spain (+34) has full support across all APIs.",
            "",
            "## Quick Start — What to Ask",
            "",
            "Once connected, try these prompts with your AI assistant:",
            "",
            "1. **Explore:** \"Search for CAMARA APIs related to fraud detection\"",
            "2. **Learn:** \"Show me the SIM Swap API details and how auth works\"",
            "3. **Code:** \"Generate Python code to call Number Verification\"",
            "4. **Plan:** \"Give me a production checklist for Location Verification\"",
            "5. **Compare:** \"Compare SIM Swap vs Device Swap for fraud detection\"",
            "6. **Integrate:** \"Walk me through integrating Device Roaming Status end-to-end\"",
            "",
            "## Available Tools (13)",
            "",
            "- `camara_search_apis` — Search 60+ APIs by keyword, category, or status",
            "- `camara_get_api_detail` — Full details for any stable API",
            "- `camara_list_categories` — Browse all 8 API categories",
            "- `camara_generate_client_code` — Generate client code (curl/Python/TypeScript/Java)",
            "- `camara_auth_guide` — OIDC/OAuth2 authentication reference",
            "- `camara_compare_apis` — Side-by-side comparison of 2-5 APIs",
            "- `camara_integration_checklist` — Production-readiness checklist",
            "- `camara_migration_guide` — API version migration guidance",
            "- `camara_use_cases` — Industry-specific use case discovery",
            "- `camara_getting_started` — Developer onboarding guide",
            "- `camara_gsma_info` — GSMA Open Gateway details",
            "- `camara_get_release_info` — Meta-release notes",
            "- `camara_list_working_groups` — Working group info",
            "",
            "## 10 Stable APIs",
            "",
            "Number Verification, SIM Swap, Location Verification, Device Reachability Status,",
            "Device Roaming Status, One-Time Password SMS, Quality on Demand, QoS Profiles,",
            "Simple Edge Discovery, Device Swap",
          ].join("\n"),
        },
      ],
    })
  );

  // ── Meta-Release Notes ───────────────────────────────────────────

  server.resource(
    "release-fall25",
    "camara://release/fall25",
    {
      description: `CAMARA Meta-Release ${CURRENT_META_RELEASE.name} notes`,
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: "camara://release/fall25",
          mimeType: "text/markdown",
          text: [
            `# CAMARA Meta-Release: ${CURRENT_META_RELEASE.name}`,
            "",
            `**Date:** ${CURRENT_META_RELEASE.date}`,
            "",
            "## API Counts",
            `| Category | Count |`,
            `|----------|-------|`,
            `| Stable APIs | ${CURRENT_META_RELEASE.stableApis} |`,
            `| Updated Initial APIs | ${CURRENT_META_RELEASE.updatedInitialApis} |`,
            `| New Initial APIs | ${CURRENT_META_RELEASE.newInitialApis} |`,
            `| **Total** | **${CURRENT_META_RELEASE.totalApis}** |`,
            "",
            "## Highlights",
            ...CURRENT_META_RELEASE.highlights.map((h) => `- ${h}`),
            "",
            "## Stable APIs in This Release",
            ...STABLE_APIS.map(
              (a) =>
                `- **${a.name}** v${a.latestVersion} — ${a.description.slice(0, 80)}...`
            ),
          ].join("\n"),
        },
      ],
    })
  );
}
