'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {apiClient} from '@/lib/apiClient';
import {getToken} from '@/lib/auth';

interface AdminInitiative {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  status: string;
}

interface DashboardSummary {
  totalInitiatives: number;
  activeInitiatives: number;
  completedInitiatives: number;
  beneficiaries: number;
  volunteers: number;
  partners: number;
  unreadMessages: number;
  pendingVolunteers: number;
  byStatus: {status: string; count: number}[];
}

const STATUSES = [
  'Draft', 'UnderReview', 'Approved', 'Planned',
  'Active', 'OnHold', 'Completed', 'Archived'
];

const CHART_COLORS = [
  'var(--color-navy)',
  'var(--color-accent)',
  'var(--color-growth)',
  '#7A8FA6',
  '#C9A66B',
  '#5B8C7E',
  '#A65B5B',
  '#8A6BC9'
];

function StatCard({label, value, accent}: {label: string; value: number; accent?: boolean}) {
  return (
    <div className="border rounded-lg p-4" style={{borderColor: 'var(--color-line)'}}>
      <p className="text-3xl font-bold" style={{color: accent ? 'var(--color-accent)' : 'var(--color-navy)'}}>
        {value}
      </p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function StatusPieChart({data}: {data: {status: string; count: number}[]}) {
  const filtered = data.filter((d) => d.count > 0);
  const total = filtered.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return (
      <div className="border rounded-lg p-5" style={{borderColor: 'var(--color-line)'}}>
        <p className="text-sm font-medium mb-2">توزيع المبادرات حسب الحالة</p>
        <p className="text-sm text-gray-500">لا توجد بيانات بعد.</p>
      </div>
    );
  }

  let cumulativeAngle = -90;
  const radius = 70;
  const center = 80;

  const slices = filtered.map((d, i) => {
    const angle = (d.count / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = center + radius * Math.cos(toRad(startAngle));
    const y1 = center + radius * Math.sin(toRad(startAngle));
    const x2 = center + radius * Math.cos(toRad(endAngle));
    const y2 = center + radius * Math.sin(toRad(endAngle));
    const largeArc = angle > 180 ? 1 : 0;

    const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {path, color: CHART_COLORS[i % CHART_COLORS.length], status: d.status, count: d.count};
  });

  return (
    <div className="border rounded-lg p-5" style={{borderColor: 'var(--color-line)'}}>
      <p className="text-sm font-medium mb-4">توزيع المبادرات حسب الحالة</p>
      <div className="flex items-center gap-8">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {slices.map((s) => (
            <path key={s.status} d={s.path} fill={s.color} stroke="white" strokeWidth="1" />
          ))}
        </svg>
        <div className="space-y-2">
          {slices.map((s) => (
            <div key={s.status} className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full inline-block" style={{background: s.color}} />
              <span>{s.status}</span>
              <span className="text-gray-500">({s.count})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [initiatives, setInitiatives] = useState<AdminInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const token = getToken() ?? undefined;
    const [summaryData, initiativesData] = await Promise.all([
      apiClient.get<DashboardSummary>('/admin/dashboard-summary', token),
      apiClient.get<AdminInitiative[]>('/initiatives', token)
    ]);
    setSummary(summaryData);
    setInitiatives(initiativesData);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id);
    const token = getToken() ?? undefined;
    await apiClient.patch(`/initiatives/${id}/status`, {status: newStatus}, token);
    await loadData();
    setUpdatingId(null);
  }

  if (loading || !summary) return <p className="p-8">جاري التحميل...</p>;

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="إجمالي المبادرات" value={summary.totalInitiatives} />
        <StatCard label="مبادرات نشطة" value={summary.activeInitiatives} accent />
        <StatCard label="المستفيدون" value={summary.beneficiaries} />
        <StatCard label="الشركاء" value={summary.partners} />
        <StatCard label="المستخدمون" value={summary.volunteers} />
        <StatCard label="رسائل غير مقروءة" value={summary.unreadMessages} accent={summary.unreadMessages > 0} />
        <StatCard label="متطوعون بانتظار الموافقة" value={summary.pendingVolunteers} accent={summary.pendingVolunteers > 0} />
        <StatCard label="مبادرات مكتملة" value={summary.completedInitiatives} />
      </div>

      <div className="mb-8">
        <StatusPieChart data={summary.byStatus} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">المبادرات</h2>
        <Link
          href="/ar/admin/initiatives/new"
          className="text-sm px-4 py-2 rounded-lg text-white"
          style={{background: 'var(--color-navy)'}}
        >
          + مبادرة جديدة
        </Link>
      </div>

      <div className="space-y-3">
        {initiatives.map((initiative) => (
          <div key={initiative.id} className="flex justify-between items-center p-4 border rounded-lg">
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