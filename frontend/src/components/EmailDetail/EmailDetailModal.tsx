import React from 'react';
import {
  X,
  Archive,
  Trash2,
  Star,
  ShieldAlert,
  Paperclip,
  Download,
  CheckCircle,
  Tag
} from 'lucide-react';
import { Email } from '../../types';

interface EmailDetailModalProps {
  email: Email | null;
  onClose: () => void;
  onAction: (emailId: number, action: string, value?: string) => void;
}

export const EmailDetailModal: React.FC<EmailDetailModalProps> = ({ email, onClose, onAction }) => {
  if (!email) return null;

  const isPhishing = email.phishing_risk === 'High' || email.phishing_risk === 'Critical';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[85vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden glass-panel animate-in zoom-in-95 duration-150">
        
        {/* Top Header & Actions Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {email.category} (Score: {Math.round(email.confidence_score * 100)}%)
            </span>
            {isPhishing && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Phishing Risk: {email.phishing_risk}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onAction(email.id, 'archive');
                onClose();
              }}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              title="Archive Email"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onAction(email.id, email.is_starred ? 'unstar' : 'star');
              }}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 transition-colors"
              title="Star Email"
            >
              <Star className={`w-4 h-4 ${email.is_starred ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => {
                onAction(email.id, 'delete');
                onClose();
              }}
              className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-300 transition-colors"
              title="Delete Email"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security Warning Banner if Phishing */}
        {isPhishing && (
          <div className="px-6 py-3 bg-rose-950/50 border-b border-rose-500/30 flex items-center gap-3 text-xs text-rose-200">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-bold">Caution: MailPilot AI Phishing Guard Flag</p>
              <p className="text-rose-300/80">This email exhibits suspicious domain spoofing or urgent credential requests. Do not click links.</p>
            </div>
          </div>
        )}

        {/* Email Metadata */}
        <div className="px-6 py-4 border-b border-zinc-800/80 space-y-2 bg-zinc-900/40">
          <h2 className="text-lg font-bold text-white leading-tight">{email.subject}</h2>
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div>
              <span className="font-semibold text-zinc-200">{email.sender_name || email.sender}</span> &lt;{email.sender}&gt;
            </div>
            <span>{new Date(email.date).toLocaleString()}</span>
          </div>
        </div>

        {/* Email Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap">
          {email.body_text || email.snippet}
        </div>

        {/* Attachments Section */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/80">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-indigo-400" /> Attachments ({email.attachments.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {email.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-200"
                >
                  <span className="truncate max-w-xs">{att.filename}</span>
                  <span className="text-[10px] text-zinc-400 font-semibold">({Math.round(att.size_bytes / 1024)} KB)</span>
                  <button
                    onClick={() => alert(`Downloading attachment ${att.filename}`)}
                    className="p-1 text-indigo-400 hover:text-indigo-300"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
