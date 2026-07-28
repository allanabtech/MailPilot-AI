import pytest

try:
    from fastapi.testclient import TestClient
    from app.main import app
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False

@pytest.mark.skipif(not HAS_FASTAPI, reason="FastAPI not installed in local environment")
def test_health_endpoint():
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

@pytest.mark.skipif(not HAS_FASTAPI, reason="FastAPI not installed in local environment")
def test_list_accounts():
    client = TestClient(app)
    response = client.get("/api/v1/auth/accounts")
    assert response.status_code == 200
    assert len(response.json()) > 0
