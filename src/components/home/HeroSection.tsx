import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {MountReveal} from '@/components/MountReveal';
import {Counter} from '@/components/Counter';
import {PhotoStairs} from '@/components/home/PhotoStairs';
import {PrimaryButton, TextLink} from '@/components/home/ui';
import {formatCode} from '@/components/home/format';

interface Stat {
  value: number;
  label: string;
}

interface LifecycleStep {
  code: string;
  title: string;
  text: string;
}

interface HeroSectionProps {
  locale: string;
  stats: Stat[];
  lifecycle: LifecycleStep[];
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

const STAIR_PHOTOS = [
  'heroDocumentation',
  'heroExecution',
  'heroMeasurement',
  'heroImpact',
] as const;

export async function HeroSection({
  locale,
  stats,
  lifecycle,
}: HeroSectionProps) {
  const t = await getTranslations('HomePage.hero');
  const tp = await getTranslations('HomePage.photos');

  const steps = lifecycle.slice(0, 4).map((step, i) => ({
    label: `${formatCode(step.code, locale)} ${step.title}`,
    alt: tp(`${STAIR_PHOTOS[i]}.alt`),
    brief: tp(`${STAIR_PHOTOS[i]}.brief`),
  }));

  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="home-hero-title"
    >
      <div className="relative lg:min-h-[47rem]">

        {/* Very subtle editorial background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(168,185,167,0.16),transparent_30%)]"
        />

        {/* Copy */}
        <div
          className={`${CONTAINER} relative z-10 pt-12 md:pt-16 lg:flex lg:h-[47rem] lg:items-center lg:pt-14`}
        >
          <div className="max-w-xl lg:w-[48%] lg:max-w-none">

            <MountReveal>
              <p className="fs-label flex items-center gap-2.5 text-[var(--fs-sage-ink)]">
                <span
                  aria-hidden
                  className="h-2 w-2 bg-[var(--color-growth)]"
                />
                {t('eyebrow')}
              </p>
            </MountReveal>

            <MountReveal delay={90}>
              <h1
                id="home-hero-title"
                className="font-heading mt-6 max-w-[10ch] text-balance text-[clamp(3.2rem,7vw,6.5rem)] font-bold leading-[0.96] tracking-tight text-[var(--color-navy)] rtl:max-w-[11ch] rtl:leading-[1.12] rtl:tracking-normal"
              >
                {t('title')}
              </h1>
            </MountReveal>

            <MountReveal delay={180}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-[var(--color-ink)]/80 md:text-xl md:leading-relaxed">
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
        </div>

        {/* Photo composition */}
        <div
          role="img"
          aria-label={t('visualLabel')}
          className="fs-inset-start relative mt-16 h-[20rem] sm:h-[27rem] lg:absolute lg:inset-y-0 lg:end-0 lg:mt-0 lg:h-auto lg:w-[59%] lg:ps-0 lg:pt-14"
        >
          <PhotoStairs
            steps={steps}
            tag="FS-2026-001"
          />
        </div>
      </div>

      {/* Editorial baseline */}
      <div
        aria-hidden
        className="fs-inset-start"
      >
        <div className="h-px bg-[var(--color-navy)]" />
      </div>

      {/* Stats — lightweight editorial strip */}
      {stats.length > 0 && (
  <div className={CONTAINER}>
    <div className="border-t border-[var(--color-line)]">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 90}>
            <div
              className={`relative flex items-baseline gap-3 py-7 md:py-8 ${
                i > 0
                  ? 'border-s border-[var(--color-line)] ps-5 md:ps-7'
                  : ''
              }`}
            >
              <span className="fs-label text-[var(--color-growth)]">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                <p className="font-heading text-3xl font-bold leading-none text-[var(--color-navy)] sm:text-4xl">
                  <Counter value={stat.value} />
                  <span className="text-[var(--color-growth)]">+</span>
                </p>

                <p className="text-sm font-semibold text-[var(--fs-muted)] sm:text-base">
                  {stat.label}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </div>
)}
    </section>
  );
}