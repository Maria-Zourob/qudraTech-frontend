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
    }
  ];
}

function NavLink({
  href,
  label,
  icon,
  active,
  collapsed
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = ICONS[icon];
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`group relative flex items-center gap-3 py-2.5 text-sm transition-colors ${
        collapsed ? 'justify-center px-2' : 'px-4'
      }`}
      style={{color: active ? 'white' : 'rgba(255,255,255,0.62)'}}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 start-0 w-[3px] transition-all"
        style={{background: active ? 'var(--color-accent)' : 'transparent'}}
      />
      <Icon size={18} />
      {!collapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
}

/* ---------- سايد بار الديسكتوب ---------- */
export function AdminSidebar({locale}: {locale: string}) {
  const pathname = usePathname();
  const isArabic = locale === 'ar';
  const [collapsed, setCollapsed] = useState(false);
  const groups = useNavGroups(locale);

  return (
    <aside
      className={`hidden md:flex md:flex-col shrink-0 sticky top-0 h-screen overflow-y-auto transition-[width] duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{background: 'var(--color-navy)'}}
    >
            <div className={`flex items-center h-20 border-b ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`} style={{borderColor: 'rgba(255,255,255,0.1)'}}>
                <Link href={`/${locale}`} className="group inline-flex items-center">
          {collapsed ? (
            <span
              className="flex h-8 w-8 items-center justify-center text-xs font-bold"
              style={{background: 'var(--color-accent)', color: 'var(--color-navy)'}}
            >
              FS
            </span>
          ) : (
                        <span style={{filter: 'brightness(0) invert(1)'}}>
              <Logo />
            </span>
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="flex h-7 w-7 items-center justify-center border transition-colors"
            style={{borderColor: 'rgba(255,255,255,0.2)'}}
            aria-label={isArabic ? 'طي القائمة' : 'Collapse sidebar'}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d={isArabic ? 'M4 2.5 8 6l-4 3.5' : 'M8 2.5 4 6l4 3.5'}
                stroke="white"
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
          className="my-3 flex h-7 w-7 items-center justify-center border mx-auto transition-colors"
          style={{borderColor: 'rgba(255,255,255,0.2)'}}
          aria-label={isArabic ? 'فتح القائمة' : 'Expand sidebar'}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d={isArabic ? 'M8 2.5 4 6l-4 3.5' : 'M4 2.5 8 6l-4 3.5'}
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <div className="flex-1 py-5">
        {groups.map((group) => (
          <div key={group.title} className="mb-7 last:mb-0">
            {!collapsed && (
              <p className="fs-label px-5 mb-2 tracking-wider" style={{color: 'rgba(255,255,255,0.4)'}}>
                {group.title}
              </p>
            )}
            <nav>
              {group.links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  active={pathname === link.href}
                  collapsed={collapsed}
                />
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ---------- درج الموبايل ---------- */
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
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/50 md:hidden" />
      <aside
        className="fixed inset-y-0 start-0 z-50 h-screen w-72 overflow-y-auto md:hidden"
        style={{background: 'var(--color-navy)'}}
      >
        <div className="flex items-center justify-between h-20 px-5 border-b" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
                    <Link href={`/${locale}`} className="group inline-flex items-center">
                        <span style={{filter: 'brightness(0) invert(1)'}}>
              <Logo />
            </span>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border text-white"
            style={{borderColor: 'rgba(255,255,255,0.2)'}}
            aria-label={isArabic ? 'إغلاق القائمة' : 'Close menu'}
          >
            ✕
          </button>
        </div>

        <div className="py-5">
          {groups.map((group) => (
            <div key={group.title} className="mb-7 last:mb-0">
              <p className="fs-label px-5 mb-2 tracking-wider" style={{color: 'rgba(255,255,255,0.4)'}}>
                {group.title}
              </p>
              <nav>
                {group.links.map((link) => (
                  <div key={link.href} onClick={onClose}>
                    <NavLink
                      href={link.href}
                      label={link.label}
                      icon={link.icon}
                      active={pathname === link.href}
                      collapsed={false}
                    />
                  </div>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}