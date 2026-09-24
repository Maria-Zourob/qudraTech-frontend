import {getTranslations} from 'next-intl/server';

import {Reveal} from '@/components/Reveal';
import {PhotoSlot, type PhotoTone} from '@/components/home/PhotoSlot';
import type {HomePhotoId} from '@/components/home/photos';

interface FieldItem {
  caption: string;
  /** Optional date / place line, e.g. "2026 · Khan Younis". Omitted when empty. */
  meta?: string;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

/*
 * Each frame has its own width, height and vertical offset so the strip reads
 * as a contact sheet rather than a uniform card row.
 */
const FRAMES: {id: HomePhotoId; tone: PhotoTone; frame: string; offset: string}[] = [
  {id: 'field1', tone: 'growth', frame: 'w-[72vw] sm:w-[19rem] aspect-[3/4]', offset: 'lg:mt-6'},
  {id: 'field2', tone: 'navy', frame: 'w-[82vw] sm:w-[26rem] aspect-[7/5]', offset: 'lg:mt-0'},
  {id: 'field3', tone: 'mist', frame: 'w-[64vw] sm:w-[16rem] aspect-[5/8]', offset: 'lg:mt-11'},
  {id: 'field4', tone: 'slate', frame: 'w-[78vw] sm:w-[22rem] aspect-[18/17]', offset: 'lg:mt-3'},
];

/**
 * "Field journal" — a horizontal contact sheet of moments from the camps.
 * It bleeds off the end edge and scrolls sideways on small screens.
 */
export async function FieldJournalSection() {
  const t = await getTranslations('HomePage.fieldJournal');
  const tp = await getTranslations('HomePage.photos');

  const items = t.raw('items') as FieldItem[];

  return (
    <section className="relative py-24 md:py-32" aria-labelledby="field-journal-title">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="fs-label flex items-center gap-2 text-[var(--fs-sage-ink)]">
  <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-current" />
  <span>{t('label')}</span>
</p>
            </Reveal>

            <Reveal delay={100}>
              <h2
                id="field-journal-title"
                className="font-heading mt-4 text-4xl font-bold leading-tight text-[var(--color-navy)] sm:text-5xl md:text-[3.5rem] rtl:leading-[1.3]"
              >
                {t('title')}
              </h2>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <p className="max-w-sm text-base leading-relaxed text-[var(--fs-muted)]">
              {t('description')}
            </p>
          </Reveal>
        </div>
      </div>

      <ul
        tabIndex={0}
        aria-label={t('stripLabel')}
        className="fs-strip mt-12 flex snap-x snap-mandatory items-start gap-5 overflow-x-auto px-5 pb-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-navy)] sm:gap-6 lg:mt-16 lg:justify-center"
      >
        {items.map((item, i) => {
          const frame = FRAMES[i % FRAMES.length];

          return (
            <li
              key={frame.id + i}
              className={`shrink-0 snap-start ${frame.offset}`}
            >
              <Reveal delay={i * 120}>
                <figure>
                  <PhotoSlot
                    id={frame.id}
                    tone={frame.tone}
                    alt={tp(`${frame.id}.alt`)}
                    brief={tp(`${frame.id}.brief`)}
                    sizes="(min-width: 640px) 26rem, 82vw"
                    className={frame.frame}
                  />

                  <figcaption className="mt-3 flex flex-col gap-1">
                    <span className="text-sm font-semibold text-[var(--color-navy)]">
                      {item.caption}
                    </span>

                    {item.meta ? (
                      <span className="fs-label text-[var(--fs-muted)]">
                        {item.meta}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}