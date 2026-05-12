import Layout from '../components/Layout';
import Link from 'next/link';
import { useLanguage } from '../lib/i18n';

export default function Jobs() {
  const { t } = useLanguage();

  const sampleJobs = [
    { titleKey: 'job1Title', industryKey: 'industryConstruction', location: 'București, Romania', positions: 20, type: 'typeTemp', typeBadge: 'temporary', durationKey: 'durMonths12', accommodation: true, salary: '€700-900' },
    { titleKey: 'job2Title', industryKey: 'industryManufacturing', location: 'Cluj-Napoca, Romania', positions: 15, type: 'typeTemp', typeBadge: 'temporary', durationKey: 'durMonths12', accommodation: true, salary: '€650-800' },
    { titleKey: 'job3Title', industryKey: 'industryHospitality', location: 'Constanța, Romania', positions: 10, type: 'typeSeasonal', typeBadge: 'seasonal', durationKey: 'durMonths6', accommodation: true, salary: '€600-700' },
    { titleKey: 'job4Title', industryKey: 'industryLogistics', location: 'Timișoara, Romania', positions: 8, type: 'typeTemp', typeBadge: 'temporary', durationKey: 'durMonths12', accommodation: false, salary: '€650-800' },
    { titleKey: 'job5Title', industryKey: 'industryAgriculture', locationKey: 'locVarious', positions: 25, type: 'typeSeasonal', typeBadge: 'seasonal', durationKey: 'durMonths6', accommodation: true, salary: '€600-750' },
    { titleKey: 'job6Title', industryKey: 'industryHospitality', location: 'București, Romania', positions: 5, type: 'typePermanent', typeBadge: 'permanent', durationKey: 'durPermanent', accommodation: false, salary: '€700-1000' },
  ];

  return (
    <Layout title={t('nav.jobListings')} description={t('jobs.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.jobs')}</span></div>
          <h1>{t('jobs.heroTitle')}</h1>
          <p>{t('jobs.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ background: '#FEF3C7', padding: '16px 24px', borderRadius: 'var(--radius-md)', marginBottom: '30px', borderLeft: '4px solid var(--amber)' }}>
            <strong>{t('jobs.note')}</strong> {t('jobs.noteText')} <Link href="/apply" style={{ fontWeight: 600 }}>{t('jobs.noteAction')}</Link> {t('jobs.noteEnd')}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sampleJobs.map((job, i) => (
              <div className="job-card" key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <span className={`job-badge badge-${job.typeBadge}`}>{t(`jobs.${job.type}`)}</span>
                      <span className="tag">{t(`jobs.${job.industryKey}`)}</span>
                    </div>
                    <h3 style={{ marginBottom: '6px' }}>{t(`jobs.${job.titleKey}`)}</h3>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>📍 {job.location || t(`jobs.${job.locationKey}`)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--blue)' }}>{job.salary}{t('jobs.salaryPerMonth')}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--gray-400)', marginTop: '4px' }}>{job.positions} {t('jobs.positions')} · {t(`jobs.${job.durationKey}`)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--gray-100)', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>🏠 {t('jobs.accommodation')} {job.accommodation ? '✅ ' + t('jobs.accProvided') : '❌ ' + t('jobs.accNotIncluded')}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>📋 {t('jobs.contract')} {job.typeBadge === 'permanent' ? t('jobs.contractPermanent') : t('jobs.contractTemp')}</span>
                </div>
                <Link href="/apply" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>{t('jobs.apply')}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="cta-banner">
            <h2>{t('jobs.cta.title')}</h2>
            <p>{t('jobs.cta.subtitle')}</p>
            <Link href="/apply" className="btn btn-amber btn-lg">{t('jobs.cta.btn')}</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
