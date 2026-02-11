import { NextRequest, NextResponse } from "next/server";
import { getTaskStatus } from "@/lib/agent-spawn";

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = params;
  
  const task = getTaskStatus(taskId);
  
  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    id: task.id,
    status: task.status,
    createdAt: task.createdAt.toISOString(),
    persona: {
      id: task.request.persona.id,
      name: task.request.persona.name,
      emoji: task.request.persona.emoji,
    },
    channel: task.request.channelSlug,
    result: task.result,
    sessionKey: task.sessionKey,
  });
}
