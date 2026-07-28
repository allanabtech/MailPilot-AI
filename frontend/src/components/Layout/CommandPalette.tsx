import React, { useEffect, useState } from 'react';
import { Search, LayoutDashboard, Mail, Sparkles, Newspaper, Zap, Paperclip, Settings, Download, RefreshCw } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onSync: () => void;
  onRunRules: () => void;
  onExportBackup: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSync,
  onRunRules,
  onExportBackup
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, category: 'Navigation', action: () => onSelectTab('dashboard') },
    { id: 'emails', label: 'Go to Inbox Cleaner', icon: Mail, category: 'Navigation', action: () => onSelectTab('emails') },
    { id: 'cleanup', label: 'Go to Smart Cleanup', icon: Sparkles, category: 'Navigation', action: () => onSelectTab('cleanup') },
    { id: 'newsletters', label: 'Go to Newsletters', icon: Newspaper, category: 'Navigation', action: () => onSelectTab('newsletters') },
    { id: 'rules', label: 'Go to Automation Rules', icon: Zap, category: 'Navigation', action: () => onSelectTab('rules') },
    { id: 'attachments', label: 'Go to Attachment Vault', icon: Paperclip, category: 'Navigation', action: () => onSelectTab('attachments') },
    { id: 'settings', label: 'Go to Settings', icon: Settings, category: 'Navigation', action: () => onSelectTab('settings') },
    { id: 'sync', label: 'Sync Mailbox Now', icon: RefreshCw, category: 'Actions', action: onSync },
    { id: 'run_rules', label: 'Run Automation Rules Engine', icon: Zap, category: 'Actions', action: onRunRules },
    { id: 'backup', label: 'Export Backup JSON', icon: Download, category: 'Actions', action: onExportBackup },
  ];

  const filteredCommands = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        <div className="flex items-center px-4 py-3 border-b border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search page..."
            className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-400 focus:outline-none"
          />
          <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">ESC</span>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <p className="text-center text-sm text-zinc-400 py-6">No matching commands found</p>
          ) : (
            filteredCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-indigo-600/20 hover:text-indigo-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <span>{cmd.label}</span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-400">{cmd.category}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
