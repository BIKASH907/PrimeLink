import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';
import { useLanguage } from '../lib/i18n';

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const reasons = [
    { icon: '🏛️', key: 'r1', custom: true },
    { icon: '🌏', key: 'r2' },
    { icon: '⚖️', key: 'r3' },
    { icon: '📋', key: 'r4' },
    { icon: '🔍', key: 'r5' },
    { icon: '🛡️', key: 'r6' },
    { icon: '💼', key: 'r7' },
    { icon: '📞', key: 'r8' },
  ];

  return (
    <Layout title={t('nav.whyChooseUs')} description={t('whyChooseUs.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.whyChooseUs')}</span></div>
          <h1>{t('whyChooseUs.heroTitle')}</h1>
          <p>{t('whyChooseUs.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '50px' }}>
            {reasons.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px' }}>
                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{r.icon}</div>
                <div>
                  <h4 style={{ marginBottom: '8px' }}>{t(`whyChooseUs.${r.key}Title`)}</h4>
                  <p style={{ color: 'var(--gray-500)', lineHeight: '1.7', fontSize: '0.93rem' }}>
                    {r.custom
                      ? `${t('whyChooseUs.r1Desc1')} ${COMPANY.legal}${t('whyChooseUs.r1Desc2')} ${COMPANY.cui}${t('whyChooseUs.r1Desc3')} ${COMPANY.regNo}${t('whyChooseUs.r1Desc4')}`
                      : t(`whyChooseUs.${r.key}Desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>{t('whyChooseUs.cta.title')}</h2>
            <p>{t('whyChooseUs.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">{t('whyChooseUs.cta.btn1')}</Link>
              <Link href="/contact" className="btn btn-white btn-lg">{t('whyChooseUs.cta.btn2')}</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
