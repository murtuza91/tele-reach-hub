'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import Index from '@/views/Index';
import { useHydrated } from '@/hooks/useHydrated';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated) router.replace('/dashboard');
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;
  if (isAuthenticated) {
    return null;
  }

  return <Index />;
}

