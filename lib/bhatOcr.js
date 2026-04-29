// =====================================================
// BHAT OVERSEAS — OCR helper (with Gemini cleanup)
// Pipeline:
//   1. Image → OCR.space / Vision    (raw text + per-line confidence)
//   2. Raw text → Gemini              (clean structured JSON + confidence)
//   3. Fallback: regex extraction     (used if both above fail)
// Output:
//   { ...fields, _meta: { mock, confidence, source, raw_text_preview } }
// =====================================================

import { cleanWithGemini, extractWithGeminiVision } from './bhatGemini';

const PASSPORT_NO_RE = /\b([A-Z]{1,2}\d{6,8})\b/;
const DATE_RE        = /(\d{2}[/.\- ]\d{2}[/.\- ]\d{4})/;

function parseDate(s) {
  if (!s) return null;
  const c = s.replace(/[./ ]/g, '-');
  const fmts = ['DD-MM-YYYY','YYYY-MM-DD','MM-DD-YYYY'];
  for (const fmt of fmts) {
    const parts = c.split('-');
    if (parts.length !== 3) continue;
    let [a,b,y] = parts.map(Number);
    if (fmt === 'YYYY-MM-DD') [y,a,b] = parts.map(Number);
    if (fmt === 'MM-DD-YYYY') [b,a,y] = parts.map(Number);
    if (y && a && b && y > 1900 && y < 2100) {
      const d = new Date(Date.UTC(y, a - 1, b));
      if (!isNaN(d.getTime())) return d.toISOString().slice(0,10);
    }
  }
  return null;
}

// ---------- regex extraction ----------
const REGEX_LABEL_WORDS = [
  'SURNAME','FORENAMES','FORENAME','GIVEN NAMES','GIVEN NAME','NAME OF','NAME',
  'FAMILY NAME','LAST NAME','FIRST NAME','MIDDLE NAME',
  "FATHER'S NAME",'FATHERS NAME','FATHER NAME','FATHER',
  "MOTHER'S NAME",'MOTHERS NAME','MOTHER NAME','MOTHER',
  'DATE OF BIRTH','DOB','SEX','GENDER','NATIONALITY',
  'PASSPORT NO','PASSPORT NUMBER','PASSPORT',
  'DATE OF ISSUE','DATE OF EXPIRY','ISSUING AUTHORITY',
  'PLACE OF BIRTH','REPUBLIC OF',
];
function stripLabels(v) {
  if (!v) return null;
  let s = v;
  for (const w of REGEX_LABEL_WORDS) {
    const re = new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    s = s.replace(re, '');
  }
  s = s.replace(/[/<>:.,;\-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (s && s === s.toUpperCase()) {
    s = s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
  return s || null;
}

function regexExtract(text) {
  const T = text.replace(/\r/g,'').toUpperCase();
  const matchAfter = (label) => {
    const re = new RegExp(label + '\\s*:?[\\s]*([A-Z][A-Z0-9\\s\\.\']{2,40})', 'i');
    const m  = T.match(re);
    return m ? m[1].trim().replace(/\s+/g,' ') : null;
  };
  const dateAfter = (label) => {
    const re = new RegExp(label + '[^0-9]*' + DATE_RE.source, 'i');
    const m = T.match(re);
    return m ? parseDate(m[1]) : null;
  };
  const surname = stripLabels(matchAfter('SURNAME'));
  const given   = stripLabels(matchAfter('GIVEN NAMES?'));
  const name    = [given, surname].filter(Boolean).join(' ').trim() || null;
  return {
    full_name:   stripLabels(name),
    passport_no: T.match(PASSPORT_NO_RE)?.[1] || null,
    dob:         dateAfter('DATE OF BIRTH'),
    gender:      matchAfter('SEX')?.charAt(0) === 'M' ? 'Male' : (matchAfter('SEX')?.charAt(0) === 'F' ? 'Female' : null),
    issue_date:  dateAfter('DATE OF ISSUE'),
    expiry_date: dateAfter('DATE OF EXPIRY'),
    father_name: stripLabels(matchAfter('FATHER')),
    mother_name: stripLabels(matchAfter('MOTHER')),
    nationality: stripLabels(matchAfter('NATIONALITY')),
    address:     stripLabels(matchAfter('ADDRESS')),
  };
}

// Heuristic confidence — % of expected fields we managed to extract
function regexConfidence(fields) {
  const expected = ['full_name','passport_no','dob','expiry_date','father_name'];
  const filled = expected.filter(k => !!fields[k]).length;
  return Math.round((filled / expected.length) * 100);
}

// ---------- OCR.space ----------
async function ocrSpace(dataUri) {
  const apiKey = process.env.OCR_SPACE_API_KEY;
  if (!apiKey) return null;
  const form = new URLSearchParams();
  form.append('apikey', apiKey);
  form.append('base64Image', dataUri);
  form.append('OCREngine', '2');
  form.append('isOverlayRequired', 'false');
  try {
    const r = await fetch('https://api.ocr.space/parse/image', { method: 'POST', body: form });
    const data = await r.json();
    if (!data?.ParsedResults?.[0]?.ParsedText) return null;
    return data.ParsedResults[0].ParsedText;
  } catch (e) {
    console.error('OCR.space error:', e?.message);
    return null;
  }
}

const MOCK_TEXT = `REPUBLIC OF NEPAL PASSPORT
SURNAME: THAPA
GIVEN NAMES: BIKRAM
PASSPORT NO. PA1234567
DATE OF BIRTH: 14-08-1995
SEX: M
NATIONALITY: NEPALI
DATE OF ISSUE: 22-03-2021
DATE OF EXPIRY: 21-03-2031
FATHER: RAM BAHADUR THAPA
MOTHER: SITA THAPA
ADDRESS: KATHMANDU WARD 12 NEPAL`;

/**
 * Pipeline (best → worst):
 *   1. Gemini Vision (sees the image directly)        → highest accuracy
 *   2. OCR.space → Gemini text cleanup                → good
 *   3. OCR.space → regex extraction                   → fallback
 *   4. Mock data                                      → only if nothing else works
 *
 * We always also run OCR.space alongside Vision so we have raw text for the
 * debug preview. They run in parallel for speed.
 */
export async function extractFromDocument({ dataUri, docType = 'passport' }) {
  // Run Vision and OCR.space in parallel for speed
  const [visionResult, rawTextRaw] = await Promise.all([
    extractWithGeminiVision(dataUri, docType),
    ocrSpace(dataUri),
  ]);

  let usedMock = false;
  let rawText  = rawTextRaw;
  if (!rawText) { rawText = MOCK_TEXT; usedMock = true; }

  let fields, source, confidence;

  // 1) Vision worked → use it
  if (visionResult) {
    fields     = visionResult;
    source     = 'gemini-vision';
    confidence = typeof visionResult.confidence === 'number' ? visionResult.confidence : 90;
  } else {
    // 2) Try Gemini text cleanup on the OCR'd text
    const textGemini = await cleanWithGemini(rawText, docType);
    if (textGemini) {
      fields     = textGemini;
      source     = 'gemini-text';
      confidence = typeof textGemini.confidence === 'number' ? textGemini.confidence : 75;
    } else {
      // 3) Last-resort regex parsing
      fields     = regexExtract(rawText);
      source     = 'regex';
      confidence = regexConfidence(fields);
    }
  }

  // Mock data is never trustworthy
  if (usedMock) confidence = Math.min(confidence, 50);

  return {
    ...fields,
    _meta: {
      mock: usedMock,
      docType,
      source,                                   // gemini-vision | gemini-text | regex
      confidence,                               // 0-100
      raw_text_preview: rawText.slice(0, 600),
    },
  };
}
