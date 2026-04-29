"""
CV Builder endpoints — admin surface.
(Sub-Admins use the same logic via /api/subadmin/clients/{id}/cv.)
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from auth import current_admin
from models import CVRecord
from services.cv_service import generate_cv_pdf

router = APIRouter()


@router.get("/{client_id}")
def get_cv(client_id: int, db: Session = Depends(get_db), _u = Depends(current_admin)):
    cv = db.query(CVRecord).filter(CVRecord.client_id == client_id).first()
    if not cv: raise HTTPException(404)
    return _dict(cv)


@router.put("/{client_id}")
def update_cv(client_id: int, payload: dict,
              db: Session = Depends(get_db), _u = Depends(current_admin)):
    cv = db.query(CVRecord).filter(CVRecord.client_id == client_id).first() \
         or CVRecord(client_id=client_id)

    for f in ("marital_status", "spouse_name", "religion", "permanent_address",
              "position_applied", "years_experience", "languages"):
        if f in payload: setattr(cv, f, payload[f])

    if cv.marital_status == "married" and not cv.spouse_name:
        raise HTTPException(400, "Spouse name required when marital_status is 'married'")

    if not cv.id: db.add(cv)
    db.commit(); db.refresh(cv)
    return _dict(cv)


@router.post("/{client_id}/generate")
def generate(client_id: int, db: Session = Depends(get_db), _u = Depends(current_admin)):
    cv = db.query(CVRecord).filter(CVRecord.client_id == client_id).first()
    if not cv: raise HTTPException(404, "Fill CV first")
    cv.generated_pdf_path = generate_cv_pdf(cv)
    db.commit()
    return {"pdf_path": cv.generated_pdf_path}


def _dict(cv): return {c.name: getattr(cv, c.name) for c in cv.__table__.columns}
