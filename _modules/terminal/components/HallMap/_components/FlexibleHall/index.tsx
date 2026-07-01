'use client';

import { memo } from 'react';

import { HallZone, Table } from '@shared/types/tables';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { FlexibleHallControl } from './_components/FlexibleHallControl';
import { FlexibleHallTableList } from './_components/FlexibleHallTableList';

import styles from './FlexibleHall.module.css';

interface FlexibleHallProps {
  zone: HallZone;
  onTableClick: (table: Table) => void;
  onCreateDynamicOrder: (
    zoneId: string, 
    tableNumber: string
  ) => { success: boolean; error?: string };
}

export const FlexibleHall = memo(({
  zone,
  onTableClick,
  onCreateDynamicOrder,
}: FlexibleHallProps) => {
  return (
    <div className={styles.canvas}>
      <FlexLayout 
        direction="row" 
        gap="lg" 
        align="stretch" 
        className={styles.dynamicLayout}
      >
        <FlexibleHallControl 
          zoneId={zone.id} 
          onCreateOrder={onCreateDynamicOrder} 
        />

        <FlexibleHallTableList 
          tables={zone.tables} 
          onTableClick={onTableClick} 
        />
      </FlexLayout>
    </div>
  );
});

FlexibleHall.displayName = 'FlexibleHall';