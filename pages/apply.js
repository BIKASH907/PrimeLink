import Layout from '../components/Layout';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../lib/i18n';

export default function Apply() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', nationality: '', country: '',
    dateOfBirth: '', passportNumber: '', education: '', experience: '', skills: '',
    preferredIndustry: '', englishLevel: '', availableFrom: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('apply.success'));
        setForm({ firstName: '', lastName: '', email: '', phone: '', nationality: '', country: '', dateOfBirth: '', passportNumber: '', education: '', experience: '', skills: '', preferredIndustry: '', englishLevel: '', availableFrom: '', message: '' });
      } else {
        toast.error(data.error || t('apply.errorGeneric'));
      }
    } catch (err) {
      toast.error(t('apply.errorNetwork'));
    }
    setLoading(false);
  };

  const L = (k) => t(`apply.labels.${k}`);

  return (
    <Layout title={t('nav.applyNow')} description={t('apply.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.applyNow')}</span></div>
          <h1>{t('apply.heroTitle')}</h1>
          <p>{t('apply.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ background: 'var(--blue-pale)', padding: '20px 24px', borderRadius: 'var(--radius-md)', marginBottom: '32px', borderLeft: '4px solid var(--blue)' }}>
            <strong>{t('apply.important')}</strong> {t('apply.importantText')}
          </div>

          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '20px' }}>{t('apply.personalInfo')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{L('firstName')} <span className="required">*</span></label>
                <input className="form-control" name="firstName" required value={form.firstName} onChange={handleChange} placeholder={L('firstNamePh')} />
              </div>
              <div className="form-group">
                <label>{L('lastName')} <span className="required">*</span></label>
                <input className="form-control" name="lastName" required value={form.lastName} onChange={handleChange} placeholder={L('lastNamePh')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{L('email')} <span className="required">*</span></label>
                <input className="form-control" name="email" type="email" required value={form.email} onChange={handleChange} placeholder={L('emailPh')} />
              </div>
              <div className="form-group">
                <label>{L('phone')} <span className="required">*</span></label>
                <input className="form-control" name="phone" required value={form.phone} onChange={handleChange} placeholder={L('phonePh')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{L('nationality')} <span className="required">*</span></label>
                <select className="form-control" name="nationality" required value={form.nationality} onChange={handleChange}>
                  <option value="">{L('selectNationality')}</option>
                  <option value="Nepali">Nepali</option>
                  <option value="Indian">Indian</option>
                  <option value="Bangladeshi">Bangladeshi</option>
                  <option value="Sri Lankan">Sri Lankan</option>
                  <option value="Other">{L('indOther')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{L('country')} <span className="required">*</span></label>
                <select className="form-control" name="country" required value={form.country} onChange={handleChange}>
                  <option value="">{L('selectCountry')}</option>
                  <option value="Nepal">Nepal</option>
                  <option value="India">India</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Other">{L('indOther')}</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{L('dob')}</label>
                <input className="form-control" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>{L('passport')}</label>
                <input className="form-control" name="passportNumber" value={form.passportNumber} onChange={handleChange} placeholder={L('passportPh')} />
              </div>
            </div>

            <h3 style={{ marginTop: '36px', marginBottom: '20px' }}>{t('apply.qualifications')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{L('education')}</label>
                <select className="form-control" name="education" value={form.education} onChange={handleChange}>
                  <option value="">{L('selectLevel')}</option>
                  <option value="primary">{L('eduPrimary')}</option>
                  <option value="secondary">{L('eduSecondary')}</option>
                  <option value="higher_secondary">{L('eduHigher')}</option>
                  <option value="diploma">{L('eduDiploma')}</option>
                  <option value="bachelors">{L('eduBachelors')}</option>
                  <option value="masters">{L('eduMasters')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{L('english')}</label>
                <select className="form-control" name="englishLevel" value={form.englishLevel} onChange={handleChange}>
                  <option value="">{L('selectLevel')}</option>
                  <option value="none">{L('engNone')}</option>
                  <option value="basic">{L('engBasic')}</option>
                  <option value="intermediate">{L('engIntermediate')}</option>
                  <option value="advanced">{L('engAdvanced')}</option>
                  <option value="fluent">{L('engFluent')}</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>{L('experience')}</label>
              <textarea className="form-control" name="experience" value={form.experience} onChange={handleChange} placeholder={L('experiencePh')} style={{ minHeight: '100px' }} />
            </div>
            <div className="form-group">
              <label>{L('skills')}</label>
              <textarea className="form-control" name="skills" value={form.skills} onChange={handleChange} placeholder={L('skillsPh')} style={{ minHeight: '80px' }} />
            </div>

            <h3 style={{ marginTop: '36px', marginBottom: '20px' }}>{t('apply.jobPrefs')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{L('preferredIndustry')}</label>
                <select className="form-control" name="preferredIndustry" value={form.preferredIndustry} onChange={handleChange}>
                  <option value="">{L('anyIndustry')}</option>
                  <option value="construction">{L('indConstruction')}</option>
                  <option value="manufacturing">{L('indManufacturing')}</option>
                  <option value="hospitality">{L('indHospitality')}</option>
                  <option value="agriculture">{L('indAgriculture')}</option>
                  <option value="logistics">{L('indLogistics')}</option>
                  <option value="cleaning">{L('indCleaning')}</option>
                  <option value="healthcare">{L('indHealthcare')}</option>
                  <option value="retail">{L('indRetail')}</option>
                  <option value="other">{L('indOther')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{L('availableFrom')}</label>
                <input className="form-control" name="availableFrom" type="date" value={form.availableFrom} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>{L('additionalMessage')}</label>
              <textarea className="form-control" name="message" value={form.message} onChange={handleChange} placeholder={L('additionalMessagePh')} style={{ minHeight: '80px' }} />
            </div>

            <button type="submit" className="btn btn-amber btn-lg" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
              {loading ? L('submitting') : L('submit')}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
