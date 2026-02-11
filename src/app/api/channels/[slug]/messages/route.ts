import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAIResponse, ChatMessage } from "@/lib/anthropic";
import { routeMessage } from "@/lib/agents";
import { getSession } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ messages: [] });
    }

    // Get user's tower and channel
    const tower = await prisma.tower.findUnique({
      where: { userId: session.userId },
      include: { channels: true },
    });

    if (!tower) {
      return NextResponse.json({ messages: [] });
    }

    const channel = tower.channels.find((c) => c.slug === slug);
    if (!channel) {
      return NextResponse.json({ messages: [] });
    }

    // Get messages for this channel
    const messages = await prisma.message.findMany({
      where: { channelId: channel.id },
      orderBy: { createdAt: 'asc' },
      take: 50, // Last 50 messages
    });

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
    
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content required" }, { status: 400 });
    }

    // Get user's tower with Claude token
    const tower = await prisma.tower.findUnique({
      where: { userId: session.userId },
      include: { channels: true },
    });

    if (!tower) {
      return NextResponse.json({ error: "Tower not found" }, { status: 404 });
    }

    // Check for Claude token
    if (!tower.claudeToken) {
      return NextResponse.json({ 
        error: "Claude token not configured",
        needsToken: true,
        message: "Please add your Claude token in Settings to enable AI responses."
      }, { status: 400 });
    }

    // Find the channel
    const channel = tower.channels.find((c) => c.slug === slug);
    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    // Store user message
    const userMessage = await prisma.message.create({
      data: {
        channelId: channel.id,
        role: "user",
        content: content.trim(),
      },
    });

    // Route the message to the appropriate persona
    const { persona } = routeMessage(content, slug);

    // Get recent history for context
    const recentMessages = await prisma.message.findMany({
      where: { channelId: channel.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const chatHistory: ChatMessage[] = recentMessages
      .reverse()
      .slice(0, -1) // Exclude the message we just added
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    // Add current message to history
    chatHistory.push({ role: "user", content: content.trim() });

    // Get AI response using user's Claude token
    const aiResult = await getAIResponse(
      tower.claudeToken,
      persona,
      chatHistory,
      tower.companyContext || undefined
    );

    // Store AI response
    const assistantMessage = await prisma.message.create({
      data: {
        channelId: channel.id,
        role: "assistant",
        persona: persona.id,
        content: aiResult.content,
      },
    });

    return NextResponse.json({
      userMessage: formatMessage(userMessage),
      assistantMessage: formatMessage(assistantMessage),
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

function formatMessage(m: { id: string; role: string; content: string; persona: string | null; createdAt: Date }) {
  return {
    id: m.id,
    role: m.role,
    content: m.content,
    persona: m.persona,
    createdAt: m.createdAt.toISOString(),
  };
}
