'use client';

import React from 'react';

import { GridLayout } from '../Layout/GridLayout'

import styles from './Numpad.module.css';

interface NumpadProps {
  onKeyPress: (value: string) => void;
  onClear: () => void;
  onDelete: () => void;
  disabled?: boolean
}

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const Numpad = React.memo(({
  onKeyPress,
  onClear,
  onDelete,
  disabled
}: NumpadProps) => {
  return (
    <div className={styles.container}>
      <GridLayout gap="sm" className={styles.grid}>
        {DIGITS.map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => onKeyPress(digit)}
            className={`${styles.btn} ${styles.digitBtn}`}
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          onClick={onClear}
          className={`${styles.btn} ${styles.clearBtn}`}
        >
          Сброс
        </button>

        <button
          type="button"
          onClick={() => onKeyPress('0')}
          disabled={disabled}
          className={`${styles.btn} ${styles.digitBtn}`}
        >
          0
        </button>

        <button
          type="button"
          onClick={onDelete}
          className={`${styles.btn} ${styles.deleteBtn}`}
        >
          ⌫
        </button>
      </GridLayout>
    </div>
  );
});
