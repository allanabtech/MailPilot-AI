from datetime import datetime, timedelta
import random
import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import Account, Email, Label, Newsletter, Attachment, CleanupSuggestion, Rule
from app.services.classifier_service import EmailClassifier
from app.core.security import encrypt_token

class GmailService:
    """Service handling Gmail API sync and Zero-Config Mock Data generation."""

    @staticmethod
    def seed_mock_data_if_empty(db: Session) -> Account:
        """Seeds realistic initial email inbox data for local development/demo."""
        account = db.query(Account).filter_by(email_address="alex.developer@gmail.com").first()
        if account:
            return account

        # Create primary mock account
        account = Account(
            provider="gmail",
            email_address="alex.developer@gmail.com",
            display_name="Alex Rivera",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            access_token_encrypted=encrypt_token("mock-access-token-12345"),
            refresh_token_encrypted=encrypt_token("mock-refresh-token-67890"),
            is_active=True,
            last_synced_at=datetime.utcnow()
        )
        db.add(account)
        db.commit()
        db.refresh(account)

        # Seed Labels
        labels_data = [
            ("Inbox", "#6366f1", True),
            ("Work", "#3b82f6", False),
            ("Finance", "#10b981", False),
            ("Important", "#f59e0b", True),
            ("Newsletters", "#8b5cf6", False),
            ("GitHub", "#000000", False),
            ("Receipts", "#06b6d4", False)
        ]
        for name, color, is_sys in labels_data:
            db.add(Label(account_id=account.id, name=name, color=color, is_system=is_sys))
        db.commit()

        # Seed Default Rules
        rules_data = [
            ("Archive Newsletters", "category", "equals", "Subscriptions", "archive", None),
            ("Star Banking Emails", "category", "equals", "Banking", "star", None),
            ("Label GitHub Notifications", "sender", "contains", "github.com", "label", "GitHub"),
            ("Delete OTPs older than 30 days", "category", "equals", "OTP", "delete", "30_days"),
            ("Move Amazon to Receipts", "sender", "contains", "amazon.com", "category", "Receipts")
        ]
        for name, field, op, val, act_t, act_v in rules_data:
            db.add(Rule(
                account_id=account.id,
                name=name,
                condition_field=field,
                condition_operator=op,
                condition_value=val,
                action_type=act_t,
                action_value=act_v,
                is_active=True,
                trigger_count=random.randint(12, 140)
            ))

        # Seed Newsletters
        newsletters_data = [
            ("TLDR Tech", "dan@tldr.tech", "https://tldr.tech/unsubscribe", None, 48, "active"),
            ("Substack Weekly", "digest@substack.com", "https://substack.com/unsubscribe", "unsubscribe@substack.com", 24, "active"),
            ("Hacker News Daily", "newsletter@hackernews.com", "https://hackernews.com/unsub", None, 110, "active"),
            ("Vercel Changelog", "news@vercel.com", "https://vercel.com/email-preferences", None, 18, "active"),
            ("Medium Daily Digest", "noreply@medium.com", "https://medium.com/unsubscribe", None, 65, "active")
        ]
        for name, email, link, mailto, total, status in newsletters_data:
            db.add(Newsletter(
                account_id=account.id,
                sender_email=email,
                sender_name=name,
                unsubscribe_link=link,
                unsubscribe_mailto=mailto,
                total_received=total,
                status=status
            ))
        db.commit()

        # Seed Emails across categories
        mock_emails = [
            {
                "msg_id": "msg_001",
                "sender": "no-reply@github.com",
                "sender_name": "GitHub Notifications",
                "subject": "[GitHub] Security vulnerability alert for package pyyaml",
                "snippet": "We found a moderate severity security vulnerability in one of your dependencies...",
                "body": "Hi Alex,\n\nWe found a security vulnerability in pyyaml (CVE-2026-1192). Please update your dependencies immediately.\n\nRepository: mailpilot-ai/backend\nSeverity: Moderate\n\nThanks,\nThe GitHub Security Team",
                "days_ago": 0,
                "is_read": False,
                "is_starred": True,
                "size": 4200,
                "labels": ["Inbox", "GitHub", "Important"],
                "attachment": None
            },
            {
                "msg_id": "msg_002",
                "sender": "service@chase.com",
                "sender_name": "Chase Bank",
                "subject": "Your Monthly Credit Card Statement is Available",
                "snippet": "Your Chase Sapphire Preferred statement for July 2026 is ready to view...",
                "body": "Dear Alex Rivera,\n\nYour statement ending in 4821 is now available online. Balance: $1,248.50. Minimum Payment Due: $35.00 by Aug 18, 2026.",
                "days_ago": 1,
                "is_read": True,
                "is_starred": True,
                "size": 15400,
                "labels": ["Inbox", "Finance"],
                "attachment": ("July_2026_Statement.pdf", "application/pdf", 145000)
            },
            {
                "msg_id": "msg_003",
                "sender": "shipment-tracking@amazon.com",
                "sender_name": "Amazon Orders",
                "subject": "Your order #114-892104-991204 has been delivered!",
                "snippet": "Your package containing Keychron K2 Mechanical Keyboard was left near front door...",
                "body": "Order Confirmation & Invoice:\nItems: Keychron K2 Mechanical Keyboard x 1 ($89.99)\nShipping: Free Prime\nTotal: $97.19 paid via Visa ending 4821.",
                "days_ago": 2,
                "is_read": True,
                "is_starred": False,
                "size": 8900,
                "labels": ["Inbox", "Receipts"],
                "attachment": ("Amazon_Receipt_114892.pdf", "application/pdf", 89000)
            },
            {
                "msg_id": "msg_004",
                "sender": "verify@accounts-security-verify.com",
                "sender_name": "Account Security Team",
                "subject": "URGENT: Your Bank Account has been Temporarily Locked!",
                "snippet": "Immediate action required. Please verify your password and credit card details...",
                "body": "Dear Customer,\n\nWe detected suspicious activity. Click here immediately to verify your identity: http://phishing-fake-bank.ru/login or your account will be suspended in 24 hours.",
                "days_ago": 1,
                "is_read": False,
                "is_starred": False,
                "size": 3200,
                "labels": ["Spam"],
                "attachment": None
            },
            {
                "msg_id": "msg_005",
                "sender": "auth@stripe.com",
                "sender_name": "Stripe Auth",
                "subject": "Your Stripe Verification Code is 894-102",
                "snippet": "Use verification code 894-102 to log into your Stripe Dashboard. Valid for 10 minutes...",
                "body": "Verification code: 894-102\n\nIf you did not request this login code, please contact support immediately.",
                "days_ago": 35,
                "is_read": True,
                "is_starred": False,
                "size": 1800,
                "labels": ["Inbox"],
                "attachment": None
            },
            {
                "msg_id": "msg_006",
                "sender": "dan@tldr.tech",
                "sender_name": "TLDR Tech",
                "subject": "TLDR Tech: AI Agent Revolution & Web Assembly Breakthroughs",
                "snippet": "Here are today's top tech stories: OpenAI releases new model, WebAssembly 3.0 draft...",
                "body": "TLDR Tech Daily Digest\n\n1. AI Agent Ecosystem Advances\n2. Next-gen TypeScript compiler preview\n\nUnsubscribe: https://tldr.tech/unsubscribe",
                "days_ago": 3,
                "is_read": False,
                "is_starred": False,
                "size": 28400,
                "labels": ["Inbox", "Newsletters"],
                "attachment": None
            },
            {
                "msg_id": "msg_007",
                "sender": "sarah.manager@company.com",
                "sender_name": "Sarah Jenkins",
                "subject": "Q3 Product Roadmap & Engineering Sprint Alignment",
                "snippet": "Hi Alex, let's review the upcoming Q3 sprint goals during tomorrow's sync...",
                "body": "Hi Alex,\n\nPlease review the attached slide deck before our meeting tomorrow at 10 AM. We'll discuss backend architecture and MailPilot AI milestone release.",
                "days_ago": 4,
                "is_read": True,
                "is_starred": False,
                "size": 45000,
                "labels": ["Inbox", "Work"],
                "attachment": ("Q3_Engineering_Roadmap.pdf", "application/pdf", 1250000)
            },
            {
                "msg_id": "msg_008",
                "sender": "no-reply@github.com",
                "sender_name": "GitHub Notifications",
                "subject": "[GitHub] Duplicate notification: Security vulnerability alert for package pyyaml",
                "snippet": "We found a moderate severity security vulnerability in one of your dependencies...",
                "body": "Hi Alex,\n\nWe found a security vulnerability in pyyaml (CVE-2026-1192). Please update your dependencies immediately.\n\nRepository: mailpilot-ai/backend\nSeverity: Moderate\n\nThanks,\nThe GitHub Security Team",
                "days_ago": 0,
                "is_read": False,
                "is_starred": False,
                "size": 4200,
                "labels": ["Inbox", "GitHub"],
                "attachment": None
            }
        ]

        for item in mock_emails:
            cat, conf, spam_s, phish_r = EmailClassifier.classify(item["sender"], item["subject"], item["body"])
            email_date = datetime.utcnow() - timedelta(days=item["days_ago"])
            
            email_obj = Email(
                account_id=account.id,
                message_id=item["msg_id"],
                thread_id=f"thread_{item['msg_id']}",
                sender=item["sender"],
                sender_name=item["sender_name"],
                recipient="alex.developer@gmail.com",
                subject=item["subject"],
                snippet=item["snippet"],
                body_text=item["body"],
                date=email_date,
                is_read=item["is_read"],
                is_starred=item["is_starred"],
                category=cat,
                confidence_score=conf,
                spam_score=spam_s,
                phishing_risk=phish_r,
                size_bytes=item["size"],
                has_attachments=item["attachment"] is not None,
                content_hash=f"hash_{hash(item['subject'] + item['body'])}",
                labels_json=json.dumps(item["labels"])
            )
            db.add(email_obj)
            db.commit()
            db.refresh(email_obj)

            if item["attachment"]:
                fname, ctype, fsize = item["attachment"]
                db.add(Attachment(
                    email_id=email_obj.id,
                    filename=fname,
                    content_type=ctype,
                    size_bytes=fsize,
                    file_path=f"/downloads/{fname}"
                ))
        db.commit()

        # Seed Cleanup Suggestions
        suggestions = [
            CleanupSuggestion(
                account_id=account.id,
                suggestion_type="inactive_newsletters",
                title="Unsubscribe from 3 Inactive Newsletters",
                description="You haven't opened emails from Hacker News Daily or Medium in over 30 days.",
                potential_savings_mb=14.5,
                affected_count=3,
                email_ids_json=json.dumps([6]),
                is_dismissed=False
            ),
            CleanupSuggestion(
                account_id=account.id,
                suggestion_type="old_otps",
                title="Delete 1 expired OTP verification code",
                description="Verification code from Stripe is over 30 days old and safe to remove.",
                potential_savings_mb=0.2,
                affected_count=1,
                email_ids_json=json.dumps([5]),
                is_dismissed=False
            ),
            CleanupSuggestion(
                account_id=account.id,
                suggestion_type="duplicate_emails",
                title="Remove 1 duplicate email notification",
                description="Identical GitHub vulnerability alert detected twice in your inbox.",
                potential_savings_mb=0.8,
                affected_count=1,
                email_ids_json=json.dumps([8]),
                is_dismissed=False
            )
        ]
        for sug in suggestions:
            db.add(sug)
        db.commit()

        return account
