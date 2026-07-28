import React from 'react';
import { Sparkles, Trash2, CheckCircle2, Copy, AlertCircle } from 'lucide-react';
import { CleanupSuggestion } from '../../types';

interface CleanupViewProps {
  suggestions: CleanupSuggestion[];
  onApplySuggestion: (id: number) => void;
  duplicates: any[];
}

export const CleanupView: React.FC<CleanupViewProps> = ({
  suggestions,
  onApplySuggestion,
  duplicates
}) => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" /> Smart AI Cleanup Suggestions
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Automated recommendations based on email age, duplicate content, and inactive subscriptions.
        </p>
      </div>

      {/* AI Suggestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.length === 0 ? (
          <div className="col-span-2 p-8 text-center rounded-2xl bg-zinc-900/60 border border-zinc-800 text-zinc-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="font-bold text-white text-base">No cleanup pending!</p>
            <p className="text-xs text-zinc-400 mt-1">Your inbox is fully optimized.</p>
          </div>
        ) : (
          suggestions.map((sug) => (
            <div
              key={sug.id}
              className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 glass-panel flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {sug.suggestion_type}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Save ~{sug.potential_savings_mb} MB
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{sug.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{sug.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
                <span className="text-xs text-zinc-400 font-medium">Affects {sug.affected_count} emails</span>
                <button
                  onClick={() => onApplySuggestion(sug.id)}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Apply Suggestion
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Duplicate Emails Panel */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 glass-panel space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Copy className="w-4 h-4 text-indigo-400" /> Duplicate Email Detector
        </h3>

        {duplicates.length === 0 ? (
          <p className="text-xs text-zinc-400">No duplicate content detected in mailbox.</p>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {duplicates.map((dup, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-zinc-200">{dup.subject}</span>
                  <span className="text-zinc-400 ml-2">from {dup.sender}</span>
                </div>
                <span className="text-rose-400 font-medium">Duplicate Pair</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
