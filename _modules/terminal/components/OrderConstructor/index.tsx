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

const CancelModal = dynamic(
  () => import('./_components/CancelModal').then((mod) => mod.CancelModal),
  { ssr: false } 
);

export default function OrderConstructor() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.id as string;

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const currentTable = useTableStore((state) => state.getTableById(tableId));
  const hasItems = useOrderStore((state) => state.getTableItems(tableId).length > 0);

  const handleBack = useCallback(() => {
    router.push(ROUTES.TERMINAL.MAIN);
  }, [router]);

  const handleTransferOpen = useCallback(() => {
    setIsTransferOpen(true);
  }, []);

  const handleTransferClose = useCallback(() => setIsTransferOpen(false), []);

  const handleSuccessTransfer = useCallback((newTableId: string) => {
    setIsTransferOpen(false);
    router.replace(ROUTES.TERMINAL.ORDER(newTableId));
  }, [router]);

  const handleCancelOrder = useCallback(() => {
    const result = orderOrchestrator.cancelOrCloseDraftOrder(tableId);
    if (result?.success) {
      router.push(ROUTES.TERMINAL.MAIN);
    }
  }, [tableId, router]);

  const handleCancelOpen = useCallback(() => setIsCancelOpen(true), []);
  const handleCancelClose = useCallback(() => setIsCancelOpen(false), []);

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
        onCancel={handleCancelOpen}
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
          onClose={handleTransferClose}
          onSuccessTransfer={handleSuccessTransfer}
        />
      )}
      {isCancelOpen && (
        <CancelModal
          isOpen={isCancelOpen}
          onClose={handleCancelClose}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </FlexLayout>
  );
}
