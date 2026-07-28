import React from 'react';
import {
  Mail,
  HardDrive,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { AnalyticsData } from '../../types';

interface DashboardViewProps {
  analytics?: AnalyticsData;
  onNavigateTab: (tab: string) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#3b82f6'];

export const DashboardView: React.FC<DashboardViewProps> = ({ analytics, onNavigateTab }) => {
  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-zinc-900 border border-indigo-500/20 glass-panel">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Inbox Health Score <span className="text-2xl text-emerald-400 font-extrabold">{analytics.clean_inbox_score}/100</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Your inbox is {analytics.clean_inbox_score >= 80 ? 'extremely clean & optimized' : 'ready for AI cleanup'}. 
            {analytics.spam_phishing_count > 0 && ` Detected ${analytics.spam_phishing_count} spam/phishing items.`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigateTab('cleanup')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Run AI Cleanup
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 glass-panel">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>TOTAL EMAILS</span>
            <Mail className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{analytics.total_emails}</p>
          <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
            <span className="text-indigo-400 font-semibold">{analytics.unread_count} unread</span> in main inbox
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 glass-panel">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>STORAGE USED</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{analytics.storage_used_mb} MB</p>
          <p className="text-[11px] text-zinc-400 mt-1">
            Attachments: {analytics.storage_breakdown.attachments_mb} MB
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 glass-panel">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>ACTIVE NEWSLETTERS</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{analytics.newsletters_count}</p>
          <button
            onClick={() => onNavigateTab('newsletters')}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold mt-1 flex items-center gap-0.5"
          >
            Manage subscriptions <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80 glass-panel">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>AUTOMATION RULES</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{analytics.active_rules_count}</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Active auto-filters
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Volume Trend Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Daily Email Volume vs Cleaned</h3>
              <p className="text-xs text-zinc-400">Emails received vs archived/cleaned per day</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.email_volume_by_day}>
                <defs>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClean" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="received" stroke="#6366f1" fillOpacity={1} fill="url(#colorRec)" name="Received" />
                <Area type="monotone" dataKey="cleaned" stroke="#10b981" fillOpacity={1} fill="url(#colorClean)" name="Cleaned" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 glass-panel space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Category Breakdown</h3>
            <p className="text-xs text-zinc-400">Distribution across 20 smart categories</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.category_distribution} layout="vertical">
                <XAxis type="number" stroke="#71717a" fontSize={11} hide />
                <YAxis dataKey="category" type="category" stroke="#a1a1aa" fontSize={11} width={80} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {analytics.category_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Senders Table */}
      <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" /> Top Email Senders
          </h3>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {analytics.top_senders.map((sender, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
              <span className="text-zinc-300 font-medium">{sender.sender}</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                {sender.count} emails
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
