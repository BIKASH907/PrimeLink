import Layout from '../components/Layout';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../lib/i18n';

export default function EmployerInquiry() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    companyName: '', contactPerson: '', email: '', phone: '', cui: '', industry: '',
    workersNeeded: '', positions: '', startDate: '', duration: '', location: '',
    accommodation: '', salaryRange: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/employer-inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('employerInquiry.success'));
        setForm({ companyName: '', contactPerson: '', email: '', phone: '', cui: '', industry: '', workersNeeded: '', positions: '', startDate: '', duration: '', location: '', accommodation: '', salaryRange: '', message: '' });
      } else {
        toast.error(data.error || t('employerInquiry.errorGeneric'));
      }
    } catch (err) {
      toast.error(t('employerInquiry.errorNetwork'));
    }
    setLoading(false);
  };

  const L = (k) => t(`employerInquiry.labels.${k}`);

  return (
    <Layout title={t('nav.hireWorkers')} description={t('employerInquiry.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.hireWorkers')}</span></div>
          <h1>{t('employerInquiry.heroTitle')}</h1>
          <p>{t('employerInquiry.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '850px' }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '20px' }}>{t('employerInquiry.companyInfo')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{L('companyName')} <span className="required">*</span></label>
                <input className="form-control" name="companyName" required value={form.companyName} onChange={handleChange} placeholder={L('companyNamePh')} />
              </div>
              <div className="form-group">
                <label>{L('cui')}</label>
                <input className="form-control" name="cui" value={form.cui} onChange={handleChange} placeholder={L('cuiPh')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{L('contactPerson')} <span className="required">*</span></label>
                <input className="form-control" name="contactPerson" required value={form.contactPerson} onChange={handleChange} placeholder={L('contactPersonPh')} />
              </div>
              <div className="form-group">
                <label>{L('email')} <span className="required">*</span></label>
                <input className="form-control" name="email" type="email" required value={form.email} onChange={handleChange} placeholder={L('emailPh')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{L('phone')} <span className="required">*</span></label>
                <input className="form-control" name="phone" required value={form.phone} onChange={handleChange} placeholder={L('phonePh')} />
              </div>
              <div className="form-group">
                <label>{L('industry')} <span className="required">*</span></label>
                <select className="form-control" name="industry" required value={form.industry} onChange={handleChange}>
                  <option value="">{L('selectIndustry')}</option>
                  <option value="construction">{L('indConstruction')}</option>
                  <option value="manufacturing">{L('indManufacturing')}</option>
                  <option value="hospitality">{L('indHospitality')}</option>
                  <option value="agriculture">{L('indAgriculture')}</option>
                  <option value="logistics">{L('indLogistics')}</option>
                  <option value="healthcare">{L('indHealthcare')}</option>
                  <option value="cleaning">{L('indCleaning')}</option>
                  <option value="retail">{L('indRetail')}</option>
                  <option value="other">{L('indOther')}</option>
                </select>
              </div>
            </div>

            <h3 style={{ marginTop: '36px', marginBottom: '20px' }}>{t('employerInquiry.workforceReq')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{L('workersNeeded')}</label>
                <input className="form-control" name="workersNeeded" type="number" value={form.workersNeeded} onChange={handleChange} placeholder={L('workersNeededPh')} />
              </div>
              <div className="form-group">
                <label>{L('positions')}</label>
                <input className="form-control" name="positions" value={form.positions} onChange={handleChange} placeholder={L('positionsPh')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{L('startDate')}</label>
                <input className="form-control" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>{L('contractDuration')}</label>
                <select className="form-control" name="duration" value={form.duration} onChange={handleChange}>
                  <option value="">{L('selectDuration')}</option>
                  <option value="3-months">{L('d3')}</option>
                  <option value="6-months">{L('d6')}</option>
                  <option value="12-months">{L('d12')}</option>
                  <option value="24-months">{L('d24')}</option>
                  <option value="permanent">{L('dPermanent')}</option>
                  <option value="flexible">{L('dFlexible')}</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{L('workLocation')}</label>
                <input className="form-control" name="location" value={form.location} onChange={handleChange} placeholder={L('workLocationPh')} />
              </div>
              <div className="form-group">
                <label>{L('accommodation')}</label>
                <select className="form-control" name="accommodation" value={form.accommodation} onChange={handleChange}>
                  <option value="">{L('selectOption')}</option>
                  <option value="provided">{L('accProvided')}</option>
                  <option value="partial">{L('accPartial')}</option>
                  <option value="not-provided">{L('accNotProvided')}</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>{L('salaryRange')}</label>
              <input className="form-control" name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder={L('salaryRangePh')} />
            </div>
            <div className="form-group">
              <label>{L('additionalDetails')}</label>
              <textarea className="form-control" name="message" value={form.message} onChange={handleChange} placeholder={L('additionalDetailsPh')} />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
              {loading ? L('submitting') : L('submit')}
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--gray-400)' }}>
              {t('employerInquiry.responseNote')}
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
}
