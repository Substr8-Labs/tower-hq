import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getAIResponse, ChatMessage } from "@/lib/openai";
import { routeMessage, PERSONA_AGENTS, PersonaAgent } from "@/lib/agents";

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

    // Get recent history for context
    const recentMessages = await db.messages.findMany(slug);
    const chatHistory: ChatMessage[] = recentMessages.slice(-10).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Add current message to history
    chatHistory.push({ role: "user", content: content.trim() });

    // Get AI response
    const aiResult = await getAIResponse(persona, chatHistory);

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

function formatMessage(m: { id: string; role: string; content: string; persona?: string; createdAt: Date }) {
  return {
    id: m.id,
    role: m.role,
    content: m.content,
    persona: m.persona,
    createdAt: m.createdAt.toISOString(),
  };
}
