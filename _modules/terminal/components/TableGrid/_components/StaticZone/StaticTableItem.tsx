'use client';

import React from 'react';

import { Table } from '@shared/types/tables';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout'

import styles from './StaticTableItem.module.css';

interface StaticTableItemProps {
  table: Table;
  onClick: (table: Table) => void;
}

export const StaticTableItem = React.memo(({ table, onClick }: StaticTableItemProps) => {
  const handleTableClick = () => onClick(table);

  return (
    <FlexLayout
      direction="col"
      align="center"
      justify="center"
      className={`${styles.tableItem} ${styles[`shape_${table.shape}`]} ${styles[`status_${table.status}`]}`}
      style={{
        left: `${table.x}%`,
        top: `${table.y}%`,
        width: `${table.width}%`,
        height: `${table.height}%`,
      }}
      onClick={handleTableClick}
    >
      <span className={styles.tableNumber}>№{table.number}</span>
      <span className={styles.tableCapacity}>мест: {table.capacity}</span>
    </FlexLayout>
  );
});
