from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import CleanupSuggestion
from app.schemas.schemas import CleanupSuggestionSchema
from app.services.cleanup_service import CleanupService
from app.services.gmail_service import GmailService

router = APIRouter()

@router.get("/suggestions", response_model=List[CleanupSuggestionSchema])
def get_cleanup_suggestions(db: Session = Depends(get_db)):
    account = GmailService.seed_mock_data_if_empty(db)
    return db.query(CleanupSuggestion).filter_by(account_id=account.id, is_dismissed=False).all()

@router.post("/suggestions/{suggestion_id}/apply")
def apply_cleanup_suggestion(suggestion_id: int, db: Session = Depends(get_db)):
    success = CleanupService.execute_suggestion(db, suggestion_id)
    if not success:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    return {"status": "applied", "suggestion_id": suggestion_id}

@router.get("/duplicates")
def get_duplicate_emails(db: Session = Depends(get_db)):
    account = GmailService.seed_mock_data_if_empty(db)
    duplicates = CleanupService.find_duplicates(db, account.id)
    return {"duplicates": duplicates, "count": len(duplicates)}
