import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { sendToOpenClaw, getPersonaForChannel, ChatMessage } from "@/lib/openclaw";

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
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content required" }, { status: 400 });
    }

    // Store user message
    const userMessage = await db.messages.create({
      channelSlug: slug,
      role: "user",
      content: content.trim(),
    });

    // Determine persona based on channel
    const persona = getPersonaForChannel(slug);

    // Get recent message history for context
    const recentMessages = await db.messages.findMany(slug);
    const chatHistory: ChatMessage[] = recentMessages.slice(-10).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Add current message to history
    chatHistory.push({ role: "user", content: content.trim() });

    // Get AI response from OpenClaw Gateway
    // TODO: Pass company context from Tower settings
    const aiResult = await sendToOpenClaw(persona, chatHistory);

    // Store AI response
    const assistantMessage = await db.messages.create({
      channelSlug: slug,
      role: "assistant",
      persona,
      content: aiResult.content,
    });

    return NextResponse.json({
      userMessage: {
        id: userMessage.id,
        role: userMessage.role,
        content: userMessage.content,
        createdAt: userMessage.createdAt.toISOString(),
      },
      assistantMessage: {
        id: assistantMessage.id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        persona: assistantMessage.persona,
        createdAt: assistantMessage.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
