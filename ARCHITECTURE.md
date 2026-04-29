# BHAT OVERSEAS SYSTEM — Architecture

Internal recruitment-agency operations dashboard. Single-tenant. Internal staff only — no public client/agent portals.

## High-level architecture

```
┌──────────────────────┐        ┌──────────────────────┐
│  Admin Dashboard     │        │  Sub-Admin Dashboard │
│  (Super-Admin/Admin) │        │  (Documents only)    │
│  React SPA           │        │  React SPA (lite)    │
└──────────┬───────────┘        └──────────┬───────────┘
           │  JWT (aud=bhat-admin)         │  JWT (aud=bhat-subadmin)
           ▼                                ▼
       ┌──────────────────────────────────────────┐
       │  FastAPI gateway                          │
       │   /api/admin/*    → admin auth guard      │
       │   /api/subadmin/* → sub-admin auth guard  │
       └─────────────┬────────────────────────────┘
                     │
       ┌─────────────┼──────────────────────────┐
       │             │                          │
       ▼             ▼                          ▼
   PostgreSQL    Object storage             Services
   (tables)     (./storage/clients/)        - OCR (Tesseract / Vision)
                                            - Expiry rules
                                            - Automation
                                            - CV PDF (ReportLab)
```

## Key design decisions

### 1. Country-first navigation
The user must select a destination country before any pipeline data loads. Every record (client, document, required-doc list) is partitioned by `country_id`. Different countries have different required documents and different expiry rules — modelled in `country_required_docs`.

### 2. Two separate login surfaces, one user table
Admins and Sub-Admins share `users` but log in through different endpoints (`/api/admin/auth/login` vs `/api/subadmin/auth/login`). JWT tokens carry distinct `aud` claims so a Sub-Admin token cannot hit admin routes. The Sub-Admin frontend can also be deployed on a separate subdomain (e.g. `docs.bhatoverseas.com`) without changing the backend.

### 3. Sub-Admin scope = explicit assignment
A Sub-Admin sees only clients in `sub_admin_assignments`. Every Sub-Admin endpoint asserts membership before returning data. This keeps document privacy tight without per-row permissions.

### 4. Documents drive automation
Stage transitions are not manual button clicks — uploading the right document auto-advances the stage (`services/automation.py`). This is what powers the "Automation Log" panel. Manual `Move to Next Step` is still available as an override.

### 5. OCR auto-fills CV
When a Sub-Admin uploads a passport, `scan_passport()` extracts:
full name, passport number, DOB, gender, issue/expiry, **father's name**, **mother's name**, nationality. Bills auto-fill address. Marital status and spouse/wife name are entered manually because they are not on the passport. Marital-status validation (`married` → spouse_name required) lives in both the API and the frontend.

### 6. Police-report 30-day rule
Turkish (and several other) consulates accept police reports issued within 30 days of the VFS appointment. `services/expiry_service.py` raises a warning when:
* the report is uploaded and is already > 23 days old, OR
* a nightly cron sweep finds any client whose VFS date will land beyond the 30-day window.

The frontend renders this as a modal popup (see `index.html` → `#warnModal`).

## Component breakdown

| Layer | File | Responsibility |
|------|------|----------------|
| Entry | `backend/main.py` | FastAPI app, CORS, route mounting |
| Config | `backend/config.py` | Settings loaded from env / .env |
| DB | `backend/database.py` | SQLAlchemy session + init/seed |
| ORM | `backend/models.py` | All tables + assignment join table |
| Schemas | `backend/schemas.py` | Pydantic I/O validation |
| Auth | `backend/auth.py` | Two OAuth schemes, role guards |
| Routes — admin | `routes/auth_routes.py`, `client_routes.py`, `document_routes.py`, `cv_routes.py`, `overview_routes.py`, `user_routes.py` | Admin / Super-Admin API |
| Routes — sub | `routes/subadmin_routes.py` + `routes/auth_routes.py:subadmin_router` | Sub-Admin restricted API |
| Service | `services/ocr_service.py` | Tesseract / Google Vision passport + bill OCR |
| Service | `services/expiry_service.py` | Passport expiry + police-report 30-day rule |
| Service | `services/automation.py` | Doc-upload → stage advancement |
| Service | `services/cv_service.py` | ReportLab CV-to-PDF |
| Frontend | `index.html` | Single-file prototype (would be split into a Vite + React SPA in production) |
| DB schema | `database/schema.sql` | PostgreSQL DDL |

## Role × capability matrix

| Capability | Super Admin | Admin | Sub-Admin | Viewer |
|-----------|:-:|:-:|:-:|:-:|
| Login on admin portal | ✓ | ✓ | ✗ | ✓ |
| Login on sub-admin portal | ✗ | ✗ | ✓ | ✗ |
| View pipeline (kanban) | ✓ | ✓ | ✗ | ✓ (read) |
| Move client between stages | ✓ | ✓ | ✗ | ✗ |
| Upload documents (any client) | ✓ | ✓ | ✗ | ✗ |
| Upload documents (assigned only) | – | – | ✓ | ✗ |
| Build / generate CV | ✓ | ✓ | ✓ (assigned only) | ✗ |
| View overview / analytics | ✓ | ✓ | ✗ | ✓ |
| Create users | ✓ | ✓ (not super) | ✗ | ✗ |
| Assign clients to Sub-Admins | ✓ | ✓ | ✗ | ✗ |
| Delete users | ✓ | ✗ | ✗ | ✗ |
| Edit country list / required docs | ✓ | ✗ | ✗ | ✗ |

## Data flow — sub-admin uploads a passport

1. Sub-Admin opens assigned client → `POST /api/subadmin/clients/{id}/documents/upload` with file + `doc_type=passport`.
2. File is saved to `./storage/clients/{id}/`.
3. `scan_passport()` runs Tesseract → returns structured dict.
4. A new `Document` row is inserted with `expiry_date` from the OCR.
5. The matching `cv_records` row is upserted with `auto_*` fields.
6. `automation.advance_stage_if_eligible()` checks if stage should move.
7. A `TimelineEvent(is_system=True)` is logged → appears in Automation Log.
8. If the passport expires within 6 months, an `Alert` is created.
9. Response returns OCR payload + computed expiry + any warning.

## Frontend structure (production split)

The shipped `index.html` is a single-file prototype. For production:

```
frontend/
  src/
    main.tsx                  # Vite entry, react-router
    pages/
      LoginAdmin.tsx          # /api/admin/auth
      LoginSubAdmin.tsx       # /api/subadmin/auth (separate URL)
      CountrySelect.tsx
      Pipeline/
        PipelineBoard.tsx     # Kanban
        ClientCard.tsx
        ClientDetailPanel.tsx
      Documents/
        DocumentsTable.tsx
        DocumentFilters.tsx
      Overview/
        OverviewPage.tsx
        AlertsBanner.tsx
        StageBarChart.tsx
        TopAgentsList.tsx
      CV/
        CVBuilder.tsx
        OCRDropZone.tsx
        CVPreview.tsx
      Settings/
        UsersTable.tsx
        AssignClientsModal.tsx
    components/
      TopBar.tsx
      Sidebar.tsx
      WarningModal.tsx
    api/
      adminClient.ts          # axios w/ admin token
      subadminClient.ts       # axios w/ subadmin token
    hooks/
      useDragDrop.ts
      useAutoSave.ts
    state/
      authStore.ts            # zustand
      countryStore.ts
```

## Performance targets

* First load to country picker: < 800 ms
* Country selection to populated kanban: < 1.2 s (all 14 columns parallel-fetched)
* Card click → detail panel open: instant (data preloaded with kanban)
* Drag-and-drop card to new stage: optimistic update + background PATCH
* Document upload + OCR: < 5 s for a 2 MB passport scan (Tesseract local)

## Production deployment notes

* Run uvicorn behind nginx with TLS termination.
* PostgreSQL with daily backups + point-in-time recovery.
* Object storage (S3-compatible) for `./storage/clients/`. Sign URLs for downloads.
* Schedule `services.expiry_service.scan_for_expiring_police_reports()` as a 6 AM cron via APScheduler or system cron.
* Run two frontends — `app.bhatoverseas.com` (admin) and `docs.bhatoverseas.com` (sub-admin).
* Strict CORS — only those two origins.
* JWT secret in a secret manager. Rotate quarterly.
* Lock down `./storage/` — no public reads.
