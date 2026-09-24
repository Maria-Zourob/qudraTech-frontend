'use client';

import {useState} from 'react';
import {AdminSidebar, AdminMobileDrawer} from '@/components/admin/AdminSidebar';
import {AdminTopbar} from '@/components/admin/AdminTopbar';

export function AdminShell({
  locale,
  children
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex" style={{background: 'var(--color-bg)'}}>
      <AdminSidebar locale={locale} />
      <AdminMobileDrawer locale={locale} open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 min-h-screen min-w-0">
        <AdminTopbar locale={locale} onMenuClick={() => setMobileOpen(true)} />
        {children}
      </div>
    </div>
  );
}