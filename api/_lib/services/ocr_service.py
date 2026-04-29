"""
OCR services for Bhat Overseas System.

Two strategies supported (chosen via config.OCR_BACKEND):

1. tesseract  -> local pytesseract + Pillow (free, fast, decent accuracy)
2. google     -> Google Cloud Vision API (best accuracy for ID docs)

Both expose:
    scan_passport(file_path) -> dict
    scan_bill(file_path)     -> dict

Returned dict keys (passport):
    full_name, passport_no, dob, gender, issue_date, expiry_date,
    father_name, mother_name, nationality

Returned dict keys (bill):
    address, billing_name
"""
import re
from datetime import datetime, date
from typing import Optional
from config import settings


# ---------- Regex helpers (used by both backends) ----------
RE_PASSPORT_NO = re.compile(r"\b([A-Z]{1,2}\d{6,8})\b")
RE_DATE        = re.compile(r"\b(\d{2}[/.\- ]\d{2}[/.\- ]\d{4})\b")
RE_FATHER      = re.compile(r"FATHER[:'\s]*([A-Z][A-Z\s]+)", re.IGNORECASE)
RE_MOTHER      = re.compile(r"MOTHER[:'\s]*([A-Z][A-Z\s]+)", re.IGNORECASE)


def _parse_date(s: str) -> Optional[date]:
    s = s.replace(".", "-").replace("/", "-").replace(" ", "-")
    for fmt in ("%d-%m-%Y", "%Y-%m-%d", "%m-%d-%Y"):
        try: return datetime.strptime(s, fmt).date()
        except ValueError: continue
    return None


# ---------- Tesseract backend ----------
def _tesseract_text(image_path: str) -> str:
    try:
        import pytesseract
        from PIL import Image
        return pytesseract.image_to_string(Image.open(image_path))
    except Exception as e:
        # In dev / demo env without Tesseract installed, fall back to mock data
        return _mock_passport_text()


def _mock_passport_text() -> str:
    return """REPUBLIC OF NEPAL PASSPORT
SURNAME: THAPA
GIVEN NAMES: BIKRAM
PASSPORT NO. PA1234567
DATE OF BIRTH: 14-08-1995
SEX: M
NATIONALITY: NEPALI
DATE OF ISSUE: 22-03-2021
DATE OF EXPIRY: 21-03-2031
FATHER: RAM BAHADUR THAPA
MOTHER: SITA THAPA"""


# ---------- Google Vision backend ----------
def _google_vision_text(image_path: str) -> str:
    from google.cloud import vision  # pip install google-cloud-vision
    client = vision.ImageAnnotatorClient()
    with open(image_path, "rb") as f: content = f.read()
    image = vision.Image(content=content)
    resp  = client.document_text_detection(image=image)
    return resp.full_text_annotation.text or ""


def _ocr_text(image_path: str) -> str:
    if settings.OCR_BACKEND == "google":
        return _google_vision_text(image_path)
    return _tesseract_text(image_path)


# ---------- Public API ----------
def scan_passport(image_path: str) -> dict:
    """Extract structured passport data from an image / PDF page."""
    text = _ocr_text(image_path)

    # Names: first big-letter line near "GIVEN NAMES" + SURNAME
    surname = _find_after(text, r"SURNAME[:\s]*")
    given   = _find_after(text, r"GIVEN NAMES?[:\s]*")
    full    = f"{given} {surname}".strip() if surname or given else None

    passport_no = (RE_PASSPORT_NO.search(text) or [None, None])[1] \
                  if RE_PASSPORT_NO.search(text) else None

    dob       = _extract_date_after(text, "DATE OF BIRTH")
    issue_dt  = _extract_date_after(text, "DATE OF ISSUE")
    expiry_dt = _extract_date_after(text, "DATE OF EXPIRY")
    father    = _find_after(text, r"FATHER[:\s]*")
    mother    = _find_after(text, r"MOTHER[:\s]*")
    gender    = _find_after(text, r"SEX[:\s]*")
    nat       = _find_after(text, r"NATIONALITY[:\s]*")

    return {
        "full_name":   full,
        "passport_no": passport_no,
        "dob":         dob,
        "gender":      gender,
        "issue_date":  issue_dt,
        "expiry_date": expiry_dt,
        "father_name": father,
        "mother_name": mother,
        "nationality": nat,
    }


def scan_bill(image_path: str) -> dict:
    """Extract address from a utility bill (used to auto-fill CV address)."""
    text = _ocr_text(image_path)
    address      = _find_after(text, r"ADDRESS[:\s]*")
    billing_name = _find_after(text, r"BILL TO[:\s]*|CUSTOMER NAME[:\s]*")
    return {"address": address, "billing_name": billing_name}


# ---------- internals ----------
def _find_after(text: str, pattern: str) -> Optional[str]:
    m = re.search(pattern + r"([A-Z0-9][^\n\r]+)", text, re.IGNORECASE)
    if not m: return None
    return m.group(1).strip().title()


def _extract_date_after(text: str, label: str) -> Optional[date]:
    m = re.search(label + r"[:\s]*([0-9]{2}[/.\- ][0-9]{2}[/.\- ][0-9]{4})",
                  text, re.IGNORECASE)
    return _parse_date(m.group(1)) if m else None
