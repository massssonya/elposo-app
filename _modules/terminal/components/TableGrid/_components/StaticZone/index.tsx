'use client';

import React from 'react';

import { HallZone, Table } from '@shared/types/tables';
import { StaticTableItem } from './StaticTableItem';

import styles from './StaticZoneCanvas.module.css';

interface StaticZoneCanvasProps {
  zone: HallZone;
  onTableClick: (table: Table) => void;
}

export const StaticZoneCanvas = React.memo(({ zone, onTableClick }: StaticZoneCanvasProps) => {
  return (
    <div className={styles.canvas}>
      {zone.tables.map((table) => (
        <StaticTableItem 
          key={table.id} 
          table={table} 
          onClick={onTableClick} 
        />
      ))}
    </div>
  );
});
