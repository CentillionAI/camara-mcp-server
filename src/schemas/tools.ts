/**
 * Zod Schemas for CAMARA MCP Server Tools
 */

import { z } from "zod";

export const SearchApisSchema = z.object({
  query: z.string()
    .max(200, "Query must not exceed 200 characters")
    .optional()
    .describe("Search term to match against API names, descriptions, use cases, and industries. Examples: 'fraud', 'location', 'banking', 'sim swap'"),
  category: z.enum([
    "auth-fraud", "location", "communication", "communication-quality",
    "device-info", "computing", "payments", "identity"
  ]).optional()
    .describe("Filter by API category"),
  status: z.enum(["stable", "initial"])
    .optional()
    .describe("Filter by API maturity status. 'stable' = production-ready, 'initial' = in development"),
  limit: z.number().int().min(1).max(100).default(20)
    .describe("Maximum results to return (default: 20)"),
  offset: z.number().int().min(0).default(0)
    .describe("Pagination offset (default: 0)"),
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format: 'markdown' for human-readable, 'json' for structured data")
}).strict();

export const GetApiDetailSchema = z.object({
  slug: z.string()
    .min(1, "API slug is required")
    .describe("The API slug identifier. Examples: 'number-verification', 'sim-swap', 'location-verification', 'quality-on-demand', 'device-reachability-status', 'device-roaming-status', 'one-time-password-sms', 'qos-profiles', 'simple-edge-discovery', 'device-swap'"),
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format")
}).strict();

export const ListCategoriesSchema = z.object({
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format")
}).strict();

export const GetReleaseInfoSchema = z.object({
  release: z.enum(["latest", "history"]).default("latest")
    .describe("'latest' for current meta-release, 'history' for all releases"),
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format")
}).strict();

export const GetWorkingGroupsSchema = z.object({
  response_format: z.enum(["markdown", "json"]).default("json")
    .describe("Output format")
}).strict();

export const GetStartedSchema = z.object({
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format")
}).strict();

export const GetGsmaInfoSchema = z.object({
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format")
}).strict();

export const CompareApisSchema = z.object({
  slugs: z.array(z.string()).min(2).max(5)
    .describe("Array of 2-5 API slugs to compare. Example: ['sim-swap', 'device-swap']"),
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format")
}).strict();

export const GetAuthGuideSchema = z.object({
  api_slug: z.string().optional()
    .describe("Optional: specific API slug to get auth details for"),
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format")
}).strict();

export const GetUseCasesSchema = z.object({
  industry: z.string().optional()
    .describe("Filter use cases by industry. Examples: 'banking', 'healthcare', 'gaming', 'iot'"),
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format")
}).strict();

export const GenerateClientCodeSchema = z.object({
  slug: z.string()
    .min(1, "API slug is required")
    .describe("The stable API slug. Examples: 'sim-swap', 'number-verification', 'location-verification'"),
  language: z.enum(["curl", "python", "typescript", "java"])
    .default("curl")
    .describe("Target language for code generation"),
  auth_flow: z.enum(["client_credentials", "authorization_code"])
    .optional()
    .describe("Override auth flow. If omitted, uses the API's default flow"),
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format")
}).strict();

export const MigrationGuideSchema = z.object({
  slug: z.string()
    .min(1, "API slug is required")
    .describe("The stable API slug to get migration info for"),
  from_version: z.string()
    .optional()
    .describe("Source version to migrate from (e.g., '1.0.0'). Defaults to the previous version"),
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format")
}).strict();

export const IntegrationChecklistSchema = z.object({
  slug: z.string()
    .min(1, "API slug is required")
    .describe("The stable API slug to generate a checklist for"),
  environment: z.enum(["sandbox", "production"])
    .default("production")
    .describe("Target environment"),
  response_format: z.enum(["markdown", "json"]).default("markdown")
    .describe("Output format")
}).strict();

// Schema type exports
export type SearchApisInput = z.infer<typeof SearchApisSchema>;
export type GetApiDetailInput = z.infer<typeof GetApiDetailSchema>;
export type ListCategoriesInput = z.infer<typeof ListCategoriesSchema>;
export type GetReleaseInfoInput = z.infer<typeof GetReleaseInfoSchema>;
export type GetWorkingGroupsInput = z.infer<typeof GetWorkingGroupsSchema>;
export type GetStartedInput = z.infer<typeof GetStartedSchema>;
export type GetGsmaInfoInput = z.infer<typeof GetGsmaInfoSchema>;
export type CompareApisInput = z.infer<typeof CompareApisSchema>;
export type GetAuthGuideInput = z.infer<typeof GetAuthGuideSchema>;
export type GetUseCasesInput = z.infer<typeof GetUseCasesSchema>;
export type GenerateClientCodeInput = z.infer<typeof GenerateClientCodeSchema>;
export type MigrationGuideInput = z.infer<typeof MigrationGuideSchema>;
export type IntegrationChecklistInput = z.infer<typeof IntegrationChecklistSchema>;
