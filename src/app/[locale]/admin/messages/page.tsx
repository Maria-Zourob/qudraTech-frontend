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
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">رسائل التواصل</h1>
      {unreadCount > 0 && (
        <p className="text-sm text-orange-600 mb-6">{unreadCount} رسالة غير مقروءة</p>
      )}

      {messages.length === 0 ? (
        <p className="text-gray-500">لا توجد رسائل بعد.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className="border rounded-lg p-4"
              style={{borderColor: m.isRead ? '#e5e5e5' : 'var(--color-accent)'}}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{m.name} — {m.subject}</p>
                  <p className="text-sm text-gray-500">{m.email}</p>
                </div>
                {!m.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(m.id)}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    تحديد كمقروءة
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-2">{m.message}</p>
              <p className="text-xs text-gray-400 mt-2">
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