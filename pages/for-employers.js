import Layout from '../components/Layout';
import Link from 'next/link';
import { useLanguage } from '../lib/i18n';

export default function ForEmployers() {
  const { t } = useLanguage();

  const steps = ['s1', 's2', 's3', 's4', 's5'];
  const benefits = [
    { icon: '⚡', key: 'b1' },
    { icon: '📜', key: 'b2' },
    { icon: '🔍', key: 'b3' },
    { icon: '💰', key: 'b4' },
    { icon: '🔄', key: 'b5' },
    { icon: '🛡️', key: 'b6' },
  ];

  return (
    <Layout title={t('nav.forEmployers')} description={t('forEmployers.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <Link href="/services">{t('nav.services')}</Link> / <span>{t('nav.forEmployers')}</span></div>
          <h1>{t('forEmployers.heroTitle')}</h1>
          <p>{t('forEmployers.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col">
            <div className="two-col-text">
              <p className="section-label">{t('forEmployers.problem.label')}</p>
              <h2>{t('forEmployers.problem.title')}</h2>
              <p>{t('forEmployers.problem.p1')}</p>
              <p>{t('forEmployers.problem.p2')}</p>
            </div>
            <div className="two-col-text">
              <p className="section-label">{t('forEmployers.solution.label')}</p>
              <h2>{t('forEmployers.solution.title')}</h2>
              <p>{t('forEmployers.solution.p1')}</p>
              <p>{t('forEmployers.solution.p2')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('forEmployers.how.label')}</p>
            <h2>{t('forEmployers.how.title')}</h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {steps.map((s, i) => (
              <div className="process-step" key={i}>
                <div className="step-number">{i + 1}</div>
                <div>
                  <h4 style={{ marginBottom: '6px' }}>{t(`forEmployers.how.${s}Title`)}</h4>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.93rem' }}>{t(`forEmployers.how.${s}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('forEmployers.benefits.label')}</p>
            <h2>{t('forEmployers.benefits.title')}</h2>
          </div>
          <div className="grid-3">
            {benefits.map((b, i) => (
              <div className="card" key={i}>
                <div className="card-body">
                  <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{b.icon}</div>
                  <h4 className="card-title">{t(`forEmployers.benefits.${b.key}Title`)}</h4>
                  <p className="card-text">{t(`forEmployers.benefits.${b.key}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('forEmployers.models.label')}</p>
            <h2>{t('forEmployers.models.title')}</h2>
          </div>
          <div className="grid-3">
            {[
              { key: 'm1', hasBadge: true },
              { key: 'm2' },
              { key: 'm3' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {m.hasBadge && <span style={{ background: 'var(--amber)', color: 'var(--navy)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>{t('forEmployers.models.m1Badge')}</span>}
                <h3 style={{ color: 'var(--white)', marginTop: m.hasBadge ? '14px' : '0', marginBottom: '12px' }}>{t(`forEmployers.models.${m.key}Title`)}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>{t(`forEmployers.models.${m.key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>{t('forEmployers.cta.title')}</h2>
            <p>{t('forEmployers.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">{t('forEmployers.cta.btn1')}</Link>
              <Link href="/contact" className="btn btn-white btn-lg">{t('forEmployers.cta.btn2')}</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
