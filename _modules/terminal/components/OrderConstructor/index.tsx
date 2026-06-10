'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { OrderReceipt } from './_components/OrderReceipt';
import { MenuCatalog } from './_components/MenuCatalog';
import { TopBar } from './_components/TopBar';

import { useTableStore } from '@shared/stores/tableStore';
import { useOrderStore } from '@shared/stores/useOrderStore';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { Button } from '@shared/components/UI/Button';
import { ROUTES } from '@shared/constants/routes';
import { orderOrchestrator } from '@shared/services/orders.service'

import styles from './OrderConstructor.module.css';

const TransferModal = dynamic(
  () => import('./_components/TransferModal').then((mod) => mod.TransferModal),
  { ssr: false } 
);

export default function OrderConstructor() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.id as string;

  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const currentTable = useTableStore((state) => state.getTableById(tableId));
  const hasItems = useOrderStore((state) => state.getTableItems(tableId).length > 0);

  const handleBack = useCallback(() => {
    router.push(ROUTES.TERMINAL.MAIN);
  }, [router]);

  const handleTransferOpen = useCallback(() => {
    setIsTransferOpen(true);
  }, []);

  const handleSuccessTransfer = useCallback((newTableId: string) => {
    setIsTransferOpen(false);
    router.replace(ROUTES.TERMINAL.ORDER(newTableId));
  }, [router]);

  const handleCancelClick = useCallback(() => {
    // TODO: Заменить на появление модального окна
    const confirmCancel = window.confirm("Вы уверены, что хотите аннулировать этот черновик заказа?");
    if (confirmCancel) {
      const result = orderOrchestrator.cancelOrCloseDraftOrder(tableId);
      if (result?.success) {
        router.push(ROUTES.TERMINAL.MAIN);
      }
    }
  }, [tableId, router]);

  if (!currentTable) {
    return <div className={styles.screen}>Загрузка данных заказа...</div>;
  }

  return (
    <FlexLayout direction="col" className={styles.screen}>
      <TopBar
        tableNumber={currentTable.number}
        isDynamic={currentTable.isDynamic}
        hasItems={hasItems}
        onBack={handleBack}
        onCancel={handleCancelClick}
        onTransfer={handleTransferOpen}
      />

      <FlexLayout direction="row" gap="lg" className={styles.mainContent}>
        <OrderReceipt tableId={tableId} />
        <MenuCatalog tableId={tableId} />
      </FlexLayout>
      
      {isTransferOpen && (
        <TransferModal
          isOpen={isTransferOpen}
          currentTableId={tableId}
          onClose={() => setIsTransferOpen(false)}
          onSuccessTransfer={handleSuccessTransfer}
        />
      )}
    </FlexLayout>
  );
}
