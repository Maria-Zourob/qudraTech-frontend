import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {MountReveal} from '@/components/MountReveal';
import {Counter} from '@/components/Counter';
import {HeroStairs} from '@/components/home/HeroStairs';
import {PrimaryButton, TextLink} from '@/components/home/ui';

interface Stat {
  value: number;
  label: string;
}

interface HeroSectionProps {
  locale: string;
  stats: Stat[];
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function HeroSection({
  locale,
  stats,
}: HeroSectionProps) {
  const t = await getTranslations('HomePage.hero');

  return (
    <section className="relative">
      <div
        aria-hidden
        className="fs-grid-bg pointer-events-none absolute inset-0"
      />

      <div
        className={`${CONTAINER} relative grid items-end gap-10 pb-10 pt-12 md:pt-20 lg:grid-cols-12 lg:gap-6 lg:pb-16`}
      >
        <div className="lg:col-span-7">
          <MountReveal>
            <p className="fs-label mb-8 text-[var(--fs-accent-ink)]">
              {t('eyebrow')}
            </p>
          </MountReveal>

          <MountReveal delay={90}>
            <h1 className="font-heading text-balance text-[clamp(3.5rem,11vw,8rem)] font-bold leading-[0.92] tracking-tight text-[var(--color-navy)] rtl:leading-[1.15] rtl:tracking-normal">
              {t('title')}
            </h1>
          </MountReveal>

          <MountReveal delay={180}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-ink)]/85 md:text-xl">
              {t('subtitle')}
            </p>
          </MountReveal>

          <MountReveal delay={270}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <PrimaryButton href={`/${locale}/initiatives`}>
                {t('exploreInitiatives')}
              </PrimaryButton>

              <TextLink href={`/${locale}/about`}>
                {t('aboutUs')}
              </TextLink>
            </div>
          </MountReveal>
        </div>

        <div className="order-first lg:order-none lg:col-span-5">
          <HeroStairs />
        </div>
      </div>

      {stats.length > 0 && (
        <div className={`${CONTAINER} relative`}>
          <div className="grid grid-cols-2 border-t-2 border-[var(--color-navy)] md:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 90}>
                <div
                  className={`h-full py-6 md:py-9 ${
                    i % 2 === 1 ? 'ps-5' : ''
                  } ${
                    i > 0
                      ? 'md:border-s md:border-[var(--color-line)] md:ps-7'
                      : ''
                  }`}
                >
                  <p className="font-heading text-5xl font-bold leading-none text-[var(--color-navy)] md:text-6xl">
                    <Counter value={stat.value} />
                  </p>

                  <p className="fs-label mt-3 text-[var(--color-ink)]/70">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}