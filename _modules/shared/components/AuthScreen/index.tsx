'use client';

import React from 'react';
import { Numpad } from './Numpad';
import { useAuthScreen } from './useAuthScreen';
import { Permission } from '@shared/types/auth';
import styles from './style.module.css';

interface AuthScreenProps {
  onSuccessRedirect: (permissions: Permission[]) => void;
}

const PIN_INDICATORS = [0, 1, 2, 3];

export function AuthScreen({ onSuccessRedirect }: AuthScreenProps) {
  const { pin, error, handleKeyPress, handleClear, handleDelete } =
    useAuthScreen({ onSuccessRedirect });

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.title}>ВХОД В ТЕРМИНАЛ</h1>
        <p className={styles.subtitle}>Введите ваш персональный ПИН-код</p>
      </div>

      <div className={styles.indicatorContainer}>
        {PIN_INDICATORS.map((index) => (
          <div
            key={index}
            className={`${styles.dot} ${
              index < pin.length ? styles.dotActive : ''
            }`}
          />
        ))}
      </div>

      <div className={styles.errorContainer}>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>

      <Numpad
        onKeyPress={handleKeyPress}
        onClear={handleClear}
        onDelete={handleDelete}
      />
    </div>
  );
}
