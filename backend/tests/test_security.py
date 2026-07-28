from app.core.security import encrypt_token, decrypt_token

def test_fernet_token_encryption_decryption():
    raw_token = "ya29.a0AfB_mock_gmail_oauth_token_12345"
    encrypted = encrypt_token(raw_token)
    assert encrypted != raw_token
    decrypted = decrypt_token(encrypted)
    assert decrypted == raw_token
