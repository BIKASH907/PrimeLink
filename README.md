# BHAT OVERSEAS SYSTEM

Internal Manpower Recruitment Agency Management Dashboard. **Multi-page server-rendered Python web app.** Internal staff only — no external client/agent logins.

## Live deploy

This is a real Python web app with a database. Deploy in 5 minutes to **Render.com**:

➡ **See [RENDER-DEPLOY.md](RENDER-DEPLOY.md)** — push to GitHub, click Blueprint, you're live.

You'll get a URL like `https://bhat-overseas.onrender.com` with all pages working, real PostgreSQL database, and auto-deploy on every git push.

## What's in this folder

```
bhat-overseas-system/
├── backend/                       # The actual web app — deploy this
│   ├── main.py                    # FastAPI entry — mounts pages, static, API
│   ├── database.py                # SQLAlchemy + auto-seed
│   ├── models.py                  # ORM models
│   ├── auth.py                    # Password hashing, role guards
│   ├── config.py                  # Env settings
│   ├── seed_demo.py               # Demo seed script
│   ├── requirements.txt
│   ├── Procfile                   # Process file (for Render/Railway/Heroku)
│   ├── runtime.txt                # Python version pin
│   ├── templates/                 # Jinja2 HTML pages
│   │   ├── base.html              # Root layout
│   │   ├── app_layout.html        # Layout w/ topbar + sidebar
│   │   ├── country_gate.html      # Romania / Turkey selection
│   │   ├── romania_redirect.html  # Romania notice
│   │   ├── login.html             # Turkey login (3 roles)
│   │   ├── pipeline.html          # 14-stage Kanban
│   │   ├── client_detail.html     # Client info / docs / notes / timeline
│   │   ├── documents.html         # Documents table + filters
│   │   ├── overview.html          # Dashboard summary
│   │   ├── cv_builder.html        # CV with OCR + manual fields
│   │   ├── settings.html          # Users + role matrix
│   │   ├── subadmin_dashboard.html# Sub-admin restricted view
│   │   ├── upload_doc.html        # Upload form
│   │   └── components/
│   │       └── warning_modal.html # 30-day police-report popup
│   ├── static/
│   │   └── css/
│   │       └── main.css           # All styles
│   ├── routes/
│   │   ├── views.py               # HTML page rendering (server-side)
│   │   ├── auth_routes.py         # JSON API auth (admin + sub-admin)
│   │   ├── client_routes.py       # JSON API for clients
│   │   ├── document_routes.py     # JSON API for documents
│   │   ├── cv_routes.py           # JSON API for CV
│   │   ├── overview_routes.py     # JSON API summary
│   │   ├── user_routes.py         # JSON API users
│   │   └── subadmin_routes.py     # JSON API sub-admin scope
│   └── services/
│       ├── ocr_service.py         # Passport / bill OCR
│       ├── expiry_service.py      # 30-day police rule + passport expiry
│       ├── automation.py          # Auto-advance stage on doc upload
│       └── cv_service.py          # CV → PDF (ReportLab)
│
├── database/
│   └── schema.sql                 # PostgreSQL DDL
│
├── render.yaml                    # Render Blueprint (auto-deploys everything)
├── vercel.json                    # Vercel config (for static demo only)
│
├── index.html                     # Standalone single-page demo (no backend needed)
├── README.md                      # This file
├── ARCHITECTURE.md                # System design + role matrix
├── DEPLOY.md                      # Deploy script docs
├── VERCEL-DEPLOY.md               # Vercel guide (for static demo only)
├── RENDER-DEPLOY.md               # ★ Live Python deploy guide ★
├── deploy.sh                      # Multi-target deploy script
├── quick-push.sh                  # Quick git push
└── .gitignore
```

## Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate              # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open <http://localhost:8000>.

You'll see the Romania/Turkey gate. Pick Turkey, log in with seeded credentials below, and the multi-page dashboard works end-to-end with a local SQLite database.

## Seeded credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `bikash@bhatoverseas.com` | `ChangeMe123!` |
| Admin | `anita@bhatoverseas.com`  | `ChangeMe123!` |
| Sub-Admin | `ravi.docs@bhatoverseas.com` | `ChangeMe123!` |

**Change these immediately in production.**

## Pages

| URL | Page | Access |
|-----|------|--------|
| `/` | Country gate (Romania / Turkey) | Public |
| `/romania` | Legacy redirect notice | Public |
| `/login` | Turkey login | Public |
| `/pipeline` | 14-stage Kanban | Admin / Super-Admin |
| `/clients/{id}` | Client detail (info, docs, notes, timeline) | All roles (sub-admin only assigned) |
| `/documents` | Documents table + filters | All roles |
| `/documents/upload` | Upload form (OCR auto-scan) | All roles |
| `/overview` | Dashboard summary + automation log | Admin / Super-Admin |
| `/cv` | CV auto-builder (OCR + manual) | All roles |
| `/settings` | Users + roles | Admin / Super-Admin |
| `/sub` | Sub-admin restricted dashboard | Sub-Admin |
| `/api/admin/*`, `/api/subadmin/*` | JSON API | Token auth |

## Features delivered

- **Country-first** — Romania / Turkey gate before login. Romania routes to existing legacy backend.
- **3 roles** — Super Admin, Admin, Sub-Admin. Sub-Admin only sees clients explicitly assigned.
- **14-step Kanban pipeline** — separate page, click a card to drill into client detail page.
- **Client detail page** — info, documents, notes, timeline, "Move to Next Step" button.
- **Documents page** — full-text filters (All / Missing / Expiring / Verified).
- **Overview page** — stats, top agents, alerts, automation log.
- **CV Auto-Builder** — OCR auto-extracts father's name, mother's name, passport details from passport scans + addresses from bills. Manual marital status / spouse name / religion / position / experience.
- **Auto stage advancement** — uploading a passport advances Doc Collection → Advance Paid, etc.
- **Police-report 30-day rule** — popup warning if a report is approaching/exceeding 30 days before VFS.
- **Real database** — PostgreSQL on Render, SQLite locally.
- **Real auth** — bcrypt passwords, HTTP-only session cookies for browser, JWT for API.

## Read next

- **[RENDER-DEPLOY.md](RENDER-DEPLOY.md)** — push to live in 5 min
- [ARCHITECTURE.md](ARCHITECTURE.md) — system design + role matrix
- [database/schema.sql](database/schema.sql) — full PostgreSQL DDL
