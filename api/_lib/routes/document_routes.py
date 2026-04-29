"""
Document endpoints (admin surface).
Sub-Admin uploads go through /api/subadmin/* — admins use these endpoints
for cross-client lookups, filtering, and verification.
"""
from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import date

from database import get_db
from auth import current_admin
from models import Document, DocStatus, Client, TimelineEvent
from services.ocr_service import scan_passport, scan_bill
from services.expiry_service import (
    is_passport_expiring_soon, compute_police_report_warning,
)
from services.automation import advance_stage_if_eligible

router = APIRouter()


@router.get("/")
def list_documents(country_id: int = Query(...),
                   status: str | None = None,
                   db: Session = Depends(get_db),
                   _u = Depends(current_admin)):
    q = (db.query(Document)
           .join(Client, Document.client_id == Client.id)
           .filter(Client.country_id == country_id))
    if status:
        q = q.filter(Document.status == DocStatus(status))
    return [_serialize(d) for d in q.all()]


@router.post("/{client_id}/upload")
async def admin_upload(
    client_id: int,
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user = Depends(current_admin),
):
    client = db.query(Client).get(client_id)
    if not client: raise HTTPException(404)

    import os
    save_path = f"./storage/clients/{client_id}/{doc_type}_{file.filename}"
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open(save_path, "wb") as f:
        f.write(await file.read())

    ocr = {}
    issue_dt, expiry_dt = None, None
    if doc_type == "passport":
        ocr = scan_passport(save_path)
        issue_dt, expiry_dt = ocr.get("issue_date"), ocr.get("expiry_date")
    elif doc_type == "police_report":
        ocr = scan_passport(save_path)
        issue_dt = ocr.get("issue_date")
    elif doc_type in ("electricity_bill", "water_bill", "bill"):
        ocr = scan_bill(save_path)

    doc = Document(
        client_id=client.id, doc_type=doc_type, file_path=save_path,
        issue_date=issue_dt, expiry_date=expiry_dt,
        uploaded_by_id=user.id, ocr_extracted=str(ocr),
        status=DocStatus.EXPIRING if (
            expiry_dt and is_passport_expiring_soon(expiry_dt)
        ) else DocStatus.OK,
    )
    db.add(doc)
    db.add(TimelineEvent(client_id=client.id, actor_id=user.id, is_system=True,
                         event_type="document_uploaded",
                         description=f"{doc_type} uploaded"))

    advance_stage_if_eligible(client, db)

    warning = None
    if doc_type == "police_report" and issue_dt:
        warning = compute_police_report_warning(client, issue_dt, db)

    db.commit(); db.refresh(doc)
    return {**_serialize(doc), "ocr": ocr, "warning": warning}


@router.post("/{doc_id}/verify")
def verify(doc_id: int, db: Session = Depends(get_db), _u = Depends(current_admin)):
    d = db.query(Document).get(doc_id)
    if not d: raise HTTPException(404)
    d.status = DocStatus.OK
    db.commit()
    return _serialize(d)


def _serialize(d: Document):
    return {
        "id": d.id, "client_id": d.client_id, "type": d.doc_type,
        "status": d.status.value,
        "issue_date":  d.issue_date.isoformat()  if d.issue_date  else None,
        "expiry_date": d.expiry_date.isoformat() if d.expiry_date else None,
        "uploaded_at": d.uploaded_at.isoformat(),
    }
