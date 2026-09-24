import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {SectionLabel, ValueIcon} from '@/components/home/ui';

interface Value {
  title: string;
  text: string;
  icon: 'transparency' | 'community' | 'impact';
}

interface ValuesSectionProps {
  values: Value[];
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function ValuesSection({
  values,
}: ValuesSectionProps) {
  const t = await getTranslations('HomePage.values');

  return (
    <section className={`${CONTAINER} py-24 md:py-36`}>
      <Reveal>
       <SectionLabel>
  {t('label')}
</SectionLabel>

        <h2 className="font-heading mt-6 max-w-xl text-4xl font-bold leading-[1.05] text-[var(--color-navy)] md:text-6xl rtl:leading-[1.3]">
          {t('title')}
        </h2>
      </Reveal>

      <ul className="mt-14 border-t-2 border-[var(--color-navy)] md:mt-20">
        {values.map((value, i) => (
          <Reveal key={value.title} delay={i * 100}>
            <li className="group grid items-start gap-x-8 gap-y-3 border-b border-[var(--color-line)] py-8 transition-colors hover:bg-[var(--fs-paper-2)] md:grid-cols-12 md:py-12">
              <span className="fs-label pt-2 text-[var(--fs-accent-ink)] md:col-span-1">
                0{i + 1}
              </span>

              <h3 className="font-heading text-2xl font-bold text-[var(--color-navy)] transition-transform duration-300 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 md:col-span-5 md:text-4xl">
                {value.title}
              </h3>

              <p className="max-w-md leading-relaxed text-[var(--color-ink)]/80 md:col-span-5">
                {value.text}
              </p>

              <span className="hidden justify-self-end transition-transform duration-300 group-hover:scale-110 md:col-span-1 md:block">
                <ValueIcon name={value.icon} />
              </span>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}