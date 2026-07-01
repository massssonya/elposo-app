'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { TabsGroup as HallTabs } from '@shared/components/UI/TabsGroup';
import { useTableStore } from '@shared/stores/tableStore';
import { Table } from '@shared/types/tables';
import { ROUTES } from '@shared/constants/routes';
import { OrderOrchestrator } from "@shared/orchestrators";

import styles from './HallMap.module.css';

const StaticHall = dynamic(
  () => import('./_components/StaticHall').then((mod) => mod.StaticHall),
  { loading: () => <div className={styles.zoneLoader}>Загрузка карты столов...</div> }
);

const FlexibleHall = dynamic(
  () => import('./_components/FlexibleHall').then((mod) => mod.FlexibleHall),
  { loading: () => <div className={styles.zoneLoader}>Загрузка быстрой выдачи...</div> }
);

export function HallMap() {
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
      <HallTabs
        items={zones}
        activeId={activeZoneId}
        onSelect={setActiveZone}
        renderLabel={(zone) => zone.name}
      />

      {activeZone.isFlexibleHall ? (
        <FlexibleHall
          zone={activeZone}
          onTableClick={handleTableClick}
          onCreateDynamicOrder={handleCreateDynamicOrder}
        />
      ) : (
        <StaticHall 
          zone={activeZone} 
          onTableClick={handleTableClick} 
        />
      )}
    </FlexLayout>
  );
}
