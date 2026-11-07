import pytest
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import engine
from app.database.base import Base
from app.core.ssrf import validate_outbound_url, SSRFSecurityError

# Ensure tables exist
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_auth_registration_and_login():
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    password = "SuperSecurePassword123!"

    # 1. Register
    reg_resp = client.post("/api/auth/register", json={"email": email, "password": password})
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    assert "access_token" in data
    assert data["email"] == email
    token = data["access_token"]

    # 2. Duplicate registration rejected
    dup_resp = client.post("/api/auth/register", json={"email": email, "password": password})
    assert dup_resp.status_code == 400

    # 3. Login
    login_resp = client.post("/api/auth/login", json={"email": email, "password": password})
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()

    # 4. Bad password rejected
    bad_resp = client.post("/api/auth/login", json={"email": email, "password": "wrongpassword"})
    assert bad_resp.status_code == 401

    # 5. Protected profile route
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == email

def test_ssrf_protection_blocks_private_and_metadata_targets():
    # Loopback IP
    with pytest.raises(SSRFSecurityError):
        validate_outbound_url("http://127.0.0.1:8000/api")

    # Localhost keyword
    with pytest.raises(SSRFSecurityError):
        validate_outbound_url("http://localhost:8080/metrics")

    # AWS metadata endpoint
    with pytest.raises(SSRFSecurityError):
        validate_outbound_url("http://169.254.169.254/latest/meta-data/")

def test_ssrf_protection_allows_valid_public_domain():
    is_valid, host = validate_outbound_url("https://api.github.com/zen")
    assert is_valid is True
    assert host == "api.github.com"
