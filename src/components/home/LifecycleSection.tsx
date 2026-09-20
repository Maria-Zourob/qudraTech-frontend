import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {SectionLabel} from '@/components/home/ui';

interface LifecycleStep {
  code: string;
  title: string;
  text: string;
}

interface LifecycleSectionProps {
  lifecycle: LifecycleStep[];
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function LifecycleSection({
  lifecycle,
}: LifecycleSectionProps) {
  const t = await getTranslations('HomePage.lifecycle');

  const stairOffsets = [
    'md:mt-48',
    'md:mt-32',
    'md:mt-16',
    'md:mt-0',
  ];

  return (
    <section className="fs-grid-navy relative bg-[var(--color-navy)] text-white">
      <div className={`${CONTAINER} py-20 md:pb-0 md:pt-28`}>
        <Reveal>
          <SectionLabel index="02" onDark>
            {t('label')}
          </SectionLabel>

          <h2 className="font-heading mt-6 max-w-2xl text-balance text-3xl font-bold leading-tight md:text-5xl rtl:leading-[1.3]">
            {t('title')}
          </h2>
        </Reveal>

        <ol className="mt-14 grid md:mt-16 md:grid-cols-4 md:items-start md:gap-6">
          {lifecycle.map((step, i) => (
            <li
              key={step.code}
              className={`relative border-s border-white/20 pb-12 ps-7 last:pb-0 md:border-s-0 md:border-t-2 md:border-t-[var(--color-accent)] md:bg-white/[0.04] md:px-6 md:pb-14 md:pt-6 ${stairOffsets[i]}`}
            >
              <span
                aria-hidden
                className="absolute -start-[5.5px] top-1.5 h-2.5 w-2.5 bg-[var(--color-accent)] md:hidden"
              />

              <p className="fs-outline-num font-heading text-5xl font-bold leading-none md:text-6xl">
                {step.code}
              </p>

              <h3 className="font-heading mt-6 text-xl font-bold">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#B9C5D0]">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}