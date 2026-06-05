'use client';

import React from 'react';

import { Numpad } from '../Numpad';
import { Message } from '../Message';
import { FlexLayout } from '../UI/Layout/FlexLayout'
import { useAuthScreen } from './useAuthScreen';
import { Permission } from '../types/auth';

import styles from './AuthScreen.module.css';

interface AuthScreenProps {
  onSuccessRedirect: (permissions: Permission[]) => void;
}

const PIN_INDICATORS = [0, 1, 2, 3];

export function AuthScreen({ onSuccessRedirect }: AuthScreenProps) {
  const {  pin, error, maxLength, numpadProps } =
    useAuthScreen({ onSuccessRedirect });

  return (
    <FlexLayout
      direction="col"
      align="center"
      justify="center"
      className={styles.screen}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>ВХОД В ТЕРМИНАЛ</h1>
        <p className={styles.subtitle}>Введите ваш персональный ПИН-код</p>
      </div>

      <FlexLayout
        justify="center"
        gap="sm"
        className={styles.indicatorContainer}
      >
        {PIN_INDICATORS.map((index) => (
          <div
            key={index}
            className={`${styles.dot} ${
              index < pin.length ? styles.dotActive : ''
            }`}
          />
        ))}
      </FlexLayout>
      <Message text={error} variant="error" />      

      <Numpad {...numpadProps} disabled={pin.length === maxLength} />
    </FlexLayout>
  );
}
