import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';

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

export async function JourneySection() {
  const t = await getTranslations('HomePage.journey');

  const cards = t.raw('cards') as JourneyCard[];
  const phases = t.raw('phases') as JourneyPhase[];

  return (
    <div className="bg-[var(--color-bg)] py-20 text-[var(--color-navy)] md:py-28">
      <div className="space-y-28 md:space-y-40">

        {/* =====================================================
            SECTION 01 — WHAT IT IS
        ====================================================== */}
        <section>
          <div className={CONTAINER}>
            <Reveal>
              <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">

                {/* Content */}
                <div className="lg:col-span-6">
                  <div className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    {t('intro.label')}
                  </div>

                  <h2 className="font-heading max-w-2xl text-4xl font-extrabold leading-[1.08] text-[var(--color-navy)] sm:text-5xl md:text-6xl rtl:leading-[1.25]">
                    {t('intro.title')}
                  </h2>

                  <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--color-ink)]/80 sm:text-lg">
                    {t('intro.description')}
                  </p>
                </div>

                {/* Three cards */}
                <div className="lg:col-span-6">
                  <div className="grid overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white/60 backdrop-blur-sm sm:grid-cols-3">
                    {cards.map((card, index) => (
                      <div
                        key={card.title}
                        className={`flex min-h-[220px] flex-col justify-between p-6 sm:p-7 ${
                          index > 0
                            ? 'border-t border-[var(--color-line)] sm:border-s sm:border-t-0'
                            : ''
                        }`}
                      >
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                            {card.eyebrow}
                          </span>

                          <div className="mt-8 h-2 w-2 bg-[var(--color-accent)]" />

                          <h3 className="mt-5 font-heading text-lg font-bold text-[var(--color-navy)]">
                            {card.title}
                          </h3>
                        </div>

                        <p className="mt-6 text-sm leading-6 text-[var(--color-ink)]/75">
                          {card.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </Reveal>
          </div>
        </section>

        {/* =====================================================
            SECTION 02 — LEARNING JOURNEY
        ====================================================== */}
        <section>
          <div className={CONTAINER}>
            <Reveal>
              {/* Heading */}
              <div className="mb-12 max-w-2xl">
                <div className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {t('journey.label')}
                </div>

                <h2 className="font-heading text-4xl font-extrabold leading-[1.08] text-[var(--color-navy)] sm:text-5xl md:text-6xl rtl:leading-[1.25]">
                  {t('journey.title')}
                </h2>
              </div>

              {/* Timeline / phases */}
              <div className="border-y border-[var(--color-navy)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {phases.map((phase, index) => (
                    <div
                      key={phase.week}
                      className={`group relative flex min-h-[270px] flex-col justify-between p-6 sm:p-8 ${
                        index > 0
                          ? 'border-t border-[var(--color-line)] sm:border-s sm:border-t-0'
                          : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-accent)]">
                            {phase.week}
                          </span>

                          <span className="font-mono text-xs text-[var(--color-ink)]/30">
                            0{index + 1}
                          </span>
                        </div>

                        <h3 className="mt-10 font-heading text-2xl font-bold text-[var(--color-navy)]">
                          {phase.title}
                        </h3>
                      </div>

                      <p className="mt-8 text-sm leading-7 text-[var(--color-ink)]/75">
                        {phase.description}
                      </p>

                      {/* Bottom accent */}
                      <div className="absolute bottom-0 start-0 h-1 w-0 bg-[var(--color-accent)] transition-all duration-300 group-hover:w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </div>
    </div>
  );
}