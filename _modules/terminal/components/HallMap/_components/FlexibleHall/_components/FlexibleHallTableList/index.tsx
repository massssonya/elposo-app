'use client';

import { memo } from 'react';

import { Table } from '@shared/types/tables';
import { GridLayout } from '@shared/components/UI/Layout/GridLayout';
import { FlexibleHallTableCard } from '../FlexibleHallTableCard';

import styles from './FlexibleHallTableList.module.css';

interface TableListProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
}

export const FlexibleHallTableList = memo(({ tables, onTableClick }: TableListProps) => {
  return (
    <GridLayout
      minWidth="210px" 
      gap="sm"
      className={styles.dynamicList}
    >
      {tables.map((table) => (
        <FlexibleHallTableCard
          key={table.id}
          table={table}
          onClick={onTableClick}
        />
      ))}
    </GridLayout>
  );
});

FlexibleHallTableList.displayName = 'FlexibleHallTableList';
