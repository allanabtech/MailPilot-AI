import axios from 'axios';
import {
  Account,
  Email,
  Newsletter,
  Rule,
  CleanupSuggestion,
  AnalyticsData,
  Attachment,
  PluginItem
} from '../types';

const API_BASE = '/api/v1';

export const api = {
  // Accounts & Auth
  getAccounts: async (): Promise<Account[]> => {
    const res = await axios.get(`${API_BASE}/auth/accounts`);
    return res.data;
  },
  getCurrentAccount: async (): Promise<Account> => {
    const res = await axios.get(`${API_BASE}/auth/current-account`);
    return res.data;
  },
  getOAuthLoginUrl: async () => {
    const res = await axios.get(`${API_BASE}/auth/oauth/login-url`);
    return res.data;
  },

  // Emails
  getEmails: async (params?: {
    category?: string;
    search?: string;
    is_read?: boolean;
    is_starred?: boolean;
    is_archived?: boolean;
    is_deleted?: boolean;
    limit?: number;
  }): Promise<Email[]> => {
    const res = await axios.get(`${API_BASE}/emails`, { params });
    return res.data;
  },
  getEmailById: async (id: number): Promise<Email> => {
    const res = await axios.get(`${API_BASE}/emails/${id}`);
    return res.data;
  },
  executeBulkAction: async (payload: {
    email_ids: number[];
    action: string;
    value?: string;
  }) => {
    const res = await axios.post(`${API_BASE}/emails/bulk`, payload);
    return res.data;
  },
  triggerSync: async () => {
    const res = await axios.post(`${API_BASE}/emails/sync`);
    return res.data;
  },

  // Newsletters
  getNewsletters: async (): Promise<Newsletter[]> => {
    const res = await axios.get(`${API_BASE}/newsletters`);
    return res.data;
  },
  unsubscribeNewsletter: async (id: number) => {
    const res = await axios.post(`${API_BASE}/newsletters/${id}/unsubscribe`);
    return res.data;
  },

  // Rules
  getRules: async (): Promise<Rule[]> => {
    const res = await axios.get(`${API_BASE}/rules`);
    return res.data;
  },
  createRule: async (rule: {
    name: string;
    condition_field: string;
    condition_operator: string;
    condition_value: string;
    action_type: string;
    action_value?: string;
  }): Promise<Rule> => {
    const res = await axios.post(`${API_BASE}/rules`, rule);
    return res.data;
  },
  deleteRule: async (id: number) => {
    const res = await axios.delete(`${API_BASE}/rules/${id}`);
    return res.data;
  },
  executeRules: async () => {
    const res = await axios.post(`${API_BASE}/rules/execute`);
    return res.data;
  },

  // Cleanup
  getCleanupSuggestions: async (): Promise<CleanupSuggestion[]> => {
    const res = await axios.get(`${API_BASE}/cleanup/suggestions`);
    return res.data;
  },
  applyCleanupSuggestion: async (id: number) => {
    const res = await axios.post(`${API_BASE}/cleanup/suggestions/${id}/apply`);
    return res.data;
  },
  getDuplicates: async () => {
    const res = await axios.get(`${API_BASE}/cleanup/duplicates`);
    return res.data;
  },

  // Attachments
  getAttachments: async (params?: { content_type?: string; min_size_mb?: number }): Promise<Attachment[]> => {
    const res = await axios.get(`${API_BASE}/attachments`, { params });
    return res.data;
  },

  // Analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    const res = await axios.get(`${API_BASE}/analytics`);
    return res.data;
  },

  // Plugins
  getPlugins: async (): Promise<PluginItem[]> => {
    const res = await axios.get(`${API_BASE}/plugins`);
    return res.data;
  },
  togglePlugin: async (pluginId: string, enable: boolean) => {
    const res = await axios.post(`${API_BASE}/plugins/${pluginId}/toggle`, null, { params: { enable } });
    return res.data;
  },

  // Export
  exportBackupUrl: `${API_BASE}/export/backup`
};
