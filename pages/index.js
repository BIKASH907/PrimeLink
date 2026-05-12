import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';
import { useLanguage } from '../lib/i18n';

export default function Home() {
  const { t } = useLanguage();

  const industriesList = [
    { icon: '🏗️', key: 'construction' },
    { icon: '🏭', key: 'manufacturing' },
    { icon: '🍽️', key: 'hospitality' },
    { icon: '🌾', key: 'agriculture' },
    { icon: '🚛', key: 'logistics' },
    { icon: '🏥', key: 'healthcare' },
    { icon: '🧹', key: 'facility' },
    { icon: '🏪', key: 'retail' },
  ];

  const steps = [
    { num: '01', tKey: 's1' },
    { num: '02', tKey: 's2' },
    { num: '03', tKey: 's3' },
    { num: '04', tKey: 's4' },
    { num: '05', tKey: 's5' },
    { num: '06', tKey: 's6' },
  ];

  return (
    <Layout>
      {/* HERO — your image as the full background */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <p className="hero-eyebrow">
              <span className="hero-eyebrow-flag" aria-hidden="true">🇷🇴</span>
              {t('home.hero.label')}
            </p>
            <h1 className="hero-title">
              {t('home.hero.titlePart1')}{' '}
              <span className="highlight">{t('home.hero.titleHighlight')}</span>{' '}
              {t('home.hero.titlePart2')}
            </h1>
            <span className="hero-accent-line" aria-hidden="true"></span>
            <p className="hero-desc">{t('home.hero.desc')}</p>
            <div className="hero-buttons">
              <Link href="/employer-inquiry" className="btn-hero btn-hero-primary">
                {t('home.hero.btnHire')} <span aria-hidden="true" className="btn-arrow">→</span>
              </Link>
              <Link href="/apply" className="btn-hero btn-hero-secondary">
                {t('home.hero.btnApply')} <span aria-hidden="true" className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP — 4 cards under hero */}
      <section className="trust-strip-section">
        <div className="container">
          <div className="trust-strip">
            <div className="trust-card">
              <div className="trust-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div className="trust-text">
                <h4>{t('home.trustStrip.card1Title')}</h4>
                <p>{t('home.trustStrip.card1Desc')}</p>
              </div>
            </div>
            <div className="trust-card">
              <div className="trust-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="trust-text">
                <h4>{t('home.trustStrip.card2Title')}</h4>
                <p>{t('home.trustStrip.card2Desc')}</p>
              </div>
            </div>
            <div className="trust-card">
              <div className="trust-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <div className="trust-text">
                <h4>{t('home.trustStrip.card3Title')}</h4>
                <p>{t('home.trustStrip.card3Desc')}</p>
              </div>
            </div>
            <div className="trust-card">
              <div className="trust-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V5a2 2 0 0 0-4 0v6"/><path d="M14 10V4a2 2 0 0 0-4 0v8"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0 4 4 0 0 0-4-4"/></svg>
              </div>
              <div className="trust-text">
                <h4>{t('home.trustStrip.card4Title')}</h4>
                <p>{t('home.trustStrip.card4Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS BAND — dark navy stats row */}
      <section className="metrics-band">
        <div className="container">
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="metric-text">
                <h3>{t('home.metrics.stat1Num')}</h3>
                <p>{t('home.metrics.stat1')}</p>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
              </div>
              <div className="metric-text">
                <h3>{t('home.metrics.stat2Num')}</h3>
                <p>{t('home.metrics.stat2')}</p>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <div className="metric-text">
                <h3>{t('home.metrics.stat3Num')}</h3>
                <p>{t('home.metrics.stat3')}</p>
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
              </div>
              <div className="metric-text">
                <h3>{t('home.metrics.stat4Num')}</h3>
                <p>{t('home.metrics.stat4')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('home.services.label')}</p>
            <h2>{t('home.services.title')}</h2>
            <p>{t('home.services.subtitle')}</p>
          </div>
          <div className="grid-3">
            <div className="card">
              <div className="card-body">
                <div className="card-icon">🏢</div>
                <h4 className="card-title">{t('home.services.card1Title')}</h4>
                <p className="card-text">{t('home.services.card1Desc')}</p>
                <Link href="/for-employers" className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>{t('common.learnMore')}</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="card-icon">👷</div>
                <h4 className="card-title">{t('home.services.card2Title')}</h4>
                <p className="card-text">{t('home.services.card2Desc')}</p>
                <Link href="/for-workers" className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>{t('common.learnMore')}</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="card-icon">📋</div>
                <h4 className="card-title">{t('home.services.card3Title')}</h4>
                <p className="card-text">{t('home.services.card3Desc')}</p>
                <Link href="/services" className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>{t('common.learnMore')}</Link>
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
              <p className="section-label">{t('home.why.label')}</p>
              <h2>{t('home.why.title')}</h2>
              <p>{t('home.why.p1')}</p>
              <p>
                {t('home.why.p2Pre')} {COMPANY.cui}{t('home.why.p2Post')}
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <Link href="/why-choose-us" className="btn btn-primary">{t('home.why.btnWhy')}</Link>
                <Link href="/about" className="btn btn-outline">{t('home.why.btnAbout')}</Link>
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
            <p className="section-label">{t('home.industries.label')}</p>
            <h2>{t('home.industries.title')}</h2>
            <p>{t('home.industries.subtitle')}</p>
          </div>
          <div className="grid-4">
            {industriesList.map((item, i) => (
              <div className="card" key={i}>
                <div className="card-body" style={{ textAlign: 'center', padding: '24px 16px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
                  <h4 className="card-title" style={{ fontSize: '1rem' }}>{t(`home.industries.${item.key}`)}</h4>
                  <p className="card-text" style={{ fontSize: '0.85rem' }}>{t(`home.industries.${item.key}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/industries" className="btn btn-primary">{t('home.industries.viewAll')}</Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('home.process.label')}</p>
            <h2>{t('home.process.title')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>{t('home.process.subtitle')}</p>
          </div>
          <div className="grid-3">
            {steps.map((step, i) => (
              <div className="process-step" key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="step-number">{step.num}</div>
                <div>
                  <h4 style={{ color: 'var(--white)', marginBottom: '8px' }}>{t(`home.process.${step.tKey}Title`)}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{t(`home.process.${step.tKey}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/recruitment-process" className="btn btn-amber btn-lg">{t('home.process.learnMore')}</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>{t('home.cta.title')}</h2>
            <p>{t('home.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">{t('home.cta.btnEmp')}</Link>
              <Link href="/apply" className="btn btn-white btn-lg">{t('home.cta.btnWork')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* LEGAL REGISTRATION INFO */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('home.legal.label')}</p>
            <h2>{t('home.legal.title')}</h2>
            <p>{t('home.legal.subtitle')}</p>
          </div>
          <div className="grid-3">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{t('home.legal.regTitle')}</h4>
                <table style={{ width: '100%', fontSize: '0.88rem' }}>
                  <tbody>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>{t('home.legal.regLegalName')}</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{COMPANY.legal}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>{t('home.legal.regCui')}</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{COMPANY.cui}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>{t('home.legal.regRegNr')}</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{COMPANY.regNo}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>{t('home.legal.regEuid')}</td><td style={{ padding: '6px 0', fontWeight: 600, wordBreak: 'break-all' }}>{COMPANY.euid}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>{t('home.legal.regCert')}</td><td style={{ padding: '6px 0', fontWeight: 600 }}>Seria B Nr. 5780913</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{t('home.legal.bizTitle')}</h4>
                <table style={{ width: '100%', fontSize: '0.88rem' }}>
                  <tbody>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>{t('home.legal.bizLegalForm')}</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{t('home.legal.bizLegalFormVal')}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>{t('home.legal.bizCapital')}</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{t('home.legal.bizCapitalVal')}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>{t('home.legal.bizCaen')}</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{t('home.legal.bizCaenVal')}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>{t('home.legal.bizDuration')}</td><td style={{ padding: '6px 0', fontWeight: 600 }}>{t('home.legal.bizDurationVal')}</td></tr>
                    <tr><td style={{ padding: '6px 0', color: 'var(--gray-400)' }}>{t('home.legal.bizStatus')}</td><td style={{ padding: '6px 0' }}><span className="status-badge status-active">{t('home.legal.bizStatusVal')}</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{t('home.legal.officeTitle')}</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '16px' }}>
                  {t('home.legal.officeAddr')}<br />
                  {t('home.legal.officeSector')}<br />
                  {t('home.legal.officeZip')}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: '1.7' }}>
                  {t('home.legal.officeRegistered')}<br />
                  {t('home.legal.officeResolution')}<br />
                  {t('home.legal.officeAdmin')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
