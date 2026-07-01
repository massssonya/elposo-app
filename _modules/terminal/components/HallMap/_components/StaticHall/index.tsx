'use client';

import React from 'react';

import { HallZone, Table } from '@shared/types/tables';
import { PanZoomCanvas } from '@shared/components/PanZoomCanvas';
import { StaticTableItem } from './StaticTableItem';

import styles from './StaticHall.module.css';

interface StaticHallProps {
  zone: HallZone;
  onTableClick: (table: Table) => void;
}

const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 1200;

export const StaticHall = React.memo(({ zone, onTableClick }: StaticHallProps) => {

  return (
    <PanZoomCanvas 
      className={styles.wrapper} 
      canvasWidth={CANVAS_WIDTH} 
      canvasHeight={CANVAS_HEIGHT}
    >
      <div 
        className={styles.canvasField}
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT}}
      >
        {zone.tables.map((table) => (
          <StaticTableItem 
            key={table.id} 
            table={table} 
            onClick={onTableClick} 
          />
        ))}
      </div>
    </PanZoomCanvas>
  );
});
