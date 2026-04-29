"""SQLAlchemy DB session + base + initialization helpers."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from config import settings


# Render gives DATABASE_URL as `postgres://…` — SQLAlchemy 2 expects
# `postgresql+psycopg2://…`. Normalize here so the same code runs locally
# (SQLite) and in production (Postgres).
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif db_url.startswith("postgresql://") and "+psycopg2" not in db_url:
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

engine = create_engine(
    db_url,
    connect_args={"check_same_thread": False} if db_url.startswith("sqlite") else {},
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()


def init_db():
    """Create tables if missing, then seed countries + Super-Admin."""
    import models  # ensure metadata is populated
    Base.metadata.create_all(bind=engine)

    from auth import hash_password
    from models import User, Role, Country, CountryRequiredDoc

    db = SessionLocal()
    try:
        # Seed countries
        if not db.query(Country).first():
            countries = [
                ("Turkey", "TR", "🇹🇷"),
                ("Saudi Arabia", "SA", "🇸🇦"),
                ("UAE", "AE", "🇦🇪"),
                ("Qatar", "QA", "🇶🇦"),
                ("Oman", "OM", "🇴🇲"),
                ("Kuwait", "KW", "🇰🇼"),
                ("Malaysia", "MY", "🇲🇾"),
                ("Singapore", "SG", "🇸🇬"),
            ]
            for n, c, f in countries:
                db.add(Country(name=n, iso_code=c, flag=f))
            db.commit()

        # Seed required docs for Turkey (template — copy/adjust per country)
        tr = db.query(Country).filter(Country.iso_code == "TR").first()
        if tr and not db.query(CountryRequiredDoc).filter_by(country_id=tr.id).first():
            for dt, stage, has_exp, warn in [
                ("passport",         "doc_collection",   True,  180),
                ("citizenship",      "doc_collection",   False, 0),
                ("photographs",      "doc_collection",   False, 0),
                ("police_report",    "pcc_apply",        True,  30),
                ("medical_report",   "doc_collection",   True,  90),
                ("vfs_receipt",      "vfs_appointment",  False, 0),
                ("kimlik_receipt",   "kimlik_fee_paid",  False, 0),
                ("flight_ticket",    "flight_ticket",    False, 0),
            ]:
                db.add(CountryRequiredDoc(
                    country_id=tr.id, doc_type=dt, required_at_stage=stage,
                    has_expiry=has_exp, expiry_warning_days=warn,
                ))
            db.commit()

        # Seed users for both Romania and Turkey if no users yet.
        # Email convention: <name>.<country>@bhatoverseas.com — login is
        # validated against this suffix so a Romania account can't access
        # Turkey and vice versa. The single Super-Admin (no suffix) sees all.
        if not db.query(User).first():
            users = [
                # Cross-country super admin
                ("Bikash Bhat",  "bikash@bhatoverseas.com",     Role.SUPER_ADMIN),
                # Turkey
                ("Bikash (TR)",  "bikash.tr@bhatoverseas.com",  Role.SUPER_ADMIN),
                ("Anita Sharma", "anita.tr@bhatoverseas.com",   Role.ADMIN),
                ("Ravi Pandey",  "ravi.tr@bhatoverseas.com",    Role.SUB_ADMIN),
                # Romania
                ("Bikash (RO)",  "bikash.ro@bhatoverseas.com",  Role.SUPER_ADMIN),
                ("Maria Popescu","anita.ro@bhatoverseas.com",   Role.ADMIN),
                ("Vlad Ionescu", "ravi.ro@bhatoverseas.com",    Role.SUB_ADMIN),
            ]
            for name, email, role in users:
                db.add(User(full_name=name, email=email,
                            password_hash=hash_password("ChangeMe123!"),
                            role=role))
            db.commit()
    finally:
        db.close()
