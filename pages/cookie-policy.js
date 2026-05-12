import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';
import { useLanguage } from '../lib/i18n';

export default function CookiePolicy() {
  const { t } = useLanguage();

  return (
    <Layout title={t('footer.cookiePolicy')} description={t('cookies.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('footer.cookiePolicy')}</span></div>
          <h1>{t('cookies.heroTitle')}</h1>
          <p>{t('cookies.lastUpdated')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ lineHeight: '1.9', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
            <h3 style={{ marginTop: '0', marginBottom: '16px' }}>{t('cookies.s1')}</h3>
            <p>{t('cookies.s1p')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('cookies.s2')}</h3>
            <p>{t('cookies.s2p')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('cookies.s3')}</h3>
            <p><strong>{t('cookies.s3Essential')}</strong> {t('cookies.s3EssentialText')}</p>
            <p><strong>{t('cookies.s3Analytics')}</strong> {t('cookies.s3AnalyticsText')}</p>
            <p><strong>{t('cookies.s3Preference')}</strong> {t('cookies.s3PreferenceText')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('cookies.s4')}</h3>
            <p>{t('cookies.s4p')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('cookies.s5')}</h3>
            <p>
              {t('cookies.s5pPre')}<br />
              {t('cookies.s5Email')}<br />
              {COMPANY.legal}, {COMPANY.address}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
