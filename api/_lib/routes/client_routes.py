"""
Pipeline / Client endpoints — admin & super-admin only.

Country-first: every list/create call requires `country_id`.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

from database import get_db
from auth import current_admin
from models import Client, Country, TimelineEvent, PIPELINE_STAGES
from services.automation import advance_stage_if_eligible

router = APIRouter()


@router.get("/")
def list_clients(country_id: int = Query(...),
                 stage: str | None = None,
                 db: Session = Depends(get_db),
                 _user = Depends(current_admin)):
    q = db.query(Client).filter(Client.country_id == country_id)
    if stage:
        q = q.filter(Client.stage == stage)
    clients = q.order_by(Client.updated_at.desc()).all()
    return [_serialize_card(c) for c in clients]


@router.get("/{client_id}")
def get_client(client_id: int, db: Session = Depends(get_db),
               _user = Depends(current_admin)):
    c = db.query(Client).get(client_id)
    if not c: raise HTTPException(404, "Client not found")
    return _serialize_full(c)


@router.post("/")
def create_client(payload: dict, db: Session = Depends(get_db),
                  user = Depends(current_admin)):
    # auto-generate ref_no
    last = db.query(Client).order_by(Client.id.desc()).first()
    next_num = (last.id + 1) if last else 1
    ref_no = f"BHAT-REF-{next_num:03d}"

    c = Client(
        ref_no    = ref_no,
        full_name = payload["full_name"],
        country_id= payload["country_id"],
        company_id= payload.get("company_id"),
        agent_name= payload.get("agent_name"),
        position  = payload.get("position"),
        stage     = "doc_collection",
        progress  = 1,
    )
    db.add(c); db.flush()
    db.add(TimelineEvent(client_id=c.id, actor_id=user.id,
                         event_type="created",
                         description=f"Client created by {user.full_name}"))
    db.commit(); db.refresh(c)
    return _serialize_full(c)


@router.post("/{client_id}/advance")
def advance_stage(client_id: int, db: Session = Depends(get_db),
                  user = Depends(current_admin)):
    c = db.query(Client).get(client_id)
    if not c: raise HTTPException(404)
    idx = PIPELINE_STAGES.index(c.stage)
    if idx >= len(PIPELINE_STAGES) - 1:
        raise HTTPException(400, "Already at final stage")

    old = c.stage
    c.stage = PIPELINE_STAGES[idx + 1]
    c.progress = idx + 2
    c.stage_entered_at = datetime.utcnow()
    db.add(TimelineEvent(
        client_id=c.id, actor_id=user.id,
        event_type="stage_advanced",
        description=f"{old} → {c.stage}",
    ))
    db.commit(); db.refresh(c)
    return _serialize_full(c)


@router.post("/{client_id}/flag-urgent")
def flag_urgent(client_id: int, db: Session = Depends(get_db),
                user = Depends(current_admin)):
    c = db.query(Client).get(client_id)
    if not c: raise HTTPException(404)
    c.is_urgent = not c.is_urgent
    db.commit()
    return {"is_urgent": c.is_urgent}


# ---------- serializers ----------
def _serialize_card(c: Client):
    return {
        "id": c.id, "ref_no": c.ref_no, "name": c.full_name,
        "company": c.company.name if c.company else None,
        "agent": c.agent_name,
        "stage": c.stage, "progress": c.progress,
        "is_urgent": c.is_urgent,
        "updated_at": c.updated_at.isoformat() if c.updated_at else None,
    }


def _serialize_full(c: Client):
    return {
        **_serialize_card(c),
        "country_id": c.country_id,
        "position": c.position,
        "documents": [
            {"id": d.id, "type": d.doc_type, "status": d.status.value,
             "expiry_date": d.expiry_date.isoformat() if d.expiry_date else None,
             "uploaded_at": d.uploaded_at.isoformat()}
            for d in c.documents
        ],
        "notes": [{"id": n.id, "body": n.body,
                   "created_at": n.created_at.isoformat()} for n in c.notes],
        "timeline": [
            {"id": t.id, "is_system": t.is_system, "type": t.event_type,
             "description": t.description, "created_at": t.created_at.isoformat()}
            for t in sorted(c.timeline, key=lambda x: x.created_at, reverse=True)
        ],
    }
