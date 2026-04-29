// =====================================================
// BhatLayout — topbar + sidebar wrapper for all BHAT pages
// Uses scoped <style jsx global> so it doesn't pollute prime-link's CSS.
// =====================================================
import Link from 'next/link';
import { useRouter } from 'next/router';
import { COUNTRIES, ROLE_LABELS } from '../../lib/bhatConstants';

export default function BhatLayout({ user, children, active, counts = {} }) {
  const router = useRouter();
  const initials = user?.name
    ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const country = COUNTRIES[user?.currentCountry] || { code: '', name: 'Choose Country', flag: '🌍' };
  const isSub = user?.role === 'sub_admin';

  return (
    <>
      <BhatStyles />
      <div className="bhat-app">
        {/* Top Bar */}
        <div className="bhat-topbar">
          <div className="bhat-tb-logo">
            <div className="bhat-logo">BO</div>
            <div className="bhat-tb-name">BHAT OVERSEAS</div>
          </div>

          <Link href="/bhat" className="bhat-country-pill">
            <span>{country.flag}</span>
            <span>{country.name}</span>
            <span className="bhat-chev">▼</span>
          </Link>

          <div className="bhat-search">
            <span className="bhat-search-ico">🔍</span>
            <input type="text" placeholder="Search by Ref No, Agent, or Name..." />
          </div>

          <div className="bhat-tb-actions">
            <span className="bhat-sync"><span className="bhat-sync-dot"></span> Cloud Sync: Active</span>
            <Link href="/bhat/pipeline" className="bhat-tb-icon" title="Notifications">
              🔔<span className="bhat-badge"></span>
            </Link>
            <div className="bhat-profile">
              <div className="bhat-avatar">{initials}</div>
              <div>
                <div className="bhat-prof-name">{user?.name}</div>
                <div className="bhat-prof-role">{ROLE_LABELS[user?.role] || user?.role}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bhat-body">
          {/* Sidebar */}
          <aside className="bhat-sidebar">
            <div className="bhat-nav-section">Workspace</div>

            {!isSub && (
              <Link href="/bhat/pipeline" className={`bhat-nav-item ${active === 'pipeline' ? 'active' : ''}`}>
                <span className="bhat-ico">▤</span> Pipeline
                {counts.pipeline ? <span className="bhat-count">{counts.pipeline}</span> : null}
              </Link>
            )}

            <Link href="/bhat/documents" className={`bhat-nav-item ${active === 'documents' ? 'active' : ''}`}>
              <span className="bhat-ico">📄</span> Documents
              {counts.documents ? <span className="bhat-count">{counts.documents}</span> : null}
            </Link>

            {!isSub && (
              <Link href="/bhat/overview" className={`bhat-nav-item ${active === 'overview' ? 'active' : ''}`}>
                <span className="bhat-ico">📊</span> Overview
              </Link>
            )}

            <Link href="/bhat/cv" className={`bhat-nav-item ${active === 'cv' ? 'active' : ''}`}>
              <span className="bhat-ico">📝</span> CV Builder
            </Link>

            <div className="bhat-nav-section">Operations</div>
            <Link href="/bhat/overview" className="bhat-nav-item">
              <span className="bhat-ico">⚠</span> Alerts
            </Link>
            <Link href="/bhat/overview" className="bhat-nav-item">
              <span className="bhat-ico">🤖</span> Automation Log
            </Link>

            <div className="bhat-sb-footer">
              {(user?.role === 'super_admin' || user?.role === 'admin') && (
                <Link href="/bhat/settings" className={`bhat-nav-item ${active === 'settings' ? 'active' : ''}`}>
                  <span className="bhat-ico">⚙</span> Settings
                </Link>
              )}
              <a href="/api/bhat/auth/logout" className="bhat-nav-item">
                <span className="bhat-ico">↩</span> Sign Out
              </a>
            </div>
          </aside>

          <main className="bhat-main">{children}</main>
        </div>
      </div>
    </>
  );
}

// =====================================================
// Scoped global styles for all BHAT pages.
// =====================================================
export function BhatStyles() {
  return (
    <style jsx global>{`
      .bhat-app, .bhat-app *, .bhat-gate, .bhat-gate * { box-sizing: border-box; }
      .bhat-app {
        --bg-0:#0a0f1c; --bg-1:#0f1626; --bg-2:#131c2f; --bg-3:#1a2440;
        --bg-card:#142036;
        --border:#1f2c4a; --border-strong:#2a3a5e;
        --text-1:#e6edf7; --text-2:#a6b4cc; --text-3:#6b7a96;
        --accent:#4f8cff; --accent-2:#2a6bff; --accent-glow:rgba(79,140,255,0.2);
        --green:#2ecc71; --green-dim:rgba(46,204,113,0.15);
        --red:#ff5470; --red-dim:rgba(255,84,112,0.15);
        --orange:#ff9f43; --orange-dim:rgba(255,159,67,0.15);
        --purple:#a48bff;
        font-family: -apple-system, "Segoe UI", Roboto, "Inter", Arial, sans-serif;
        background: var(--bg-0); color: var(--text-1);
        font-size: 14px; line-height: 1.5;
        min-height: 100vh; display: flex; flex-direction: column;
      }
      .bhat-app a { color: inherit; text-decoration: none; }
      .bhat-app input, .bhat-app select, .bhat-app textarea {
        font-family: inherit; font-size: 14px;
        background: var(--bg-2); color: var(--text-1);
        border: 1px solid var(--border); border-radius: 6px;
        padding: 9px 12px; outline: none;
      }
      .bhat-app input:focus, .bhat-app select:focus, .bhat-app textarea:focus {
        border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow);
      }
      .bhat-app button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }

      /* Top bar */
      .bhat-topbar {
        height: 56px; background: var(--bg-1); border-bottom: 1px solid var(--border);
        display: flex; align-items: center; padding: 0 18px; gap: 14px;
      }
      .bhat-tb-logo { display:flex; align-items:center; gap:10px; min-width:180px; }
      .bhat-logo {
        width:28px; height:28px; border-radius:7px; font-size:12px; font-weight:700;
        background: linear-gradient(135deg, var(--accent), var(--purple));
        display:grid; place-items:center; color:white;
      }
      .bhat-tb-name { font-weight:600; font-size:13px; letter-spacing:.3px; }
      .bhat-country-pill {
        display:flex; align-items:center; gap:8px;
        padding:6px 12px; background:var(--bg-2); border:1px solid var(--border);
        border-radius:7px; font-size:13px; transition: border-color .15s;
      }
      .bhat-country-pill:hover { border-color: var(--accent); }
      .bhat-chev { color: var(--text-3); font-size: 10px; }
      .bhat-search { flex:1; max-width:480px; position:relative; }
      .bhat-search input { width:100%; padding-left:34px; }
      .bhat-search-ico { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--text-3); }
      .bhat-tb-actions { margin-left:auto; display:flex; align-items:center; gap:8px; }
      .bhat-tb-icon {
        width:36px; height:36px; border-radius:7px; display:grid; place-items:center;
        position:relative; color:var(--text-2); transition: background .15s;
      }
      .bhat-tb-icon:hover { background:var(--bg-2); color:var(--text-1); }
      .bhat-badge {
        position:absolute; top:6px; right:7px; width:7px; height:7px;
        background:var(--red); border-radius:50%; border:2px solid var(--bg-1);
      }
      .bhat-sync {
        display:flex; align-items:center; gap:6px; font-size:11px;
        padding:4px 10px; border-radius:999px; background:var(--green-dim); color:var(--green);
      }
      .bhat-sync-dot { width:6px; height:6px; background:var(--green); border-radius:50%; }
      .bhat-profile {
        display:flex; align-items:center; gap:9px; padding:4px 10px 4px 4px;
        border:1px solid var(--border); border-radius:999px;
      }
      .bhat-avatar {
        width:28px; height:28px; border-radius:50%;
        background: linear-gradient(135deg, var(--accent), var(--purple));
        display:grid; place-items:center; font-size:11px; font-weight:600; color:white;
      }
      .bhat-prof-name { font-size:12px; font-weight:500; }
      .bhat-prof-role { font-size:10px; color:var(--text-3); }

      /* Body + sidebar */
      .bhat-body { display:flex; flex:1; min-height:0; }
      .bhat-sidebar {
        width:220px; background:var(--bg-1); border-right:1px solid var(--border);
        padding:18px 12px; flex-shrink:0; display:flex; flex-direction:column; gap:4px;
      }
      .bhat-nav-section {
        font-size:10px; color:var(--text-3); text-transform:uppercase;
        letter-spacing:.8px; padding:12px 10px 6px;
      }
      .bhat-nav-item {
        display:flex; align-items:center; gap:11px; padding:9px 11px;
        border-radius:7px; font-size:13px; color:var(--text-2); transition: all .15s;
      }
      .bhat-nav-item:hover { background:var(--bg-2); color:var(--text-1); }
      .bhat-nav-item.active { background:var(--accent-glow); color:var(--accent); font-weight:500; }
      .bhat-ico { width:16px; display:grid; place-items:center; }
      .bhat-count {
        margin-left:auto; font-size:10px; padding:1px 7px;
        background:var(--bg-3); border-radius:999px; color:var(--text-3);
      }
      .bhat-nav-item.active .bhat-count { background:var(--accent); color:white; }
      .bhat-sb-footer { margin-top:auto; padding-top:12px; border-top:1px solid var(--border); }

      /* Main content */
      .bhat-main { flex:1; display:flex; flex-direction:column; min-width:0; overflow: auto; }
      .bhat-page-head {
        padding:18px 24px 14px; display:flex; align-items:center; gap:16px;
        border-bottom:1px solid var(--border);
      }
      .bhat-page-title { font-size:18px; font-weight:600; }
      .bhat-page-sub { font-size:12px; color:var(--text-3); margin-top:2px; }
      .bhat-page-actions { margin-left:auto; display:flex; gap:8px; }

      .bhat-btn {
        padding:8px 14px; border-radius:7px; font-size:13px; font-weight:500;
        transition: all .15s; display:inline-flex; align-items:center; gap:7px;
      }
      .bhat-btn-primary { background:var(--accent); color:white; }
      .bhat-btn-primary:hover { background:var(--accent-2); }
      .bhat-btn-ghost { background:var(--bg-2); color:var(--text-1); border:1px solid var(--border); }
      .bhat-btn-ghost:hover { background:var(--bg-3); border-color:var(--border-strong); }
      .bhat-btn-block { width:100%; padding:11px; font-weight:600; justify-content:center; }

      /* Gate (login + country picker) */
      .bhat-gate {
        min-height: 100vh; display: flex; align-items: center; justify-content: center;
        flex-direction: column; padding: 40px 20px;
        background:
          radial-gradient(ellipse at top left, rgba(79,140,255,0.08), transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(164,139,255,0.08), transparent 50%),
          #0a0f1c;
        color: #e6edf7;
        font-family: -apple-system, "Segoe UI", Roboto, "Inter", Arial, sans-serif;
      }
      .bhat-gate-brand { display:flex; align-items:center; gap:14px; margin-bottom:32px; }
      .bhat-gate-logo {
        width:46px; height:46px; border-radius:11px; font-size:18px; font-weight:700;
        background: linear-gradient(135deg, #4f8cff, #a48bff);
        display:grid; place-items:center; color:white;
      }
      .bhat-gate-title { font-size: 24px; font-weight: 600; margin-bottom: 6px; text-align:center; color:#e6edf7; }
      .bhat-gate-sub { color: #6b7a96; margin-bottom: 32px; text-align: center; font-size:14px; }

      .bhat-country-grid {
        display: grid; grid-template-columns: repeat(2, 220px); gap: 14px;
      }
      .bhat-country-card {
        padding: 28px 20px; background: #0f1626;
        border: 1px solid #1f2c4a; border-radius: 12px;
        text-align: center; transition: all 0.15s;
        display: block; cursor: pointer;
      }
      .bhat-country-card:hover {
        border-color: #4f8cff; transform: translateY(-2px); background: #131c2f;
      }
      .bhat-country-flag { font-size:42px; margin-bottom:10px; }
      .bhat-country-name { font-size:16px; font-weight:600; margin-bottom:4px; }
      .bhat-country-stats { font-size:11px; color:#6b7a96; margin-bottom:10px; }
      .bhat-tag-pill {
        font-size:10px; padding:3px 8px; background:#131c2f;
        border-radius:4px; display:inline-block; color:#6b7a96;
      }
      .bhat-tag-pill.new { background: rgba(79,140,255,0.2); color:#4f8cff; }
      .bhat-gate-note {
        margin-top: 28px; padding: 11px 16px; background: #0f1626;
        border: 1px solid #1f2c4a; border-radius: 7px;
        font-size: 11px; color: #6b7a96; max-width: 480px; text-align: center;
      }

      .bhat-login-box {
        width: 420px; padding: 40px;
        background: #0f1626; border: 1px solid #1f2c4a;
        border-radius: 14px;
      }
      .bhat-login-back { font-size: 12px; color: #6b7a96; margin-bottom: 14px; display:inline-block; }
      .bhat-login-title { font-size:20px; font-weight:600; }
      .bhat-login-sub { color:#6b7a96; font-size:12px; margin-bottom: 28px; }
      .bhat-form-group { margin-bottom: 16px; }
      .bhat-form-group label { display:block; font-size:12px; color:#a6b4cc; margin-bottom:6px; font-weight:500; }
      .bhat-form-group input, .bhat-form-group select { width:100%; padding:9px 12px;
        background:#131c2f; color:#e6edf7; border:1px solid #1f2c4a; border-radius:6px; outline:none;
        font-family: inherit; font-size: 14px;
      }
      .bhat-role-tabs {
        display:grid; grid-template-columns: repeat(3,1fr); gap:6px;
        background:#131c2f; padding:4px; border-radius:8px; margin-bottom:20px;
      }
      .bhat-role-tab {
        padding:8px; font-size:12px; font-weight:500; border-radius:5px;
        color:#a6b4cc; transition: all .15s; text-align:center;
      }
      .bhat-role-tab.active { background:#4f8cff; color:white; }
      .bhat-error {
        margin-top:12px; padding:10px 12px; background: rgba(255,84,112,0.15);
        border:1px solid #ff5470; border-radius:7px; font-size:12px; color:#ff5470;
      }
      .bhat-login-hint {
        margin-top:18px; padding:10px 12px; background:#131c2f;
        border:1px solid #1f2c4a; border-radius:7px; font-size:11px; color:#6b7a96;
      }

      /* Pipeline kanban */
      .bhat-pipeline-meta {
        display:flex; gap:14px; padding:10px 24px;
        background:var(--bg-1); border-bottom:1px solid var(--border);
        overflow-x:auto;
      }
      .bhat-stat { display:flex; flex-direction:column; padding:4px 0; min-width:90px; flex-shrink:0; }
      .bhat-stat-lbl { font-size:10px; color:var(--text-3); text-transform:uppercase; letter-spacing:.5px; }
      .bhat-stat-val { font-size:17px; font-weight:600; margin-top:2px; }
      .bhat-stat-val.warn { color:var(--orange); }
      .bhat-stat-val.danger { color:var(--red); }
      .bhat-stat-val.good { color:var(--green); }

      .bhat-kanban {
        flex:1; overflow-x:auto; padding:16px 24px;
        display:flex; gap:12px; align-items:stretch;
      }
      .bhat-col {
        width:260px; flex-shrink:0; background:var(--bg-1);
        border:1px solid var(--border); border-radius:10px;
        display:flex; flex-direction:column; overflow:hidden; max-height: calc(100vh - 200px);
      }
      .bhat-col-head { padding:11px 13px; border-bottom:1px solid var(--border);
        display:flex; align-items:center; gap:8px; flex-shrink:0; }
      .bhat-col-num {
        width:22px; height:22px; border-radius:6px;
        background:var(--bg-3); color:var(--text-2);
        display:grid; place-items:center; font-size:11px; font-weight:600;
      }
      .bhat-col-title { font-size:12px; font-weight:600; flex:1; }
      .bhat-col-count { font-size:11px; color:var(--text-3); background:var(--bg-3); padding:2px 7px; border-radius:999px; }
      .bhat-col-body { flex:1; overflow-y:auto; padding:8px; display:flex; flex-direction:column; gap:8px; }

      .bhat-card {
        background:var(--bg-card); border:1px solid var(--border);
        border-radius:8px; padding:11px; transition: all .15s; position:relative;
      }
      .bhat-card:hover { border-color:var(--accent); transform:translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
      .bhat-card.urgent { border-left:3px solid var(--red); }
      .bhat-card-name { font-weight:600; font-size:13px; margin-bottom:3px; }
      .bhat-card-ref { font-size:10px; color:var(--text-3); font-family: monospace; }
      .bhat-card-meta { display:flex; flex-direction:column; gap:3px; margin-top:8px; font-size:11px; color:var(--text-2); }
      .bhat-card-row { display:flex; align-items:center; gap:5px; }
      .bhat-card-lbl { color:var(--text-3); min-width:50px; }
      .bhat-progress { margin-top:9px; display:flex; align-items:center; gap:7px; }
      .bhat-progress-bar { flex:1; height:4px; background:var(--bg-3); border-radius:2px; overflow:hidden; }
      .bhat-progress-fill { height:100%; background: linear-gradient(90deg, var(--accent), var(--purple)); border-radius:2px; }
      .bhat-progress-text { font-size:10px; color:var(--text-3); }
      .bhat-urgent-flag { position:absolute; top:9px; right:9px; color:var(--red); font-size:11px; }
      .bhat-card-time { font-size:10px; color:var(--text-3); margin-top:6px; }

      /* Tables and panels */
      .bhat-panel { background:var(--bg-1); border:1px solid var(--border); border-radius:10px; padding:18px; }
      .bhat-panel-title { font-size:13px; font-weight:600; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
      .bhat-table { width:100%; background:var(--bg-1); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
      .bhat-th, .bhat-tr {
        display:grid; padding:11px 16px; gap:12px; align-items:center;
      }
      .bhat-th { background:var(--bg-2); font-size:11px; color:var(--text-3); text-transform:uppercase; letter-spacing:.5px; font-weight:500; }
      .bhat-tr { border-top:1px solid var(--border); font-size:13px; transition: background .1s; }
      .bhat-tr:hover { background:var(--bg-2); }
      .bhat-pill { display:inline-block; padding:2px 9px; border-radius:999px; font-size:11px; font-weight:500; }
      .bhat-pill.ok { background:var(--green-dim); color:var(--green); }
      .bhat-pill.miss { background:var(--red-dim); color:var(--red); }
      .bhat-pill.exp { background:var(--orange-dim); color:var(--orange); }

      .bhat-tt { font-size:11px; color:var(--text-3); }

      .bhat-doc-list { display:flex; flex-direction:column; gap:8px; }
      .bhat-doc-row {
        display:flex; align-items:center; gap:11px; padding:10px 12px;
        background:var(--bg-2); border:1px solid var(--border); border-radius:7px;
      }
      .bhat-doc-status { width:22px; height:22px; border-radius:5px; display:grid; place-items:center; font-size:11px; flex-shrink:0; }
      .bhat-doc-status.ok { background:var(--green-dim); color:var(--green); }
      .bhat-doc-status.miss { background:var(--red-dim); color:var(--red); }
      .bhat-doc-status.exp { background:var(--orange-dim); color:var(--orange); }

      .bhat-info-grid { display:grid; grid-template-columns: 1fr 1fr; gap:12px 18px; }
      .bhat-field-lbl { font-size:11px; color:var(--text-3); margin-bottom:3px; text-transform:uppercase; letter-spacing:.4px; }
      .bhat-field-val { font-size:13px; }

      .bhat-stage-bar { display:flex; gap:3px; margin:14px 0 4px; }
      .bhat-stage-dot { flex:1; height:5px; background:var(--bg-3); border-radius:2px; }
      .bhat-stage-dot.done { background:var(--accent); }
      .bhat-stage-dot.current { background:var(--purple); }

      @media (max-width: 900px) {
        .bhat-sidebar { display:none; }
        .bhat-country-grid { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}
