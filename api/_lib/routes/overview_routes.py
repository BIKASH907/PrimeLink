"""
Overview / dashboard summary endpoints — admin surface.
Returns the data shown on the Overview page (stats, top agents, alerts).
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from collections import Counter
from datetime import datetime, timedelta

from database import get_db
from auth import current_admin
from models import Client, Document, Alert, DocStatus, PIPELINE_STAGES

router = APIRouter()


@router.get("/")
def overview(country_id: int = Query(...),
             db: Session = Depends(get_db),
             _u = Depends(current_admin)):
    clients = db.query(Client).filter(Client.country_id == country_id).all()

    # stage breakdown
    stage_counts = Counter(c.stage for c in clients)
    stages = [
        {"stage": s, "count": stage_counts.get(s, 0)}
        for s in PIPELINE_STAGES
    ]

    # top agents
    agents = Counter(c.agent_name for c in clients if c.agent_name)
    top_agents = [
        {"name": n, "volume": v}
        for n, v in agents.most_common(5)
    ]

    # delayed cases (>14 days in current stage)
    threshold = datetime.utcnow() - timedelta(days=14)
    delayed = [c.id for c in clients if c.stage_entered_at and c.stage_entered_at < threshold]

    # missing docs
    missing = (db.query(Document)
                 .join(Client, Document.client_id == Client.id)
                 .filter(Client.country_id == country_id,
                         Document.status == DocStatus.MISSING).count())

    # active alerts
    alerts = (db.query(Alert)
                .join(Client, Alert.client_id == Client.id)
                .filter(Client.country_id == country_id,
                        Alert.is_resolved == False).all())

    return {
        "total_clients":     len(clients),
        "urgent_count":      sum(1 for c in clients if c.is_urgent),
        "delayed_count":     len(delayed),
        "missing_doc_count": missing,
        "stages":            stages,
        "top_agents":        top_agents,
        "alerts": [
            {"id": a.id, "kind": a.kind, "severity": a.severity,
             "message": a.message, "client_id": a.client_id,
             "created_at": a.created_at.isoformat()}
            for a in alerts
        ],
    }
