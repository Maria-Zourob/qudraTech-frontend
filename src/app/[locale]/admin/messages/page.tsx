'use client';

import {useEffect, useState} from 'react';
import {AuthGuard} from '@/lib/authGuard';
import {apiClient} from '@/lib/apiClient';
import {getToken} from '@/lib/auth';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    setLoading(true);
    const token = getToken() ?? undefined;
    const data = await apiClient.get<ContactMessage[]>('/contact-messages', token);
    setMessages(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMessages();
  }, []);

  async function handleMarkAsRead(id: string) {
    const token = getToken() ?? undefined;
    await apiClient.patch(`/contact-messages/${id}/read`, {}, token);
    await loadMessages();
  }

  if (loading) return <p className="p-8">جاري التحميل...</p>;

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <main className="max-w-3xl mx-auto p-6 md:p-8">
      <div className="mb-8 pb-5 border-b-2" style={{borderColor: 'var(--color-navy)'}}>
        <p className="fs-label" style={{color: 'var(--fs-muted)'}}>المجتمع</p>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="font-heading text-2xl font-bold" style={{color: 'var(--color-navy)'}}>
            رسائل التواصل
          </h1>
          {unreadCount > 0 && (
            <span
              className="fs-label px-2 py-0.5"
              style={{background: 'var(--color-accent)', color: 'var(--color-navy)'}}
            >
              {unreadCount} غير مقروءة
            </span>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <p className="text-sm" style={{color: 'var(--fs-muted)'}}>لا توجد رسائل بعد.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className="border-s-4 border p-5"
              style={{
                borderInlineStartColor: m.isRead ? 'var(--color-line)' : 'var(--color-accent)',
                borderColor: 'var(--color-line)',
                background: 'white'
              }}
            >
              <div className="flex justify-between items-start gap-4 mb-3">
                <div>
                  <p className="font-medium" style={{color: 'var(--color-navy)'}}>
                    {m.name} <span style={{color: 'var(--fs-muted)'}}>— {m.subject}</span>
                  </p>
                  <p className="text-sm mt-0.5" style={{color: 'var(--fs-muted)'}} dir="ltr">{m.email}</p>
                </div>
                {!m.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(m.id)}
                    className="fs-label px-3 py-1.5 border shrink-0 transition-colors hover:bg-[var(--fs-paper-2)]"
                    style={{borderColor: 'var(--color-navy)', color: 'var(--color-navy)'}}
                  >
                    تحديد كمقروءة
                  </button>
                )}
              </div>
              <p className="text-sm leading-relaxed" style={{color: 'var(--color-ink)'}}>{m.message}</p>
              <p className="fs-label mt-3" style={{color: 'var(--fs-sage-ink)'}}>
                {new Date(m.createdAt).toLocaleString('ar')}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function MessagesAdminPage() {
  return (
    <AuthGuard>
      <MessagesAdmin />
    </AuthGuard>
  );
}