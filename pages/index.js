import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="container">
          <div className="hero-content" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '100%' }}>
            <p className="section-label" style={{ color: 'var(--amber)' }}>B2B LICENSED STAFFING AGENCY IN ROMANIA</p>
            <h1>Connecting <span className="highlight">Asian and African Talent</span> with Romanian Industry</h1>
            <p style={{ maxWidth: '900px', margin: '0 auto 32px' }}>We are a Romanian-registered B2B workforce recruitment agency. We source skilled and semi-skilled workers from Nepal, India, Bangladesh, Sri Lanka, Philippines, Pakistan, Kenya, Nigeria, Ethiopia, and more — for Romanian employers across construction, manufacturing, hospitality, agriculture, logistics, and beyond.</p>
            <div className="hero-buttons" style={{ justifyContent: 'center' }}>
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">Hire Workers →</Link>
              <Link href="/contact" className="btn btn-white btn-lg">Contact Us</Link>
            </div>
            <div className="hero-stats" style={{ justifyContent: 'center' }}>
              <div className="hero-stat"><h3>B2B</h3><p>Employer Only</p></div>
              <div className="hero-stat"><h3>€2,500</h3><p>Flat Fee Per Candidate</p></div>
              <div className="hero-stat"><h3>0%</h3><p>No Commission</p></div>
              <div className="hero-stat"><h3>18+</h3><p>CAEN Activity Codes</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Our B2B Services</p>
            <h2>End-to-End Workforce Solutions for Employers</h2>
            <p>We work exclusively with businesses. One flat fee, no commission, no hidden costs.</p>
          </div>
          <div className="grid-3">
            <div className="card"><div className="card-body">
              <div className="card-icon">🏢</div>
              <h4 className="card-title">Temporary Staffing</h4>
              <p className="card-text">Licensed under CAEN 7820, we provide temporary workers employed by us and assigned to your worksite. Flexible durations — seasonal, project-based, or ongoing.</p>
              <Link href="/for-employers" className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>Learn More</Link>
            </div></div>
            <div className="card"><div className="card-body">
              <div className="card-icon">🎯</div>
              <h4 className="card-title">Permanent Placement</h4>
              <p className="card-text">We source, screen, and present candidates for direct hire into your company. One-time fee of €2,500 per candidate. No ongoing charges.</p>
              <Link href="/for-employers" className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>Learn More</Link>
            </div></div>
            <div className="card"><div className="card-body">
              <div className="card-icon">📋</div>
              <h4 className="card-title">Full Documentation</h4>
              <p className="card-text">Work permits, visa applications, employment contracts, tax registration — all legal paperwork handled by our team. You focus on your business.</p>
              <Link href="/recruitment-process" className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>Learn More</Link>
            </div></div>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Why Primelink</p>
            <h2>Romania's B2B Bridge to International Workforce</h2>
            <p>Romania faces growing labor shortages across key industries. We solve this for businesses — not individuals. Primelink Human Capital works exclusively B2B, providing Romanian employers with pre-screened, documented, and work-permit-ready employees from Asia and Africa.</p>
          </div>
          <div className="grid-3">
            <div className="card"><div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💰</div>
              <h4 className="card-title">Free for Employers</h4>
              <p className="card-text">Zero recruitment cost for Romanian employers. We supply pre-screened, documented workers ready to start.</p>
            </div></div>
            <div className="card"><div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📜</div>
              <h4 className="card-title">100% Legal & Compliant</h4>
              <p className="card-text">Romanian-registered company (CUI: {COMPANY.cui}). Every worker comes with proper work permits, contracts, and social contributions.</p>
            </div></div>
            <div className="card"><div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔄</div>
              <h4 className="card-title">30-Day Replacement</h4>
              <p className="card-text">If a worker is unsuitable within 30 days, we provide a replacement at no additional cost. Zero risk for your business.</p>
            </div></div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link href="/why-choose-us" className="btn btn-primary btn-lg">Why Choose Us</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Source Countries</p>
            <h2>We Recruit From Asia and Africa</h2>
            <p>Our recruitment network spans major labor markets across two continents.</p>
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

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Industries</p>
            <h2>Sectors We Supply Workers To</h2>
            <p>We provide workforce across Romania's highest-demand industries.</p>
          </div>
          <div className="grid-4">
            {[
              { icon: '🏗️', title: 'Construction', desc: 'Masons, welders, electricians, carpenters, laborers' },
              { icon: '🏭', title: 'Manufacturing', desc: 'Assembly operators, machine workers, technicians' },
              { icon: '🍽️', title: 'Hospitality', desc: 'Cooks, hotel staff, cleaners, restaurant workers' },
              { icon: '🌾', title: 'Agriculture', desc: 'Farm workers, greenhouse, food processing' },
              { icon: '🚛', title: 'Logistics', desc: 'Warehouse workers, drivers, supply chain' },
              { icon: '🏥', title: 'Healthcare', desc: 'Care assistants, nursing aids, support staff' },
              { icon: '🧹', title: 'Facility Services', desc: 'Cleaning, maintenance, security' },
              { icon: '🏪', title: 'Retail & Trade', desc: 'Sales assistants, stock management' },
            ].map((item, i) => (
              <div className="card" key={i}><div className="card-body" style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
                <h4 className="card-title" style={{ fontSize: '1rem' }}>{item.title}</h4>
                <p className="card-text" style={{ fontSize: '0.85rem' }}>{item.desc}</p>
              </div></div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/industries" className="btn btn-primary">View All Industries</Link>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <p className="section-label">How It Works</p>
            <h2>Our B2B Recruitment Process</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>A streamlined 6-step process from your inquiry to workers on your site.</p>
          </div>
          <div className="grid-3">
            {[
              { num: '01', title: 'You Submit Requirements', desc: 'Tell us positions, skills, quantity, and timeline through our employer inquiry form.' },
              { num: '02', title: 'We Source Candidates', desc: 'Our network across Asia and Africa identifies candidates matching your exact needs.' },
              { num: '03', title: 'Screen & Select', desc: 'Skills testing, interviews, medical checks, background verification — we handle it all.' },
              { num: '04', title: 'Documentation', desc: 'Work permits, visa applications, contracts — all legal paperwork processed by our team.' },
              { num: '05', title: 'Travel & Arrival', desc: 'Workers travel to Romania. Airport pickup, accommodation, and orientation coordinated.' },
              { num: '06', title: 'Placement & Support', desc: 'Workers start at your site. Ongoing support for both you and workers throughout the contract.' },
            ].map((step, i) => (
              <div className="process-step" key={i} style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="step-number">{step.num}</div>
                <div>
                  <h4 style={{ color: 'var(--white)', marginBottom: '8px' }}>{step.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/recruitment-process" className="btn btn-amber btn-lg">Full Process Details</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to Solve Your Workforce Shortage?</h2>
            <p>Zero recruitment cost for employers. We supply workers from Asia and Africa directly to your business. Submit requirements and receive candidates within 6-10 weeks.</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">Submit Employer Inquiry →</Link>
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
            <p>Primelink Human Capital is officially registered with the Romanian Trade Registry and operates under full EU compliance.</p>
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
              <h4 className="card-title">Business Details</h4>
              <table style={{ width: '100%', fontSize: '0.88rem' }}><tbody>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Legal Form</td><td style={{ padding: '6px 0', fontWeight: 600 }}>S.R.L. (Limited Liability)</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Primary CAEN</td><td style={{ padding: '6px 0', fontWeight: 600 }}>7820 — Temporary Staffing</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Model</td><td style={{ padding: '6px 0', fontWeight: 600 }}>B2B Only</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Pricing</td><td style={{ padding: '6px 0', fontWeight: 600 }}>Free for employers</td></tr>
                <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Status</td><td style={{ padding: '6px 0' }}><span className="status-badge status-active">Active</span></td></tr>
              </tbody></table>
            </div></div>
            <div className="card"><div className="card-body">
              <h4 className="card-title">Registered Office</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '16px' }}>Strada Aleksandr Sergheevici Pușkin, Nr. 8, Ap. 2, Sector 1, București, Romania</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: '1.7' }}>Registered at Oficiul Registrului Comerțului de pe lângă Tribunalul București. Resolution Nr. 263477 / 30.03.2026. Administrator: BHAT BIKASH</p>
            </div></div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
