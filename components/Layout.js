import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../lib/i18n';

export default function Layout({ children, title, description }) {
  const { t } = useLanguage();
  const pageTitle = title
    ? `${title} | Primelink Human Capital`
    : t('layout.defaultTitle');
  const pageDesc = description || t('layout.defaultDescription');

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://primelinkhumancapital.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://primelinkhumancapital.com" />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
