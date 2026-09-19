import {getTranslations} from 'next-intl/server';

interface Impact {
  initiatives: number;
  beneficiaries: number;
  volunteers: number;
  activities: number;
}

async function getImpact(): Promise<Impact | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/impact`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  const impact = await getImpact();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-lg text-gray-600 mb-8">{t('subtitle')}</p>
      <div className="flex gap-4 mb-12">
        <button className="px-6 py-3 bg-blue-900 text-white rounded-lg">
          {t('exploreInitiatives')}
        </button>
        <button className="px-6 py-3 border border-blue-900 text-blue-900 rounded-lg">
          {t('aboutUs')}
        </button>
      </div>

      {impact && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-3xl font-bold text-blue-900">{impact.initiatives}+</p>
            <p className="text-gray-500">مبادرة</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-900">{impact.beneficiaries}+</p>
            <p className="text-gray-500">مستفيد</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-900">{impact.volunteers}+</p>
            <p className="text-gray-500">متطوع</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-900">{impact.activities}+</p>
            <p className="text-gray-500">نشاط</p>
          </div>
        </div>
      )}
    </main>
  );
}