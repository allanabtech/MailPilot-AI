from datetime import datetime
import json
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.db.session import Base

class Account(Base):
    __tablename__ = "accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String(50), default="gmail") # gmail, outlook, yahoo, imap, proton
    email_address = Column(String(255), unique=True, index=True, nullable=False)
    display_name = Column(String(255), nullable=True)
    avatar_url = Column(String(512), nullable=True)
    access_token_encrypted = Column(Text, nullable=True)
    refresh_token_encrypted = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    last_synced_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    emails = relationship("Email", back_populates="account", cascade="all, delete-orphan")
    newsletters = relationship("Newsletter", back_populates="account", cascade="all, delete-orphan")
    rules = relationship("Rule", back_populates="account", cascade="all, delete-orphan")

class Email(Base):
    __tablename__ = "emails"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    message_id = Column(String(255), unique=True, index=True, nullable=False)
    thread_id = Column(String(255), index=True, nullable=True)
    sender = Column(String(255), index=True, nullable=False)
    sender_name = Column(String(255), nullable=True)
    recipient = Column(String(255), nullable=False)
    subject = Column(Text, nullable=False)
    snippet = Column(Text, nullable=True)
    body_text = Column(Text, nullable=True)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    is_read = Column(Boolean, default=False, index=True)
    is_starred = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    
    # Classification & AI
    category = Column(String(50), default="Updates", index=True) # Finance, Work, OTP, Security, Receipts, Subscriptions, GitHub, etc.
    confidence_score = Column(Float, default=0.95)
    spam_score = Column(Float, default=0.0) # 0.0 - 1.0
    phishing_risk = Column(String(20), default="Low") # Low, Medium, High, Critical
    
    # Metadata & Duplicate Detection
    size_bytes = Column(Integer, default=1024)
    has_attachments = Column(Boolean, default=False)
    content_hash = Column(String(64), index=True, nullable=True)
    labels_json = Column(Text, default="[]") # Store list of labels as JSON string
    
    account = relationship("Account", back_populates="emails")
    attachments = relationship("Attachment", back_populates="email", cascade="all, delete-orphan")

class Label(Base):
    __tablename__ = "labels"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    name = Column(String(100), nullable=False)
    color = Column(String(30), default="#6366f1")
    is_system = Column(Boolean, default=False)

class Newsletter(Base):
    __tablename__ = "newsletters"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    sender_email = Column(String(255), nullable=False, index=True)
    sender_name = Column(String(255), nullable=True)
    unsubscribe_link = Column(Text, nullable=True)
    unsubscribe_mailto = Column(Text, nullable=True)
    total_received = Column(Integer, default=1)
    status = Column(String(20), default="active") # active, unsubscribed, pending
    last_received_at = Column(DateTime, default=datetime.utcnow)
    
    account = relationship("Account", back_populates="newsletters")

class Rule(Base):
    __tablename__ = "rules"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    name = Column(String(100), nullable=False)
    condition_field = Column(String(50), nullable=False) # sender, subject, category, age_days
    condition_operator = Column(String(20), nullable=False) # equals, contains, older_than
    condition_value = Column(String(255), nullable=False)
    action_type = Column(String(50), nullable=False) # archive, star, label, delete, move
    action_value = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    trigger_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    account = relationship("Account", back_populates="rules")

class CleanupSuggestion(Base):
    __tablename__ = "cleanup_suggestions"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    suggestion_type = Column(String(50), nullable=False) # inactive_newsletters, old_otps, large_attachments, duplicate_emails
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    potential_savings_mb = Column(Float, default=0.0)
    affected_count = Column(Integer, default=0)
    email_ids_json = Column(Text, default="[]")
    is_dismissed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Attachment(Base):
    __tablename__ = "attachments"
    
    id = Column(Integer, primary_key=True, index=True)
    email_id = Column(Integer, ForeignKey("emails.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=False) # pdf, image/png, zip, etc.
    size_bytes = Column(Integer, default=0)
    file_path = Column(String(512), nullable=True)
    
    email = relationship("Email", back_populates="attachments")

class Plugin(Base):
    __tablename__ = "plugins"
    
    id = Column(Integer, primary_key=True, index=True)
    plugin_id = Column(String(100), unique=True, index=True, nullable=False) # outlook, yahoo, imap, proton
    name = Column(String(100), nullable=False)
    provider = Column(String(50), nullable=False)
    is_enabled = Column(Boolean, default=False)
    settings_json = Column(Text, default="{}")
