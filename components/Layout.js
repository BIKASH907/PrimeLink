import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, title, description }) {
  const pageTitle = title
    ? `${title} | Primelink Human Capital`
    : 'Primelink Human Capital — South Asian Workforce Recruitment in Romania';
  const pageDesc = description || 'Primelink Human Capital S.R.L. connects skilled South Asian workers with Romanian employers. Licensed staffing agency specializing in temporary and permanent workforce placement.';

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
