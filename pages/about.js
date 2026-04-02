import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';

export default function About() {
  return (
    <Layout title="About Us" description="Learn about Primelink Human Capital S.R.L. — a Romanian-registered staffing agency connecting Asian and African workers with European employers.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>About Us</span></div>
          <h1>About Primelink Human Capital</h1>
          <p>Bridging Asian and African talent with Romanian opportunity — legally, ethically, and efficiently.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col">
            <div className="two-col-text">
              <p className="section-label">Our Story</p>
              <h2>Built to Bridge Continents</h2>
              <p>
                {COMPANY.legal} was founded with a clear mission: to address Romania's growing labor shortage by
                connecting the country's employers with the vast, motivated workforce of Asia and Africa — particularly
                Nepal, India, Bangladesh, Sri Lanka, Kenya, Nigeria, Philippines, Pakistan, Kenya, Nigeria, Ethiopia, and more.
              </p>
              <p>
                As Romania's economy grows and its domestic workforce shrinks due to emigration and demographic
                shifts, industries like construction, manufacturing, hospitality, and agriculture face critical staffing gaps.
                Meanwhile, millions of skilled and semi-skilled workers in Asia and Africa seek legitimate pathways to European employment.
              </p>
              <p>
                Primelink Human Capital exists to create that pathway — transparently, legally, and with the
                highest standards of worker welfare and employer satisfaction.
              </p>
            </div>
            <div className="two-col-image">🏛️</div>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="grid-2">
            <div>
              <p className="section-label">Our Mission</p>
              <h3 style={{ marginBottom: '16px' }}>To be Romania's most trusted international staffing partner</h3>
              <p style={{ color: 'var(--gray-500)', lineHeight: '1.8' }}>
                We aim to set the industry standard for ethical recruitment of Asian and African workers into Romania
                and the broader EU market. Every placement we make is built on transparency, legal compliance,
                and mutual benefit for both employers and workers.
              </p>
            </div>
            <div>
              <p className="section-label">Our Vision</p>
              <h3 style={{ marginBottom: '16px' }}>A world where talent flows freely and fairly</h3>
              <p style={{ color: 'var(--gray-500)', lineHeight: '1.8' }}>
                We envision a future where international labor mobility is efficient, dignified, and accessible —
                where a skilled worker in Nepal or India can find meaningful employment in Europe through
                trusted channels, and where Romanian businesses never have to turn down projects due to staffing shortages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Our Values</p>
            <h2>What Drives Us</h2>
          </div>
          <div className="grid-4">
            {[
              { icon: '⚖️', title: 'Legal Compliance', desc: 'Every operation adheres to Romanian, EU, and source-country labor laws.' },
              { icon: '🤝', title: 'Ethical Recruitment', desc: 'Zero tolerance for exploitation. Fair fees, transparent processes, worker protection.' },
              { icon: '✅', title: 'Quality First', desc: 'Rigorous screening ensures only qualified, motivated candidates are placed.' },
              { icon: '🔄', title: 'End-to-End Support', desc: 'From sourcing to settlement, we support both employers and workers throughout.' },
            ].map((v, i) => (
              <div className="card" key={i}>
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{v.icon}</div>
                  <h4 className="card-title">{v.title}</h4>
                  <p className="card-text">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Company Registration</p>
            <h2>Officially Registered in Romania</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Full legal transparency — our company details are public record.</p>
          </div>
          <div style={{ maxWidth: '700px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: '36px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', fontSize: '0.95rem' }}>
              <tbody>
                {[
                  ['Legal Name', COMPANY.legal],
                  ['CUI (Tax ID)', COMPANY.cui],
                  ['Trade Registry Nr.', COMPANY.regNo],
                  ['EUID', COMPANY.euid],
                  ['Certificate', 'Seria B Nr. 5780913 — Issued 01.04.2026'],
                  ['Legal Form', 'Societate cu Răspundere Limitată (S.R.L.)'],
                  ['Primary CAEN', '7820 — Temporary Staffing Agency'],
                  ['Duration', 'Unlimited (Nedeterminată)'],
                  ['Registered Office', 'Str. Aleksandr Sergheevici Pușkin, Nr. 8, Ap. 2, Sector 1, București'],
                  ['Registry Court', 'Oficiul Registrului Comerțului de pe lângă Tribunalul București'],
                  ['Authorization', 'Încheierea nr. 263477 din 30.03.2026'],
                  ['Administrator', 'BHAT BIKASH — Full Powers (Puteri Depline)'],
                  ['Admin Mandate', '49 years (23.03.2026 — 23.03.2075)'],
                  ['Status', 'Active (Funcțiune)'],
                ].map(([label, value], i) => (
                  <tr key={i}>
                    <td style={{ padding: '10px 0', color: 'rgba(255,255,255,0.5)', verticalAlign: 'top', width: '40%' }}>{label}</td>
                    <td style={{ padding: '10px 0', color: 'var(--white)', fontWeight: 500 }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Partner With Us</h2>
            <p>Whether you need workers for your Romanian business or want to explore a B2B staffing partnership — let's talk.</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">Employer Inquiry</Link>
              <Link href="/contact" className="btn btn-white btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
