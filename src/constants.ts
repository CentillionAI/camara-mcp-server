/**
 * CAMARA MCP Server Constants
 * Complete catalog of CAMARA APIs, repositories, and developer resources
 * Source: https://github.com/camaraproject | https://camaraproject.org
 */

export const CHARACTER_LIMIT = 50_000;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export const CAMARA_BASE_URL = "https://github.com/camaraproject";
export const CAMARA_RAW_URL = "https://raw.githubusercontent.com/camaraproject";
export const CAMARA_WEBSITE = "https://camaraproject.org";
export const GSMA_OPEN_GATEWAY = "https://www.gsma.com/solutions-and-impact/gsma-open-gateway";

// ─── Meta-Release Info ───────────────────────────────────────────────
export interface MetaRelease {
  name: string;
  date: string;
  stableApis: number;
  updatedInitialApis: number;
  newInitialApis: number;
  totalApis: number;
  highlights: string[];
}

export const CURRENT_META_RELEASE: MetaRelease = {
  name: "Fall25",
  date: "2025-09-30",
  stableApis: 10,
  updatedInitialApis: 27,
  newInitialApis: 23,
  totalApis: 60,
  highlights: [
    "10 stable production-ready APIs",
    "Conformance program for operator deployment",
    "Hardened security profiles",
    "New: Verified Caller, Device Swap, Simple Edge Discovery reach stable",
    "1300+ contributors across 476 organizations"
  ]
};

export const PREVIOUS_META_RELEASE: MetaRelease = {
  name: "Spring25",
  date: "2025-03-31",
  stableApis: 8,
  updatedInitialApis: 23,
  newInitialApis: 13,
  totalApis: 36,
  highlights: [
    "8 stable APIs",
    "13 new initial APIs including Device Swap and KYC Age Verification",
    "Enhanced notifications, events, and error response functionality"
  ]
};

// ─── API Status Enum ─────────────────────────────────────────────────
export type ApiStatus = "stable" | "initial" | "sandbox" | "incubating";
export type ApiCategory =
  | "auth-fraud"
  | "location"
  | "communication"
  | "communication-quality"
  | "device-info"
  | "computing"
  | "payments"
  | "identity";

// ─── CAMARA API Definition ──────────────────────────────────────────
export interface CamaraApi {
  name: string;
  slug: string;
  category: ApiCategory;
  status: ApiStatus;
  description: string;
  useCases: string[];
  latestVersion: string;
  previousVersions: string[];
  repository: string;
  websiteUrl: string;
  specUrl: string;
  industries: string[];
  authFlow: string;
  httpMethods: string[];
  keyEndpoints: string[];
}

// ─── 10 Stable CAMARA APIs (Fall25) ─────────────────────────────────
export const STABLE_APIS: CamaraApi[] = [
  {
    name: "Number Verification",
    slug: "number-verification",
    category: "auth-fraud",
    status: "stable",
    description:
      "Confirms ownership of a mobile phone number by matching it against the network-authenticated identity. Eliminates SMS OTP friction. Two mechanisms: network-based (operator knows subscriber) and SIM-based (subscriber SIM authentication).",
    useCases: [
      "Account creation with phone number verification",
      "Secure login without SMS OTP",
      "Transaction validation for banking/fintech",
      "Account recovery and device migration",
      "Anti-fraud: prevent SIM swap account takeover"
    ],
    latestVersion: "2.1.0",
    previousVersions: ["2.0.0", "1.0.0"],
    repository: "NumberVerification",
    websiteUrl: "https://camaraproject.org/number-verification/",
    specUrl: `${CAMARA_BASE_URL}/NumberVerification`,
    industries: ["Banking", "E-Commerce", "Healthcare", "Insurance", "Fintech"],
    authFlow: "OIDC Authorization Code Flow (3-legged)",
    httpMethods: ["POST"],
    keyEndpoints: [
      "POST /number-verifications/v2/verify - Verify phone number ownership",
      "POST /number-verifications/v2/device-phone-number - Retrieve device phone number"
    ]
  },
  {
    name: "SIM Swap",
    slug: "sim-swap",
    category: "auth-fraud",
    status: "stable",
    description:
      "Detects whether a SIM card swap has occurred on a mobile line within a specified time window. Returns boolean or timestamp of last swap. Critical for fraud prevention in financial services.",
    useCases: [
      "Fraud detection during high-value transactions",
      "Account takeover prevention",
      "KYC enhancement for onboarding",
      "Insurance claim validation",
      "Risk scoring for lending decisions"
    ],
    latestVersion: "2.1.0",
    previousVersions: ["2.0.0", "1.0.0"],
    repository: "SimSwap",
    websiteUrl: "https://camaraproject.org/sim-swap/",
    specUrl: `${CAMARA_BASE_URL}/SimSwap`,
    industries: ["Banking", "Fintech", "Insurance", "Payments"],
    authFlow: "OIDC Client Credentials (2-legged) or Authorization Code (3-legged)",
    httpMethods: ["POST"],
    keyEndpoints: [
      "POST /sim-swap/v2/check - Check if SIM swap occurred in time window",
      "POST /sim-swap/v2/retrieve-date - Get date of last SIM swap"
    ]
  },
  {
    name: "Location Verification",
    slug: "location-verification",
    category: "location",
    status: "stable",
    description:
      "Determines whether a mobile device is within the proximity of a specified geographical area (circle with lat/lng center and radius). Network-based location verification without requiring device-side GPS permissions.",
    useCases: [
      "Fraud prevention for location-dependent banking transactions",
      "Insurance claim geolocation validation",
      "Age-gated content delivery verification",
      "Logistics and delivery confirmation",
      "Regulatory compliance (geo-restriction enforcement)"
    ],
    latestVersion: "3.0.0",
    previousVersions: ["2.0.0", "1.0.0"],
    repository: "DeviceLocation",
    websiteUrl: "https://camaraproject.org/location-verification/",
    specUrl: `${CAMARA_BASE_URL}/DeviceLocation`,
    industries: ["Banking", "Insurance", "Logistics", "Retail", "Government"],
    authFlow: "OIDC Authorization Code Flow (3-legged)",
    httpMethods: ["POST"],
    keyEndpoints: [
      "POST /location-verification/v3/verify - Verify device is within area"
    ]
  },
  {
    name: "Device Reachability Status",
    slug: "device-reachability-status",
    category: "device-info",
    status: "stable",
    description:
      "Checks whether a mobile device is currently reachable on the network (connected, not connected, or SMS-only). Supports event subscriptions for status change notifications.",
    useCases: [
      "IoT device monitoring and health checks",
      "Optimizing push notification delivery",
      "Customer engagement timing",
      "Service level agreement monitoring",
      "Emergency communications readiness"
    ],
    latestVersion: "1.1.0",
    previousVersions: ["1.0.0", "0.6.1"],
    repository: "DeviceReachabilityStatus",
    websiteUrl: "https://camaraproject.org/device-reachability-status/",
    specUrl: `${CAMARA_BASE_URL}/DeviceReachabilityStatus`,
    industries: ["IoT", "Telecom", "Logistics", "Healthcare"],
    authFlow: "OIDC Client Credentials (2-legged)",
    httpMethods: ["POST"],
    keyEndpoints: [
      "POST /device-reachability-status/v1/retrieve - Get current reachability status"
    ]
  },
  {
    name: "Device Roaming Status",
    slug: "device-roaming-status",
    category: "device-info",
    status: "stable",
    description:
      "Determines whether a mobile device is currently roaming and, if so, in which country. Supports event subscriptions for roaming status changes.",
    useCases: [
      "Personalized pricing based on roaming status",
      "Compliance with data sovereignty requirements",
      "Travel insurance activation",
      "Fraud detection (unexpected roaming)",
      "Content and service adaptation by region"
    ],
    latestVersion: "1.1.0",
    previousVersions: ["1.0.0", "0.6.1"],
    repository: "DeviceRoamingStatus",
    websiteUrl: "https://camaraproject.org/device-roaming-status/",
    specUrl: `${CAMARA_BASE_URL}/DeviceRoamingStatus`,
    industries: ["Travel", "Insurance", "Banking", "Telecom"],
    authFlow: "OIDC Client Credentials (2-legged)",
    httpMethods: ["POST"],
    keyEndpoints: [
      "POST /device-roaming-status/v1/retrieve - Get current roaming status"
    ]
  },
  {
    name: "One-Time Password SMS",
    slug: "one-time-password-sms",
    category: "auth-fraud",
    status: "stable",
    description:
      "Sends short-lived OTPs to a phone number via SMS and validates them. Network-based delivery without relying on third-party SMS aggregators. Operator-grade delivery assurance.",
    useCases: [
      "Two-factor authentication",
      "Account recovery verification",
      "Transaction confirmation",
      "Secure sign-up flows",
      "Passwordless authentication"
    ],
    latestVersion: "1.1.1",
    previousVersions: ["1.1.0", "1.0.0"],
    repository: "OTPValidation",
    websiteUrl: "https://camaraproject.org/one-time-password-sms/",
    specUrl: `${CAMARA_BASE_URL}/OTPValidation`,
    industries: ["Banking", "E-Commerce", "Healthcare", "SaaS"],
    authFlow: "OIDC Client Credentials (2-legged)",
    httpMethods: ["POST"],
    keyEndpoints: [
      "POST /otp/v1/send-code - Send OTP to phone number",
      "POST /otp/v1/validate-code - Validate received OTP"
    ]
  },
  {
    name: "Quality on Demand",
    slug: "quality-on-demand",
    category: "communication-quality",
    status: "stable",
    description:
      "Request and manage specific network quality (bandwidth, latency) for a device session. Enables premium network performance for latency-sensitive applications like gaming, video, and AR/VR.",
    useCases: [
      "Cloud gaming session quality guarantee",
      "Video conferencing quality boost",
      "AR/VR experience optimization",
      "Live streaming priority bandwidth",
      "Industrial IoT critical communications"
    ],
    latestVersion: "1.1.0",
    previousVersions: ["1.0.0", "0.11.1"],
    repository: "QualityOnDemand",
    websiteUrl: "https://camaraproject.org/quality-on-demand/",
    specUrl: `${CAMARA_BASE_URL}/QualityOnDemand`,
    industries: ["Gaming", "Media", "AR/VR", "Enterprise", "IoT"],
    authFlow: "OIDC Client Credentials (2-legged) or Authorization Code (3-legged)",
    httpMethods: ["POST", "GET", "DELETE"],
    keyEndpoints: [
      "POST /qod/v1/sessions - Create QoS session",
      "GET /qod/v1/sessions/{sessionId} - Get session status",
      "DELETE /qod/v1/sessions/{sessionId} - Terminate session"
    ]
  },
  {
    name: "QoS Profiles",
    slug: "qos-profiles",
    category: "communication-quality",
    status: "stable",
    description:
      "Discover available Quality of Service profiles offered by a network operator. Profiles define bandwidth, latency, and jitter parameters that can be requested via the Quality on Demand API.",
    useCases: [
      "Service catalog discovery",
      "Dynamic QoS profile selection",
      "Network capability assessment",
      "SLA-based service provisioning"
    ],
    latestVersion: "1.1.0",
    previousVersions: ["1.0.0", "0.11.1"],
    repository: "QualityOnDemand",
    websiteUrl: "https://camaraproject.org/qos-profiles/",
    specUrl: `${CAMARA_BASE_URL}/QualityOnDemand`,
    industries: ["Gaming", "Media", "Enterprise", "IoT"],
    authFlow: "OIDC Client Credentials (2-legged)",
    httpMethods: ["GET"],
    keyEndpoints: [
      "GET /qos-profiles/v1 - List available QoS profiles",
      "GET /qos-profiles/v1/{profileId} - Get profile details"
    ]
  },
  {
    name: "Simple Edge Discovery",
    slug: "simple-edge-discovery",
    category: "computing",
    status: "stable",
    description:
      "Discover optimal Multi-access Edge Computing (MEC) endpoints closest to a user's device. Enables low-latency edge deployment for applications requiring proximity computing.",
    useCases: [
      "Edge application deployment optimization",
      "Latency-sensitive workload placement",
      "CDN edge node selection",
      "Mobile gaming server selection",
      "AR/VR edge rendering"
    ],
    latestVersion: "2.0.0",
    previousVersions: ["1.0.0"],
    repository: "SimpleEdgeDiscovery",
    websiteUrl: "https://camaraproject.org/simple-edge-discovery/",
    specUrl: `${CAMARA_BASE_URL}/SimpleEdgeDiscovery`,
    industries: ["Gaming", "AR/VR", "CDN", "Cloud", "IoT"],
    authFlow: "OIDC Client Credentials (2-legged)",
    httpMethods: ["GET"],
    keyEndpoints: [
      "GET /edge-discovery/v2/mec-platforms - Discover nearest MEC platforms"
    ]
  },
  {
    name: "Device Swap",
    slug: "device-swap",
    category: "device-info",
    status: "stable",
    description:
      "Detects whether the physical device (IMEI) associated with a mobile subscription has changed. Similar to SIM Swap but tracks the hardware device rather than the SIM card.",
    useCases: [
      "Fraud detection (unexpected device changes)",
      "Device financing risk management",
      "Insurance claim validation",
      "Account security monitoring",
      "Customer lifecycle management"
    ],
    latestVersion: "1.0.0",
    previousVersions: ["0.2.0"],
    repository: "DeviceSwap",
    websiteUrl: "https://camaraproject.org/device-swap/",
    specUrl: `${CAMARA_BASE_URL}/DeviceSwap`,
    industries: ["Banking", "Insurance", "Device Finance", "Telecom"],
    authFlow: "OIDC Client Credentials (2-legged) or Authorization Code (3-legged)",
    httpMethods: ["POST"],
    keyEndpoints: [
      "POST /device-swap/v1/check - Check if device swap occurred",
      "POST /device-swap/v1/retrieve-date - Get date of last device swap"
    ]
  }
];

// ─── Initial/Incubating APIs ────────────────────────────────────────
export interface InitialApi {
  name: string;
  slug: string;
  category: ApiCategory;
  version: string;
  repository: string;
  description: string;
}

export const INITIAL_APIS: InitialApi[] = [
  { name: "Application Profiles", slug: "application-profiles", category: "communication-quality", version: "0.5.0", repository: "ApplicationProfiles", description: "Define and manage application requirements for network service optimization." },
  { name: "Call Forwarding Signal", slug: "call-forwarding-signal", category: "auth-fraud", version: "0.4.0", repository: "CallForwardingSignal", description: "Detect if a phone number has call forwarding enabled — fraud prevention signal." },
  { name: "Carrier Billing", slug: "carrier-billing", category: "payments", version: "0.5.0", repository: "CarrierBillingCheckOut", description: "Charge digital content purchases to the mobile subscriber's bill." },
  { name: "Connectivity Insights", slug: "connectivity-insights", category: "communication-quality", version: "0.5.0", repository: "ConnectivityInsights", description: "Network quality predictions and monitoring for application sessions." },
  { name: "Customer Insights", slug: "customer-insights", category: "identity", version: "0.2.0", repository: "CustomerInsights", description: "Anonymized aggregate insights about customer segments." },
  { name: "Device Identifier", slug: "device-identifier", category: "device-info", version: "0.3.0", repository: "DeviceIdentifier", description: "Retrieve device model information (TAC/IMEI) for the authenticated subscriber." },
  { name: "Geofencing Subscriptions", slug: "geofencing-subscriptions", category: "location", version: "0.4.0", repository: "DeviceLocation", description: "Subscribe to notifications when a device enters or exits a defined geographical area." },
  { name: "KYC Age Verification", slug: "kyc-age-verification", category: "identity", version: "0.2.0", repository: "KnowYourCustomerAgeVerification", description: "Verify if a subscriber meets a minimum age threshold without revealing actual age." },
  { name: "KYC Fill-In", slug: "kyc-fill-in", category: "identity", version: "0.4.0", repository: "KnowYourCustomerFill-in", description: "Auto-fill customer identity data from operator records for onboarding." },
  { name: "KYC Match", slug: "kyc-match", category: "identity", version: "0.5.0", repository: "KnowYourCustomer", description: "Verify customer-provided identity attributes against operator records." },
  { name: "KYC Tenure", slug: "kyc-tenure", category: "identity", version: "0.2.0", repository: "Tenure", description: "Verify the length of tenure for a subscriber with their current operator." },
  { name: "Location Retrieval", slug: "location-retrieval", category: "location", version: "0.5.0", repository: "DeviceLocation", description: "Retrieve the approximate location of a mobile device from the network." },
  { name: "Number Recycling", slug: "number-recycling", category: "auth-fraud", version: "0.2.0", repository: "NumberRecycling", description: "Detect if a phone number has been reassigned to a new subscriber." },
  { name: "Population Density Data", slug: "population-density-data", category: "location", version: "0.4.0", repository: "PopulationDensityData", description: "Anonymized population density estimates based on network data." },
  { name: "Region Device Count", slug: "region-device-count", category: "location", version: "0.2.0", repository: "RegionDeviceCount", description: "Count of devices in a defined geographical region." },
  { name: "Scam Signal", slug: "scam-signal", category: "auth-fraud", version: "0.3.1", repository: "ScamSignal", description: "Real-time scam call detection signals for fraud prevention." },
  { name: "Verified Caller", slug: "verified-caller", category: "auth-fraud", version: "0.2.0", repository: "VerifiedCaller", description: "Prove caller authenticity to eliminate phone scams and spoofing." },
  { name: "WebRTC", slug: "webrtc", category: "communication", version: "0.1.0", repository: "WebRTC", description: "Browser-based real-time communication with network quality integration." },
  { name: "SMS", slug: "sms", category: "communication", version: "0.1.0", repository: "ShortMessageService", description: "Send and receive SMS messages through standardized API." },
  { name: "Connected Network Type", slug: "connected-network-type", category: "device-info", version: "0.1.0", repository: "DeviceStatus", description: "Identify the network technology (4G/5G/WiFi) a device is connected to." },
  { name: "Blockchain Public Address", slug: "blockchain-public-address", category: "identity", version: "0.1.0", repository: "BlockchainPublicAddress", description: "Associate blockchain wallet addresses with mobile identities." }
];

// ─── API Category Metadata ──────────────────────────────────────────
export const API_CATEGORIES: Record<ApiCategory, { label: string; description: string; icon: string }> = {
  "auth-fraud": {
    label: "Authentication & Fraud Prevention",
    description: "APIs for identity verification, fraud detection, and secure authentication without traditional methods like SMS OTP.",
    icon: "🔐"
  },
  "location": {
    label: "Location Services",
    description: "Network-based location verification, retrieval, and geofencing without device-side GPS dependencies.",
    icon: "📍"
  },
  "communication": {
    label: "Communication Services",
    description: "Messaging, voice, and real-time communication APIs leveraging operator infrastructure.",
    icon: "📞"
  },
  "communication-quality": {
    label: "Communication Quality",
    description: "Quality of Service management, QoS profiles, and connectivity insights for application optimization.",
    icon: "📶"
  },
  "device-info": {
    label: "Device Information",
    description: "Device status, reachability, roaming, and hardware change detection APIs.",
    icon: "📱"
  },
  "computing": {
    label: "Computing Services",
    description: "Edge computing discovery and optimization for low-latency applications.",
    icon: "☁️"
  },
  "payments": {
    label: "Payments & Charging",
    description: "Carrier billing and direct-to-bill payment APIs.",
    icon: "💳"
  },
  "identity": {
    label: "Identity & KYC",
    description: "Know Your Customer, age verification, tenure validation, and identity enrichment APIs.",
    icon: "🪪"
  }
};

// ─── Working Groups ─────────────────────────────────────────────────
export interface WorkingGroup {
  name: string;
  repository: string;
  description: string;
  meetingSchedule: string;
  mailingList: string;
}

export const WORKING_GROUPS: WorkingGroup[] = [
  {
    name: "Commonalities",
    repository: "Commonalities",
    description: "Defines common guidelines and assets for all CAMARA APIs — API design, error handling, event subscriptions, notifications, and testing.",
    meetingSchedule: "Bi-weekly, Monday, 15:00 UTC",
    mailingList: "wg-commonalities@lists.camaraproject.org"
  },
  {
    name: "Identity and Consent Management (ICM)",
    repository: "IdentityAndConsentManagement",
    description: "Defines authentication, authorization, and consent management patterns for CAMARA APIs using OIDC/OAuth2.",
    meetingSchedule: "Bi-weekly, Tuesday",
    mailingList: "wg-icm@lists.camaraproject.org"
  },
  {
    name: "Release Management",
    repository: "ReleaseManagement",
    description: "Coordinates CAMARA meta-releases (Spring/Fall), defines release criteria, and manages the release lifecycle.",
    meetingSchedule: "Bi-weekly, Wednesday",
    mailingList: "wg-rm@lists.camaraproject.org"
  }
];

// ─── GSMA Open Gateway Integration ─────────────────────────────────
export const GSMA_INFO = {
  description: "GSMA Open Gateway is the commercial channel through which telecom operators expose CAMARA APIs to developers and enterprises. Operators implement CAMARA API specifications and make them available through aggregator platforms.",
  launchStatusUrl: "https://www.gsma.com/solutions-and-impact/gsma-open-gateway/gsma-open-gateway-api-descriptions/",
  supportedOperators: "70+ operators across 40+ countries",
  aggregators: ["Vonage (Ericsson)", "Infobip", "Twilio", "Google Cloud", "AWS", "Azure", "Telefonica Open Gateway"],
  relationship: "CAMARA defines the open API standards. GSMA Open Gateway is the commercial go-to-market channel. Operators implement CAMARA specs and expose them via Open Gateway."
};
