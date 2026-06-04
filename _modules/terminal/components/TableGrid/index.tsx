'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useTableStore } from '@shared/stores/tableStore';
import { StaticZoneCanvas } from './_components/StaticZone';
import { DynamicZoneCanvas } from './_components/DynamicZone';
import { Table, TableStatus, HallZone } from '@shared/types/tables';
import { ROUTES } from '@shared/constants/routes';

import styles from './TableGrid.module.css';

const INITIAL_MOCK_ZONES:HallZone[] = [
  {
    id: 'zone_main',
    name: 'Основной зал',
    isDynamicZone: false,
    tables: [
      { id: 't1', number: '1', status: TableStatus.FREE, capacity: 4, isDynamic: false, x: 10, y: 15, width: 12, height: 14, shape: 'rectangle' },
      { id: 't2', number: '2', status: TableStatus.OCCUPIED, capacity: 2, isDynamic: false, x: 30, y: 15, width: 10, height: 10, shape: 'circle' },
      { id: 't3', number: '3', status: TableStatus.CLEANING, capacity: 6, isDynamic: false, x: 55, y: 15, width: 16, height: 14, shape: 'rectangle' },
      { id: 't4', number: '4', status: TableStatus.RESERVED, capacity: 4, isDynamic: false, x: 10, y: 50, width: 12, height: 14, shape: 'rectangle' },
    ]
  },
  {
    id: 'zone_fast',
    name: 'Быстрая выдача',
    isDynamicZone: true,
    tables: []
  }
];

export function TableGrid() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const { zones, activeZoneId, setZones, setActiveZone, createDynamicTable } = useTableStore();

  useEffect(() => {
    setIsHydrated(true);

    // if(zones.length === 0){
    //   setZones(INITIAL_MOCK_ZONES)
    // }
  }, [setZones, zones.length]);

  const handleTableClick = useCallback((table: Table) => {
    router.push(ROUTES.TERMINAL.ORDER(table.id));
  }, []);

  const handleCreateDynamicOrder = useCallback((zoneId: string, tableNumber: string) => {
    const result = createDynamicTable(zoneId, tableNumber);
    
    if (result.success && result.table) {
      router.push(ROUTES.TERMINAL.ORDER(result.table.id));
      return { success: true };
    }
    
    return { success: false, error: result.error };
  }, [createDynamicTable, router]);

  const activeZone = zones.find((z) => z.id === activeZoneId);

  if (!isHydrated || !activeZone) {
    return <div className={styles.container}>Синхронизация карты залов...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.zoneTabs}>
        {zones.map((zone) => (
          <button
            key={zone.id}
            className={`${styles.tab} ${zone.id === activeZoneId ? styles.tabActive : ''}`}
            onClick={() => setActiveZone(zone.id)}
          >
            {zone.name}
          </button>
        ))}
      </div>

      {activeZone.isDynamicZone ? (
        <DynamicZoneCanvas
          zone={activeZone}
          onTableClick={handleTableClick}
          onCreateDynamicOrder={handleCreateDynamicOrder}
        />
      ) : (
        <StaticZoneCanvas 
          zone={activeZone} 
          onTableClick={handleTableClick} 
        />
      )}
    </div>
  );
}
