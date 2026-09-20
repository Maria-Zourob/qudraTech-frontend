'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Reveal} from '@/components/Reveal';
import {apiClient} from '@/lib/apiClient';
import {useToast} from '@/components/Toast';

interface CTASectionProps {
  locale: string;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export function CTASection({locale}: CTASectionProps) {
  const t = useTranslations('HomePage.cta');
  const isArabic = locale === 'ar';

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

  return (
    <section className="relative overflow-hidden bg-[var(--color-accent)] text-[var(--color-navy)] py-24 md:py-32">
      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-0 flex items-end gap-2 sm:gap-3 opacity-20 ${
          isArabic ? 'start-0 ps-6 sm:ps-12' : 'end-0 pe-6 sm:pe-12'
        }`}
      >
        <span className="h-16 w-8 bg-[var(--color-navy)] sm:h-24 sm:w-12 rounded-t-sm" />
        <span className="h-28 w-8 bg-[var(--color-navy)] sm:h-44 sm:w-12 rounded-t-sm" />
        <span className="h-40 w-8 bg-[var(--color-navy)] sm:h-64 sm:w-12 rounded-t-sm" />
        <span className="h-56 w-8 bg-[var(--color-navy)] sm:h-80 sm:w-12 rounded-t-sm shadow-xl" />
      </div>

      <div className={`${CONTAINER} relative z-10`}>
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className={`lg:col-span-6 flex flex-col ${isArabic ? 'items-start text-right' : 'items-start text-left'}`}>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.15] text-[var(--color-navy)] text-balance">
                {t('title')}
              </h2>
              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[var(--color-navy)]/90 font-medium">
                {t('description')}
              </p>
              <div className="mt-8 text-xs font-mono text-[var(--color-navy)]/70 tracking-wider">
                {t('tagline')}
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#092b49] text-white p-6 sm:p-8 rounded-3xl shadow-2xl relative border border-white/10">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <span className="text-xs font-mono tracking-widest text-[var(--color-accent)] uppercase">
                  {t('formLabel')}
                </span>
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              </div>

              {status === 'sent' ? (
                <div className="py-8 text-center">
                  <p className="text-[var(--color-accent)] font-medium text-lg">
                    {t('successTitle')}
                  </p>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#d8d3c8] mb-1.5 uppercase tracking-wider">
                        {t('nameLabel')}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        placeholder={t('namePlaceholder')}
                        className="w-full bg-[#0c3860] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#d8d3c8] mb-1.5 uppercase tracking-wider">
                        {t('emailLabel')}
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        placeholder="name@example.com"
                        className="w-full bg-[#0c3860] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#d8d3c8] mb-1.5 uppercase tracking-wider">
                      {t('subjectLabel')}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({...form, subject: e.target.value})}
                      placeholder={t('subjectPlaceholder')}
                      className="w-full bg-[#0c3860] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#d8d3c8] mb-1.5 uppercase tracking-wider">
                      {t('messageLabel')}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                      placeholder={t('messagePlaceholder')}
                      className="w-full bg-[#0c3860] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)] transition-all resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-300 text-sm">{t('errorMessage')}</p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full flex items-center justify-center bg-[var(--color-accent)] hover:bg-[#d58228] text-[var(--color-navy)] font-bold py-4 rounded-xl shadow-lg transition-all text-base disabled:opacity-50"
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
    </section>
  );
}