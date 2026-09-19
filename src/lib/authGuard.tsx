'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {isAuthenticated} from '@/lib/auth';

export function AuthGuard({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const authed = isAuthenticated();

  useEffect(() => {
    if (!authed) {
      router.replace('/login');
    }
  }, [authed, router]);

  if (!authed) return null;

  return <>{children}</>;
}