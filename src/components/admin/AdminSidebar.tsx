'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

export function AdminSidebar({locale}: {locale: string}) {
  const pathname = usePathname();
  const isArabic = locale === 'ar';

  const links = [
    {href: `/${locale}/admin`, label: isArabic ? 'لوحة التحكم' : 'Dashboard'},
    {href: `/${locale}/admin/volunteers`, label: isArabic ? 'المتطوعون' : 'Volunteers'},
    {href: `/${locale}/admin/messages`, label: isArabic ? 'رسائل التواصل' : 'Messages'},
    {href: `/${locale}/admin/categories`, label: isArabic ? 'التصنيفات' : 'Categories'},
    {href: `/${locale}/admin/initiatives/new`, label: isArabic ? 'مبادرة جديدة' : 'New Initiative'},
    {href: `/${locale}/admin/partners`, label: isArabic ? 'الشركاء' : 'Partners'}
  ];

  return (
    <aside
      className="w-56 shrink-0 border-e min-h-screen"
      style={{borderColor: 'var(--color-line)', background: '#FBFAF6'}}
    >
      <div className="p-5">
        <p className="font-heading font-bold text-sm mb-6" style={{color: 'var(--color-navy)'}}>
          {isArabic ? 'إدارة خطوات المستقبل' : 'Future Steps Admin'}
        </p>
        <nav className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm rounded-lg transition-colors"
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
    </aside>
  );
}