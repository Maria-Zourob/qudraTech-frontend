import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {PhotoSlot} from '@/components/home/PhotoSlot';

interface ImpactStat {
  number: string;
  label: string;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function ImpactSection() {
  const t = await getTranslations('HomePage.impact');
  const tp = await getTranslations('HomePage.photos');

  const stats = t.raw('stats') as ImpactStat[];
  const [lead, ...rest] = stats;

  return (
    <section
      className="relative overflow-hidden bg-[var(--fs-navy-deep)] py-24 text-white md:py-32"
      aria-labelledby="impact-title"
    >
      <div className={CONTAINER}>
        <Reveal>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="fs-label flex items-center gap-2 text-[var(--color-accent)]">
  <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-current" />
  <span>{t('label')}</span>
</p>
              <h2
                id="impact-title"
                className="font-heading mt-4 text-4xl font-bold leading-tight text-[var(--fs-paper)] sm:text-5xl md:text-[3.5rem] rtl:leading-[1.3]"
              >
                {t('title')}
              </h2>
            </div>

            <p className="max-w-sm font-mono text-xs leading-relaxed text-[var(--fs-paper)]/65">
              {t('note')}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          {/* Lead number set on a photograph */}
          {lead && (
            <div className="lg:col-span-6">
              <Reveal>
              <PhotoSlot
                id="impactGroup"
                tone="moss"
                alt={tp('impactGroup.alt')}
                brief={tp('impactGroup.brief')}
                briefPlacement="top-start"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[6/7]"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-[#0c1a28]/70 via-transparent to-transparent"
                />
                <div className="absolute inset-x-6 bottom-6 z-10 sm:inset-x-8 sm:bottom-8">
                  <p className="font-heading text-[clamp(5.5rem,16vw,12rem)] font-bold leading-[0.95] text-[var(--fs-paper)]">
                    {lead.number}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--fs-paper)] sm:text-xl">
                    {lead.label}
                  </p>
                </div>
              </PhotoSlot>
              </Reveal>
            </div>
          )}

          {/* The rest as an editorial ledger */}
          <ul className="flex flex-col lg:col-span-6">
            {rest.map((stat, i) => (
              <li
                key={stat.number + stat.label}
                className="relative flex flex-1 items-start justify-between gap-6 border-t border-white/15 py-8 last:border-b"
              >
                <Reveal delay={i * 90}>
                  <p className="font-heading text-6xl font-bold leading-none text-[var(--color-accent)] sm:text-7xl lg:text-[5.5rem]">
                    {stat.number}
                  </p>
                  <p className="mt-4 max-w-xs text-base leading-relaxed text-[var(--fs-paper)]/90 sm:text-lg">
                    {stat.label}
                  </p>
                </Reveal>

                {i === 0 && (
                  <PhotoSlot
                    id="impactTrainers"
                    tone="slate"
                    alt={tp('impactTrainers.alt')}
                    brief={tp('impactTrainers.brief')}
                    sizes="(min-width: 1024px) 14vw, 30vw"
                    className="aspect-[4/3] w-[38%] shrink-0 sm:w-48"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
