// =====================================================
// /bhat/cv/[id]/print — print-friendly CV
// User opens, hits Ctrl+P / browser Print → "Save as PDF"
// =====================================================
import Head from 'next/head';
import { useEffect } from 'react';
import connectDB from '../../../../lib/db';
import BhatClient from '../../../../models/BhatClient';
import BhatCV from '../../../../models/BhatCV';
import { requireBhatUser } from '../../../../lib/bhatAuth';
import { COUNTRIES } from '../../../../lib/bhatConstants';

export default function CVPrint({ client, cv }) {
  // Auto-trigger the browser's print dialog when the page loads
  useEffect(() => { setTimeout(() => window.print(), 500); }, []);

  const country = COUNTRIES[client.country] || {};
  const fatherName = cv.manualFatherName || cv.autoFatherName || '—';
  const motherName = cv.autoMotherName || '—';
  const dob = cv.autoDob ? new Date(cv.autoDob).toISOString().slice(0,10) : '—';

  return (
    <>
      <Head>
        <title>CV — {cv.autoFullName || client.fullName}</title>
        <style>{`
          @page { size: A4; margin: 18mm; }
          @media print { .no-print { display: none !important; } }
        `}</style>
      </Head>

      <div className="cv-page">
        <div className="no-print" style={{ position:'fixed', top:10, right:10, zIndex:100 }}>
          <button onClick={() => window.print()}
            style={{ padding:'8px 16px', background:'#4f8cff', color:'white', border:'none', borderRadius:6, cursor:'pointer' }}>
            🖨 Print / Save as PDF
          </button>
        </div>

        <header>
          <h1>{cv.autoFullName || client.fullName}</h1>
          <p className="sub">{cv.positionApplied || 'Candidate'} — {cv.yearsExperience || 0} years experience</p>
          <p className="sub">{country.flag} {country.name} placement • Ref: {client.refNo}</p>
        </header>

        <Section title="Personal Information">
          <Row k="Full Name (passport)" v={cv.autoFullName || client.fullName} />
          <Row k="Father's Name"        v={fatherName} />
          <Row k="Mother's Name"        v={motherName} />
          <Row k="Marital Status"       v={cv.maritalStatus === 'married' ? 'Married' : 'Unmarried'} />
          {cv.maritalStatus === 'married' && <Row k="Spouse Name" v={cv.spouseName || '—'} />}
          <Row k="Date of Birth"        v={dob} />
          <Row k="Gender"               v={cv.autoGender || '—'} />
          <Row k="Religion"             v={cv.religion || '—'} />
          <Row k="Nationality"          v={cv.autoNationality || '—'} />
        </Section>

        <Section title="Passport Details">
          <Row k="Passport No."  v={cv.autoPassportNo || '—'} />
          <Row k="Issue Date"    v={cv.autoPassportIssue ? new Date(cv.autoPassportIssue).toISOString().slice(0,10) : '—'} />
          <Row k="Expiry Date"   v={cv.autoPassportExpiry ? new Date(cv.autoPassportExpiry).toISOString().slice(0,10) : '—'} />
        </Section>

        <Section title="Contact">
          <Row k="Permanent Address" v={cv.permanentAddress || cv.autoAddress || '—'} />
        </Section>

        <Section title="Skills & Languages">
          <Row k="Position Applied" v={cv.positionApplied || '—'} />
          <Row k="Experience"       v={`${cv.yearsExperience || 0} years`} />
          <Row k="Languages"        v={cv.languages || '—'} />
        </Section>

        <footer>
          <p>Bhat Overseas Recruitment • Generated {new Date().toLocaleDateString()}</p>
        </footer>
      </div>

      <style jsx>{`
        .cv-page {
          max-width: 720px; margin: 30px auto; padding: 40px;
          background: white; color: #1a1a1a; font-family: Georgia, serif;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
        }
        @media print { .cv-page { box-shadow: none; margin: 0; padding: 0; } }
        header { border-bottom: 2px solid #1a1a1a; padding-bottom: 14px; margin-bottom: 18px; }
        header h1 { font-size: 26px; margin: 0; }
        .sub { color: #555; font-size: 13px; margin: 4px 0 0; }
        footer { border-top: 1px solid #ccc; padding-top: 12px; margin-top: 28px;
          font-size: 11px; color: #888; text-align: center; }
      `}</style>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginTop: 18 }}>
      <h3 style={{
        fontSize: 13, textTransform: 'uppercase', letterSpacing: 1,
        margin: '8px 0', borderBottom: '1px solid #ccc', paddingBottom: 4, color:'#1a1a1a',
      }}>{title}</h3>
      {children}
    </section>
  );
}
function Row({ k, v }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', fontSize:13 }}>
      <span style={{ color:'#555', minWidth:160 }}>{k}</span>
      <span>{v}</span>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx);
  if (guard.redirect) return { redirect: guard.redirect };

  await connectDB();
  const client = await BhatClient.findById(ctx.params.id).lean();
  if (!client) return { notFound: true };
  const cv = (await BhatCV.findOne({ client: client._id }).lean()) || {};

  return {
    props: {
      client: {
        id: client._id.toString(),
        fullName: client.fullName, refNo: client.refNo,
        country: client.country, company: client.company || null,
      },
      cv: JSON.parse(JSON.stringify(cv)),
    },
  };
}
