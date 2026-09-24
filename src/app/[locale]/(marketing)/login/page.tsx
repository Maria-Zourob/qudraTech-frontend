'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {login} from '@/features/auth/api';
import {saveToken} from '@/lib/auth';

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      saveToken(result.accessToken);
        router.push('/ar/admin');
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center bg-[var(--color-bg)]">
      <div className={`${CONTAINER} w-full`}>
        <div className="mx-auto max-w-sm py-20">
          <p className="fs-label flex items-center gap-2 text-[var(--fs-accent-ink)]">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-current" />
            <span>{t('eyebrow')}</span>
          </p>

          <h1 className="font-heading mt-4 text-4xl font-bold leading-tight text-[var(--color-navy)]">
            {t('title')}
          </h1>

          <form onSubmit={handleSubmit} className="mt-9 space-y-4 border-t-2 border-[var(--color-navy)] pt-8">
            <div>
              <label className="fs-label mb-1.5 block text-[var(--fs-muted)]">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] transition-colors focus:border-[var(--color-navy)] focus:outline-none"
              />
            </div>

            <div>
              <label className="fs-label mb-1.5 block text-[var(--fs-muted)]">
                {t('passwordLabel')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] transition-colors focus:border-[var(--color-navy)] focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-navy)] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? t('loading') : t('button')}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}