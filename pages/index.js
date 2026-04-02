import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="container">
          <div className="hero-content" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '100%' }}>
            <p className="section-label" style={{ color: 'var(--amber)' }}>REGISTERED EMPLOYER IN ROMANIA</p>
            <h1>Workforce Leasing & <span className="highlight">Employer-of-Record</span> Services in Romania</h1>
            <p style={{ maxWidth: '900px', margin: '0 auto 32px' }}>We recruit, employ, and manage international workers under our Romanian entity, and legally assign them to partner companies across various industries.</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
              <span style={{ color: 'var(--amber)', fontWeight: 600, fontSize: '0.95rem' }}>✔ Registered Employer in Romania</span>
              <span style={{ color: 'var(--amber)', fontWeight: 600, fontSize: '0.95rem' }}>✔ Full Employment & Payroll Management</span>
              <span style={{ color: 'var(--amber)', fontWeight: 600, fontSize: '0.95rem' }}>✔ Compliant Workforce Supply Model</span>
            </div>
            <div className="hero-buttons" style={{ justifyContent: 'center' }}>
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">Request Workforce Solution →</Link>
              <Link href="/contact" className="btn btn-white btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">How Our Model Works</p>
            <h2>We Are the Legal Employer</h2>
          </div>
          <div className="grid-3">
            {[
              { num: '01', title: 'We Recruit & Hire', desc: 'We recruit and hire workers under our Romanian company from Asia and Africa.' },
              { num: '02', title: 'Work Permits & Visas', desc: 'We handle work permits, visas, and full legal employment documentation.' },
              { num: '03', title: 'Onboarding & Payroll', desc: 'Workers arrive and are onboarded under our payroll with all social contributions.' },
              { num: '04', title: 'Assignment to Partners', desc: 'We assign workers to partner companies based on their workforce demand.' },
              { num: '05', title: 'Ongoing Management', desc: 'We manage payroll, compliance, accommodation, and worker support throughout.' },
              { num: '06', title: 'Legal Employer Throughout', desc: 'We remain the legal employer for the entire duration of the 1-year contract.' },
            ].map((step, i) => (
              <div className="process-step" key={i}>
                <div className="step-number">{step.num}</div>
                <div>
                  <h4 style={{ marginBottom: '6px' }}>{step.title}</h4>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Our Services</p>
            <h2>What We Offer</h2>
          </div>
          <div className="grid-4">
            <div className="card"><div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👥</div>
              <h4 className="card-title">Workforce Leasing</h4>
              <p className="card-text">Flexible manpower supply without direct hiring burden. Workers employed by us, assigned to you.</p>
            </div></div>
            <div className="card"><div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
              <h4 className="card-title">Employer of Record (EOR)</h4>
              <p className="card-text">We handle employment, payroll, taxes, social contributions, and full legal compliance.</p>
            </div></div>
            <div className="card"><div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛂</div>
              <h4 className="card-title">Immigration & Work Permits</h4>
              <p className="card-text">End-to-end legal processing for foreign workers — work permits, visas, residence permits.</p>
            </div></div>
            <div className="card"><div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔄</div>
              <h4 className="card-title">Workforce Management</h4>
              <p className="card-text">Ongoing support, replacement guarantee, coordination, and worker welfare management.</p>
            </div></div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Compliance</p>
            <h2>Compliance & Legal Framework</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>All workers are legally employed under our Romanian entity and assigned in accordance with Romanian labor laws and applicable EU regulations.</p>
          </div>
          <div className="grid-3">
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '28px', borderRadius: '12px' }}>
              <h4 style={{ color: 'var(--white)', marginBottom: '10px' }}>Employment Law</h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Full compliance with Romanian Labor Code (Codul Muncii). All workers have proper employment contracts.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '28px', borderRadius: '12px' }}>
              <h4 style={{ color: 'var(--white)', marginBottom: '10px' }}>Payroll & Taxes</h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>All social contributions, income tax, health insurance, and pension contributions handled by us.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '28px', borderRadius: '12px' }}>
              <h4 style={{ color: 'var(--white)', marginBottom: '10px' }}>Worker Protection</h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Minimum wage guaranteed (€530+ net/month), accommodation provided, €100 food allowance, health coverage.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Source Countries</p>
            <h2>We Recruit From Asia and Africa</h2>
            <p>Workers sourced through our B2B recruitment partners across two continents.</p>
          </div>
          <div className="grid-4">
            {[
              { flag: '🇳🇵', country: 'Nepal' },
              { flag: '🇮🇳', country: 'India' },
              { flag: '🇧🇩', country: 'Bangladesh' },
              { flag: '🇱🇰', country: 'Sri Lanka' },
              { flag: '🇵🇭', country: 'Philippines' },
              { flag: '🇵🇰', country: 'Pakistan' },
              { flag: '🇰🇪', country: 'Kenya' },
              { flag: '🇳🇬', country: 'Nigeria' },
            ].map((c, i) => (
              <div className="card" key={i}><div className="card-body" style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{c.flag}</div>
                <h4 className="card-title" style={{ fontSize: '0.95rem' }}>{c.country}</h4>
              </div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Industries</p>
            <h2>Sectors We Supply Workers To</h2>
          </div>
          <div className="grid-4">
            {[
              { icon: '🏗️', title: 'Construction', desc: 'Welders, masons, electricians, carpenters, laborers' },
              { icon: '🏭', title: 'Manufacturing', desc: 'CNC operators, assembly, machine operators' },
              { icon: '🍽️', title: 'Hospitality', desc: 'Cooks, hotel staff, cleaners, restaurant workers' },
              { icon: '🌾', title: 'Agriculture', desc: 'Farm workers, food processing, greenhouse' },
              { icon: '🚛', title: 'Logistics', desc: 'Warehouse, forklift operators, drivers' },
              { icon: '🏥', title: 'Healthcare', desc: 'Care assistants, hospital support staff' },
              { icon: '🧹', title: 'Facility Services', desc: 'Industrial cleaning, building maintenance' },
              { icon: '🏪', title: 'Retail & Trade', desc: 'Stock handlers, sales assistants' },
            ].map((item, i) => (
              <div className="card" key={i}><div className="card-body" style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
                <h4 className="card-title" style={{ fontSize: '1rem' }}>{item.title}</h4>
                <p className="card-text" style={{ fontSize: '0.85rem' }}>{item.desc}</p>
              </div></div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/jobs" className="btn btn-primary">View All Available Positions</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Need Workers for Your Business?</h2>
            <p>We supply pre-screened, legally employed, work-permit-ready workers from Asia and Africa. Zero recruitment cost for Romanian employers.</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">Request Workforce Solution →</Link>
              <Link href="/contact" className="btn btn-white btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Legally Registered</p>
            <h2>Fully Compliant Romanian Company</h2>
          </div>
          <div className="grid-3">
            <div className="card"><div className="card-body">
              <h4 className="card-title">Company Registration</h4>
              <table style={{ width: '100%', fontSize: '0.88rem' }}><tbody>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Legal Name</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{COMPANY.legal}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>CUI</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{COMPANY.cui}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Reg. Nr.</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{COMPANY.regNo}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>EUID</td><td style={{ padding: '6px 0', fontWeight: 600, wordBreak: 'break-all' }}>{COMPANY.euid}</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Certificate</td><td style={{ padding: '6px 0', fontWeight: 600 }}>Seria B Nr. 5780913</td></tr>
              </tbody></table>
            </div></div>
            <div className="card"><div className="card-body">
              <h4 className="card-title">Business Model</h4>
              <table style={{ width: '100%', fontSize: '0.88rem' }}><tbody>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Primary CAEN</td><td style={{ padding: '6px 0', fontWeight: 600 }}>7820 — Workforce Leasing</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Model</td><td style={{ padding: '6px 0', fontWeight: 600 }}>EOR & Workforce Leasing</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Contracts</td><td style={{ padding: '6px 0', fontWeight: 600 }}>1 Year + Work Permit</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Employer Cost</td><td style={{ padding: '6px 0', fontWeight: 600 }}>Zero recruitment fee</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Status</td><td style={{ padding: '6px 0' }}><span className="status-badge status-active">Active</span></td></tr>
              </tbody></table>
            </div></div>
            <div className="card"><div className="card-body">
              <h4 className="card-title">Registered Office</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '16px' }}>Strada Aleksandr Sergheevici Pușkin, Nr. 8, Ap. 2, Sector 1, București, Romania</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: '1.7' }}>Oficiul Registrului Comerțului de pe lângă Tribunalul București. Resolution Nr. 263477 / 30.03.2026. Administrator: BHAT BIKASH</p>
            </div></div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
