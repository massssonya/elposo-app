'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';

interface Props {
  children: React.ReactNode;
  timeoutMs?: number;
}

const EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

export function ActivityProvider({ children, timeoutMs = 30000 }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isAuth = useAuthStore((state) => state.isAuth);
  const logout = useAuthStore((state) => state.logout);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!isAuth || pathname === '/') return;

    timerRef.current = setTimeout(() => {
      handleAutoLogout();
    }, timeoutMs);
  };

  const handleAutoLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    if (isAuth && pathname !== '/') {
      resetTimer();

      EVENTS.forEach((ev) => document.addEventListener(ev, resetTimer));
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      EVENTS.forEach((ev) => document.removeEventListener(ev, resetTimer));
    };
  });

  return <>{children}</>;
}
