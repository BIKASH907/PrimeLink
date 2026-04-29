// =====================================================
// /bhat/cv — CV builder (manual + future OCR placeholder)
// =====================================================
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import connectDB from '../../lib/db';
import BhatClient from '../../models/BhatClient';
import BhatCV from '../../models/BhatCV';
import BhatUser from '../../models/BhatUser';
import BhatLayout from '../../components/bhat/BhatLayout';
import DocumentUploader from '../../components/bhat/DocumentUploader';
import { requireBhatUser } from '../../lib/bhatAuth';

export default function CVBuilder({ user, clients, selectedClient, cvData }) {
  const router = useRouter();
  const [clientId, setClientId] = useState(selectedClient || (clients[0]?.id || ''));
  const [form, setForm] = useState(cvData || {
    maritalStatus: 'single', spouseName: '', manualFatherName: '',
    religion: '', permanentAddress: '', positionApplied: '',
    yearsExperience: '', languages: '',
    autoFullName:'', autoFatherName:'', autoMotherName:'', autoPassportNo:'',
    autoDob:'', autoGender:'', autoNationality:'',
  });

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function save(e) {
    e.preventDefault();
    if (!clientId) { alert('Pick a client first'); return; }
    const r = await fetch(`/api/bhat/cv/${clientId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await r.json();
    if (r.ok) {
      router.push(`/bhat/cv?client=${clientId}`);
    } else {
      alert(data.error || 'Save failed');
    }
  }

  return (
    <BhatLayout user={user} active="cv">
      <Head><title>CV Builder — BHAT Overseas</title></Head>
      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">CV Auto-Builder</div>
          <div className="bhat-page-sub">Fill candidate details and preview the CV live</div>
        </div>
        <div className="bhat-page-actions">
          <button className="bhat-btn bhat-btn-ghost" onClick={save}>Save CV</button>
          {clientId && (
            <a className="bhat-btn bhat-btn-primary"
               href={`/bhat/cv/${clientId}/print`} target="_blank" rel="noreferrer">
              📥 Generate &amp; Print PDF
            </a>
          )}
        </div>
      </div>

      <div style={{ padding:'22px 24px' }}>
        <div className="bhat-form-group" style={{ maxWidth:480 }}>
          <label>Client</label>
          <select value={clientId} onChange={e => setClientId(e.target.value)}>
            <option value="">— pick a client —</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.refNo} — {c.name}</option>
            ))}
          </select>
        </div>

        {clientId && (
          <div className="bhat-panel" style={{ marginTop:16 }}>
            <div className="bhat-panel-title">📷 Auto-Scan Passport / Bills (OCR)</div>
            <DocumentUploader
              clientId={clientId}
              defaultDocType="passport"
              onUploaded={(data) => {
                if (data?.ocr) {
                  setForm(prev => ({
                    ...prev,
                    autoFullName:    data.ocr.full_name    || prev.autoFullName,
                    autoPassportNo:  data.ocr.passport_no  || prev.autoPassportNo,
                    autoDob:         data.ocr.dob          || prev.autoDob,
                    autoGender:      data.ocr.gender       || prev.autoGender,
                    autoFatherName:  data.ocr.father_name  || prev.autoFatherName,
                    autoMotherName:  data.ocr.mother_name  || prev.autoMotherName,
                    autoNationality: data.ocr.nationality  || prev.autoNationality,
                  }));
                }
              }} />
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16 }}>
          <form onSubmit={save}>
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.6px', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
                Personal — Auto-Scan Fields
                <span style={{ fontSize:9, padding:'1px 6px', background:'var(--purple)', color:'white', borderRadius:3 }}>OCR Auto</span>
              </div>
              <Row label="Full Name (passport)"><input type="text" value={form.autoFullName || ''} onChange={e => set('autoFullName', e.target.value)} /></Row>
              <Row label="Passport No."><input type="text" value={form.autoPassportNo || ''} onChange={e => set('autoPassportNo', e.target.value)} /></Row>
              <Row label="Date of Birth"><input type="date" value={form.autoDob || ''} onChange={e => set('autoDob', e.target.value)} /></Row>
              <Row label="Father's Name"><input type="text" value={form.autoFatherName || ''} onChange={e => set('autoFatherName', e.target.value)} /></Row>
              <Row label="Mother's Name"><input type="text" value={form.autoMotherName || ''} onChange={e => set('autoMotherName', e.target.value)} /></Row>
              <Row label="Gender"><select value={form.autoGender || ''} onChange={e => set('autoGender', e.target.value)}><option value="">—</option><option>Male</option><option>Female</option></select></Row>
              <Row label="Nationality"><input type="text" value={form.autoNationality || ''} onChange={e => set('autoNationality', e.target.value)} /></Row>
            </div>

            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.6px', marginBottom:8 }}>
                Marital &amp; Lifestyle — Manual
              </div>
              <Row label="Marital Status">
                <select value={form.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                  <option value="single">Unmarried</option>
                  <option value="married">Married</option>
                </select>
              </Row>

              {/* Father Name is ALWAYS shown — auto-fills from passport OCR if available,
                  but the user can override / correct it. */}
              <Row label="Father's Name">
                <input type="text"
                  value={form.manualFatherName || form.autoFatherName || ''}
                  onChange={e => set('manualFatherName', e.target.value)}
                  placeholder={form.autoFatherName ? `Auto from passport: ${form.autoFatherName}` : 'Enter father’s full name'} />
              </Row>

              {/* Spouse Name shows only when Married */}
              {form.maritalStatus === 'married' && (
                <Row label="Spouse / Wife Name">
                  <input type="text"
                    value={form.spouseName || ''}
                    onChange={e => set('spouseName', e.target.value)}
                    required />
                </Row>
              )}
              <Row label="Religion"><input type="text" value={form.religion || ''} onChange={e => set('religion', e.target.value)} /></Row>
              <Row label="Permanent Address"><input type="text" value={form.permanentAddress || ''} onChange={e => set('permanentAddress', e.target.value)} /></Row>
            </div>

            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.6px', marginBottom:8 }}>
                Work &amp; Skills — Manual
              </div>
              <Row label="Position Applied For"><input type="text" value={form.positionApplied || ''} onChange={e => set('positionApplied', e.target.value)} /></Row>
              <Row label="Years of Experience"><input type="number" value={form.yearsExperience || ''} onChange={e => set('yearsExperience', e.target.value)} /></Row>
              <Row label="Languages"><input type="text" value={form.languages || ''} onChange={e => set('languages', e.target.value)} /></Row>
            </div>

            <button className="bhat-btn bhat-btn-primary bhat-btn-block" type="submit">Save CV Details</button>
          </form>

          {/* Preview */}
          <div>
            <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.6px', marginBottom:8 }}>
              Live CV Preview
            </div>
            <div style={{ background:'white', color:'#1a1a1a', padding:32, borderRadius:10, fontFamily:'Georgia, serif', minHeight:500 }}>
              <h1 style={{ fontSize:22, marginBottom:4, color:'#1a1a1a' }}>{form.autoFullName || 'Candidate Name'}</h1>
              <div style={{ color:'#555', fontSize:13, marginBottom:18, paddingBottom:12, borderBottom:'2px solid #1a1a1a' }}>
                {form.positionApplied || 'Position'} — {form.yearsExperience || 0} years experience
              </div>
              <CVSection title="Personal Information">
                <CVRow lbl="Father's Name" val={form.manualFatherName || form.autoFatherName || '—'} />
                <CVRow lbl="Mother's Name" val={form.autoMotherName || '—'} />
                <CVRow lbl="Marital Status" val={form.maritalStatus === 'married' ? 'Married' : 'Unmarried'} />
                {form.maritalStatus === 'married' && <CVRow lbl="Spouse Name" val={form.spouseName || '—'} />}
                <CVRow lbl="Date of Birth" val={form.autoDob || '—'} />
                <CVRow lbl="Gender" val={form.autoGender || '—'} />
                <CVRow lbl="Religion" val={form.religion || '—'} />
                <CVRow lbl="Nationality" val={form.autoNationality || '—'} />
              </CVSection>
              <CVSection title="Passport Details">
                <CVRow lbl="Passport No." val={form.autoPassportNo || '—'} />
              </CVSection>
              <CVSection title="Contact">
                <CVRow lbl="Permanent Address" val={form.permanentAddress || '—'} />
              </CVSection>
              <CVSection title="Skills & Languages">
                <CVRow lbl="Position" val={form.positionApplied || '—'} />
                <CVRow lbl="Experience" val={`${form.yearsExperience || 0} years`} />
                <CVRow lbl="Languages" val={form.languages || '—'} />
              </CVSection>
            </div>
          </div>
        </div>
      </div>
    </BhatLayout>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ marginBottom:12 }}>
      <label style={{ display:'block', fontSize:12, color:'var(--text-2)', marginBottom:6, fontWeight:500 }}>{label}</label>
      {children}
    </div>
  );
}
function CVSection({ title, children }) {
  return (
    <>
      <h3 style={{ fontSize:13, textTransform:'uppercase', letterSpacing:1, margin:'16px 0 8px', color:'#1a1a1a', borderBottom:'1px solid #ccc', paddingBottom:4 }}>{title}</h3>
      {children}
    </>
  );
}
function CVRow({ lbl, val }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'3px 0', fontSize:13 }}>
      <span style={{ color:'#555', minWidth:130 }}>{lbl}</span>
      <span>{val}</span>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx);
  if (guard.redirect) return { redirect: guard.redirect };
  const user = guard.user;

  await connectDB();
  let clients = [];
  if (user.role === 'sub_admin') {
    const me = await BhatUser.findById(user.id).lean();
    clients = await BhatClient.find({ _id: { $in: me?.assignedClients || [] } }).lean();
  } else if (user.currentCountry) {
    clients = await BhatClient.find({ country: user.currentCountry }).lean();
  } else {
    clients = await BhatClient.find().lean();
  }

  const selected = ctx.query.client || null;
  let cvData = null;
  if (selected) {
    const cv = await BhatCV.findOne({ client: selected }).lean();
    if (cv) {
      cvData = {
        maritalStatus: cv.maritalStatus, spouseName: cv.spouseName || '',
        religion: cv.religion || '', permanentAddress: cv.permanentAddress || '',
        positionApplied: cv.positionApplied || '', yearsExperience: cv.yearsExperience || '',
        languages: cv.languages || '',
        autoFullName: cv.autoFullName || '', autoPassportNo: cv.autoPassportNo || '',
        autoDob: cv.autoDob ? new Date(cv.autoDob).toISOString().slice(0,10) : '',
        autoGender: cv.autoGender || '', autoFatherName: cv.autoFatherName || '',
        autoMotherName: cv.autoMotherName || '', autoNationality: cv.autoNationality || '',
      };
    }
  }

  return {
    props: {
      user,
      clients: clients.map(c => ({ id: c._id.toString(), name: c.fullName, refNo: c.refNo })),
      selectedClient: selected,
      cvData,
    },
  };
}
