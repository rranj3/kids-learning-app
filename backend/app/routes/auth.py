"""
Authentication routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.utils.database import get_db
from app.utils.config import settings

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: str

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Parent login endpoint (Phase 2+)"""
    # Placeholder for Phase 1 - will be implemented in Phase 2
    return {
        "access_token": "dummy_token",
        "token_type": "bearer",
        "user_id": "dummy_id"
    }

@router.post("/signup")
async def signup(request: LoginRequest, db: Session = Depends(get_db)):
    """Parent signup endpoint (Phase 2+)"""
    # Placeholder for Phase 1 - will be implemented in Phase 2
    return {"message": "Signup coming in Phase 2"}

@router.get("/health")
async def auth_health():
    """Health check for auth service"""
    return {"status": "healthy", "service": "auth"}
