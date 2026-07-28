import React from 'react';
import {
  LayoutDashboard,
  Mail,
  Newspaper,
  Sparkles,
  Zap,
  Paperclip,
  Puzzle,
  Settings,
  ShieldCheck,
  HardDrive
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  unreadCount?: number;
  suggestionsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  unreadCount = 0,
  suggestionsCount = 0
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'emails', label: 'Inbox Cleaner', icon: Mail, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'cleanup', label: 'Smart Cleanup', icon: Sparkles, badge: suggestionsCount > 0 ? suggestionsCount : undefined },
    { id: 'newsletters', label: 'Newsletters', icon: Newspaper },
    { id: 'rules', label: 'Automation Rules', icon: Zap },
    { id: 'attachments', label: 'Attachment Vault', icon: Paperclip },
    { id: 'plugins', label: 'Plugin Extensions', icon: Puzzle },
    { id: 'settings', label: 'Settings & Privacy', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-zinc-900/90 border-r border-zinc-800/80 flex flex-col justify-between p-4 select-none backdrop-blur-xl">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              MailPilot <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30">AI</span>
            </h1>
            <p className="text-[11px] text-zinc-400 font-medium">Privacy-First Email Assistant</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Security & System Info Footer */}
      <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> AES-256 Encrypted
          </span>
          <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">v1.0.0</span>
        </div>
        <p className="text-[11px] text-zinc-400 line-clamp-1">
          Zero telemetry. Processing locally in SQLite.
        </p>
      </div>
    </aside>
  );
};
