'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {apiClient} from '@/lib/apiClient';
import {getToken} from '@/lib/auth';
import {useToast} from '@/components/Toast';

interface InitiativeDetail {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: string;
  location: string;
  targetGroupAr: string;
  targetGroupEn: string;
}

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
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

interface Partner {
  id: string;
  nameAr: string;
  nameEn: string;
  type: string;
}

const TABS = ['details', 'kpis', 'budget', 'risks', 'partners'] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  details: 'البيانات الأساسية',
  kpis: 'مؤشرات الأداء',
  budget: 'الميزانية',
  risks: 'المخاطر',
  partners: 'الشركاء'
};

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="fs-label mb-1.5 block"
        style={{color: 'var(--fs-muted)'}}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full border px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--color-navy)] focus:outline-none';

const inputStyle = {
  borderColor: 'var(--color-line)',
  color: 'var(--color-ink)'
};

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

    const data = await apiClient.get<InitiativeDetail>(
      `/initiatives/${id}`,
      token
    );

    setInitiative(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInitiative();
  }, [id]);

  if (loading || !initiative) {
    return (
      <main className="mx-auto max-w-4xl p-6 md:p-8">
        <p
          className="text-sm"
          style={{color: 'var(--fs-muted)'}}
        >
          جاري التحميل...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-8">
      {/* Header */}
      <div
        className="mb-8 border-b-2 pb-5"
        style={{borderColor: 'var(--color-navy)'}}
      >
        <p
          className="fs-label"
          style={{color: 'var(--fs-muted)'}}
        >
          المبادرات
        </p>

        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              className="font-heading text-2xl font-bold"
              style={{color: 'var(--color-navy)'}}
            >
              إدارة المبادرة
            </h1>

            <p
              className="mt-1 text-sm"
              style={{color: 'var(--fs-muted)'}}
            >
              {initiative.titleAr}
            </p>
          </div>

          <span
            className="w-fit px-3 py-1.5 text-xs font-medium"
            style={{
              background: 'rgba(120, 155, 135, 0.12)',
              color: 'var(--fs-sage-ink)'
            }}
          >
            {initiative.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <nav
        className="mb-6 flex overflow-x-auto border-b"
        style={{borderColor: 'var(--color-line)'}}
      >
        {TABS.map((t) => {
          const active = tab === t;

          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="relative shrink-0 px-4 py-3 text-sm font-medium transition-colors"
              style={{
                color: active
                  ? 'var(--color-navy)'
                  : 'var(--fs-muted)'
              }}
            >
              {TAB_LABELS[t]}

              {active && (
                <span
                  className="absolute inset-x-0 bottom-0 h-0.5"
                  style={{background: 'var(--color-navy)'}}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      <div
        className="border p-6 md:p-7"
        style={{
          borderColor: 'var(--color-line)',
          background: 'white'
        }}
      >
        {tab === 'details' && (
          <DetailsTab
            initiative={initiative}
            onUpdated={loadInitiative}
            showToast={showToast}
          />
        )}

        {tab === 'kpis' && (
          <KpiTab
            initiativeId={id}
            showToast={showToast}
          />
        )}

        {tab === 'budget' && (
          <BudgetTab
            initiativeId={id}
            showToast={showToast}
          />
        )}

        {tab === 'risks' && (
          <RisksTab
            initiativeId={id}
            showToast={showToast}
          />
        )}

        {tab === 'partners' && (
          <PartnersTab
            initiativeId={id}
            showToast={showToast}
          />
        )}
      </div>
    </main>
  );
}

/* =========================================================
   DETAILS
========================================================= */

function DetailsTab({
  initiative,
  onUpdated,
  showToast
}: {
  initiative: InitiativeDetail;
  onUpdated: () => void;
  showToast: (
    m: string,
    t?: 'success' | 'error'
  ) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    titleAr: initiative.titleAr,
    titleEn: initiative.titleEn,
    descriptionAr: initiative.descriptionAr,
    descriptionEn: initiative.descriptionEn,
    targetGroupAr: initiative.targetGroupAr,
    targetGroupEn: initiative.targetGroupEn,
    location: initiative.location,
    categoryId: ''
  });

  useEffect(() => {
    async function loadCategories() {
      const token = getToken() ?? undefined;

      const data = await apiClient.get<Category[]>(
        '/categories',
        token
      );

      setCategories(data);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, []);

  function updateField(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const token = getToken() ?? undefined;

    try {
      await apiClient.put(
        `/initiatives/${initiative.id}`,
        form,
        token
      );

      showToast(
        'تم تحديث بيانات المبادرة بنجاح.',
        'success'
      );

      onUpdated();
    } catch {
      showToast(
        'صار خطأ، حاولي كمان مرة.',
        'error'
      );
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="العنوان بالعربي">
          <input
            required
            value={form.titleAr}
            onChange={(e) =>
              updateField('titleAr', e.target.value)
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Title in English">
          <input
            dir="ltr"
            required
            value={form.titleEn}
            onChange={(e) =>
              updateField('titleEn', e.target.value)
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="الوصف بالعربي">
          <textarea
            required
            rows={4}
            value={form.descriptionAr}
            onChange={(e) =>
              updateField(
                'descriptionAr',
                e.target.value
              )
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Description in English">
          <textarea
            dir="ltr"
            required
            rows={4}
            value={form.descriptionEn}
            onChange={(e) =>
              updateField(
                'descriptionEn',
                e.target.value
              )
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="الفئة المستهدفة (عربي)">
          <input
            value={form.targetGroupAr}
            onChange={(e) =>
              updateField(
                'targetGroupAr',
                e.target.value
              )
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Target Group (English)">
          <input
            dir="ltr"
            value={form.targetGroupEn}
            onChange={(e) =>
              updateField(
                'targetGroupEn',
                e.target.value
              )
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <Field label="الموقع">
        <input
          required
          value={form.location}
          onChange={(e) =>
            updateField('location', e.target.value)
          }
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <Field label="التصنيف">
        <select
          required
          value={form.categoryId}
          onChange={(e) =>
            updateField(
              'categoryId',
              e.target.value
            )
          }
          className={inputClass}
          style={inputStyle}
        >
          <option value="">
            اختاري تصنيف
          </option>

          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameAr}
            </option>
          ))}
        </select>
      </Field>

      <div
        className="border-t pt-5"
        style={{borderColor: 'var(--color-line)'}}
      >
        <button
          type="submit"
          disabled={submitting}
          className="px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{background: 'var(--color-navy)'}}
        >
          {submitting
            ? 'جاري الحفظ...'
            : 'حفظ التعديلات'}
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   KPI
========================================================= */

function KpiTab({
  initiativeId,
  showToast
}: {
  initiativeId: string;
  showToast: (
    m: string,
    t?: 'success' | 'error'
  ) => void;
}) {
  const [form, setForm] = useState({
    nameAr: '',
    nameEn: '',
    baseline: 0,
    target: 0,
    actual: 0,
    unit: ''
  });

  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();
    setSubmitting(true);

    const token = getToken() ?? undefined;

    try {
      await apiClient.post(
        `/initiatives/${initiativeId}/kpis`,
        form,
        token
      );

      showToast(
        'تمت إضافة المؤشر بنجاح.',
        'success'
      );

      setForm({
        nameAr: '',
        nameEn: '',
        baseline: 0,
        target: 0,
        actual: 0,
        unit: ''
      });
    } catch {
      showToast(
        'صار خطأ، حاولي كمان مرة.',
        'error'
      );
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-2">
        <p
          className="font-heading text-lg font-bold"
          style={{color: 'var(--color-navy)'}}
        >
          إضافة مؤشر أداء
        </p>

        <p
          className="mt-1 text-sm"
          style={{color: 'var(--fs-muted)'}}
        >
          أضيفي مؤشرًا جديدًا لقياس تقدم المبادرة.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="الاسم بالعربي">
          <input
            required
            value={form.nameAr}
            onChange={(e) =>
              setForm({
                ...form,
                nameAr: e.target.value
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Name in English">
          <input
            dir="ltr"
            required
            value={form.nameEn}
            onChange={(e) =>
              setForm({
                ...form,
                nameEn: e.target.value
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Field label="خط الأساس">
          <input
            type="number"
            value={form.baseline}
            onChange={(e) =>
              setForm({
                ...form,
                baseline: Number(e.target.value)
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="الهدف">
          <input
            type="number"
            required
            value={form.target}
            onChange={(e) =>
              setForm({
                ...form,
                target: Number(e.target.value)
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="الفعلي">
          <input
            type="number"
            value={form.actual}
            onChange={(e) =>
              setForm({
                ...form,
                actual: Number(e.target.value)
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="الوحدة">
          <input
            required
            value={form.unit}
            onChange={(e) =>
              setForm({
                ...form,
                unit: e.target.value
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <ActionButton
        submitting={submitting}
        text="إضافة مؤشر"
        loadingText="جاري الحفظ..."
      />
    </form>
  );
}

/* =========================================================
   BUDGET
========================================================= */

function BudgetTab({
  initiativeId,
  showToast
}: {
  initiativeId: string;
  showToast: (
    m: string,
    t?: 'success' | 'error'
  ) => void;
}) {
  const [form, setForm] = useState({
    category: '',
    itemNameAr: '',
    itemNameEn: '',
    plannedAmount: 0,
    actualAmount: 0,
    fundingSource: ''
  });

  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();
    setSubmitting(true);

    const token = getToken() ?? undefined;

    try {
      await apiClient.post(
        `/initiatives/${initiativeId}/budget-items`,
        form,
        token
      );

      showToast(
        'تمت إضافة بند الميزانية بنجاح.',
        'success'
      );

      setForm({
        category: '',
        itemNameAr: '',
        itemNameEn: '',
        plannedAmount: 0,
        actualAmount: 0,
        fundingSource: ''
      });
    } catch {
      showToast(
        'صار خطأ، حاولي كمان مرة.',
        'error'
      );
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-2">
        <p
          className="font-heading text-lg font-bold"
          style={{color: 'var(--color-navy)'}}
        >
          إضافة بند للميزانية
        </p>

        <p
          className="mt-1 text-sm"
          style={{color: 'var(--fs-muted)'}}
        >
          سجلي التكاليف المخططة والفعلية ومصدر التمويل.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="الفئة">
          <input
            required
            placeholder="Internet / Printing..."
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="مصدر التمويل">
          <input
            value={form.fundingSource}
            onChange={(e) =>
              setForm({
                ...form,
                fundingSource: e.target.value
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="اسم البند بالعربي">
          <input
            required
            value={form.itemNameAr}
            onChange={(e) =>
              setForm({
                ...form,
                itemNameAr: e.target.value
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Item name in English">
          <input
            dir="ltr"
            required
            value={form.itemNameEn}
            onChange={(e) =>
              setForm({
                ...form,
                itemNameEn: e.target.value
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="المبلغ المخطَّط">
          <input
            type="number"
            required
            value={form.plannedAmount}
            onChange={(e) =>
              setForm({
                ...form,
                plannedAmount: Number(
                  e.target.value
                )
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="المبلغ الفعلي">
          <input
            type="number"
            value={form.actualAmount}
            onChange={(e) =>
              setForm({
                ...form,
                actualAmount: Number(
                  e.target.value
                )
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <ActionButton
        submitting={submitting}
        text="إضافة بند"
        loadingText="جاري الحفظ..."
      />
    </form>
  );
}

/* =========================================================
   RISKS
========================================================= */

function RisksTab({
  initiativeId,
  showToast
}: {
  initiativeId: string;
  showToast: (
    m: string,
    t?: 'success' | 'error'
  ) => void;
}) {
  const [form, setForm] = useState({
    descriptionAr: '',
    descriptionEn: '',
    probability: 'Medium',
    impact: 'Medium',
    mitigation: '',
    contingencyPlan: ''
  });

  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();
    setSubmitting(true);

    const token = getToken() ?? undefined;

    try {
      await apiClient.post(
        `/initiatives/${initiativeId}/risks`,
        form,
        token
      );

      showToast(
        'تمت إضافة الخطر بنجاح.',
        'success'
      );

      setForm({
        descriptionAr: '',
        descriptionEn: '',
        probability: 'Medium',
        impact: 'Medium',
        mitigation: '',
        contingencyPlan: ''
      });
    } catch {
      showToast(
        'صار خطأ، حاولي كمان مرة.',
        'error'
      );
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-2">
        <p
          className="font-heading text-lg font-bold"
          style={{color: 'var(--color-navy)'}}
        >
          إضافة خطر
        </p>

        <p
          className="mt-1 text-sm"
          style={{color: 'var(--fs-muted)'}}
        >
          حددي الخطر واحتماليته وتأثيره وخطة التعامل معه.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="وصف الخطر بالعربي">
          <textarea
            required
            rows={4}
            value={form.descriptionAr}
            onChange={(e) =>
              setForm({
                ...form,
                descriptionAr: e.target.value
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>

        <Field label="Risk description in English">
          <textarea
            dir="ltr"
            required
            rows={4}
            value={form.descriptionEn}
            onChange={(e) =>
              setForm({
                ...form,
                descriptionEn: e.target.value
              })
            }
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="الاحتمالية">
          <select
            value={form.probability}
            onChange={(e) =>
              setForm({
                ...form,
                probability: e.target.value
              })
            }
            className={inputClass}
            style={inputStyle}
          >
            <option value="Low">
              منخفضة
            </option>
            <option value="Medium">
              متوسطة
            </option>
            <option value="High">
              عالية
            </option>
          </select>
        </Field>

        <Field label="التأثير">
          <select
            value={form.impact}
            onChange={(e) =>
              setForm({
                ...form,
                impact: e.target.value
              })
            }
            className={inputClass}
            style={inputStyle}
          >
            <option value="Low">
              منخفض
            </option>
            <option value="Medium">
              متوسط
            </option>
            <option value="High">
              عالي
            </option>
          </select>
        </Field>
      </div>

      <Field label="خطة التخفيف">
        <textarea
          required
          rows={4}
          value={form.mitigation}
          onChange={(e) =>
            setForm({
              ...form,
              mitigation: e.target.value
            })
          }
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <Field label="خطة الطوارئ (اختياري)">
        <textarea
          rows={4}
          value={form.contingencyPlan}
          onChange={(e) =>
            setForm({
              ...form,
              contingencyPlan: e.target.value
            })
          }
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <ActionButton
        submitting={submitting}
        text="إضافة خطر"
        loadingText="جاري الحفظ..."
      />
    </form>
  );
}

/* =========================================================
   PARTNERS
========================================================= */

function PartnersTab({
  initiativeId,
  showToast
}: {
  initiativeId: string;
  showToast: (
    m: string,
    t?: 'success' | 'error'
  ) => void;
}) {
  const [allPartners, setAllPartners] =
    useState<Partner[]>([]);

  const [linkedPartners, setLinkedPartners] =
    useState<Partner[]>([]);

  const [selectedId, setSelectedId] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [linking, setLinking] =
    useState(false);

  async function loadData() {
    setLoading(true);

    const partners =
      await apiClient.get<Partner[]>(
        '/public/partners'
      );

    setAllPartners(partners);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  async function handleLink(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!selectedId) return;

    setLinking(true);

    const token = getToken() ?? undefined;

    try {
      await apiClient.post(
        `/initiatives/${initiativeId}/partners/${selectedId}`,
        {},
        token
      );

      const partner = allPartners.find(
        (p) => p.id === selectedId
      );

      if (partner) {
        setLinkedPartners((prev) => [
          ...prev,
          partner
        ]);
      }

      showToast(
        'تم ربط الشريك بالمبادرة بنجاح.',
        'success'
      );

      setSelectedId('');
    } catch {
      showToast(
        'صار خطأ، حاولي كمان مرة.',
        'error'
      );
    }

    setLinking(false);
  }

  if (loading) {
    return (
      <p
        className="text-sm"
        style={{color: 'var(--fs-muted)'}}
      >
        جاري التحميل...
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p
          className="font-heading text-lg font-bold"
          style={{color: 'var(--color-navy)'}}
        >
          شركاء المبادرة
        </p>

        <p
          className="mt-1 text-sm"
          style={{color: 'var(--fs-muted)'}}
        >
          اربطي الشركاء الموجودين في النظام بهذه المبادرة.
        </p>
      </div>

      {allPartners.length === 0 ? (
        <div
          className="border p-5 text-sm"
          style={{
            borderColor: 'var(--color-line)',
            color: 'var(--fs-muted)'
          }}
        >
          لا يوجد شركاء بالنظام بعد — أضيفي شريك أولًا.
        </div>
      ) : (
        <form
          onSubmit={handleLink}
          className="space-y-4"
        >
          <Field label="اختيار شريك">
            <select
              required
              value={selectedId}
              onChange={(e) =>
                setSelectedId(e.target.value)
              }
              className={inputClass}
              style={inputStyle}
            >
              <option value="">
                اختاري شريكًا لربطه بالمبادرة
              </option>

              {allPartners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameAr} ({p.type})
                </option>
              ))}
            </select>
          </Field>

          <button
            type="submit"
            disabled={linking}
            className="px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background: 'var(--color-navy)'
            }}
          >
            {linking
              ? 'جاري الربط...'
              : 'ربط الشريك'}
          </button>
        </form>
      )}

      {linkedPartners.length > 0 && (
        <div
          className="border-t pt-5"
          style={{
            borderColor: 'var(--color-line)'
          }}
        >
          <p
            className="fs-label mb-3"
            style={{
              color: 'var(--fs-muted)'
            }}
          >
            الشركاء المرتبطون
          </p>

          <div className="space-y-2">
            {linkedPartners.map((p) => (
              <div
                key={p.id}
                className="border px-4 py-3 text-sm"
                style={{
                  borderColor:
                    'var(--color-line)',
                  color: 'var(--color-ink)'
                }}
              >
                <span className="font-medium">
                  {p.nameAr}
                </span>

                <span
                  className="ms-2 text-xs"
                  style={{
                    color: 'var(--fs-muted)'
                  }}
                >
                  {p.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   BUTTON
========================================================= */

function ActionButton({
  submitting,
  text,
  loadingText
}: {
  submitting: boolean;
  text: string;
  loadingText: string;
}) {
  return (
    <div
      className="border-t pt-5"
      style={{
        borderColor: 'var(--color-line)'
      }}
    >
      <button
        type="submit"
        disabled={submitting}
        className="px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{
          background: 'var(--color-navy)'
        }}
      >
        {submitting ? loadingText : text}
      </button>
    </div>
  );
}