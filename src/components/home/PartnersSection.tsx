import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {SectionLabel} from '@/components/home/ui';

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

interface Partner {
  id: string;
  nameAr: string;
  nameEn: string;
  type: string;
}

async function getPartners(): Promise<Partner[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/partners`, {cache: 'no-store'});
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function PartnersSection({locale}: {locale: string}) {
  const t = await getTranslations('HomePage.partners');
  const partners = await getPartners();
  const isArabic = locale === 'ar';

  return (
    <section className="border-y border-[var(--color-line)] bg-[var(--fs-paper-2)] py-20 md:py-28">
      <div className={`${CONTAINER}`}>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* قسم العنوان والنص (أخذ مساحة مريحة لكي لا يظهر النص بشكل طولي) */}
          <div className="lg:col-span-5">
            <Reveal>
              <div>
                <SectionLabel index="05">
                  {t('label')}
                </SectionLabel>

                <p className="mt-6 text-base leading-relaxed text-[var(--color-ink)]/80 sm:text-lg">
                  {t('description')}
                </p>
              </div>
            </Reveal>
          </div>

          {/* قسم بطاقات الشركاء */}
          <div className="lg:col-span-7">
            <Reveal delay={150}>
              {partners.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="group relative flex flex-col justify-between border border-[var(--color-line)] bg-white p-6 transition-all hover:border-[var(--color-accent)] hover:shadow-sm"
                    >
                      <span className="fs-label text-xs font-semibold tracking-wider text-[var(--color-accent)] mb-4 uppercase">
                        {partner.type}
                      </span>
                      <span className="text-base font-bold text-[var(--color-navy)]">
                        {isArabic ? partner.nameAr : partner.nameEn}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="fs-label flex aspect-square flex-col items-center justify-center border border-dashed border-[var(--color-navy)]/30 bg-white/50 text-[var(--color-navy)]/40 transition-colors hover:border-[var(--color-navy)]/60"
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