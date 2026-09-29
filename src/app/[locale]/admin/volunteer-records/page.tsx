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

function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div>
      <label className="fs-label mb-1.5 block" style={{color: 'var(--fs-muted)'}}>{label}</label>
      {children}
    </div>
  );
}

export default function VolunteerRecordsPage() {
  const [records, setRecords] = useState<VolunteerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{imported: number; errors: string[]} | null>(null);
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

  function handleDownloadTemplate() {
    const token = getToken();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/volunteer-records/template`, {
      headers: {Authorization: `Bearer ${token}`}
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'volunteer-template.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/volunteer-records/import`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
        body: formData
      });
      const data = await res.json();
      setImportResult(data);
      showToast(`تم استيراد ${data.imported} متطوّع بنجاح.`, 'success');
      await loadRecords();
    } catch {
      showToast('صار خطأ أثناء رفع الملف.', 'error');
    }
    setImporting(false);
    e.target.value = '';
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

  const inputClass = 'w-full border px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--color-navy)] focus:outline-none';
  const inputStyle = {borderColor: 'var(--color-line)', color: 'var(--color-ink)'};

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-5 border-b-2" style={{borderColor: 'var(--color-navy)'}}>
        <div>
          <p className="fs-label" style={{color: 'var(--fs-muted)'}}>المجتمع</p>
          <h1 className="font-heading text-2xl font-bold mt-1" style={{color: 'var(--color-navy)'}}>
            سجل المتطوعين
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-2 text-sm font-medium border transition-colors hover:bg-[var(--fs-paper-2)]"
            style={{borderColor: 'var(--color-navy)', color: 'var(--color-navy)'}}
          >
            تحميل قالب Excel
          </button>

          <label
            className="px-4 py-2 text-sm font-medium border cursor-pointer transition-colors hover:bg-[var(--fs-paper-2)]"
            style={{borderColor: 'var(--color-navy)', color: 'var(--color-navy)'}}
          >
            {importing ? 'جاري الرفع...' : 'رفع ملف Excel'}
            <input type="file" accept=".xlsx" onChange={handleFileUpload} disabled={importing} className="hidden" />
          </label>

          <button
            onClick={() => (showForm ? setShowForm(false) : openAddForm())}
            className="px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{background: 'var(--color-navy)'}}
          >
            {showForm ? 'إلغاء' : '+ إضافة متطوّع'}
          </button>
        </div>
      </div>

      {importResult && importResult.errors.length > 0 && (
        <div className="mb-6 border-s-4 p-5" style={{borderColor: '#C0392B', background: 'white'}}>
          <p className="fs-label mb-3" style={{color: '#C0392B'}}>
            استوردنا {importResult.imported} متطوّع، وفيه {importResult.errors.length} صف فيه مشكلة
          </p>
          <ul className="list-disc ps-5 space-y-1 text-sm" style={{color: 'var(--color-ink)'}}>
            {importResult.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 border p-6 space-y-4" style={{borderColor: 'var(--color-line)', background: 'white'}}>
          <p className="fs-label pb-3 border-b" style={{color: 'var(--fs-sage-ink)', borderColor: 'var(--color-line)'}}>
            {editingId ? 'تعديل بيانات متطوّع' : 'إضافة متطوّع جديد'}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Field label="الاسم الكامل">
              <input required value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} className={inputClass} style={inputStyle} />
            </Field>
            <Field label="الفريق">
              <input required value={form.team} onChange={(e) => setForm({...form, team: e.target.value})} className={inputClass} style={inputStyle} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="الدور داخل الفريق">
              <input required value={form.roleInTeam} onChange={(e) => setForm({...form, roleInTeam: e.target.value})} className={inputClass} style={inputStyle} />
            </Field>
            <Field label="رقم الهاتف">
              <input dir="ltr" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className={inputClass} style={inputStyle} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="البريد الإلكتروني">
              <input type="email" dir="ltr" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className={inputClass} style={inputStyle} />
            </Field>
            <Field label="تاريخ الانضمام">
              <input type="date" required value={form.joinDate} onChange={(e) => setForm({...form, joinDate: e.target.value})} className={inputClass} style={inputStyle} />
            </Field>
          </div>

          <Field label="المهارات">
            <textarea required rows={2} value={form.skills} onChange={(e) => setForm({...form, skills: e.target.value})} className={inputClass} style={inputStyle} />
          </Field>

          <Field label="الخبرة">
            <textarea required rows={2} value={form.experience} onChange={(e) => setForm({...form, experience: e.target.value})} className={inputClass} style={inputStyle} />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{background: 'var(--color-navy)'}}
          >
            {submitting ? 'جاري الحفظ...' : editingId ? 'حفظ التعديلات' : 'حفظ'}
          </button>
        </form>
      )}

      {records.length === 0 ? (
        <p className="text-sm" style={{color: 'var(--fs-muted)'}}>لا يوجد متطوعون مسجَّلون بعد.</p>
      ) : (
        <div className="overflow-x-auto border" style={{borderColor: 'var(--color-line)', background: 'white'}}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2" style={{borderColor: 'var(--color-navy)'}}>
                <th className="fs-label text-start py-3 px-4" style={{color: 'var(--fs-muted)'}}>الاسم</th>
                <th className="fs-label text-start py-3 px-4" style={{color: 'var(--fs-muted)'}}>الفريق</th>
                <th className="fs-label text-start py-3 px-4" style={{color: 'var(--fs-muted)'}}>الدور</th>
                <th className="fs-label text-start py-3 px-4" style={{color: 'var(--fs-muted)'}}>الهاتف</th>
                <th className="fs-label text-start py-3 px-4" style={{color: 'var(--fs-muted)'}}>البريد</th>
                <th className="fs-label text-start py-3 px-4" style={{color: 'var(--fs-muted)'}}>تاريخ الانضمام</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b transition-colors hover:bg-[var(--fs-paper-2)]" style={{borderColor: 'var(--color-line)'}}>
                  <td className="py-3 px-4 font-medium" style={{color: 'var(--color-navy)'}}>{r.fullName}</td>
                  <td className="py-3 px-4" style={{color: 'var(--color-ink)'}}>{r.team}</td>
                  <td className="py-3 px-4" style={{color: 'var(--color-ink)'}}>{r.roleInTeam}</td>
                  <td className="py-3 px-4" dir="ltr" style={{color: 'var(--color-ink)'}}>{r.phone}</td>
                  <td className="py-3 px-4" dir="ltr" style={{color: 'var(--color-ink)'}}>{r.email}</td>
                  <td className="py-3 px-4" style={{color: 'var(--color-ink)'}}>{new Date(r.joinDate).toLocaleDateString('ar')}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button onClick={() => openEditForm(r)} className="text-xs font-medium me-3 hover:underline" style={{color: 'var(--color-navy)'}}>
                      تعديل
                    </button>
                    <button onClick={() => handleDelete(r.id, r.fullName)} className="text-xs font-medium hover:underline" style={{color: '#C0392B'}}>
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