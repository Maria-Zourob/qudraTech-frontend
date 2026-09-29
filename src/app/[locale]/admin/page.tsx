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
interface ActivityItem {
  type: string;
  text: string;
  date: string;
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
  '#6190A2',
  '#C9A66B',
  '#5B8C7E',
  '#A65B5B',
  '#8A6BC9'
];

function StatCard({label, value, max, accent}: {label: string; value: number; max: number; accent?: boolean}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="border p-5" style={{borderColor: 'var(--color-line)', background: 'white'}}>
      <p className="font-heading text-4xl font-bold leading-none" style={{color: accent ? 'var(--color-accent)' : 'var(--color-navy)'}}>
        {value}
      </p>
      <p className="fs-label mt-2.5" style={{color: 'var(--fs-muted)'}}>{label}</p>
      <div className="mt-4 h-1 w-full" style={{background: 'var(--color-line)'}}>
        <div
          className="h-1 transition-all"
          style={{width: `${pct}%`, background: accent ? 'var(--color-accent)' : 'var(--color-navy)'}}
        />
      </div>
    </div>
  );
}

function StatusPieChart({data}: {data: {status: string; count: number}[]}) {
  const filtered = data.filter((d) => d.count > 0);
  const total = filtered.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return (
      <div className="border p-6" style={{borderColor: 'var(--color-line)', background: 'white'}}>
        <p className="fs-label mb-3" style={{color: 'var(--fs-muted)'}}>توزيع المبادرات حسب الحالة</p>
        <p className="text-sm" style={{color: 'var(--fs-muted)'}}>لا توجد بيانات بعد.</p>
      </div>
    );
  }

  const radius = 70;
  const center = 80;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const angles = filtered.reduce<{start: number; end: number}[]>((acc, d) => {
    const prevEnd = acc.length > 0 ? acc[acc.length - 1].end : -90;
    const sweep = (d.count / total) * 360;
    return [...acc, {start: prevEnd, end: prevEnd + sweep}];
  }, []);

  const slices = filtered.map((d, i) => {
    const {start: startAngle, end: endAngle} = angles[i];
    const angle = endAngle - startAngle;

    const x1 = center + radius * Math.cos(toRad(startAngle));
    const y1 = center + radius * Math.sin(toRad(startAngle));
    const x2 = center + radius * Math.cos(toRad(endAngle));
    const y2 = center + radius * Math.sin(toRad(endAngle));
    const largeArc = angle > 180 ? 1 : 0;

    const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {path, color: CHART_COLORS[i % CHART_COLORS.length], status: d.status, count: d.count};
  });

  return (
    <div className="border p-6" style={{borderColor: 'var(--color-line)', background: 'white'}}>
      <p className="fs-label mb-5" style={{color: 'var(--fs-muted)'}}>توزيع المبادرات حسب الحالة</p>
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <svg width="170" height="170" viewBox="0 0 160 160">
          {slices.map((s) => (
            <path key={s.status} d={s.path} fill={s.color} stroke="white" strokeWidth="1.5" />
          ))}
        </svg>
        <div className="space-y-2.5 w-full">
          {slices.map((s) => (
            <div key={s.status} className="flex items-center gap-2.5 text-sm">
              <span className="w-2.5 h-2.5 shrink-0" style={{background: s.color}} />
              <span className="font-medium" style={{color: 'var(--color-ink)'}}>{s.status}</span>
              <span className="ms-auto" style={{color: 'var(--fs-muted)'}}>{s.count}</span>
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
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const token = getToken() ?? undefined;
    const [summaryData, initiativesData, activityData] = await Promise.all([
      apiClient.get<DashboardSummary>('/admin/dashboard-summary', token),
      apiClient.get<AdminInitiative[]>('/initiatives', token),
      apiClient.get<ActivityItem[]>('/admin/recent-activity', token)
    ]);
    setSummary(summaryData);
    setInitiatives(initiativesData);
    setActivity(activityData);
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
  const attentionItems = [
    summary.unreadMessages > 0
      ? {label: `${summary.unreadMessages} رسالة تواصل غير مقروءة`, href: '/ar/admin/messages'}
      : null,
    summary.pendingVolunteers > 0
      ? {label: `${summary.pendingVolunteers} متطوّع بانتظار الموافقة`, href: '/ar/admin/volunteers'}
      : null
  ].filter((item): item is {label: string; href: string} => item !== null);
  const cards = [
    {label: 'إجمالي المبادرات', value: summary.totalInitiatives},
    {label: 'مبادرات نشطة', value: summary.activeInitiatives, accent: true},
    {label: 'المستفيدون', value: summary.beneficiaries},
    {label: 'الشركاء', value: summary.partners},
    {label: 'المستخدمون', value: summary.volunteers},
    {label: 'رسائل غير مقروءة', value: summary.unreadMessages, accent: summary.unreadMessages > 0},
    {label: 'متطوعون بانتظار الموافقة', value: summary.pendingVolunteers, accent: summary.pendingVolunteers > 0},
    {label: 'مبادرات مكتملة', value: summary.completedInitiatives}
  ];
  const maxValue = Math.max(...cards.map((c) => c.value), 1);

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-8">
            {attentionItems.length > 0 && (
        <div className="mb-8 border-s-4 p-5" style={{borderColor: 'var(--color-accent)', background: 'white'}}>
          <p className="fs-label mb-3" style={{color: 'var(--fs-muted)'}}>يحتاج متابعة</p>
          <ul className="space-y-2">
            {attentionItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm font-medium hover:underline" style={{color: 'var(--color-navy)'}}>
                  {item.label} ←
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} max={maxValue} accent={c.accent} />
        ))}
      </div>

      <div className="mb-8">
        <StatusPieChart data={summary.byStatus} />
      </div>

      <div className="flex justify-between items-center mb-4 pb-4 border-b-2" style={{borderColor: 'var(--color-navy)'}}>
        <h2 className="font-heading text-xl font-bold" style={{color: 'var(--color-navy)'}}>المبادرات</h2>
        <Link
          href="/ar/admin/initiatives/new"
          className="text-sm font-medium px-4 py-2 text-white transition-opacity hover:opacity-90"
          style={{background: 'var(--color-navy)'}}
        >
          + مبادرة جديدة
        </Link>
      </div>

      <div className="space-y-2">
        {initiatives.map((initiative) => (
          <div
  key={initiative.id}
  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4"
>
  <div className="min-w-0">
    <Link
      href={`/ar/admin/initiatives/${initiative.id}`}
      className="font-semibold text-[#19324A] hover:underline"
    >
      {initiative.titleAr}
    </Link>

    <p className="mt-1 text-sm text-slate-500">
      {initiative.titleEn}
    </p>
  </div>

  <div className="flex items-center gap-3">
    <select
      value={initiative.status}
      onChange={(e) =>
        handleStatusChange(initiative.id, e.target.value)
      }
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>

    <Link
      href={`/ar/admin/initiatives/${initiative.id}`}
      className="inline-flex items-center rounded-lg bg-[#19324A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#082744]"
    >
      إدارة
    </Link>
  </div>
</div>
        ))}
      </div>
    </main>
  );
}

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}