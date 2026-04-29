"""
Seed demo clients across BOTH Romania and Turkey + a sub-admin assignment.
Run:
    python seed_demo.py
"""
from datetime import datetime, timedelta
from random import choice, random

from database import SessionLocal, init_db
from models import (
    Client, Company, Country, User, Role, TimelineEvent, PIPELINE_STAGES,
)


COUNTRY_DATA = {
    "TR": {
        "companies": ["Anatolia Construction Ltd.", "Bosphorus Industries",
                      "Istanbul Heavy Works", "Marmara Logistics"],
        "agents":    ["Ramesh Kumar", "Suresh Mehra", "Anil Pradhan", "Manoj Rai"],
        "names":     ["Bikram Thapa", "Sita Rai", "Kishor Lama", "Rajesh Magar",
                      "Manish KC", "Hari Shrestha", "Nabin Tamang", "Sunita Karki",
                      "Bishnu Subedi", "Pradeep Khadka", "Krishna Pandey", "Rabi Bhandari"],
    },
    "RO": {
        "companies": ["Bucharest Build SRL", "Cluj Manufacturing",
                      "Timisoara Logistics", "Dacia Industrial"],
        "agents":    ["Ramesh Kumar", "Anil Pradhan", "Deepak Khanal"],
        "names":     ["Dipesh Magar", "Anita Tamang", "Sandeep KC",
                      "Kamal Shrestha", "Rina Subedi", "Pradip Lama",
                      "Govind Karki", "Binod Rai"],
    },
}


def main():
    init_db()
    db = SessionLocal()

    for code, data in COUNTRY_DATA.items():
        country = db.query(Country).filter(Country.iso_code == code).first()
        if not country:
            print(f"Skip {code} — country row missing")
            continue

        # Companies
        if not db.query(Company).filter(Company.country_id == country.id).first():
            for nm in data["companies"]:
                db.add(Company(country_id=country.id, name=nm))
            db.commit()
        companies = db.query(Company).filter(Company.country_id == country.id).all()

        # Clients
        if db.query(Client).filter(Client.country_id == country.id).count() == 0:
            for i, n in enumerate(data["names"], 1):
                stage_idx = i % len(PIPELINE_STAGES)
                last = db.query(Client).order_by(Client.id.desc()).first()
                ref = f"BHAT-REF-{((last.id if last else 0) + 1):03d}"
                c = Client(
                    ref_no=ref, full_name=n,
                    country_id=country.id, company_id=choice(companies).id,
                    agent_name=choice(data["agents"]),
                    stage=PIPELINE_STAGES[stage_idx],
                    progress=stage_idx + 1,
                    is_urgent=random() < 0.15,
                    stage_entered_at=datetime.utcnow() - timedelta(days=int(random() * 20)),
                )
                db.add(c); db.flush()
                db.add(TimelineEvent(client_id=c.id, event_type="created",
                                     description=f"Client {n} created (seed)"))
            db.commit()

        # Assign 2 clients to the country's sub-admin
        sub_email = f"ravi.{code.lower()}@bhatoverseas.com"
        sub = db.query(User).filter(User.email == sub_email).first()
        if sub and not sub.assigned_clients:
            sub.assigned_clients = (
                db.query(Client).filter(Client.country_id == country.id).limit(2).all()
            )
            db.commit()

    total = db.query(Client).count()
    print(f"Total clients seeded: {total}")
    print(f"  Turkey:  {db.query(Client).join(Country).filter(Country.iso_code == 'TR').count()}")
    print(f"  Romania: {db.query(Client).join(Country).filter(Country.iso_code == 'RO').count()}")
    db.close()


if __name__ == "__main__":
    main()
