'use client';

import {useId} from 'react';
import {useLocale, useTranslations} from 'next-intl';

/**
 * Hero visual: the four lifecycle stages drawn as a rising staircase — the same
 * "steps" idea as the logo. A dotted path connects the tops (idea -> impact),
 * starting at a green node and ending at the orange one.
 * Mirrors itself for RTL so the climb always ends toward the reading end.
 */
export function HeroStairs() {
  const uid = useId().replace(/:/g, '');
  const locale = useLocale();
  const t = useTranslations('HomePage.hero');

  const isArabic = locale === 'ar';

  const W = 100;
  const GAP = 16;
  const X0 = 36;
  const BASE = 440;
  const VIEW_W = 520;

  const steps = [
    {h: 120, code: '01', fill: 0.05},
    {h: 200, code: '02', fill: 0.1},
    {h: 280, code: '03', fill: 0.18},
    {h: 360, code: '04', fill: 1},
  ];

  const xOf = (i: number) => {
    const x = X0 + i * (W + GAP);
    return isArabic ? VIEW_W - x - W : x;
  };

  const tops = steps.map((s, i) => ({
    cx: xOf(i) + W / 2,
    cy: BASE - s.h,
  }));

  const last = tops[tops.length - 1];

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} 500`}
      className="mx-auto h-auto w-full max-w-[520px]"
      role="img"
      aria-label={t('visualLabel')}
    >
      <defs>
        <pattern
          id={`dots-${uid}`}
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="1"
            cy="1"
            r="1"
            fill="var(--color-navy)"
            opacity="0.18"
          />
        </pattern>
      </defs>

      <rect
        x="0"
        y="0"
        width={VIEW_W}
        height={BASE}
        fill={`url(#dots-${uid})`}
      />

      {steps.map((s, i) => (
        <g key={s.code}>
          <rect
            x={xOf(i)}
            y={BASE - s.h}
            width={W}
            height={s.h}
            fill="var(--color-navy)"
            fillOpacity={s.fill}
            stroke="var(--color-navy)"
            strokeWidth="1.5"
            className="fs-rise"
            style={{animationDelay: `${200 + i * 140}ms`}}
          />

          <text
            x={xOf(i) + 12}
            y={BASE - s.h + 26}
            className="initiative-code fs-fade"
            style={{animationDelay: `${700 + i * 140}ms`}}
            fontSize="13"
            fill={i === 3 ? 'var(--fs-paper)' : 'var(--color-navy)'}
            opacity="0.75"
          >
            {s.code}
          </text>
        </g>
      ))}

      {/* baseline */}
      <line
        x1="0"
        y1={BASE}
        x2={VIEW_W}
        y2={BASE}
        stroke="var(--color-navy)"
        strokeWidth="1.5"
      />

      <line
        x1="0"
        y1={BASE + 10}
        x2={VIEW_W}
        y2={BASE + 10}
        stroke="var(--color-navy)"
        strokeOpacity="0.35"
        strokeWidth="4"
        strokeDasharray="1 7"
      />

      {/* path idea -> impact */}
      <polyline
        points={tops.map((point) => `${point.cx},${point.cy}`).join(' ')}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 7"
        className="fs-fade"
        style={{animationDelay: '900ms'}}
      />

      {tops.slice(0, 3).map((point, i) => (
        <circle
          key={i}
          cx={point.cx}
          cy={point.cy}
          r={i === 0 ? 6 : 4.5}
          fill={
            i === 0
              ? 'var(--color-growth)'
              : 'var(--fs-paper)'
          }
          stroke={
            i === 0
              ? 'var(--color-growth)'
              : 'var(--color-accent)'
          }
          strokeWidth="2"
          className="fs-fade"
          style={{animationDelay: `${900 + i * 120}ms`}}
        />
      ))}

      {/* destination node */}
      <circle
        cx={last.cx}
        cy={last.cy}
        r="7"
        fill="var(--color-accent)"
        className="fs-pulse"
        style={{animationDelay: '1.4s'}}
      />

      <circle
        cx={last.cx}
        cy={last.cy}
        r="7"
        fill="var(--color-accent)"
        className="fs-fade"
        style={{animationDelay: '1.2s'}}
      />

      {/* tag */}
      <line
        x1={last.cx}
        y1={last.cy - 12}
        x2={last.cx}
        y2={last.cy - 34}
        stroke="var(--color-navy)"
        strokeOpacity="0.5"
      />

      <text
        x={last.cx}
        y={last.cy - 42}
        textAnchor="middle"
        className="initiative-code fs-fade"
        style={{animationDelay: '1.5s'}}
        fontSize="12"
        fill="var(--color-navy)"
        opacity="0.7"
      >
        FS-2026-001
      </text>
    </svg>
  );
}