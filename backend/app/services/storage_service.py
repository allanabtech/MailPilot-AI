from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.models import Email, Attachment, Newsletter, Rule, CleanupSuggestion

class StorageService:
    """Provides storage breakdown analytics and attachment metrics."""

    @staticmethod
    def get_analytics(db: Session, account_id: int) -> Dict[str, Any]:
        total_emails = db.query(Email).filter_by(account_id=account_id, is_deleted=False).count()
        unread_count = db.query(Email).filter_by(account_id=account_id, is_deleted=False, is_read=False).count()
        spam_count = db.query(Email).filter(Email.account_id == account_id, Email.category == "Spam", Email.is_deleted == False).count()
        
        # Calculate total storage in MB
        total_bytes = db.query(func.sum(Email.size_bytes)).filter_by(account_id=account_id, is_deleted=False).scalar() or 0
        attachment_bytes = db.query(func.sum(Attachment.size_bytes)).join(Email).filter(Email.account_id == account_id).scalar() or 0
        
        storage_used_mb = round((total_bytes + attachment_bytes) / (1024 * 1024), 2)
        
        newsletters_count = db.query(Newsletter).filter_by(account_id=account_id).count()
        active_rules_count = db.query(Rule).filter_by(account_id=account_id, is_active=True).count()
        
        # Calculate Clean Inbox Score (100 - spam penalty - unread penalty)
        score = max(10, 100 - (spam_count * 15) - (unread_count * 2))

        # Category distribution
        categories_query = db.query(Email.category, func.count(Email.id)).filter_by(account_id=account_id, is_deleted=False).group_by(Email.category).all()
        cat_dist = [{"category": cat, "count": count} for cat, count in categories_query]

        # Top senders
        top_senders_query = db.query(Email.sender, func.count(Email.id)).filter_by(account_id=account_id, is_deleted=False).group_by(Email.sender).order_by(func.count(Email.id).desc()).limit(5).all()
        top_senders = [{"sender": s, "count": c} for s, c in top_senders_query]

        # Mock daily volume chart data
        daily_volume = [
            {"day": "Mon", "received": 24, "cleaned": 18},
            {"day": "Tue", "received": 35, "cleaned": 29},
            {"day": "Wed", "received": 19, "cleaned": 15},
            {"day": "Thu", "received": 42, "cleaned": 38},
            {"day": "Fri", "received": 31, "cleaned": 27},
            {"day": "Sat", "received": 12, "cleaned": 10},
            {"day": "Sun", "received": 8, "cleaned": 8}
        ]

        return {
            "total_emails": total_emails,
            "unread_count": unread_count,
            "spam_phishing_count": spam_count,
            "storage_used_mb": storage_used_mb,
            "newsletters_count": newsletters_count,
            "active_rules_count": active_rules_count,
            "clean_inbox_score": score,
            "category_distribution": cat_dist,
            "top_senders": top_senders,
            "email_volume_by_day": daily_volume,
            "storage_breakdown": {
                "email_bodies_mb": round(total_bytes / (1024 * 1024), 2),
                "attachments_mb": round(attachment_bytes / (1024 * 1024), 2)
            }
        }
