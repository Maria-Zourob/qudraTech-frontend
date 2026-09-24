import Link from 'next/link';
import type {ReactNode} from 'react';

/** Mono section label: "01 ── ABOUT". */
/** Unified editorial section label. */
export function SectionLabel({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <p
      className={`fs-label flex items-center gap-2 ${
        onDark
          ? 'text-[var(--color-accent)]'
          : 'text-[var(--fs-accent-ink)]'
      }`}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 shrink-0 bg-current"
      />

      <span>{children}</span>
    </p>
  );
}

/** Arrow that mirrors automatically in RTL. */
export function Arrow({className = ''}: {className?: string}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`rtl:-scale-x-100 ${className}`}
    >
      <path
        d="M2 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** Square, two-part button: label + accent arrow block. */
export function PrimaryButton({
  href,
  children,
  tone = 'navy',
}: {
  href: string;
  children: ReactNode;
  tone?: 'navy' | 'onAccent';
}) {
  const onAccent = tone === 'onAccent';

  return (
    <Link
      href={href}
      className={`group inline-flex items-stretch font-medium text-white transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 ${
        onAccent
          ? 'bg-[var(--color-navy)] hover:shadow-[5px_5px_0_var(--fs-paper)]'
          : 'bg-[var(--color-navy)] hover:shadow-[5px_5px_0_var(--color-accent)]'
      }`}
    >
      <span className="px-6 py-3.5">{children}</span>

      <span
        className={`grid w-12 place-items-center ${
          onAccent
            ? 'bg-[var(--fs-paper)] text-[var(--color-navy)]'
            : 'bg-[var(--color-accent)] text-[var(--color-navy)]'
        }`}
      >
        <Arrow className="transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </span>
    </Link>
  );
}

/** Quiet secondary link with an animated underline. */
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="fs-underline inline-flex items-center gap-2 py-1 font-medium text-[var(--color-navy)]"
    >
      {children}
    </Link>
  );
}

export function PinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 13s4.5-4 4.5-7.2A4.5 4.5 0 0 0 2.5 5.8C2.5 9 7 13 7 13Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <circle
        cx="7"
        cy="5.8"
        r="1.6"
        fill="currentColor"
      />
    </svg>
  );
}

/** The three value icons from the original design, unchanged in meaning. */
export function ValueIcon({
  name,
}: {
  name: 'transparency' | 'community' | 'impact';
}) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      {name === 'transparency' && (
        <>
          <rect
            x="9"
            y="4"
            width="22"
            height="30"
            fill="none"
            stroke="var(--color-navy)"
            strokeWidth="2"
          />

          <line
            x1="14"
            y1="13"
            x2="26"
            y2="13"
            stroke="var(--color-line)"
            strokeWidth="2"
          />

          <line
            x1="14"
            y1="19"
            x2="26"
            y2="19"
            stroke="var(--color-line)"
            strokeWidth="2"
          />

          <path
            d="M14 25 L18 29 L27 20"
            fill="none"
            stroke="var(--color-growth)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      {name === 'community' && (
        <>
          <circle
            cx="13"
            cy="14"
            r="5"
            fill="none"
            stroke="var(--color-navy)"
            strokeWidth="2"
          />

          <circle
            cx="27"
            cy="14"
            r="5"
            fill="none"
            stroke="var(--color-navy)"
            strokeWidth="2"
          />

          <circle
            cx="20"
            cy="27"
            r="5"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
          />

          <line
            x1="16"
            y1="18"
            x2="18"
            y2="23"
            stroke="var(--color-line)"
            strokeWidth="2"
          />

          <line
            x1="24"
            y1="18"
            x2="22"
            y2="23"
            stroke="var(--color-line)"
            strokeWidth="2"
          />
        </>
      )}

      {name === 'impact' && (
        <>
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="2"
          />

          <circle
            cx="20"
            cy="20"
            r="9"
            fill="none"
            stroke="var(--color-navy)"
            strokeWidth="2"
          />

          <circle
            cx="20"
            cy="20"
            r="3"
            fill="var(--color-accent)"
          />
        </>
      )}
    </svg>
  );
}

export const CONTAINER = 'max-w-5xl mx-auto px-8';