"""
Expiry & validity rules.

Two key business rules:

1) Passport expiry — read directly from OCR. If the passport expires within
   6 months, raise an `Alert` of severity=warn.

2) Police Report 30-day rule — Turkish (and several other) consulates only
   accept police reports issued within the last 30 days at the VFS
   appointment. We must warn staff BEFORE the report crosses 30 days.

   Trigger sources:
     - When a police report is uploaded -> compute days_until_expiry
       relative to (a) today, (b) the client's VFS appointment date if known.
     - A nightly cron job calls `scan_for_expiring_police_reports` to raise
       alerts for any client whose police report will pass 30 days before
       their VFS slot.
"""
from datetime import date, datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session

from models import Client, Document, Alert, DocStatus


POLICE_REPORT_VALIDITY_DAYS = 30
POLICE_REPORT_WARNING_DAYS  = 7   # warn when 7 days remain
PASSPORT_WARNING_MONTHS     = 6


# ---------- Passport ----------
def compute_passport_expiry(issue_date: Optional[date]) -> Optional[date]:
    """Nepali passports are valid 10 years; fallback if expiry not OCR-extracted."""
    if not issue_date: return None
    try:
        return issue_date.replace(year=issue_date.year + 10)
    except ValueError:
        return issue_date + timedelta(days=365 * 10)


def is_passport_expiring_soon(expiry: date) -> bool:
    if not expiry: return False
    return expiry <= date.today() + timedelta(days=PASSPORT_WARNING_MONTHS * 30)


# ---------- Police Report 30-day rule ----------
def compute_police_report_warning(
    client: Client, issue_date: date, db: Session
) -> Optional[dict]:
    """
    Returns a dict describing the warning, or None if the report is fine.
    Also persists an Alert if severity is warn or danger.

    The frontend uses this to render the popup modal:
      "Police Report nearing 30-day mark — re-issue before VFS"
    """
    today = date.today()
    age_days = (today - issue_date).days
    days_remaining = POLICE_REPORT_VALIDITY_DAYS - age_days

    # If the client already has a VFS date stored as metadata, use that as the
    # reference instead of "today".
    vfs_date = _client_vfs_date(client)
    if vfs_date:
        # Will the report be > 30 days old at VFS time?
        age_at_vfs = (vfs_date - issue_date).days
        if age_at_vfs >= POLICE_REPORT_VALIDITY_DAYS:
            return _raise_alert(
                db, client,
                kind="police_report_30d", severity="danger",
                message=(f"Police Report issued {issue_date} will be "
                         f"{age_at_vfs} days old at VFS on {vfs_date}. "
                         f"Re-issue before VFS appointment.")
            )

    if days_remaining <= 0:
        return _raise_alert(db, client, "police_report_expired", "danger",
            f"Police Report ({issue_date}) is {age_days} days old — already invalid.")
    if days_remaining <= POLICE_REPORT_WARNING_DAYS:
        return _raise_alert(db, client, "police_report_30d", "warn",
            f"Police Report nearing 30-day mark "
            f"({age_days} days old, {days_remaining} days remaining).")

    return None


def scan_for_expiring_police_reports(db: Session) -> list[dict]:
    """
    Nightly cron: surface any client whose police report is approaching 30 days
    AND who has a VFS appointment scheduled.
    """
    raised = []
    docs = db.query(Document).filter(
        Document.doc_type == "police_report",
        Document.status == DocStatus.OK,
    ).all()
    for d in docs:
        if not d.issue_date: continue
        warning = compute_police_report_warning(d.client, d.issue_date, db)
        if warning: raised.append(warning)
    db.commit()
    return raised


# ---------- helpers ----------
def _client_vfs_date(client: Client) -> Optional[date]:
    """Look in timeline / notes for a recorded VFS date. Replace with a real
    VFS-appointment field on the client when you wire up scheduling."""
    for ev in client.timeline:
        if ev.event_type == "vfs_booked" and ev.description:
            try:
                return datetime.strptime(ev.description.split()[-1], "%Y-%m-%d").date()
            except Exception:
                continue
    return None


def _raise_alert(db: Session, client: Client,
                 kind: str, severity: str, message: str) -> dict:
    alert = Alert(client_id=client.id, kind=kind,
                  severity=severity, message=message)
    db.add(alert)
    return {
        "client_id": client.id,
        "ref_no": client.ref_no,
        "name": client.full_name,
        "kind": kind, "severity": severity, "message": message,
    }
