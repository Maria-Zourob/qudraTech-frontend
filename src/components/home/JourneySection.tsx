import {getLocale, getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {PhotoSlot, type PhotoTone} from '@/components/home/PhotoSlot';
import {formatCode} from '@/components/home/format';

interface JourneyCard {
  eyebrow: string;
  title: string;
  description: string;
}

interface JourneyPhase {
  week: string;
  title: string;
  description: string;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

const PHASE_PHOTOS = [
  {id: 'phase1', tone: 'mist', height: 'lg:h-[56%]'},
  {id: 'phase2', tone: 'growth', height: 'lg:h-[71%]'},
  {id: 'phase3', tone: 'slate', height: 'lg:h-[86%]'},
  {id: 'phase4', tone: 'navy', height: 'lg:h-full'}
] as const satisfies readonly {id: string; tone: PhotoTone; height: string}[];

export async function JourneySection() {
  const locale = await getLocale();
  const t = await getTranslations('HomePage.journey');
  const tp = await getTranslations('HomePage.photos');

  const cards = t.raw('cards') as JourneyCard[];
  const phases = t.raw('phases') as JourneyPhase[];

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-navy)]">
      {/* =====================================================
          01 — WHAT IT IS: نصّ + صورة، الاثنين جوا نفس الحاوية
      ====================================================== */}
      <section className="py-20 md:py-28 lg:py-32" aria-labelledby="journey-intro-title">
        <div className={CONTAINER}>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* النص */}
            <Reveal>
              <div>
                <p className="fs-label flex items-center gap-2 text-[var(--fs-sage-ink)]">
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-current" />
                  <span>{t('intro.label')}</span>
                </p>

                <h2
                  id="journey-intro-title"
                  className="font-heading mt-5 text-4xl font-bold leading-[1.1] text-[var(--color-navy)] sm:text-5xl rtl:leading-[1.3]"
                >
                  {t('intro.title')}
                </h2>

                <p className="mt-7 text-base leading-8 text-[var(--color-ink)]/80 sm:text-lg">
                  {t('intro.description')}
                </p>

                <ol className="mt-10 border-t-2 border-[var(--color-navy)]">
                  {cards.map((card, index) => (
                    <li key={card.title} className="flex gap-5 border-b border-[var(--color-line)] py-5">
                      <span className="fs-label pt-1.5 text-[var(--color-growth)]">
                        {formatCode(String(index + 1), locale)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="fs-label text-[var(--fs-muted)]">{card.eyebrow}</p>
                        <h3 className="font-heading mt-2 text-xl font-bold text-[var(--color-navy)]">
                          {card.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-[var(--fs-muted)]">
                          {card.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            {/* الصورة — جوا الحاوية، بلا كسر للحافة */}
            <Reveal delay={120}>
              <div className="relative">
                <PhotoSlot
                  id="manifestoHands"
                  tone="forest"
                  alt={tp('manifestoHands.alt')}
                  brief={tp('manifestoHands.brief')}
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="aspect-[4/3] w-full lg:aspect-[4/5]"
                />

                <figure className="absolute -bottom-8 -start-6 w-[46%] sm:-bottom-10 sm:-start-8">
                  <div className="bg-[var(--color-bg)] p-2 shadow-[0_18px_44px_rgba(25,50,74,0.18)]">
                    <PhotoSlot
                      id="manifestoTrainer"
                      tone="navy"
                      alt={tp('manifestoTrainer.alt')}
                      brief={tp('manifestoTrainer.brief')}
                      sizes="(min-width: 1024px) 20vw, 44vw"
                      className="aspect-[4/5] w-full"
                    />
                  </div>
                  <figcaption className="fs-label mt-3 hidden text-[var(--fs-muted)] sm:block">
                    {tp('manifestoTrainer.caption')}
                  </figcaption>
                </figure>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================
          02 — LEARNING JOURNEY: شريط مراحل متدرّج
      ====================================================== */}
      <section id="about" className="pb-24 pt-16 md:pb-32 lg:pt-8" aria-labelledby="journey-phases-title">
        <div className={CONTAINER}>
          <Reveal>
            <p className="fs-label flex items-center gap-2 text-[var(--fs-sage-ink)]">
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-current" />
              <span>{t('journey.label')}</span>
            </p>
            <h2
              id="journey-phases-title"
              className="font-heading mt-5 max-w-3xl text-4xl font-bold leading-[1.1] text-[var(--color-navy)] sm:text-5xl lg:text-[3.6rem] rtl:leading-[1.3]"
            >
              {t('journey.title')}
            </h2>
          </Reveal>

          <ol className="mt-12 grid gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:mt-16 lg:grid-cols-4 lg:gap-x-8">
            {phases.map((phase, index) => {
              const photo = PHASE_PHOTOS[index % PHASE_PHOTOS.length];

              return (
                <li key={phase.week} className="group flex flex-col">
                  <Reveal delay={index * 110}>
                    <div className="lg:flex lg:h-[28rem] lg:items-end">
                      <PhotoSlot
                        id={photo.id}
                        tone={photo.tone}
                        alt={tp(`${photo.id}.alt`)}
                        brief={tp(`${photo.id}.brief`)}
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw"
                        className={`aspect-[4/3] w-full lg:aspect-auto ${photo.height}`}
                      />
                    </div>

                    <div className="relative mt-5 border-t-2 border-[var(--color-navy)] pt-5 lg:mt-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="flex items-baseline gap-3">
                          <span className="font-heading text-4xl font-bold leading-none text-transparent [-webkit-text-stroke:1.4px_var(--color-navy)]">
                            {formatCode(String(index + 1), locale)}
                          </span>
                          <h3 className="font-heading text-2xl font-bold text-[var(--color-navy)]">
                            {phase.title}
                          </h3>
                        </div>
                        <span className="fs-label text-[var(--fs-sage-ink)]">{phase.week}</span>
                      </div>

                      <p className="mt-3 text-sm leading-7 text-[var(--fs-muted)]">
                        {phase.description}
                      </p>

                      <span
                        aria-hidden
                        className="absolute -top-0.5 start-0 h-0.5 w-0 bg-[var(--color-growth)] transition-all duration-300 group-hover:w-full motion-reduce:transition-none"
                      />
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}