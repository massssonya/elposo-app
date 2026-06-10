'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { OrderReceipt } from './_components/OrderReceipt';
import { MenuCatalog } from './_components/MenuCatalog';

import { useTableStore } from '@shared/stores/tableStore';
import { useOrderStore } from '@shared/stores/useOrderStore';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { Button } from '@shared/components/UI/Button';
import { ROUTES } from '@shared/constants/routes';

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

  const handleSuccessTransfer = (newTableId: string) => {
    setIsTransferOpen(false);
    router.replace(ROUTES.TERMINAL.ORDER(newTableId));
  };

  if (!currentTable) {
    return <div className={styles.screen}>Загрузка данных заказа...</div>;
  }

  return (
    <FlexLayout direction="col" className={styles.screen}>
      <FlexLayout justify="between" align="center" className={styles.topBar}>
        <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => router.push(ROUTES.TERMINAL.MAIN)}
          >
            ← Назад к залу
        </Button>
        <div className={styles.tableTitle}>
          Оформление заказа — {currentTable.isDynamic ? 'Трекер' : 'Стол'} №{currentTable.number}
        </div>

        {hasItems && (
          <Button 
            variant="warning" 
            size="sm" 
            onClick={() => setIsTransferOpen(true)}
         >
           🔄 Перенести заказ
         </Button>
        )}
      </FlexLayout>

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
