import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import Email, CleanupSuggestion, Attachment

class CleanupService:
    """Detects duplicate emails and calculates smart inbox cleanup suggestions."""

    @staticmethod
    def find_duplicates(db: Session, account_id: int) -> List[Dict[str, Any]]:
        emails = db.query(Email).filter_by(account_id=account_id, is_deleted=False).all()
        seen_hashes: Dict[str, Email] = {}
        duplicates: List[Dict[str, Any]] = []

        for e in emails:
            key = f"{e.subject.strip().lower()}_{e.size_bytes}"
            if key in seen_hashes:
                original = seen_hashes[key]
                duplicates.append({
                    "original_id": original.id,
                    "duplicate_id": e.id,
                    "subject": e.subject,
                    "sender": e.sender,
                    "size_bytes": e.size_bytes,
                    "date": e.date.isoformat()
                })
            else:
                seen_hashes[key] = e

        return duplicates

    @staticmethod
    def execute_suggestion(db: Session, suggestion_id: int) -> bool:
        sug = db.query(CleanupSuggestion).filter_by(id=suggestion_id).first()
        if not sug:
            return False

        email_ids = json.loads(sug.email_ids_json) if sug.email_ids_json else []
        if email_ids:
            emails = db.query(Email).filter(Email.id.in_(email_ids)).all()
            for e in emails:
                if sug.suggestion_type == "old_otps" or sug.suggestion_type == "duplicate_emails":
                    e.is_deleted = True
                else:
                    e.is_archived = True

        sug.is_dismissed = True
        db.commit()
        return True
