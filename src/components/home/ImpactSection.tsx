import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';

interface ImpactStat {
  number: string;
  label: string;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function ImpactSection() {
  const t = await getTranslations('HomePage.impact');

  const stats = t.raw('stats') as ImpactStat[];

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#092b49] py-24 text-white md:py-32">
      {/* Subtle grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f3e5c_1px,transparent_1px),linear-gradient(to_bottom,#1f3e5c_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      <div className={`${CONTAINER} relative z-10`}>
        <Reveal>
          {/* Section heading */}
          <div className="mb-16 flex flex-col items-start text-start">
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              {t('label')}
            </div>

            <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
                {t('title')}
              </h2>

              <p className="text-xs font-mono text-white/60">
                {t('note')}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 divide-y divide-white/15 border-y border-white/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:divide-x-reverse lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.number}
                className="flex flex-col justify-between p-8"
              >
                <span className="mb-4 block font-heading text-4xl font-extrabold text-[var(--color-accent)] sm:text-5xl">
                  {stat.number}
                </span>

                <p className="text-sm font-medium leading-relaxed text-white/90">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}