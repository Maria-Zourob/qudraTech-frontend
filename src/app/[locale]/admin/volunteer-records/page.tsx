'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { getToken } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import { useConfirm } from '@/components/ConfirmDialog';

interface VolunteerRecord {
  id: string;
  fullName: string;
  team: string;
  roleInTeam: string;
  phone: string;
  email: string;
  skills: string;
  experience: string;
  joinDate: string;
}

const emptyForm = {
  fullName: '', team: '', roleInTeam: '', phone: '',
  email: '', skills: '', experience: '', joinDate: ''
};

export default function VolunteerRecordsPage() {
  const [records, setRecords] = useState<VolunteerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const showToast = useToast();
  const confirmDialog = useConfirm();

  async function loadRecords() {
    setLoading(true);
    const token = getToken() ?? undefined;
    const data = await apiClient.get<VolunteerRecord[]>('/volunteer-records', token);
    setRecords(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRecords();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(r: VolunteerRecord) {
    setEditingId(r.id);
    setForm({
      fullName: r.fullName,
      team: r.team,
      roleInTeam: r.roleInTeam,
      phone: r.phone,
      email: r.email,
      skills: r.skills,
      experience: r.experience,
      joinDate: r.joinDate.slice(0, 10)
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const token = getToken() ?? undefined;
    try {
      if (editingId) {
        await apiClient.put(`/volunteer-records/${editingId}`, form, token);
        showToast('تم تعديل بيانات المتطوّع بنجاح.', 'success');
      } else {
        await apiClient.post('/volunteer-records', form, token);
        showToast('تمت إضافة المتطوّع بنجاح.', 'success');
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await loadRecords();
    } catch {
      showToast('صار خطأ، حاولي كمان مرة.', 'error');
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string, name: string) {
    const confirmed = await confirmDialog({
      title: 'حذف المتطوّع',
      description: `هل أنتِ متأكدة من حذف "${name}"؟ هذا الإجراء لا يمكن التراجع عنه.`,
      confirmLabel: 'حذف',
      danger: true
    });
    if (!confirmed) return;

    const token = getToken() ?? undefined;
    try {
      await apiClient.delete(`/volunteer-records/${id}`, token);
      showToast('تم حذف المتطوّع.', 'success');
      await loadRecords();
    } catch {
      showToast('صار خطأ، حاولي كمان مرة.', 'error');
    }
  }

  if (loading) return <p className="p-8">جاري التحميل...</p>;

  const inputClass = 'w-full border px-3 py-2 text-sm';

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--color-navy)' }}>
          سجل المتطوعين
        </h1>
        <button
          onClick={() => (showForm ? setShowForm(false) : openAddForm())}
          className="px-4 py-2 text-sm font-medium text-white"
          style={{ background: 'var(--color-navy)' }}
        >
          {showForm ? 'إلغاء' : '+ إضافة متطوّع'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 border p-5 space-y-3" style={{ borderColor: 'var(--color-line)' }}>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-navy)' }}>
            {editingId ? 'تعديل بيانات متطوّع' : 'إضافة متطوّع جديد'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="الاسم الكامل" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
            <input placeholder="الفريق" required value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="الدور داخل الفريق" required value={form.roleInTeam} onChange={(e) => setForm({ ...form, roleInTeam: e.target.value })} className={inputClass} />
            <input placeholder="رقم الهاتف" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="email" placeholder="البريد الإلكتروني" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            <input type="date" required value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} className={inputClass} />
          </div>
          <textarea placeholder="المهارات" required rows={2} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className={inputClass} />
          <textarea placeholder="الخبرة" required rows={2} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className={inputClass} />

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
            style={{ background: 'var(--color-navy)' }}
          >
            {submitting ? 'جاري الحفظ...' : editingId ? 'حفظ التعديلات' : 'حفظ'}
          </button>
        </form>
      )}

      {records.length === 0 ? (
        <p className="text-gray-500">لا يوجد متطوعون مسجَّلون بعد.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2" style={{ borderColor: 'var(--color-navy)' }}>
                <th className="text-start py-2 px-2">الاسم</th>
                <th className="text-start py-2 px-2">الفريق</th>
                <th className="text-start py-2 px-2">الدور</th>
                <th className="text-start py-2 px-2">الهاتف</th>
                <th className="text-start py-2 px-2">البريد</th>
                <th className="text-start py-2 px-2">تاريخ الانضمام</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b" style={{ borderColor: 'var(--color-line)' }}>
                  <td className="py-2 px-2 font-medium">{r.fullName}</td>
                  <td className="py-2 px-2">{r.team}</td>
                  <td className="py-2 px-2">{r.roleInTeam}</td>
                  <td className="py-2 px-2" dir="ltr">{r.phone}</td>
                  <td className="py-2 px-2" dir="ltr">{r.email}</td>
                  <td className="py-2 px-2">{new Date(r.joinDate).toLocaleDateString('ar')}</td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    <button
                      onClick={() => openEditForm(r)}
                      className="text-xs mr-3"
                      style={{ color: 'var(--color-navy)' }}
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(r.id, r.fullName)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}