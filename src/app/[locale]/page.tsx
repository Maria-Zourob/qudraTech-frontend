import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-lg text-gray-600 mb-8">{t('subtitle')}</p>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-blue-900 text-white rounded-lg">
          {t('exploreInitiatives')}
        </button>
        <button className="px-6 py-3 border border-blue-900 text-blue-900 rounded-lg">
          {t('aboutUs')}
        </button>
      </div>
    </main>
  );
}