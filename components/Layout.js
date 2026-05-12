import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../lib/i18n';

const SITE_URL = 'https://primelinkhumancapital.com';

/**
 * Strip a leading "/en" or "/ro" from a path so we can rebuild it for each
 * locale. (Next.js's `asPath` does NOT include the locale prefix, but we
 * still want to be defensive in case someone hand-constructs a URL.)
 */
function stripLocale(path) {
  return path.replace(/^\/(ro|en)(?=\/|$)/, '') || '/';
}

export default function Layout({ children, title, description }) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const rawPath = router?.asPath || '/';
  const basePath = stripLocale(rawPath);

  // Per-locale URLs for canonical + hreflang.
  const roUrl = `${SITE_URL}${basePath === '/' ? '' : basePath}`;
  const enUrl = `${SITE_URL}/en${basePath === '/' ? '' : basePath}`;
  const canonicalUrl = lang === 'ro' ? roUrl : enUrl;

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

        {/* hreflang — each language now has its own URL.
            x-default points to Romanian (the canonical primary language). */}
        <link rel="alternate" hrefLang="ro-RO" href={roUrl} />
        <link rel="alternate" hrefLang="ro" href={roUrl} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="x-default" href={roUrl} />

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
