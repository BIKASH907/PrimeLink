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
      {/* HERO — split-screen premium redesign */}
      <section className="hero hero-split">
        <div className="hero-bg-glow" aria-hidden="true"></div>
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="hero-eyebrow">🇷🇴 {t('home.hero.label')}</p>
            <h1 className="hero-title">
              {t('home.hero.titlePart1')} <span className="highlight">{t('home.hero.titleHighlight')}</span> {t('home.hero.titlePart2')}
            </h1>
            <p className="hero-desc">{t('home.hero.desc')}</p>

            <div className="hero-buttons">
              <Link href="/employer-inquiry" className="btn btn-primary-gold btn-hero">
                {t('home.hero.btnHire')} <span aria-hidden="true">→</span>
              </Link>
              <Link href="/jobs" className="btn btn-glass btn-hero">
                {t('home.hero.btnApply')}
              </Link>
            </div>

            <ul className="hero-trust-row" aria-label="Trust indicators">
              <li><span className="trust-check" aria-hidden="true">✓</span> {t('home.hero.trustLicensed')}</li>
              <li><span className="trust-check" aria-hidden="true">✓</span> {t('home.hero.trustScreened')}</li>
              <li><span className="trust-check" aria-hidden="true">✓</span> {t('home.hero.trustLegal')}</li>
              <li><span className="trust-check" aria-hidden="true">✓</span> {t('home.hero.trustFast')}</li>
            </ul>

            <div className="hero-stats">
              <div className="hero-stat">
                <h3>{t('home.hero.stat1Num')}</h3>
                <p>{t('home.hero.stat1')}</p>
              </div>
              <div className="hero-stat">
                <h3>{t('home.hero.stat2Num')}</h3>
                <p>{t('home.hero.stat2')}</p>
              </div>
              <div className="hero-stat">
                <h3>{t('home.hero.stat3Num')}</h3>
                <p>{t('home.hero.stat3')}</p>
              </div>
              <div className="hero-stat">
                <h3>{t('home.hero.stat4Num')}</h3>
                <p>{t('home.hero.stat4')}</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrap" role="img" aria-label={t('home.hero.imageAlt')}>
              {/* Replace this background-image in CSS (or drop a file at /public/hero-workers.jpg) */}
              <div className="hero-image-placeholder">
                <div className="hero-image-icon" aria-hidden="true">👷‍♂️</div>
                <p className="hero-image-caption">{t('home.hero.imagePlaceholder')}</p>
              </div>
              <div className="hero-image-overlay" aria-hidden="true"></div>

              <div className="hero-glass-card">
                <p className="glass-card-title">{t('home.hero.glassTitle')}</p>
                <ul className="glass-card-list">
                  <li><span className="glass-check" aria-hidden="true">✓</span> {t('home.hero.glassItem1')}</li>
                  <li><span className="glass-check" aria-hidden="true">✓</span> {t('home.hero.glassItem2')}</li>
                  <li><span className="glass-check" aria-hidden="true">✓</span> {t('home.hero.glassItem3')}</li>
                </ul>
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
