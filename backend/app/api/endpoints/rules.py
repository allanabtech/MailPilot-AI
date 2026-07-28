from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Rule
from app.schemas.schemas import RuleSchema, RuleCreate
from app.services.gmail_service import GmailService
from app.services.rules_service import RulesEngine

router = APIRouter()

@router.get("", response_model=List[RuleSchema])
def list_rules(db: Session = Depends(get_db)):
    account = GmailService.seed_mock_data_if_empty(db)
    return db.query(Rule).filter_by(account_id=account.id).order_by(Rule.created_at.desc()).all()

@router.post("", response_model=RuleSchema)
def create_rule(payload: RuleCreate, db: Session = Depends(get_db)):
    account = GmailService.seed_mock_data_if_empty(db)
    rule = Rule(
        account_id=account.id,
        name=payload.name,
        condition_field=payload.condition_field,
        condition_operator=payload.condition_operator,
        condition_value=payload.condition_value,
        action_type=payload.action_type,
        action_value=payload.action_value,
        is_active=payload.is_active
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule

@router.delete("/{rule_id}")
def delete_rule(rule_id: int, db: Session = Depends(get_db)):
    rule = db.query(Rule).filter_by(id=rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    db.delete(rule)
    db.commit()
    return {"status": "deleted", "rule_id": rule_id}

@router.post("/execute")
def execute_rules(db: Session = Depends(get_db)):
    account = GmailService.seed_mock_data_if_empty(db)
    count = RulesEngine.evaluate_rules_for_account(db, account.id)
    return {"status": "executed", "rules_triggered": count}
