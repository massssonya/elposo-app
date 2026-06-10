'use client';

import { memo } from 'react';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { Button } from '@shared/components/UI/Button';

import styles from './TopBar.module.css';

interface TopBarProps {
  tableNumber: string | number;
  isDynamic: boolean;
  hasItems: boolean;
  onBack: () => void;
  onCancel: () => void;
  onTransfer: () => void;
}

export const TopBar = memo(({
  tableNumber,
  isDynamic,
  hasItems,
  onBack,
  onCancel,
  onTransfer,
}: TopBarProps) => {
  return (
    <FlexLayout justify="between" align="center" className={styles.topBar}>
      <Button variant="secondary" size="sm" onClick={onBack}>
        ← Назад к залу
      </Button>

      <div className={styles.tableTitle}>
        Оформление заказа — {isDynamic ? 'Трекер' : 'Стол'} №{tableNumber}
      </div>

      <FlexLayout align="center" gap="sm">
        <Button variant="danger" size="sm" onClick={onCancel}>
          Отменить заказ
        </Button>

        {hasItems && (
          <Button variant="warning" size="sm" onClick={onTransfer}>
            🔄 Перенести заказ
          </Button>
        )}
      </FlexLayout>
    </FlexLayout>
  );
});

TopBar.displayName = 'TopBar';
