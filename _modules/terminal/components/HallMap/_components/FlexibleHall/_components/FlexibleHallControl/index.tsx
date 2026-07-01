'use client';

import { memo } from 'react';

import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { Button } from '@shared/components/UI/Button';
import { Numpad } from '@shared/components/Numpad';
import { useNumpadState } from '@shared/components/Numpad/useNumpadState';
import { Message } from '@shared/components/Message';

import styles from './FlexibleHallControl.module.css';

interface FlexibleHallControlProps {
  zoneId: string;
  limitInput?: number;
  onCreateOrder: (zoneId: string, tableNumber: string) => { success: boolean; error?: string };
}

export const FlexibleHallControl = memo(({
  zoneId,
  limitInput = 3,
  onCreateOrder,
}: FlexibleHallControlProps) => {
  const { 
    value: tableNumber, 
    error: localError, 
    resetAll, 
    resetValue, 
    setManualError, 
    numpadProps 
  } = useNumpadState({
    maxLength: limitInput,
  });

  const handleSubmit = () => {
    if (!tableNumber) return;
    
    const result = onCreateOrder(zoneId, tableNumber);
    
    if (result.success) {
      resetAll();
    } else {
      setManualError(result.error || 'Ошибка создания стола');
      resetValue();
    }
  };

  return (
    <FlexLayout 
      direction="col" 
      gap="sm" 
      align="center"
      className={styles.dynamicControl}
    >
      <FlexLayout 
        align="center"
        justify="center" 
        className={styles.dynamicDisplay}
      >
        {tableNumber || 'Номер столика'}
      </FlexLayout>
      
      <Message text={localError} variant='error' />   
      
      <Numpad 
        {...numpadProps}
        disabled={tableNumber.length === limitInput} 
      />
      
      <Button
        variant='primary'
        disabled={!tableNumber}
        onClick={handleSubmit}
        className={styles.dynamicSubmitButton}
      >
        Открыть заказ
      </Button>
    </FlexLayout>
  );
});

FlexibleHallControl.displayName = 'FlexibleHallControl';