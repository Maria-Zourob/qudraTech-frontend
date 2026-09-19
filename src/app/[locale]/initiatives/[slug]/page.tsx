import {notFound} from 'next/navigation';

interface Initiative {
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: string;
  location: string;
}

interface Kpi {
  nameAr: string;
  nameEn: string;
  baseline: number;
  target: number;
  actual: number;
  unit: string;
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

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-bold">
          {isArabic ? initiative.titleAr : initiative.titleEn}
        </h1>
        <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
          {initiative.status}
        </span>
      </div>
      <p className="text-gray-500 mb-6">📍 {initiative.location}</p>
      <p className="text-lg text-gray-700 mb-10">
        {isArabic ? initiative.descriptionAr : initiative.descriptionEn}
      </p>

      {kpis.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">
            {isArabic ? 'مؤشرات الأداء' : 'KPIs'}
          </h2>
          <div className="space-y-4">
            {kpis.map((kpi, index) => {
              const progress = kpi.target > 0
                ? Math.min(100, Math.round((kpi.actual / kpi.target) * 100))
                : 0;
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">
                      {isArabic ? kpi.nameAr : kpi.nameEn}
                    </span>
                    <span className="text-sm text-gray-500">
                      {kpi.actual} / {kpi.target} {kpi.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-900 h-2 rounded-full"
                      style={{width: `${progress}%`}}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}