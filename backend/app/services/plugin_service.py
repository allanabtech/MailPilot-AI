from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import Plugin

DEFAULT_PLUGINS = [
    {
        "plugin_id": "gmail",
        "name": "Gmail Connector Engine",
        "provider": "Google",
        "is_enabled": True,
        "settings_json": '{"oauth_scope": "https://mail.google.com/", "auto_sync": true}'
    },
    {
        "plugin_id": "outlook",
        "name": "Microsoft Outlook Plugin",
        "provider": "Microsoft Graph",
        "is_enabled": False,
        "settings_json": '{"tenant_id": "common", "auto_sync": false}'
    },
    {
        "plugin_id": "yahoo",
        "name": "Yahoo Mail Adapter",
        "provider": "Yahoo OAuth2",
        "is_enabled": False,
        "settings_json": '{"app_id": "", "auto_sync": false}'
    },
    {
        "plugin_id": "imap",
        "name": "Generic IMAP / SMTP Sync",
        "provider": "Custom IMAP",
        "is_enabled": False,
        "settings_json": '{"imap_host": "imap.example.com", "port": 993, "use_ssl": true}'
    },
    {
        "plugin_id": "proton",
        "name": "Proton Mail Bridge Extension",
        "provider": "Proton Bridge",
        "is_enabled": False,
        "settings_json": '{"bridge_port": 1143, "auto_sync": false}'
    }
]

class PluginService:
    """Manages system integration plugins for multi-provider support."""

    @staticmethod
    def initialize_plugins(db: Session):
        for plug_def in DEFAULT_PLUGINS:
            existing = db.query(Plugin).filter_by(plugin_id=plug_def["plugin_id"]).first()
            if not existing:
                db.add(Plugin(**plug_def))
        db.commit()

    @staticmethod
    def toggle_plugin(db: Session, plugin_id: str, enable: bool) -> bool:
        plug = db.query(Plugin).filter_by(plugin_id=plugin_id).first()
        if not plug:
            return False
        plug.is_enabled = enable
        db.commit()
        return True
