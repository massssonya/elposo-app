'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useOrderStore } from '@shared/stores/useOrderStore';
import { useTableStore } from '@shared/stores/tableStore';
import { TableStatus } from '@shared/types/tables';
import { ROUTES } from '@shared/constants/routes';

interface OrderGuardProps {
  children: React.ReactNode;
}

export function OrderGuard({ children }: OrderGuardProps) {
  const params = useParams();
  const router = useRouter();
  const tableId = params.id as string;
  
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!tableId) {
      setIsVerified(true);
      return;
    }

    const orderExists = useOrderStore.getState().ordersByTable[tableId];
    const currentTable = useTableStore.getState().getTableById(tableId);

    if (!currentTable) {
      router.replace(ROUTES.TERMINAL.MAIN('Ошибка: Стол не существует'));
      return;
    }

    const isTableOccupiedWithoutOrder = 
        !currentTable.isDynamic && 
        currentTable.status === TableStatus.OCCUPIED && 
        !orderExists;

    if (isTableOccupiedWithoutOrder) {
      router.replace(ROUTES.TERMINAL.MAIN('Ошибка доступа: заказ отсутствует или был отменен'));
    } else {
      setIsVerified(true);
    }
  }, [tableId, router]);

  if (!isVerified) {
    return null; 
  }

  return <>{children}</>;
}
