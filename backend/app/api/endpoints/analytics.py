from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import AnalyticsSchema
from app.services.storage_service import StorageService
from app.services.gmail_service import GmailService

router = APIRouter()

@router.get("", response_model=AnalyticsSchema)
def get_analytics(db: Session = Depends(get_db)):
    account = GmailService.seed_mock_data_if_empty(db)
    return StorageService.get_analytics(db, account.id)
