import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../lib/i18n';

const SITE_URL = 'https://primelinkhumancapital.com';

export default function Layout({ children, title, description }) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const pathname = router?.asPath || '/';
  const canonicalUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`;

  const pageTitle = title
    ? `${title} | Primelink Human Capital`
    : t('layout.defaultTitle');
  const pageDesc = description || t('layout.defaultDescription');
  const ogLocale = lang === 'ro' ? 'ro_RO' : 'en_US';
  const ogLocaleAlt = lang === 'ro' ? 'en_US' : 'ro_RO';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="content-language" content={lang} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:locale:alternate" content={ogLocaleAlt} />
        <meta property="og:site_name" content="Primelink Human Capital" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />

        {/* hreflang — same URL serves both languages via the in-page switcher,
            but x-default + ro tells search engines Romanian is the canonical
            primary language. */}
        <link rel="alternate" hrefLang="ro" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={canonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
