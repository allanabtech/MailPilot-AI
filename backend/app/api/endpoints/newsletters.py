from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Newsletter
from app.schemas.schemas import NewsletterSchema
from app.services.newsletter_service import NewsletterService
from app.services.gmail_service import GmailService

router = APIRouter()

@router.get("", response_model=List[NewsletterSchema])
def list_newsletters(db: Session = Depends(get_db)):
    account = GmailService.seed_mock_data_if_empty(db)
    return db.query(Newsletter).filter_by(account_id=account.id).order_by(Newsletter.total_received.desc()).all()

@router.post("/{newsletter_id}/unsubscribe")
def unsubscribe_newsletter(newsletter_id: int, db: Session = Depends(get_db)):
    success = NewsletterService.unsubscribe(db, newsletter_id)
    if not success:
        raise HTTPException(status_code=404, detail="Newsletter not found")
    return {"status": "unsubscribed", "newsletter_id": newsletter_id}
