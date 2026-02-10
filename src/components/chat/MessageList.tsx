"use client";

import { useEffect, useRef } from "react";
import { Message } from "./Message";

export interface MessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  persona?: string;
  createdAt: string;
}

interface MessageListProps {
  messages: MessageData[];
  isLoading?: boolean;
  typingPersona?: string;
}

// Check if messages should be grouped (same author within 7 minutes)
function shouldGroupMessage(current: MessageData, previous: MessageData | null): boolean {
  if (!previous) return false;
  if (current.role !== previous.role) return false;
  if (current.persona !== previous.persona) return false;
  
  const currentTime = new Date(current.createdAt).getTime();
  const previousTime = new Date(previous.createdAt).getTime();
  const diffMinutes = (currentTime - previousTime) / (1000 * 60);
  
  return diffMinutes < 7;
}

export function MessageList({ messages, isLoading, typingPersona }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="py-4">
        {messages.map((message, index) => (
          <Message 
            key={message.id} 
            message={message} 
            isGrouped={shouldGroupMessage(message, messages[index - 1] || null)}
          />
        ))}
        {isLoading && <TypingIndicator persona={typingPersona} />}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

const personaInfo: Record<string, { name: string; color: string; icon: string }> = {
  ada: { name: "Ada", color: "#3ba55c", icon: "🧠" },
  grace: { name: "Grace", color: "#faa61a", icon: "🎯" },
  tony: { name: "Tony", color: "#eb459e", icon: "📣" },
  val: { name: "Val", color: "#ed4245", icon: "📊" },
};

function TypingIndicator({ persona }: { persona?: string }) {
  const info = persona ? personaInfo[persona] : null;
  
  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 animate-pulse"
          style={{ backgroundColor: info?.color || '#5865f2' }}
        >
          {info?.icon || "🤔"}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-discord-text-muted text-sm">
            <span style={{ color: info?.color }} className="font-medium">{info?.name || "Assistant"}</span>
            {" is typing"}
          </span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-discord-text-muted rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-discord-text-muted rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-discord-text-muted rounded-full typing-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
