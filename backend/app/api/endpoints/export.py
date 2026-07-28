import json
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Email, Rule, Newsletter
from app.services.gmail_service import GmailService

router = APIRouter()

@router.get("/backup")
def export_backup_json(db: Session = Depends(get_db)):
    account = GmailService.seed_mock_data_if_empty(db)
    emails = db.query(Email).filter_by(account_id=account.id).all()
    rules = db.query(Rule).filter_by(account_id=account.id).all()
    newsletters = db.query(Newsletter).filter_by(account_id=account.id).all()

    backup_data = {
        "export_date": account.last_synced_at.isoformat(),
        "account": account.email_address,
        "emails_count": len(emails),
        "rules": [
            {
                "name": r.name,
                "condition_field": r.condition_field,
                "condition_operator": r.condition_operator,
                "condition_value": r.condition_value,
                "action_type": r.action_type,
                "action_value": r.action_value
            } for r in rules
        ],
        "newsletters": [
            {"sender_name": n.sender_name, "sender_email": n.sender_email, "status": n.status} for n in newsletters
        ],
        "emails": [
            {
                "message_id": e.message_id,
                "sender": e.sender,
                "subject": e.subject,
                "category": e.category,
                "date": e.date.isoformat(),
                "is_read": e.is_read
            } for e in emails
        ]
    }

    content = json.dumps(backup_data, indent=2)
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=mailpilot_backup_{account.email_address}.json"}
    )
