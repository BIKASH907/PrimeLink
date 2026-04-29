// =====================================================
// DocumentUploader — drop zone + OCR auto-fill
// Used by sub-admin and client-detail pages.
// =====================================================
import { useState, useRef } from 'react';

const DOC_OPTIONS = [
  { key: 'passport',         label: 'Passport (auto-OCR)' },
  { key: 'cv',               label: 'CV / Resume' },
  { key: 'police_report',    label: 'Police Report (PCC)' },
  { key: 'medical_report',   label: 'Medical Report' },
  { key: 'citizenship',      label: 'Citizenship' },
  { key: 'photographs',      label: 'Photographs' },
  { key: 'electricity_bill', label: 'Electricity Bill' },
  { key: 'water_bill',       label: 'Water Bill' },
  { key: 'vfs_receipt',      label: 'VFS Receipt' },
  { key: 'kimlik_receipt',   label: 'Kimlik Payment' },
  { key: 'flight_ticket',    label: 'Flight Ticket' },
];

export default function DocumentUploader({ clientId, defaultDocType = 'passport', onUploaded }) {
  const [docType, setDocType]   = useState(defaultDocType);
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState(null);
  const [result, setResult]     = useState(null);
  const fileInputRef            = useRef();

  function pickFile() { fileInputRef.current?.click(); }

  async function handleFile(file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10 MB)');
      return;
    }
    setBusy(true); setError(null); setResult(null);

    // Convert to base64 data URI
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const r = await fetch('/api/bhat/documents/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId, docType,
            dataUri: reader.result,
            runOcr:  ['passport','cv','police_report','electricity_bill','water_bill','bill'].includes(docType),
          }),
        });
        const data = await r.json();
        if (!r.ok) {
          setError(data.error || 'Upload failed');
        } else {
          setResult(data);
          onUploaded?.(data);
        }
      } catch (e) {
        setError('Network error — try again');
      } finally {
        setBusy(false);
      }
    };
    reader.onerror = () => { setError('Could not read file'); setBusy(false); };
    reader.readAsDataURL(file);
  }

  return (
    <div className="bhat-uploader">
      <div className="bhat-form-group" style={{ marginBottom: 10 }}>
        <label>Document Type</label>
        <select value={docType} onChange={e => setDocType(e.target.value)}>
          {DOC_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </div>

      <button type="button" className="bhat-scan-zone" onClick={pickFile} disabled={busy}>
        <div style={{ fontSize:32, color:'var(--accent)' }}>📎</div>
        <div style={{ fontWeight:600, fontSize:13 }}>{busy ? 'Uploading…' : 'Click to upload'}</div>
        <div style={{ fontSize:11, color:'var(--text-3)', marginTop:3 }}>
          JPG, PNG, PDF — max 10 MB. Auto-saves to <code>bhat-overseas/&#123;company&#125;/&#123;name&#125;/</code>
        </div>
      </button>

      <input ref={fileInputRef} type="file" hidden
        accept=".jpg,.jpeg,.png,.pdf,.webp"
        onChange={e => handleFile(e.target.files?.[0])} />

      {error && <div className="bhat-error">{error}</div>}

      {result?.ok && (
        <div style={{
          marginTop: 12, padding: 12, background: 'var(--bg-2)',
          border: '1px solid var(--border)', borderRadius: 7,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, fontWeight:600, color:'var(--green)' }}>
            ✔ Uploaded to {result.folder}
            {result.ocr?._meta?.confidence != null && (
              <span style={{
                marginLeft:'auto', fontSize:10, padding:'2px 8px', borderRadius:4,
                background: result.ocr._meta.confidence >= 85 ? 'var(--green-dim)' : 'var(--orange-dim)',
                color:      result.ocr._meta.confidence >= 85 ? 'var(--green)'     : 'var(--orange)',
              }}>
                OCR confidence: {result.ocr._meta.confidence}%
                {result.ocr._meta.confidence < 85 && ' • Needs Review'}
              </span>
            )}
          </div>
          {result.ocr && (
            <>
              <div style={{ marginTop: 10, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8, fontSize:12 }}>
                {result.ocr.full_name   && <KV k="Name"        v={result.ocr.full_name} />}
                {result.ocr.passport_no && <KV k="Passport No" v={result.ocr.passport_no} />}
                {result.ocr.dob         && <KV k="DOB"         v={result.ocr.dob} />}
                {result.ocr.expiry_date && <KV k="Expiry"      v={result.ocr.expiry_date} />}
                {result.ocr.father_name && <KV k="Father"      v={result.ocr.father_name} />}
                {result.ocr.mother_name && <KV k="Mother"      v={result.ocr.mother_name} />}
                {result.ocr.address     && <KV k="Address"     v={result.ocr.address} />}
                {result.ocr._meta?.mock && <div style={{ gridColumn:'1 / -1', fontSize:10, color:'var(--text-3)' }}>(Demo OCR — set OCR_SPACE_API_KEY for real extraction)</div>}
              </div>

              {/* Raw OCR text — collapsible — helps debug bad scans */}
              <details style={{ marginTop: 10, fontSize: 11, color: 'var(--text-3)' }}>
                <summary style={{ cursor:'pointer', userSelect:'none' }}>
                  🔎 Show raw OCR text (for debugging)
                </summary>
                <pre style={{
                  marginTop:8, padding:10, background:'var(--bg-3)',
                  border:'1px solid var(--border)', borderRadius:5,
                  whiteSpace:'pre-wrap', wordBreak:'break-word',
                  maxHeight:200, overflow:'auto', fontFamily:'monospace',
                  fontSize:11, color:'var(--text-2)',
                }}>{result.ocr._meta?.raw_text_preview || '(no raw text returned)'}</pre>
                <div style={{ marginTop:6, color:'var(--text-3)' }}>
                  Source: <strong>{result.ocr._meta?.source || 'unknown'}</strong>
                  {' · '}Confidence: <strong>{result.ocr._meta?.confidence ?? '—'}%</strong>
                </div>
                <div style={{ marginTop:6 }}>
                  ⚠ If the name still looks wrong, type the correct values manually in the form below.
                  The OCR result is just a starting point — the form values you save are what get used.
                </div>
              </details>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .bhat-scan-zone {
          display: block; width: 100%;
          border: 2px dashed var(--border-strong); border-radius: 10px;
          padding: 24px; text-align: center; transition: all .2s;
          background: var(--bg-1); cursor: pointer;
        }
        .bhat-scan-zone:hover { border-color: var(--accent); background: var(--bg-2); }
        .bhat-scan-zone:disabled { opacity: 0.6; cursor: wait; }
      `}</style>
    </div>
  );
}

function KV({ k, v }) {
  return (
    <div>
      <div style={{ fontSize:10, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.4px' }}>{k}</div>
      <div style={{ fontSize:12 }}>{v}</div>
    </div>
  );
}
