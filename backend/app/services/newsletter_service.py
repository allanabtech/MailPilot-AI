from sqlalchemy.orm import Session
from app.db.models import Newsletter, Email

class NewsletterService:
    """Manages email subscriptions and triggers 1-click unsubscribes."""

    @staticmethod
    def unsubscribe(db: Session, newsletter_id: int) -> bool:
        nl = db.query(Newsletter).filter_by(id=newsletter_id).first()
        if not nl:
            return False

        # Execute 1-click unsubscribe process
        # In live mode: sends HTTP POST to List-Unsubscribe link or sends mailto
        nl.status = "unsubscribed"
        
        # Also auto-archive existing newsletters from this sender
        emails = db.query(Email).filter(Email.sender.contains(nl.sender_email)).all()
        for e in emails:
            e.is_archived = True

        db.commit()
        return True
