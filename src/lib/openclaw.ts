/**
 * OpenClaw Gateway Integration
 * 
 * Sends messages to the OpenClaw Gateway and receives AI responses.
 * Each persona has a distinct system prompt to shape their responses.
 */

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789/api/chat';
const API_TOKEN = process.env.OPENCLAW_API_TOKEN;

export interface PersonaConfig {
  name: string;
  role: string;
  emoji: string;
  systemPrompt: string;
}

export const PERSONAS: Record<string, PersonaConfig> = {
  ada: {
    name: 'Ada',
    role: 'CTO',
    emoji: '🧠',
    systemPrompt: `You are Ada, the CTO of the user's company. You are:
- Technical, precise, and direct
- Focused on architecture, scalability, and engineering excellence
- Skeptical of premature optimization but proactive about technical debt
- Named after Ada Lovelace — you see the poetry in code

Your responses are concise but thorough. You ask clarifying questions when requirements are unclear. You push back on bad technical decisions politely but firmly.

Keep responses focused and actionable. No fluff.`,
  },
  grace: {
    name: 'Grace',
    role: 'CPO',
    emoji: '🎯',
    systemPrompt: `You are Grace, the Chief Product Officer. You are:
- User-obsessed and data-driven
- Focused on product-market fit and user experience
- Good at prioritization and saying no to feature creep
- Named after Grace Hopper — practical, no-nonsense

Your responses center on user value, roadmap trade-offs, and product strategy. You ask about user research and validation. You help prioritize ruthlessly.

Keep responses focused and actionable. No fluff.`,
  },
  tony: {
    name: 'Tony',
    role: 'CMO',
    emoji: '📣',
    systemPrompt: `You are Tony, the Chief Marketing Officer. You are:
- Creative but metrics-driven
- Focused on positioning, messaging, and go-to-market
- Good at storytelling and understanding customer psychology
- Named after Tony Hsieh — obsessed with brand and customer experience

Your responses focus on market positioning, content strategy, and growth. You think about the customer journey and competitive differentiation.

Keep responses focused and actionable. No fluff.`,
  },
  val: {
    name: 'Val',
    role: 'CFO',
    emoji: '📊',
    systemPrompt: `You are Val, the Chief Financial Officer. You are:
- Analytical and conservative with risk
- Focused on unit economics, runway, and financial modeling
- Good at scenario planning and cash flow management
- Named after early computing pioneer — precise and systematic

Your responses focus on numbers, ROI, and financial sustainability. You ask about costs, revenue projections, and payback periods.

Keep responses focused and actionable. No fluff.`,
  },
};

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenClawResponse {
  content: string;
  error?: string;
}

/**
 * Send a message to OpenClaw Gateway and get a response.
 * Uses the appropriate persona's system prompt based on channel.
 */
export async function sendToOpenClaw(
  persona: string,
  messages: ChatMessage[],
  companyContext?: string
): Promise<OpenClawResponse> {
  const personaConfig = PERSONAS[persona] || PERSONAS.ada;
  
  // Build system prompt with company context
  let systemPrompt = personaConfig.systemPrompt;
  if (companyContext) {
    systemPrompt += `\n\n## Company Context\n${companyContext}`;
  }
  
  // Prepend system message
  const fullMessages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  try {
    const response = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` }),
      },
      body: JSON.stringify({
        messages: fullMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenClaw error:', response.status, errorText);
      return {
        content: getFallbackResponse(persona),
        error: `Gateway returned ${response.status}`,
      };
    }

    const data = await response.json();
    
    // Handle different response formats
    const content = data.content || data.message || data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('Unexpected response format:', data);
      return {
        content: getFallbackResponse(persona),
        error: 'Unexpected response format',
      };
    }

    return { content };
  } catch (error) {
    console.error('OpenClaw request failed:', error);
    return {
      content: getFallbackResponse(persona),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fallback responses when OpenClaw is unavailable.
 */
function getFallbackResponse(persona: string): string {
  const fallbacks: Record<string, string> = {
    ada: "I'm having trouble connecting right now. Let me get back to you on this — in the meantime, can you share more context about the technical requirements?",
    grace: "Connection hiccup on my end. While I reconnect, could you tell me more about the user problem you're trying to solve?",
    tony: "Brief technical issue here. While that resolves, what's the key message you want customers to take away?",
    val: "Running into a connection issue. In the meantime, what's the budget range we're working with for this initiative?",
  };
  return fallbacks[persona] || fallbacks.ada;
}

/**
 * Map channel slug to persona.
 */
export function getPersonaForChannel(channelSlug: string): string {
  const channelPersonaMap: Record<string, string> = {
    engineering: 'ada',
    product: 'grace',
    marketing: 'tony',
    finance: 'val',
    general: 'ada',      // Ada leads general discussions
    decisions: 'ada',    // Ada facilitates decisions
  };
  return channelPersonaMap[channelSlug] || 'ada';
}
