import Layout from '../components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { category: 'For Employers', items: [
      { q: 'How long does the recruitment process take?', a: 'Typically 6-10 weeks from initial inquiry to workers arriving in Romania. The timeline depends primarily on work permit processing and visa appointment availability at Romanian embassies in the source country.' },
      { q: 'What does your service cost?', a: 'Our fees are structured as a per-worker recruitment fee and/or an ongoing management fee for temporary staffing. Exact pricing depends on the number of workers, industry, and contract duration. Contact us for a custom quote.' },
      { q: 'Are the workers legally authorized to work in Romania?', a: 'Yes. Every worker we place has a valid work permit (aviz de muncă) issued by IGI, a long-stay visa (Type D), and a Romanian employment contract. We handle all documentation.' },
      { q: 'What if a worker doesn\'t meet our expectations?', a: 'We offer a 30-day replacement guarantee. If a worker is genuinely unsuitable, we provide a replacement at no additional recruitment cost.' },
      { q: 'Do workers speak Romanian or English?', a: 'Most workers have basic to intermediate English. Some positions may not require language skills. We can arrange Romanian language basics training upon arrival.' },
      { q: 'What industries do you cover?', a: 'Construction, manufacturing, hospitality, agriculture, logistics, healthcare, cleaning, and retail. We can source workers for virtually any sector — contact us with your specific needs.' },
    ]},
    { category: 'For Workers', items: [
      { q: 'How much does it cost to apply?', a: 'Our application is free. We adhere to the ILO Fair Recruitment Initiative. We never charge workers exploitative fees. Any costs (medical exams, document preparation) are transparently communicated upfront.' },
      { q: 'What salary can I expect?', a: 'Salaries depend on the industry, position, and experience level. Romanian minimum wage applies to all workers. Most positions pay significantly above minimum wage. Exact salary is stated in your work contract before you travel.' },
      { q: 'Is accommodation provided?', a: 'Many employers provide accommodation or accommodation assistance. This is specified in the job listing and your contract. We help ensure accommodation meets proper standards.' },
      { q: 'How long is the work contract?', a: 'Contract durations vary — from 3 months (seasonal) to 1-2 years (temporary) to permanent positions. Your specific contract terms are agreed before you travel.' },
      { q: 'Can I bring my family?', a: 'Family reunification is possible under Romanian law after certain conditions are met (typically after 1 year of legal residence). We can advise on the process.' },
      { q: 'What documents do I need?', a: 'A valid passport (18+ months validity), clean criminal record certificate, medical fitness certificate, and relevant work experience documentation. We guide you through the exact requirements.' },
      { q: 'Which countries do you recruit from?', a: 'We primarily recruit from Nepal, India, Bangladesh, and Sri Lanka. We may expand to other South Asian countries in the future.' },
    ]},
    { category: 'Legal & Compliance', items: [
      { q: 'Is Primelink Human Capital a legally registered company?', a: 'Yes. PRIMELINK HUMAN CAPITAL S.R.L. is registered with the Romanian Trade Registry under CUI 54386335, registration number J2026021244007, EUID ROONRC.J2026021244007. Our Certificate of Registration is Seria B Nr. 5780913.' },
      { q: 'What is your primary CAEN activity code?', a: 'CAEN 7820 — Activități ale agențiilor de plasare temporară a forței de muncă și furnizarea altor resurse umane (Temporary staffing agency activities and supply of other human resources).' },
      { q: 'Are workers covered by Romanian labor law?', a: 'Absolutely. All workers have Romanian employment contracts and are fully covered by the Romanian Labor Code (Codul Muncii), including minimum wage protections, working hour limits, health insurance, and social contributions.' },
    ]},
  ];

  let globalIndex = 0;

  return (
    <Layout title="FAQ" description="Frequently asked questions about Primelink Human Capital's recruitment services for employers and workers.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>FAQ</span></div>
          <h1>Frequently Asked Questions</h1>
          <p>Answers to common questions from employers and workers.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '850px' }}>
          {faqs.map((section, si) => (
            <div key={si} style={{ marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--blue)' }}>{section.category}</h3>
              {section.items.map((item, ii) => {
                const idx = globalIndex++;
                return (
                  <div className="faq-item" key={ii}>
                    <button className="faq-question" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                      {item.q}
                      <span style={{ fontSize: '1.2rem', transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0)', transition: 'var(--transition)' }}>▾</span>
                    </button>
                    {openIndex === idx && (
                      <div className="faq-answer">{item.a}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="cta-banner">
            <h2>Still Have Questions?</h2>
            <p>Our team is ready to help. Reach out and we'll get back to you within 24 hours.</p>
            <Link href="/contact" className="btn btn-amber btn-lg">Contact Us</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
