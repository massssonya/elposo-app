'use client';

import React from 'react';
import styles from './style.module.css';

interface NumpadProps {
  onKeyPress: (value: string) => void;
  onClear: () => void;
  onDelete: () => void;
}

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const Numpad = React.memo(function Numpad({
  onKeyPress,
  onClear,
  onDelete,
}: NumpadProps) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {DIGITS.map((digit) => (
          <button
            key={digit}
            type="button"
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
      </div>
    </div>
  );
});
