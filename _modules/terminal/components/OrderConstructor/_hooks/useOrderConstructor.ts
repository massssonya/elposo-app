'use client';

import { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTableStore } from '@shared/stores/tableStore';
import { useOrderStore } from '@shared/stores/useOrderStore';
import { orderOrchestrator } from '@shared/services/orders.service';
import { ROUTES } from '@shared/constants/routes';

interface UseOrderConstructorProps {
  closeTransferModal: () => void;
}

export function useOrderConstructor({ closeTransferModal }: UseOrderConstructorProps) {
  const params = useParams();
  const router = useRouter();
  const tableId = params.id as string;

  const currentTable = useTableStore((state) => state.getTableById(tableId));
  const hasItems = useOrderStore((state) => state.getTableItems(tableId).length > 0);

  const handleBack = useCallback(() => {
    router.push(ROUTES.TERMINAL.MAIN);
  }, [router]);

  const handleSuccessTransfer = useCallback((newTableId: string) => {
    closeTransferModal();
    router.replace(ROUTES.TERMINAL.ORDER(newTableId));
  }, [router, closeTransferModal]);

  const handleCancelOrder = useCallback(() => {
    const result = orderOrchestrator.cancelOrCloseDraftOrder(tableId);
    if (result?.success) {
      router.push(ROUTES.TERMINAL.MAIN);
    }
  }, [tableId, router]);

  return {
    tableId,
    currentTable,
    hasItems,
    handleBack,
    handleSuccessTransfer,
    handleCancelOrder,
  };
}
