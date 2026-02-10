/**
 * CAMARA MCP Tool Registrations
 * Registers all tools with the MCP server
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  SearchApisSchema,
  GetApiDetailSchema,
  ListCategoriesSchema,
  GetReleaseInfoSchema,
  GetWorkingGroupsSchema,
  GetStartedSchema,
  GetGsmaInfoSchema,
  CompareApisSchema,
  GetAuthGuideSchema,
  GetUseCasesSchema,
  GenerateClientCodeSchema,
  MigrationGuideSchema,
  IntegrationChecklistSchema,
  type SearchApisInput,
  type GetApiDetailInput,
  type ListCategoriesInput,
  type GetReleaseInfoInput,
  type GetWorkingGroupsInput,
  type GetStartedInput,
  type GetGsmaInfoInput,
  type CompareApisInput,
  type GetAuthGuideInput,
  type GetUseCasesInput,
  type GenerateClientCodeInput,
  type MigrationGuideInput,
  type IntegrationChecklistInput
} from "../schemas/tools.js";
import {
  searchApis,
  getApiDetail,
  listCategories,
  getLatestRelease,
  getReleaseHistory,
  listWorkingGroups,
  getGettingStarted,
  getGsmaInfo,
  formatApiSearchMarkdown,
  formatApiDetailMarkdown,
  formatCategoriesMarkdown,
  formatReleaseMarkdown
} from "../services/catalog.js";
import { STABLE_APIS, API_CATEGORIES, CAMARA_BASE_URL, type ApiCategory } from "../constants.js";
import type { ToolResult } from "../types.js";

function textResult(text: string, structured?: Record<string, unknown>): ToolResult {
  return {
    content: [{ type: "text", text }],
    ...(structured ? { structuredContent: structured } : {})
  };
}

function errorResult(message: string): ToolResult {
  return { isError: true, content: [{ type: "text", text: `Error: ${message}` }] };
}

export function registerAllTools(server: McpServer): void {
  // ─── 1. Search APIs ─────────────────────────────────────────────
  server.registerTool(
    "camara_search_apis",
    {
      title: "Search CAMARA APIs",
      description: `Search and discover CAMARA network APIs by keyword, category, or maturity status.

Searches across all 60+ CAMARA APIs including 10 stable production-ready APIs and 50+ initial/sandbox APIs.
Matches against API names, descriptions, use cases, and target industries.

Args:
  - query (string, optional): Search term (e.g., 'fraud', 'location', 'banking', 'sim swap')
  - category (string, optional): Filter by category — auth-fraud, location, communication, communication-quality, device-info, computing, payments, identity
  - status (string, optional): 'stable' for production-ready, 'initial' for in-development
  - limit (number): Max results (default 20, max 100)
  - offset (number): Pagination offset
  - response_format ('markdown' | 'json'): Output format

Returns: List of matching APIs with name, version, status, description, and repository links.

Examples:
  - "Find fraud prevention APIs" → query="fraud", category="auth-fraud"
  - "Show all stable APIs" → status="stable"
  - "Banking APIs" → query="banking"
  - "Location services" → category="location"`,
      inputSchema: SearchApisSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: SearchApisInput): Promise<ToolResult> => {
      const results = searchApis(params.query, params.category, params.status, params.limit, params.offset);
      if (params.response_format === "json") {
        return textResult(JSON.stringify(results, null, 2), results as unknown as Record<string, unknown>);
      }
      return textResult(formatApiSearchMarkdown(results));
    }
  );

  // ─── 2. Get API Detail ──────────────────────────────────────────
  server.registerTool(
    "camara_get_api_detail",
    {
      title: "Get CAMARA API Details",
      description: `Get comprehensive details for a specific stable CAMARA API including endpoints, auth flows, use cases, version history, and integration guidance.

Args:
  - slug (string, required): API identifier. Valid slugs: number-verification, sim-swap, location-verification, device-reachability-status, device-roaming-status, one-time-password-sms, quality-on-demand, qos-profiles, simple-edge-discovery, device-swap
  - response_format ('markdown' | 'json'): Output format

Returns: Complete API specification including description, endpoints, authentication flow, use cases, target industries, version history, and all relevant links.

Examples:
  - Get Number Verification details → slug="number-verification"
  - Get SIM Swap API info → slug="sim-swap"`,
      inputSchema: GetApiDetailSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: GetApiDetailInput): Promise<ToolResult> => {
      const detail = getApiDetail(params.slug);
      if (!detail) {
        const validSlugs = STABLE_APIS.map(a => a.slug).join(", ");
        return errorResult(`API '${params.slug}' not found. Valid stable API slugs: ${validSlugs}`);
      }
      if (params.response_format === "json") {
        return textResult(JSON.stringify(detail, null, 2), detail as unknown as Record<string, unknown>);
      }
      return textResult(formatApiDetailMarkdown(detail));
    }
  );

  // ─── 3. List Categories ─────────────────────────────────────────
  server.registerTool(
    "camara_list_categories",
    {
      title: "List CAMARA API Categories",
      description: `List all CAMARA API categories with descriptions and the APIs in each category.

Categories: Authentication & Fraud Prevention, Location Services, Communication Services, Communication Quality, Device Information, Computing Services, Payments & Charging, Identity & KYC.

Returns: All 8 categories with their APIs grouped and counted.`,
      inputSchema: ListCategoriesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: ListCategoriesInput): Promise<ToolResult> => {
      const cats = listCategories();
      if (params.response_format === "json") {
        return textResult(JSON.stringify(cats, null, 2), { categories: cats } as unknown as Record<string, unknown>);
      }
      return textResult(formatCategoriesMarkdown(cats));
    }
  );

  // ─── 4. Release Info ────────────────────────────────────────────
  server.registerTool(
    "camara_get_release_info",
    {
      title: "Get CAMARA Meta-Release Info",
      description: `Get information about CAMARA meta-releases. CAMARA publishes bi-annual meta-releases (Spring and Fall) that bundle stable, vetted API versions.

Args:
  - release ('latest' | 'history'): Get current release or full history
  - response_format ('markdown' | 'json'): Output format

Returns: Release details including API counts, dates, and highlights.`,
      inputSchema: GetReleaseInfoSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: GetReleaseInfoInput): Promise<ToolResult> => {
      if (params.release === "history") {
        const releases = getReleaseHistory();
        if (params.response_format === "json") {
          return textResult(JSON.stringify(releases, null, 2), { releases } as unknown as Record<string, unknown>);
        }
        return textResult(releases.map(formatReleaseMarkdown).join("\n\n---\n\n"));
      }
      const release = getLatestRelease();
      if (params.response_format === "json") {
        return textResult(JSON.stringify(release, null, 2), release as unknown as Record<string, unknown>);
      }
      return textResult(formatReleaseMarkdown(release));
    }
  );

  // ─── 5. Working Groups ──────────────────────────────────────────
  server.registerTool(
    "camara_list_working_groups",
    {
      title: "List CAMARA Working Groups",
      description: `List CAMARA's working groups: Commonalities (API design guidelines), Identity & Consent Management (auth/consent patterns), and Release Management (meta-release coordination).

Returns: Working group details including repositories, meeting schedules, and mailing lists.`,
      inputSchema: GetWorkingGroupsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: GetWorkingGroupsInput): Promise<ToolResult> => {
      const groups = listWorkingGroups();
      if (params.response_format === "json") {
        return textResult(JSON.stringify(groups, null, 2), { working_groups: groups } as unknown as Record<string, unknown>);
      }
      const lines = ["## CAMARA Working Groups\n"];
      for (const g of groups) {
        lines.push(`### ${g.name}`);
        lines.push(g.description);
        lines.push(`- **Repository:** ${g.repository_url}`);
        lines.push(`- **Meetings:** ${g.meeting_schedule}`);
        lines.push(`- **Mailing List:** ${g.mailing_list}`);
        lines.push("");
      }
      return textResult(lines.join("\n"));
    }
  );

  // ─── 6. Getting Started ─────────────────────────────────────────
  server.registerTool(
    "camara_getting_started",
    {
      title: "CAMARA Getting Started Guide",
      description: `Get a comprehensive getting-started guide for developers new to CAMARA. Includes step-by-step onboarding, authentication overview, recommended first API, and all key resources.

Returns: Complete developer onboarding guide with links to documentation, GitHub repos, and GSMA resources.`,
      inputSchema: GetStartedSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: GetStartedInput): Promise<ToolResult> => {
      const guide = getGettingStarted();
      if (params.response_format === "json") {
        return textResult(JSON.stringify(guide, null, 2), guide as unknown as Record<string, unknown>);
      }
      const lines = [
        "## Getting Started with CAMARA APIs\n",
        guide.overview, "",
        "### Step-by-Step Onboarding",
        ...guide.steps, "",
        "### Authentication",
        guide.auth_overview, "",
        "### Recommended First API",
        guide.first_api_suggestion, "",
        "### Key Resources",
        ...Object.entries(guide.resources).map(([k, v]) => `- **${k}:** ${v}`)
      ];
      return textResult(lines.join("\n"));
    }
  );

  // ─── 7. GSMA Open Gateway Info ──────────────────────────────────
  server.registerTool(
    "camara_gsma_info",
    {
      title: "GSMA Open Gateway Information",
      description: `Get information about GSMA Open Gateway — the commercial channel through which telecom operators expose CAMARA APIs. Includes supported operators, aggregators, and the relationship between CAMARA and GSMA.

Returns: GSMA Open Gateway details, aggregator list, and operator coverage.`,
      inputSchema: GetGsmaInfoSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: GetGsmaInfoInput): Promise<ToolResult> => {
      const info = getGsmaInfo();
      if (params.response_format === "json") {
        return textResult(JSON.stringify(info, null, 2), info as unknown as Record<string, unknown>);
      }
      const lines = [
        "## GSMA Open Gateway\n",
        info.description, "",
        `**Operators:** ${info.supportedOperators}`,
        `**Aggregators:** ${info.aggregators.join(", ")}`, "",
        `**CAMARA ↔ GSMA Relationship:** ${info.relationship}`, "",
        `**Launch Status:** ${info.launchStatusUrl}`
      ];
      return textResult(lines.join("\n"));
    }
  );

  // ─── 8. Compare APIs ────────────────────────────────────────────
  server.registerTool(
    "camara_compare_apis",
    {
      title: "Compare CAMARA APIs",
      description: `Side-by-side comparison of 2-5 CAMARA stable APIs. Useful for understanding the differences between similar APIs like SIM Swap vs Device Swap, or Location Verification vs Location Retrieval.

Args:
  - slugs (string[]): 2-5 API slugs to compare
  - response_format ('markdown' | 'json'): Output format

Returns: Comparison table with status, version, auth flow, endpoints, and use cases for each API.

Examples:
  - Compare fraud APIs → slugs=["sim-swap", "device-swap", "number-verification"]
  - Compare QoS APIs → slugs=["quality-on-demand", "qos-profiles"]`,
      inputSchema: CompareApisSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: CompareApisInput): Promise<ToolResult> => {
      const details = params.slugs.map(s => getApiDetail(s)).filter(Boolean);
      if (details.length < 2) {
        const validSlugs = STABLE_APIS.map(a => a.slug).join(", ");
        return errorResult(`Need at least 2 valid stable API slugs. Valid: ${validSlugs}`);
      }

      if (params.response_format === "json") {
        return textResult(JSON.stringify({ apis: details }, null, 2), { apis: details } as unknown as Record<string, unknown>);
      }

      const lines = ["## CAMARA API Comparison\n"];
      const headers = ["Feature", ...details.map(d => d!.name)];
      const rows = [
        ["Version", ...details.map(d => `v${d!.latest_version}`)],
        ["Category", ...details.map(d => API_CATEGORIES[d!.category as ApiCategory]?.label || d!.category)],
        ["Auth Flow", ...details.map(d => d!.auth_flow)],
        ["HTTP Methods", ...details.map(d => d!.http_methods.join(", "))],
        ["Industries", ...details.map(d => d!.industries.slice(0, 3).join(", "))],
        ["Endpoints", ...details.map(d => String(d!.key_endpoints.length))]
      ];

      lines.push(`| ${headers.join(" | ")} |`);
      lines.push(`| ${headers.map(() => "---").join(" | ")} |`);
      for (const row of rows) {
        lines.push(`| ${row.join(" | ")} |`);
      }
      lines.push("");

      for (const d of details) {
        lines.push(`### ${d!.name} — Key Endpoints`);
        for (const ep of d!.key_endpoints) lines.push(`- \`${ep}\``);
        lines.push(`**Top Use Cases:** ${d!.use_cases.slice(0, 3).join("; ")}`);
        lines.push("");
      }
      return textResult(lines.join("\n"));
    }
  );

  // ─── 9. Auth Guide ──────────────────────────────────────────────
  server.registerTool(
    "camara_auth_guide",
    {
      title: "CAMARA Authentication Guide",
      description: `Get authentication and authorization guidance for CAMARA APIs. Explains OIDC/OAuth2 flows used by CAMARA, including 2-legged (Client Credentials) and 3-legged (Authorization Code) patterns.

Args:
  - api_slug (string, optional): Get auth details for a specific API
  - response_format ('markdown' | 'json'): Output format

Returns: Authentication flow details, implementation guidance, and relevant Identity & Consent Management (ICM) resources.`,
      inputSchema: GetAuthGuideSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: GetAuthGuideInput): Promise<ToolResult> => {
      const guide = {
        overview: "CAMARA uses OIDC/OAuth2 for all API authentication. The Identity and Consent Management (ICM) working group defines the patterns.",
        flows: [
          {
            name: "Client Credentials (2-legged)",
            description: "Server-to-server. No user interaction required. Used when the API consumer can identify the device/subscriber through other means (e.g., network-attached device).",
            grant_type: "client_credentials",
            apis: STABLE_APIS.filter(a => a.authFlow.includes("Client Credentials")).map(a => a.name)
          },
          {
            name: "Authorization Code (3-legged)",
            description: "Requires user consent via redirect. Used when accessing user-specific data that requires explicit permission.",
            grant_type: "authorization_code",
            apis: STABLE_APIS.filter(a => a.authFlow.includes("Authorization Code")).map(a => a.name)
          }
        ],
        icm_repository: "https://github.com/camaraproject/IdentityAndConsentManagement",
        commonalities_link: "https://github.com/camaraproject/Commonalities",
        specific_api: params.api_slug ? getApiDetail(params.api_slug) : null
      };

      if (params.response_format === "json") {
        return textResult(JSON.stringify(guide, null, 2), guide as unknown as Record<string, unknown>);
      }

      const lines = [
        "## CAMARA Authentication Guide\n",
        guide.overview, "",
        "### Client Credentials (2-Legged OAuth2)",
        guide.flows[0].description,
        `**Used by:** ${guide.flows[0].apis.join(", ")}`, "",
        "### Authorization Code (3-Legged OIDC)",
        guide.flows[1].description,
        `**Used by:** ${guide.flows[1].apis.join(", ")}`, "",
        `### Resources`,
        `- ICM Working Group: ${guide.icm_repository}`,
        `- Commonalities: ${guide.commonalities_link}`
      ];

      if (guide.specific_api) {
        lines.push("", `### ${guide.specific_api.name} Auth Details`);
        lines.push(`**Flow:** ${guide.specific_api.auth_flow}`);
        lines.push(`**Endpoints:** ${guide.specific_api.key_endpoints.join("; ")}`);
      }

      return textResult(lines.join("\n"));
    }
  );

  // ─── 10. Use Cases by Industry ──────────────────────────────────
  server.registerTool(
    "camara_use_cases",
    {
      title: "CAMARA Use Cases by Industry",
      description: `Discover CAMARA API use cases filtered by industry. Shows which APIs are relevant for Banking, Healthcare, Gaming, IoT, Insurance, E-Commerce, and other industries.

Args:
  - industry (string, optional): Filter by industry name (e.g., 'banking', 'healthcare', 'gaming')
  - response_format ('markdown' | 'json'): Output format

Returns: Industry-specific use cases mapped to relevant CAMARA APIs.`,
      inputSchema: GetUseCasesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: GetUseCasesInput): Promise<ToolResult> => {
      const industryMap: Record<string, Array<{ api: string; slug: string; use_cases: string[] }>> = {};

      for (const api of STABLE_APIS) {
        for (const ind of api.industries) {
          const key = ind.toLowerCase();
          if (params.industry && !key.includes(params.industry.toLowerCase())) continue;
          if (!industryMap[ind]) industryMap[ind] = [];
          industryMap[ind].push({
            api: api.name,
            slug: api.slug,
            use_cases: api.useCases
          });
        }
      }

      if (Object.keys(industryMap).length === 0) {
        const allIndustries = [...new Set(STABLE_APIS.flatMap(a => a.industries))].sort();
        return errorResult(`No APIs found for industry '${params.industry}'. Available: ${allIndustries.join(", ")}`);
      }

      if (params.response_format === "json") {
        return textResult(JSON.stringify(industryMap, null, 2), industryMap as unknown as Record<string, unknown>);
      }

      const lines = ["## CAMARA Use Cases by Industry\n"];
      for (const [industry, apis] of Object.entries(industryMap).sort()) {
        lines.push(`### ${industry}`);
        for (const entry of apis) {
          lines.push(`**${entry.api}** (\`${entry.slug}\`)`);
          for (const uc of entry.use_cases.slice(0, 3)) {
            lines.push(`  - ${uc}`);
          }
        }
        lines.push("");
      }
      return textResult(lines.join("\n"));
    }
  );

  // ─── 11. Generate Client Code ──────────────────────────────────
  server.registerTool(
    "camara_generate_client_code",
    {
      title: "Generate CAMARA API Client Code",
      description: `Generate ready-to-use client code snippets for any stable CAMARA API. Supports curl, Python (requests), TypeScript (fetch), and Java (HttpClient).

Args:
  - slug (string, required): API slug (e.g., 'sim-swap', 'number-verification')
  - language ('curl' | 'python' | 'typescript' | 'java'): Target language
  - auth_flow ('client_credentials' | 'authorization_code', optional): Override auth flow
  - response_format ('markdown' | 'json'): Output format

Returns: Complete code snippet with authentication flow, API call, error handling, and environment variable placeholders.

Examples:
  - curl for SIM Swap → slug="sim-swap", language="curl"
  - Python for Location Verification → slug="location-verification", language="python"
  - TypeScript for Number Verification → slug="number-verification", language="typescript"`,
      inputSchema: GenerateClientCodeSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: GenerateClientCodeInput): Promise<ToolResult> => {
      const api = STABLE_APIS.find(a => a.slug === params.slug);
      if (!api) {
        const validSlugs = STABLE_APIS.map(a => a.slug).join(", ");
        return errorResult(`API '${params.slug}' not found. Valid slugs: ${validSlugs}`);
      }

      const endpoint = api.keyEndpoints[0] || "POST /api/v1/endpoint";
      const parts = endpoint.split(" ");
      const method = parts[0];
      const path = parts.slice(1).join(" ").split(" - ")[0].trim();
      const isTwoLegged = params.auth_flow
        ? params.auth_flow === "client_credentials"
        : api.authFlow.includes("Client Credentials");

      const tokenStep = isTwoLegged
        ? "# 2-legged: Client Credentials grant (no user interaction)"
        : "# 3-legged: Authorization Code grant (requires user redirect + consent)";

      const snippets: Record<string, string> = {
        curl: [
          `#!/bin/bash`,
          `# ${api.name} — ${api.description.slice(0, 80)}`,
          `# Docs: ${api.websiteUrl}`,
          ``,
          `# ── Step 1: Get Access Token ──`,
          tokenStep,
          `TOKEN=$(curl -s -X POST "https://\${OPERATOR_AUTH_HOST}/oauth2/token" \\`,
          `  -H "Content-Type: application/x-www-form-urlencoded" \\`,
          `  -d "grant_type=${isTwoLegged ? "client_credentials" : "authorization_code"}" \\`,
          `  -d "client_id=\${CLIENT_ID}" \\`,
          `  -d "client_secret=\${CLIENT_SECRET}"` + (isTwoLegged ? ` \\` : ` \\\n  -d "code=\${AUTH_CODE}" \\\n  -d "redirect_uri=\${REDIRECT_URI}" \\`),
          `  | jq -r '.access_token')`,
          ``,
          `# ── Step 2: Call ${api.name} API ──`,
          `curl -X ${method} "https://\${OPERATOR_API_HOST}${path}" \\`,
          `  -H "Authorization: Bearer \${TOKEN}" \\`,
          `  -H "Content-Type: application/json" \\`,
          `  -d '{`,
          `    "phoneNumber": "+1234567890"`,
          `  }'`,
        ].join("\n"),

        python: [
          `"""${api.name} — Python Client`,
          `${api.description.slice(0, 80)}`,
          `Docs: ${api.websiteUrl}`,
          `"""`,
          `import os`,
          `import requests`,
          ``,
          `OPERATOR_AUTH_HOST = os.environ["OPERATOR_AUTH_HOST"]`,
          `OPERATOR_API_HOST = os.environ["OPERATOR_API_HOST"]`,
          `CLIENT_ID = os.environ["CLIENT_ID"]`,
          `CLIENT_SECRET = os.environ["CLIENT_SECRET"]`,
          ``,
          `# ── Step 1: Get Access Token ──`,
          tokenStep,
          `token_resp = requests.post(`,
          `    f"https://{OPERATOR_AUTH_HOST}/oauth2/token",`,
          `    data={`,
          `        "grant_type": "${isTwoLegged ? "client_credentials" : "authorization_code"}",`,
          `        "client_id": CLIENT_ID,`,
          `        "client_secret": CLIENT_SECRET,`,
          `    },`,
          `)`,
          `token_resp.raise_for_status()`,
          `access_token = token_resp.json()["access_token"]`,
          ``,
          `# ── Step 2: Call ${api.name} API ──`,
          `resp = requests.${method.toLowerCase()}(`,
          `    f"https://{OPERATOR_API_HOST}${path}",`,
          `    headers={`,
          `        "Authorization": f"Bearer {access_token}",`,
          `        "Content-Type": "application/json",`,
          `    },`,
          `    json={"phoneNumber": "+1234567890"},`,
          `)`,
          `resp.raise_for_status()`,
          `print(resp.json())`,
        ].join("\n"),

        typescript: [
          `// ${api.name} — TypeScript Client`,
          `// ${api.description.slice(0, 80)}`,
          `// Docs: ${api.websiteUrl}`,
          ``,
          `const OPERATOR_AUTH_HOST = process.env.OPERATOR_AUTH_HOST!;`,
          `const OPERATOR_API_HOST = process.env.OPERATOR_API_HOST!;`,
          `const CLIENT_ID = process.env.CLIENT_ID!;`,
          `const CLIENT_SECRET = process.env.CLIENT_SECRET!;`,
          ``,
          `// ── Step 1: Get Access Token ──`,
          `${tokenStep}`,
          `const tokenResp = await fetch(\`https://\${OPERATOR_AUTH_HOST}/oauth2/token\`, {`,
          `  method: "POST",`,
          `  headers: { "Content-Type": "application/x-www-form-urlencoded" },`,
          `  body: new URLSearchParams({`,
          `    grant_type: "${isTwoLegged ? "client_credentials" : "authorization_code"}",`,
          `    client_id: CLIENT_ID,`,
          `    client_secret: CLIENT_SECRET,`,
          `  }),`,
          `});`,
          `const { access_token } = await tokenResp.json() as { access_token: string };`,
          ``,
          `// ── Step 2: Call ${api.name} API ──`,
          `const resp = await fetch(\`https://\${OPERATOR_API_HOST}${path}\`, {`,
          `  method: "${method}",`,
          `  headers: {`,
          `    Authorization: \`Bearer \${access_token}\`,`,
          `    "Content-Type": "application/json",`,
          `  },`,
          `  body: JSON.stringify({ phoneNumber: "+1234567890" }),`,
          `});`,
          `const data = await resp.json();`,
          `console.log(data);`,
        ].join("\n"),

        java: [
          `// ${api.name} — Java Client (Java 11+ HttpClient)`,
          `// ${api.description.slice(0, 80)}`,
          `// Docs: ${api.websiteUrl}`,
          ``,
          `import java.net.URI;`,
          `import java.net.http.*;`,
          `import java.net.http.HttpResponse.BodyHandlers;`,
          ``,
          `public class ${api.name.replace(/[^a-zA-Z]/g, "")}Client {`,
          `  public static void main(String[] args) throws Exception {`,
          `    var client = HttpClient.newHttpClient();`,
          `    String authHost = System.getenv("OPERATOR_AUTH_HOST");`,
          `    String apiHost = System.getenv("OPERATOR_API_HOST");`,
          ``,
          `    // ── Step 1: Get Access Token ──`,
          `    var tokenReq = HttpRequest.newBuilder()`,
          `      .uri(URI.create("https://" + authHost + "/oauth2/token"))`,
          `      .POST(HttpRequest.BodyPublishers.ofString(`,
          `        "grant_type=${isTwoLegged ? "client_credentials" : "authorization_code"}"`,
          `        + "&client_id=" + System.getenv("CLIENT_ID")`,
          `        + "&client_secret=" + System.getenv("CLIENT_SECRET")))`,
          `      .header("Content-Type", "application/x-www-form-urlencoded")`,
          `      .build();`,
          `    var tokenResp = client.send(tokenReq, BodyHandlers.ofString());`,
          `    // Parse access_token from JSON response`,
          ``,
          `    // ── Step 2: Call ${api.name} API ──`,
          `    var apiReq = HttpRequest.newBuilder()`,
          `      .uri(URI.create("https://" + apiHost + "${path}"))`,
          `      .${method === "POST" ? "POST" : "GET"}(HttpRequest.BodyPublishers.ofString(`,
          `        "{\\"phoneNumber\\": \\"+1234567890\\"}"))`,
          `      .header("Authorization", "Bearer " + accessToken)`,
          `      .header("Content-Type", "application/json")`,
          `      .build();`,
          `    var resp = client.send(apiReq, BodyHandlers.ofString());`,
          `    System.out.println(resp.body());`,
          `  }`,
          `}`,
        ].join("\n"),
      };

      const code = snippets[params.language];

      if (params.response_format === "json") {
        const result = {
          api: api.name,
          slug: api.slug,
          language: params.language,
          auth_flow: isTwoLegged ? "client_credentials" : "authorization_code",
          code,
          environment_variables: ["OPERATOR_AUTH_HOST", "OPERATOR_API_HOST", "CLIENT_ID", "CLIENT_SECRET"],
          documentation: api.websiteUrl,
          repository: `${CAMARA_BASE_URL}/${api.repository}`
        };
        return textResult(JSON.stringify(result, null, 2), result as unknown as Record<string, unknown>);
      }

      const langLabel: Record<string, string> = { curl: "Bash (curl)", python: "Python", typescript: "TypeScript", java: "Java" };
      return textResult([
        `## ${api.name} — ${langLabel[params.language]} Client Code\n`,
        `**Auth Flow:** ${isTwoLegged ? "Client Credentials (2-legged)" : "Authorization Code (3-legged)"}`,
        `**Endpoint:** \`${endpoint}\`\n`,
        "### Environment Variables",
        "```",
        "OPERATOR_AUTH_HOST=auth.operator.example.com",
        "OPERATOR_API_HOST=api.operator.example.com",
        "CLIENT_ID=your-client-id",
        "CLIENT_SECRET=your-client-secret",
        "```\n",
        `### Code\n`,
        "```" + (params.language === "curl" ? "bash" : params.language),
        code,
        "```\n",
        `**Docs:** ${api.websiteUrl}`,
        `**Repo:** ${CAMARA_BASE_URL}/${api.repository}`,
      ].join("\n"));
    }
  );

  // ─── 12. Migration Guide ──────────────────────────────────────
  server.registerTool(
    "camara_migration_guide",
    {
      title: "CAMARA API Version Migration Guide",
      description: `Get guidance on migrating between CAMARA API versions. Shows what changed between versions, breaking changes, and step-by-step migration instructions.

Args:
  - slug (string, required): API slug to get migration info for
  - from_version (string, optional): Source version (defaults to previous version)
  - response_format ('markdown' | 'json'): Output format

Returns: Version history, breaking changes, migration steps, and updated endpoint references.`,
      inputSchema: MigrationGuideSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: MigrationGuideInput): Promise<ToolResult> => {
      const api = STABLE_APIS.find(a => a.slug === params.slug);
      if (!api) {
        const validSlugs = STABLE_APIS.map(a => a.slug).join(", ");
        return errorResult(`API '${params.slug}' not found. Valid slugs: ${validSlugs}`);
      }

      const fromVersion = params.from_version || api.previousVersions[0] || "0.x";
      const toVersion = api.latestVersion;
      const majorBump = fromVersion.split(".")[0] !== toVersion.split(".")[0];

      const guide = {
        api: api.name,
        slug: api.slug,
        from_version: fromVersion,
        to_version: toVersion,
        is_major_upgrade: majorBump,
        changelog_url: `${CAMARA_BASE_URL}/${api.repository}/blob/main/CHANGELOG.md`,
        migration_steps: [
          `1. Review the CHANGELOG at ${CAMARA_BASE_URL}/${api.repository}/blob/main/CHANGELOG.md`,
          `2. Update your OpenAPI spec from ${CAMARA_BASE_URL}/${api.repository}/tree/main/code/API_definitions`,
          `3. Update endpoint paths: check if base paths changed (v${fromVersion} → v${toVersion})`,
          ...(majorBump ? [
            `4. ⚠️ MAJOR VERSION: Check for breaking changes in request/response schemas`,
            `5. ⚠️ MAJOR VERSION: Verify authentication scopes — new scopes may be required`,
            `6. Update error handling — error response formats may have changed per CAMARA Commonalities`,
            `7. Test in sandbox environment before production deployment`,
            `8. Update SDK/client library to latest version`,
          ] : [
            `4. Minor version: backward-compatible changes expected`,
            `5. Check for new optional fields in responses`,
            `6. Test in sandbox to confirm compatibility`,
          ]),
        ],
        key_resources: {
          changelog: `${CAMARA_BASE_URL}/${api.repository}/blob/main/CHANGELOG.md`,
          api_definitions: `${CAMARA_BASE_URL}/${api.repository}/tree/main/code/API_definitions`,
          commonalities: `${CAMARA_BASE_URL}/Commonalities`,
          release_notes: `${CAMARA_BASE_URL}/${api.repository}/releases`,
        },
        commonalities_changes: [
          "Error response format aligned with RFC 7807 Problem Details",
          "CloudEvents v1.0 for event subscriptions",
          "Standardized device identifier format",
          "Consistent pagination patterns",
        ],
        version_history: [toVersion, ...api.previousVersions],
      };

      if (params.response_format === "json") {
        return textResult(JSON.stringify(guide, null, 2), guide as unknown as Record<string, unknown>);
      }

      return textResult([
        `## ${api.name} — Migration Guide (v${fromVersion} → v${toVersion})\n`,
        majorBump ? "### ⚠️ Major Version Upgrade — Breaking Changes Expected\n" : "### Minor Version Upgrade — Backward Compatible\n",
        "### Migration Steps",
        ...guide.migration_steps,
        "",
        "### Commonalities Changes to Watch",
        ...guide.commonalities_changes.map(c => `- ${c}`),
        "",
        "### Version History",
        guide.version_history.map((v, i) => `${i === 0 ? "→ " : "  "}v${v}${i === 0 ? " (current)" : ""}`).join("\n"),
        "",
        "### Key Resources",
        ...Object.entries(guide.key_resources).map(([k, v]) => `- **${k}:** ${v}`),
      ].join("\n"));
    }
  );

  // ─── 13. Integration Checklist ────────────────────────────────
  server.registerTool(
    "camara_integration_checklist",
    {
      title: "CAMARA API Integration Checklist",
      description: `Generate a production-readiness checklist for integrating a CAMARA API. Covers authentication setup, error handling, monitoring, compliance, and go-live steps.

Args:
  - slug (string, required): API slug to create checklist for
  - environment ('sandbox' | 'production'): Target environment
  - response_format ('markdown' | 'json'): Output format

Returns: Comprehensive integration checklist with categories: Auth, Implementation, Error Handling, Testing, Monitoring, Compliance, and Go-Live.`,
      inputSchema: IntegrationChecklistSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: IntegrationChecklistInput): Promise<ToolResult> => {
      const api = STABLE_APIS.find(a => a.slug === params.slug);
      if (!api) {
        const validSlugs = STABLE_APIS.map(a => a.slug).join(", ");
        return errorResult(`API '${params.slug}' not found. Valid slugs: ${validSlugs}`);
      }

      const isProd = params.environment === "production";
      const isTwoLegged = api.authFlow.includes("Client Credentials");
      const isThreeLegged = api.authFlow.includes("Authorization Code");

      const checklist = {
        api: api.name,
        slug: api.slug,
        environment: params.environment,
        categories: {
          authentication: [
            `☐ Register with GSMA Open Gateway aggregator or operator portal`,
            `☐ Obtain client_id and client_secret`,
            isTwoLegged ? `☐ Implement Client Credentials (2-legged) token flow` : null,
            isThreeLegged ? `☐ Implement Authorization Code (3-legged) OIDC flow` : null,
            isThreeLegged ? `☐ Configure redirect URI for authorization callback` : null,
            isThreeLegged ? `☐ Implement user consent screen` : null,
            `☐ Implement token refresh/renewal logic`,
            `☐ Store credentials securely (never in source code)`,
          ].filter(Boolean),
          implementation: [
            `☐ Download OpenAPI spec from ${CAMARA_BASE_URL}/${api.repository}`,
            `☐ Generate or write API client for endpoints:`,
            ...api.keyEndpoints.map(ep => `    ☐ ${ep}`),
            `☐ Implement request body construction with correct device identifiers`,
            `☐ Parse response schemas correctly`,
            `☐ Handle optional/nullable fields gracefully`,
          ],
          error_handling: [
            `☐ Handle HTTP 400 — Bad Request (invalid parameters)`,
            `☐ Handle HTTP 401 — Unauthorized (token expired/invalid)`,
            `☐ Handle HTTP 403 — Forbidden (insufficient scope/consent)`,
            `☐ Handle HTTP 404 — Not Found (invalid endpoint)`,
            `☐ Handle HTTP 429 — Rate Limited (implement backoff)`,
            `☐ Handle HTTP 500/503 — Server Error (retry with exponential backoff)`,
            `☐ Parse RFC 7807 Problem Details error responses`,
            `☐ Implement circuit breaker for operator outages`,
          ],
          testing: [
            `☐ Test with operator sandbox environment`,
            `☐ Verify happy-path responses match OpenAPI schema`,
            `☐ Test error scenarios (invalid phone, expired token, etc.)`,
            `☐ Test token refresh flow`,
            isProd ? `☐ Load test with expected production traffic` : null,
            isProd ? `☐ Verify rate limits are sufficient for your traffic` : null,
          ].filter(Boolean),
          monitoring: isProd ? [
            `☐ Monitor API latency (p50, p95, p99)`,
            `☐ Alert on error rate spikes (>1% 5xx errors)`,
            `☐ Track token renewal success rate`,
            `☐ Monitor rate limit headroom`,
            `☐ Log all API calls for audit trail`,
            `☐ Dashboard for API health metrics`,
          ] : [
            `☐ Log API requests and responses for debugging`,
            `☐ Track error types for troubleshooting`,
          ],
          compliance: isProd ? [
            `☐ Review data privacy requirements (GDPR, local regulations)`,
            `☐ Ensure phone numbers are handled as PII`,
            `☐ Document data retention policy for API responses`,
            `☐ Verify consent mechanisms for 3-legged APIs`,
            `☐ Review CAMARA Commonalities data handling guidelines`,
          ] : [
            `☐ Use test phone numbers only (no real user data in sandbox)`,
          ],
          go_live: isProd ? [
            `☐ Complete operator production onboarding`,
            `☐ Switch from sandbox to production credentials`,
            `☐ Verify production endpoint URLs`,
            `☐ Gradual rollout (canary → percentage → full)`,
            `☐ Runbook for API degradation scenarios`,
            `☐ Establish SLA expectations with operator/aggregator`,
          ] : [],
        }
      };

      if (params.response_format === "json") {
        return textResult(JSON.stringify(checklist, null, 2), checklist as unknown as Record<string, unknown>);
      }

      const lines = [
        `## ${api.name} — ${isProd ? "Production" : "Sandbox"} Integration Checklist\n`,
        `**API:** ${api.name} v${api.latestVersion}`,
        `**Auth:** ${api.authFlow}`,
        `**Docs:** ${api.websiteUrl}\n`,
      ];

      const labels: Record<string, string> = {
        authentication: "Authentication Setup",
        implementation: "API Implementation",
        error_handling: "Error Handling",
        testing: "Testing",
        monitoring: "Monitoring & Observability",
        compliance: "Compliance & Privacy",
        go_live: "Go-Live",
      };

      for (const [key, items] of Object.entries(checklist.categories)) {
        if ((items as string[]).length === 0) continue;
        lines.push(`### ${labels[key] || key}`);
        for (const item of items as string[]) {
          lines.push(item);
        }
        lines.push("");
      }

      return textResult(lines.join("\n"));
    }
  );
}
