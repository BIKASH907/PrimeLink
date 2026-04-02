import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';

export default function CookiePolicy() {
  return (
    <Layout title="Cookie Policy" description="Cookie policy for primelinkhumancapital.com — what cookies we use and why.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Cookie Policy</span></div>
          <h1>Cookie Policy</h1>
          <p>Last updated: April 2, 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ lineHeight: '1.9', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
            <h3 style={{ marginTop: '0', marginBottom: '16px' }}>1. What Are Cookies</h3>
            <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your browsing experience.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>2. How We Use Cookies</h3>
            <p>We use cookies for: essential website functionality (session management, form submission); analytics (understanding how visitors use our website); and security (protecting against unauthorized access).</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>3. Types of Cookies We Use</h3>
            <p><strong>Essential Cookies:</strong> Required for the website to function properly. These cannot be disabled.</p>
            <p><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website. Data is anonymized and used solely to improve our services.</p>
            <p><strong>Preference Cookies:</strong> Remember your settings and preferences for a better browsing experience.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>4. Managing Cookies</h3>
            <p>You can control and/or delete cookies through your browser settings. You can delete all cookies already stored on your device and set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit our website.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>5. Contact</h3>
            <p>For questions about our cookie policy, contact us at:<br />Email: info@primelinkhumancapital.com<br />{COMPANY.legal}, {COMPANY.address}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
