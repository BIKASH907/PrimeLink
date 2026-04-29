"""
Server-side rendered HTML views.

These routes return Jinja2 templates (not JSON). They use cookie-based session
auth, so a regular browser can use them directly without an SPA layer.

The JSON `/api/admin/*` routes still exist for AJAX/programmatic use.
"""
from datetime import datetime, timedelta, date
from typing import Optional
from pathlib import Path

from fastapi import APIRouter, Request, Form, UploadFile, File, Depends, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import Counter

from database import get_db
from models import (
    User, Role, Client, Document, DocStatus, CVRecord, Note, TimelineEvent,
    Country, Company, PIPELINE_STAGES,
)
from auth import verify_password, hash_password
from services.ocr_service import scan_passport, scan_bill
from services.expiry_service import compute_passport_expiry, compute_police_report_warning
from services.cv_service import generate_cv_pdf
from services.automation import advance_stage_if_eligible

router    = APIRouter()
# Absolute templates path — works on Vercel and locally
TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# ============================================================
# SESSION HELPERS (cookie-based)
# ============================================================
SESSION_COOKIE = "bhat_session"
COUNTRY_COOKIE = "bhat_country"   # ISO code: "RO" or "TR"

def get_user(request: Request, db: Session) -> Optional[User]:
    uid = request.cookies.get(SESSION_COOKIE)
    if not uid: return None
    try: return db.query(User).get(int(uid))
    except Exception: return None

def get_country(request: Request, db: Session) -> Optional[Country]:
    code = request.cookies.get(COUNTRY_COOKIE)
    if not code: return None
    return db.query(Country).filter(Country.iso_code == code).first()

def require_user(request: Request, db: Session) -> User:
    u = get_user(request, db)
    if not u:
        raise HTTPException(status_code=302, headers={"Location": "/"})
    return u

def require_country(request: Request, db: Session) -> Country:
    c = get_country(request, db)
    if not c:
        raise HTTPException(status_code=302, headers={"Location": "/"})
    return c

def _human(dt: Optional[datetime]) -> str:
    if not dt: return "—"
    delta = datetime.utcnow() - dt
    if delta.days > 0:    return f"{delta.days}d ago"
    if delta.seconds > 3600: return f"{delta.seconds // 3600}h ago"
    if delta.seconds > 60:   return f"{delta.seconds // 60}m ago"
    return "just now"

def _ctx_user(u: User) -> dict:
    parts = (u.full_name or u.email).split()
    initials = (parts[0][0] + (parts[-1][0] if len(parts) > 1 else "")).upper()
    labels = {Role.SUPER_ADMIN: "Super Admin", Role.ADMIN: "Admin",
              Role.SUB_ADMIN: "Sub-Admin", Role.VIEWER: "Viewer"}
    return {"id": u.id, "name": u.full_name, "email": u.email,
            "role": u.role.value, "role_label": labels.get(u.role, u.role.value),
            "initials": initials}

def _ctx_counts(db: Session, country_id: Optional[int] = None) -> dict:
    q = db.query(Client)
    if country_id: q = q.filter(Client.country_id == country_id)
    return {
        "pipeline":  q.count(),
        "documents": db.query(Document).count(),
        "alerts":    db.query(Document).filter(
                       Document.status.in_([DocStatus.MISSING, DocStatus.EXPIRING])).count(),
    }

STAGE_LABELS = {
    "doc_collection": "Doc Collection", "advance_paid": "Advance Paid",
    "pcc_apply": "PCC Apply", "vfs_appointment": "VFS Appointment",
    "reference_agent_info": "Reference (Agent Info)", "amount_paid": "Amount Paid",
    "entry_approval": "Entry Approval", "kimlik_fee_paid": "Kimlik Fee Paid",
    "client_money_paid": "Client Money Paid", "second_vfs": "Second VFS",
    "passport_collection": "Passport Collection", "sharam": "Sharam",
    "flight_ticket": "Flight Ticket", "flight_status": "Flight Status",
}

# ============================================================
# AUTH
# ============================================================
COUNTRY_META = {
    "RO": {"code": "RO", "name": "Romania", "flag": "🇷🇴"},
    "TR": {"code": "TR", "name": "Turkey",  "flag": "🇹🇷"},
}
DEFAULT_LOGIN_EMAIL = {
    "RO": "bikash.ro@bhatoverseas.com",
    "TR": "bikash.tr@bhatoverseas.com",
}

@router.get("/", response_class=HTMLResponse, name="country_gate")
@router.get("/country", response_class=HTMLResponse)
def country_gate(request: Request, db: Session = Depends(get_db)):
    tr_count = db.query(Client).join(Country).filter(Country.iso_code == "TR").count()
    ro_count = db.query(Client).join(Country).filter(Country.iso_code == "RO").count()
    return templates.TemplateResponse("country_gate.html", {
        "request": request, "tr_count": tr_count or 42, "ro_count": ro_count or 0,
    })

@router.get("/romania", response_class=HTMLResponse, name="romania_redirect")
def romania_redirect(request: Request):
    # Kept for backwards compat — just redirect into the Romania login.
    return RedirectResponse("/login?country=RO", status_code=303)

@router.get("/login", response_class=HTMLResponse, name="login_get")
def login_get(request: Request, country: str = "TR"):
    country = country.upper()
    if country not in COUNTRY_META:
        return RedirectResponse("/", status_code=303)
    return templates.TemplateResponse("login.html", {
        "request": request, "error": None,
        "country": COUNTRY_META[country],
        "default_email": DEFAULT_LOGIN_EMAIL[country],
    })

@router.post("/login", name="login_post")
def login_post(request: Request,
               email:    str = Form(...),
               password: str = Form(...),
               country:  str = Form("TR"),
               role:     str = Form("super_admin"),
               db: Session = Depends(get_db)):
    country = country.upper()
    if country not in COUNTRY_META:
        return RedirectResponse("/", status_code=303)

    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        return templates.TemplateResponse("login.html", {
            "request": request, "error": "Invalid email or password.",
            "country": COUNTRY_META[country],
            "default_email": email,
        }, status_code=401)

    # Country gate: a user's email is bound to a country (suffix .ro / .tr) —
    # super_admin without a country suffix can log into any country.
    if user.role != Role.SUPER_ADMIN:
        if f".{country.lower()}@" not in user.email:
            return templates.TemplateResponse("login.html", {
                "request": request,
                "error": f"This account is not authorised for {COUNTRY_META[country]['name']}.",
                "country": COUNTRY_META[country],
                "default_email": email,
            }, status_code=403)

    user.last_login_at = datetime.utcnow()
    db.commit()

    target = "/sub" if user.role == Role.SUB_ADMIN else "/pipeline"
    resp = RedirectResponse(target, status_code=303)
    resp.set_cookie(SESSION_COOKIE, str(user.id),
                    httponly=True, samesite="lax", max_age=60 * 60 * 12)
    resp.set_cookie(COUNTRY_COOKIE, country,
                    httponly=True, samesite="lax", max_age=60 * 60 * 12)
    return resp

@router.get("/logout", name="logout")
def logout(request: Request):
    resp = RedirectResponse("/", status_code=303)
    resp.delete_cookie(SESSION_COOKIE)
    resp.delete_cookie(COUNTRY_COOKIE)
    return resp

# ============================================================
# PIPELINE
# ============================================================
@router.get("/pipeline", response_class=HTMLResponse, name="pipeline")
def pipeline(request: Request, db: Session = Depends(get_db)):
    user = require_user(request, db)
    if user.role == Role.SUB_ADMIN:
        return RedirectResponse("/sub", status_code=303)

    country = require_country(request, db)
    clients = db.query(Client).filter(Client.country_id == country.id).all()

    # group by stage
    grouped = {s: [] for s in PIPELINE_STAGES}
    for c in clients:
        if c.stage in grouped: grouped[c.stage].append(c)

    stages = [{
        "key": s, "label": STAGE_LABELS[s],
        "clients": [{
            "id": c.id, "name": c.full_name, "ref_no": c.ref_no,
            "company": c.company.name if c.company else None,
            "agent": c.agent_name, "progress": c.progress,
            "is_urgent": c.is_urgent,
            "updated_human": _human(c.updated_at),
        } for c in grouped[s]],
    } for s in PIPELINE_STAGES]

    cutoff = datetime.utcnow() - timedelta(days=14)
    stats = {
        "total": len(clients),
        "in_doc": sum(1 for c in clients if c.stage == "doc_collection"),
        "vfs":    sum(1 for c in clients if c.stage in ("vfs_appointment", "second_vfs")),
        "delayed":sum(1 for c in clients if c.stage_entered_at and c.stage_entered_at < cutoff),
        "urgent": sum(1 for c in clients if c.is_urgent),
        "ready":  sum(1 for c in clients if c.stage in ("flight_ticket", "flight_status")),
        "departed": 12,
    }

    # show police 30-day warning if any client has one near expiry
    show_warning = False
    warning = None
    for c in clients:
        for d in c.documents:
            if d.doc_type == "police_report" and d.issue_date:
                age = (date.today() - d.issue_date).days
                if 23 <= age <= 30:
                    show_warning = True
                    warning = {
                        "client_id": c.id, "client_name": c.full_name, "ref_no": c.ref_no,
                        "age_days": age, "issue_date": d.issue_date.isoformat(),
                        "vfs_date": "12 May 2026",
                        "message": f"Will expire in {30 - age} days — re-issue before VFS.",
                    }
                    break
        if show_warning: break

    return templates.TemplateResponse("pipeline.html", {
        "request": request, "user": _ctx_user(user),
        "counts": _ctx_counts(db, country.id),
        "country": {"code": country.iso_code, "name": country.name, "flag": country.flag},
        "stages": stages, "stats": stats,
        "show_warning": show_warning, "warning": warning, "q": "",
    })


@router.get("/clients/new", response_class=HTMLResponse, name="client_new")
def client_new(request: Request, db: Session = Depends(get_db)):
    user = require_user(request, db)
    # quick form would render here — keeping minimal
    return RedirectResponse("/pipeline", status_code=303)


@router.get("/clients/{client_id}", response_class=HTMLResponse, name="client_detail")
def client_detail(request: Request, client_id: int, db: Session = Depends(get_db)):
    user = require_user(request, db)
    c = db.query(Client).get(client_id)
    if not c: raise HTTPException(404)

    if user.role == Role.SUB_ADMIN and c not in user.assigned_clients:
        raise HTTPException(403, "Not assigned to this client")

    docs = []
    for d in c.documents:
        status_map = {DocStatus.OK: "ok", DocStatus.MISSING: "miss",
                      DocStatus.EXPIRING: "exp", DocStatus.EXPIRED: "exp"}
        docs.append({
            "label": d.doc_type.replace("_", " ").title(),
            "status": status_map.get(d.status, "ok"),
            "expires": d.expiry_date.isoformat() if d.expiry_date else None,
            "note": "Verified" if d.status == DocStatus.OK else d.status.value.title(),
        })

    notes = [{"body": n.body, "author": "Staff",
              "when": _human(n.created_at)} for n in sorted(c.notes, key=lambda n: n.created_at, reverse=True)]
    timeline = [{"description": t.description, "is_system": t.is_system,
                 "actor": "Auto" if t.is_system else "Staff",
                 "when": _human(t.created_at)}
                for t in sorted(c.timeline, key=lambda t: t.created_at, reverse=True)]

    days_in_stage = (datetime.utcnow() - (c.stage_entered_at or c.created_at)).days

    client_ctx = {
        "id": c.id, "name": c.full_name, "ref_no": c.ref_no,
        "company": c.company.name if c.company else None,
        "agent": c.agent_name, "position": c.position,
        "stage_label": STAGE_LABELS.get(c.stage, c.stage),
        "stage_idx": PIPELINE_STAGES.index(c.stage),
        "progress": c.progress, "is_urgent": c.is_urgent,
        "days_in_stage": days_in_stage,
        "created_human": _human(c.created_at),
        "updated_human": _human(c.updated_at),
        "documents": docs, "notes": notes, "timeline": timeline,
    }
    return templates.TemplateResponse("client_detail.html", {
        "request": request, "user": _ctx_user(user),
        "counts": _ctx_counts(db), "client": client_ctx, "q": "",
    })


@router.post("/clients/{client_id}/advance", name="advance_stage")
def advance_stage(client_id: int, request: Request, db: Session = Depends(get_db)):
    user = require_user(request, db)
    c = db.query(Client).get(client_id)
    if not c: raise HTTPException(404)
    idx = PIPELINE_STAGES.index(c.stage)
    if idx < len(PIPELINE_STAGES) - 1:
        old = c.stage
        c.stage = PIPELINE_STAGES[idx + 1]
        c.progress = idx + 2
        c.stage_entered_at = datetime.utcnow()
        db.add(TimelineEvent(client_id=c.id, actor_id=user.id,
                             event_type="stage_advanced",
                             description=f"{STAGE_LABELS[old]} → {STAGE_LABELS[c.stage]}"))
        db.commit()
    return RedirectResponse(f"/clients/{client_id}", status_code=303)


@router.post("/clients/{client_id}/flag", name="flag_urgent")
def flag_urgent(client_id: int, request: Request, db: Session = Depends(get_db)):
    user = require_user(request, db)
    c = db.query(Client).get(client_id)
    if c: c.is_urgent = not c.is_urgent; db.commit()
    return RedirectResponse(f"/clients/{client_id}", status_code=303)


@router.post("/clients/{client_id}/notes", name="add_note")
def add_note(client_id: int, request: Request, body: str = Form(...),
             db: Session = Depends(get_db)):
    user = require_user(request, db)
    db.add(Note(client_id=client_id, author_id=user.id, body=body))
    db.commit()
    return RedirectResponse(f"/clients/{client_id}", status_code=303)


# ============================================================
# DOCUMENTS
# ============================================================
@router.get("/documents", response_class=HTMLResponse, name="documents")
def documents(request: Request, filter: str = "all", db: Session = Depends(get_db)):
    user = require_user(request, db)
    q = db.query(Document).join(Client)
    if user.role == Role.SUB_ADMIN:
        ids = [c.id for c in user.assigned_clients]
        q = q.filter(Document.client_id.in_(ids))

    docs_all = q.all()

    status_map = {DocStatus.OK: "ok", DocStatus.MISSING: "miss",
                  DocStatus.EXPIRING: "exp", DocStatus.EXPIRED: "exp"}
    rows = []
    for d in docs_all:
        s = status_map.get(d.status, "ok")
        if filter != "all" and s != filter: continue
        rows.append({
            "label": d.doc_type.replace("_", " ").title(),
            "client_id": d.client_id,
            "client_name": d.client.full_name,
            "stage": STAGE_LABELS.get(d.client.stage, d.client.stage),
            "expires": d.expiry_date.isoformat() if d.expiry_date else None,
            "status": s,
        })

    return templates.TemplateResponse("documents.html", {
        "request": request, "user": _ctx_user(user), "counts": _ctx_counts(db),
        "docs": rows, "total": len(docs_all), "filter": filter, "q": "",
    })


@router.get("/documents/upload", response_class=HTMLResponse, name="upload_doc_form")
def upload_doc_form(request: Request, client_id: Optional[int] = None,
                    db: Session = Depends(get_db)):
    user = require_user(request, db)
    if user.role == Role.SUB_ADMIN:
        clients = user.assigned_clients
    else:
        clients = db.query(Client).all()
    return templates.TemplateResponse("upload_doc.html", {
        "request": request, "user": _ctx_user(user), "counts": _ctx_counts(db),
        "clients": clients, "selected_client": client_id, "q": "",
    })


@router.post("/documents/upload", name="upload_doc_post")
async def upload_doc_post(request: Request,
                          client_id: int = Form(...),
                          doc_type:  str = Form(...),
                          file: UploadFile = File(...),
                          db: Session = Depends(get_db)):
    user = require_user(request, db)
    client = db.query(Client).get(client_id)
    if not client: raise HTTPException(404)
    if user.role == Role.SUB_ADMIN and client not in user.assigned_clients:
        raise HTTPException(403)

    import os
    os.makedirs(f"./storage/clients/{client_id}", exist_ok=True)
    path = f"./storage/clients/{client_id}/{doc_type}_{file.filename}"
    with open(path, "wb") as fp:
        fp.write(await file.read())

    ocr = {}
    issue_dt, expiry_dt = None, None
    if doc_type == "passport":
        ocr = scan_passport(path)
        issue_dt, expiry_dt = ocr.get("issue_date"), ocr.get("expiry_date")
    elif doc_type == "police_report":
        ocr = scan_passport(path)
        issue_dt = ocr.get("issue_date")
    elif "bill" in doc_type:
        ocr = scan_bill(path)

    doc = Document(client_id=client.id, doc_type=doc_type, file_path=path,
                   issue_date=issue_dt, expiry_date=expiry_dt,
                   status=DocStatus.OK, uploaded_by_id=user.id,
                   ocr_extracted=str(ocr))
    db.add(doc)

    # Auto-fill CV from passport OCR
    if doc_type == "passport" and ocr:
        cv = client.cv_data or CVRecord(client_id=client.id)
        for k, attr in [("full_name","auto_full_name"),("passport_no","auto_passport_no"),
                        ("dob","auto_dob"),("gender","auto_gender"),
                        ("issue_date","auto_passport_issue"),("expiry_date","auto_passport_expiry"),
                        ("father_name","auto_father_name"),("mother_name","auto_mother_name"),
                        ("nationality","auto_nationality")]:
            v = ocr.get(k)
            if v: setattr(cv, attr, v)
        if not client.cv_data: db.add(cv)

    db.add(TimelineEvent(client_id=client.id, actor_id=user.id, is_system=True,
                         event_type="document_uploaded",
                         description=f"{doc_type.replace('_',' ').title()} uploaded"))
    advance_stage_if_eligible(client, db)
    db.commit()
    return RedirectResponse(f"/clients/{client_id}", status_code=303)


# ============================================================
# OVERVIEW
# ============================================================
@router.get("/overview", response_class=HTMLResponse, name="overview")
def overview(request: Request, db: Session = Depends(get_db)):
    user = require_user(request, db)
    if user.role == Role.SUB_ADMIN:
        return RedirectResponse("/sub", status_code=303)

    country = require_country(request, db)
    clients = db.query(Client).filter(Client.country_id == country.id).all()
    cutoff  = datetime.utcnow() - timedelta(days=14)

    counter = Counter(c.stage for c in clients)
    max_count = max(counter.values()) if counter else 1
    stage_counts = [{
        "label": STAGE_LABELS[s], "count": counter.get(s, 0),
        "pct": (counter.get(s, 0) / max_count) * 100 if max_count else 0,
    } for s in PIPELINE_STAGES]

    agent_counter = Counter(c.agent_name for c in clients if c.agent_name)
    top_agents = [{
        "name": n, "volume": v,
        "initials": "".join(p[0] for p in n.split()[:2]).upper()
    } for n, v in agent_counter.most_common(5)]

    missing_count = sum(1 for c in clients for d in c.documents if d.status == DocStatus.MISSING)

    return templates.TemplateResponse("overview.html", {
        "request": request, "user": _ctx_user(user),
        "counts": _ctx_counts(db, country.id),
        "country": {"code": country.iso_code, "name": country.name, "flag": country.flag},
        "stats": {
            "total": len(clients), "new_this_month": 6,
            "avg_cycle": 38, "cycle_change": 4,
            "departed": 12, "departed_change": 3,
            "docs_ok_pct": 94,
        },
        "alerts": {
            "police_30d": 3, "missing_docs": missing_count,
            "affected_clients": 5, "delayed":
            sum(1 for c in clients if c.stage_entered_at and c.stage_entered_at < cutoff),
        },
        "stage_counts": stage_counts, "top_agents": top_agents,
        "automation_log": [
            {"client": "Bikram Thapa",  "action": "Passport uploaded → moved to Passport Collection", "when": "2 min ago"},
            {"client": "Sita Rai",      "action": "VFS confirmed → advanced to Reference",            "when": "12 min ago"},
            {"client": "Kishor Lama",   "action": "Police Report expiry detected → Alert raised",     "when": "38 min ago"},
            {"client": "Rajesh Magar",  "action": "Flight ticket attached → Moved to Flight Status",  "when": "1 hr ago"},
            {"client": "Manish KC",     "action": "Kimlik fee receipt uploaded → Stage updated",      "when": "3 hr ago"},
        ],
        "q": "",
    })


# ============================================================
# CV BUILDER
# ============================================================
@router.get("/cv", response_class=HTMLResponse, name="cv_builder")
def cv_builder(request: Request, client_id: Optional[int] = None,
               db: Session = Depends(get_db)):
    user = require_user(request, db)
    client = db.query(Client).get(client_id) if client_id else None

    if client and user.role == Role.SUB_ADMIN and client not in user.assigned_clients:
        raise HTTPException(403)

    cv = (client.cv_data if client else None) or CVRecord()
    cv_dict = {c.name: getattr(cv, c.name, None) for c in CVRecord.__table__.columns}
    cv_dict["passport_expires_in"] = "—"
    cv_dict["police_issue_date"] = "—"
    cv_dict["police_age"] = "—"

    return templates.TemplateResponse("cv_builder.html", {
        "request": request, "user": _ctx_user(user), "counts": _ctx_counts(db),
        "client": client, "cv": cv_dict, "q": "",
    })


@router.post("/cv/save", name="cv_save")
async def cv_save(request: Request,
                  client_id: Optional[int] = Form(None),
                  marital_status:    str = Form("single"),
                  spouse_name:       str = Form(""),
                  religion:          str = Form(""),
                  permanent_address: str = Form(""),
                  position_applied:  str = Form(""),
                  years_experience:  Optional[int] = Form(None),
                  languages:         str = Form(""),
                  scan_file: Optional[UploadFile] = File(None),
                  db: Session = Depends(get_db)):
    user = require_user(request, db)

    if not client_id:
        # No client yet — create a placeholder
        tr = db.query(Country).filter(Country.iso_code == "TR").first()
        last = db.query(Client).order_by(Client.id.desc()).first()
        ref = f"BHAT-REF-{((last.id if last else 0) + 1):03d}"
        c = Client(ref_no=ref, full_name="New Candidate",
                   country_id=tr.id if tr else 1, stage="doc_collection", progress=1)
        db.add(c); db.flush()
        client_id = c.id

    client = db.query(Client).get(client_id)

    # OCR scan
    if scan_file and scan_file.filename:
        import os
        os.makedirs(f"./storage/clients/{client_id}", exist_ok=True)
        p = f"./storage/clients/{client_id}/scan_{scan_file.filename}"
        with open(p, "wb") as f: f.write(await scan_file.read())
        ocr = scan_passport(p)
        cv = client.cv_data or CVRecord(client_id=client_id)
        for k, attr in [("full_name","auto_full_name"),("passport_no","auto_passport_no"),
                        ("dob","auto_dob"),("gender","auto_gender"),
                        ("issue_date","auto_passport_issue"),("expiry_date","auto_passport_expiry"),
                        ("father_name","auto_father_name"),("mother_name","auto_mother_name"),
                        ("nationality","auto_nationality"),("address","auto_address")]:
            v = ocr.get(k)
            if v: setattr(cv, attr, v)
        if not client.cv_data: db.add(cv)

    cv = client.cv_data or CVRecord(client_id=client_id)
    cv.marital_status    = marital_status
    cv.spouse_name       = spouse_name or None
    cv.religion          = religion or None
    cv.permanent_address = permanent_address or None
    cv.position_applied  = position_applied or None
    cv.years_experience  = years_experience
    cv.languages         = languages or None
    if not client.cv_data: db.add(cv)
    db.commit()
    return RedirectResponse(f"/cv?client_id={client_id}", status_code=303)


@router.post("/cv/generate", name="cv_generate")
def cv_generate(request: Request, client_id: int = Form(...),
                db: Session = Depends(get_db)):
    user = require_user(request, db)
    cv = db.query(CVRecord).filter(CVRecord.client_id == client_id).first()
    if not cv: raise HTTPException(404, "Save CV details first")
    pdf_path = generate_cv_pdf(cv)
    cv.generated_pdf_path = pdf_path
    db.commit()
    from fastapi.responses import FileResponse
    return FileResponse(pdf_path, media_type="application/pdf",
                        filename=f"cv_{client_id}.pdf")


# ============================================================
# SETTINGS / USERS
# ============================================================
@router.get("/settings", response_class=HTMLResponse, name="settings")
def settings(request: Request, db: Session = Depends(get_db)):
    user = require_user(request, db)
    if user.role not in (Role.SUPER_ADMIN, Role.ADMIN):
        raise HTTPException(403)
    users = db.query(User).all()
    user_rows = []
    for u in users:
        user_rows.append({
            "id": u.id, "full_name": u.full_name, "email": u.email,
            "role": u.role.value,
            "assigned_count": (f"{len(u.assigned_clients)} clients"
                               if u.role == Role.SUB_ADMIN else "—"),
            "last_active": _human(u.last_login_at),
        })
    return templates.TemplateResponse("settings.html", {
        "request": request, "user": _ctx_user(user), "counts": _ctx_counts(db),
        "users": user_rows, "q": "",
    })


# ============================================================
# SUB-ADMIN
# ============================================================
@router.get("/sub", response_class=HTMLResponse, name="subadmin_dashboard")
def subadmin_dashboard(request: Request, db: Session = Depends(get_db)):
    user = require_user(request, db)
    if user.role != Role.SUB_ADMIN:
        return RedirectResponse("/pipeline", status_code=303)

    rows = []
    for c in user.assigned_clients:
        ok = sum(1 for d in c.documents if d.status == DocStatus.OK)
        miss = sum(1 for d in c.documents if d.status == DocStatus.MISSING)
        rows.append({
            "id": c.id, "name": c.full_name, "ref_no": c.ref_no,
            "stage_label": STAGE_LABELS.get(c.stage, c.stage),
            "progress": c.progress, "docs_ok": ok, "docs_missing": miss,
        })
    return templates.TemplateResponse("subadmin_dashboard.html", {
        "request": request, "user": _ctx_user(user),
        "counts": {"pipeline": 0, "documents": sum(len(c.documents) for c in user.assigned_clients), "alerts": 0},
        "clients": rows, "q": "",
    })


# ============================================================
# misc placeholders for sidebar links
# ============================================================
@router.get("/alerts", response_class=HTMLResponse, name="alerts_page")
def alerts_page(request: Request, db: Session = Depends(get_db)):
    user = require_user(request, db)
    return RedirectResponse("/overview", status_code=303)

@router.get("/automation", response_class=HTMLResponse, name="automation_log")
def automation_log(request: Request, db: Session = Depends(get_db)):
    user = require_user(request, db)
    return RedirectResponse("/overview", status_code=303)

@router.get("/search", response_class=HTMLResponse, name="search")
def search(request: Request, q: str = "", db: Session = Depends(get_db)):
    user = require_user(request, db)
    return RedirectResponse("/pipeline", status_code=303)

@router.get("/users/new", response_class=HTMLResponse, name="user_new")
def user_new(request: Request, db: Session = Depends(get_db)):
    user = require_user(request, db)
    return RedirectResponse("/settings", status_code=303)

@router.get("/users/{user_id}/edit", response_class=HTMLResponse, name="user_edit")
def user_edit(request: Request, user_id: int, db: Session = Depends(get_db)):
    user = require_user(request, db)
    return RedirectResponse("/settings", status_code=303)

@router.get("/users/{user_id}/assign", response_class=HTMLResponse, name="assign_clients_form")
def assign_clients_form(