import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

interface ChildLearningProps {
  locale: string;
}

export default async function ChildLearning({
  locale
}: ChildLearningProps) {
  const t = await getTranslations('HomePage.ChildLearning');

  return (
    <section
      className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8"
      style={{
        background: 'var(--fs-paper)',
        color: 'var(--color-ink)'
      }}
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        {/* Hero Content */}
        <div className="mb-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Text Content */}
          <div className="flex flex-col items-start text-right lg:col-span-6">
            <div
              className="mb-3 flex items-center gap-2 text-xs font-mono"
              style={{color: 'var(--color-navy)'}}
            >
              <span>{t('eyebrow.gaza')}</span>
              <span>&bull;</span>
              <span>{t('eyebrow.qudratech')}</span>
              <span>&bull;</span>
              <span>{t('eyebrow.year')}</span>

              <div
                className="h-[1px] w-12"
                style={{background: 'var(--color-growth)'}}
              />
            </div>

            <h1
              className="font-heading mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl rtl:leading-[1.2]"
              style={{color: 'var(--color-navy)'}}
            >
              {t('title')}
            </h1>

            <p
              className="mb-8 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{
                color: 'var(--color-ink)',
                opacity: 0.8
              }}
            >
              {t('description')}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/${locale}/journey`}
                className="px-6 py-3 font-medium text-white shadow-md transition-all hover:opacity-90"
                style={{background: 'var(--color-navy)'}}
              >
                {t('buttons.journey')}
              </Link>

              <Link
                href={`/${locale}/support`}
                className="fs-underline border px-6 py-3 font-medium transition-all"
                style={{
                  borderColor:
                    'color-mix(in srgb, var(--color-navy) 30%, transparent)',
                  color: 'var(--color-navy)'
                }}
              >
                {t('buttons.support')}
              </Link>
            </div>
          </div>

          {/* Prompt Flow Card */}
          <div
            className="fs-grid-navy relative flex min-h-[580px] flex-col justify-center overflow-hidden p-6 text-white shadow-2xl sm:p-8 lg:col-span-6"
            style={{background: 'var(--color-navy)'}}
          >
            <div
              className="fs-grid-bg pointer-events-none absolute inset-0 opacity-40"
              aria-hidden
            />

            <div className="relative z-10 my-auto flex h-full flex-col justify-center">
              <div
                className="fs-label mb-6 flex items-center justify-between text-xs"
                style={{color: 'var(--color-line)'}}
              >
                <span>{t('promptFlow')}</span>
                <span>{t('eyebrow.gaza')}</span>
              </div>

              <div className="my-auto flex flex-col justify-center space-y-4">
                {/* Prompt */}
                <div
                  className="border p-4 text-right"
                  style={{
                    borderColor:
                      'color-mix(in srgb, var(--color-line) 20%, transparent)',
                    background:
                      'color-mix(in srgb, var(--color-navy) 80%, white)'
                  }}
                >
                  <div
                    className="mb-1 font-mono text-[10px] tracking-wider"
                    style={{color: 'var(--color-accent)'}}
                  >
                    {t('prompt.label')}
                  </div>

                  <p className="text-sm font-medium sm:text-base">
                    {t('prompt.text')}
                  </p>
                </div>

                {/* Reasoning */}
                <div
                  className="relative flex items-center justify-between border border-dashed p-3"
                  style={{
                    borderColor:
                      'color-mix(in srgb, var(--color-line) 30%, transparent)'
                  }}
                >
                  <span
                    className="font-mono text-xs"
                    style={{color: 'var(--color-line)'}}
                  >
                    {t('reasoning')}
                  </span>

                  <span
                    className="fs-pulse h-2 w-2"
                    style={{background: 'var(--color-accent)'}}
                  />

                  <div
                    className="absolute -bottom-3 right-6 h-3 w-[1px]"
                    style={{background: 'var(--color-accent)'}}
                  />
                </div>

                {/* Output */}
                <div
                  className="border p-4 text-right shadow-inner"
                  style={{
                    borderColor:
                      'color-mix(in srgb, var(--color-accent) 50%, transparent)',
                    background: 'var(--color-navy)'
                  }}
                >
                  <div
                    className="mb-1 font-mono text-[10px] tracking-wider"
                    style={{color: 'var(--color-accent)'}}
                  >
                    {t('output.label')}
                  </div>

                  <p
                    className="text-sm sm:text-base"
                    style={{color: 'var(--fs-paper)'}}
                  >
                    {t('output.text')}
                  </p>
                </div>
              </div>

              {/* Note */}
              <div
                className="mt-6 border-t pt-4 font-mono text-xs"
                style={{
                  borderColor: 'color-mix(in srgb, white 10%, transparent)',
                  color: 'var(--color-line)',
                  opacity: 0.8
                }}
              >
                {t('promptNote')}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Status */}
          <div
            className="flex flex-col justify-between border p-6 shadow-sm"
            style={{
              borderColor: 'var(--color-line)',
              background: 'var(--fs-paper-2)'
            }}
          >
            <span
              className="mb-2 font-mono text-[11px] uppercase tracking-widest"
              style={{
                color: 'var(--color-ink)',
                opacity: 0.6
              }}
            >
              {t('stats.status.label')}
            </span>

            <div>
              <div
                className="mb-1 flex items-center gap-2 text-lg font-bold"
                style={{color: 'var(--color-growth)'}}
              >
                <span
                  className="inline-block h-2.5 w-2.5 animate-pulse"
                  style={{background: 'var(--color-growth)'}}
                />

                {t('stats.status.value')}
              </div>

              <p
                className="text-xs"
                style={{
                  color: 'var(--color-ink)',
                  opacity: 0.7
                }}
              >
                {t('stats.status.description')}
              </p>
            </div>
          </div>

          {/* Session */}
          <div
            className="flex flex-col justify-between border p-6 shadow-sm"
            style={{
              borderColor: 'var(--color-line)',
              background: 'var(--fs-paper-2)'
            }}
          >
            <span
              className="mb-2 font-mono text-[11px] uppercase tracking-widest"
              style={{
                color: 'var(--color-ink)',
                opacity: 0.6
              }}
            >
              {t('stats.session.label')}
            </span>

            <div className="flex items-baseline justify-between">
              <div
                className="font-mono text-3xl font-extrabold sm:text-4xl"
                style={{color: 'var(--color-navy)'}}
              >
                {t('stats.session.value')}{' '}

                <span
                  className="text-sm font-normal"
                  style={{color: 'var(--color-growth)'}}
                >
                  {t('stats.session.unit')}
                </span>
              </div>
            </div>

            <p
              className="mt-2 text-xs"
              style={{
                color: 'var(--color-ink)',
                opacity: 0.7
              }}
            >
              {t('stats.session.description')}
            </p>
          </div>

          {/* Enrolled */}
          <div
            className="relative flex flex-col justify-between overflow-hidden p-6 shadow-md"
            style={{
              background: 'var(--color-growth)',
              color: 'white'
            }}
          >
            <span className="mb-2 font-mono text-[11px] uppercase tracking-widest text-white/80">
              {t('stats.enrolled.label')}
            </span>

            <div className="font-mono text-4xl font-black tracking-tight sm:text-5xl">
              {t('stats.enrolled.value')}
            </div>

            <p className="mt-2 text-xs font-medium text-white/90">
              {t('stats.enrolled.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
