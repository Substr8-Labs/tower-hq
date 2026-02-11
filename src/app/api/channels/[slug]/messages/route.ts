import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { sendToOpenClaw, ChatMessage } from "@/lib/openclaw";
import { routeMessage, PERSONA_AGENTS, PersonaAgent } from "@/lib/agents";
import { queueTask, getTaskStatus } from "@/lib/agent-spawn";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const messages = await db.messages.findMany(slug);

    return NextResponse.json({
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        persona: m.persona,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { content, userId } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content required" }, { status: 400 });
    }

    // Store user message
    const userMessage = await db.messages.create({
      channelSlug: slug,
      role: "user",
      content: content.trim(),
    });

    // Route the message to the appropriate persona
    const { persona, isAsync } = routeMessage(content, slug);

    // If this is an async request (e.g., @bucky in #engineering),
    // spawn an agent and return immediately
    if (isAsync) {
      const taskId = queueTask({
        persona,
        task: content.trim(),
        channelSlug: slug,
        userId: userId || 'anonymous',
      });

      // Store a placeholder message
      const pendingMessage = await db.messages.create({
        channelSlug: slug,
        role: "assistant",
        persona: persona.id,
        content: `${persona.emoji} *${persona.name} is working on this...*`,
      });

      return NextResponse.json({
        userMessage: formatMessage(userMessage),
        assistantMessage: formatMessage(pendingMessage),
        async: true,
        taskId,
        persona: {
          id: persona.id,
          name: persona.name,
          emoji: persona.emoji,
        },
      });
    }

    // Synchronous response - get recent history for context
    const recentMessages = await db.messages.findMany(slug);
    const chatHistory: ChatMessage[] = recentMessages.slice(-10).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Add current message to history
    chatHistory.push({ role: "user", content: content.trim() });

    // Get AI response using persona's system prompt
    const aiResult = await sendToOpenClawWithPersona(persona, chatHistory);

    // Store AI response
    const assistantMessage = await db.messages.create({
      channelSlug: slug,
      role: "assistant",
      persona: persona.id,
      content: aiResult.content,
    });

    return NextResponse.json({
      userMessage: formatMessage(userMessage),
      assistantMessage: formatMessage(assistantMessage),
      async: false,
      persona: {
        id: persona.id,
        name: persona.name,
        emoji: persona.emoji,
      },
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

/**
 * Send message to OpenClaw with persona-specific system prompt
 */
async function sendToOpenClawWithPersona(
  persona: PersonaAgent,
  messages: ChatMessage[]
): Promise<{ content: string; error?: string }> {
  const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789/api/chat';
  const API_TOKEN = process.env.OPENCLAW_API_TOKEN;

  // Prepend persona system prompt
  const fullMessages: ChatMessage[] = [
    { role: 'system', content: persona.systemPrompt },
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
    const content = data.content || data.message || data.choices?.[0]?.message?.content;

    if (!content) {
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

function getFallbackResponse(persona: PersonaAgent): string {
  return `${persona.emoji} I'm having trouble connecting right now. Let me get back to you on this.`;
}

function formatMessage(m: { id: string; role: string; content: string; persona?: string; createdAt: Date }) {
  return {
    id: m.id,
    role: m.role,
    content: m.content,
    persona: m.persona,
    createdAt: m.createdAt.toISOString(),
  };
}
