'use client';

import React from 'react';
import { FlexLayout } from '../Layout/FlexLayout'
import styles from './Message.module.css';

export type MessageVariant = 'error' | 'success' | 'warning' | 'info';

interface MessageProps {
  text?: string | null;
  variant?: MessageVariant; // По умолчанию будет 'error'
}

export function Message({ text, variant = 'success' }: MessageProps) {
  return (
    <FlexLayout 
      align='center' 
      justify='center' 
      className={styles.container}
    >
      {text && (
        <p className={`${styles.text} ${styles[`variant_${variant}`]}`}>
          {text}
        </p>
      )}
    </FlexLayout>
  );
}
