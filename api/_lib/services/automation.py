"""
Automation rules — auto-advance pipeline stages when key documents arrive.

This is what powers the "Automation Log" panel in the dashboard. Examples:

    Passport uploaded  -> moves client out of Doc Collection
    VFS receipt added  -> advances to Reference (Agent Info)
    Flight ticket added-> advances to Flight Status

Keep this file simple — it is a rules engine, not an ML pipeline.
"""
from datetime import datetime
from sqlalchemy.orm import Session

from models import Client, Document, TimelineEvent, PIPELINE_STAGES, DocStatus


# Map: required document -> stage that should be reached after upload.
DOC_STAGE_TRIGGERS = {
    "passport":            "advance_paid",          # leave Doc Collection
    "advance_payment":     "pcc_apply",
    "police_report":       "vfs_appointment",
    "vfs_receipt":         "reference_agent_info",
    "amount_payment":      "entry_approval",
    "kimlik_receipt":      "client_money_paid",
    "passport_returned":   "sharam",
    "flight_ticket":       "flight_status",
}


def advance_stage_if_eligible(client: Client, db: Session) -> bool:
    """
    Re-evaluate the client's stage based on the documents currently uploaded.
    Only ever advances forward — never moves a client backward.
    Returns True if a stage change happened.
    """
    uploaded_types = {
        d.doc_type for d in client.documents
        if d.status in (DocStatus.OK, DocStatus.EXPIRING)
    }

    target_stage = client.stage
    target_idx   = PIPELINE_STAGES.index(client.stage)

    for doc_type, stage in DOC_STAGE_TRIGGERS.items():
        if doc_type in uploaded_types:
            idx = PIPELINE_STAGES.index(stage)
            if idx > target_idx:
                target_stage, target_idx = stage, idx

    if target_stage == client.stage:
        return False

    old_stage = client.stage
    client.stage    = target_stage
    client.progress = target_idx + 1
    client.stage_entered_at = datetime.utcnow()

    db.add(TimelineEvent(
        client_id=client.id,
        is_system=True,
        event_type="stage_advanced_auto",
        description=f"Auto-advanced {old_stage} → {target_stage} based on uploaded documents",
    ))
    return True
