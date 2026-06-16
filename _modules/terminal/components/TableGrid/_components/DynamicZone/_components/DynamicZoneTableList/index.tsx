'use client';

import { memo } from 'react';

import { Table } from '@shared/types/tables';
import { GridLayout } from '@shared/components/UI/Layout/GridLayout';
import { DynamicZoneTableCard } from '../DynamicZoneTableCard';

import styles from './DynamicZoneTableList.module.css';

interface TableListProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
}

export const DynamicZoneTableList = memo(({ tables, onTableClick }: TableListProps) => {
  return (
    <GridLayout
      minWidth="210px" 
      gap="sm"
      className={styles.dynamicList}
    >
      {tables.map((table) => (
        <DynamicZoneTableCard
          key={table.id}
          table={table}
          onClick={onTableClick}
        />
      ))}
    </GridLayout>
  );
});

DynamicZoneTableList.displayName = 'DynamicZoneTableList';
