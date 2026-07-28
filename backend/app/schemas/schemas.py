from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr

# Account Schemas
class AccountBase(BaseModel):
    email_address: str
    display_name: Optional[str] = None
    provider: str = "gmail"
    avatar_url: Optional[str] = None

class AccountCreate(AccountBase):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None

class AccountSchema(AccountBase):
    id: int
    is_active: bool
    last_synced_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

# Email Schemas
class AttachmentSchema(BaseModel):
    id: int
    email_id: int
    filename: str
    content_type: str
    size_bytes: int
    file_path: Optional[str] = None

    class Config:
        from_attributes = True

class EmailSchema(BaseModel):
    id: int
    account_id: int
    message_id: str
    thread_id: Optional[str] = None
    sender: str
    sender_name: Optional[str] = None
    recipient: str
    subject: str
    snippet: Optional[str] = None
    body_text: Optional[str] = None
    date: datetime
    is_read: bool
    is_starred: bool
    is_archived: bool
    is_deleted: bool
    category: str
    confidence_score: float
    spam_score: float
    phishing_risk: str
    size_bytes: int
    has_attachments: bool
    labels_json: str
    attachments: List[AttachmentSchema] = []

    class Config:
        from_attributes = True

class EmailBulkAction(BaseModel):
    email_ids: List[int]
    action: str # archive, delete, mark_read, mark_unread, star, unstar, apply_label, move_category
    value: Optional[str] = None

# Newsletter Schema
class NewsletterSchema(BaseModel):
    id: int
    account_id: int
    sender_email: str
    sender_name: Optional[str] = None
    unsubscribe_link: Optional[str] = None
    unsubscribe_mailto: Optional[str] = None
    total_received: int
    status: str
    last_received_at: datetime

    class Config:
        from_attributes = True

# Rule Schema
class RuleCreate(BaseModel):
    name: str
    condition_field: str # sender, subject, category, age_days
    condition_operator: str # equals, contains, older_than
    condition_value: str
    action_type: str # archive, star, label, delete
    action_value: Optional[str] = None
    is_active: bool = True

class RuleSchema(RuleCreate):
    id: int
    account_id: int
    trigger_count: int
    created_at: datetime

    class Config:
        from_attributes = True

# Cleanup Suggestion Schema
class CleanupSuggestionSchema(BaseModel):
    id: int
    account_id: int
    suggestion_type: str
    title: str
    description: str
    potential_savings_mb: float
    affected_count: int
    email_ids_json: str
    is_dismissed: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Analytics Schema
class TopSender(BaseModel):
    sender: str
    count: int

class CategoryCount(BaseModel):
    category: str
    count: int

class AnalyticsSchema(BaseModel):
    total_emails: int
    unread_count: int
    spam_phishing_count: int
    storage_used_mb: float
    newsletters_count: int
    active_rules_count: int
    clean_inbox_score: int # 0 to 100
    category_distribution: List[CategoryCount]
    top_senders: List[TopSender]
    email_volume_by_day: List[Dict[str, Any]]
    storage_breakdown: Dict[str, float]

# Plugin Schema
class PluginSchema(BaseModel):
    id: int
    plugin_id: str
    name: str
    provider: str
    is_enabled: bool
    settings_json: str

    class Config:
        from_attributes = True
