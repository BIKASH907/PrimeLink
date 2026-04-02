import Layout from '../components/Layout';
import Link from 'next/link';

export default function ForEmployers() {
  return (
    <Layout title="For Employers" description="Hire skilled Asian and African workers for your Romanian business. Temporary staffing, permanent placement, and full compliance support.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/services">Services</Link> / <span>For Employers</span></div>
          <h1>For Romanian Employers</h1>
          <p>Access a reliable, motivated workforce from Asia and Africa — we handle everything from recruitment to placement.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col">
            <div className="two-col-text">
              <p className="section-label">The Problem</p>
              <h2>Romania's Labor Shortage Is Real</h2>
              <p>Romania has lost over 5 million workers to Western European emigration. Industries like construction, manufacturing, agriculture, and hospitality face chronic staffing shortages that limit growth and delay projects.</p>
              <p>Domestic recruitment alone cannot fill the gap. International workforce solutions are not just an option — they're a necessity for Romanian businesses that want to grow.</p>
            </div>
            <div className="two-col-text">
              <p className="section-label">The Solution</p>
              <h2>We Bring the Workers to You</h2>
              <p>Primelink Human Capital sources skilled and semi-skilled workers from Nepal, India, Bangladesh, Sri Lanka, Kenya, Nigeria, Philippines, Pakistan, Kenya, Nigeria, Ethiopia, and more — countries with large, young, motivated workforces eager for European employment.</p>
              <p>We handle the entire process: sourcing, screening, documentation, work permits, travel, and placement. You simply tell us what you need, and we deliver.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">How It Works</p>
            <h2>Simple Process for Employers</h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { num: '1', title: 'Submit Your Requirements', desc: 'Tell us the positions, skills, number of workers, and timeline through our employer inquiry form.' },
              { num: '2', title: 'We Source & Screen', desc: 'Our recruitment network in Asia and Africa identifies candidates matching your exact specifications. We conduct skills tests, interviews, and background checks.' },
              { num: '3', title: 'You Review & Approve', desc: 'We present shortlisted candidates with full profiles. You interview (via video call if preferred) and select your workers.' },
              { num: '4', title: 'Documentation & Permits', desc: 'We process all work permits (aviz de muncă) through IGI, prepare contracts, and coordinate visa applications.' },
              { num: '5', title: 'Workers Arrive & Start', desc: 'Workers travel to Romania, complete orientation, and begin work at your site. We provide ongoing support for the duration of the placement.' },
            ].map((s, i) => (
              <div className="process-step" key={i}>
                <div className="step-number">{s.num}</div>
                <div>
                  <h4 style={{ marginBottom: '6px' }}>{s.title}</h4>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.93rem' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Benefits</p>
            <h2>Why Hire Through Primelink</h2>
          </div>
          <div className="grid-3">
            {[
              { icon: '⚡', title: 'Fast Deployment', desc: 'Workers ready for deployment within 6-10 weeks from initial request, depending on permit processing.' },
              { icon: '📜', title: 'Full Legal Compliance', desc: 'All workers come with proper work permits, contracts, and social contributions — zero legal risk for you.' },
              { icon: '🔍', title: 'Pre-Screened Talent', desc: 'Every candidate is skills-tested, interviewed, medically examined, and background-checked before presentation.' },
              { icon: '💰', title: 'Cost-Effective', desc: '€2,500 flat fee per candidate. No monthly commission, no hidden costs. One payment covers the entire recruitment process.' },
              { icon: '🔄', title: 'Replacement Guarantee', desc: 'If a worker is unsuitable within the first 30 days, we provide a replacement at no additional cost.' },
              { icon: '🛡️', title: 'Ongoing Support', desc: 'We remain the point of contact throughout the placement — handling any issues, paperwork renewals, and worker welfare.' },
            ].map((b, i) => (
              <div className="card" key={i}>
                <div className="card-body">
                  <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{b.icon}</div>
                  <h4 className="card-title">{b.title}</h4>
                  <p className="card-text">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Staffing Models</p>
            <h2>Flexible Workforce Solutions</h2>
          </div>
          <div className="grid-3">
            {[
              { title: 'Temporary Staffing', desc: 'Workers employed by Primelink, assigned to your worksite. We handle payroll, taxes, and compliance. Ideal for projects and seasonal needs.', badge: 'Most Popular' },
              { title: 'Permanent Placement', desc: 'We recruit and present candidates for direct hire into your company. One-time fee. Ideal for long-term positions.' },
              { title: 'Project-Based', desc: 'Dedicated teams assembled for specific projects — construction, factory setup, seasonal harvest. Scaled up or down as needed.' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {m.badge && <span style={{ background: 'var(--amber)', color: 'var(--navy)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>{m.badge}</span>}
                <h3 style={{ color: 'var(--white)', marginTop: m.badge ? '14px' : '0', marginBottom: '12px' }}>{m.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to Hire?</h2>
            <p>Submit your workforce requirements and receive a tailored proposal within 48 hours.</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">Submit Inquiry →</Link>
              <Link href="/contact" className="btn btn-white btn-lg">Talk to Us</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
