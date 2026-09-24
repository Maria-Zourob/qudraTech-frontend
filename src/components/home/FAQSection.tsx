import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {PhotoSlot} from '@/components/home/PhotoSlot';

interface FAQSectionProps {
  locale?: string;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function FAQSection({
  locale = 'ar',
}: FAQSectionProps) {
  const t = await getTranslations('HomePage.faq');
  const tp = await getTranslations('HomePage.photos');

  const faqs = [0, 1, 2, 3].map((i) => ({
    q: t(`items.${i}.question`),
    a: t(`items.${i}.answer`),
    isOpen: i === 3,
  }));

  return (
    <section
      lang={locale}
      className="relative bg-[var(--color-bg)] py-24 text-[var(--color-navy)] md:py-32"
      aria-labelledby="faq-title"
    >
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Heading + portrait */}
          <div className="lg:col-span-5 lg:self-center">
            <Reveal>
              <div>
                <p className="fs-label flex items-center gap-2 text-[var(--fs-sage-ink)]">
  <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-current" />
  <span>{t('label')}</span>
</p>

                <h2
                  id="faq-title"
                  className="font-heading mt-4 max-w-sm text-4xl font-bold leading-tight text-[var(--color-navy)] sm:text-5xl rtl:leading-[1.3]"
                >
                  {t('title')}
                </h2>

                <figure className="mt-10 hidden sm:block">
                  <PhotoSlot
                    id="faqParents"
                    tone="growth"
                    alt={tp('faqParents.alt')}
                    brief={tp('faqParents.brief')}
                    sizes="(min-width: 1024px) 34vw, 60vw"
                    className="aspect-[5/4] w-full max-w-md lg:aspect-[20/21]"
                  />

                  <figcaption className="fs-label mt-3 text-[var(--fs-muted)]">
                    {tp('faqParents.caption')}
                  </figcaption>
                </figure>
              </div>
            </Reveal>
          </div>

          {/* Questions */}
          <div className="lg:col-span-7 lg:self-center">
            <Reveal delay={100}>
              <div className="border-t-2 border-[var(--color-navy)]">
                {faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    name="home-faq"
                    open={faq.isOpen}
                    className="fs-faq group border-b border-[var(--color-line)]"
                  >
                    <summary className="flex min-h-[4.5rem] cursor-pointer items-center justify-between gap-6 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]">
                      <h3 className="font-heading text-lg font-bold text-[var(--color-navy)] sm:text-xl">
                        {faq.q}
                      </h3>

                      <span
                        aria-hidden
                        className="relative h-4 w-4 shrink-0 text-[var(--color-growth)]"
                      >
                        <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current" />

                        <span className="absolute inset-y-0 start-1/2 w-0.5 -translate-x-1/2 bg-current transition-transform duration-200 group-open:scale-y-0 rtl:translate-x-1/2 motion-reduce:transition-none" />
                      </span>
                    </summary>

                    <p className="max-w-2xl pb-7 text-base leading-relaxed text-[var(--color-ink)]/85">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
