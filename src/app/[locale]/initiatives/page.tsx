import Link from 'next/link';
import {mockInitiatives} from '@/features/initiatives/mockData';

export default async function InitiativesListPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const isArabic = locale === 'ar';

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        {isArabic ? 'المبادرات' : 'Initiatives'}
      </h1>
      <div className="grid gap-4">
        {mockInitiatives.map((initiative) => (
          <Link
            key={initiative.slug}
            href={`/${locale}/initiatives/${initiative.slug}`}
            className="block p-6 border rounded-lg hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">
                {isArabic ? initiative.titleAr : initiative.titleEn}
              </h2>
              <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                {initiative.status}
              </span>
            </div>
            <p className="text-gray-600">
              {isArabic ? initiative.descriptionAr : initiative.descriptionEn}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}