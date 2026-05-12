import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../lib/i18n';

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '', type: 'general' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('contact.success'));
        setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '', type: 'general' });
      } else {
        toast.error(data.error || t('contact.errorGeneric'));
      }
    } catch (err) {
      toast.error(t('contact.errorNetwork'));
    }
    setLoading(false);
  };

  return (
    <Layout title={t('nav.contact')} description={t('contact.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.contact')}</span></div>
          <h1>{t('contact.heroTitle')}</h1>
          <p>{t('contact.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '60px' }}>
            <div>
              <h3 style={{ marginBottom: '24px' }}>{t('contact.sendMessage')}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('contact.labels.fullName')} <span className="required">*</span></label>
                    <input className="form-control" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t('contact.labels.fullNamePh')} />
                  </div>
                  <div className="form-group">
                    <label>{t('contact.labels.email')} <span className="required">*</span></label>
                    <input className="form-control" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder={t('contact.labels.emailPh')} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('contact.labels.phone')}</label>
                    <input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder={t('contact.labels.phonePh')} />
                  </div>
                  <div className="form-group">
                    <label>{t('contact.labels.company')}</label>
                    <input className="form-control" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder={t('contact.labels.companyPh')} />
                  </div>
                </div>
                <div className="form-group">
                  <label>{t('contact.labels.iAm')}</label>
                  <select className="form-control" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="general">{t('contact.labels.general')}</option>
                    <option value="employer">{t('contact.labels.employer')}</option>
                    <option value="worker">{t('contact.labels.worker')}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('contact.labels.subject')} <span className="required">*</span></label>
                  <input className="form-control" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder={t('contact.labels.subjectPh')} />
                </div>
                <div className="form-group">
                  <label>{t('contact.labels.message')} <span className="required">*</span></label>
                  <textarea className="form-control" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder={t('contact.labels.messagePh')} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                  {loading ? t('contact.labels.sending') : t('contact.labels.sendBtn')}
                </button>
              </form>
            </div>

            <div>
              <h3 style={{ marginBottom: '24px' }}>{t('contact.infoTitle')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '1.5rem' }}>📍</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{t('contact.registeredOfficeTitle')}</h4>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.93rem', lineHeight: '1.7' }}>
                      {t('contact.registeredOfficeLine1')}<br />
                      {t('contact.registeredOfficeLine2')}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '1.5rem' }}>📧</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{t('contact.emailTitle')}</h4>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.93rem' }}>
                      {t('contact.emailGeneral')} <a href="mailto:info@primelinkhumancapital.com">info@primelinkhumancapital.com</a><br />
                      {t('contact.emailEmployers')} <a href="mailto:employers@primelinkhumancapital.com">employers@primelinkhumancapital.com</a><br />
                      {t('contact.emailWorkers')} <a href="mailto:apply@primelinkhumancapital.com">apply@primelinkhumancapital.com</a>
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '1.5rem' }}>📞</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{t('contact.phoneTitle')}</h4>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.93rem' }}>
                      {t('contact.phoneRomania')}<br />
                      {t('contact.phoneWhatsApp')}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '1.5rem' }}>🕐</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{t('contact.hoursTitle')}</h4>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.93rem' }}>
                      {t('contact.hoursLine1')}<br />
                      {t('contact.hoursLine2')}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '36px', padding: '24px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>{t('contact.companyDetailsTitle')}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: '1.8' }}>
                  <strong>{COMPANY.legal}</strong><br />
                  CUI: {COMPANY.cui}<br />
                  {t('contact.regCom')} {COMPANY.regNo}<br />
                  EUID: {COMPANY.euid}<br />
                  {t('contact.cert')} Seria B Nr. 5780913
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
