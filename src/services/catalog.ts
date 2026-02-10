/**
 * CAMARA Catalog Service
 * Core business logic for searching, filtering, and formatting CAMARA API data
 */

import {
  STABLE_APIS,
  INITIAL_APIS,
  API_CATEGORIES,
  WORKING_GROUPS,
  CURRENT_META_RELEASE,
  PREVIOUS_META_RELEASE,
  GSMA_INFO,
  CAMARA_BASE_URL,
  CAMARA_WEBSITE,
  type CamaraApi,
  type InitialApi,
  type ApiCategory,
  type ApiStatus
} from "../constants.js";
import type {
  ApiSearchResult,
  ApiDetailResult,
  CategoryResult,
  ReleaseResult,
  WorkingGroupResult,
  GettingStartedResult,
  PaginatedResponse
} from "../types.js";

// ─── Search ─────────────────────────────────────────────────────────

function matchesQuery(text: string, query: string): boolean {
  const lower = query.toLowerCase();
  return text.toLowerCase().includes(lower);
}

function searchScore(api: CamaraApi | InitialApi, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (api.name.toLowerCase().includes(q)) score += 10;
  if (api.slug.includes(q)) score += 8;
  if (api.category.includes(q)) score += 5;
  if (api.description.toLowerCase().includes(q)) score += 3;
  if ("useCases" in api) {
    for (const uc of api.useCases) {
      if (uc.toLowerCase().includes(q)) { score += 2; break; }
    }
  }
  if ("industries" in api) {
    for (const ind of api.industries) {
      if (ind.toLowerCase().includes(q)) { score += 4; break; }
    }
  }
  return score;
}

export function searchApis(
  query?: string,
  category?: string,
  status?: string,
  limit: number = 20,
  offset: number = 0
): PaginatedResponse<ApiSearchResult> {
  let results: ApiSearchResult[] = [];

  // Combine stable and initial APIs
  const stableResults: Array<{ api: CamaraApi; score: number }> = STABLE_APIS
    .filter(api => {
      if (category && api.category !== category) return false;
      if (status && api.status !== status) return false;
      if (query && searchScore(api, query) === 0) return false;
      return true;
    })
    .map(api => ({ api, score: query ? searchScore(api, query) : 0 }));

  const initialResults: Array<{ api: InitialApi; score: number }> = INITIAL_APIS
    .filter(api => {
      if (category && api.category !== category) return false;
      if (status === "stable") return false;
      if (status && status !== "initial") return false;
      if (query && searchScore(api, query) === 0) return false;
      return true;
    })
    .map(api => ({ api, score: query ? searchScore(api, query) : 0 }));

  // Sort by score (descending), then by name
  const combined = [
    ...stableResults.map(r => ({
      score: r.score,
      result: toSearchResult(r.api)
    })),
    ...initialResults.map(r => ({
      score: r.score,
      result: initialToSearchResult(r.api)
    }))
  ].sort((a, b) => b.score - a.score || a.result.name.localeCompare(b.result.name));

  const total = combined.length;
  const paged = combined.slice(offset, offset + limit);

  return {
    total,
    count: paged.length,
    offset,
    items: paged.map(r => r.result),
    has_more: total > offset + paged.length,
    ...(total > offset + paged.length ? { next_offset: offset + paged.length } : {})
  };
}

function toSearchResult(api: CamaraApi): ApiSearchResult {
  return {
    name: api.name,
    slug: api.slug,
    category: api.category,
    status: api.status,
    version: api.latestVersion,
    description: api.description,
    repository_url: api.specUrl,
    website_url: api.websiteUrl
  };
}

function initialToSearchResult(api: InitialApi): ApiSearchResult {
  return {
    name: api.name,
    slug: api.slug,
    category: api.category,
    status: "initial",
    version: api.version,
    description: api.description,
    repository_url: `${CAMARA_BASE_URL}/${api.repository}`
  };
}

// ─── Detail ─────────────────────────────────────────────────────────

export function getApiDetail(slug: string): ApiDetailResult | null {
  const api = STABLE_APIS.find(a => a.slug === slug);
  if (!api) return null;
  return {
    name: api.name,
    slug: api.slug,
    category: api.category,
    status: api.status,
    description: api.description,
    latest_version: api.latestVersion,
    previous_versions: api.previousVersions,
    repository_url: api.specUrl,
    website_url: api.websiteUrl,
    spec_url: api.specUrl,
    industries: api.industries,
    auth_flow: api.authFlow,
    http_methods: api.httpMethods,
    key_endpoints: api.keyEndpoints,
    use_cases: api.useCases
  };
}

// ─── Categories ─────────────────────────────────────────────────────

export function listCategories(): CategoryResult[] {
  return (Object.entries(API_CATEGORIES) as Array<[ApiCategory, typeof API_CATEGORIES[ApiCategory]]>).map(
    ([id, meta]) => {
      const stableInCat = STABLE_APIS.filter(a => a.category === id);
      const initialInCat = INITIAL_APIS.filter(a => a.category === id);
      return {
        category_id: id,
        label: meta.label,
        description: meta.description,
        icon: meta.icon,
        api_count: stableInCat.length + initialInCat.length,
        apis: [
          ...stableInCat.map(a => ({ name: a.name, slug: a.slug, status: a.status, version: a.latestVersion })),
          ...initialInCat.map(a => ({ name: a.name, slug: a.slug, status: "initial", version: a.version }))
        ]
      };
    }
  );
}

// ─── Releases ───────────────────────────────────────────────────────

export function getLatestRelease(): ReleaseResult {
  const r = CURRENT_META_RELEASE;
  return {
    name: r.name,
    date: r.date,
    stable_apis: r.stableApis,
    updated_initial_apis: r.updatedInitialApis,
    new_initial_apis: r.newInitialApis,
    total_apis: r.totalApis,
    highlights: r.highlights
  };
}

export function getReleaseHistory(): ReleaseResult[] {
  return [CURRENT_META_RELEASE, PREVIOUS_META_RELEASE].map(r => ({
    name: r.name,
    date: r.date,
    stable_apis: r.stableApis,
    updated_initial_apis: r.updatedInitialApis,
    new_initial_apis: r.newInitialApis,
    total_apis: r.totalApis,
    highlights: r.highlights
  }));
}

// ─── Working Groups ─────────────────────────────────────────────────

export function listWorkingGroups(): WorkingGroupResult[] {
  return WORKING_GROUPS.map(wg => ({
    name: wg.name,
    repository_url: `${CAMARA_BASE_URL}/${wg.repository}`,
    description: wg.description,
    meeting_schedule: wg.meetingSchedule,
    mailing_list: wg.mailingList
  }));
}

// ─── Getting Started ────────────────────────────────────────────────

export function getGettingStarted(): GettingStartedResult {
  return {
    overview:
      "CAMARA is an open-source Linux Foundation project that standardizes telco network APIs. " +
      "APIs are defined as OpenAPI 3.0 specifications and implemented by telecom operators worldwide. " +
      "Access is provided through GSMA Open Gateway aggregators or direct operator channels.",
    steps: [
      "1. EXPLORE: Browse the CAMARA API catalog at https://camaraproject.org/api-overview/",
      "2. CHOOSE: Select APIs relevant to your use case (start with Number Verification or SIM Swap for auth/fraud)",
      "3. ACCESS: Register with a GSMA Open Gateway aggregator (Vonage, Infobip, Google Cloud, etc.) or directly with an operator",
      "4. AUTHENTICATE: Implement OIDC/OAuth2 flows — most APIs use 2-legged (Client Credentials) or 3-legged (Authorization Code) flows",
      "5. INTEGRATE: Use the OpenAPI spec from the GitHub repository to generate client code in your language",
      "6. TEST: Use the operator's sandbox environment before going to production",
      "7. CONTRIBUTE: Found a bug? Have a requirement? File issues on GitHub — CAMARA is open source!"
    ],
    resources: {
      github: "https://github.com/camaraproject",
      website: "https://camaraproject.org",
      api_overview: "https://camaraproject.org/api-overview/",
      commonalities: "https://github.com/camaraproject/Commonalities",
      identity_consent: "https://github.com/camaraproject/IdentityAndConsentManagement",
      gsma_launch_status: "https://www.gsma.com/solutions-and-impact/gsma-open-gateway/gsma-open-gateway-api-descriptions/",
      mailing_list_subscribe: "all+subscribe@lists.camaraproject.org",
      swagger_ui: "https://camaraproject.github.io/"
    },
    auth_overview:
      "CAMARA uses OIDC/OAuth2 for authentication. Two patterns: " +
      "(1) Client Credentials (2-legged) — for server-to-server calls where user consent is not required. " +
      "(2) Authorization Code (3-legged) — for APIs that access user data and require explicit consent (e.g., Number Verification, Location). " +
      "The Identity and Consent Management (ICM) working group defines the standard patterns.",
    first_api_suggestion:
      "Start with SIM Swap or Device Reachability Status — they use simple Client Credentials auth " +
      "and return clear boolean/timestamp responses. Perfect for a first integration."
  };
}

// ─── GSMA Info ──────────────────────────────────────────────────────

export function getGsmaInfo(): typeof GSMA_INFO {
  return GSMA_INFO;
}

// ─── Markdown Formatters ────────────────────────────────────────────

export function formatApiSearchMarkdown(results: PaginatedResponse<ApiSearchResult>): string {
  if (results.total === 0) return "No CAMARA APIs found matching your query.";
  const lines: string[] = [];
  lines.push(`## CAMARA API Search Results (${results.total} found)\n`);
  for (const api of results.items) {
    const statusBadge = api.status === "stable" ? "✅ Stable" : "🔄 Initial";
    lines.push(`### ${api.name} (v${api.version}) — ${statusBadge}`);
    lines.push(`**Category:** ${API_CATEGORIES[api.category as ApiCategory]?.label || api.category}`);
    lines.push(`${api.description}`);
    lines.push(`- **Repository:** ${api.repository_url}`);
    if (api.website_url) lines.push(`- **Docs:** ${api.website_url}`);
    lines.push("");
  }
  if (results.has_more) {
    lines.push(`*Showing ${results.count} of ${results.total} results. Use offset=${results.next_offset} for more.*`);
  }
  return lines.join("\n");
}

export function formatApiDetailMarkdown(detail: ApiDetailResult): string {
  const lines: string[] = [];
  lines.push(`## ${detail.name} — v${detail.latest_version} (Stable)\n`);
  lines.push(detail.description);
  lines.push("");
  lines.push(`### Endpoints`);
  for (const ep of detail.key_endpoints) lines.push(`- \`${ep}\``);
  lines.push("");
  lines.push(`### Authentication`);
  lines.push(detail.auth_flow);
  lines.push("");
  lines.push(`### Use Cases`);
  for (const uc of detail.use_cases) lines.push(`- ${uc}`);
  lines.push("");
  lines.push(`### Target Industries`);
  lines.push(detail.industries.join(", "));
  lines.push("");
  lines.push(`### Version History`);
  lines.push(`Current: v${detail.latest_version} | Previous: ${detail.previous_versions.join(", ")}`);
  lines.push("");
  lines.push(`### Links`);
  lines.push(`- Repository: ${detail.repository_url}`);
  lines.push(`- Documentation: ${detail.website_url}`);
  lines.push(`- OpenAPI Spec: ${detail.spec_url}`);
  return lines.join("\n");
}

export function formatCategoriesMarkdown(categories: CategoryResult[]): string {
  const lines: string[] = [];
  lines.push("## CAMARA API Categories\n");
  for (const cat of categories) {
    lines.push(`### ${cat.icon} ${cat.label} (${cat.api_count} APIs)`);
    lines.push(cat.description);
    for (const api of cat.apis) {
      const badge = api.status === "stable" ? "✅" : "🔄";
      lines.push(`  - ${badge} ${api.name} v${api.version}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function formatReleaseMarkdown(release: ReleaseResult): string {
  const lines: string[] = [];
  lines.push(`## CAMARA Meta-Release: ${release.name} (${release.date})\n`);
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Stable APIs | ${release.stable_apis} |`);
  lines.push(`| Updated Initial APIs | ${release.updated_initial_apis} |`);
  lines.push(`| New Initial APIs | ${release.new_initial_apis} |`);
  lines.push(`| **Total APIs** | **${release.total_apis}** |`);
  lines.push("");
  lines.push("### Highlights");
  for (const h of release.highlights) lines.push(`- ${h}`);
  return lines.join("\n");
}
