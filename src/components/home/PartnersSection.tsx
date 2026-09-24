import { getTranslations } from 'next-intl/server';

import { Reveal } from '@/components/Reveal';
import { SectionLabel } from '@/components/home/ui';

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

interface Partner {
  id: string;
  nameAr: string;
  nameEn: string;
  type: string;
}

async function getPartners(): Promise<Partner[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/partners`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function PartnersSection({ locale }: { locale: string }) {
  const t = await getTranslations('HomePage.partners');
  const partners = await getPartners();
  const isArabic = locale === 'ar';

  return (
    <section className="border-y border-[var(--color-line)] bg-[var(--color-bg)] py-20 md:py-24">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel>{t('label')}</SectionLabel>

              <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--color-ink)]/80 sm:text-lg">
                {t('description')}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={150}>
              {partners.length > 0 ? (
                <ul className="grid grid-cols-1 border-t-2 border-[var(--color-navy)] sm:grid-cols-2">
                  {partners.map((partner) => (
                    <li
                      key={partner.id}
                      className="group flex min-h-28 flex-col justify-between gap-4 border-b border-[var(--color-line)] py-5 transition-colors hover:bg-white sm:px-5 sm:even:border-s"
                    >
                      <span className="fs-label text-[var(--fs-sage-ink)]">{partner.type}</span>
                      <span className="font-heading text-lg font-bold text-[var(--color-navy)]">
                        {isArabic ? partner.nameAr : partner.nameEn}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="fs-label flex aspect-[4/3] flex-col items-center justify-center border border-dashed border-[var(--color-navy)]/30 text-[var(--color-navy)]/50 transition-colors hover:border-[var(--color-navy)]/60"
                    >
                      <span className="text-xs uppercase tracking-widest">Partner</span>
                      <span className="mt-1 font-mono text-sm font-bold">0{n}</span>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
