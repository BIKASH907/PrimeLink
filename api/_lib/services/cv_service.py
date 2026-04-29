"""
Auto-CV generator.

Renders a CVRecord (auto + manual fields) into a polished PDF using ReportLab.
Output path is ./storage/cv/<client_id>.pdf
"""
import os
from datetime import date
from models import CVRecord


def generate_cv_pdf(cv: CVRecord) -> str:
    """Generate a PDF for a CV record. Returns the saved file path."""
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import mm
        from reportlab.lib import colors
        from reportlab.platypus import (
            SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
        )
    except ImportError as e:
        raise RuntimeError("ReportLab not installed. Run: pip install reportlab") from e

    out_dir = "./storage/cv"
    os.makedirs(out_dir, exist_ok=True)
    path = f"{out_dir}/client_{cv.client_id}.pdf"

    doc = SimpleDocTemplate(
        path, pagesize=A4,
        leftMargin=18*mm, rightMargin=18*mm,
        topMargin=18*mm, bottomMargin=18*mm,
    )

    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("h1", parent=styles["Heading1"],
                        fontSize=20, spaceAfter=4)
    sub = ParagraphStyle("sub", parent=styles["Normal"],
                         fontSize=11, textColor=colors.grey, spaceAfter=14)
    h3 = ParagraphStyle("h3", parent=styles["Heading3"],
                        fontSize=11, textTransform="uppercase",
                        spaceBefore=10, spaceAfter=4)

    story = []

    # ----- Header -----
    story.append(Paragraph(_safe(cv.auto_full_name) or "Candidate Name", h1))
    story.append(Paragraph(
        f"{_safe(cv.position_applied) or 'Position'} — "
        f"{cv.years_experience or 0} years experience", sub))

    # ----- Personal -----
    story.append(Paragraph("Personal Information", h3))
    rows = [
        ("Father's Name",   _safe(cv.auto_father_name)),
        ("Mother's Name",   _safe(cv.auto_mother_name)),
        ("Marital Status",  (cv.marital_status or "single").title()),
    ]
    if cv.marital_status == "married":
        rows.append(("Spouse Name", _safe(cv.spouse_name)))
    rows += [
        ("Date of Birth",  cv.auto_dob.strftime("%d %B %Y") if cv.auto_dob else ""),
        ("Gender",         _safe(cv.auto_gender)),
        ("Religion",       _safe(cv.religion)),
        ("Nationality",    _safe(cv.auto_nationality)),
    ]
    story.append(_kv_table(rows))

    # ----- Passport -----
    story.append(Paragraph("Passport Details", h3))
    story.append(_kv_table([
        ("Passport No.",   _safe(cv.auto_passport_no)),
        ("Issue Date",     cv.auto_passport_issue.strftime("%d %B %Y") if cv.auto_passport_issue else ""),
        ("Expiry Date",    cv.auto_passport_expiry.strftime("%d %B %Y") if cv.auto_passport_expiry else ""),
    ]))

    # ----- Contact -----
    story.append(Paragraph("Contact", h3))
    story.append(_kv_table([
        ("Permanent Address",  _safe(cv.permanent_address) or _safe(cv.auto_address)),
    ]))

    # ----- Skills -----
    story.append(Paragraph("Skills & Languages", h3))
    story.append(_kv_table([
        ("Position Applied",   _safe(cv.position_applied)),
        ("Years Experience",   str(cv.years_experience or "")),
        ("Languages",          _safe(cv.languages)),
    ]))

    doc.build(story)
    return path


def _safe(v): return v or ""


def _kv_table(rows):
    from reportlab.platypus import Table, TableStyle
    from reportlab.lib import colors
    from reportlab.lib.units import mm
    t = Table(rows, colWidths=[55*mm, 110*mm])
    t.setStyle(TableStyle([
        ("FONTNAME", (0,0), (-1,-1), "Helvetica"),
        ("FONTSIZE", (0,0), (-1,-1), 10),
        ("TEXTCOLOR", (0,0), (0,-1), colors.HexColor("#555555")),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("LINEBELOW", (0,0), (-1,-1), 0.25, colors.HexColor("#dddddd")),
    ]))
    return t
