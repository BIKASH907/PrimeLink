// =====================================================
// /bhat/documents — Hierarchical document browser
//   Level 1: Companies (folders)            /bhat/documents
//   Level 2: Candidates under a company     /bhat/documents?company=Anatolia
//   Level 3: Files for a candidate          /bhat/documents?company=...&client=<id>
// =====================================================
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import connectDB from '../../lib/db';
import BhatClient from '../../models/BhatClient';
import BhatDocument from '../../models/BhatDocument';
import BhatCompany from '../../models/BhatCompany';
import BhatUser from '../../models/BhatUser';
import BhatLayout from '../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../lib/bhatAuth';
import { STAGE_BY_KEY, COUNTRIES } from '../../lib/bhatConstants';

const STATUS_LABEL = {
  ok: { c:'ok',   l:'✔ Verified' },
  expiring: { c:'exp', l:'⚠ Expiring' },
  missing:  { c:'miss', l:'❌ Missing' },
  needs_review: { c:'exp', l:'? Needs Review' },
};

export default function DocumentsPage(props) {
  const { user, view, counts } = props;
  return (
    <BhatLayout user={user} active="documents" counts={counts}>
      <Head><title>Documents — BHAT Overseas</title></Head>

      {view === 'companies' && <CompaniesView {...props} />}
      {view === 'candidates' && <CandidatesView {...props} />}
      {view === 'files' && <FilesView {...props} />}
    </BhatLayout>
  );
}

// ===================================================== LEVEL 1
function CompaniesView({ companies, total, user, countryCode }) {
  const router  = useRouter();
  const canEdit = user.role === 'super_admin' || user.role === 'admin';
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [busy,    setBusy]    = useState(false);

  async function addCompany(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy(true);
    const r = await fetch('/api/bhat/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), country: countryCode }),
    });
    setBusy(false);
    if (!r.ok) return alert((await r.json()).error || 'Failed');
    setNewName(''); setShowAdd(false);
    router.replace(router.asPath);
  }

  async function renameCompany(oldName) {
    const newN = prompt(`Rename "${oldName}" to:`, oldName);
    if (!newN || newN.trim() === oldName) return;
    if (!confirm(`Rename ALL clients with company "${oldName}" → "${newN}"?`)) return;
    const r = await fetch('/api/bhat/companies/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: countryCode, oldName, newName: newN.trim() }),
    });
    if (r.ok) {
      const data = await r.json();
      alert(`Renamed. ${data.clientsUpdated} client(s) updated.`);
      router.replace(router.asPath);
    } else {
      alert((await r.json()).error || 'Rename failed');
    }
  }

  async function deleteCompany(name) {
    const choice = confirm(
      `Delete company "${name}"?\n\n` +
      `Click OK to UNASSIGN all candidates from this company.\n` +
      `(They keep all their other data — only the company link is removed.)\n\n` +
      `Click Cancel to abort.`
    );
    if (!choice) return;

    const r = await fetch('/api/bhat/companies/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: countryCode, name }),
    });
    if (r.ok) {
      const data = await r.json();
      alert(`Company "${name}" deleted. ${data.clientsAffected} candidate(s) set to Unassigned.`);
      router.replace(router.asPath);
    } else {
      alert((await r.json()).error || 'Delete failed');
    }
  }

  return (
    <>
      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">📁 Documents — Companies</div>
          <div className="bhat-page-sub">Browse documents organised by company • {companies.length} companies • {total} files</div>
        </div>
        {canEdit && (
          <div className="bhat-page-actions">
            <button className="bhat-btn bhat-btn-primary" onClick={() => setShowAdd(v => !v)}>
              {showAdd ? 'Cancel' : '+ New Company'}
            </button>
          </div>
        )}
      </div>

      {showAdd && canEdit && (
        <div style={{ padding:'14px 24px' }}>
          <form onSubmit={addCompany} className="bhat-panel" style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
            <div className="bhat-form-group" style={{ flex:1, marginBottom:0 }}>
              <label>Company Name</label>
              <input type="text" autoFocus required value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Al-Khaleej Construction" />
            </div>
            <button className="bhat-btn bhat-btn-primary" type="submit" disabled={busy}>
              {busy ? 'Creating…' : 'Create Company'}
            </button>
          </form>
        </div>
      )}

      <div style={{ padding:'22px 24px' }}>
        {companies.length === 0 ? (
          <Empty msg="No companies yet. Click + New Company above to add one." />
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14 }}>
            {companies.map(co => (
              <div key={co.name} className="bhat-panel" style={{ position:'relative' }}>
                <Link href={`/bhat/documents?company=${encodeURIComponent(co.name)}`}
                  style={{ display:'block', cursor:'pointer' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{
                      width:48, height:48, borderRadius:10, fontSize:24,
                      background:'var(--accent-glow)', color:'var(--accent)',
                      display:'grid', placeItems:'center',
                    }}>📁</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {co.name}
                      </div>
                      <div style={{ fontSize:11, color:'var(--text-3)' }}>
                        {co.candidateCount} candidate{co.candidateCount !== 1 ? 's' : ''} · {co.fileCount} file{co.fileCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </Link>
                {canEdit && (
                  <div style={{ display:'flex', gap:6, marginTop:10, paddingTop:10, borderTop:'1px solid var(--border)' }}>
                    <button className="bhat-btn bhat-btn-ghost" style={{ padding:'4px 8px', fontSize:11 }}
                      onClick={() => renameCompany(co.name)}>✏ Rename</button>
                    <button className="bhat-btn bhat-btn-ghost" style={{ padding:'4px 8px', fontSize:11, color:'var(--red)' }}
                      onClick={() => deleteCompany(co.name)}>🗑 Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ===================================================== LEVEL 2
function CandidatesView({ company, candidates }) {
  return (
    <>
      <div className="bhat-page-head">
        <div>
          <Breadcrumb items={[
            { label:'Companies', href:'/bhat/documents' },
            { label:company },
          ]} />
          <div className="bhat-page-title">📁 {company}</div>
          <div className="bhat-page-sub">{candidates.length} candidate{candidates.length !== 1 ? 's' : ''} in this company</div>
        </div>
      </div>

      <div style={{ padding:'22px 24px' }}>
        {candidates.length === 0 ? (
          <Empty msg={`No candidates yet under ${company}.`} />
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14 }}>
            {candidates.map(c => (
              <Link key={c.id}
                href={`/bhat/documents?company=${encodeURIComponent(company)}&client=${c.id}`}
                className="bhat-panel"
                style={{ display:'block', cursor:'pointer' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{
                    width:42, height:42, borderRadius:10, fontSize:18,
                    background:'var(--bg-3)', color:'var(--text-2)',
                    display:'grid', placeItems:'center',
                  }}>📂</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600 }}>{c.name}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)', fontFamily:'monospace' }}>{c.refNo}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:6, marginTop:10, fontSize:11 }}>
                  <span className="bhat-pill ok">{c.fileCount} file{c.fileCount !== 1 ? 's' : ''}</span>
                  <span className="bhat-tt" style={{ marginLeft:'auto' }}>{c.stageLabel}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ===================================================== LEVEL 3
function FilesView({ company, client, files }) {
  return (
    <>
      <div className="bhat-page-head">
        <div style={{ flex:1 }}>
          <Breadcrumb items={[
            { label:'Companies', href:'/bhat/documents' },
            { label:company,     href:`/bhat/documents?company=${encodeURIComponent(company)}` },
            { label:client.name },
          ]} />
          <div className="bhat-page-title">📂 {client.name}</div>
          <div className="bhat-page-sub">
            {client.refNo} • {COUNTRIES[client.country]?.flag} {COUNTRIES[client.country]?.name} • {client.stageLabel} • {files.length} file{files.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="bhat-page-actions">
          <Link href={`/bhat/clients/${client.id}`} className="bhat-btn bhat-btn-primary">Open Full Client →</Link>
        </div>
      </div>

      <div style={{ padding:'22px 24px' }}>
        {files.length === 0 ? (
          <Empty msg="No files uploaded for this candidate yet." />
        ) : (
          <div className="bhat-table">
            <div className="bhat-th" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px' }}>
              <div>Document</div><div>Status</div><div>Confidence</div>
              <div>Issue Date</div><div>Expires</div><div>Action</div>
            </div>
            {files.map(f => {
              const s = STATUS_LABEL[f.status] || { c:'ok', l:f.status };
              return (
                <div className="bhat-tr" key={f.id} style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 100px' }}>
                  <div>
                    <strong>{f.label}</strong>
                    {f.needsReview && (
                      <span style={{ marginLeft:8, fontSize:10, padding:'1px 6px', borderRadius:3,
                        background:'var(--orange-dim)', color:'var(--orange)' }}>Needs Review</span>
                    )}
                  </div>
                  <div><span className={`bhat-pill ${s.c}`}>{s.l}</span></div>
                  <div>{f.confidence != null ? `${f.confidence}%` : '—'}</div>
                  <div className="bhat-tt">{f.issueDate || '—'}</div>
                  <div className="bhat-tt">{f.expiry || '—'}</div>
                  <div>
                    {f.fileUrl ? (
                      <a href={f.fileUrl} target="_blank" rel="noreferrer"
                         className="bhat-btn bhat-btn-ghost"
                         style={{ padding:'4px 10px', fontSize:11 }}>
                        📥 View
                      </a>
                    ) : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function Breadcrumb({ items }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-3)', marginBottom:6 }}>
      {items.map((it, i) => (
        <span key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
          {it.href ? <Link href={it.href} style={{ color:'var(--accent)' }}>{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && <span>›</span>}
        </span>
      ))}
    </div>
  );
}

function Empty({ msg }) {
  return (
    <div className="bhat-panel" style={{ textAlign:'center', padding:'60px 20px' }}>
      <div style={{ fontSize:42, marginBottom:12 }}>📭</div>
      <div style={{ fontSize:13, color:'var(--text-3)' }}>{msg}</div>
    </div>
  );
}

// ===================================================== Server-side data
export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx);
  if (guard.redirect) return { redirect: guard.redirect };
  const user = guard.user;

  await connectDB();

  // Sub-admin scope: only their assigned clients
  let clientFilter = {};
  if (user.role === 'sub_admin') {
    const me = await BhatUser.findById(user.id).lean();
    clientFilter = { _id: { $in: me?.assignedClients || [] } };
  } else if (user.currentCountry) {
    clientFilter = { country: user.currentCountry };
  }

  const allClients = await BhatClient.find(clientFilter).lean();
  const clientIds  = allClients.map(c => c._id);
  const allDocs    = await BhatDocument.find({
    client: { $in: clientIds }, archivedAt: null,
  }).lean();
  const totalFiles = allDocs.length;

  // ----- LEVEL 3: specific client -----
  if (ctx.query.client) {
    const c = allClients.find(x => x._id.toString() === ctx.query.client);
    if (!c) return { notFound: true };
    const files = allDocs.filter(d => d.client.toString() === c._id.toString())
      .map(d => ({
        id: d._id.toString(),
        label: d.docType.replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase()),
        status: d.status,
        needsReview: !!d.needsReview,
        confidence: d.ocrConfidence ?? null,
        issueDate:  d.issueDate ? new Date(d.issueDate).toISOString().slice(0,10) : null,
        expiry:     d.expiryDate ? new Date(d.expiryDate).toISOString().slice(0,10) : null,
        fileUrl:    d.fileUrl || null,
      }));
    return {
      props: {
        user, view: 'files',
        company: c.company || 'Unassigned',
        client: {
          id: c._id.toString(), name: c.fullName, refNo: c.refNo,
          country: c.country, stageLabel: STAGE_BY_KEY[c.stage]?.label || c.stage,
        },
        files,
        counts: { pipeline: allClients.length, documents: totalFiles },
      },
    };
  }

  // ----- LEVEL 2: company drill-down -----
  if (ctx.query.company) {
    const company = String(ctx.query.company);
    const inCompany = allClients.filter(c => (c.company || 'Unassigned') === company);
    const candidates = inCompany.map(c => ({
      id: c._id.toString(),
      name: c.fullName,
      refNo: c.refNo,
      stageLabel: STAGE_BY_KEY[c.stage]?.label || c.stage,
      fileCount: allDocs.filter(d => d.client.toString() === c._id.toString()).length,
    }));
    return {
      props: {
        user, view: 'candidates',
        company, candidates,
        counts: { pipeline: allClients.length, documents: totalFiles },
      },
    };
  }

  // ----- LEVEL 1: list all companies -----
  const byCompany = {};
  // Seed with companies that exist as BhatCompany records (even with 0 candidates)
  const countryCode = user.currentCountry || 'TR';
  const registered = await BhatCompany.find({ country: countryCode }).lean();
  for (const r of registered) {
    byCompany[r.name] = { name: r.name, candidates: [], fileCount: 0 };
  }
  // Then aggregate from clients
  for (const c of allClients) {
    const key = c.company || 'Unassigned';
    if (!byCompany[key]) byCompany[key] = { name: key, candidates: [], fileCount: 0 };
    byCompany[key].candidates.push(c._id.toString());
  }
  for (const d of allDocs) {
    for (const co of Object.values(byCompany)) {
      if (co.candidates.includes(d.client.toString())) {
        co.fileCount += 1;
        break;
      }
    }
  }
  const companies = Object.values(byCompany)
    .map(co => ({ name: co.name, candidateCount: co.candidates.length, fileCount: co.fileCount }))
    .sort((a, b) => b.candidateCount - a.candidateCount);

  return {
    props: {
      user, view: 'companies',
      companies, total: totalFiles,
      countryCode,
      counts: { pipeline: allClients.length, documents: totalFiles },
    },
  };
}
