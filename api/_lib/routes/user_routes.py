"""
User management — Super-Admin (and Admin, with limits) only.

Key endpoint: POST /{user_id}/assign-clients  — assigns a Sub-Admin to one or
more clients. Sub-Admins only see their assigned clients.
"""
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session

from database import get_db
from auth import require_admin_or_super, require_super_admin, hash_password
from models import User, Role, Client, sub_admin_assignments

router = APIRouter()


# ---------- list ----------
@router.get("/")
def list_users(db: Session = Depends(get_db), _u = Depends(require_admin_or_super)):
    users = db.query(User).all()
    return [_serialize(u) for u in users]


# ---------- create ----------
@router.post("/")
def create_user(payload: dict,
                db: Session = Depends(get_db),
                actor: User = Depends(require_admin_or_super)):
    role = Role(payload["role"])
    if role == Role.SUPER_ADMIN and actor.role != Role.SUPER_ADMIN:
        raise HTTPException(403, "Only Super-Admin can create Super-Admins")

    user = User(
        full_name=payload["full_name"],
        email=payload["email"],
        password_hash=hash_password(payload["password"]),
        role=role,
    )
    db.add(user); db.commit(); db.refresh(user)
    return _serialize(user)


# ---------- assign clients to sub-admin ----------
@router.post("/{user_id}/assign-clients")
def assign_clients(user_id: int,
                   client_ids: list[int] = Body(...),
                   db: Session = Depends(get_db),
                   actor: User = Depends(require_admin_or_super)):
    sub = db.query(User).get(user_id)
    if not sub or sub.role != Role.SUB_ADMIN:
        raise HTTPException(400, "Target must be a Sub-Admin")
    clients = db.query(Client).filter(Client.id.in_(client_ids)).all()
    sub.assigned_clients = clients
    db.commit()
    return {"user_id": user_id, "assigned_clients": [c.id for c in clients]}


@router.delete("/{user_id}/assignments/{client_id}")
def unassign_client(user_id: int, client_id: int,
                    db: Session = Depends(get_db),
                    _u: User = Depends(require_admin_or_super)):
    db.execute(sub_admin_assignments.delete().where(
        (sub_admin_assignments.c.user_id == user_id) &
        (sub_admin_assignments.c.client_id == client_id)
    ))
    db.commit()
    return {"ok": True}


# ---------- delete (super-admin only) ----------
@router.delete("/{user_id}")
def delete_user(user_id: int,
                db: Session = Depends(get_db),
                _u: User = Depends(require_super_admin)):
    user = db.query(User).get(user_id)
    if not user: raise HTTPException(404)
    db.delete(user); db.commit()
    return {"ok": True}


def _serialize(u: User):
    return {
        "id": u.id, "full_name": u.full_name, "email": u.email,
        "role": u.role.value, "is_active": u.is_active,
        "assigned_clients": [c.id for c in u.assigned_clients] if u.role == Role.SUB_ADMIN else [],
        "last_login_at": u.last_login_at.isoformat() if u.last_login_at else None,
    }
