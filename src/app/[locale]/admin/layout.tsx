import {AuthGuard} from '@/lib/authGuard';
import {AdminShell} from '@/components/admin/AdminShell';

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
      <AdminShell locale={locale}>{children}</AdminShell>
    </AuthGuard>
  );
}