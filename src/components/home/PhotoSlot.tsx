import Image from 'next/image';
import type {CSSProperties, ReactNode} from 'react';

import {homePhotos, type HomePhotoId} from '@/components/home/photos';

export type PhotoTone =
  | 'navy'
  | 'night'
  | 'slate'
  | 'growth'
  | 'mist'
  | 'forest'
  | 'moss'
  | 'pine';

type BriefPlacement = 'bottom-start' | 'top-start' | 'top-end';

interface PhotoSlotProps {
  /** Registry id — resolves the image from `photos.ts`. */
  id?: HomePhotoId;
  /** Direct image URL (e.g. from the API). Wins over the registry. */
  src?: string | null;
  /** Describes the real photo. Only exposed once a photo exists. */
  alt: string;
  /** Art-direction note shown on the empty slot. */
  brief?: string;
  /** Placeholder colour; also shows while a real photo loads. */
  tone?: PhotoTone;
  /** Sizing / positioning classes for the frame. */
  className?: string;
  style?: CSSProperties;
  /** `sizes` for next/image — describe the rendered width per breakpoint. */
  sizes?: string;
  priority?: boolean;
  briefPlacement?: BriefPlacement;
  /** Small label pinned to the top-start corner (e.g. a stage code). */
  label?: ReactNode;
  /** Overlay content rendered above the photo. */
  children?: ReactNode;
}

const LIGHT_TONES: PhotoTone[] = ['mist'];

const BRIEF_POSITION: Record<BriefPlacement, string> = {
  'bottom-start': 'bottom-4 start-4 sm:bottom-5 sm:start-5',
  'top-start': 'top-4 start-4 sm:top-5 sm:start-5',
  'top-end': 'top-4 end-4 sm:top-6 sm:end-6',
};

function CameraIcon() {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="mt-[0.2em] shrink-0"
    >
      <path d="M4 7h3l2-2h6l2 2h3v12H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

/**
 * An intentional image area. Renders the real photo when one is registered,
 * otherwise a toned, art-directed placeholder carrying its shot brief.
 */
export function PhotoSlot({
  id,
  src,
  alt,
  brief,
  tone = 'navy',
  className = '',
  style,
  sizes = '100vw',
  priority = false,
  briefPlacement = 'bottom-start',
  label,
  children,
}: PhotoSlotProps) {
  const registered = id ? homePhotos[id] : undefined;
  const imageSrc = src ?? registered?.src ?? null;
  const isEmpty = !imageSrc;
  const isLight = LIGHT_TONES.includes(tone);
  const ink = isLight ? 'text-[var(--color-navy)]/80' : 'text-white/85';

  return (
    <div
      className={`fs-photo fs-photo--${tone} ${className}`}
      style={style}
      data-photo-slot={id}
      data-empty={isEmpty ? '' : undefined}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={/^https?:\/\//.test(imageSrc)}
          className="object-cover"
          style={{objectPosition: registered?.focus ?? '50% 50%'}}
        />
      ) : null}

      {label ? (
        <span
          className={`fs-label absolute start-3 top-3 z-10 sm:start-4 sm:top-4 ${ink}`}
        >
          {label}
        </span>
      ) : null}

      {isEmpty && brief ? (
        <span
          aria-hidden
          className={`absolute z-10 hidden max-w-[80%] items-start gap-2 font-mono text-xs leading-relaxed sm:flex ${BRIEF_POSITION[briefPlacement]} ${ink}`}
        >
          <CameraIcon />
          <span>{brief}</span>
        </span>
      ) : null}

      {children}
    </div>
  );
}
