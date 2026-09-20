import {getTranslations} from 'next-intl/server';

interface ChildLearningProps {
  locale: string;
}

export default async function ChildLearning({
  locale,
}: ChildLearningProps) {
  const t = await getTranslations('HomePage.ChildLearning');

  return (
    <section
      className="relative overflow-hidden bg-[#f7f6f1] px-4 py-12 text-[#1c2b36] sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        {/* Main Content */}
        <div className="mb-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          
          {/* Text Side (النصوص على اليمين) */}
          <div className="flex flex-col items-start text-right lg:col-span-6">
            {/* Eyebrow */}
            <div className="mb-3 flex items-center gap-2 text-xs font-mono text-[#0c3860]">
              <span>{t('eyebrow.gaza')}</span>
              <span>&bull;</span>
              <span>{t('eyebrow.qudratech')}</span>
              <span>&bull;</span>
              <span>{t('eyebrow.year')}</span>
              <div className="h-[1px] w-12 bg-[#e8912f]" />
            </div>

            {/* Heading */}
            <h1 className="font-heading mb-6 text-4xl font-extrabold leading-tight text-[#0c3860] sm:text-5xl lg:text-6xl rtl:leading-[1.2]">
              {t('title')}
            </h1>

            {/* Description */}
            <p className="mb-8 max-w-xl text-base leading-relaxed text-[#1c2b36]/80 sm:text-lg">
              {t('description')}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`/${locale}/journey`}
                className="bg-[#0c3860] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[#082744]"
              >
                {t('buttons.journey')}
              </a>

              <a
                href={`/${locale}/support`}
                className="fs-underline border border-[#0c3860]/30 px-6 py-3 font-medium text-[#0c3860] transition-all hover:border-[#0c3860]"
              >
                {t('buttons.support')}
              </a>
            </div>
          </div>

          {/* Prompt / Model Card (البطاقة الزرقاء على اليسار ومحتواها موسط بالداخل) */}
          <div className="relative overflow-hidden bg-[#082744] p-6 text-white shadow-2xl fs-grid-navy sm:p-8 lg:col-span-6 flex flex-col justify-center min-h-[580px]">
            <div
              className="fs-grid-bg pointer-events-none absolute inset-0 opacity-40"
              aria-hidden
            />

            <div className="relative z-10 flex flex-col justify-center h-full my-auto">
              
              {/* Top Flow Header */}
              <div className="mb-6 flex items-center justify-between text-xs text-[#d8d3c8] fs-label">
                <span>{t('promptFlow')}</span>
                <span>{t('eyebrow.gaza')}</span>
              </div>

              {/* Inner Centered Wrapper */}
              <div className="flex flex-col justify-center space-y-4 my-auto">
                {/* Prompt */}
                <div className="border border-[#d8d3c8]/20 bg-[#0c3860]/80 p-4 text-right">
                  <div className="mb-1 text-[10px] tracking-wider text-[#e8912f] font-mono">
                    {t('prompt.label')}
                  </div>
                  <p className="text-sm font-medium sm:text-base">
                    {t('prompt.text')}
                  </p>
                </div>

                {/* Reasoning */}
                <div className="relative border border-dashed border-[#d8d3c8]/30 p-3 flex items-center justify-between">
                  <span className="text-xs text-[#d8d3c8] font-mono">
                    {t('reasoning')}
                  </span>
                  <span className="fs-pulse h-2 w-2 bg-[#e8912f]" />
                  <div className="absolute -bottom-3 right-6 w-[1px] h-3 bg-[#e8912f]" />
                </div>

                {/* Output */}
                <div className="border border-[#e8912f]/50 bg-[#0c3860] p-4 shadow-inner text-right">
                  <div className="mb-1 text-[10px] tracking-wider text-[#e8912f] font-mono">
                    {t('output.label')}
                  </div>
                  <p className="text-sm text-[#f7f6f1] sm:text-base">
                    {t('output.text')}
                  </p>
                </div>
              </div>

              {/* Bottom Note */}
              <div className="border-t border-white/10 pt-4 mt-6 text-xs text-[#d8d3c8]/80 font-mono">
                {t('promptNote')}
              </div>

            </div>
          </div>

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Status */}
          <div className="flex flex-col justify-between border border-[#d8d3c8] bg-[#fbfaf6] p-6 shadow-sm">
            <span className="mb-2 text-[11px] uppercase tracking-widest text-[#1c2b36]/60 font-mono">
              {t('stats.status.label')}
            </span>

            <div>
              <div className="mb-1 flex items-center gap-2 text-lg font-bold text-[#6b8f47]">
                <span className="inline-block h-2.5 w-2.5 animate-pulse bg-[#6b8f47]" />
                {t('stats.status.value')}
              </div>

              <p className="text-xs text-[#1c2b36]/70">
                {t('stats.status.description')}
              </p>
            </div>
          </div>

          {/* Session */}
          <div className="flex flex-col justify-between border border-[#d8d3c8] bg-[#fbfaf6] p-6 shadow-sm">
            <span className="mb-2 text-[11px] uppercase tracking-widest text-[#1c2b36]/60 font-mono">
              {t('stats.session.label')}
            </span>

            <div className="flex items-baseline justify-between">
              <div className="font-mono text-3xl font-extrabold text-[#0c3860] sm:text-4xl">
                {t('stats.session.value')}{' '}
                <span className="text-sm font-normal text-[#6b8f47]">
                  {t('stats.session.unit')}
                </span>
              </div>
            </div>

            <p className="mt-2 text-xs text-[#1c2b36]/70">
              {t('stats.session.description')}
            </p>
          </div>

          {/* Enrolled */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-[#e8912f] p-6 text-white shadow-md">
            <span className="mb-2 text-[11px] uppercase tracking-widest text-white/80 font-mono">
              {t('stats.enrolled.label')}
            </span>

            <div className="font-mono text-4xl font-black tracking-tight text-[#082744] sm:text-5xl">
              {t('stats.enrolled.value')}
            </div>

            <p className="mt-2 text-xs font-medium text-[#082744]">
              {t('stats.enrolled.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}