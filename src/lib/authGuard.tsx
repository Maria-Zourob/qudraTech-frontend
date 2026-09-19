'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {isAuthenticated} from '@/lib/auth';

export function AuthGuard({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

    useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);

  if (!mounted) return null;
  if (!isAuthenticated()) return null;

  return <>{children}</>;
}