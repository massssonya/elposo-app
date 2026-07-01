'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { TabsGroup } from '@shared/components/UI/TabsGroup';
import { useTableStore } from '@shared/stores/tableStore';
import { Table } from '@shared/types/tables';
import { ROUTES } from '@shared/constants/routes';
import { OrderOrchestrator } from "@shared/orchestrators";

import styles from './TableGrid.module.css';

const StaticZoneCanvas = dynamic(
  () => import('./_components/StaticZone').then((mod) => mod.StaticZoneCanvas),
  { loading: () => <div className={styles.zoneLoader}>Загрузка карты столов...</div> }
);

const DynamicZoneCanvas = dynamic(
  () => import('./_components/DynamicZone').then((mod) => mod.DynamicZoneCanvas),
  { loading: () => <div className={styles.zoneLoader}>Загрузка быстрой выдачи...</div> }
);

export function TableGrid() {
  const router = useRouter();
  const { zones, activeZoneId, setZones, setActiveZone, createDynamicTable } = useTableStore();

  const handleTableClick = useCallback((table: Table) => {
    router.push(ROUTES.TERMINAL.ORDER(table.id));
  }, [router]);

  const handleCreateDynamicOrder = useCallback((zoneId: string, tableNumber: string) => {
    const result = OrderOrchestrator.createDynamicTableAndOrder(zoneId, tableNumber);
    
    if (result.success && result.table) {
      router.push(ROUTES.TERMINAL.ORDER(result.table.id));
      return { success: true };
    }
    
    return { success: false, error: result.error };
  }, [router]);

  const activeZone = zones.find((z) => z.id === activeZoneId);

  return (
    <FlexLayout direction='col' className={styles.container}>
      <TabsGroup
        items={zones}
        activeId={activeZoneId}
        onSelect={setActiveZone}
        renderLabel={(zone) => zone.name}
      />

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
    </FlexLayout>
  );
}
