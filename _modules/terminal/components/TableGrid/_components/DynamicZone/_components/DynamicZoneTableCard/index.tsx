'use client';

import { memo } from 'react';

import { Table } from '@shared/types/tables';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';

import styles from './DynamicZoneTableCard.module.css';

interface TableCardProps {
  table: Table;
  onClick: (table: Table) => void;
}

export const DynamicZoneTableCard = memo(({ table, onClick }: TableCardProps) => {
  return (
    <FlexLayout 
      direction="col"
      align="center"
      justify="center"
      className={`${styles.dynamicCard} pos-status-${table.status}`}
      onClick={() => onClick(table)}
    >
      <span>Стол</span>
      <span className={styles.cardNumber}>{table.number}</span>
    </FlexLayout>
  );
});

DynamicZoneTableCard.displayName = 'DynamicZoneTableCard';
