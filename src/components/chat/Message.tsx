import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageData } from "./MessageList";

const personaConfig: Record<string, { name: string; role: string; color: string; bgColor: string; icon: string }> = {
  ada: { name: "Ada", role: "CTO", color: "#3ba55c", bgColor: "bg-discord-green", icon: "🧠" },
  grace: { name: "Grace", role: "CPO", color: "#faa61a", bgColor: "bg-discord-yellow", icon: "🎯" },
  tony: { name: "Tony", role: "CMO", color: "#eb459e", bgColor: "bg-pink-500", icon: "📣" },
  val: { name: "Val", role: "CFO", color: "#ed4245", bgColor: "bg-discord-red", icon: "📊" },
};

interface MessageProps {
  message: MessageData;
  isGrouped?: boolean;
}

export function Message({ message, isGrouped = false }: MessageProps) {
  const isUser = message.role === "user";
  const persona = message.persona ? personaConfig[message.persona] : null;

  // User message - Discord style (left aligned like AI)
  if (isUser) {
    return (
      <div className="group relative px-4 py-0.5 hover:bg-discord-hover message-enter">
        {!isGrouped && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-discord-blurple flex items-center justify-center text-white font-medium shrink-0">
              U
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-discord-header hover:underline cursor-pointer">You</span>
                <time className="text-xs text-discord-text-muted">{formatTime(message.createdAt)}</time>
              </div>
              <div className="text-discord-text whitespace-pre-wrap break-words">{message.content}</div>
            </div>
          </div>
        )}
        {isGrouped && (
          <div className="pl-14">
            <span className="absolute left-4 text-[10px] text-discord-text-muted opacity-0 group-hover:opacity-100 w-10 text-right">
              {formatShortTime(message.createdAt)}
            </span>
            <div className="text-discord-text whitespace-pre-wrap break-words">{message.content}</div>
          </div>
        )}
      </div>
    );
  }

  // AI message
  return (
    <div className="group relative px-4 py-0.5 hover:bg-discord-hover message-enter">
      {!isGrouped && (
        <div className="flex items-start gap-4">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0`}
            style={{ backgroundColor: persona?.color || '#5865f2' }}
          >
            {persona?.icon || "🤖"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span 
                className="font-medium hover:underline cursor-pointer"
                style={{ color: persona?.color || '#dcddde' }}
              >
                {persona?.name || "Assistant"}
              </span>
              {persona && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-discord-blurple/20 text-discord-blurple font-medium">
                  {persona.role}
                </span>
              )}
              <time className="text-xs text-discord-text-muted">{formatTime(message.createdAt)}</time>
            </div>
            <div className="text-discord-text prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
      {isGrouped && (
        <div className="pl-14">
          <span className="absolute left-4 text-[10px] text-discord-text-muted opacity-0 group-hover:opacity-100 w-10 text-right">
            {formatShortTime(message.createdAt)}
          </span>
          <div className="text-discord-text prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const timeStr = date.toLocaleTimeString("en-US", { 
    hour: "numeric", 
    minute: "2-digit",
    hour12: true 
  });

  if (date.toDateString() === today.toDateString()) {
    return `Today at ${timeStr}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${timeStr}`;
  } else {
    return date.toLocaleDateString("en-US", { 
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    }) + ` ${timeStr}`;
  }
}

function formatShortTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", { 
    hour: "numeric", 
    minute: "2-digit",
    hour12: true 
  });
}
