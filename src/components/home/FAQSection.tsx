import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';

interface FAQSectionProps {
  locale?: string;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function FAQSection({
  locale = 'ar',
}: FAQSectionProps) {
  const t = await getTranslations('HomePage.faq');

  const faqs = [
    {
      q: t('items.0.question'),
      a: t('items.0.answer'),
      isOpen: false,
    },
    {
      q: t('items.1.question'),
      a: t('items.1.answer'),
      isOpen: false,
    },
    {
      q: t('items.2.question'),
      a: t('items.2.answer'),
      isOpen: false,
    },
    {
      q: t('items.3.question'),
      a: t('items.3.answer'),
      isOpen: true,
    },
  ];

  return (
    <section className="relative bg-[var(--color-bg)] py-24 text-[var(--color-navy)]">
      <div className={CONTAINER}>
        <Reveal>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            {/* FAQ List */}
            <div className="space-y-4 lg:col-span-8">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border border-[var(--color-line)] bg-white/50 p-6 backdrop-blur-sm transition-all ${
                    faq.isOpen
                      ? 'border-[var(--color-accent)] shadow-sm'
                      : ''
                  }`}
                >
                  <div className="flex cursor-pointer items-center justify-between">
                    <h3 className="font-heading text-base font-bold text-[var(--color-navy)] sm:text-lg">
                      {faq.q}
                    </h3>

                    <span className="font-mono text-lg font-bold text-[var(--color-accent)]">
                      {faq.isOpen ? '−' : '+'}
                    </span>
                  </div>

                  {faq.isOpen && (
                    <p className="mt-4 border-t border-[var(--color-line)] pt-4 text-sm leading-relaxed text-[var(--color-ink)]">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Section Heading */}
            <div
              className={`flex flex-col lg:col-span-4 ${
                locale === 'ar'
                  ? 'lg:items-end lg:text-right'
                  : 'lg:items-start lg:text-left'
              }`}
            >
              <div className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
                {t('label')}
              </div>

              <h2 className="font-heading text-3xl font-extrabold text-[var(--color-navy)] sm:text-4xl md:text-5xl">
                {t('title')}
              </h2>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}