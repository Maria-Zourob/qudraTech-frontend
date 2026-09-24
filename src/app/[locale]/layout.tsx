import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';

import {locales} from '@/i18n';
import {ToastProvider} from '@/components/Toast';
import {ConfirmProvider} from '@/components/ConfirmDialog';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export const metadata: Metadata = {
  title: 'Future Steps',
  description: 'منصة إدارة وتوثيق المبادرات المجتمعية',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className="font-sans antialiased">
                <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <ConfirmProvider>{children}</ConfirmProvider>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}