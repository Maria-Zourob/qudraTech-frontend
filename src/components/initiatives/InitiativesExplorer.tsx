'use client';

import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';

import {apiClient} from '@/lib/apiClient';
import {PhotoSlot, type PhotoTone} from '@/components/home/PhotoSlot';
import {Arrow, PinIcon, PrimaryButton, SectionLabel} from '@/components/home/ui';

export interface Initiative {
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: string;
  location: string;
  targetGroupAr?: string | null;
  targetGroupEn?: string | null;
  imageUrl?: string | null;
}

interface Kpi {
  nameAr: string;
  nameEn: string;
  baseline: number;
  target: number;
  actual: number;
  unit: string;
}

interface Risk {
  descriptionAr: string;
  descriptionEn: string;
  probability: string;
  impact: string;
  mitigation: string;
}

interface Partner {
  id?: string;
  nameAr: string;
  nameEn: string;
  type: string;
  website?: string | null;
}

interface GalleryImage {
  id: string;
  isCover: boolean;
  captionAr: string;
  captionEn: string;
  sortOrder: number;
}

interface Details {
  kpis: Kpi[];
  risks: Risk[];
  partners: Partner[];
  images: GalleryImage[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';
const TONES: PhotoTone[] = ['slate', 'forest', 'moss', 'growth', 'mist'];
const STATUSES = ['Draft', 'UnderReview', 'Approved', 'Planned', 'Active', 'OnHold', 'Completed', 'Archived'];
const LEVELS = ['Low', 'Medium', 'High'];
const PARTNER_TYPES = ['Partner', 'Donor', 'CommunityPartner'];

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
const pad = (n: number) => String(n).padStart(2, '0');
const imageUrl = (id: string) => `${API_URL}/public/images/${id}`;

function toList<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function progress(k: Kpi) {
  const range = k.target - k.baseline;
  const raw =
    range > 0 ? ((k.actual - k.baseline) / range) * 100 : k.target > 0 ? (k.actual / k.target) * 100 : 0;
  return Math.max(0, Math.min(100, raw));
}

function galleryCell(i: number, n: number) {
  if (n === 1) return {wrap: 'col-span-2 md:col-span-4', frame: 'aspect-[16/9] md:aspect-[21/9]'};
  if (n === 2) return {wrap: 'col-span-2', frame: 'aspect-[4/3]'};
  if (i === 0) return {wrap: 'col-span-2 md:row-span-2', frame: 'aspect-[16/10] md:aspect-auto md:h-full'};
  return {wrap: '', frame: 'aspect-[4/3] md:aspect-auto md:h-full'};
}

function SectionHeading({label, title, id}: {label: string; title: string; id: string}) {
  return (
    <div className="max-w-3xl">
      <SectionLabel>{label}</SectionLabel>
      <h2
        id={id}
        className="font-heading mt-5 text-3xl font-bold leading-[1.1] text-[var(--color-navy)] sm:text-4xl md:text-5xl rtl:leading-[1.3]"
      >
        {title}
      </h2>
    </div>
  );
}

function LevelMeter({title, level, valueLabel}: {title: string; level: string; valueLabel: string}) {
  const filled = ({Low: 1, Medium: 2, High: 3} as Record<string, number>)[level] ?? 0;
  return (
    <div>
      <p className="fs-label text-[var(--fs-muted)]">{title}</p>
      <div className="mt-2.5 flex items-center gap-3">
        <div className="flex gap-1" aria-hidden>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`h-2 w-6 ${n <= filled ? 'bg-[var(--color-navy)]' : 'bg-[var(--color-line)]'}`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-[var(--color-navy)]">{valueLabel}</span>
      </div>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <section className="py-20">
      <div className={CONTAINER}>
        <div className="h-4 w-32 animate-pulse bg-[var(--color-line)]" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 animate-pulse bg-[var(--color-line)]" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
  isArabic,
  labels
}: {
  items: {src: string; caption: string}[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
  isArabic: boolean;
  labels: {close: string; prev: string; next: string};
}) {
  const count = items.length;
  const go = (delta: number) => onNavigate((index + delta + count) % count);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(isArabic ? -1 : 1);
      if (e.key === 'ArrowLeft') go(isArabic ? 1 : -1);
    }
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  });

  const item = items[index];
  if (!item) return null;

  const navButton =
    'absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/25 bg-black/30 text-white backdrop-blur transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex flex-col bg-[#0c1a28]/95 text-white"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-5 py-4 sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="fs-label text-white/70">
          {pad(index + 1)} / {pad(count)}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className="grid h-10 w-10 place-items-center border border-white/25 text-lg transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          ✕
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-5 pb-8 sm:px-20">
        {count > 1 && (
          <button
            type="button"
            aria-label={labels.prev}
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className={`${navButton} start-3 sm:start-6`}
          >
            <Arrow className="rotate-180" />
          </button>
        )}

        <figure
          className="flex max-h-full max-w-full flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt={item.caption} className="max-h-[78vh] max-w-full object-contain" />
          {item.caption && (
            <figcaption className="mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/80">
              {item.caption}
            </figcaption>
          )}
        </figure>

        {count > 1 && (
          <button
            type="button"
            aria-label={labels.next}
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className={`${navButton} end-3 sm:end-6`}
          >
            <Arrow />
          </button>
        )}
      </div>
    </div>
  );
}

export function InitiativesExplorer({
  initiatives,
  initialSlug
}: {
  initiatives: Initiative[];
  initialSlug: string | null;
}) {
  const locale = useLocale();
  const t = useTranslations('InitiativesPage');
  const isArabic = locale === 'ar';

  const [selected, setSelected] = useState<string | null>(initialSlug);
  const [data, setData] = useState<Record<string, Details>>({});
  const [lightbox, setLightbox] = useState<number | null>(null);
  const requested = useRef(new Set<string>());
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (!selected || requested.current.has(selected)) return;
    requested.current.add(selected);

    const base = `/public/initiatives/${selected}`;
    Promise.all([
      apiClient.get<unknown>(`${base}/kpis`).catch(() => []),
      apiClient.get<unknown>(`${base}/risks`).catch(() => []),
      apiClient.get<unknown>(`${base}/partners`).catch(() => []),
      apiClient.get<unknown>(`${base}/images`).catch(() => [])
    ]).then(([kpis, risks, partners, images]) => {
      setData((prev) => ({
        ...prev,
        [selected]: {
          kpis: toList<Kpi>(kpis),
          risks: toList<Risk>(risks),
          partners: toList<Partner>(partners),
          images: toList<GalleryImage>(images)
        }
      }));
    });
  }, [selected]);

  function handleSelect(slug: string, fromStrip = false) {
    setSelected(slug);
    setLightbox(null);

    const url = new URL(window.location.href);
    url.searchParams.set('initiative', slug);
    window.history.replaceState(null, '', url.toString());

    if (fromStrip) {
      itemRefs.current[slug]?.scrollIntoView({behavior: 'smooth', inline: 'center', block: 'nearest'});
    }
  }

  const currentIndex = initiatives.findIndex((i) => i.slug === selected);
  const current = currentIndex >= 0 ? initiatives[currentIndex] : null;
  const details = current ? data[current.slug] : undefined;

  function step(delta: number) {
    if (initiatives.length < 2) return;
    const next = initiatives[(currentIndex + delta + initiatives.length) % initiatives.length];
    handleSelect(next.slug);
  }

  const pick = (ar: string, en: string) => (isArabic ? ar : en);
  const statusLabel = (s: string) => (STATUSES.includes(s) ? t(`status.${s}`) : s);
  const levelLabel = (v: string) => (LEVELS.includes(v) ? t(`level.${v}`) : v);
  const partnerTypeLabel = (v: string) => {
    const key = v.replace(/\s+/g, '');
    return PARTNER_TYPES.includes(key) ? t(`partnerType.${key}`) : v;
  };

  const gallery = details ? details.images.filter((i) => !i.isCover) : [];
  const lightboxItems = current
    ? gallery.map((img) => ({
        src: imageUrl(img.id),
        caption: pick(img.captionAr, img.captionEn) || pick(current.titleAr, current.titleEn)
      }))
    : [];

  const targetGroup = current ? pick(current.targetGroupAr ?? '', current.targetGroupEn ?? '') : '';
  const facts = current
    ? [
        {label: t('overview.status'), value: statusLabel(current.status)},
        {label: t('overview.location'), value: current.location},
        ...(targetGroup ? [{label: t('overview.targetGroup'), value: targetGroup}] : [])
      ]
    : [];

  const navItems = [
    {id: 'overview', label: t('nav.overview'), show: true},
    {id: 'impact', label: t('nav.impact'), show: !!details && details.kpis.length > 0},
    {id: 'gallery', label: t('nav.gallery'), show: gallery.length > 0},
    {id: 'partners', label: t('nav.partners'), show: !!details && details.partners.length > 0},
    {id: 'risks', label: t('nav.risks'), show: !!details && details.risks.length > 0}
  ].filter((item) => item.show);

  const heroControl =
    'grid h-10 w-10 place-items-center border border-white/30 bg-black/25 text-white backdrop-blur transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]';

  return (
    <div>
      {/* ================= الأعلى: التعريف + المبادرة المختارة + شريط التبديل ================= */}
      <section className="pt-14 md:pt-20" aria-labelledby="initiatives-hero-title">
        <div className={CONTAINER}>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-[var(--color-navy)] pb-6">
            <div>
              <SectionLabel>{t('eyebrow')}</SectionLabel>
              <h1
                id="initiatives-hero-title"
                className="font-heading mt-4 text-3xl font-bold leading-[1.1] text-[var(--color-navy)] sm:text-4xl md:text-5xl rtl:leading-[1.3]"
              >
                {t('title')}
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--fs-muted)]">{t('subtitle')}</p>
          </div>

          {!current ? (
            <p className="py-24 text-[var(--fs-muted)]">{t('empty')}</p>
          ) : (
            <div className="pb-14 pt-8 md:pb-20">
              <div key={current.slug} className="fs-fade">
                <PhotoSlot
                  src={current.imageUrl}
                  tone={TONES[currentIndex % TONES.length]}
                  alt={pick(current.titleAr, current.titleEn)}
                  sizes="(min-width: 1152px) 1152px, 100vw"
                  priority
                  className="aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[21/9]"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-t from-[#0c1a28]/90 via-[#0c1a28]/25 to-transparent"
                  />

                  {initiatives.length > 1 && (
                    <div className="absolute end-4 top-4 z-20 flex items-center gap-3 sm:end-6 sm:top-6">
                      <span className="fs-label text-white/80">
                        {pad(currentIndex + 1)} / {pad(initiatives.length)}
                      </span>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => step(-1)} aria-label={t('prev')} className={heroControl}>
                          <Arrow className="rotate-180" />
                        </button>
                        <button type="button" onClick={() => step(1)} aria-label={t('next')} className={heroControl}>
                          <Arrow />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-x-5 bottom-5 z-10 text-white sm:inset-x-8 sm:bottom-8 lg:inset-x-10 lg:bottom-10">
                    <p className="fs-label flex items-center gap-2 text-[var(--color-accent)]">
                      <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-current" />
                      {statusLabel(current.status)}
                    </p>
                    <h2 className="font-heading mt-3 max-w-3xl text-balance text-3xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl rtl:leading-[1.3]">
                      {pick(current.titleAr, current.titleEn)}
                    </h2>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm text-white/80">
                      <PinIcon />
                      {current.location}
                    </span>
                  </div>
                </PhotoSlot>
              </div>

              <div className="mt-10 flex items-center justify-between">
                <p className="fs-label text-[var(--fs-muted)]">{t('selector')}</p>
                <p className="fs-label text-[var(--fs-muted)]">{t('count', {count: initiatives.length})}</p>
              </div>

              <div className="fs-strip mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
                {initiatives.map((item, i) => {
                  const active = item.slug === selected;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      ref={(el) => {
                        itemRefs.current[item.slug] = el;
                      }}
                      onClick={() => handleSelect(item.slug, true)}
                      aria-pressed={active}
                      className={`group w-44 shrink-0 snap-start text-start transition-opacity duration-300 sm:w-56 ${
                        active ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <PhotoSlot
                        src={item.imageUrl}
                        tone={TONES[i % TONES.length]}
                        alt=""
                        sizes="224px"
                        className="aspect-[4/3] w-full"
                      />
                      <span
                        aria-hidden
                        className={`mt-3 block h-0.5 transition-all duration-300 ${
                          active
                            ? 'w-full bg-[var(--color-navy)]'
                            : 'w-0 bg-[var(--color-accent)] group-hover:w-1/3'
                        }`}
                      />
                      <span className="fs-label mt-3 flex items-center justify-between text-[var(--fs-sage-ink)]">
                        <span>{pad(i + 1)}</span>
                        <span>{statusLabel(item.status)}</span>
                      </span>
                      <span className="font-heading mt-1.5 block text-lg font-bold leading-snug text-[var(--color-navy)] rtl:leading-[1.4]">
                        {pick(item.titleAr, item.titleEn)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= شريط التنقل بين الأقسام (ثابت) ================= */}
      {current && (
        <nav
          aria-label={t('nav.label')}
          className="sticky top-20 z-30 border-y border-[var(--color-line)] bg-[rgba(247,247,245,0.92)] backdrop-blur"
        >
          <div className={`${CONTAINER} fs-strip flex gap-8 overflow-x-auto`}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="fs-label shrink-0 py-4 text-[var(--fs-muted)] transition-colors hover:text-[var(--color-navy)]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* ================= أقسام المبادرة المختارة ================= */}
      {current && (
        <div key={current.slug} className="fs-fade">
          {/* نبذة */}
          <section id="overview" className="scroll-mt-36 py-20 md:py-28" aria-labelledby="overview-title">
            <div className={CONTAINER}>
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-7">
                  <SectionLabel>{t('overview.label')}</SectionLabel>
                  <h2
                    id="overview-title"
                    className="font-heading mt-5 text-3xl font-bold leading-[1.1] text-[var(--color-navy)] sm:text-4xl md:text-5xl rtl:leading-[1.3]"
                  >
                    {pick(current.titleAr, current.titleEn)}
                  </h2>
                  <p className="mt-7 text-base leading-8 text-[var(--color-ink)]/80 sm:text-lg">
                    {pick(current.descriptionAr, current.descriptionEn)}
                  </p>
                  <div className="mt-9">
                    <PrimaryButton href={`/${locale}/initiatives/${current.slug}`}>
                      {t('overview.fullPage')}
                    </PrimaryButton>
                  </div>
                </div>

                <dl className="self-start border-t-2 border-[var(--color-navy)] lg:col-span-5">
                  {facts.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-baseline justify-between gap-6 border-b border-[var(--color-line)] py-4"
                    >
                      <dt className="fs-label text-[var(--fs-muted)]">{f.label}</dt>
                      <dd className="text-end font-medium text-[var(--color-navy)]">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {!details ? (
            <SectionSkeleton />
          ) : (
            <>
              {/* الأثر */}
              {details.kpis.length > 0 && (
                <section
                  id="impact"
                  className="scroll-mt-36 bg-[var(--fs-paper-2)] py-20 md:py-28"
                  aria-labelledby="kpis-title"
                >
                  <div className={CONTAINER}>
                    <SectionHeading id="kpis-title" label={t('kpis.label')} title={t('kpis.title')} />

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {details.kpis.map((k, i) => {
                        const pct = Math.round(progress(k));
                        return (
                          <div key={i} className="border border-[var(--color-line)] bg-white p-6 md:p-7">
                            <div className="flex items-start justify-between gap-4">
                              <p className="fs-label max-w-[70%] leading-relaxed text-[var(--fs-muted)]">
                                {pick(k.nameAr, k.nameEn)}
                              </p>
                              <span className="fs-label bg-[var(--fs-paper-2)] px-2 py-1 text-[var(--fs-sage-ink)]">
                                {pct}%
                              </span>
                            </div>

                            <p className="font-heading mt-6 text-5xl font-bold leading-none text-[var(--color-navy)]">
                              {fmt(k.actual)}
                              <span className="ms-2 text-base font-medium text-[var(--color-growth)]">{k.unit}</span>
                            </p>

                            <div className="mt-6 h-1.5 w-full bg-[var(--color-line)]">
                              <div
                                className="h-full bg-[var(--color-growth)] transition-all duration-700"
                                style={{width: `${pct}%`}}
                              />
                            </div>

                            <div className="mt-3 flex justify-between text-xs text-[var(--fs-muted)]">
                              <span>
                                {t('kpis.baseline')}: {fmt(k.baseline)}
                              </span>
                              <span>
                                {t('kpis.target')}: {fmt(k.target)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* المعرض */}
              {gallery.length > 0 && (
                <section id="gallery" className="scroll-mt-36 py-20 md:py-28" aria-labelledby="gallery-title">
                  <div className={CONTAINER}>
                    <SectionHeading id="gallery-title" label={t('gallery.label')} title={t('gallery.title')} />

                    <ul
                      className={`mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 ${
                        gallery.length >= 3 ? 'md:auto-rows-[15rem]' : ''
                      }`}
                    >
                      {gallery.map((img, i) => {
                        const cell = galleryCell(i, gallery.length);
                        const caption = pick(img.captionAr, img.captionEn);
                        return (
                          <li key={img.id} className={`group relative ${cell.wrap}`}>
                            <PhotoSlot
                              src={imageUrl(img.id)}
                              tone={TONES[(i + 1) % TONES.length]}
                              alt={caption || pick(current.titleAr, current.titleEn)}
                              sizes={i === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
                              className={`w-full ${cell.frame} [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105`}
                            >
                              {caption && (
                                <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-[#0c1a28]/80 to-transparent px-4 pb-3 pt-12">
                                  <p className="text-sm leading-snug text-white">{caption}</p>
                                </div>
                              )}
                            </PhotoSlot>
                            <button
                              type="button"
                              onClick={() => setLightbox(i)}
                              aria-label={t('gallery.open')}
                              className="absolute inset-0 z-20 cursor-zoom-in"
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </section>
              )}

              {/* الشركاء */}
              {details.partners.length > 0 && (
                <section
                  id="partners"
                  className="scroll-mt-36 border-t border-[var(--color-line)] py-20 md:py-28"
                  aria-labelledby="partners-title"
                >
                  <div className={CONTAINER}>
                    <SectionHeading id="partners-title" label={t('partners.label')} title={t('partners.title')} />

                    <ul className="mt-12 border-t-2 border-[var(--color-navy)]">
                      {details.partners.map((p, i) => (
                        <li
                          key={p.id ?? i}
                          className="grid items-center gap-3 border-b border-[var(--color-line)] py-6 sm:grid-cols-12 sm:gap-8"
                        >
                          <span className="fs-label text-[var(--fs-sage-ink)] sm:col-span-3">
                            {partnerTypeLabel(p.type)}
                          </span>
                          <p className="font-heading text-2xl font-bold text-[var(--color-navy)] sm:col-span-6">
                            {pick(p.nameAr, p.nameEn)}
                          </p>
                          <div className="sm:col-span-3 sm:text-end">
                            {p.website && (
                              <a
                                href={p.website.startsWith('http') ? p.website : `https://${p.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fs-underline inline-flex items-center gap-2 py-1 text-sm font-medium text-[var(--color-navy)]"
                              >
                                {t('partners.visit')}
                                <Arrow />
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {/* المخاطر */}
              {details.risks.length > 0 && (
                <section
                  id="risks"
                  className="scroll-mt-36 bg-[var(--fs-paper-2)] py-20 md:py-28"
                  aria-labelledby="risks-title"
                >
                  <div className={CONTAINER}>
                    <SectionHeading id="risks-title" label={t('risks.label')} title={t('risks.title')} />

                    <ul className="mt-12 border-t-2 border-[var(--color-navy)]">
                      {details.risks.map((r, i) => (
                        <li
                          key={i}
                          className="grid gap-6 border-b border-[var(--color-line)] py-8 md:grid-cols-12 md:gap-8"
                        >
                          <p className="font-heading text-xl font-bold leading-snug text-[var(--color-navy)] md:col-span-4 rtl:leading-[1.5]">
                            {pick(r.descriptionAr, r.descriptionEn)}
                          </p>

                          <div className="flex flex-wrap gap-x-10 gap-y-5 md:col-span-4">
                            <LevelMeter
                              title={t('risks.probability')}
                              level={r.probability}
                              valueLabel={levelLabel(r.probability)}
                            />
                            <LevelMeter
                              title={t('risks.impact')}
                              level={r.impact}
                              valueLabel={levelLabel(r.impact)}
                            />
                          </div>

                          <p className="text-sm leading-7 text-[var(--fs-muted)] md:col-span-4">
                            <span className="fs-label mb-1.5 block text-[var(--fs-sage-ink)]">
                              {t('risks.mitigation')}
                            </span>
                            {r.mitigation}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </>
          )}

          {/* دعوة للتواصل */}
          <section className="bg-[var(--color-navy)] py-20 text-white md:py-24">
            <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-8`}>
              <div className="max-w-xl">
                <h2 className="font-heading text-3xl font-bold leading-tight sm:text-4xl rtl:leading-[1.3]">
                  {t('cta.title')}
                </h2>
                <p className="mt-4 leading-relaxed text-[var(--fs-on-navy)]">{t('cta.text')}</p>
              </div>
              <Link
                href={`/${locale}#contact`}
                className="inline-flex items-center gap-3 bg-[var(--color-accent)] px-6 py-3.5 font-medium text-[var(--color-navy)] transition-opacity hover:opacity-90"
              >
                {t('cta.button')}
                <Arrow />
              </Link>
            </div>
          </section>
        </div>
      )}

      {lightbox !== null && lightboxItems.length > 0 && (
        <Lightbox
          items={lightboxItems}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={setLightbox}
          isArabic={isArabic}
          labels={{close: t('gallery.close'), prev: t('prev'), next: t('next')}}
        />
      )}
    </div>
  );
}