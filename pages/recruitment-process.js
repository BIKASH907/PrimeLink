import Layout from '../components/Layout';
import Link from 'next/link';

export default function RecruitmentProcess() {
  return (
    <Layout title="Recruitment Process" description="Our 6-step international recruitment process — from initial inquiry to worker placement in Romania.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Recruitment Process</span></div>
          <h1>Our Recruitment Process</h1>
          <p>A transparent, compliant, and efficient 6-step journey from inquiry to placement.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            {[
              { num: '01', title: 'Employer Needs Assessment', time: 'Day 1-3', desc: 'Romanian employer submits their workforce requirements through our inquiry form or direct consultation. We analyze the positions, skills needed, number of workers, timeline, and any specific requirements (accommodation, language, certifications).', details: ['Number and type of positions', 'Required skills and experience', 'Project duration and start date', 'Accommodation and transport provisions', 'Salary range and benefits'] },
              { num: '02', title: 'Candidate Sourcing', time: 'Week 1-3', desc: 'We activate our recruitment network across Nepal, India, Bangladesh, Sri Lanka, Philippines, Kenya, Nigeria, and more. Our local partners and recruitment agents identify candidates matching the employer\'s exact specifications.', details: ['Local recruitment drives in source countries', 'Database search of pre-registered candidates', 'Partner agency coordination', 'Initial eligibility screening', 'Skills-based shortlisting'] },
              { num: '03', title: 'Screening & Selection', time: 'Week 2-4', desc: 'Shortlisted candidates undergo rigorous screening including skills testing, video interviews, medical examinations, background checks, and document verification.', details: ['Trade-specific skills testing', 'Video interviews (with employer participation if desired)', 'Medical fitness examination', 'Criminal background check', 'Document authenticity verification', 'Reference checks from previous employers'] },
              { num: '04', title: 'Documentation & Permits', time: 'Week 4-8', desc: 'Once candidates are approved, we process all legal documentation — work permit applications through IGI (Inspectoratul General pentru Imigrări), employment contracts, and visa coordination.', details: ['Work permit (aviz de muncă) application', 'Employment contract preparation', 'Long-stay visa (Type D) coordination', 'Apostille and document legalization', 'Travel document preparation'] },
              { num: '05', title: 'Travel & Arrival', time: 'Week 8-10', desc: 'Workers receive their visas, book flights, and travel to Romania. We coordinate airport pickup, initial accommodation, and comprehensive cultural/workplace orientation.', details: ['Flight booking and travel coordination', 'Airport pickup in Romania', 'Initial accommodation arrangement', 'Cultural and workplace orientation', 'Romanian basics and safety training', 'SIM card, bank account setup assistance'] },
              { num: '06', title: 'Placement & Ongoing Support', time: 'Ongoing', desc: 'Workers begin employment at the designated worksite. Primelink provides continuous support for both the employer and workers throughout the contract duration.', details: ['Worker integration monitoring', 'Regular check-ins with employer and worker', 'Conflict resolution and mediation', 'Contract renewal processing', 'Work permit renewal coordination', 'Emergency support line 24/7'] },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '30px', marginBottom: '40px', paddingBottom: '40px', borderBottom: i < 5 ? '1px solid var(--gray-100)' : 'none' }}>
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  <div className="step-number" style={{ width: '56px', height: '56px', fontSize: '1.2rem' }}>{step.num}</div>
                  <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--amber)', fontWeight: 600 }}>{step.time}</div>
                </div>
                <div>
                  <h3 style={{ marginBottom: '10px' }}>{step.title}</h3>
                  <p style={{ color: 'var(--gray-500)', lineHeight: '1.7', marginBottom: '16px' }}>{step.desc}</p>
                  <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
                    {step.details.map((d, j) => (
                      <div key={j} style={{ display: 'flex', gap: '10px', padding: '4px 0', fontSize: '0.88rem', color: 'var(--gray-600)' }}>
                        <span style={{ color: 'var(--blue)' }}>→</span> {d}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Timeline</p>
            <h2>Typical Timeline: 6-10 Weeks</h2>
            <p>From initial inquiry to workers starting on your site. Actual timelines depend on work permit processing and visa appointment availability.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Start the Process Today</h2>
            <p>Submit your requirements and we'll begin sourcing candidates immediately.</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">Employer Inquiry</Link>
              <Link href="/apply" className="btn btn-white btn-lg">Worker Application</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
