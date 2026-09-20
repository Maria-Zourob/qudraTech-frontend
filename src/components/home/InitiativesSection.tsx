import Link from 'next/link';
import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {PromptTerminal} from '@/components/home/PromptTerminal';
import {
  Arrow,
  PinIcon,
  SectionLabel,
  TextLink,
} from '@/components/home/ui';

interface InitiativeSummary {
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: string;
  location: string;
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

  const isArabic = locale === 'ar';

  const getTitle = (initiative: InitiativeSummary) =>
    isArabic ? initiative.titleAr : initiative.titleEn;

  const getDescription = (initiative: InitiativeSummary) =>
    isArabic
      ? initiative.descriptionAr
      : initiative.descriptionEn;

  return (
    <section className="bg-[var(--fs-paper-2)]">
      <div className={`${CONTAINER} py-24 md:py-36`}>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel index="03">
                {t('label')}
              </SectionLabel>

              <h2 className="font-heading mt-6 text-4xl font-bold leading-[1.05] text-[var(--color-navy)] md:text-6xl rtl:leading-[1.3]">
                {t('title')}
              </h2>
            </div>

            <TextLink href={`/${locale}/initiatives`}>
              {t('viewAll')}
              <Arrow />
            </TextLink>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-12 lg:gap-0">
            <Link
              href={`/${locale}/initiatives/${featured.slug}`}
              className={`group relative flex flex-col justify-between bg-[var(--color-navy)] p-7 text-white sm:p-10 ${
                featuredIsQudra
                  ? 'lg:col-span-7 lg:min-h-[26rem] lg:pe-24'
                  : 'lg:col-span-12'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="fs-label inline-flex items-center gap-2 text-[var(--color-growth)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping bg-[var(--color-growth)] opacity-60" />
                    <span className="relative h-2 w-2 bg-[var(--color-growth)]" />
                  </span>

                  {featured.status}
                </span>

                <span className="inline-flex items-center gap-1.5 text-sm text-[#B9C5D0]">
                  <PinIcon />
                  {featured.location}
                </span>
              </div>

              <div className="mt-16">
                <h3 className="font-heading text-balance text-3xl font-bold leading-tight sm:text-5xl rtl:leading-[1.3]">
                  {getTitle(featured)}
                </h3>

                <p className="mt-5 max-w-md leading-relaxed text-[#B9C5D0]">
                  {getDescription(featured)}
                </p>

                <span className="mt-8 inline-flex items-center gap-3 font-medium text-[var(--color-accent)]">
                  {t('openInitiative')}

                  <Arrow className="transition-transform group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5" />
                </span>
              </div>
            </Link>

            {featuredIsQudra && (
              <div className="lg:col-span-5 lg:-ms-16 lg:mt-24">
                <PromptTerminal />
              </div>
            )}
          </div>
        </Reveal>

        {restInitiatives.length > 0 && (
          <ul className="mt-12 border-t border-[var(--color-navy)]">
            {restInitiatives.map((initiative) => (
              <li
                key={initiative.slug}
                className="border-b border-[var(--color-line)]"
              >
                <Link
                  href={`/${locale}/initiatives/${initiative.slug}`}
                  className="group grid items-baseline gap-2 py-6 transition-colors hover:bg-white md:grid-cols-12 md:gap-6"
                >
                  <h3 className="font-heading text-xl font-bold text-[var(--color-navy)] transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 md:col-span-4">
                    {getTitle(initiative)}
                  </h3>

                  <p className="text-sm text-[var(--color-ink)]/75 md:col-span-5">
                    {getDescription(initiative)}
                  </p>

                  <p className="fs-label text-[var(--color-ink)]/60 md:col-span-3 md:text-end">
                    {initiative.location} · {initiative.status}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}