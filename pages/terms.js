import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';

export default function Terms() {
  return (
    <Layout title="Terms & Conditions" description="Terms and conditions for using Primelink Human Capital's website and services.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Terms & Conditions</span></div>
          <h1>Terms & Conditions</h1>
          <p>Last updated: April 2, 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ lineHeight: '1.9', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
            <h3 style={{ marginTop: '0', marginBottom: '16px' }}>1. About Us</h3>
            <p>This website is operated by <strong>{COMPANY.legal}</strong>, a company registered in Romania under CUI {COMPANY.cui}, registered at the Trade Registry under number {COMPANY.regNo}, EUID: {COMPANY.euid}, with its registered office at {COMPANY.address}. ("Primelink", "we", "our", "us").</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>2. Services</h3>
            <p>Primelink provides international workforce recruitment and temporary staffing services. Our primary activity is CAEN 7820 — temporary staffing and supply of human resources. We connect Romanian employers with workers from Asian and African countries through a fully legal, compliant recruitment process.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>3. Website Use</h3>
            <p>By accessing and using this website, you agree to these Terms & Conditions. The information on this website is provided for general informational purposes and does not constitute a binding offer of employment or services. All service agreements are formalized through separate contracts.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>4. Applications & Inquiries</h3>
            <p>Submitting an application or employer inquiry through our website does not guarantee employment or service provision. All applications are subject to our screening process, availability of suitable positions, and legal eligibility requirements including work permit approval by Romanian authorities.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>5. Employer Obligations</h3>
            <p>Romanian employers engaging our services must comply with all applicable Romanian and EU labor laws, provide accurate information about working conditions and positions, and fulfill their contractual obligations regarding worker accommodation, safety, and compensation as agreed.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>6. Worker Obligations</h3>
            <p>Workers must provide truthful and accurate information in their applications, possess valid travel documents, meet the medical and legal requirements for employment in Romania, and comply with their employment contract terms and Romanian law.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>7. Fees</h3>
            <p>Primelink's recruitment fees for employers are established through individual service agreements. Primelink does not charge workers prohibited recruitment fees. Any legitimate processing costs (medical examinations, document preparation) are transparently communicated in advance.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>8. Intellectual Property</h3>
            <p>All content on this website — including text, graphics, logos, and design — is the property of {COMPANY.legal} and protected by copyright law. Unauthorized reproduction or distribution is prohibited.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>9. Limitation of Liability</h3>
            <p>While we strive for accuracy, Primelink does not guarantee that all information on this website is complete, current, or error-free. We are not liable for decisions made based on website content. Our liability for services is governed by the terms of individual service contracts.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>10. Governing Law</h3>
            <p>These Terms & Conditions are governed by and construed in accordance with the laws of Romania. Any disputes shall be subject to the exclusive jurisdiction of the courts of București, Romania.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>11. Contact</h3>
            <p>{COMPANY.legal}<br />CUI: {COMPANY.cui} | Nr. Reg. Com.: {COMPANY.regNo}<br />{COMPANY.address}<br />Email: info@primelinkhumancapital.com</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
