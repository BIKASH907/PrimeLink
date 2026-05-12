import Layout from '../components/Layout';
import Link from 'next/link';
import { useLanguage } from '../lib/i18n';

export default function ForWorkers() {
  const { t } = useLanguage();

  const sectors = [
    { icon: '🏗️', key: 's1' },
    { icon: '🏭', key: 's2' },
    { icon: '🍽️', key: 's3' },
    { icon: '🌾', key: 's4' },
    { icon: '🚛', key: 's5' },
    { icon: '🧹', key: 's6' },
    { icon: '🏥', key: 's7' },
    { icon: '🏪', key: 's8' },
  ];

  const benefits = [
    { icon: '📋', key: 'b1' },
    { icon: '🏥', key: 'b2' },
    { icon: '💰', key: 'b3' },
    { icon: '🏠', key: 'b4' },
    { icon: '📞', key: 'b5' },
    { icon: '🔄', key: 'b6' },
  ];

  const requirements = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7'];

  return (
    <Layout title={t('nav.forWorkers')} description={t('forWorkers.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <Link href="/services">{t('nav.services')}</Link> / <span>{t('nav.forWorkers')}</span></div>
          <h1>{t('forWorkers.heroTitle')}</h1>
          <p>{t('forWorkers.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col">
            <div className="two-col-text">
              <p className="section-label">{t('forWorkers.opportunity.label')}</p>
              <h2>{t('forWorkers.opportunity.title')}</h2>
              <p>{t('forWorkers.opportunity.p1')}</p>
              <p>{t('forWorkers.opportunity.p2')}</p>
              <div style={{ background: 'var(--blue-pale)', padding: '20px', borderRadius: 'var(--radius-md)', marginTop: '20px', borderLeft: '4px solid var(--blue)' }}>
                <strong style={{ color: 'var(--navy)' }}>⚠️ {t('forWorkers.opportunity.importantTitle')}</strong>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                  {t('forWorkers.opportunity.importantText')}
                </p>
              </div>
            </div>
            <div className="two-col-image">🌍</div>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('forWorkers.sectors.label')}</p>
            <h2>{t('forWorkers.sectors.title')}</h2>
            <p>{t('forWorkers.sectors.subtitle')}</p>
          </div>
          <div className="grid-4">
            {sectors.map((s, i) => (
              <div className="card" key={i}>
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{s.icon}</div>
                  <h4 className="card-title" style={{ fontSize: '1rem' }}>{t(`forWorkers.sectors.${s.key}Title`)}</h4>
                  <p className="card-text" style={{ fontSize: '0.82rem' }}>{t(`forWorkers.sectors.${s.key}Roles`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('forWorkers.benefits.label')}</p>
            <h2>{t('forWorkers.benefits.title')}</h2>
          </div>
          <div className="grid-3">
            {benefits.map((b, i) => (
              <div className="card" key={i}>
                <div className="card-body">
                  <div style={{ fontSize: '1.6rem', marginBottom: '12px' }}>{b.icon}</div>
                  <h4 className="card-title">{t(`forWorkers.benefits.${b.key}Title`)}</h4>
                  <p className="card-text">{t(`forWorkers.benefits.${b.key}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('forWorkers.requirements.label')}</p>
            <h2>{t('forWorkers.requirements.title')}</h2>
          </div>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {requirements.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 0', borderBottom: '1px solid var(--gray-100)', alignItems: 'center' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                <span style={{ fontSize: '0.95rem' }}>{t(`forWorkers.requirements.${r}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>{t('forWorkers.cta.title')}</h2>
            <p>{t('forWorkers.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link href="/apply" className="btn btn-amber btn-lg">{t('forWorkers.cta.btn1')}</Link>
              <Link href="/jobs" className="btn btn-white btn-lg">{t('forWorkers.cta.btn2')}</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
