from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router
from app.db.session import engine, Base
from app.db.session import SessionLocal
from app.services.gmail_service import GmailService
from app.services.plugin_service import PluginService

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_db_seed():
    db = SessionLocal()
    try:
        GmailService.seed_mock_data_if_empty(db)
        PluginService.initialize_plugins(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "running",
        "docs": "/docs",
        "mode": "Zero-Config Mock Engine Enabled" if settings.USE_MOCK_DATA else "Live Production Engine"
    }

@app.get("/health")
def healthcheck():
    return {"status": "healthy", "service": "mailpilot-ai-backend"}
