const channelInfo: Record<string, { icon: string; title: string; description: string; persona?: { name: string; role: string; color: string; emoji: string } }> = {
  general: { 
    icon: "#", 
    title: "Welcome to #general",
    description: "This is the start of the #general channel. Ask any strategic question — the right persona will respond."
  },
  engineering: { 
    icon: "#", 
    title: "Welcome to #engineering",
    description: "This is the start of the #engineering channel.",
    persona: { name: "Ada", role: "CTO", color: "#3ba55c", emoji: "🧠" }
  },
  product: { 
    icon: "#", 
    title: "Welcome to #product",
    description: "This is the start of the #product channel.",
    persona: { name: "Grace", role: "CPO", color: "#faa61a", emoji: "🎯" }
  },
  marketing: { 
    icon: "#", 
    title: "Welcome to #marketing",
    description: "This is the start of the #marketing channel.",
    persona: { name: "Tony", role: "CMO", color: "#eb459e", emoji: "📣" }
  },
  finance: { 
    icon: "#", 
    title: "Welcome to #finance",
    description: "This is the start of the #finance channel.",
    persona: { name: "Val", role: "CFO", color: "#ed4245", emoji: "📊" }
  },
  decisions: { 
    icon: "📌", 
    title: "Welcome to #decisions",
    description: "Log important decisions here. Your AI team will help you structure and review them."
  },
};

interface EmptyStateProps {
  channel: string;
}

export function EmptyState({ channel }: EmptyStateProps) {
  const info = channelInfo[channel] || channelInfo.general;

  return (
    <div className="flex-1 flex flex-col justify-end px-4 pb-4">
      <div className="mb-4">
        {/* Channel icon */}
        <div className="w-[68px] h-[68px] rounded-full bg-discord-input flex items-center justify-center mb-4">
          <span className="text-4xl text-discord-text-muted">{info.icon}</span>
        </div>

        {/* Title */}
        <h2 className="text-[32px] font-bold text-discord-header mb-2">{info.title}</h2>
        
        {/* Description */}
        <p className="text-discord-text-muted">
          {info.description}
          {info.persona && (
            <>
              {" "}
              <span 
                className="font-semibold"
                style={{ color: info.persona.color }}
              >
                {info.persona.emoji} {info.persona.name}
              </span>
              {" "}({info.persona.role}) is here to help with{" "}
              {channel === "engineering" && "technical architecture, code, and infrastructure decisions."}
              {channel === "product" && "product strategy, roadmap, and feature prioritization."}
              {channel === "marketing" && "growth, messaging, and go-to-market strategy."}
              {channel === "finance" && "business model, pricing, and runway planning."}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
