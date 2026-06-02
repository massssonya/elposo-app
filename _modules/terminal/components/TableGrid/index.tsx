'use client';

import React, { useEffect, useCallback } from 'react';

import { useTableStore } from '@terminal/store/tableStore';
import { StaticZoneCanvas } from './_components/StaticZone';
import { DynamicZoneCanvas } from './_components/DynamicZone';
import { Table, HallZone } from '@shared/types/tables';

import styles from './TableGrid.module.css';

const INITIAL_MOCK_ZONES:HallZone[] = [
  {
    id: 'zone_main',
    name: 'Основной зал',
    isDynamicZone: false,
    tables: [
      { id: 't1', number: '1', status: 'free', capacity: 4, isDynamic: false, x: 10, y: 15, width: 12, height: 14, shape: 'rectangle' },
      { id: 't2', number: '2', status: 'busy', capacity: 2, isDynamic: false, x: 30, y: 15, width: 10, height: 10, shape: 'circle' },
      { id: 't3', number: '3', status: 'reserved', capacity: 6, isDynamic: false, x: 55, y: 15, width: 16, height: 14, shape: 'rectangle' },
      { id: 't4', number: '4', status: 'dirty', capacity: 4, isDynamic: false, x: 10, y: 50, width: 12, height: 14, shape: 'rectangle' },
    ]
  },
  {
    id: 'zone_fast',
    name: 'Быстрая выдача (Тейбл-тенты)',
    isDynamicZone: true,
    tables: [{ id: 'td_45', number: '45', status: 'busy', capacity: 2, isDynamic: true }]
  }
];

export function TableGrid() {
  const { zones, activeZoneId, setZones, setActiveZone, createDynamicTable } = useTableStore();

  useEffect(() => {
    // В реальном приложении здесь будет запрос к API: fetch('/api/zones')
    setZones(INITIAL_MOCK_ZONES);
  }, [setZones]);

  // Стабилизируем функции колбэков, чтобы предотвратить холостые ререндеры холстов
  const handleTableClick = useCallback((table: Table) => {
    console.log(`Переход к оформлению заказа стола №${table.number}`);
  }, []);

  const handleCreateDynamicOrder = useCallback((zoneId: string, tableNumber: string) => {
    const result = createDynamicTable(zoneId, tableNumber);
    
    return {
      success: result.success,
      error: result.error
    };
  }, [createDynamicTable]);

  const activeZone = zones.find((z) => z.id === activeZoneId);

  if (!activeZone) {
    return <div className={styles.container}>Синхронизация карты залов...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Переключатель вкладок залов */}
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

      {/* Декларативный выбор режима отображения */}
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
