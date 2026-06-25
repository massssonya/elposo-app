'use client';

import { ReactNode } from 'react';

import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout'

import styles from './Loading.module.css';

export interface LoadingProps {
  loadingText?: string;
  className?: string;
  children?: ReactNode;
  spinnerSize?: 'small' | 'medium' | 'large';
}

export function Loading({
  loadingText = 'Загрузка...',
  className = '',
  children,
  spinnerSize = 'medium',
}: GlobalLoadingProps) {
  return (
    <FlexLayout 
      align='center' 
      justify='center'
      className={`${styles.overlay} ${className}`}
    >
      <FlexLayout 
        direction='col'
        align='center' 
        className={styles.container}
      >
        <div className={`${styles.spinner} ${styles[`spinner_${spinnerSize}`]}`} />
        {children || <p className={styles.text}>{loadingText}</p>}
      </FlexLayout>
    </FlexLayout>
  );
}