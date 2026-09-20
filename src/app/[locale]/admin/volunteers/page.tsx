'use client';

import {useEffect, useState} from 'react';
import {AuthGuard} from '@/lib/authGuard';
import {apiClient} from '@/lib/apiClient';
import {getToken} from '@/lib/auth';

interface Volunteer {
  id: string;
  email: string;
  fullNameAr: string;
  fullNameEn: string;
  status: string;
  safeguardingTrainingCompleted: boolean;
}

const STATUSES = ['Pending', 'Approved', 'Rejected'];

function VolunteersAdmin() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadVolunteers() {
    setLoading(true);
    const token = getToken() ?? undefined;
    const data = await apiClient.get<Volunteer[]>('/volunteers', token);
    setVolunteers(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVolunteers();
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id);
    const token = getToken() ?? undefined;
    await apiClient.patch(`/volunteers/${id}/status`, {status: newStatus}, token);
    await loadVolunteers();
    setUpdatingId(null);
  }

  if (loading) return <p className="p-8">جاري التحميل...</p>;

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">إدارة المتطوعين</h1>
      {volunteers.length === 0 ? (
        <p className="text-gray-500">لا يوجد متطوعون مسجَّلون بعد.</p>
      ) : (
        <div className="space-y-3">
          {volunteers.map((v) => (
            <div key={v.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-medium">{v.fullNameAr || v.fullNameEn}</p>
                <p className="text-sm text-gray-500">{v.email}</p>
                {v.safeguardingTrainingCompleted && (
                  <span className="text-xs text-green-700">✓ أكمل تدريب حماية الطفل</span>
                )}
              </div>
              <select
                value={v.status}
                disabled={updatingId === v.id}
                onChange={(e) => handleStatusChange(v.id, e.target.value)}
                className="border rounded-lg p-2"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function VolunteersAdminPage() {
  return (
    <AuthGuard>
      <VolunteersAdmin />
    </AuthGuard>
  );
}