// Default channels created for every new tower
export const DEFAULT_CHANNELS = [
  {
    name: "general",
    slug: "general",
    isDecisionsChannel: false,
    sortOrder: 0,
  },
  {
    name: "engineering",
    slug: "engineering",
    isDecisionsChannel: false,
    sortOrder: 1,
  },
  {
    name: "product",
    slug: "product",
    isDecisionsChannel: false,
    sortOrder: 2,
  },
  {
    name: "marketing",
    slug: "marketing",
    isDecisionsChannel: false,
    sortOrder: 3,
  },
  {
    name: "finance",
    slug: "finance",
    isDecisionsChannel: false,
    sortOrder: 4,
  },
  {
    name: "decisions",
    slug: "decisions",
    isDecisionsChannel: true,
    sortOrder: 5,
  },
];

// AI Personas
export const PERSONAS = {
  ada: {
    name: "Ada",
    role: "CTO",
    color: "#22c55e",
    icon: "\uD83E\uDDE0",
    description:
      "Technical architecture, code, infrastructure, engineering decisions.",
    channels: ["engineering"],
  },
  grace: {
    name: "Grace",
    role: "CPO",
    color: "#eab308",
    icon: "\uD83C\uDFAF",
    description: "Product strategy, roadmap, features, user research.",
    channels: ["product"],
  },
  tony: {
    name: "Tony",
    role: "CMO",
    color: "#ec4899",
    icon: "\uD83D\uDCE3",
    description: "Marketing, growth, messaging, go-to-market strategy.",
    channels: ["marketing"],
  },
  val: {
    name: "Val",
    role: "CFO",
    color: "#ef4444",
    icon: "\uD83D\uDCCA",
    description: "Finance, business model, runway, pricing decisions.",
    channels: ["finance"],
  },
} as const;

// Channel-specific empty state messages
export const EMPTY_STATE_MESSAGES: Record<string, string> = {
  general: "\uD83D\uDC4B Welcome! Tell your AI team what you're building.",
  engineering:
    "\uD83E\uDDE0 Ask Ada about architecture, tech stack, or code.",
  product:
    "\uD83C\uDFAF Ask Grace about features, roadmap, or user research.",
  marketing:
    "\uD83D\uDCE3 Ask Tony about positioning, growth, or go-to-market.",
  finance:
    "\uD83D\uDCCA Ask Val about pricing, runway, or business model.",
  decisions:
    "\uD83D\uDCDD Log important decisions here. Your AI team will help you think them through.",
};

// Session configuration
export const SESSION_CONFIG = {
  TOKEN_LENGTH: 64,
  EXPIRY_DAYS: 30,
  COOKIE_NAME: "towerhq_session",
};

// Magic link configuration
export const MAGIC_LINK_CONFIG = {
  TOKEN_LENGTH: 64,
  EXPIRY_MINUTES: 15,
};

// Message pagination
export const MESSAGE_PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
};

// OpenClaw Gateway
export const OPENCLAW_CONFIG = {
  TIMEOUT_MS: 60000, // 60 seconds
  SLOW_RESPONSE_MS: 10000, // 10 seconds before showing "Still thinking..."
  CONTEXT_MESSAGES: 20, // Number of recent messages to include as context
};
