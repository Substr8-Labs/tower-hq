import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Get token status (not the actual token)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const tower = await prisma.tower.findUnique({
      where: { userId: session.userId },
    });

    return NextResponse.json({
      hasToken: !!tower?.claudeToken,
      tokenPreview: tower?.claudeToken 
        ? `${tower.claudeToken.slice(0, 15)}...${tower.claudeToken.slice(-4)}`
        : null,
    });
  } catch (error) {
    console.error("Failed to get token status:", error);
    return NextResponse.json({ error: "Failed to get token status" }, { status: 500 });
  }
}

// Set Claude token
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { token } = await request.json();

    // Validate token format
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const trimmedToken = token.trim();
    
    // Check for valid Anthropic token formats
    // sk-ant-oat01- = setup token (subscription)
    // sk-ant-api03- = API key
    if (!trimmedToken.startsWith('sk-ant-')) {
      return NextResponse.json({ 
        error: "Invalid token format. Token should start with 'sk-ant-'" 
      }, { status: 400 });
    }

    // Update the tower with the token
    const tower = await prisma.tower.update({
      where: { userId: session.userId },
      data: { claudeToken: trimmedToken },
    });

    return NextResponse.json({
      success: true,
      hasToken: true,
      tokenPreview: `${trimmedToken.slice(0, 15)}...${trimmedToken.slice(-4)}`,
    });
  } catch (error) {
    console.error("Failed to set token:", error);
    return NextResponse.json({ error: "Failed to save token" }, { status: 500 });
  }
}

// Delete token
export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await prisma.tower.update({
      where: { userId: session.userId },
      data: { claudeToken: null },
    });

    return NextResponse.json({ success: true, hasToken: false });
  } catch (error) {
    console.error("Failed to delete token:", error);
    return NextResponse.json({ error: "Failed to delete token" }, { status: 500 });
  }
}
