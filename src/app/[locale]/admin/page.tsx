'use client';

import {AuthGuard} from '@/lib/authGuard';

export default function AdminDashboardPage() {
  return (
    <AuthGuard>
      <main className="p-8">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-gray-600 mt-2">مرحبًا بك بلوحة إدارة Future Steps.</p>
      </main>
    </AuthGuard>
  );
}