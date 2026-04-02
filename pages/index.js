import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';

export default function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <p className="section-label" style={{ color: 'var(--amber)' }}>🇷🇴 Licensed Staffing Agency in Romania</p>
            <h1>
              Connecting <span className="highlight">Asian and African Talent</span> with Romanian Industry
            </h1>
            <p>
              Primelink Human Capital is a Romanian-registered workforce recruitment agency specializing in
              sourcing skilled and semi-skilled workers from Nepal, India, Bangladesh, Sri Lanka, Kenya, Nigeria, Philippines, Pakistan, Kenya, Nigeria, Ethiopia, and more for
              Romanian employers across construction, manufacturing, hospitality, and more.
            </p>
            <div className="hero-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">Hire Workers →</Link>
              <Link href="/apply" className="btn btn-white btn-lg">Apply for Jobs</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <h3>7820</h3>
                <p>CAEN Licensed</p>
              </div>
              <div className="hero-stat">
                <h3>18+</h3>
                <p>Activity Codes</p>
              </div>
              <div className="hero-stat">
                <h3>EU</h3>
                <p>Compliant Operations</p>
              </div>
              <div className="hero-stat">
                <h3>4</h3>
                <p>Source Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Our Services</p>
            <h2>End-to-End Workforce Solutions</h2>
            <p>From recruitment to placement, we handle every step of the international staffing process.</p>
          </div>
          <div className="grid-3">
            <div className="card">
              <div className="card-body">
                <div className="card-icon">🏢</div>
                <h4 className="card-title">For Romanian Employers</h4>
                <p className="card-text">
                  Access a vast pool of motivated, skilled workers from Asia and Africa. We handle recruitment,
                  documentation, work permits, and placement — you focus on your business.
                </p>
                <Link href="/for-employers" className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>Learn More</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="card-icon">👷</div>
                <h4 className="card-title">For Workers</h4>
                <p className="card-text">
                  Dream of working in Europe? We help workers from Nepal, India, Bangladesh, Sri Lanka, Kenya, Nigeria, Philippines, Pakistan, Kenya, Nigeria, Ethiopia, and more
                  find legitimate, well-paying jobs in Romania with full legal support.
                </p>
                <Link href="/for-workers" className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>Learn More</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="card-icon">📋</div>
                <h4 className="card-title">Temporary Staffing</h4>
                <p className="card-text">
                  Licensed under CAEN 7820, we provide temporary and project-based staffing solutions
                  that flex with your workforce demands — seasonal or year-round.
                </p>
                <Link href="/services" className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section section-gray">
        <div className="container">
          <div className="two-col">
            <div className="two-col-text">
              <p className="section-label">Why Primelink</p>
              <h2>Romania's Bridge to Asian and African Workforce</h2>
              <p>
                Romania faces growing labor shortages across key industries. Meanwhile, Asia and Africa has
                millions of skilled workers seeking international employment. Primelink Human Capital
                bridges this gap with a fully compliant, transparent, and efficient recruitment process.
              </p>
              <p>
                As a Romanian-registered company (CUI: {COMPANY.cui}), we operate within the full
                legal framework of Romanian and EU labor law, ensuring protection for both employers
                and workers.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <Link href="/why-choose-us" className="btn btn-primary">Why Choose Us</Link>
                <Link href="/about" className="btn btn-outline">About Us</Link>
              </div>
            </div>
            <div className="two-col-image">🌏</div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Industries</p>
            <h2>Sectors We Serve</h2>
            <p>We supply workforce across Romania's highest-demand industries.</p>
          </div>
          <div className="grid-4">
            {[
              { icon: '🏗️', title: 'Construction', desc: 'Skilled laborers, masons, welders, electricians' },
              { icon: '🏭', title: 'Manufacturing', desc: 'Assembly line operators, machine workers, technicians' },
              { icon: '🍽️', title: 'Hospitality', desc: 'Cooks, hotel staff, cleaning, restaurant workers' },
              { icon: '🌾', title: 'Agriculture', desc: 'Seasonal farm workers, greenhouse, food processing' },
              { icon: '🚛', title: 'Logistics', desc: 'Warehouse workers, drivers, supply chain staff' },
              { icon: '🏥', title: 'Healthcare', desc: 'Care assistants, nursing aids, support staff' },
              { icon: '🧹', title: 'Facility Services', desc: 'Cleaning, maintenance, security personnel' },
              { icon: '🏪', title: 'Retail & Trade', desc: 'Sales assistants, stock management, cashiers' },
            ].map((item, i) => (
              <div className="card" key={i}>
                <div className="card-body" style={{ textAlign: 'center', padding: '24px 16px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
                  <h4 className="card-title" style={{ fontSize: '1rem' }}>{item.title}</h4>
                  <p className="card-text" style={{ fontSize: '0.85rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/industries" className="btn btn-primary">View All Industries</Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <p className="section-label">How It Works</p>
            <h2>Our Recruitment Process</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>A streamlined 6-step process from initial inquiry to worker placement.</p>
          </div>
          <div className="grid-3">
            {[
              { num: '01', title: 'Employer Inquiry', desc: 'Romanian company submits their workforce requirements — positions, skills, quantity, timeline.' },
              { num: '02', title: 'Candidate Sourcing', desc: 'We activate our recruitment network across Nepal, India, Bangladesh, Sri Lanka, Kenya, Nigeria, Philippines, Pakistan, Kenya, Nigeria, Ethiopia, and more.' },
              { num: '03', title: 'Screening & Selection', desc: 'Candidates undergo skills testing, interviews, medical checks, and background verification.' },
              { num: '04', title: 'Documentation', desc: 'Work permits, visa applications, contracts — all legal paperwork handled by our team.' },
              { num: '05', title: 'Travel & Arrival', desc: 'Workers travel to Romania. We coordinate airport pickup, accommodation, and orientation.' },
              { num: '06', title: 'Placement & Support', desc: 'Workers begin employment. Ongoing support for both employer and worker throughout the contract.' },
            ].map((step, i) => (
              <div className="process-step" key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="step-number">{step.num}</div>
                <div>
                  <h4 style={{ color: 'var(--white)', marginBottom: '8px' }}>{step.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/recruitment-process" className="btn btn-amber btn-lg">Learn More About Our Process</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to Solve Your Workforce Needs?</h2>
            <p>Whether you're looking to hire international workers for your Romanian business or seeking B2B staffing partnership — we're here to help.</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">I'm an Employer</Link>
              <Link href="/apply" className="btn btn-white btn-lg">I'm a Job Seeker</Link>
            </div>
          </div>
        </div>
      </section>

      {/* LEGAL REGISTRATION INFO */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Legally Registered</p>
            <h2>Fully Compliant Romanian Company</h2>
            <p>Primelink Human Capital is officially registered with the Romanian Trade Registry and operates under full EU compliance.</p>
          </div>
          <div className="grid-3">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Company Registration</h4>
                <table style={{ width: '100%', fontSize: '0.88rem' }}>
                  <tbody>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Legal Name</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{COMPANY.legal}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>CUI</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{COMPANY.cui}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Reg. Nr.</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{COMPANY.regNo}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>EUID</td><td style={{ padding: '6px 0', fontWeight: 600, wordBreak: 'break-all' }}>{COMPANY.euid}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Certificate</td><td style={{ padding: '6px 0', fontWeight: 600 }}>Seria B Nr. 5780913</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Business Details</h4>
                <table style={{ width: '100%', fontSize: '0.88rem' }}>
                  <tbody>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Legal Form</td><td style={{ padding: '6px 0', fontWeight: 600 }}>S.R.L. (Limited Liability)</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Capital</td><td style={{ padding: '6px 0', fontWeight: 600 }}>20.000 LEI (€4.000)</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Primary CAEN</td><td style={{ padding: '6px 0', fontWeight: 600 }}>7820 — Temporary Staffing</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Duration</td><td style={{ padding: '6px 0', fontWeight: 600 }}>Unlimited</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>Status</td><td style={{ padding: '6px 0' }}><span className="status-badge status-active">Active</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Registered Office</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '16px' }}>
                  Strada Aleksandr Sergheevici Pușkin, Nr. 8, Ap. 2<br />
                  Sector 1, București, Romania<br />
                  030000
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: '1.7' }}>
                  Registered at Oficiul Registrului Comerțului de pe lângă Tribunalul București<br />
                  Resolution Nr. 263477 / 30.03.2026<br />
                  Administrator: BHAT BIKASH — Full Powers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
