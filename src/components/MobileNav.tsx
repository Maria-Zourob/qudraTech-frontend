'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';

interface Props {
  links: {href: string; label: string}[]; // أضفناها هنا لتقبل الروابط من الهيدر
  otherHref: string;
  otherLabel: string;
  authed: boolean;
  onLogout: () => void;
  locale: string;
}

export function MobileNav({links, otherHref, otherLabel, authed, onLogout, locale}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isArabic = locale === 'ar';

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

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="grid h-10 w-10 place-items-center border border-[var(--color-navy)] text-[var(--color-navy)]"
      >
        <span className="block h-3.5 w-5 relative">
          <span className="absolute top-0 inset-x-0 h-0.5 bg-current" />
          <span className="absolute top-1.5 inset-x-0 h-0.5 bg-current" />
          <span className="absolute top-3 inset-x-0 h-0.5 bg-current" />
        </span>
      </button>

      {open && (
        <>
          {/* الخلفية المعتمة — الضغط عليها بيسكّر القائمة */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/50"
          />

          {/* الشريط الجانبي نفسه */}
          <div className="fixed inset-y-0 end-0 z-50 w-72 bg-[var(--color-navy)] overflow-y-auto flex flex-col">
            <div className="flex justify-end p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center border border-white/40 text-white"
              >
                ✕
              </button>
            </div>

            <ul className="px-5 flex-1 space-y-1">
              {links.map((link) => (
                <li key={link.href} className="border-b border-white/15">
                  <Link href={link.href} className="block py-3 text-white text-base font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}

              {authed ? (
                <>
                  <li className="border-b border-white/15">
                    <Link href={`/${locale}/admin`} className="block py-3 text-white text-base font-medium">
                      {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                    </Link>
                  </li>
                  <li className="border-b border-white/15">
                    <button
                      onClick={() => {
                        setOpen(false);
                        onLogout();
                      }}
                      className="block w-full text-start py-3 text-white text-base font-medium"
                    >
                      {isArabic ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                  </li>
                </>
              ) : (
                <li className="border-b border-white/15">
                  <Link href={`/${locale}/login`} className="block py-3 text-white text-base font-medium">
                    {isArabic ? 'تسجيل الدخول' : 'Login'}
                  </Link>
                </li>
              )}
            </ul>

            <div className="p-5">
              <Link href={otherHref} className="inline-block border border-white/40 px-4 py-2 text-sm text-white">
                {otherLabel}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}