'use client';

import { useMemo } from 'react';

import { useOrderStore } from '@shared/stores/useOrderStore';
import { Table } from '@shared/types/tables';

interface UseTableCardProps {
  table: Table;
}

export function useTableCard({ table }: UseTableCardProps) {
  const tableOrder = useOrderStore((state) => state.ordersByTable[table.id]);
  const currentItems = tableOrder?.items || [];

  const totalItemsCount = useMemo(() => {
    return currentItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [currentItems]);

  return {
    tableOrder,
    currentItems,
    totalItemsCount,
  };
}
