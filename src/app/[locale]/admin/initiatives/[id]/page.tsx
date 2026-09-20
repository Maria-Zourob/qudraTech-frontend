'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {apiClient} from '@/lib/apiClient';
import {getToken} from '@/lib/auth';
import {useToast} from '@/components/Toast';

interface InitiativeDetail {
  id: string;
  titleAr: string;
  titleEn: string;
  status: string;
}

interface Kpi {
  id?: string;
  nameAr: string;
  nameEn: string;
  baseline: number;
  target: number;
  actual: number;
  unit: string;
}

const TABS = ['kpis', 'budget', 'risks'] as const;
type Tab = (typeof TABS)[number];

export default function InitiativeManagePage() {
  const params = useParams();
  const id = params.id as string;
  const showToast = useToast();

  const [initiative, setInitiative] = useState<InitiativeDetail | null>(null);
  const [tab, setTab] = useState<Tab>('kpis');
  const [loading, setLoading] = useState(true);

  async function loadInitiative() {
    setLoading(true);
    const token = getToken() ?? undefined;
    const data = await apiClient.get<InitiativeDetail>(`/initiatives/${id}`, token);
    setInitiative(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInitiative();
  }, [id]);

  if (loading || !initiative) return <p className="p-8">جاري التحميل...</p>;

  const TAB_LABELS: Record<Tab, string> = {
    kpis: 'مؤشرات الأداء',
    budget: 'الميزانية',
    risks: 'المخاطر'
  };

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-1">{initiative.titleAr}</h1>
      <span className="text-sm text-gray-500 mb-6 inline-block">{initiative.status}</span>

      <div className="flex gap-2 border-b mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-medium"
            style={{
              borderBottom: tab === t ? '2px solid var(--color-navy)' : '2px solid transparent',
              color: tab === t ? 'var(--color-navy)' : '#888'
            }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === 'kpis' && <KpiTab initiativeId={id} showToast={showToast} />}
      {tab === 'budget' && <BudgetTab initiativeId={id} showToast={showToast} />}
      {tab === 'risks' && <RisksTab initiativeId={id} showToast={showToast} />}
    </main>
  );
}
function BudgetTab({initiativeId, showToast}: {initiativeId: string; showToast: (m: string, t?: 'success' | 'error') => void}) {
  const [form, setForm] = useState({
    category: '', itemNameAr: '', itemNameEn: '',
    plannedAmount: 0, actualAmount: 0, fundingSource: ''
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const token = getToken() ?? undefined;
    try {
      await apiClient.post(`/initiatives/${initiativeId}/budget-items`, form, token);
      showToast('تمت إضافة بند الميزانية بنجاح.', 'success');
      setForm({category: '', itemNameAr: '', itemNameEn: '', plannedAmount: 0, actualAmount: 0, fundingSource: ''});
    } catch {
      showToast('صار خطأ، حاولي كمان مرة.', 'error');
    }
    setSubmitting(false);
  }

  const inputClass = 'w-full border rounded-lg p-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="الفئة (Internet/Printing...)" required value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className={inputClass} />
        <input placeholder="مصدر التمويل" value={form.fundingSource} onChange={(e) => setForm({...form, fundingSource: e.target.value})} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="اسم البند بالعربي" required value={form.itemNameAr} onChange={(e) => setForm({...form, itemNameAr: e.target.value})} className={inputClass} />
        <input placeholder="Item name in English" required value={form.itemNameEn} onChange={(e) => setForm({...form, itemNameEn: e.target.value})} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input type="number" placeholder="المبلغ المخطَّط" required value={form.plannedAmount} onChange={(e) => setForm({...form, plannedAmount: Number(e.target.value)})} className={inputClass} />
        <input type="number" placeholder="المبلغ الفعلي" value={form.actualAmount} onChange={(e) => setForm({...form, actualAmount: Number(e.target.value)})} className={inputClass} />
      </div>
      <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg text-white text-sm disabled:opacity-50" style={{background: 'var(--color-navy)'}}>
        {submitting ? 'جاري الحفظ...' : 'إضافة بند'}
      </button>
    </form>
  );
}

function RisksTab({initiativeId, showToast}: {initiativeId: string; showToast: (m: string, t?: 'success' | 'error') => void}) {
  const [form, setForm] = useState({
    descriptionAr: '', descriptionEn: '', probability: 'Medium',
    impact: 'Medium', mitigation: '', contingencyPlan: ''
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const token = getToken() ?? undefined;
    try {
      await apiClient.post(`/initiatives/${initiativeId}/risks`, form, token);
      showToast('تمت إضافة الخطر بنجاح.', 'success');
      setForm({descriptionAr: '', descriptionEn: '', probability: 'Medium', impact: 'Medium', mitigation: '', contingencyPlan: ''});
    } catch {
      showToast('صار خطأ، حاولي كمان مرة.', 'error');
    }
    setSubmitting(false);
  }

  const inputClass = 'w-full border rounded-lg p-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <textarea placeholder="وصف الخطر بالعربي" required rows={2} value={form.descriptionAr} onChange={(e) => setForm({...form, descriptionAr: e.target.value})} className={inputClass} />
        <textarea placeholder="Risk description in English" required rows={2} value={form.descriptionEn} onChange={(e) => setForm({...form, descriptionEn: e.target.value})} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select value={form.probability} onChange={(e) => setForm({...form, probability: e.target.value})} className={inputClass}>
          <option value="Low">احتمالية: منخفضة</option>
          <option value="Medium">احتمالية: متوسطة</option>
          <option value="High">احتمالية: عالية</option>
        </select>
        <select value={form.impact} onChange={(e) => setForm({...form, impact: e.target.value})} className={inputClass}>
          <option value="Low">تأثير: منخفض</option>
          <option value="Medium">تأثير: متوسط</option>
          <option value="High">تأثير: عالي</option>
        </select>
      </div>
      <textarea placeholder="خطة التخفيف" required rows={2} value={form.mitigation} onChange={(e) => setForm({...form, mitigation: e.target.value})} className={inputClass} />
      <textarea placeholder="خطة الطوارئ (اختياري)" rows={2} value={form.contingencyPlan} onChange={(e) => setForm({...form, contingencyPlan: e.target.value})} className={inputClass} />
      <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg text-white text-sm disabled:opacity-50" style={{background: 'var(--color-navy)'}}>
        {submitting ? 'جاري الحفظ...' : 'إضافة خطر'}
      </button>
    </form>
  );
}
function KpiTab({initiativeId, showToast}: {initiativeId: string; showToast: (m: string, t?: 'success' | 'error') => void}) {
  const [form, setForm] = useState({nameAr: '', nameEn: '', baseline: 0, target: 0, actual: 0, unit: ''});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const token = getToken() ?? undefined;
    try {
      await apiClient.post(`/initiatives/${initiativeId}/kpis`, form, token);
      showToast('تمت إضافة المؤشر بنجاح.', 'success');
      setForm({nameAr: '', nameEn: '', baseline: 0, target: 0, actual: 0, unit: ''});
    } catch {
      showToast('صار خطأ، حاولي كمان مرة.', 'error');
    }
    setSubmitting(false);
  }

  const inputClass = 'w-full border rounded-lg p-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="الاسم بالعربي" required value={form.nameAr} onChange={(e) => setForm({...form, nameAr: e.target.value})} className={inputClass} />
        <input placeholder="Name in English" required value={form.nameEn} onChange={(e) => setForm({...form, nameEn: e.target.value})} className={inputClass} />
      </div>
      <div className="grid grid-cols-4 gap-3">
        <input type="number" placeholder="الأساس" value={form.baseline} onChange={(e) => setForm({...form, baseline: Number(e.target.value)})} className={inputClass} />
        <input type="number" placeholder="الهدف" required value={form.target} onChange={(e) => setForm({...form, target: Number(e.target.value)})} className={inputClass} />
        <input type="number" placeholder="الفعلي" value={form.actual} onChange={(e) => setForm({...form, actual: Number(e.target.value)})} className={inputClass} />
        <input placeholder="الوحدة" required value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} className={inputClass} />
      </div>
      <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg text-white text-sm disabled:opacity-50" style={{background: 'var(--color-navy)'}}>
        {submitting ? 'جاري الحفظ...' : 'إضافة مؤشر'}
      </button>
    </form>
  );
}