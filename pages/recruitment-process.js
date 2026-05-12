import Layout from '../components/Layout';
import Link from 'next/link';
import { useLanguage } from '../lib/i18n';

export default function RecruitmentProcess() {
  const { t } = useLanguage();

  const steps = [
    { num: '01', key: 's1', details: ['D1', 'D2', 'D3', 'D4', 'D5'] },
    { num: '02', key: 's2', details: ['D1', 'D2', 'D3', 'D4', 'D5'] },
    { num: '03', key: 's3', details: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] },
    { num: '04', key: 's4', details: ['D1', 'D2', 'D3', 'D4', 'D5'] },
    { num: '05', key: 's5', details: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] },
    { num: '06', key: 's6', details: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] },
  ];

  return (
    <Layout title={t('nav.recruitmentProcess')} description={t('recruitmentProcess.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.recruitmentProcess')}</span></div>
          <h1>{t('recruitmentProcess.heroTitle')}</h1>
          <p>{t('recruitmentProcess.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '30px', marginBottom: '40px', paddingBottom: '40px', borderBottom: i < 5 ? '1px solid var(--gray-100)' : 'none' }}>
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  <div className="step-number" style={{ width: '56px', height: '56px', fontSize: '1.2rem' }}>{step.num}</div>
                  <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--amber)', fontWeight: 600 }}>{t(`recruitmentProcess.${step.key}Time`)}</div>
                </div>
                <div>
                  <h3 style={{ marginBottom: '10px' }}>{t(`recruitmentProcess.${step.key}Title`)}</h3>
                  <p style={{ color: 'var(--gray-500)', lineHeight: '1.7', marginBottom: '16px' }}>{t(`recruitmentProcess.${step.key}Desc`)}</p>
                  <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
                    {step.details.map((d, j) => (
                      <div key={j} style={{ display: 'flex', gap: '10px', padding: '4px 0', fontSize: '0.88rem', color: 'var(--gray-600)' }}>
                        <span style={{ color: 'var(--blue)' }}>→</span> {t(`recruitmentProcess.${step.key}${d}`)}
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
            <p className="section-label">{t('recruitmentProcess.timeline.label')}</p>
            <h2>{t('recruitmentProcess.timeline.title')}</h2>
            <p>{t('recruitmentProcess.timeline.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>{t('recruitmentProcess.cta.title')}</h2>
            <p>{t('recruitmentProcess.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">{t('recruitmentProcess.cta.btn1')}</Link>
              <Link href="/apply" className="btn btn-white btn-lg">{t('recruitmentProcess.cta.btn2')}</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
