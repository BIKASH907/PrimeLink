// =====================================================
// /bhat/finance — unified income + expense ledger
// Tabs: Income (advances paid by candidates) | Expense (paid OUT by us)
// =====================================================
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import connectDB from '../../lib/db';
import BhatClient from '../../models/BhatClient';
import BhatLedger from '../../models/BhatLedger';
import BhatLayout from '../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../lib/bhatAuth';
import { COUNTRIES } from '../../lib/bhatConstants';

const INCOME_TYPES = [
  { v:'advance',     l:'Advance Payment' },
  { v:'service_fee', l:'Service Fee' },
  { v:'medical',     l:'Medical' },
  { v:'visa_fee_in', l:'Visa Fee' },
  { v:'other_in',    l:'Other' },
];
const EXPENSE_TYPES = [
  { v:'agent_commission', l:'Agent Commission' },
  { v:'bank_transfer',    l:'Bank Transfer' },
  { v:'visa_fee_out',     l:'Visa Fee (Embassy)' },
  { v:'medical_out',      l:'Medical (Hospital)' },
  { v:'training',         l:'Training' },
  { v:'flight',           l:'Flight Ticket' },
  { v:'office_expense',   l:'Office Expense' },
  { v:'salary',           l:'Salary' },
  { v:'other_out',        l:'Other' },
];

export default function FinancePage({ user, countryCode, clients, entries, totals }) {
  const router = useRouter();
  const country = COUNTRIES[countryCode] || COUNTRIES.TR;
  const [tab, setTab] = useState('in');             // 'in' | 'out'
  const [busy, setBusy] = useState(false);

  // Income form
  const [inForm, setInForm] = useState({
    clientId: clients[0]?.id || '',
    type:     'advance',
    amount:   '', currency:'NPR', description:'',
    paidAt:   new Date().toISOString().slice(0,10),
  });

  // Expense form
  const [outForm, setOutForm] = useState({
    type:'agent_commission', amount:'', currency:'NPR', description:'',
    paidAt: new Date().toISOString().slice(0,10),
    bankAccountHolder:'', bankName:'', bankAccountNumber:'', vendor:'',
    clientId: '',                                    // optional
  });

  async function submitIn(e) {
    e.preventDefault();
    if (!inForm.clientId || !inForm.amount) return alert('Pick a client and enter amount');
    setBusy(true);
    const r = await fetch('/api/bhat/ledger', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...inForm, direction:'in' }),
    });
    setBusy(false);
    if (r.ok) {
      setInForm(p => ({ ...p, amount:'', description:'' }));
      router.replace(router.asPath);
    } else {
      alert((await r.json()).error || 'Failed');
    }
  }
  async function submitOut(e) {
    e.preventDefault();
    if (!outForm.amount) return alert('Enter amount');
    if (!outForm.bankAccountHolder && !outForm.vendor) {
      return alert('Enter Bank Account Holder OR Vendor name');
    }
    setBusy(true);
    const r = await fetch('/api/bhat/ledger', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...outForm, direction:'out' }),
    });
    setBusy(false);
    if (r.ok) {
      setOutForm(p => ({ ...p, amount:'', description:'', vendor:'', bankAccountHolder:'', bankName:'', bankAccountNumber:'' }));
      router.replace(router.asPath);
    } else {
      alert((await r.json()).error || 'Failed');
    }
  }

  async function refund(id) {
    if (!confirm('Mark this entry as refunded?')) return;
    const r = await fetch(`/api/bhat/ledger/${id}`, {
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ action:'refund' }),
    });
    if (r.ok) router.replace(router.asPath);
    else alert((await r.json()).error || 'Refund failed');
  }
  async function remove(id) {
    if (user.role !== 'super_admin') return alert('Only Super-Admin can permanently delete');
    if (!confirm('Permanently delete this ledger entry?')) return;
    const r = await fetch(`/api/bhat/ledger/${id}`, { method:'DELETE' });
    if (r.ok) router.replace(router.asPath);
  }

  // Filter entries by current tab
  const visible = entries.filter(e => e.direction === tab);

  return (
    <BhatLayout user={user} active="finance">
      <Head><title>Finance — BHAT Overseas</title></Head>

      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">Finance — Ledger {country.flag}</div>
          <div className="bhat-page-sub">Track payments received from candidates and expenses paid out</div>
        </div>
      </div>

      <div style={{ padding:'22px 24px' }}>
        {/* Totals — always show all */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:18 }}>
          <Stat lbl="Total Income"   val={fmt(totals.income, totals.currency)}  klass="good" />
          <Stat lbl="Total Expense"  val={fmt(totals.expense, totals.currency)} klass="danger" />
          <Stat lbl="Net Balance"    val={fmt(totals.income - totals.expense, totals.currency)} klass={totals.income >= totals.expense ? 'good' : 'danger'} />
          <Stat lbl="Entries"        val={entries.length} />
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:18, background:'var(--bg-2)', padding:4, borderRadius:8, width:'fit-content' }}>
          <button onClick={() => setTab('in')}
            style={tabStyle(tab === 'in')}>📥 Income (paid TO us)</button>
          <button onClick={() => setTab('out')}
            style={tabStyle(tab === 'out')}>📤 Expense (paid OUT)</button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:16 }}>
          {/* LEFT — form for current tab */}
          {tab === 'in' ? (
            <form onSubmit={submitIn} className="bhat-panel">
              <div className="bhat-panel-title">+ Record Payment Received</div>
              <div className="bhat-form-group">
                <label>Search Candidate (by name, ref no, or passport)</label>
                <input type="search" placeholder="Type name, BHAT-REF-001, or passport no…"
                  value={inForm._search || ''}
                  onChange={e => setInForm(p => ({ ...p, _search: e.target.value }))} />
              </div>
              <div className="bhat-form-group">
                <label>Candidate *</label>
                <select value={inForm.clientId}
                  onChange={e => setInForm(p => ({ ...p, clientId: e.target.value }))} required>
                  <option value="">— pick a candidate —</option>
                  {clients
                    .filter(c => {
                      const q = (inForm._search || '').trim().toLowerCase();
                      if (!q) return true;
                      return c.name.toLowerCase().includes(q)
                          || c.refNo.toLowerCase().includes(q)
                          || (c.passportNo || '').toLowerCase().includes(q);
                    })
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.refNo} — {c.name}{c.passportNo ? ` · ${c.passportNo}` : ''}
                      </option>
                    ))}
                </select>
              </div>
              <div className="bhat-form-group">
                <label>Type</label>
                <select value={inForm.type}
                  onChange={e => setInForm(p => ({ ...p, type: e.target.value }))}>
                  {INCOME_TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
                </select>
              </div>
              <AmountAndCurrency
                amount={inForm.amount} currency={inForm.currency}
                onAmount={v => setInForm(p => ({ ...p, amount: v }))}
                onCurrency={v => setInForm(p => ({ ...p, currency: v }))} />
              <div className="bhat-form-group">
                <label>Date</label>
                <input type="date" value={inForm.paidAt}
                  onChange={e => setInForm(p => ({ ...p, paidAt: e.target.value }))} />
              </div>
              <div className="bhat-form-group">
                <label>Description</label>
                <input type="text" value={inForm.description}
                  onChange={e => setInForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="e.g. cash deposit at office" />
              </div>
              <button className="bhat-btn bhat-btn-primary bhat-btn-block" type="submit" disabled={busy}>
                {busy ? 'Saving…' : '💵 Record Payment'}
              </button>
            </form>
          ) : (
            <form onSubmit={submitOut} className="bhat-panel">
              <div className="bhat-panel-title">+ Record Expense (Paid OUT)</div>
              <div className="bhat-form-group">
                <label>Type</label>
                <select value={outForm.type}
                  onChange={e => setOutForm(p => ({ ...p, type: e.target.value }))}>
                  {EXPENSE_TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
                </select>
              </div>
              <AmountAndCurrency
                amount={outForm.amount} currency={outForm.currency}
                onAmount={v => setOutForm(p => ({ ...p, amount: v }))}
                onCurrency={v => setOutForm(p => ({ ...p, currency: v }))} />

              <div className="bhat-form-group">
                <label>Bank Account Holder Name</label>
                <input type="text" value={outForm.bankAccountHolder}
                  onChange={e => setOutForm(p => ({ ...p, bankAccountHolder: e.target.value }))}
                  placeholder="e.g. Ramesh Kumar (recipient name on bank account)" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div className="bhat-form-group">
                  <label>Bank Name</label>
                  <input type="text" value={outForm.bankName}
                    onChange={e => setOutForm(p => ({ ...p, bankName: e.target.value }))}
                    placeholder="e.g. Nepal SBI" />
                </div>
                <div className="bhat-form-group">
                  <label>Account Number / Last 4</label>
                  <input type="text" value={outForm.bankAccountNumber}
                    onChange={e => setOutForm(p => ({ ...p, bankAccountNumber: e.target.value }))}
                    placeholder="e.g. ****1234" />
                </div>
              </div>
              <div className="bhat-form-group">
                <label>Vendor / Recipient</label>
                <input type="text" value={outForm.vendor}
                  onChange={e => setOutForm(p => ({ ...p, vendor: e.target.value }))}
                  placeholder="e.g. Agent Ramesh, City Hospital" />
              </div>
              <div className="bhat-form-group">
                <label>Linked Candidate (optional)</label>
                <select value={outForm.clientId}
                  onChange={e => setOutForm(p => ({ ...p, clientId: e.target.value }))}>
                  <option value="">— not linked —</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.refNo} — {c.name}</option>)}
                </select>
              </div>
              <div className="bhat-form-group">
                <label>Date</label>
                <input type="date" value={outForm.paidAt}
                  onChange={e => setOutForm(p => ({ ...p, paidAt: e.target.value }))} />
              </div>
              <div className="bhat-form-group">
                <label>Description</label>
                <input type="text" value={outForm.description}
                  onChange={e => setOutForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="e.g. embassy visa fee for Bikram Thapa" />
              </div>
              <button className="bhat-btn bhat-btn-primary bhat-btn-block" type="submit" disabled={busy}>
                {busy ? 'Saving…' : '💸 Record Expense'}
              </button>
            </form>
          )}

          {/* RIGHT — entries list */}
          <div className="bhat-panel">
            <div className="bhat-panel-title">
              {tab === 'in' ? 'Payments Received' : 'Expenses Paid Out'}
              <span className="bhat-tt" style={{ marginLeft:'auto' }}>{visible.length} entries</span>
            </div>
            <div className="bhat-table">
              <div className="bhat-th" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.5fr 110px' }}>
                <div>{tab === 'in' ? 'Candidate' : 'Recipient'}</div>
                <div>Type</div><div>Amount</div>
                <div>Date</div>
                <div>{tab === 'in' ? 'Description' : 'Bank / Notes'}</div>
                <div>Action</div>
              </div>
              {visible.length === 0 && (
                <div style={{ padding:32, textAlign:'center', color:'var(--text-3)', fontSize:13 }}>
                  No {tab === 'in' ? 'payments' : 'expenses'} recorded yet.
                </div>
              )}
              {visible.map(e => (
                <div className="bhat-tr" key={e.id} style={{ gridTemplateColumns:'1.5fr 1fr 1fr 1fr 1.5fr 110px' }}>
                  <div>
                    {tab === 'in' ? (
                      <>
                        <strong>{e.client?.name || '—'}</strong>
                        <div className="bhat-tt">{e.client?.refNo}</div>
                      </>
                    ) : (
                      <>
                        <strong>{e.bankAccountHolder || e.vendor || '—'}</strong>
                        {e.client?.name && <div className="bhat-tt">↳ for {e.client.name}</div>}
                      </>
                    )}
                  </div>
                  <div>
                    <span className={`bhat-pill ${e.type === 'refund' ? 'miss' : (e.status === 'refunded' ? 'exp' : 'ok')}`}>
                      {prettyType(e.type)}
                    </span>
                  </div>
                  <div style={{ fontWeight:600,
                    color: e.amount < 0 || e.type === 'refund' ? 'var(--red)'
                         : tab === 'out' ? 'var(--orange)' : 'var(--text-1)',
                  }}>{fmt(e.amount, e.currency)}</div>
                  <div className="bhat-tt">{new Date(e.paidAt).toISOString().slice(0,10)}</div>
                  <div className="bhat-tt" style={{
                    textDecoration: e.status === 'refunded' ? 'line-through' : 'none',
                  }}>
                    {tab === 'in'
                      ? (e.description || '—')
                      : (
                        <>
                          {e.bankName && <span>{e.bankName}</span>}
                          {e.bankAccountNumber && <span> · {e.bankAccountNumber}</span>}
                          {e.description && <div style={{ marginTop:2 }}>{e.description}</div>}
                          {!e.bankName && !e.description && '—'}
                        </>
                      )}
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    {e.status === 'active' && e.type !== 'refund' && tab === 'in' && (
                      <button className="bhat-btn bhat-btn-ghost"
                        style={{ padding:'4px 8px', fontSize:11, color:'var(--orange)' }}
                        onClick={() => refund(e.id)}>↺ Refund</button>
                    )}
                    {user.role === 'super_admin' && (
                      <button className="bhat-btn bhat-btn-ghost"
                        style={{ padding:'4px 8px', fontSize:11, color:'var(--red)' }}
                        onClick={() => remove(e.id)}>🗑</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BhatLayout>
  );
}

function tabStyle(active) {
  return {
    padding:'8px 16px', fontSize:13, fontWeight:500, borderRadius:5,
    color: active ? 'white' : 'var(--text-2)',
    background: active ? 'var(--accent)' : 'transparent',
    transition: 'all .15s', cursor:'pointer',
  };
}
function fmt(amount, currency = 'NPR') {
  if (amount === null || amount === undefined) return '—';
  const sign = amount < 0 ? '-' : '';
  return `${sign}${currency} ${Math.abs(amount).toLocaleString()}`;
}
function prettyType(t) {
  return t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function Stat({ lbl, val, klass }) {
  const color = klass === 'good' ? 'var(--green)'
              : klass === 'danger' ? 'var(--red)'
              : klass === 'warn' ? 'var(--orange)' : 'var(--text-1)';
  return (
    <div className="bhat-panel">
      <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.5px' }}>{lbl}</div>
      <div style={{ fontSize:22, fontWeight:600, marginTop:6, color }}>{val}</div>
    </div>
  );
}
function AmountAndCurrency({ amount, currency, onAmount, onCurrency }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:8 }}>
      <div className="bhat-form-group">
        <label>Amount *</label>
        <input type="number" step="0.01" min="0" required
          value={amount} onChange={e => onAmount(e.target.value)} />
      </div>
      <div className="bhat-form-group">
        <label>Currency</label>
        <select value={currency} onChange={e => onCurrency(e.target.value)}>
          <option>NPR</option><option>INR</option><option>EUR</option>
          <option>USD</option><option>TRY</option>
        </select>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx, { minRole: 'admin' });
  if (guard.redirect) return { redirect: guard.redirect };
  const user = guard.user;

  await connectDB();
  const countryCode = user.currentCountry || 'TR';

  const clients = await BhatClient.find({ country: countryCode }).sort({ updatedAt: -1 }).lean();
  const clientIds = clients.map(c => c._id);

  // Pull both client-linked and standalone (expenses w/o client)
  const ledgerRaw = await BhatLedger.find({
    $or: [
      { client: { $in: clientIds } },
      { client: null },
    ],
  }).sort({ paidAt: -1 }).limit(300)
    .populate('client', 'fullName refNo country').lean();

  const entries = ledgerRaw.map(e => ({
    id: e._id.toString(),
    direction: e.direction || 'in',
    client: e.client ? { id: e.client._id.toString(), name: e.client.fullName, refNo: e.client.refNo } : null,
    type: e.type, amount: e.amount, currency: e.currency,
    description: e.description, paidAt: e.paidAt.toISOString(),
    status: e.status,
    bankAccountHolder: e.bankAccountHolder, bankName: e.bankName,
    bankAccountNumber: e.bankAccountNumber, vendor: e.vendor,
  }));

  const totals = { income: 0, expense: 0, currency: 'NPR' };
  for (const e of entries) {
    if (e.status !== 'active') continue;
    if (e.direction === 'in')  totals.income  += e.amount;
    if (e.direction === 'out') totals.expense += e.amount;
    totals.currency = e.currency;
  }

  return {
    props: {
      user, countryCode,
      clients: clients.map(c => ({
        id: c._id.toString(), name: c.fullName, refNo: c.refNo,
        passportNo: c.passportNo || null,
      })),
      entries, totals,
    },
  };
}
