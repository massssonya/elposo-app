'use client';

import { useMemo } from 'react';

import { useOrderReceipt } from './useOrderReceipt';
import { OrderReceiptCardItem } from './_components/OrderReceiptCardItem'
import { OrderReceiptFooter } from './_components/OrderReceiptFooter'

import { useOrderStore } from '@shared/stores/orderStore';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { Button } from '@shared/components/UI/Button';
import { OrderItem } from '@shared/types/menu';

import styles from './OrderReceipt.module.css';

interface Props {
  tableId: string;
}

export function OrderReceipt({ tableId }: Props) {
  const currentItems = useOrderStore((state) => state.getTableItems(tableId));

  const totalPrice = useMemo(() => {
    return currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [currentItems]);

  const isDisabledSendToKitchen = currentItems.length === 0;

  return (
    <FlexLayout direction="col" className={styles.receiptContainer}>
      <div className={styles.header}>
        <h3>Текущий чек</h3>
      </div>

      <FlexLayout direction="col" className={styles.itemsList}>
        {currentItems.map((item) => (
          <OrderReceiptCardItem 
            key={item.id} 
            item={item} 
            tableId={tableId}
          />
        ))}

        {isDisabledSendToKitchen && (
          <div className={styles.emptyText}>
            Чек пуст. Выберите блюда из меню справа.
          </div>
        )}
      </FlexLayout>

      <OrderReceiptFooter 
        totalPrice={totalPrice} 
        isDisabledSendToKitchen={isDisabledSendToKitchen} 
      />
    </FlexLayout>
  );
}


