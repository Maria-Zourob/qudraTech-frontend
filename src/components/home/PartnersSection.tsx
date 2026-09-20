import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {SectionLabel} from '@/components/home/ui';

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function PartnersSection() {
  const t = await getTranslations('HomePage.partners');

  return (
    <section className="border-y border-[var(--color-line)] bg-[var(--fs-paper-2)]">
      <div
        className={`${CONTAINER} grid items-center gap-10 py-16 md:grid-cols-12 md:py-20`}
      >
        <Reveal>
          <div className="md:col-span-6">
            <SectionLabel index="05">
              {t('label')}
            </SectionLabel>

            <p className="mt-6 max-w-md leading-relaxed text-[var(--color-ink)]/80">
              {t('description')}
            </p>
          </div>
        </Reveal>

        <div
          aria-hidden
          className="grid grid-cols-4 gap-3 md:col-span-6"
        >
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="fs-label grid aspect-[4/5] place-items-center border border-dashed border-[var(--color-navy)]/30 text-[var(--color-navy)]/40 sm:aspect-square"
            >
              P-0{n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}