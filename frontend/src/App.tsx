import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Navbar } from './components/Layout/Navbar';
import { CommandPalette } from './components/Layout/CommandPalette';
import { DashboardView } from './components/Dashboard/DashboardView';
import { EmailListView } from './components/EmailList/EmailListView';
import { EmailDetailModal } from './components/EmailDetail/EmailDetailModal';
import { NewslettersView } from './components/Newsletters/NewslettersView';
import { CleanupView } from './components/Cleanup/CleanupView';
import { RulesView } from './components/Rules/RulesView';
import { AttachmentsView } from './components/Attachments/AttachmentsView';
import { PluginsView } from './components/Plugins/PluginsView';
import { SettingsView } from './components/Settings/SettingsView';
import { api } from './services/api';
import {
  Account,
  Email,
  Newsletter,
  Rule,
  CleanupSuggestion,
  AnalyticsData,
  Attachment,
  PluginItem
} from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Data State
  const [account, setAccount] = useState<Account | undefined>();
  const [emails, setEmails] = useState<Email[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [suggestions, setSuggestions] = useState<CleanupSuggestion[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | undefined>();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load initial data
  const loadData = async () => {
    try {
      const [accData, emailData, nlData, ruleData, sugData, dupData, attData, plugData, analyticsData] = await Promise.all([
        api.getCurrentAccount().catch(() => undefined),
        api.getEmails().catch(() => []),
        api.getNewsletters().catch(() => []),
        api.getRules().catch(() => []),
        api.getCleanupSuggestions().catch(() => []),
        api.getDuplicates().catch(() => ({ duplicates: [] })),
        api.getAttachments().catch(() => []),
        api.getPlugins().catch(() => []),
        api.getAnalytics().catch(() => undefined)
      ]);

      if (accData) setAccount(accData);
      setEmails(emailData);
      setNewsletters(nlData);
      setRules(ruleData);
      setSuggestions(sugData);
      setDuplicates(dupData.duplicates || []);
      setAttachments(attData);
      setPlugins(plugData);
      if (analyticsData) setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error loading MailPilot AI data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await api.triggerSync();
      await loadData();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleBulkAction = async (emailIds: number[], action: string, value?: string) => {
    await api.executeBulkAction({ email_ids: emailIds, action, value });
    await loadData();
  };

  const handleUnsubscribeNewsletter = async (id: number) => {
    await api.unsubscribeNewsletter(id);
    await loadData();
  };

  const handleCreateRule = async (ruleObj: any) => {
    await api.createRule(ruleObj);
    await loadData();
  };

  const handleDeleteRule = async (id: number) => {
    await api.deleteRule(id);
    await loadData();
  };

  const handleExecuteRules = async () => {
    await api.executeRules();
    await loadData();
  };

  const handleApplySuggestion = async (id: number) => {
    await api.applyCleanupSuggestion(id);
    await loadData();
  };

  const handleTogglePlugin = async (pluginId: string, enable: boolean) => {
    await api.togglePlugin(pluginId, enable);
    await loadData();
  };

  const handleExportBackup = () => {
    window.open(api.exportBackupUrl, '_blank');
  };

  // Filtered email list by category and search
  const filteredEmails = emails.filter((email) => {
    if (selectedCategory !== 'All' && email.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        email.subject.toLowerCase().includes(q) ||
        email.sender.toLowerCase().includes(q) ||
        (email.snippet && email.snippet.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${isDarkMode ? 'dark bg-zinc-950 text-white' : 'light bg-slate-50 text-slate-900'}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        unreadCount={analytics?.unread_count}
        suggestionsCount={suggestions.length}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentAccount={account}
          onSync={handleSync}
          isSyncing={isSyncing}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* View Switcher */}
        <main className="flex-1 overflow-hidden">
          {currentTab === 'dashboard' && (
            <DashboardView analytics={analytics} onNavigateTab={setCurrentTab} />
          )}

          {currentTab === 'emails' && (
            <EmailListView
              emails={filteredEmails}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSelectEmail={(email) => setSelectedEmail(email)}
              onBulkAction={handleBulkAction}
            />
          )}

          {currentTab === 'newsletters' && (
            <NewslettersView
              newsletters={newsletters}
              onUnsubscribe={handleUnsubscribeNewsletter}
            />
          )}

          {currentTab === 'cleanup' && (
            <CleanupView
              suggestions={suggestions}
              onApplySuggestion={handleApplySuggestion}
              duplicates={duplicates}
            />
          )}

          {currentTab === 'rules' && (
            <RulesView
              rules={rules}
              onCreateRule={handleCreateRule}
              onDeleteRule={handleDeleteRule}
              onExecuteRules={handleExecuteRules}
            />
          )}

          {currentTab === 'attachments' && (
            <AttachmentsView attachments={attachments} />
          )}

          {currentTab === 'plugins' && (
            <PluginsView plugins={plugins} onTogglePlugin={handleTogglePlugin} />
          )}

          {currentTab === 'settings' && (
            <SettingsView account={account} onExportBackup={handleExportBackup} />
          )}
        </main>
      </div>

      {/* Modals */}
      <EmailDetailModal
        email={selectedEmail}
        onClose={() => setSelectedEmail(null)}
        onAction={async (id, action, val) => {
          await handleBulkAction([id], action, val);
        }}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setCurrentTab}
        onSync={handleSync}
        onRunRules={handleExecuteRules}
        onExportBackup={handleExportBackup}
      />
    </div>
  );
};
