// =====================================================
// BHAT OVERSEAS — Gemini cleanup
// Takes raw OCR text and asks Gemini 2.5 Flash to return clean structured JSON.
// Falls back to null if no GEMINI_API_KEY is set (caller should use regex fallback).
//
// Required env: GEMINI_API_KEY  (https://aistudio.google.com/app/apikey)
// =====================================================

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `
You extract structured data from passport / CV / utility bill OCR text.
Return ONLY valid JSON matching exactly this shape (use null for missing fields):
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
  "confidence":  number          // 0-100, how confident you are overall
}
NO commentary, NO markdown — only the JSON object.
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
    // Clamp confidence to 0–100
    if (typeof parsed.confidence === 'number') {
      parsed.confidence = Math.max(0, Math.min(100, Math.round(parsed.confidence)));
    }
    return parsed;
  } catch (e) {
    console.error('Gemini call failed:', e?.message);
    return null;
  }
}
