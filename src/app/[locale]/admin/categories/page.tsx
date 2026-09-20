'use client';

import {useEffect, useState} from 'react';
import {apiClient} from '@/lib/apiClient';
import {getToken} from '@/lib/auth';
import {useToast} from '@/components/Toast';

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

  if (loading) return <p className="p-8">جاري التحميل...</p>;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">التصنيفات</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="الاسم بالعربي"
          required
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          className="flex-1 border rounded-lg p-2.5"
        />
        <input
          type="text"
          placeholder="Name in English"
          required
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          className="flex-1 border rounded-lg p-2.5"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-lg text-white font-medium disabled:opacity-50"
          style={{background: 'var(--color-navy)'}}
        >
          إضافة
        </button>
      </form>

      {categories.length === 0 ? (
        <p className="text-gray-500">لا توجد تصنيفات بعد.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.id} className="border rounded-lg p-3 flex justify-between">
              <span>{c.nameAr}</span>
              <span className="text-gray-500">{c.nameEn}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}