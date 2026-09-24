'use client';

import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Logo} from '@/components/Header';
import {
  MdDashboard, MdVolunteerActivism, MdMail,
  MdCategory, MdAddCircle, MdHandshake, MdGroups
} from 'react-icons/md';
interface NavGroup {
  title: string;
  links: {href: string; label: string; icon: string}[];
}
const ICONS: Record<string, React.ComponentType<{size?: number}>> = {
  dashboard: MdDashboard,
  newInitiative: MdAddCircle,
  categories: MdCategory,
  partners: MdHandshake,
  volunteers: MdVolunteerActivism,
  volunteerRecords: MdGroups,
  messages: MdMail
};
function useNavGroups(locale: string): NavGroup[] {
  const isArabic = locale === 'ar';
  return [
   {
      title: isArabic ? 'عام' : 'General',
      links: [
        {href: `/${locale}/admin`, label: isArabic ? 'لوحة التحكم' : 'Dashboard', icon: 'dashboard'}
      ]
    },
    {
      title: isArabic ? 'المبادرات' : 'Initiatives',
      links: [
        {href: `/${locale}/admin/initiatives/new`, label: isArabic ? 'مبادرة جديدة' : 'New Initiative', icon: 'newInitiative'},
        {href: `/${locale}/admin/categories`, label: isArabic ? 'التصنيفات' : 'Categories', icon: 'categories'},
        {href: `/${locale}/admin/partners`, label: isArabic ? 'الشركاء' : 'Partners', icon: 'partners'}
      ]
    },
    {
      title: isArabic ? 'المجتمع' : 'Community',
      links: [
        {href: `/${locale}/admin/volunteers`, label: isArabic ? 'المتطوعون' : 'Volunteers', icon: 'volunteers'},
        {href: `/${locale}/admin/volunteer-records`, label: isArabic ? 'سجل المتطوعين' : 'Volunteer Records', icon: 'volunteerRecords'},
        {href: `/${locale}/admin/messages`, label: isArabic ? 'رسائل التواصل' : 'Messages', icon: 'messages'}
      ]
    },
  ];
}

/* ---------- سايد بار الديسكتوب: ثابت وقابل للطي، بلا تعقيد الموبايل ---------- */
export function AdminSidebar({locale}: {locale: string}) {
  const pathname = usePathname();
  const isArabic = locale === 'ar';
  const [collapsed, setCollapsed] = useState(false);
  const groups = useNavGroups(locale);

  return (
    <aside
      className={`hidden md:block shrink-0 border-e sticky top-0 h-screen overflow-y-auto transition-[width] duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
      style={{borderColor: 'var(--color-line)', background: 'var(--fs-paper-2)'}}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <Link href={`/${locale}`} className={`group inline-flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
            {collapsed ? (
              <span
                className="flex h-8 w-8 items-center justify-center text-xs font-bold text-white"
                style={{background: 'var(--color-navy)'}}
              >
                FS
              </span>
            ) : (
              <Logo />
            )}
          </Link>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="flex h-7 w-7 items-center justify-center border transition-colors hover:border-[var(--color-navy)]"
              style={{borderColor: 'var(--color-line)'}}
              aria-label={isArabic ? 'طي القائمة' : 'Collapse sidebar'}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d={isArabic ? 'M4 2.5 8 6l-4 3.5' : 'M8 2.5 4 6l4 3.5'}
                  stroke="var(--color-navy)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mb-6 flex h-7 w-7 items-center justify-center border mx-auto transition-colors hover:border-[var(--color-navy)]"
            style={{borderColor: 'var(--color-line)'}}
            aria-label={isArabic ? 'فتح القائمة' : 'Expand sidebar'}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d={isArabic ? 'M8 2.5 4 6l-4 3.5' : 'M4 2.5 8 6l-4 3.5'}
                stroke="var(--color-navy)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {groups.map((group) => (
          <div key={group.title} className="mb-6 last:mb-0">
            {!collapsed && (
              <p className="fs-label mb-2 text-[var(--fs-muted)]">{group.title}</p>
            )}
            <nav className="space-y-1">
              {group.links.map((link) => {
                const active = pathname === link.href;
                                const Icon = ICONS[link.icon];
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    title={collapsed ? link.label : undefined}
                    className={`flex items-center gap-2.5 py-2 text-sm transition-colors ${collapsed ? 'justify-center px-1' : 'px-3'}`}
                    style={{
                      background: active ? 'var(--color-navy)' : 'transparent',
                      color: active ? 'white' : 'var(--color-ink)'
                    }}
                  >
                    <Icon size={18} />
                    {!collapsed && <span>{link.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ---------- درج الموبايل: عنصر منفصل تمامًا، بيظهر بس فوق الشاشة لما يُفتح ---------- */
export function AdminMobileDrawer({
  locale,
  open,
  onClose
}: {
  locale: string;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const isArabic = locale === 'ar';
  const groups = useNavGroups(locale);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 md:hidden" />
      <aside
        className="fixed inset-y-0 start-0 z-50 h-screen w-72 overflow-y-auto md:hidden"
        style={{borderColor: 'var(--color-line)', background: 'var(--fs-paper-2)'}}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <Link href={`/${locale}`} className="group inline-flex items-center">
              <Logo />
            </Link>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center border"
              style={{borderColor: 'var(--color-line)'}}
              aria-label={isArabic ? 'إغلاق القائمة' : 'Close menu'}
            >
              ✕
            </button>
          </div>

          {groups.map((group) => (
            <div key={group.title} className="mb-6 last:mb-0">
              <p className="fs-label mb-2 text-[var(--fs-muted)]">{group.title}</p>
              <nav className="space-y-1">
                {group.links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="block px-3 py-2 text-sm transition-colors"
                      style={{
                        background: active ? 'var(--color-navy)' : 'transparent',
                        color: active ? 'white' : 'var(--color-ink)'
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}