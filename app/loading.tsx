'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';

import styles from './loading.module.css';

const AUTO_CLEAN_PARAMS = ['loading_text'];

export default function GlobalLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loadingText = searchParams.get('loading_text') || 'Загрузка интерфейса...';

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;

      const params = new URLSearchParams(window.location.search);
      let hasChanges = false;

      AUTO_CLEAN_PARAMS.forEach((key) => {
        if (params.has(key)) {
          params.delete(key);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        const queryString = params.toString();
        const cleanUrl = queryString ? `${pathname}?${queryString}` : pathname;
        window.history.replaceState(null, '', cleanUrl);
      }
    };
  }, [pathname]);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.spinner} />
        <p className={styles.text}>{loadingText}</p>
      </div>
    </div>
  );
}
