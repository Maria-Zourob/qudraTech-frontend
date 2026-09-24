'use client';

import {useEffect, useState} from 'react';
import {apiClient} from '@/lib/apiClient';
import {getToken} from '@/lib/auth';
import {useToast} from '@/components/Toast';

interface Partner {
  id: string;
  nameAr: string;
  nameEn: string;
  type: string;
  website: string | null;
  logoUrl: string | null;
}

const PARTNER_TYPES = ['Partner', 'Donor', 'Community Partner'];

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToast();

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

  if (loading) return <p className="p-8">جاري التحميل...</p>;

  const inputClass = 'w-full border rounded-lg p-2.5';

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">الشركاء</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8 border rounded-lg p-5" style={{borderColor: 'var(--color-line)'}}>
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="اسم الشريك بالعربي"
            required
            value={form.nameAr}
            onChange={(e) => setForm({...form, nameAr: e.target.value})}
            className={inputClass}
          />
          <input
            placeholder="Partner name in English"
            required
            value={form.nameEn}
            onChange={(e) => setForm({...form, nameEn: e.target.value})}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.type}
            onChange={(e) => setForm({...form, type: e.target.value})}
            className={inputClass}
          >
            {PARTNER_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            placeholder="الموقع الإلكتروني (اختياري)"
            value={form.website}
            onChange={(e) => setForm({...form, website: e.target.value})}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-lg text-white font-medium disabled:opacity-50"
          style={{background: 'var(--color-navy)'}}
        >
          {submitting ? 'جاري الحفظ...' : 'إضافة شريك'}
        </button>
      </form>

      {partners.length === 0 ? (
        <p className="text-gray-500">لا يوجد شركاء بعد.</p>
      ) : (
        <ul className="space-y-2">
          {partners.map((p) => (
            <li key={p.id} className="border rounded-lg p-3 flex justify-between items-center" style={{borderColor: 'var(--color-line)'}}>
              <div>
                <p className="font-medium">{p.nameAr}</p>
                <p className="text-sm text-gray-500">{p.nameEn}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded" style={{background: 'var(--color-line)'}}>
                {p.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}