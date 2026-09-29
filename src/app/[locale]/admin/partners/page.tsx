'use client';

import {useEffect, useState} from 'react';
import {apiClient} from '@/lib/apiClient';
import {getToken} from '@/lib/auth';
import {useToast} from '@/components/Toast';
import {useConfirm} from '@/components/ConfirmDialog';
interface Partner {
  id: string;
  nameAr: string;
  nameEn: string;
  type: string;
  website: string | null;
  logoUrl: string | null;
}

const PARTNER_TYPES = ['Partner', 'Donor', 'Community Partner'];

function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div>
      <label className="fs-label mb-1.5 block" style={{color: 'var(--fs-muted)'}}>{label}</label>
      {children}
    </div>
  );
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToast();
  const confirmDialog = useConfirm();
  const [form, setForm] = useState({
    nameAr: '', nameEn: '', type: PARTNER_TYPES[0], website: ''
  });

  async function loadPartners() {
    setLoading(true);
    const data = await apiClient.get<Partner[]>('/public/partners');
    setPartners(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPartners();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const token = getToken() ?? undefined;
    try {
      await apiClient.post('/partners', {
        nameAr: form.nameAr,
        nameEn: form.nameEn,
        type: form.type,
        website: form.website || null,
        logoUrl: null
      }, token);
      showToast('تمت إضافة الشريك بنجاح.', 'success');
      setForm({nameAr: '', nameEn: '', type: PARTNER_TYPES[0], website: ''});
      await loadPartners();
    } catch {
      showToast('صار خطأ، حاولي كمان مرة.', 'error');
    }
    setSubmitting(false);
  }
  async function handleDelete(id: string, name: string) {
    const confirmed = await confirmDialog({
      title: 'حذف الشريك',
      description: `هل أنتِ متأكدة من حذف "${name}"؟`,
      confirmLabel: 'حذف',
      danger: true
    });
    if (!confirmed) return;

    const token = getToken() ?? undefined;
    try {
      await apiClient.delete(`/partners/${id}`, token);
      showToast('تم حذف الشريك.', 'success');
      await loadPartners();
    } catch {
      showToast('صار خطأ، حاولي كمان مرة.', 'error');
    }
  }
  if (loading) return <p className="p-8">جاري التحميل...</p>;

  const inputClass = 'w-full border px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--color-navy)] focus:outline-none';
  const inputStyle = {borderColor: 'var(--color-line)', color: 'var(--color-ink)'};

  return (
    <main className="max-w-2xl mx-auto p-6 md:p-8">
      <div className="mb-8 pb-5 border-b-2" style={{borderColor: 'var(--color-navy)'}}>
        <p className="fs-label" style={{color: 'var(--fs-muted)'}}>المبادرات</p>
        <h1 className="font-heading text-2xl font-bold mt-1" style={{color: 'var(--color-navy)'}}>
          الشركاء
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 border p-6" style={{borderColor: 'var(--color-line)', background: 'white'}}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="اسم الشريك بالعربي">
            <input required value={form.nameAr} onChange={(e) => setForm({...form, nameAr: e.target.value})} className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Partner name in English">
            <input dir="ltr" required value={form.nameEn} onChange={(e) => setForm({...form, nameEn: e.target.value})} className={inputClass} style={inputStyle} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="النوع">
            <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className={inputClass} style={inputStyle}>
              {PARTNER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="الموقع الإلكتروني (اختياري)">
            <input dir="ltr" value={form.website} onChange={(e) => setForm({...form, website: e.target.value})} className={inputClass} style={inputStyle} />
          </Field>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{background: 'var(--color-navy)'}}
        >
          {submitting ? 'جاري الحفظ...' : 'إضافة شريك'}
        </button>
      </form>

      {partners.length === 0 ? (
        <p className="text-sm" style={{color: 'var(--fs-muted)'}}>لا يوجد شركاء بعد.</p>
      ) : (
        <ul className="border divide-y" style={{borderColor: 'var(--color-line)'}}>
          {partners.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center p-4 transition-colors hover:bg-[var(--fs-paper-2)]"
              style={{background: 'white', borderColor: 'var(--color-line)'}}
            >
                            <div>
                <p className="font-medium" style={{color: 'var(--color-navy)'}}>{p.nameAr}</p>
                <p className="text-sm mt-0.5" style={{color: 'var(--fs-muted)'}}>{p.nameEn}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="fs-label px-2.5 py-1" style={{background: 'var(--fs-paper-2)', color: 'var(--fs-sage-ink)'}}>
                  {p.type}
                </span>
                <button
                  onClick={() => handleDelete(p.id, p.nameAr)}
                  className="text-xs font-medium hover:underline"
                  style={{color: '#C0392B'}}
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}