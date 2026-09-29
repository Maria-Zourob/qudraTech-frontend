'use client';

import {useEffect, useState} from 'react';
import {apiClient} from '@/lib/apiClient';
import {getToken} from '@/lib/auth';
import {useToast} from '@/components/Toast';
import {useConfirm} from '@/components/ConfirmDialog';
interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToast();
  const confirmDialog = useConfirm();
  async function loadCategories() {
    setLoading(true);
    const token = getToken() ?? undefined;
    const data = await apiClient.get<Category[]>('/categories', token);
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const token = getToken() ?? undefined;
    try {
      await apiClient.post('/categories', {nameAr, nameEn}, token);
      setNameAr('');
      setNameEn('');
      await loadCategories();
      showToast('تمت إضافة التصنيف بنجاح.', 'success');
    } catch {
      showToast('صار خطأ، حاولي كمان مرة.', 'error');
    }
    setSubmitting(false);
  }
  async function handleDelete(id: string, name: string) {
    const confirmed = await confirmDialog({
      title: 'حذف التصنيف',
      description: `هل أنتِ متأكدة من حذف "${name}"؟`,
      confirmLabel: 'حذف',
      danger: true
    });
    if (!confirmed) return;

    const token = getToken() ?? undefined;
    try {
      await apiClient.delete(`/categories/${id}`, token);
      showToast('تم حذف التصنيف.', 'success');
      await loadCategories();
    } catch {
      showToast('صار خطأ، حاولي كمان مرة.', 'error');
    }
  }
  if (loading) return <p className="p-8">جاري التحميل...</p>;

  return (
    <main className="max-w-2xl mx-auto p-6 md:p-8">
      <div className="mb-8 pb-5 border-b-2" style={{borderColor: 'var(--color-navy)'}}>
        <p className="fs-label" style={{color: 'var(--fs-muted)'}}>المبادرات</p>
        <h1 className="font-heading text-2xl font-bold mt-1" style={{color: 'var(--color-navy)'}}>
          التصنيفات
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-8 border p-5" style={{borderColor: 'var(--color-line)', background: 'white'}}>
        <div className="flex-1 min-w-[180px]">
          <label className="fs-label mb-1.5 block" style={{color: 'var(--fs-muted)'}}>الاسم بالعربي</label>
          <input
            type="text"
            required
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            className="w-full border px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--color-navy)] focus:outline-none"
            style={{borderColor: 'var(--color-line)', color: 'var(--color-ink)'}}
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="fs-label mb-1.5 block" style={{color: 'var(--fs-muted)'}}>Name in English</label>
          <input
            type="text"
            dir="ltr"
            required
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full border px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--color-navy)] focus:outline-none"
            style={{borderColor: 'var(--color-line)', color: 'var(--color-ink)'}}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="self-end px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{background: 'var(--color-navy)'}}
        >
          إضافة
        </button>
      </form>

      {categories.length === 0 ? (
        <p className="text-sm" style={{color: 'var(--fs-muted)'}}>لا توجد تصنيفات بعد.</p>
      ) : (
        <ul className="border divide-y" style={{borderColor: 'var(--color-line)'}}>
          {categories.map((c) => (
                        <li
              key={c.id}
              className="flex justify-between items-center p-4 transition-colors hover:bg-[var(--fs-paper-2)]"
              style={{background: 'white', borderColor: 'var(--color-line)'}}
            >
              <div>
                <span className="font-medium" style={{color: 'var(--color-navy)'}}>{c.nameAr}</span>
                <span className="fs-label ms-3" style={{color: 'var(--fs-muted)'}}>{c.nameEn}</span>
              </div>
              <button
                onClick={() => handleDelete(c.id, c.nameAr)}
                className="text-xs font-medium hover:underline"
                style={{color: '#C0392B'}}
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}