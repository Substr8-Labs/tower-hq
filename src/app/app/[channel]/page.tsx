"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MessageList, MessageInput, EmptyState, type MessageData } from "@/components/chat";

const channelConfig: Record<string, { name: string; description: string; persona?: string }> = {
  general: { name: "general", description: "General strategic discussion" },
  engineering: { name: "engineering", description: "Technical architecture & code", persona: "ada" },
  product: { name: "product", description: "Product strategy & roadmap", persona: "grace" },
  marketing: { name: "marketing", description: "Growth & go-to-market", persona: "tony" },
  finance: { name: "finance", description: "Business model & runway", persona: "val" },
  decisions: { name: "decisions", description: "Decision log" },
};

export default function ChannelPage() {
  const params = useParams();
  const channel = params.channel as string;
  const config = channelConfig[channel] || channelConfig.general;
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [channel]);

  const loadMessages = async () => {
    try {
      const res = await fetch(`/api/channels/${channel}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleSend = async (content: string) => {
    const tempId = `temp-${Date.now()}`;
    const userMessage: MessageData = {
      id: tempId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/channels/${channel}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempId),
          data.userMessage,
          data.assistantMessage,
        ]);
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-discord-bg-primary">
      {/* Channel header - Discord style */}
      <header className="h-12 min-h-[48px] px-4 flex items-center border-b border-discord-bg-tertiary shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-discord-text-muted text-xl">#</span>
          <h1 className="font-semibold text-discord-header">{config.name}</h1>
          <div className="hidden sm:block w-px h-6 bg-discord-text-muted/30 mx-2" />
          <span className="hidden sm:block text-sm text-discord-text-muted truncate">
            {config.description}
          </span>
        </div>
      </header>

      {/* Messages or empty state */}
      {messages.length === 0 && !isLoading ? (
        <EmptyState channel={channel} />
      ) : (
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          typingPersona={config.persona}
        />
      )}

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        disabled={isLoading}
        placeholder={`Message #${config.name}`}
      />
    </div>
  );
}
