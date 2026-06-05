'use client';

import React, { useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { OrderReceipt } from './_components/OrderReceipt';
import { MenuCatalog } from './_components/MenuCatalog';
import { TransferModal } from './_components/TransferModal';
import { useTableStore } from '@shared/stores/tableStore';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { ROUTES } from '@shared/constants/routes';

import styles from './OrderConstructor.module.css';

export function OrderConstructor() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.id as string;

  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const currentTable = useTableStore((state) => state.getTableById(tableId));

  const handleSuccessTransfer = (newTableId: string) => {
    setIsTransferOpen(false);
    router.replace(ROUTES.TERMINAL.ORDER(newTableId));
  };

  return (
    <FlexLayout direction="col" className={styles.screen}>
      {/* Верхний сервисный бар */}
      <FlexLayout justify="between" align="center" className={styles.topBar}>
        <button 
          onClick={() => router.push(ROUTES.TERMINAL.MAIN)} 
          className={styles.backBtn}
        >
          ← Назад к залу
        </button>
        <div className={styles.tableTitle}>Оформление заказа — Стол {tableId}</div>

        <button 
          onClick={() => setIsTransferOpen(true)} 
          className="px-4 h-10 bg-amber-600 hover:bg-amber-500 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          🔄 Перенести заказ
        </button>
      </FlexLayout>

      {/* Основной двухпанельный лейаут */}
      <FlexLayout direction="row" gap="lg" className="flex-1 overflow-hidden p-4">
        <OrderReceipt tableId={tableId} />
        <MenuCatalog tableId={tableId} />
      </FlexLayout>
      {
        isTransferOpen &&
          <TransferModal
            isOpen={isTransferOpen}
            currentTableId={tableId}
            onClose={() => setIsTransferOpen(false)}
            onSuccessTransfer={handleSuccessTransfer}
          />
      }
    </FlexLayout>
  );
}