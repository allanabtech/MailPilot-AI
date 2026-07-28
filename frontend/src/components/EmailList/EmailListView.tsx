import React, { useState } from 'react';
import {
  Archive,
  Trash2,
  MailCheck,
  Star,
  ShieldAlert,
  Paperclip,
  Tag,
  CheckSquare,
  Square,
  AlertTriangle
} from 'lucide-react';
import { Email } from '../../types';

interface EmailListViewProps {
  emails: Email[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectEmail: (email: Email) => void;
  onBulkAction: (emailIds: number[], action: string, value?: string) => void;
}

const CATEGORY_TABS = [
  "All", "OTP", "GitHub", "Banking", "Receipts", "Subscriptions",
  "Work", "Finance", "Shopping", "Travel", "Security", "Spam"
];

export const EmailListView: React.FC<EmailListViewProps> = ({
  emails,
  selectedCategory,
  setSelectedCategory,
  onSelectEmail,
  onBulkAction
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === emails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(emails.map(e => e.id));
    }
  };

  const toggleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulk = (action: string, value?: string) => {
    if (selectedIds.length === 0) return;
    onBulkAction(selectedIds, action, value);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-zinc-950">
      {/* Category Tabs Bar */}
      <div className="flex items-center gap-1.5 px-6 py-3 border-b border-zinc-800/80 bg-zinc-900/40 overflow-x-auto select-none">
        {CATEGORY_TABS.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between px-6 py-2.5 bg-indigo-950/40 border-b border-indigo-500/30 text-xs">
          <span className="font-semibold text-indigo-300">
            {selectedIds.length} email{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulk('archive')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium"
            >
              <Archive className="w-3.5 h-3.5" /> Archive
            </button>
            <button
              onClick={() => handleBulk('mark_read')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium"
            >
              <MailCheck className="w-3.5 h-3.5" /> Mark Read
            </button>
            <button
              onClick={() => handleBulk('star')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium"
            >
              <Star className="w-3.5 h-3.5 text-amber-400" /> Star
            </button>
            <button
              onClick={() => handleBulk('delete')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-200 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Email List Header */}
      <div className="flex items-center px-6 py-2 border-b border-zinc-800/60 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
        <button onClick={toggleSelectAll} className="mr-4 text-zinc-400 hover:text-zinc-200">
          {selectedIds.length === emails.length && emails.length > 0 ? (
            <CheckSquare className="w-4 h-4 text-indigo-400" />
          ) : (
            <Square className="w-4 h-4" />
          )}
        </button>
        <div className="w-1/4">Sender</div>
        <div className="flex-1">Subject & Snippet</div>
        <div className="w-28 text-right">Category / Date</div>
      </div>

      {/* Email Items Scrollable Container */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
            <MailCheck className="w-10 h-10 text-indigo-400/50 mb-2" />
            <p className="font-semibold text-sm">Inbox Zero Achieved!</p>
            <p className="text-xs text-zinc-400">No emails found matching the selected filter.</p>
          </div>
        ) : (
          emails.map((email) => {
            const isSelected = selectedIds.includes(email.id);
            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={`flex items-center px-6 py-3.5 cursor-pointer select-none transition-colors group ${
                  isSelected
                    ? 'bg-indigo-950/30'
                    : email.is_read
                    ? 'bg-zinc-950 hover:bg-zinc-900/60'
                    : 'bg-zinc-900/40 hover:bg-zinc-900/80 font-semibold'
                }`}
              >
                {/* Select Checkbox */}
                <button
                  onClick={(e) => toggleSelect(email.id, e)}
                  className="mr-4 text-zinc-400 hover:text-zinc-200"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                  )}
                </button>

                {/* Sender */}
                <div className="w-1/4 pr-2 truncate flex items-center gap-2">
                  {email.phishing_risk === 'High' || email.phishing_risk === 'Critical' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" aria-label="High Phishing Risk Detected" />
                  ) : email.is_starred ? (
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  ) : null}
                  <span className={`text-sm truncate ${email.is_read ? 'text-zinc-300' : 'text-white font-bold'}`}>
                    {email.sender_name || email.sender}
                  </span>
                </div>

                {/* Subject & Snippet */}
                <div className="flex-1 pr-4 truncate">
                  <span className={`text-sm ${email.is_read ? 'text-zinc-300' : 'text-white'}`}>
                    {email.subject}
                  </span>
                  <span className="text-xs text-zinc-400 font-normal ml-2 truncate">
                    — {email.snippet}
                  </span>
                </div>

                {/* Badges & Date */}
                <div className="w-28 flex flex-col items-end gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-zinc-800 text-indigo-300 border border-zinc-700/60">
                    {email.category}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {new Date(email.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
