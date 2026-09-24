'use client';

import Link from 'next/link';
import {useRouter, usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';

import {MountReveal} from '@/components/MountReveal';
import {MobileNav} from '@/components/MobileNav';
import {isAuthenticated, clearToken} from '@/lib/auth';

interface HeaderProps {
  locale: string;
}

export function Logo({light = false}: {light?: boolean}) {
  const t = useTranslations('Header');
  const bar = light ? '#fff' : 'var(--color-navy)';

  return (
    <span className="inline-flex items-baseline gap-3">
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        aria-hidden="true"
        className="transition-transform group-hover:-translate-y-0.5 flex-shrink-0 translate-y-[2px]"
      >
        <rect x="1" y="20" width="7" height="9" fill={bar} />
        <rect x="10" y="13" width="7" height="16" fill={bar} />
        <rect x="19" y="6" width="7" height="23" fill={bar} />
        <circle cx="24" cy="3" r="2.6" fill="var(--color-growth)" />
        <path
          d="M24 5.5 Q20 8 22 12 M24 5.5 Q28 8 26 12"
          stroke="var(--color-accent)"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`font-heading text-lg font-bold leading-none ${
          light ? 'text-white' : 'text-[var(--color-navy)]'
        }`}
      >
        {t('brand')}
      </span>
    </span>
  );
}

export function Header({locale}: HeaderProps) {
  const t = useTranslations('Header');
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setAuthed(isAuthenticated());
  }, [pathname]);

  function handleLogout() {
    clearToken();
    setAuthed(false);
    router.push(`/${locale}`);
  }

  const links = [
  {href: `/${locale}`, label: t('navigation.home')},
  {href: `/${locale}#initiatives`, label: t('navigation.initiatives')},
  {href: `/${locale}#about`, label: t('navigation.about')},
  {href: `/${locale}#contact`, label: t('navigation.contact')},
];

  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const otherLabel = t('language');

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[rgba(247,246,241,0.88)] backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <MountReveal>
          <Link href={`/${locale}`} className="group" aria-label={t('brand')}>
            <Logo />
          </Link>
        </MountReveal>

        <nav className="hidden items-center gap-10 md:flex" aria-label={t('mainNavigation')}>
          {links.map((link, i) => (
            <MountReveal key={link.href} delay={80 + i * 60}>
              <Link href={link.href} className="fs-navlink text-sm font-medium text-[var(--color-ink)]">
                {link.label}
              </Link>
            </MountReveal>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MountReveal delay={300}>
            <Link
              href={`/${otherLocale}`}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-navy)] transition-colors hover:border-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white"
              title={otherLabel}
              aria-label={otherLabel}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.3" />
                <ellipse cx="9" cy="9" rx="3.2" ry="7.5" stroke="currentColor" strokeWidth="1.3" />
                <line x1="1.5" y1="9" x2="16.5" y2="9" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </Link>
          </MountReveal>

          {mounted && (
            <MountReveal delay={350}>
              {authed ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href={`/${locale}/admin`}
                    className="text-sm font-medium text-[var(--color-navy)] hover:underline"
                  >
                    {t('dashboard')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="border border-[var(--color-navy)] px-3.5 py-1.5 text-sm font-medium text-[var(--color-navy)] transition-colors hover:bg-[var(--color-navy)] hover:text-white"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="hidden md:inline-block border border-[var(--color-navy)] px-3.5 py-1.5 text-sm font-medium text-[var(--color-navy)] transition-colors hover:bg-[var(--color-navy)] hover:text-white"
                >
                  {t('login')}
                </Link>
              )}
            </MountReveal>
          )}

          <MobileNav
            links={links}
            otherHref={`/${otherLocale}`}
            otherLabel={otherLabel}
            authed={authed}
            onLogout={handleLogout}
            locale={locale}
          />
        </div>
      </div>
    </header>
  );
}