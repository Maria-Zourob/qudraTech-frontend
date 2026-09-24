'use client';

import {useId, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Reveal} from '@/components/Reveal';
import {apiClient} from '@/lib/apiClient';
import {useToast} from '@/components/Toast';
import {PhotoSlot} from '@/components/home/PhotoSlot';
import {SectionLabel} from '@/components/home/ui';
interface CTASectionProps {
  locale: string;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

const FIELD =
  'w-full border border-white/15 bg-[#213E58] px-4 py-3 text-sm text-white placeholder-white/40 transition-colors focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40';

const LABEL = 'mb-1.5 block text-xs font-medium text-[#D5DCD6]';

export function CTASection({locale}: CTASectionProps) {
  const t = useTranslations('HomePage.cta');
  const tp = useTranslations('HomePage.photos');
  const isArabic = locale === 'ar';
  const uid = useId();

  const [form, setForm] = useState({name: '', email: '', subject: '', message: ''});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const showToast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      await apiClient.post('/public/contact', form);
      setStatus('sent');
      setForm({name: '', email: '', subject: '', message: ''});
      showToast(t('successTitle'), 'success');
    } catch {
      setStatus('error');
      showToast(t('errorMessage'), 'error');
    }
  }

  const id = (name: string) => `${uid}-${name}`;

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[var(--color-accent)] text-[var(--color-navy)]"
      aria-labelledby={id('title')}
    >
      <div className="relative lg:min-h-[55rem]">
        {/* Photo: full width on mobile, end-side half on desktop */}
        <PhotoSlot
          id="ctaVolunteers"
          tone="pine"
          alt={tp('ctaVolunteers.alt')}
          brief={tp('ctaVolunteers.brief')}
          briefPlacement="top-end"
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:end-0 lg:aspect-auto lg:w-[46%]"
        />

        <div className={`${CONTAINER} relative z-10 pb-20 lg:py-32`}>
          <Reveal>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className={`flex flex-col pt-14 lg:col-span-5 lg:pt-0 ${isArabic ? 'items-start text-right' : 'items-start text-left'}`}>
                <h2
                  id={id('title')}
                  className="font-heading text-balance text-4xl font-bold leading-[1.15] text-[var(--color-navy)] sm:text-5xl md:text-6xl lg:text-[4.2rem] rtl:leading-[1.25]"
                >
                  {t('title')}
                </h2>
                <p className="mt-6 text-lg font-medium leading-relaxed text-[var(--color-navy)]/90 sm:text-xl">
                  {t('description')}
                </p>
                <div className="fs-label mt-8 flex items-center gap-2 text-[var(--color-navy)]/80">
  <span
    aria-hidden
    className="h-1.5 w-1.5 shrink-0 bg-current"
  />
  <span>{t('tagline')}</span>
</div>
              </div>

              <div className="relative bg-[var(--color-navy)] p-6 text-white shadow-[0_40px_80px_rgba(12,26,40,0.35)] sm:p-9 lg:col-span-6 lg:col-start-7">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="fs-label text-[var(--color-accent)]">{t('formLabel')}</span>
                  <span aria-hidden className="h-2 w-2 animate-pulse bg-[var(--color-accent)] motion-reduce:animate-none" />
                </div>

                {status === 'sent' ? (
                  <div className="py-8 text-center" role="status">
                    <p className="text-lg font-medium text-[var(--color-accent)]">{t('successTitle')}</p>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor={id('name')} className={LABEL}>
                          {t('nameLabel')}
                        </label>
                        <input
                          id={id('name')}
                          type="text"
                          required
                          autoComplete="name"
                          value={form.name}
                          onChange={(e) => setForm({...form, name: e.target.value})}
                          placeholder={t('namePlaceholder')}
                          className={FIELD}
                        />
                      </div>
                      <div>
                        <label htmlFor={id('email')} className={LABEL}>
                          {t('emailLabel')}
                        </label>
                        <input
                          id={id('email')}
                          type="email"
                          required
                          dir="ltr"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => setForm({...form, email: e.target.value})}
                          placeholder="name@example.com"
                          className={`${FIELD} ${isArabic ? 'text-right placeholder:text-right' : ''}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor={id('subject')} className={LABEL}>
                        {t('subjectLabel')}
                      </label>
                      <input
                        id={id('subject')}
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) => setForm({...form, subject: e.target.value})}
                        placeholder={t('subjectPlaceholder')}
                        className={FIELD}
                      />
                    </div>

                    <div>
                      <label htmlFor={id('message')} className={LABEL}>
                        {t('messageLabel')}
                      </label>
                      <textarea
                        id={id('message')}
                        rows={4}
                        required
                        value={form.message}
                        onChange={(e) => setForm({...form, message: e.target.value})}
                        placeholder={t('messagePlaceholder')}
                        className={`${FIELD} resize-none`}
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-sm text-red-300" role="alert">
                        {t('errorMessage')}
                      </p>
                    )}

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="flex w-full items-center justify-center bg-[var(--color-accent)] py-4 text-base font-bold text-[var(--color-navy)] transition-colors hover:bg-[var(--fs-paper)] disabled:opacity-50"
                      >
                        {status === 'sending' ? t('sending') : t('button')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
