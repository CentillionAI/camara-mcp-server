/**
 * CAMARA MCP Prompts
 * Guided workflow templates for common CAMARA developer questions
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerAllPrompts(server: McpServer): void {
  // ── 1. Quickstart ────────────────────────────────────────────────

  server.prompt(
    "camara-quickstart",
    "Get started with CAMARA APIs for a specific use case and industry",
    {
      use_case: z
        .string()
        .describe(
          "Your use case (e.g., 'fraud prevention', 'location verification', 'IoT monitoring')"
        ),
      industry: z
        .string()
        .optional()
        .describe(
          "Your industry (e.g., 'banking', 'healthcare', 'gaming', 'logistics')"
        ),
    },
    async ({ use_case, industry }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              `I need help getting started with CAMARA APIs for: ${use_case}`,
              industry ? `Industry: ${industry}` : "",
              "",
              "Please:",
              "1. Use camara_search_apis to find relevant APIs for my use case",
              "2. Use camara_get_api_detail for the top 2-3 recommendations",
              "3. Use camara_auth_guide to explain authentication requirements",
              "4. Provide a clear integration approach with example endpoints",
              "5. Suggest which GSMA Open Gateway aggregator to use",
              "",
              "Give me a step-by-step implementation plan I can follow.",
            ]
              .filter(Boolean)
              .join("\n"),
          },
        },
      ],
    })
  );

  // ── 2. Choose API ────────────────────────────────────────────────

  server.prompt(
    "camara-choose-api",
    "Get a recommendation for which CAMARA API best fits your requirement",
    {
      requirement: z
        .string()
        .describe(
          "What you're trying to accomplish (e.g., 'verify user phone numbers', 'detect fraud')"
        ),
    },
    async ({ requirement }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              `I need to: ${requirement}`,
              "",
              "Please:",
              "1. Search for relevant CAMARA APIs using camara_search_apis",
              "2. Get details on the top candidates using camara_get_api_detail",
              "3. Compare them using camara_compare_apis if there are multiple options",
              "4. Explain tradeoffs (auth complexity, data returned, latency)",
              "5. Give me a clear recommendation with reasoning",
              "",
              "Provide concrete implementation guidance including endpoints and auth flow.",
            ].join("\n"),
          },
        },
      ],
    })
  );

  // ── 3. Auth Setup ────────────────────────────────────────────────

  server.prompt(
    "camara-auth-setup",
    "Get a complete authentication setup guide for a specific CAMARA API",
    {
      api_name: z
        .string()
        .describe(
          "API name or slug (e.g., 'number-verification', 'sim-swap', 'location-verification')"
        ),
    },
    async ({ api_name }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              `I need to set up authentication for the CAMARA ${api_name} API.`,
              "",
              "Please:",
              `1. Use camara_get_api_detail with slug="${api_name}" to get API details`,
              `2. Use camara_auth_guide with api_slug="${api_name}" for auth specifics`,
              "3. Explain whether I need 2-legged or 3-legged OAuth",
              "4. Walk me through the exact token request flow",
              "5. Show example HTTP requests for obtaining and using tokens",
              "6. List any scopes or purpose declarations required",
              "",
              "Give me a complete, copy-paste-ready authentication implementation.",
            ].join("\n"),
          },
        },
      ],
    })
  );

  // ── 4. Fraud Detection System ────────────────────────────────────

  server.prompt(
    "camara-fraud-detection",
    "Design a multi-layered fraud detection system using CAMARA APIs",
    {},
    async () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              "Design a comprehensive fraud detection system using CAMARA APIs.",
              "",
              "Please:",
              '1. Search for fraud-related APIs: camara_search_apis with query="fraud" and category="auth-fraud"',
              '2. Get details on the key APIs: SIM Swap, Device Swap, Number Verification, Call Forwarding Signal',
              '3. Use camara_compare_apis to compare ["sim-swap", "device-swap", "number-verification"]',
              "4. Design a layered fraud detection flow that combines multiple signals",
              "5. Provide a risk scoring methodology (low/medium/high/critical)",
              "6. Explain the auth setup for each API in the flow",
              "7. Suggest monitoring and alerting patterns",
              "",
              "Create a production-ready fraud detection architecture document.",
            ].join("\n"),
          },
        },
      ],
    })
  );

  // ── 5. Compare Solutions ─────────────────────────────────────────

  server.prompt(
    "camara-compare-solutions",
    "Compare CAMARA API-based solutions vs traditional alternatives",
    {
      use_case: z
        .string()
        .describe(
          "The use case to evaluate (e.g., 'phone number verification', 'location tracking', 'device detection')"
        ),
    },
    async ({ use_case }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              `Compare CAMARA API solutions vs traditional alternatives for: ${use_case}`,
              "",
              "Please:",
              "1. Use camara_search_apis to find relevant CAMARA APIs",
              "2. Get details with camara_get_api_detail for each candidate",
              "3. Explain how CAMARA solves this vs traditional methods:",
              "   - Network-based vs device-based approaches",
              "   - Operator-grade vs third-party reliability",
              "   - Privacy implications (no SMS, no GPS permissions)",
              "4. Create a comparison table: accuracy, latency, cost, privacy, complexity",
              "5. Provide a clear recommendation with reasoning",
              "",
              "Help me make an informed architecture decision.",
            ].join("\n"),
          },
        },
      ],
    })
  );

  // ── 6. Full Integration Walkthrough ────────────────────────────

  server.prompt(
    "camara-integration-walkthrough",
    "Get a complete end-to-end integration walkthrough for a CAMARA API with code, auth, error handling, and production checklist",
    {
      api_slug: z
        .string()
        .describe(
          "API slug to integrate (e.g., 'sim-swap', 'number-verification', 'location-verification')"
        ),
      language: z
        .string()
        .optional()
        .describe(
          "Programming language for code examples (e.g., 'python', 'typescript', 'java', 'curl')"
        ),
    },
    async ({ api_slug, language }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              `Give me a complete integration walkthrough for the CAMARA ${api_slug} API${language ? ` using ${language}` : ""}.`,
              "",
              "Please follow these steps using the available tools:",
              `1. Use camara_get_api_detail with slug="${api_slug}" to get full API details`,
              `2. Use camara_auth_guide with api_slug="${api_slug}" for authentication specifics`,
              `3. Use camara_generate_client_code with slug="${api_slug}"${language ? `, language="${language}"` : ""} for ready-to-use code`,
              `4. Use camara_integration_checklist with slug="${api_slug}", environment="production" for the go-live checklist`,
              `5. Use camara_migration_guide with slug="${api_slug}" to understand version history`,
              "",
              "Organize the output as a complete integration guide with sections:",
              "- API Overview (what it does, key endpoints)",
              "- Authentication Setup (step-by-step token flow)",
              "- Code Implementation (copy-paste-ready client code)",
              "- Error Handling (all error codes and retry strategy)",
              "- Testing Strategy (sandbox → production)",
              "- Production Checklist (monitoring, compliance, go-live)",
              "",
              "Make it a self-contained document I can share with my engineering team.",
            ]
              .filter(Boolean)
              .join("\n"),
          },
        },
      ],
    })
  );
}
