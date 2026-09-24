import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {PhotoSlot} from '@/components/home/PhotoSlot';

interface ChildLearningProps {
  locale: string;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export default async function ChildLearning({locale}: ChildLearningProps) {
  const t = await getTranslations('HomePage.ChildLearning');
  const tp = await getTranslations('HomePage.photos');

  return (
    <section className="relative" aria-labelledby="child-learning-title">
      {/* ============ Cinematic full-bleed moment ============ */}
      <div className="relative isolate flex min-h-[36rem] flex-col md:min-h-[42rem] lg:min-h-[47.5rem]">
        <PhotoSlot
          id="learningClass"
          tone="night"
          alt={tp('learningClass.alt')}
          brief={tp('learningClass.brief')}
          briefPlacement="top-end"
          sizes="100vw"
          className="absolute inset-0 -z-10"
        />

        {/* legibility scrim: bottom on small screens, start side on desktop */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-t from-[#0c1a28]/95 via-[#0c1a28]/55 to-transparent lg:bg-linear-to-r lg:via-[#0c1a28]/45 rtl:lg:bg-linear-to-l"
        />

        <div
          className={`${CONTAINER} flex flex-1 flex-col justify-end pb-36 pt-28 sm:pb-40 lg:justify-center lg:pb-28`}
        >
          <div className="max-w-xl text-white lg:max-w-2xl">
            <Reveal>
  <p className="fs-label flex flex-wrap items-center gap-2 text-[var(--color-accent)]">
    <span
      aria-hidden
      className="h-1.5 w-1.5 shrink-0 bg-current"
    />

    <span>{t('eyebrow.gaza')}</span>
    <span aria-hidden>·</span>
    <span>{t('eyebrow.qudratech')}</span>
    <span aria-hidden>·</span>
    <span>{t('eyebrow.year')}</span>
  </p>
</Reveal>

            <Reveal delay={100}>
              <h2
                id="child-learning-title"
                className="font-heading mt-5 text-balance text-4xl font-bold leading-[1.15] text-[var(--fs-paper)] sm:text-5xl lg:text-[4.3rem] rtl:leading-[1.25]"
              >
                {t('title')}
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--fs-paper)]/85 sm:text-lg">
                {t('description')}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={`/${locale}/journey`}
                  className="bg-[var(--color-accent)] px-6 py-3.5 font-bold text-[var(--color-navy)] transition-colors hover:bg-[var(--fs-paper)]"
                >
                  {t('buttons.journey')}
                </Link>

                <Link
                  href={`/${locale}/support`}
                  className="border border-[var(--fs-paper)]/50 px-6 py-3.5 font-semibold text-[var(--fs-paper)] transition-colors hover:border-[var(--fs-paper)] hover:bg-[var(--fs-paper)]/10"
                >
                  {t('buttons.support')}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ============ Prompt panel breaking out of the photo + live stats ============ */}
      <div
        className={`${CONTAINER} relative z-10 flex flex-col gap-12 pb-20 md:pb-28 lg:flex-row lg:items-start lg:justify-between lg:gap-16`}
      >
        {/* Stats (start side, below the photo) */}
        <dl className="order-2 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-0 lg:order-1 lg:mt-12 lg:w-[52%]">
          <div className="sm:pe-6">
            <Reveal delay={100}>
              <dt className="fs-label text-[var(--fs-muted)]">
                {t('stats.status.label')}
              </dt>

              <dd className="mt-3 flex items-center gap-2.5 text-lg font-bold text-[var(--fs-sage-ink)]">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 animate-pulse bg-[var(--color-growth)] motion-reduce:animate-none"
                />
                {t('stats.status.value')}
              </dd>

              <dd className="mt-2 text-sm text-[var(--fs-muted)]">
                {t('stats.status.description')}
              </dd>
            </Reveal>
          </div>

          <div className="sm:border-s sm:border-[var(--color-line)] sm:px-6">
            <Reveal delay={220}>
              <dt className="fs-label text-[var(--fs-muted)]">
                {t('stats.session.label')}
              </dt>

              <dd className="font-heading mt-2 text-4xl font-bold leading-none text-[var(--color-navy)] sm:text-[2.75rem]">
                {t('stats.session.value')}{' '}
                <span className="[font-family:var(--font-body)] text-base font-medium text-[var(--fs-sage-ink)]">
                  {t('stats.session.unit')}
                </span>
              </dd>

              <dd className="mt-2 text-sm text-[var(--fs-muted)]">
                {t('stats.session.description')}
              </dd>
            </Reveal>
          </div>

          <div className="sm:border-s sm:border-[var(--color-line)] sm:ps-6">
            <Reveal delay={340}>
              <dt className="fs-label text-[var(--fs-muted)]">
                {t('stats.enrolled.label')}
              </dt>

              <dd className="font-heading mt-2 text-4xl font-bold leading-none text-[var(--color-navy)] sm:text-[2.75rem]">
                {t('stats.enrolled.value')}
              </dd>

              <dd className="mt-2 text-sm text-[var(--fs-muted)]">
                {t('stats.enrolled.description')}
              </dd>
            </Reveal>
          </div>
        </dl>

        {/* Prompt flow — lifts into the photo */}
        <figure className="order-1 -mt-24 border border-[var(--color-navy)] bg-white shadow-[10px_10px_0_var(--color-accent)] sm:-mt-28 lg:order-2 lg:-mt-60 lg:w-[40%] rtl:shadow-[-10px_10px_0_var(--color-accent)]">
          <Reveal delay={180}>
            <div className="flex items-center justify-between gap-4 border-b border-[var(--color-line)] px-5 py-3 sm:px-6">
              <span className="fs-label text-[var(--color-navy)]">
                {t('promptFlow')}
              </span>

              <span className="fs-label text-[var(--fs-muted)]">
                {t('eyebrow.gaza')}
              </span>
            </div>
          </Reveal>

          <div className="space-y-5 px-5 py-6 sm:px-6">
            <Reveal delay={300}>
              <div>
                <p className="fs-label text-[var(--fs-sage-ink)]">
                  {t('prompt.label')}
                </p>

                <p className="font-heading mt-2 text-lg leading-snug text-[var(--color-navy)] sm:text-xl">
                  {t('prompt.text')}
                  <span aria-hidden className="fs-caret ms-1" />
                </p>
              </div>
            </Reveal>

            <Reveal delay={420}>
              <div className="flex items-center justify-between border border-dashed border-[var(--color-navy)]/25 px-3 py-2.5">
                <span className="font-mono text-xs text-[var(--fs-muted)]">
                  {t('reasoning')}
                </span>

                <span aria-hidden className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping bg-[var(--color-accent)] opacity-70 motion-reduce:hidden" />
                  <span className="relative h-2 w-2 bg-[var(--color-growth)]" />
                </span>
              </div>
            </Reveal>

            <Reveal delay={540}>
              <div className="border-s-2 border-[var(--color-growth)] ps-4">
                <p className="fs-label text-[var(--fs-sage-ink)]">
                  {t('output.label')}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]/85 sm:text-base">
                  {t('output.text')}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={660}>
            <figcaption className="border-t border-[var(--color-line)] px-5 py-3 font-mono text-xs text-[var(--fs-muted)] sm:px-6">
              {t('promptNote')}
            </figcaption>
          </Reveal>
        </figure>
      </div>
    </section>
  );
}