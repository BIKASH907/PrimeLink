import Layout from '../components/Layout';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../lib/i18n';

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      categoryKey: 'employers',
      items: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'],
    },
    {
      categoryKey: 'workers',
      items: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'],
    },
    {
      categoryKey: 'legal',
      items: ['q1', 'q2', 'q3'],
    },
  ];

  let globalIndex = 0;

  return (
    <Layout title={t('nav.faq')} description={t('faq.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.faq')}</span></div>
          <h1>{t('faq.heroTitle')}</h1>
          <p>{t('faq.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '850px' }}>
          {faqs.map((section, si) => (
            <div key={si} style={{ marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--blue)' }}>{t(`faq.categories.${section.categoryKey}`)}</h3>
              {section.items.map((qKey, ii) => {
                const idx = globalIndex++;
                const aKey = qKey.replace('q', 'a');
                return (
                  <div className="faq-item" key={ii}>
                    <button className="faq-question" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                      {t(`faq.${section.categoryKey}.${qKey}`)}
                      <span style={{ fontSize: '1.2rem', transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0)', transition: 'var(--transition)' }}>▾</span>
                    </button>
                    {openIndex === idx && (
                      <div className="faq-answer">{t(`faq.${section.categoryKey}.${aKey}`)}</div>
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
            <h2>{t('faq.cta.title')}</h2>
            <p>{t('faq.cta.subtitle')}</p>
            <Link href="/contact" className="btn btn-amber btn-lg">{t('faq.cta.btn')}</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
