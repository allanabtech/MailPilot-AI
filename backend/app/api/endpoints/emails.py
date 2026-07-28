import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Email
from app.schemas.schemas import EmailSchema, EmailBulkAction
from app.services.gmail_service import GmailService
from app.services.rules_service import RulesEngine

router = APIRouter()

@router.get("", response_model=List[EmailSchema])
def list_emails(
    category: Optional[str] = None,
    search: Optional[str] = None,
    is_read: Optional[bool] = None,
    is_starred: Optional[bool] = None,
    is_archived: bool = False,
    is_deleted: bool = False,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    account = GmailService.seed_mock_data_if_empty(db)
    query = db.query(Email).filter_by(account_id=account.id, is_archived=is_archived, is_deleted=is_deleted)

    if category:
        query = query.filter(Email.category == category)
    if is_read is not None:
        query = query.filter(Email.is_read == is_read)
    if is_starred is not None:
        query = query.filter(Email.is_starred == is_starred)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Email.subject.ilike(search_fmt)) |
            (Email.sender.ilike(search_fmt)) |
            (Email.body_text.ilike(search_fmt))
        )

    emails = query.order_by(Email.date.desc()).offset(offset).limit(limit).all()
    return emails

@router.get("/{email_id}", response_model=EmailSchema)
def get_email(email_id: int, db: Session = Depends(get_db)):
    email = db.query(Email).filter_by(id=email_id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    return email

@router.post("/bulk")
def bulk_email_action(payload: EmailBulkAction, db: Session = Depends(get_db)):
    emails = db.query(Email).filter(Email.id.in_(payload.email_ids)).all()
    if not emails:
        raise HTTPException(status_code=404, detail="No matching emails found")

    count = 0
    for email in emails:
        if payload.action == "archive":
            email.is_archived = True
        elif payload.action == "unarchive":
            email.is_archived = False
        elif payload.action == "delete":
            email.is_deleted = True
        elif payload.action == "mark_read":
            email.is_read = True
        elif payload.action == "mark_unread":
            email.is_read = False
        elif payload.action == "star":
            email.is_starred = True
        elif payload.action == "unstar":
            email.is_starred = False
        elif payload.action == "move_category" and payload.value:
            email.category = payload.value
        elif payload.action == "apply_label" and payload.value:
            labels = json.loads(email.labels_json) if email.labels_json else []
            if payload.value not in labels:
                labels.append(payload.value)
                email.labels_json = json.dumps(labels)
        count += 1

    db.commit()
    return {"status": "success", "affected_count": count, "action": payload.action}

@router.post("/sync")
def sync_emails(db: Session = Depends(get_db)):
    account = GmailService.seed_mock_data_if_empty(db)
    triggered_rules = RulesEngine.evaluate_rules_for_account(db, account.id)
    return {"status": "synced", "account": account.email_address, "rules_triggered": triggered_rules}
