/**
 * CAMARA MCP Server Type Definitions
 */

export enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json"
}

export interface PaginatedResponse<T> {
  total: number;
  count: number;
  offset: number;
  items: T[];
  has_more: boolean;
  next_offset?: number;
}

export interface ToolResult {
  [key: string]: unknown;
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
}

export interface ApiSearchResult {
  name: string;
  slug: string;
  category: string;
  status: string;
  version: string;
  description: string;
  repository_url: string;
  website_url?: string;
}

export interface ApiDetailResult {
  name: string;
  slug: string;
  category: string;
  status: string;
  description: string;
  latest_version: string;
  previous_versions: string[];
  repository_url: string;
  website_url: string;
  spec_url: string;
  industries: string[];
  auth_flow: string;
  http_methods: string[];
  key_endpoints: string[];
  use_cases: string[];
}

export interface CategoryResult {
  category_id: string;
  label: string;
  description: string;
  icon: string;
  api_count: number;
  apis: Array<{ name: string; slug: string; status: string; version: string }>;
}

export interface ReleaseResult {
  name: string;
  date: string;
  stable_apis: number;
  updated_initial_apis: number;
  new_initial_apis: number;
  total_apis: number;
  highlights: string[];
}

export interface WorkingGroupResult {
  name: string;
  repository_url: string;
  description: string;
  meeting_schedule: string;
  mailing_list: string;
}

export interface GettingStartedResult {
  overview: string;
  steps: string[];
  resources: Record<string, string>;
  auth_overview: string;
  first_api_suggestion: string;
}
