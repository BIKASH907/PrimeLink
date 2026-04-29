"""
SQLAlchemy ORM models for Bhat Overseas System.

Hierarchy: Country -> Company -> Client -> (Documents / Notes / Timeline)

Roles:
    SUPER_ADMIN -> full access (incl. user management)
    ADMIN       -> full access except managing super admins
    SUB_ADMIN   -> only sees clients explicitly assigned to them; can upload
                   documents and build CVs for those clients
"""
import enum
from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Date,
    Enum, Table, UniqueConstraint
)
from sqlalchemy.orm import relationship
from database import Base


# ---------- ENUMS ----------
class Role(str, enum.Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN       = "admin"
    SUB_ADMIN   = "sub_admin"
    VIEWER      = "viewer"


class DocStatus(str, enum.Enum):
    OK         = "ok"        # uploaded + verified
    MISSING    = "missing"   # required, not uploaded
    EXPIRING   = "expiring"  # uploaded but expiry approaching
    EXPIRED    = "expired"


# ---------- ASSIGNMENT (sub-admin <-> client) ----------
sub_admin_assignments = Table(
    "sub_admin_assignments",
    Base.metadata,
    Column("user_id",   Integer, ForeignKey("users.id",    ondelete="CASCADE"), primary_key=True),
    Column("client_id", Integer, ForeignKey("clients.id",  ondelete="CASCADE"), primary_key=True),
    Column("assigned_by_id", Integer, ForeignKey("users.id")),
    Column("assigned_at", DateTime, default=datetime.utcnow),
)


# ---------- USER ----------
class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True)
    full_name     = Column(String(120), nullable=False)
    email         = Column(String(160), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role          = Column(Enum(Role), nullable=False, default=Role.SUB_ADMIN)
    is_active     = Column(Boolean, default=True)
    last_login_at = Column(DateTime)
    created_at    = Column(DateTime, default=datetime.utcnow)

    assigned_clients = relationship(
        "Client",
        secondary=sub_admin_assignments,
        primaryjoin="User.id == sub_admin_assignments.c.user_id",
        secondaryjoin="Client.id == sub_admin_assignments.c.client_id",
        back_populates="assigned_subadmins",
    )


# ---------- COUNTRY ----------
class Country(Base):
    __tablename__ = "countries"

    id        = Column(Integer, primary_key=True)
    name      = Column(String(80), unique=True, nullable=False)   # Turkey, UAE, etc.
    iso_code  = Column(String(3),  unique=True, nullable=False)   # TR, AE
    flag      = Column(String(8))                                 # emoji 🇹🇷
    is_active = Column(Boolean, default=True)

    companies        = relationship("Company", back_populates="country", cascade="all, delete")
    required_docs    = relationship("CountryRequiredDoc", back_populates="country", cascade="all, delete")
    clients          = relationship("Client", back_populates="country")


# ---------- COMPANY ----------
class Company(Base):
    __tablename__ = "companies"

    id         = Column(Integer, primary_key=True)
    country_id = Column(Integer, ForeignKey("countries.id", ondelete="CASCADE"), nullable=False)
    name       = Column(String(160), nullable=False)
    contact    = Column(String(160))
    notes      = Column(Text)

    country = relationship("Country", back_populates="companies")
    clients = relationship("Client",  back_populates="company")


# ---------- CLIENT ----------
PIPELINE_STAGES = [
    "doc_collection", "advance_paid", "pcc_apply", "vfs_appointment",
    "reference_agent_info", "amount_paid", "entry_approval", "kimlik_fee_paid",
    "client_money_paid", "second_vfs", "passport_collection", "sharam",
    "flight_ticket", "flight_status",
]


class Client(Base):
    __tablename__ = "clients"

    id           = Column(Integer, primary_key=True)
    ref_no       = Column(String(40), unique=True, nullable=False)  # BHAT-REF-001
    full_name    = Column(String(160), nullable=False)
    country_id   = Column(Integer, ForeignKey("countries.id"), nullable=False)
    company_id   = Column(Integer, ForeignKey("companies.id"))

    # agent stored as text (no login); per spec
    agent_name   = Column(String(160))

    position     = Column(String(120))
    stage        = Column(String(40), default="doc_collection")  # one of PIPELINE_STAGES
    progress     = Column(Integer, default=1)                    # 1..14
    is_urgent    = Column(Boolean, default=False)

    created_at   = Column(DateTime, default=datetime.utcnow)
    updated_at   = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    stage_entered_at = Column(DateTime, default=datetime.utcnow)

    country  = relationship("Country", back_populates="clients")
    company  = relationship("Company", back_populates="clients")
    documents = relationship("Document",       back_populates="client", cascade="all, delete")
    notes     = relationship("Note",           back_populates="client", cascade="all, delete")
    timeline  = relationship("TimelineEvent",  back_populates="client", cascade="all, delete")
    cv_data   = relationship("CVRecord",       back_populates="client", uselist=False, cascade="all, delete")

    assigned_subadmins = relationship(
        "User",
        secondary=sub_admin_assignments,
        primaryjoin="Client.id == sub_admin_assignments.c.client_id",
        secondaryjoin="User.id == sub_admin_assignments.c.user_id",
        back_populates="assigned_clients",
    )


# ---------- DOCUMENTS ----------
class CountryRequiredDoc(Base):
    """Each country defines its own required document set, mapped to stages."""
    __tablename__ = "country_required_docs"
    __table_args__ = (UniqueConstraint("country_id", "doc_type"),)

    id          = Column(Integer, primary_key=True)
    country_id  = Column(Integer, ForeignKey("countries.id", ondelete="CASCADE"), nullable=False)
    doc_type    = Column(String(60), nullable=False)   # passport, police_report, vfs_receipt...
    required_at_stage = Column(String(40))             # e.g. "vfs_appointment"
    has_expiry  = Column(Boolean, default=False)
    expiry_warning_days = Column(Integer, default=30)  # warn N days before expiry

    country = relationship("Country", back_populates="required_docs")


class Document(Base):
    __tablename__ = "documents"

    id            = Column(Integer, primary_key=True)
    client_id     = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    doc_type      = Column(String(60), nullable=False)
    file_path     = Column(String(400))                # storage path
    issue_date    = Column(Date)
    expiry_date   = Column(Date)                       # auto-set from OCR for passport
    status        = Column(Enum(DocStatus), default=DocStatus.OK)
    uploaded_by_id = Column(Integer, ForeignKey("users.id"))
    uploaded_at   = Column(DateTime, default=datetime.utcnow)

    # OCR raw payload (for audit)
    ocr_extracted = Column(Text)

    client = relationship("Client", back_populates="documents")


# ---------- CV ----------
class CVRecord(Base):
    """Auto-CV data — fields prefixed with `auto_` are populated from OCR."""
    __tablename__ = "cv_records"

    id              = Column(Integer, primary_key=True)
    client_id       = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), unique=True)

    # Auto-extracted from passport / bills (OCR)
    auto_full_name      = Column(String(160))
    auto_passport_no    = Column(String(40))
    auto_dob            = Column(Date)
    auto_gender         = Column(String(10))
    auto_passport_issue = Column(Date)
    auto_passport_expiry= Column(Date)
    auto_father_name    = Column(String(160))
    auto_mother_name    = Column(String(160))
    auto_address        = Column(String(255))
    auto_nationality    = Column(String(60))

    # Manual fields
    marital_status   = Column(String(20), default="single")    # single | married
    spouse_name      = Column(String(160))                     # required if married
    religion         = Column(String(40))
    permanent_address= Column(String(255))
    position_applied = Column(String(120))
    years_experience = Column(Integer)
    languages        = Column(String(200))

    generated_pdf_path = Column(String(400))
    updated_at         = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    client = relationship("Client", back_populates="cv_data")


# ---------- NOTES ----------
class Note(Base):
    __tablename__ = "notes"
    id         = Column(Integer, primary_key=True)
    client_id  = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    author_id  = Column(Integer, ForeignKey("users.id"))
    body       = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="notes")


# ---------- TIMELINE ----------
class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id         = Column(Integer, primary_key=True)
    client_id  = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    actor_id   = Column(Integer, ForeignKey("users.id"))
    is_system  = Column(Boolean, default=False)        # auto-generated event
    event_type = Column(String(60))                    # stage_advanced / doc_uploaded / note_added
    description= Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="timeline")


# ---------- ALERTS ----------
class Alert(Base):
    """Surfaced as toast / popup in the dashboard."""
    __tablename__ = "alerts"

    id         = Column(Integer, primary_key=True)
    client_id  = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"))
    kind       = Column(String(40))   # police_report_30d / passport_expiring / delayed_stage
    severity   = Column(String(20))   # info | warn | danger
    message    = Column(Text)
    is_resolved= Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
