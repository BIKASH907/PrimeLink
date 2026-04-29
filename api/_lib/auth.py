"""
Authentication & role-based access control.

Two SEPARATE login surfaces:
  /api/admin/auth/login     -> Super Admin + Admin only
  /api/subadmin/auth/login  -> Sub-Admin only

Both issue JWTs but with different `aud` (audience) claims so a sub-admin token
cannot be used on admin routes and vice-versa.
"""
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import User, Role


pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Two token schemes pointing at the two login URLs
admin_oauth    = OAuth2PasswordBearer(tokenUrl="/api/admin/auth/login")
subadmin_oauth = OAuth2PasswordBearer(tokenUrl="/api/subadmin/auth/login")

ADMIN_AUD    = "bhat-admin"
SUBADMIN_AUD = "bhat-subadmin"


# ----- password helpers -----
def hash_password(pw: str) -> str:    return pwd_ctx.hash(pw)
def verify_password(pw, h) -> bool:   return pwd_ctx.verify(pw, h)


# ----- token issuance -----
def create_token(user: User, audience: str) -> str:
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role.value,
        "aud": audience,
        "exp": datetime.utcnow() + timedelta(hours=settings.JWT_HOURS),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


# ----- decoding helpers -----
def _decode(token: str, audience: str) -> dict:
    try:
        return jwt.decode(token, settings.JWT_SECRET,
                          algorithms=["HS256"], audience=audience)
    except JWTError as e:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"Invalid token: {e}")


def _user_from_token(token: str, audience: str, db: Session) -> User:
    payload = _decode(token, audience)
    user = db.query(User).get(int(payload["sub"]))
    if not user or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found or disabled")
    return user


# ===== Dependencies for ADMIN surface =====
def current_admin(token: str = Depends(admin_oauth),
                  db: Session = Depends(get_db)) -> User:
    user = _user_from_token(token, ADMIN_AUD, db)
    if user.role not in (Role.SUPER_ADMIN, Role.ADMIN, Role.VIEWER):
        raise HTTPException(403, "Admin access required")
    return user


def require_super_admin(user: User = Depends(current_admin)) -> User:
    if user.role != Role.SUPER_ADMIN:
        raise HTTPException(403, "Super-Admin only")
    return user


def require_admin_or_super(user: User = Depends(current_admin)) -> User:
    if user.role not in (Role.SUPER_ADMIN, Role.ADMIN):
        raise HTTPException(403, "Admin / Super-Admin only")
    return user


# ===== Dependencies for SUB-ADMIN surface =====
def current_subadmin(token: str = Depends(subadmin_oauth),
                     db: Session = Depends(get_db)) -> User:
    user = _user_from_token(token, SUBADMIN_AUD, db)
    if user.role != Role.SUB_ADMIN:
        raise HTTPException(403, "Sub-Admin access required")
    return user
