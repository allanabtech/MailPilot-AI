from fastapi import APIRouter
from app.api.endpoints import auth, emails, newsletters, rules, cleanup, attachments, analytics, plugins, export

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth & Accounts"])
api_router.include_router(emails.router, prefix="/emails", tags=["Email Engine"])
api_router.include_router(newsletters.router, prefix="/newsletters", tags=["Newsletter Manager"])
api_router.include_router(rules.router, prefix="/rules", tags=["Automation Rules"])
api_router.include_router(cleanup.router, prefix="/cleanup", tags=["Smart Cleanup"])
api_router.include_router(attachments.router, prefix="/attachments", tags=["Attachment Manager"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics Dashboard"])
api_router.include_router(plugins.router, prefix="/plugins", tags=["Plugin System"])
api_router.include_router(export.router, prefix="/export", tags=["Backup & Export"])
