import {AuthGuard} from '@/lib/authGuard';
import {AdminSidebar} from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  return (
    <AuthGuard>
      <div className="flex" style={{background: 'var(--color-paper)'}}>
        <AdminSidebar locale={locale} />
        <div className="flex-1 min-h-screen">{children}</div>
      </div>
    </AuthGuard>
  );
}