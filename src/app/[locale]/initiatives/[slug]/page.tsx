import {notFound} from 'next/navigation';

interface Initiative {
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

interface Kpi {
  nameAr: string;
  nameEn: string;
  baseline: number;
  target: number;
  actual: number;
  unit: string;
}

interface BudgetSummary {
  totalPlanned: number;
  totalActual: number;
}

async function getInitiative(slug: string): Promise<Initiative | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/initiatives/${slug}`, {
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

async function getKpis(slug: string): Promise<Kpi[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/initiatives/${slug}/kpis`, {
    cache: 'no-store'
  });
  if (!res.ok) return [];
  return res.json();
}

async function getBudgetSummary(slug: string): Promise<BudgetSummary | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/initiatives/${slug}/budget-summary`, {
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function InitiativeDetailPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const isArabic = locale === 'ar';

  const initiative = await getInitiative(slug);
  if (!initiative) notFound();

  const kpis = await getKpis(slug);
  const budget = await getBudgetSummary(slug);

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-start mb-4">
        <h1 className="font-heading text-3xl font-bold" style={{color: 'var(--color-navy)'}}>
          {isArabic ? initiative.titleAr : initiative.titleEn}
        </h1>
        <span
          className="initiative-code text-xs px-2 py-1"
          style={{background: 'var(--color-growth)', color: 'white'}}
        >
          {initiative.status}
        </span>
      </div>

      <div className="flex gap-6 mb-6 text-sm" style={{color: 'var(--color-ink)', opacity: 0.7}}>
        <span>📍 {initiative.location}</span>
        <span>👥 {isArabic ? initiative.targetGroupAr : initiative.targetGroupEn}</span>
      </div>

      <p className="text-lg leading-relaxed mb-10" style={{color: 'var(--color-ink)', opacity: 0.85}}>
        {isArabic ? initiative.descriptionAr : initiative.descriptionEn}
      </p>

      {kpis.length > 0 && (
        <section className="mb-10">
          <h2 className="font-heading text-xl font-bold mb-4" style={{color: 'var(--color-navy)'}}>
            {isArabic ? 'مؤشرات الأداء' : 'KPIs'}
          </h2>
          <div className="space-y-4">
            {kpis.map((kpi, index) => {
              const progress = kpi.target > 0
                ? Math.min(100, Math.round((kpi.actual / kpi.target) * 100))
                : 0;
              return (
                <div key={index} className="border rounded-lg p-4" style={{borderColor: 'var(--color-line)'}}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium" style={{color: 'var(--color-ink)'}}>
                      {isArabic ? kpi.nameAr : kpi.nameEn}
                    </span>
                    <span className="text-sm" style={{color: 'var(--color-ink)', opacity: 0.6}}>
                      {kpi.actual} / {kpi.target} {kpi.unit}
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{background: 'var(--color-line)'}}>
                    <div
                      className="h-2 rounded-full"
                      style={{width: `${progress}%`, background: 'var(--color-navy)'}}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {budget && (
        <section>
          <h2 className="font-heading text-xl font-bold mb-4" style={{color: 'var(--color-navy)'}}>
            {isArabic ? 'الميزانية' : 'Budget'}
          </h2>
          <div className="flex gap-8 border rounded-lg p-6" style={{borderColor: 'var(--color-line)'}}>
            <div>
              <p className="text-2xl font-bold" style={{color: 'var(--color-navy)'}}>
                ${budget.totalPlanned.toLocaleString()}
              </p>
              <p className="text-sm" style={{color: 'var(--color-ink)', opacity: 0.7}}>
                {isArabic ? 'مخطَّط' : 'Planned'}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{color: 'var(--color-growth)'}}>
                ${budget.totalActual.toLocaleString()}
              </p>
              <p className="text-sm" style={{color: 'var(--color-ink)', opacity: 0.7}}>
                {isArabic ? 'فعلي' : 'Actual'}
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}