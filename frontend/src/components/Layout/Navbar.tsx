import React from 'react';
import { Search, RefreshCw, Sun, Moon, Command, User, CheckCircle2 } from 'lucide-react';
import { Account } from '../../types';

interface NavbarProps {
  currentAccount?: Account;
  onSync: () => void;
  isSyncing: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAccount,
  onSync,
  isSyncing,
  isDarkMode,
  setIsDarkMode,
  searchQuery,
  setSearchQuery,
  openCommandPalette
}) => {
  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl px-6 flex items-center justify-between gap-4 select-none">
      {/* Search Input & Command Launcher */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emails by sender, subject or body... (Press / to focus)"
            className="w-full pl-9 pr-12 py-2 bg-zinc-950/70 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
          />
          <button
            onClick={openCommandPalette}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-semibold text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 hover:text-zinc-200 transition-colors"
          >
            <Command className="w-3 h-3" /> K
          </button>
        </div>
      </div>

      {/* Account Info, Sync & Theme Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-zinc-800/70 border border-zinc-700/70 hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-400' : 'text-zinc-400'}`} />
          {isSyncing ? 'Syncing...' : 'Sync Mailbox'}
        </button>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg bg-zinc-800/70 border border-zinc-700/70 text-zinc-400 hover:text-white transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* User Account Switcher Badge */}
        {currentAccount && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-800">
            {currentAccount.avatar_url ? (
              <img
                src={currentAccount.avatar_url}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {currentAccount.display_name ? currentAccount.display_name[0] : 'A'}
              </div>
            )}
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-zinc-200">{currentAccount.display_name || 'Alex Rivera'}</p>
              <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> {currentAccount.email_address}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
