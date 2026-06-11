'use client';

import { memo } from 'react';

import { HallZone, Table } from '@shared/types/tables';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { DynamicZoneControl } from './_components/DynamicZoneControl';
import { DynamicZoneTableList } from './_components/DynamicZoneTableList';

import styles from './DynamicZoneCanvas.module.css';

interface DynamicZoneCanvasProps {
  zone: HallZone;
  onTableClick: (table: Table) => void;
  onCreateDynamicOrder: (
    zoneId: string, 
    tableNumber: string
  ) => { success: boolean; error?: string };
}

export const DynamicZoneCanvas = memo(({
  zone,
  onTableClick,
  onCreateDynamicOrder,
}: DynamicZoneCanvasProps) => {
  return (
    <div className={styles.canvas}>
      <FlexLayout 
        direction="row" 
        gap="lg" 
        align="stretch" 
        className={styles.dynamicLayout}
      >
        <DynamicZoneControl 
          zoneId={zone.id} 
          onCreateOrder={onCreateDynamicOrder} 
        />

        <DynamicZoneTableList 
          tables={zone.tables} 
          onTableClick={onTableClick} 
        />
      </FlexLayout>
    </div>
  );
});

DynamicZoneCanvas.displayName = 'DynamicZoneCanvas';