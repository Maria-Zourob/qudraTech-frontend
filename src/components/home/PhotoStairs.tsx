import {PhotoSlot, type PhotoTone} from '@/components/home/PhotoSlot';
import type {HomePhotoId} from '@/components/home/photos';

export interface StairStep {
  label: string;
  alt: string;
  brief?: string;
}

interface PhotoStairsProps {
  /** Exactly four stages, in lifecycle order (documentation → impact). */
  steps: StairStep[];
  /** Initiative code shown on the destination node. */
  tag?: string;
  className?: string;
}

/*
 * Geometry — shared by the flex row and the dotted path so they always line up.
 * Widths are flex-grow ratios; the gap is a percentage of the row width.
 */
const RATIOS = [1, 1.25, 1.4, 3.6];
const HEIGHTS = [32, 50, 70, 100]; // % of the row height
const GAP = 1.2; // % of the row width

const TOTAL = RATIOS.reduce((sum, r) => sum + r, 0);
const USABLE = 100 - GAP * (RATIOS.length - 1);
const WIDTHS = RATIOS.map((r) => (r / TOTAL) * USABLE);
const CENTERS = WIDTHS.map(
  (w, i) => WIDTHS.slice(0, i).reduce((sum, x) => sum + x + GAP, 0) + w / 2,
);
const PATH = CENTERS.map((x, i) => `${x.toFixed(2)},${100 - HEIGHTS[i]}`).join(' ');

const PHOTOS: {id: HomePhotoId; tone: PhotoTone; sizes: string}[] = [
  {id: 'heroDocumentation', tone: 'mist', sizes: '(min-width: 1024px) 10vw, 14vw'},
  {id: 'heroExecution', tone: 'growth', sizes: '(min-width: 1024px) 12vw, 17vw'},
  {id: 'heroMeasurement', tone: 'slate', sizes: '(min-width: 1024px) 14vw, 19vw'},
  {id: 'heroImpact', tone: 'navy', sizes: '(min-width: 1024px) 34vw, 48vw'},
];

/**
 * The hero's signature visual: the four lifecycle stages as a staircase of
 * photographs rising toward the reading end (right→left in Arabic, left→right
 * in English — flex follows `dir`, the path mirrors with `rtl:-scale-x-100`).
 */
export function PhotoStairs({steps, tag, className = ''}: PhotoStairsProps) {
  return (
    <div className={`relative h-full ${className}`}>
      <div
        className="flex h-full items-end"
        style={{columnGap: `${GAP}%`}}
      >
        {PHOTOS.map((photo, i) => {
          const step = steps[i];
          const isLast = i === PHOTOS.length - 1;

          return (
            <div
              key={photo.id}
              className="relative"
              style={{flex: `${RATIOS[i]} 1 0%`, height: `${HEIGHTS[i]}%`}}
            >
              <PhotoSlot
                id={photo.id}
                tone={photo.tone}
                alt={step?.alt ?? ''}
                brief={isLast ? step?.brief : undefined}
                sizes={photo.sizes}
                priority={isLast}
                className="fs-reveal-up absolute inset-0"
                style={{animationDelay: `${350 + i * 150}ms`}}
                label={
                  step ? (
                    <>
                      <span>{step.label.split(' ')[0]}</span>
                      <span className={i === 0 ? 'sr-only' : 'hidden lg:inline'}>
                        {' '}
                        {step.label.split(' ').slice(1).join(' ')}
                      </span>
                    </>
                  ) : null
                }
              />

              {/* path node */}
              <span
                aria-hidden
                className={`fs-fade absolute start-1/2 top-0 z-20 -translate-y-1/2 rtl:translate-x-1/2 ltr:-translate-x-1/2 ${
                  isLast
                    ? 'h-3.5 w-3.5 bg-[var(--color-accent)]'
                    : i === 0
                      ? 'h-3 w-3 bg-[var(--color-growth)]'
                      : 'h-2.5 w-2.5 border-2 border-[var(--color-accent)] bg-[var(--fs-paper)]'
                }`}
                style={{animationDelay: `${1100 + i * 120}ms`}}
              >
                {isLast ? (
                  <span className="absolute inset-0 animate-ping bg-[var(--color-accent)] opacity-60 motion-reduce:hidden" />
                ) : null}
              </span>

              {isLast && tag ? (
                <span
                  aria-hidden
                  className="fs-fade initiative-code absolute start-1/2 -top-11 z-20 flex -translate-x-1/2 flex-col items-center text-xs text-[var(--color-navy)]/70 rtl:translate-x-1/2"
                  style={{animationDelay: '1.5s'}}
                >
                  {tag}
                  <span className="mt-1 h-5 w-px bg-[var(--color-navy)]/50" />
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* dotted path idea → impact */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="fs-fade pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible rtl:-scale-x-100"
        style={{animationDelay: '900ms'}}
      >
        <polyline
          points={PATH}
          fill="none"
          stroke="var(--color-growth)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 8"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
