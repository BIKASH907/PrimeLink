"""
Two distinct routers for the two login surfaces.

/api/admin/auth/login     -> SUPER_ADMIN, ADMIN, VIEWER
/api/subadmin/auth/login  -> SUB_ADMIN only

Each issues a JWT with a different audience claim, so tokens cannot be
reused across surfaces.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from models import User, Role
from auth import (
    verify_password, create_token,
    ADMIN_AUD, SUBADMIN_AUD,
    current_admin, current_subadmin,
)

admin_router    = APIRouter()
subadmin_router = APIRouter()


# ---------- ADMIN / SUPER ADMIN LOGIN ----------
@admin_router.post("/login")
def admin_login(form: OAuth2PasswordRequestForm = Depends(),
                db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    if user.role not in (Role.SUPER_ADMIN, Role.ADMIN, Role.VIEWER):
        raise HTTPException(403, "Use the Sub-Admin portal instead")

    user.last_login_at = datetime.utcnow()
    db.commit()
    return {
        "access_token": create_token(user, ADMIN_AUD),
        "token_type":   "bearer",
        "role":         user.role.value,
        "name":         user.full_name,
    }


@admin_router.get("/me")
def admin_me(user: User = Depends(current_admin)):
    return {"id": user.id, "email": user.email, "role": user.role.value, "name": user.full_name}


# ---------- SUB-ADMIN LOGIN (separate portal) ----------
@subadmin_router.post("/login")
def subadmin_login(form: OAuth2PasswordRequestForm = Depends(),
                   db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    if user.role != Role.SUB_ADMIN:
        raise HTTPException(403, "Use the Admin portal instead")

    user.last_login_at = datetime.utcnow()
    db.commit()
    return {
        "access_token":  create_token(user, SUBADMIN_AUD),
        "token_type":    "bearer",
        "role":          user.role.value,
        "name":          user.full_name,
        "assigned_count": len(user.assigned_clients),
    }


@subadmin_router.get("/me")
def subadmin_me(user: User = Depends(current_subadmin)):
    return {
        "id": user.id, "email": user.email, "name": user.full_name,
        "assigned_clients": [c.id for c in user.assigned_clients],
    }
