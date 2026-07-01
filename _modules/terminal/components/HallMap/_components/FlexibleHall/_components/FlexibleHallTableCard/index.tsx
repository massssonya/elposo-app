'use client';

import { memo } from 'react';

import { Table } from '@shared/types/tables';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { usePopoverTrigger } from '@shared/components/UI/Popover/usePopoverTrigger';
import { useTableCard } from './_hooks/useTableCard';
import { FlexibleHallTableCardPreview } from './_components/FlexibleHallTableCardPreview';

import styles from './FlexibleHallTableCard.module.css';

interface TableCardProps {
  table: Table;
  onClick: (table: Table) => void;
}

const MOCK_TIME = 8

export const FlexibleHallTableCard = memo(({ table, onClick }: TableCardProps) => {
  const {
    tableOrder,
    currentItems,
    totalItemsCount
  } = useTableCard({ table });

  const popover = usePopoverTrigger();

  const timerClassName = [
    styles.timerBadge,
    MOCK_TIME >= 15 ? styles.timerDanger : MOCK_TIME >= 8 ? styles.timerWarning : ''
  ].join(' ');

  return (
    <FlexLayout 
      direction='col'
      gap='lg'
      className={`${styles.dynamicCard} ${styles[`status_${table.status}`]}`}
      onClick={(e) => popover.handleTriggerClick(e, () => onClick(table))}
      {...popover.triggerProps}
    >
      <FlexLayout
        justify="between"
        align="start"
        className={styles.cardHeader}
      >
        <FlexLayout
          direction='col'
          gap='xs'
          className={styles.tableInfo}
        >
          <span className={styles.label}>Трекер</span>
          <span className={styles.cardNumber}>№{table.number}</span>
        </FlexLayout>
        
        {totalItemsCount > 0 && (
          <span className={styles.itemsCountBadge}>
            {totalItemsCount} поз.
          </span>
        )}
      </FlexLayout>

      <FlexLayout 
        justify="between" 
        align="center" 
        className={styles.cardFooter}
      >
        <span className={styles.orderStatusLabel}>
          Готовится
        </span>

        <span className={timerClassName}>
          ⏱️ {MOCK_TIME} мин
        </span>
      </FlexLayout>

      <FlexibleHallTableCardPreview 
        items={currentItems} 
        isVisible={popover.isOpen} 
        coords={popover.coords}
        position={popover.position}
      />
    </FlexLayout>
  );
});

FlexibleHallTableCard.displayName = 'FlexibleHallTableCard';
