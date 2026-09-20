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

  const inputClass = 'w-full border rounded-lg p-2.5';

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">مبادرة جديدة</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">الرابط (Slug) — بالإنجليزي، بلا مسافات</label>
          <input
            type="text"
            required
            placeholder="my-initiative-name"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">العنوان بالعربي</label>
            <input
              type="text"
              required
              value={form.titleAr}
              onChange={(e) => updateField('titleAr', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Title in English</label>
            <input
              type="text"
              required
              value={form.titleEn}
              onChange={(e) => updateField('titleEn', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">الوصف بالعربي</label>
            <textarea
              required
              rows={3}
              value={form.descriptionAr}
              onChange={(e) => updateField('descriptionAr', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description in English</label>
            <textarea
              required
              rows={3}
              value={form.descriptionEn}
              onChange={(e) => updateField('descriptionEn', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">الفئة المستهدفة (عربي)</label>
            <input
              type="text"
              value={form.targetGroupAr}
              onChange={(e) => updateField('targetGroupAr', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Target Group (English)</label>
            <input
              type="text"
              value={form.targetGroupEn}
              onChange={(e) => updateField('targetGroupEn', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">الموقع</label>
          <input
            type="text"
            required
            value={form.location}
            onChange={(e) => updateField('location', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">التصنيف</label>
          <select
            value={form.categoryId}
            onChange={(e) => updateField('categoryId', e.target.value)}
            className={inputClass}
          >
            {categories.length === 0 && <option value="">لا توجد تصنيفات — أضيفي واحد أولًا</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameAr}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting || categories.length === 0}
          className="px-7 py-3 rounded-lg text-white font-medium disabled:opacity-50"
          style={{background: 'var(--color-navy)'}}
        >
          {submitting ? 'جاري الحفظ...' : 'حفظ المبادرة'}
        </button>
      </form>
    </main>
  );
}