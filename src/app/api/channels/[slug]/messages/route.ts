import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

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
    const personaMap: Record<string, string> = {
      engineering: "ada",
      product: "grace",
      marketing: "tony",
      finance: "val",
    };
    const persona = personaMap[slug] || "ada";

    // Generate AI response (mock for now)
    const aiResponse = getMockResponse(slug, persona, content);

    // Store AI response
    const assistantMessage = await db.messages.create({
      channelSlug: slug,
      role: "assistant",
      persona,
      content: aiResponse,
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

function getMockResponse(channel: string, persona: string, userMessage: string): string {
  const responses: Record<string, string[]> = {
    ada: [
      "From a technical perspective, I'd recommend starting with a clear architecture diagram. Let's break down the components you'll need and discuss tradeoffs.",
      "That's an interesting engineering challenge. Have you considered using a microservices approach here? It would give you more flexibility for scaling.",
      "Before we dive into implementation, let's make sure we have the requirements clear. What's the expected load and what are your latency constraints?",
    ],
    grace: [
      "Let's think about this from the user's perspective. What problem are we really solving here? Have you talked to potential customers about this?",
      "I'd suggest we validate this with some user research before committing resources. What assumptions are we making about user behavior?",
      "That could be a strong feature. How does it fit into our current roadmap priorities? We should consider the opportunity cost.",
    ],
    tony: [
      "From a positioning standpoint, we need to be clear about what makes us different. What's our unique angle that competitors can't easily copy?",
      "Content marketing could work well here. Let's think about what story we want to tell and which channels will reach our ideal customers.",
      "Who's our ideal customer for this? The messaging should resonate with their specific pain points. Let's map out the customer journey.",
    ],
    val: [
      "Let's look at the unit economics here. What's the expected customer acquisition cost and lifetime value? We need those numbers to build a model.",
      "That's a significant investment. What's the expected ROI timeline? I'd like to see a few scenarios before we commit.",
      "We should model out optimistic, realistic, and conservative cases. What are the key assumptions we're making about conversion rates?",
    ],
  };

  const personaResponses = responses[persona] || responses.ada;
  return personaResponses[Math.floor(Math.random() * personaResponses.length)];
}
