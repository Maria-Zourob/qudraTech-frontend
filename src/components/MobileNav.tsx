'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';

interface Props {
  links: {href: string; label: string}[];
  otherHref: string;
  otherLabel: string;
  authed: boolean;
  onLogout: () => void;
  locale: string;
}

export function MobileNav({
  links,
  otherHref,
  otherLabel,
  authed,
  onLogout,
  locale,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isArabic = locale === 'ar';

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const menu = open ? (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[998] bg-black/50"
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 z-[999] flex w-[82vw] max-w-[380px] flex-col overflow-y-auto bg-[var(--color-navy)] text-white shadow-2xl ${
          isArabic ? 'right-0' : 'left-0'
        }`}
        aria-label={isArabic ? 'القائمة الرئيسية' : 'Main menu'}
      >
        {/* Header */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            href={`/${locale}`}
            onClick={closeMenu}
            className="inline-flex items-center gap-3"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              aria-hidden="true"
            >
              <rect x="1" y="20" width="7" height="9" fill="#fff" />
              <rect x="10" y="13" width="7" height="16" fill="#fff" />
              <rect x="19" y="6" width="7" height="23" fill="#fff" />
              <circle
                cx="24"
                cy="3"
                r="2.6"
                fill="var(--color-growth)"
              />
              <path
                d="M24 5.5 Q20 8 22 12 M24 5.5 Q28 8 26 12"
                stroke="var(--color-accent)"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <span className="font-heading text-lg font-bold">
              Future Steps
            </span>
          </Link>

          <button
            type="button"
            onClick={closeMenu}
            aria-label={isArabic ? 'إغلاق القائمة' : 'Close menu'}
            className="grid h-9 w-9 place-items-center border border-white/30 text-2xl leading-none transition-colors hover:border-white hover:bg-white hover:text-[var(--color-navy)]"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 px-5 py-8"
          aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}
        >
          <div className="mb-6 flex items-center gap-2 text-[var(--color-accent)]">
            <span className="h-1.5 w-1.5 bg-current" />

            <span className="fs-label">
              {isArabic ? 'التنقل' : 'Navigation'}
            </span>
          </div>

          <div className="border-t border-white/15">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="group flex min-h-[4.5rem] items-center gap-4 border-b border-white/15"
              >
                <span className="fs-label w-7 shrink-0 text-[var(--color-accent)]">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="font-heading text-xl font-semibold transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  {link.label}
                </span>

                <span className="ms-auto text-lg text-white/40 transition-colors group-hover:text-[var(--color-accent)]">
                  {isArabic ? '←' : '→'}
                </span>
              </Link>
            ))}
          </div>

          {/* Account */}
          <div className="mt-8 flex flex-wrap gap-3">
            {authed ? (
              <>
                <Link
                  href={`/${locale}/admin`}
                  onClick={closeMenu}
                  className="border border-white/30 px-5 py-3 text-sm transition-colors hover:bg-white hover:text-[var(--color-navy)]"
                >
                  {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onLogout();
                  }}
                  className="border border-white/15 px-5 py-3 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  {isArabic ? 'تسجيل الخروج' : 'Logout'}
                </button>
              </>
            ) : (
              <Link
                href={`/${locale}/login`}
                onClick={closeMenu}
                className="border border-white/30 px-5 py-3 text-sm transition-colors hover:bg-white hover:text-[var(--color-navy)]"
              >
                {isArabic ? 'تسجيل الدخول' : 'Login'}
              </Link>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/10 px-5 py-5">
          <div className="flex items-center justify-between">
            <span className="fs-label text-white/40">
              FS — 2026
            </span>

            <Link
              href={otherHref}
              onClick={closeMenu}
              className="fs-label text-[var(--color-accent)] transition-colors hover:text-white"
            >
              {otherLabel}
            </Link>
          </div>
        </div>
      </aside>
    </>
  ) : null;

  return (
    <div className="md:hidden">
      {/* Open button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={isArabic ? 'فتح القائمة' : 'Open menu'}
        className="grid h-10 w-10 place-items-center border border-[var(--color-navy)] text-[var(--color-navy)] transition-colors hover:bg-[var(--color-navy)] hover:text-white"
      >
        <span className="relative block h-4 w-5">
          <span className="absolute inset-x-0 top-0 h-0.5 bg-current" />
          <span className="absolute inset-x-0 top-1.5 h-0.5 bg-current" />
          <span className="absolute inset-x-0 top-3 h-0.5 bg-current" />
        </span>
      </button>

      {mounted && createPortal(menu, document.body)}
    </div>
  );
}