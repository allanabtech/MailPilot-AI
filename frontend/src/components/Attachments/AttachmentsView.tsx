import React, { useState } from 'react';
import { Paperclip, Download, FileText, Image as ImageIcon, Archive as ZipIcon, HardDrive } from 'lucide-react';
import { Attachment } from '../../types';

interface AttachmentsViewProps {
  attachments: Attachment[];
}

export const AttachmentsView: React.FC<AttachmentsViewProps> = ({ attachments }) => {
  const [filterType, setFilterType] = useState('ALL');

  const filtered = attachments.filter(a => {
    if (filterType === 'PDF') return a.content_type.includes('pdf');
    if (filterType === 'IMAGE') return a.content_type.includes('image');
    if (filterType === 'ZIP') return a.content_type.includes('zip') || a.content_type.includes('archive');
    return true;
  });

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-indigo-400" /> Attachment Vault & Storage Analyzer
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Browse all email attachments, filter by file format, and manage local storage consumption.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          {['ALL', 'PDF', 'IMAGE', 'ZIP'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Attachment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((att) => {
          const isPdf = att.content_type.includes('pdf');
          const isImg = att.content_type.includes('image');
          return (
            <div
              key={att.id}
              className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 glass-panel flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  {isPdf ? (
                    <FileText className="w-5 h-5 text-rose-400" />
                  ) : isImg ? (
                    <ImageIcon className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ZipIcon className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate" title={att.filename}>
                    {att.filename}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {Math.round(att.size_bytes / 1024)} KB • {att.content_type.split('/')[1] || 'file'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
                <span className="text-zinc-400 text-[10px]">Email Attachment</span>
                <button
                  onClick={() => alert(`Downloading ${att.filename}`)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-indigo-400 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
