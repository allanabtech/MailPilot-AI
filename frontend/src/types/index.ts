export interface Account {
  id: number;
  email_address: string;
  display_name?: string;
  provider: string;
  avatar_url?: string;
  is_active: boolean;
  last_synced_at: string;
  created_at: string;
}

export interface Attachment {
  id: number;
  email_id: number;
  filename: string;
  content_type: string;
  size_bytes: number;
  file_path?: string;
}

export interface Email {
  id: number;
  account_id: number;
  message_id: string;
  thread_id?: string;
  sender: string;
  sender_name?: string;
  recipient: string;
  subject: string;
  snippet?: string;
  body_text?: string;
  date: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  is_deleted: boolean;
  category: string;
  confidence_score: number;
  spam_score: number;
  phishing_risk: 'Low' | 'Medium' | 'High' | 'Critical';
  size_bytes: number;
  has_attachments: boolean;
  labels_json: string;
  attachments: Attachment[];
}

export interface Newsletter {
  id: number;
  account_id: number;
  sender_email: string;
  sender_name?: string;
  unsubscribe_link?: string;
  unsubscribe_mailto?: string;
  total_received: number;
  status: 'active' | 'unsubscribed' | 'pending';
  last_received_at: string;
}

export interface Rule {
  id: number;
  account_id: number;
  name: string;
  condition_field: string;
  condition_operator: string;
  condition_value: string;
  action_type: string;
  action_value?: string;
  is_active: boolean;
  trigger_count: number;
  created_at: string;
}

export interface CleanupSuggestion {
  id: number;
  account_id: number;
  suggestion_type: string;
  title: string;
  description: string;
  potential_savings_mb: number;
  affected_count: number;
  email_ids_json: string;
  is_dismissed: boolean;
  created_at: string;
}

export interface AnalyticsData {
  total_emails: number;
  unread_count: number;
  spam_phishing_count: number;
  storage_used_mb: number;
  newsletters_count: number;
  active_rules_count: number;
  clean_inbox_score: number;
  category_distribution: { category: string; count: number }[];
  top_senders: { sender: string; count: number }[];
  email_volume_by_day: { day: string; received: number; cleaned: number }[];
  storage_breakdown: { email_bodies_mb: number; attachments_mb: number };
}

export interface PluginItem {
  id: number;
  plugin_id: string;
  name: string;
  provider: string;
  is_enabled: boolean;
  settings_json: string;
}
