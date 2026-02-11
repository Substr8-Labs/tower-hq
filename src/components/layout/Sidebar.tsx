"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const channels = [
  { slug: "general", icon: "#", label: "general" },
  { slug: "engineering", icon: "#", label: "engineering", persona: "Ada" },
  { slug: "product", icon: "#", label: "product", persona: "Grace" },
  { slug: "marketing", icon: "#", label: "marketing", persona: "Tony" },
  { slug: "finance", icon: "#", label: "finance", persona: "Val" },
  { slug: "decisions", icon: "📌", label: "decisions" },
];

interface SidebarProps {
  companyName?: string;
  onClose?: () => void;
}

export function Sidebar({ companyName = "My Company", onClose }: SidebarProps) {
  const pathname = usePathname();
  const currentChannel = pathname?.split("/").pop();

  return (
    <aside className="w-60 bg-discord-bg-secondary flex flex-col h-full">
      {/* Server header */}
      <div className="h-12 px-4 flex items-center border-b border-discord-bg-tertiary shadow-sm">
        <h1 className="font-semibold text-discord-header truncate">{companyName} HQ</h1>
      </div>

      {/* Channels */}
      <nav id="sidebar-channels" className="flex-1 overflow-y-auto pt-4 px-2">
        <div className="text-xs font-semibold text-discord-text-muted uppercase tracking-wide px-2 mb-1 flex items-center justify-between">
          <span>Channels</span>
          <button className="hover:text-discord-text">+</button>
        </div>
        {channels.map((channel) => (
          <Link
            key={channel.slug}
            id={`channel-${channel.slug}`}
            href={`/app/${channel.slug}`}
            onClick={onClose}
            className={`group flex items-center gap-1.5 px-2 py-1.5 mx-0 rounded transition-colors ${
              currentChannel === channel.slug
                ? "bg-discord-active text-discord-header"
                : "text-discord-text-muted hover:text-discord-text hover:bg-discord-hover"
            }`}
          >
            <span className={`text-lg w-5 text-center ${currentChannel === channel.slug ? "text-discord-text" : "text-discord-text-muted"}`}>
              {channel.icon}
            </span>
            <span className="truncate text-sm font-medium">{channel.label}</span>
          </Link>
        ))}
      </nav>

      {/* User panel */}
      <div className="h-[52px] px-2 bg-discord-bg-secondary-alt flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-discord-blurple flex items-center justify-center text-white text-sm font-medium">
          U
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-discord-header truncate">User</div>
          <div className="text-xs text-discord-text-muted truncate">Online</div>
        </div>
        <Link href="/settings" className="p-1.5 rounded hover:bg-discord-hover text-discord-text-muted hover:text-discord-text">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
