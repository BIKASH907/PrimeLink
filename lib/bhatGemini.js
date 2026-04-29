// =====================================================
// BHAT OVERSEAS — Gemini cleanup
// Takes raw OCR text and asks Gemini 2.5 Flash to return clean structured JSON.
// Falls back to null if no GEMINI_API_KEY is set (caller should use regex fallback).
//
// Required env: GEMINI_API_KEY  (https://aistudio.google.com/app/apikey)
// =====================================================

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Words that should NEVER appear inside a person's name.
// If they slipped through Gemini, we strip them here.
const LABEL_WORDS = [
  'SURNAME','FORENAMES','FORENAME','GIVEN NAMES','GIVEN NAME','NAME OF','NAME',
  'FAMILY NAME','LAST NAME','FIRST NAME','MIDDLE NAME',
  'FATHER\'S NAME','FATHERS NAME','FATHER NAME','FATHER',
  'MOTHER\'S NAME','MOTHERS NAME','MOTHER NAME','MOTHER',
  'DATE OF BIRTH','DOB','SEX','GENDER','NATIONALITY',
  'PASSPORT NO','PASSPORT NUMBER','PASSPORT',
  'DATE OF ISSUE','DATE OF EXPIRY','ISSUING AUTHORITY',
  'PLACE OF BIRTH','REPUBLIC OF','OF NEPAL','OF INDIA',
  'BHAT', 'BHAT-REF',         // our internal labels — strip if accidentally OCR'd
  'P<', 'PD<', 'PA<',          // MRZ artifacts
];

function stripLabels(value) {
  if (!value || typeof value !== 'string') return value || null;
  let v = value;
  for (const w of LABEL_WORDS) {
    const re = new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    v = v.replace(re, '');
  }
  // Strip trailing/leading punctuation, collapse whitespace
  v = v.replace(/[/<>:.,;\-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  // Convert ALL CAPS → Title Case (keeps the OCR readable)
  if (v && v === v.toUpperCase()) {
    v = v.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
  return v || null;
}

const SYSTEM_PROMPT = `
You extract structured data from OCR'd passport / CV / utility bill text.

🚨 CRITICAL RULES:

1. NEVER include LABEL words in the extracted values. Strip these words completely:
   SURNAME, FORENAMES, GIVEN NAMES, GIVEN NAME, NAME, FAMILY NAME, FATHER'S NAME,
   FATHER NAME, MOTHER'S NAME, MOTHER NAME, DATE OF BIRTH, DOB, SEX, GENDER,
   NATIONALITY, ADDRESS, PASSPORT NO, PASSPORT NUMBER, DATE OF ISSUE, DATE OF EXPIRY,
   ISSUING AUTHORITY, PLACE OF BIRTH, FATHER, MOTHER, REPUBLIC OF, PASSPORT.

2. The "full_name" must combine GIVEN NAME(S) + SURNAME in the natural order:
   "Bikram Thapa" — NOT "SURNAME THAPA FORENAMES BIKRAM" — NOT "S FORENAMES THAPA BIKRAM".

3. If you see "SURNAME: THAPA" + "GIVEN NAMES: BIKRAM" → full_name = "Bikram Thapa".
4. Convert ALL CAPS names to Title Case: "RAM BAHADUR THAPA" → "Ram Bahadur Thapa".

5. Dates must be ISO format YYYY-MM-DD. Convert "14 AUG 1995" → "1995-08-14".

6. If a value is uncertain or contains label garbage, return null.
   Better to be empty than wrong.

7. confidence (0–100): give a low number (< 50) if any extracted field still
   contains label words or you're guessing.

EXAMPLES:

Input: "REPUBLIC OF NEPAL PASSPORT
SURNAME / GAR
THAPA
GIVEN NAMES / NAM
BIKRAM
DATE OF BIRTH / JANMA
14/08/1995
PASSPORT NO. PA1234567
FATHER'S NAME RAM BAHADUR THAPA"

Output:
{ "full_name":"Bikram Thapa", "passport_no":"PA1234567",
  "dob":"1995-08-14", "father_name":"Ram Bahadur Thapa",
  "mother_name":null, "issue_date":null, "expiry_date":null,
  "gender":null, "address":null, "nationality":"Nepali",
  "confidence":92 }

Input (messy/partial OCR):
"S FORENAMES BHAT BIKASH LYTIS DOB 2001-06-05"

Output:
{ "full_name":"Bikash", "passport_no":null, "dob":"2001-06-05",
  "father_name":null, "mother_name":null, "issue_date":null,
  "expiry_date":null, "gender":null, "address":null,
  "nationality":null, "confidence":35 }

Return ONLY this JSON shape — no markdown, no commentary:
{
  "full_name":   string|null,
  "passport_no": string|null,
  "dob":         "YYYY-MM-DD"|null,
  "gender":      "Male"|"Female"|null,
  "issue_date":  "YYYY-MM-DD"|null,
  "expiry_date": "YYYY-MM-DD"|null,
  "father_name": string|null,
  "mother_name": string|null,
  "address":     string|null,
  "nationality": string|null,
  "confidence":  number
}
`.trim();

/**
 * @param {string} rawText  OCR raw output
 * @param {string} docType  e.g. "passport"
 * @returns {Promise<object|null>} structured JSON or null on failure
 */
export async function cleanWithGemini(rawText, docType = 'passport') {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!rawText || rawText.trim().length < 10) return null;

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{
      role: 'user',
      parts: [{ text: `Document type: ${docType}\n\n--- OCR TEXT START ---\n${rawText.slice(0, 4000)}\n--- OCR TEXT END ---` }],
    }],
    generationConfig: {
      temperature: 0,
      responseMimeType: 'application/json',
    },
  };

  try {
    const r = await fetch(`${GEMINI_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      console.error('Gemini error:', r.status, await r.text());
      return null;
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    const parsed = JSON.parse(text);
    // Post-process: strip any leftover label words from name fields.
    // Belt-and-suspenders — Gemini should already do this, but this catches edge cases.
    parsed.full_name   = stripLabels(parsed.full_name);
    parsed.father_name = stripLabels(parsed.father_name);
    parsed.mother_name = stripLabels(parsed.mother_name);

    // Clamp confidence to 0–100
    if (typeof parsed.confidence === 'number') {
      parsed.confidence = Math.max(0, Math.min(100, Math.round(parsed.confidence)));
    }
    // If a name field is empty AFTER stripping, lower confidence
    if (!parsed.full_name && parsed.confidence > 50) parsed.confidence = 40;
    return parsed;
  } catch (e) {
    console.error('Gemini call failed:', e?.message);
    return null;
  }
}
