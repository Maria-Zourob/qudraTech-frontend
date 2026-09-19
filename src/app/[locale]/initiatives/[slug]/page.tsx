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

async function getInitiative(slug: string): Promise<Initiative | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/initiatives/${slug}`, {
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
      <p className="text-lg text-gray-700">
        {isArabic ? initiative.descriptionAr : initiative.descriptionEn}
      </p>
    </main>
  );
}