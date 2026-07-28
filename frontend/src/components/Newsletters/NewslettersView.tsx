import React from 'react';
import { Newspaper, ExternalLink, CheckCircle, Ban, RefreshCw } from 'lucide-react';
import { Newsletter } from '../../types';

interface NewslettersViewProps {
  newsletters: Newsletter[];
  onUnsubscribe: (id: number) => void;
}

export const NewslettersView: React.FC<NewslettersViewProps> = ({ newsletters, onUnsubscribe }) => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-indigo-400" /> Newsletter & Subscription Manager
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Detect recurring subscriptions and execute 1-click unsubscribes without leaving MailPilot AI.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden glass-panel">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
          <div className="col-span-4">Newsletter Sender</div>
          <div className="col-span-3">Email Address</div>
          <div className="col-span-2 text-center">Volume</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {newsletters.map((nl) => {
            const isUnsub = nl.status === 'unsubscribed';
            return (
              <div key={nl.id} className="grid grid-cols-12 px-6 py-4 items-center text-sm">
                <div className="col-span-4 font-semibold text-white flex items-center gap-2">
                  {nl.sender_name || 'Newsletter'}
                  {nl.unsubscribe_link && (
                    <a
                      href={nl.unsubscribe_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-indigo-400"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="col-span-3 text-zinc-400 text-xs truncate">{nl.sender_email}</div>
                <div className="col-span-2 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300">
                    {nl.total_received} emails
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  {isUnsub ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                      <Ban className="w-3 h-3" /> Stopped
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-right">
                  {!isUnsub ? (
                    <button
                      onClick={() => onUnsubscribe(nl.id)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all"
                    >
                      1-Click Unsubscribe
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-400 font-medium">Unsubscribed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
