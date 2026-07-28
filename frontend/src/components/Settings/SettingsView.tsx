import React from 'react';
import { Settings, ShieldCheck, Download, Key, HardDrive, Keyboard, CheckCircle } from 'lucide-react';
import { Account } from '../../types';

interface SettingsViewProps {
  account?: Account;
  onExportBackup: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ account, onExportBackup }) => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" /> Settings, Privacy & Backup
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Manage local database, OAuth credentials, AES-256 token encryption, and backup exports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account & OAuth Configuration */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" /> Account & Gmail OAuth Status
          </h3>

          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Connected Account</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Active
              </span>
            </div>
            <p className="text-sm font-bold text-white">{account?.email_address || 'alex.developer@gmail.com'}</p>
            <p className="text-[11px] text-zinc-400">Provider: {account?.provider.toUpperCase() || 'GMAIL'}</p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Zero-Config Mock Engine Enabled
            </p>
            <p className="text-zinc-400">
              Running locally with instant mock data. To connect a live Gmail account, provide GMAIL_CLIENT_ID in backend .env.
            </p>
          </div>
        </div>

        {/* Data Backup & Privacy */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 glass-panel space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" /> Local Storage & Privacy Guard
          </h3>

          <p className="text-xs text-zinc-400 leading-relaxed">
            MailPilot AI indexes email metadata into local SQLite storage (<code className="text-indigo-300">mailpilot.db</code>). OAuth tokens are encrypted using AES-256 Fernet keys.
          </p>

          <button
            onClick={onExportBackup}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Export Complete Backup JSON
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 glass-panel space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-amber-400" /> Keyboard Shortcuts
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-300 font-mono text-[10px]">⌘ + K</kbd>
            <p className="text-zinc-400 mt-1">Command Palette</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-300 font-mono text-[10px]"> / </kbd>
            <p className="text-zinc-400 mt-1">Focus Search</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-300 font-mono text-[10px]">E</kbd>
            <p className="text-zinc-400 mt-1">Archive Selected</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-300 font-mono text-[10px]">#</kbd>
            <p className="text-zinc-400 mt-1">Delete Selected</p>
          </div>
        </div>
      </div>
    </div>
  );
};
