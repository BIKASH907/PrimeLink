import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';

export default function WhyChooseUs() {
  return (
    <Layout title="Why Choose Us" description="Why Primelink Human Capital is the trusted choice for international workforce recruitment in Romania.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Why Choose Us</span></div>
          <h1>Why Choose Primelink</h1>
          <p>Legally registered, ethically operated, and results-driven.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '50px' }}>
            {[
              { icon: '🏛️', title: 'Legally Registered Romanian Company', desc: `We are ${COMPANY.legal}, registered with the Romanian Trade Registry (CUI: ${COMPANY.cui}, Nr. ${COMPANY.regNo}). Every operation is fully compliant with Romanian and EU law.` },
              { icon: '🌏', title: 'Deep Asian and African Networks', desc: 'Our founder has deep roots in Asia and Africa with established recruitment partnerships across Nepal, India, Bangladesh, Sri Lanka, Philippines, Kenya, Nigeria, and more. We understand both cultures.' },
              { icon: '⚖️', title: 'Ethical Recruitment Standards', desc: 'We adhere to ILO Fair Recruitment principles. No exploitative fees, no deception, no forced labor. Workers are informed, consenting, and protected at every stage.' },
              { icon: '📋', title: 'End-to-End Service', desc: 'We don\'t just source candidates — we handle screening, documentation, permits, travel, placement, and ongoing support. One partner for the entire process.' },
              { icon: '🔍', title: 'Rigorous Screening', desc: 'Every candidate undergoes skills testing, video interviews, medical examinations, background checks, and reference verification before presentation to employers.' },
              { icon: '🛡️', title: 'Replacement Guarantee', desc: 'If a placed worker is genuinely unsuitable within 30 days, we provide a replacement at no additional recruitment cost.' },
              { icon: '💼', title: 'Industry Expertise', desc: 'We specialize in the sectors with the highest demand — construction, manufacturing, hospitality, agriculture, logistics. We know what employers need.' },
              { icon: '📞', title: '24/7 Support', desc: 'Both employers and workers have access to our support team. Language assistance, conflict resolution, emergency help — we\'re always available.' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px' }}>
                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{r.icon}</div>
                <div>
                  <h4 style={{ marginBottom: '8px' }}>{r.title}</h4>
                  <p style={{ color: 'var(--gray-500)', lineHeight: '1.7', fontSize: '0.93rem' }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Experience the Primelink Difference</h2>
            <p>Let us show you why leading Romanian companies choose Primelink for their workforce needs.</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">Get Started</Link>
              <Link href="/contact" className="btn btn-white btn-lg">Talk to Us</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
