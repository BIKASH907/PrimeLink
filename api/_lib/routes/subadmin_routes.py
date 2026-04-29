"""
Sub-Admin restricted endpoints.

A Sub-Admin can ONLY see clients explicitly assigned to them by an Admin /
Super-Admin via the assignment table. They can:
  - List their assigned clients
  - Upload documents for those clients
  - Build / generate a CV for those clients
They cannot view the global pipeline, overview, or any other user's data.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from database import get_db
from auth import current_subadmin
from models import User, Client, Document, CVRecord, TimelineEvent, DocStatus
from services.ocr_service import scan_passport, scan_bill
from services.expiry_service import (
    compute_passport_expiry, compute_police_report_warning,
)
from services.cv_service import generate_cv_pdf
from services.automation import advance_stage_if_eligible

router = APIRouter()


def _assert_assigned(user: User, client_id: int):
    if client_id not in {c.id for c in user.assigned_clients}:
        raise HTTPException(403, "Client not assigned to you")


# ---------- Assigned clients ----------
@router.get("/clients")
def my_assigned_clients(user: User = Depends(current_subadmin)):
    return [
        {"id": c.id, "ref_no": c.ref_no, "name": c.full_name,
         "stage": c.stage, "progress": c.progress,
         "country": c.country.name if c.country else None}
        for c in user.assigned_clients
    ]


@router.get("/clients/{client_id}/documents")
def list_documents(client_id: int,
                   user: User = Depends(current_subadmin),
                   db: Session = Depends(get_db)):
    _assert_assigned(user, client_id)
    docs = db.query(Document).filter(Document.client_id == client_id).all()
    return [{"id": d.id, "type": d.doc_type, "status": d.status.value,
             "expiry_date": d.expiry_date.isoformat() if d.expiry_date else None}
            for d in docs]


# ---------- Upload + auto-OCR ----------
@router.post("/clients/{client_id}/documents/upload")
async def upload_document(
    client_id: int,
    doc_type: str = Form(...),                 # passport / police_report / bill / etc.
    file: UploadFile = File(...),
    user: User = Depends(current_subadmin),
    db: Session = Depends(get_db),
):
    _assert_assigned(user, client_id)
    client = db.query(Client).get(client_id)

    # 1) Save file
    contents = await file.read()
    saved_path = f"./storage/clients/{client_id}/{doc_type}_{file.filename}"
    import os
    os.makedirs(os.path.dirname(saved_path), exist_ok=True)
    with open(saved_path, "wb") as f:
        f.write(contents)

    # 2) Run OCR depending on type
    ocr_payload = {}
    issue_date, expiry_date = None, None
    if doc_type == "passport":
        ocr_payload = scan_passport(saved_path)
        issue_date  = ocr_payload.get("issue_date")
        expiry_date = ocr_payload.get("expiry_date") or compute_passport_expiry(issue_date)
    elif doc_type in ("electricity_bill", "water_bill", "bill"):
        ocr_payload = scan_bill(saved_path)
    elif doc_type == "police_report":
        # No expiry on the doc, but we track issue_date for the 30-day rule
        ocr_payload = scan_passport(saved_path)  # reuse OCR for date extraction
        issue_date  = ocr_payload.get("issue_date")

    # 3) Persist Document
    doc = Document(
        client_id=client.id, doc_type=doc_type, file_path=saved_path,
        issue_date=issue_date, expiry_date=expiry_date,
        status=DocStatus.OK, uploaded_by_id=user.id,
        ocr_extracted=str(ocr_payload),
    )
    db.add(doc)

    # 4) Auto-fill CV record from OCR
    if doc_type == "passport" and ocr_payload:
        cv = client.cv_data or CVRecord(client_id=client.id)
        cv.auto_full_name      = ocr_payload.get("full_name")     or cv.auto_full_name
        cv.auto_passport_no    = ocr_payload.get("passport_no")   or cv.auto_passport_no
        cv.auto_dob            = ocr_payload.get("dob")           or cv.auto_dob
        cv.auto_gender         = ocr_payload.get("gender")        or cv.auto_gender
        cv.auto_passport_issue = ocr_payload.get("issue_date")    or cv.auto_passport_issue
        cv.auto_passport_expiry= ocr_payload.get("expiry_date")   or cv.auto_passport_expiry
        cv.auto_father_name    = ocr_payload.get("father_name")   or cv.auto_father_name
        cv.auto_mother_name    = ocr_payload.get("mother_name")   or cv.auto_mother_name
        cv.auto_nationality    = ocr_payload.get("nationality")   or cv.auto_nationality
        if not client.cv_data: db.add(cv)

    if doc_type in ("electricity_bill", "water_bill", "bill") and ocr_payload:
        cv = client.cv_data or CVRecord(client_id=client.id)
        cv.auto_address = ocr_payload.get("address") or cv.auto_address
        if not client.cv_data: db.add(cv)

    # 5) Timeline + automation
    db.add(TimelineEvent(client_id=client.id, actor_id=user.id, is_system=True,
                         event_type="document_uploaded",
                         description=f"{doc_type} uploaded by {user.full_name}"))
    advance_stage_if_eligible(client, db)   # see services/automation.py

    # 6) Police-report 30-day warning check
    warning = None
    if doc_type == "police_report" and issue_date:
        warning = compute_police_report_warning(client, issue_date, db)

    db.commit(); db.refresh(doc)
    return {
        "document_id": doc.id,
        "ocr": ocr_payload,
        "expiry_date": expiry_date.isoformat() if expiry_date else None,
        "warning": warning,
    }


# ---------- CV builder ----------
@router.get("/clients/{client_id}/cv")
def get_cv(client_id: int,
           user: User = Depends(current_subadmin),
           db: Session = Depends(get_db)):
    _assert_assigned(user, client_id)
    cv = db.query(CVRecord).filter(CVRecord.client_id == client_id).first()
    if not cv: raise HTTPException(404, "CV not started yet")
    return _cv_dict(cv)


@router.post("/clients/{client_id}/cv")
def update_cv(client_id: int, payload: dict,
              user: User = Depends(current_subadmin),
              db: Session = Depends(get_db)):
    _assert_assigned(user, client_id)
    cv = db.query(CVRecord).filter(CVRecord.client_id == client_id).first() \
         or CVRecord(client_id=client_id)

    # Manual fields the sub-admin fills in
    for f in ("marital_status", "spouse_name", "religion", "permanent_address",
              "position_applied", "years_experience", "languages"):
        if f in payload: setattr(cv, f, payload[f])

    if cv.marital_status == "married" and not cv.spouse_name:
        raise HTTPException(400, "Spouse / wife name required when married")

    if not cv.id: db.add(cv)
    db.commit(); db.refresh(cv)
    return _cv_dict(cv)


@router.post("/clients/{client_id}/cv/generate")
def generate_cv(client_id: int,
                user: User = Depends(current_subadmin),
                db: Session = Depends(get_db)):
    _assert_assigned(user, client_id)
    cv = db.query(CVRecord).filter(CVRecord.client_id == client_id).first()
    if not cv: raise HTTPException(404, "Fill in CV details first")
    pdf_path = generate_cv_pdf(cv)
    cv.generated_pdf_path = pdf_path
    db.commit()
    return {"pdf_path": pdf_path}


def _cv_dict(cv: CVRecord):
    return {c.name: getattr(cv, c.name) for c in cv.__table__.columns}
