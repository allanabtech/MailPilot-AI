from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.db.models import Account
from app.schemas.schemas import AccountSchema, AccountCreate
from app.services.gmail_service import GmailService
from app.core.config import settings

router = APIRouter()

@router.get("/accounts", response_model=List[AccountSchema])
def get_accounts(db: Session = Depends(get_db)):
    # Initialize mock data if empty
    GmailService.seed_mock_data_if_empty(db)
    return db.query(Account).all()

@router.get("/current-account", response_model=AccountSchema)
def get_current_account(db: Session = Depends(get_db)):
    account = GmailService.seed_mock_data_if_empty(db)
    return account

@router.get("/oauth/login-url")
def get_google_oauth_login_url():
    """Generates live Google OAuth URL or returns mock status."""
    if not settings.GMAIL_CLIENT_ID:
        return {
            "mode": "mock",
            "message": "Running in Zero-Config Mock Engine mode. No GCP Client ID required.",
            "auth_url": "/oauth/callback?code=mock_authorization_code"
        }
    
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GMAIL_CLIENT_ID}&"
        f"redirect_uri={settings.GMAIL_REDIRECT_URI}&"
        f"response_type=code&"
        f"scope=https://mail.google.com/&"
        f"access_type=offline&prompt=consent"
    )
    return {"mode": "live", "auth_url": auth_url}
