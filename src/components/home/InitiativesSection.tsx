import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {PhotoSlot} from '@/components/home/PhotoSlot';
import {Arrow, PinIcon, SectionLabel, TextLink} from '@/components/home/ui';

interface InitiativeSummary {
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: string;
  location: string;
  /** Optional cover image from the API. Falls back to the designed slot. */
  imageUrl?: string | null;
}

interface InitiativesSectionProps {
  locale: string;
  featured: InitiativeSummary;
  featuredIsQudra: boolean;
  restInitiatives: InitiativeSummary[];
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function InitiativesSection({
  locale,
  featured,
  featuredIsQudra,
  restInitiatives,
}: InitiativesSectionProps) {
  const t = await getTranslations('HomePage.initiatives');
  const tp = await getTranslations('HomePage.photos');

  const isArabic = locale === 'ar';

  const getTitle = (initiative: InitiativeSummary) =>
    isArabic ? initiative.titleAr : initiative.titleEn;

  const getDescription = (initiative: InitiativeSummary) =>
    isArabic ? initiative.descriptionAr : initiative.descriptionEn;

  return (
    <section id="initiatives" className="bg-[var(--fs-paper-2)] py-24 md:py-36" aria-labelledby="initiatives-title">
      <div className={CONTAINER}>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>{t('label')}</SectionLabel>

              <h2
                id="initiatives-title"
                className="font-heading mt-6 text-4xl font-bold leading-[1.05] text-[var(--color-navy)] md:text-6xl rtl:leading-[1.3]"
              >
                {t('title')}
              </h2>
            </div>

            <TextLink href={`/${locale}/initiatives`}>
              {t('viewAll')}
              <Arrow />
            </TextLink>
          </div>
        </Reveal>
      </div>

      {/* Featured initiative: photo bleeding off the end edge, navy panel laid over it */}
      <Reveal delay={100}>
        <div className="relative mt-12 md:mt-16 lg:min-h-[37rem]">
          <PhotoSlot
            id="initiativeFeatured"
            src={featured.imageUrl}
            tone={featuredIsQudra ? 'slate' : 'forest'}
            alt={tp('initiativeFeatured.alt')}
            brief={tp('initiativeFeatured.brief')}
            briefPlacement="top-end"
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="ms-5 aspect-[4/3] sm:ms-8 lg:absolute lg:inset-y-0 lg:end-0 lg:ms-0 lg:aspect-auto lg:w-[62%]"
          />

          <div className={`${CONTAINER} relative z-10 -mt-20 lg:mt-0 lg:pt-16`}>
            <Link
              href={`/${locale}/initiatives/${featured.slug}`}
              className="group flex flex-col justify-between gap-12 bg-[var(--color-navy)] p-7 text-white shadow-[0_40px_80px_rgba(12,26,40,0.25)] sm:p-10 lg:min-h-[29rem] lg:w-[48%] lg:p-12"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="fs-label inline-flex items-center gap-2 text-[var(--color-accent)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping bg-[var(--color-growth)] opacity-60 motion-reduce:hidden" />
                    <span className="relative h-2 w-2 bg-[var(--color-growth)]" />
                  </span>
                  {featured.status}
                </span>

                <span className="inline-flex items-center gap-1.5 text-sm text-[var(--fs-on-navy)]">
                  <PinIcon />
                  {featured.location}
                </span>
              </div>

              <div>
                <h3 className="font-heading text-balance text-3xl font-bold leading-tight sm:text-[2.9rem] rtl:leading-[1.3]">
                  {getTitle(featured)}
                </h3>

                <p className="mt-4 max-w-md leading-relaxed text-[var(--fs-on-navy)]">
                  {getDescription(featured)}
                </p>

                <span className="mt-7 inline-flex items-center gap-3 font-semibold text-[var(--color-accent)]">
                  {t('openInitiative')}
                  <Arrow className="transition-transform group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </Reveal>

      {restInitiatives.length > 0 && (
        <div className={CONTAINER}>
          <ul className="mt-16 border-t-2 border-[var(--color-navy)] lg:mt-20">
            {restInitiatives.map((initiative, i) => (
              <li key={initiative.slug} className="border-b border-[var(--color-line)]">
                <Link
                  href={`/${locale}/initiatives/${initiative.slug}`}
                  className="group grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-5 gap-y-1 py-4 transition-colors hover:bg-white sm:grid-cols-[6rem_minmax(0,1fr)] md:grid-cols-[6rem_minmax(0,4fr)_minmax(0,5fr)_minmax(0,3fr)] md:gap-x-7"
                >
                  <PhotoSlot
                    src={initiative.imageUrl}
                    tone={i % 2 === 0 ? 'growth' : 'mist'}
                    alt=""
                    sizes="96px"
                    className="row-span-2 aspect-[3/2] w-full md:row-span-1"
                  />

                  <h3 className="font-heading text-xl font-bold text-[var(--color-navy)] transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    {getTitle(initiative)}
                  </h3>

                  <p className="line-clamp-2 text-sm text-[var(--color-ink)]/75">
                    {getDescription(initiative)}
                  </p>

                  <p className="fs-label hidden text-[var(--fs-muted)] md:block md:text-end">
                    {initiative.location} · {initiative.status}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
