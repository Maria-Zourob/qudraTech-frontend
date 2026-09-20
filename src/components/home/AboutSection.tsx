import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {SectionLabel} from '@/components/home/ui';

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function AboutSection() {
  const t = await getTranslations('HomePage.about');

  const auditChips = t.raw('auditChips') as string[];

  return (
    <section
      className={`${CONTAINER} grid gap-10 py-24 md:grid-cols-12 md:gap-8 md:py-36`}
    >
      <Reveal>
        <div className="md:col-span-4">
          <SectionLabel index="01">
            {t('label')}
          </SectionLabel>
        </div>
      </Reveal>

      <div className="md:col-span-8">
        <Reveal>
          <h2 className="font-heading text-balance text-4xl font-bold leading-[1.05] text-[var(--color-navy)] md:text-6xl rtl:leading-[1.3]">
            {t('title')}
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/85 md:text-xl">
            {t('description')}
          </p>
        </Reveal>

        <Reveal delay={180}>
          <ul className="mt-10 grid max-w-2xl border-t border-[var(--color-line)] sm:grid-cols-3">
            {auditChips.map((chip, i) => (
              <li
                key={chip}
                className={`flex items-start gap-3 border-b border-[var(--color-line)] py-4 text-sm font-medium text-[var(--color-navy)] sm:border-b-0 sm:pe-4 ${
                  i > 0 ? 'sm:border-s sm:ps-4' : ''
                }`}
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-2 w-2 shrink-0 bg-[var(--color-growth)]"
                />

                {chip}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}