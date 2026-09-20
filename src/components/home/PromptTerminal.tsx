/**
 * Decorative "prompt" panel for the Gaza QudraTech initiative. It shows what
 * prompt engineering IS — a child describing something, and getting an image
 * of it back — without any stock illustration of children. Purely illustrative.
 */

import {getTranslations} from 'next-intl/server';

export async function PromptTerminal() {
  const t = await getTranslations('HomePage.promptTerminal');

  return (
    <div
      aria-hidden="true"
      className="border border-[var(--color-navy)] bg-white shadow-[8px_8px_0_var(--color-accent)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-3">
        <span className="fs-label text-[var(--color-navy)]/70">
          {t('promptLabel')}
        </span>

        <span className="fs-label text-[var(--color-navy)]/40">
          {t('illustrative')}
        </span>
      </div>

      <div className="space-y-6 px-5 py-6 sm:px-6">
        <p className="font-heading text-lg leading-snug text-[var(--color-navy)] sm:text-xl">
          <span className="initiative-code me-2 text-[var(--color-accent)]">
            {t('promptSymbol')}
          </span>

          {t('prompt')}

          <span className="fs-caret ms-1" />
        </p>

        <div
          className="fs-fade border-s-2 border-[var(--color-growth)] ps-4"
          style={{animationDelay: '1.2s'}}
        >
          <p className="fs-label mb-2 text-[var(--color-growth)]">
            {t('resultLabel')}
          </p>

          <p className="text-sm leading-relaxed text-[var(--color-ink)]/85">
            {t('result')}
          </p>
        </div>
      </div>
    </div>
  );
}