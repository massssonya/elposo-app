'use client';

import React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { OrderReceipt } from './_components/OrderReceipt';
import { MenuCatalog } from './_components/MenuCatalog';
import { FlexLayout } from '@shared/components/Layout/FlexLayout';
import { ROUTES } from '@shared/constants/routes';

import styles from './OrderConstructor.module.css';

export function OrderConstructor() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.id as string;

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
      </FlexLayout>

      {/* Основной двухпанельный лейаут */}
      <FlexLayout direction="row" gap="lg" className="flex-1 overflow-hidden p-4">
        <OrderReceipt tableId={tableId} />
        <MenuCatalog tableId={tableId} />
      </FlexLayout>
    </FlexLayout>
  );
}
