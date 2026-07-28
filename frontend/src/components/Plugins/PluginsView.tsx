import React from 'react';
import { Puzzle, CheckCircle, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { PluginItem } from '../../types';

interface PluginsViewProps {
  plugins: PluginItem[];
  onTogglePlugin: (pluginId: string, enable: boolean) => void;
}

export const PluginsView: React.FC<PluginsViewProps> = ({ plugins, onTogglePlugin }) => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-indigo-400" /> Extensible Provider Plugin Architecture
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Enable optional mail provider extensions for Outlook, Yahoo, Generic IMAP, and Proton Mail.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plugins.map((plug) => (
          <div
            key={plug.plugin_id}
            className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 glass-panel flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">
                  {plug.provider}
                </span>
                {plug.is_enabled ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Active
                  </span>
                ) : (
                  <span className="text-xs text-zinc-400 font-medium">Available</span>
                )}
              </div>
              <h3 className="text-base font-bold text-white">{plug.name}</h3>
              <p className="text-xs text-zinc-400 mt-1 font-mono text-[11px] truncate">
                ID: {plug.plugin_id}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
              <span className="text-xs text-zinc-400 font-medium">Provider Extension</span>
              <button
                onClick={() => onTogglePlugin(plug.plugin_id, !plug.is_enabled)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  plug.is_enabled
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                {plug.is_enabled ? (
                  <>
                    <ToggleRight className="w-4 h-4" /> Enabled
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-zinc-400" /> Enable
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
