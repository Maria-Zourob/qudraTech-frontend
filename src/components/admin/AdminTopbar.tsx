'use client';

import {useEffect, useRef, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import Link from 'next/link';
import {clearToken, getToken} from '@/lib/auth';
import {apiClient} from '@/lib/apiClient';

const PAGE_TITLES: Record<string, {ar: string; en: string}> = {
  admin: {ar: 'لوحة التحكم', en: 'Dashboard'},
  volunteers: {ar: 'المتطوعون', en: 'Volunteers'},
  messages: {ar: 'رسائل التواصل', en: 'Messages'},
  categories: {ar: 'التصنيفات', en: 'Categories'},
  partners: {ar: 'الشركاء', en: 'Partners'},
  initiatives: {ar: 'المبادرات', en: 'Initiatives'}
};

export function AdminTopbar({locale, onMenuClick}: {locale: string; onMenuClick: () => void}) {
  const router = useRouter();
  const pathname = usePathname();
  const isArabic = locale === 'ar';
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  const pageKey = PAGE_TITLES[lastSegment] ? lastSegment : 'admin';
  const pageTitle = isArabic ? PAGE_TITLES[pageKey].ar : PAGE_TITLES[pageKey].en;

  useEffect(() => {
    async function loadUnread() {
      const token = getToken() ?? undefined;
      try {
        const data = await apiClient.get<{unreadMessages: number}>('/admin/dashboard-summary', token);
        setUnread(data.unreadMessages);
      } catch {
        setUnread(0);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUnread();
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    clearToken();
    router.push(`/${locale}`);
  }

  return (
    <header
      className="flex items-center justify-between border-b px-6 h-16 sticky top-0 z-20"
      style={{borderColor: 'var(--color-line)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)'}}
    >
            <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden flex h-9 w-9 items-center justify-center border"
          style={{borderColor: 'var(--color-line)'}}
          aria-label={isArabic ? 'فتح القائمة' : 'Open menu'}
        >
          <span className="relative block h-3 w-4">
            <span className="absolute top-0 inset-x-0 h-0.5 bg-current" />
            <span className="absolute top-1.5 inset-x-0 h-0.5 bg-current" />
            <span className="absolute top-3 inset-x-0 h-0.5 bg-current" />
          </span>
        </button>

        <div>
         
                  <h1 className="font-heading text-lg font-bold text-[var(--color-navy)]">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Link
          href={`/${locale}/admin/messages`}
          className="relative flex h-10 w-10 items-center justify-center border transition-colors hover:border-[var(--color-navy)]"
          style={{borderColor: 'var(--color-line)'}}
          aria-label={isArabic ? 'الإشعارات' : 'Notifications'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M4 7a5 5 0 0 1 10 0v3.5l1.2 2.3a.5.5 0 0 1-.45.7H3.25a.5.5 0 0 1-.45-.7L4 10.5V7Z"
              stroke="var(--color-navy)"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path d="M7 15.5a2 2 0 0 0 4 0" stroke="var(--color-navy)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {unread > 0 && (
            <span
              className="absolute -top-1 -end-1 flex h-4 min-w-4 items-center justify-center px-1 text-[10px] font-bold text-white"
              style={{background: 'var(--color-accent)', color: 'var(--color-navy)'}}
            >
              {unread}
            </span>
          )}
        </Link>

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 border px-2.5 py-1.5 transition-colors hover:border-[var(--color-navy)]"
            style={{borderColor: 'var(--color-line)'}}
          >
            <span
              className="flex h-7 w-7 items-center justify-center text-xs font-bold text-white"
              style={{background: 'var(--color-navy)'}}
            >
              A
            </span>
            <span className="hidden sm:block text-sm font-medium text-[var(--color-ink)]">
              admin@qudratech.org
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 3.5 5 6.5 8 3.5" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {menuOpen && (
            <div
              className="absolute end-0 mt-1 w-48 border bg-white shadow-lg z-30"
              style={{borderColor: 'var(--color-line)'}}
            >
              <div className="px-4 py-3 border-b" style={{borderColor: 'var(--color-line)'}}>
                <p className="text-xs text-[var(--fs-muted)]">{isArabic ? 'مسجَّل الدخول بصفة' : 'Signed in as'}</p>
                <p className="text-sm font-medium text-[var(--color-navy)]">admin@qudratech.org</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-start px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-[var(--fs-paper-2)]"
              >
                {isArabic ? 'تسجيل الخروج' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}