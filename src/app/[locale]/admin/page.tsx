'use client';

import {useEffect, useState} from 'react';
import {AuthGuard} from '@/lib/authGuard';
import {apiClient} from '@/lib/apiClient';
import {getToken} from '@/lib/auth';
import Link from 'next/link';
interface AdminInitiative {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  status: string;
}

const STATUSES = [
  'Draft', 'UnderReview', 'Approved', 'Planned',
  'Active', 'OnHold', 'Completed', 'Archived'
];

function AdminDashboard() {
  const [initiatives, setInitiatives] = useState<AdminInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadInitiatives() {
    setLoading(true);
    const token = getToken() ?? undefined;
    const data = await apiClient.get<AdminInitiative[]>('/initiatives', token);
    setInitiatives(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInitiatives();
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id);
    const token = getToken() ?? undefined;
    await apiClient.patch(`/initiatives/${id}/status`, {status: newStatus}, token);
    await loadInitiatives();
    setUpdatingId(null);
  }

  if (loading) return <p className="p-8">جاري التحميل...</p>;

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">لوحة التحكم — المبادرات</h1>
      <div className="space-y-3">
        {initiatives.map((initiative) => (
          <div
            key={initiative.id}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
                        <Link
              href={`/ar/admin/initiatives/${initiative.id}`}
              className="font-medium hover:underline"
              style={{color: 'var(--color-navy)'}}
            >
              {initiative.titleAr}
            </Link>
            <select
              value={initiative.status}
              disabled={updatingId === initiative.id}
              onChange={(e) => handleStatusChange(initiative.id, e.target.value)}
              className="border rounded-lg p-2"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}