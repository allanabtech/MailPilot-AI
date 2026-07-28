from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Attachment, Email
from app.schemas.schemas import AttachmentSchema
from app.services.gmail_service import GmailService

router = APIRouter()

@router.get("", response_model=List[AttachmentSchema])
def list_attachments(
    content_type: str = None,
    min_size_mb: float = 0.0,
    db: Session = Depends(get_db)
):
    account = GmailService.seed_mock_data_if_empty(db)
    query = db.query(Attachment).join(Email).filter(Email.account_id == account.id)

    if content_type:
        query = query.filter(Attachment.content_type.ilike(f"%{content_type}%"))
    if min_size_mb > 0:
        min_bytes = int(min_size_mb * 1024 * 1024)
        query = query.filter(Attachment.size_bytes >= min_bytes)

    return query.order_by(Attachment.size_bytes.desc()).all()
