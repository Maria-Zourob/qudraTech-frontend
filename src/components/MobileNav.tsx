'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';

interface Props {
  links: {href: string; label: string}[];
  otherHref: string;
  otherLabel: string;
}

/** Full-height navy sheet menu. Closes on navigation and locks page scroll while open. */
export function MobileNav({links, otherHref, otherLabel}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="relative z-50 grid h-11 w-11 place-items-center border border-[var(--color-navy)] text-[var(--color-navy)]"
      >
        <span className="relative block h-3.5 w-5">
          <span className={`absolute inset-x-0 h-0.5 bg-current transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
          <span className={`absolute inset-x-0 top-1.5 h-0.5 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`absolute inset-x-0 h-0.5 bg-current transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
        </span>
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col justify-between bg-[var(--color-navy)] px-5 pb-8 pt-10"
      >
        <ul>
          {links.map((link, i) => (
            <li key={link.href} className="border-b border-white/15">
              <Link href={link.href} className="flex items-baseline gap-4 py-5 text-white">
                <span className="fs-label text-[var(--color-accent)]">0{i + 1}</span>
                <span className="font-heading text-3xl font-bold">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={otherHref} className="self-start border border-white/40 px-4 py-2.5 text-sm font-medium text-white">
          {otherLabel}
        </Link>
      </div>
    </div>
  );
}