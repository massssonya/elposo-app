'use client';

import { useSearchParams } from 'next/navigation';

import styles from './loading.module.css';

export default function GlobalLoading() {
    const searchParams = useSearchParams();
    
    const loadingText = searchParams.get('loading_text') || 'Загрузка интерфейса...';
    
    return (
        <div className={styles.overlay}>
        <div className={styles.container}>
            <div className={styles.spinner} />
            <p className={styles.text}>Загрузка интерфейса...</p>
        </div>
        </div>
    );
}
