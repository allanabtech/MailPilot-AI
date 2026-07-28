from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Plugin
from app.schemas.schemas import PluginSchema
from app.services.plugin_service import PluginService

router = APIRouter()

@router.get("", response_model=List[PluginSchema])
def list_plugins(db: Session = Depends(get_db)):
    PluginService.initialize_plugins(db)
    return db.query(Plugin).all()

@router.post("/{plugin_id}/toggle")
def toggle_plugin(plugin_id: str, enable: bool, db: Session = Depends(get_db)):
    success = PluginService.toggle_plugin(db, plugin_id, enable)
    if not success:
        raise HTTPException(status_code=404, detail="Plugin not found")
    return {"status": "success", "plugin_id": plugin_id, "is_enabled": enable}
