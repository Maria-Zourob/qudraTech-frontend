'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {apiClient} from '@/lib/apiClient';
import {getToken} from '@/lib/auth';
import {useToast} from '@/components/Toast';

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
}

function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div>
      <label className="fs-label mb-1.5 block" style={{color: 'var(--fs-muted)'}}>{label}</label>
      {children}
    </div>
  );
}

const inputClass = 'w-full border px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--color-navy)] focus:outline-none';
const inputStyle = {borderColor: 'var(--color-line)', color: 'var(--color-ink)'};

export default function NewInitiativePage() {
  const router = useRouter();
  const showToast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    slug: '',
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    targetGroupAr: '',
    targetGroupEn: '',
    location: '',
    categoryId: ''
  });

  useEffect(() => {
    async function loadCategories() {
      const token = getToken() ?? undefined;
      const data = await apiClient.get<Category[]>('/categories', token);
      setCategories(data);
      if (data.length > 0) {
        setForm((prev) => ({...prev, categoryId: data[0].id}));
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, []);

  function updateField(field: string, value: string) {
    setForm((prev) => ({...prev, [field]: value}));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const token = getToken() ?? undefined;
    try {
      await apiClient.post('/initiatives', form, token);
      showToast('تمت إضافة المبادرة بنجاح.', 'success');
      router.push('/ar/admin');
    } catch {
      showToast('صار خطأ، تأكدي من صحة الحقول وحاولي كمان مرة.', 'error');
    }
    setSubmitting(false);
  }

  return (
    <main className="max-w-2xl mx-auto p-6 md:p-8">
      <div className="mb-8 pb-5 border-b-2" style={{borderColor: 'var(--color-navy)'}}>
        <p className="fs-label" style={{color: 'var(--fs-muted)'}}>المبادرات</p>
        <h1 className="font-heading text-2xl font-bold mt-1" style={{color: 'var(--color-navy)'}}>
          مبادرة جديدة
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 border p-6" style={{borderColor: 'var(--color-line)', background: 'white'}}>
        <Field label="الرابط (Slug) — بالإنجليزي، بلا مسافات">
          <input
            type="text"
            dir="ltr"
            required
            placeholder="my-initiative-name"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="العنوان بالعربي">
            <input required value={form.titleAr} onChange={(e) => updateField('titleAr', e.target.value)} className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Title in English">
            <input dir="ltr" required value={form.titleEn} onChange={(e) => updateField('titleEn', e.target.value)} className={inputClass} style={inputStyle} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="الوصف بالعربي">
            <textarea required rows={3} value={form.descriptionAr} onChange={(e) => updateField('descriptionAr', e.target.value)} className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Description in English">
            <textarea dir="ltr" required rows={3} value={form.descriptionEn} onChange={(e) => updateField('descriptionEn', e.target.value)} className={inputClass} style={inputStyle} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="الفئة المستهدفة (عربي)">
            <input value={form.targetGroupAr} onChange={(e) => updateField('targetGroupAr', e.target.value)} className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Target Group (English)">
            <input dir="ltr" value={form.targetGroupEn} onChange={(e) => updateField('targetGroupEn', e.target.value)} className={inputClass} style={inputStyle} />
          </Field>
        </div>

        <Field label="الموقع">
          <input required value={form.location} onChange={(e) => updateField('location', e.target.value)} className={inputClass} style={inputStyle} />
        </Field>

        <Field label="التصنيف">
          <select value={form.categoryId} onChange={(e) => updateField('categoryId', e.target.value)} className={inputClass} style={inputStyle}>
            {categories.length === 0 && <option value="">لا توجد تصنيفات — أضيفي واحد أولًا</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameAr}</option>
            ))}
          </select>
        </Field>

        <button
          type="submit"
          disabled={submitting || categories.length === 0}
          className="px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{background: 'var(--color-navy)'}}
        >
          {submitting ? 'جاري الحفظ...' : 'حفظ المبادرة'}
        </button>
      </form>
    </main>
  );
}