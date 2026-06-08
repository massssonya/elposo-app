'use client';

import React from 'react';

import { GridLayout } from '../UI/Layout/GridLayout'
import { FlexLayout } from '../UI/Layout/FlexLayout'
import { Button } from '../UI/Button';

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
      <GridLayout cols={3} gap="sm" className={styles.grid}>
        {DIGITS.map((digit) => (
          <Button 
            key={digit}
            type="button"
            disabled={disabled}
            variant="secondary" 
            onClick={() => onKeyPress(digit)}
            className={`${styles.btn} ${styles.digitBtn}`}
        >
          {digit}
        </Button>
        ))}
          <Button 
            type="button"
            onClick={onClear}
            className={`${styles.btn} ${styles.clearBtn}`}>
          Сброс
        </Button>
        <Button 
            type="button"
            onClick={() => onKeyPress('0')}
            disabled={disabled}
            className={`${styles.btn} ${styles.digitBtn}`}>
          0
        </Button>
        <Button 
          type="button"
          onClick={onDelete}
          className={`${styles.btn} ${styles.deleteBtn}`}>
          ⌫
        </Button>
      </GridLayout>
    </div>
  );
});
