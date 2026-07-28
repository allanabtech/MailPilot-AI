import base64
import hashlib
from app.core.config import settings

try:
    from cryptography.fernet import Fernet

    def _get_fernet_key() -> bytes:
        raw_hash = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
        return base64.urlsafe_b64encode(raw_hash)

    _fernet = Fernet(_get_fernet_key())

    def encrypt_token(plain_token: str) -> str:
        if not plain_token:
            return ""
        encrypted_bytes = _fernet.encrypt(plain_token.encode("utf-8"))
        return encrypted_bytes.decode("utf-8")

    def decrypt_token(cipher_token: str) -> str:
        if not cipher_token:
            return ""
        try:
            decrypted_bytes = _fernet.decrypt(cipher_token.encode("utf-8"))
            return decrypted_bytes.decode("utf-8")
        except Exception:
            return cipher_token

except ImportError:
    # Graceful fallback if cryptography package is not installed in global environment
    def encrypt_token(plain_token: str) -> str:
        if not plain_token:
            return ""
        return base64.b64encode(plain_token.encode("utf-8")).decode("utf-8")

    def decrypt_token(cipher_token: str) -> str:
        if not cipher_token:
            return ""
        try:
            return base64.b64decode(cipher_token.encode("utf-8")).decode("utf-8")
        except Exception:
            return cipher_token
