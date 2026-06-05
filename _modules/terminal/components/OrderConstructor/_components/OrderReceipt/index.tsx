'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useOrderStore } from '@shared/stores/orderStore';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import styles from './OrderReceipt.module.css';

interface Props {
  tableId: string;
}

export function OrderReceipt({ tableId }: Props) {
  const [isHydrated, setIsHydrated] = useState(false);

  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const removeFromOrder = useOrderStore((state) => state.removeFromOrder);

  const ordersByTable = useOrderStore((state) => state.ordersByTable);

  const currentItems = useMemo(() => {
    return ordersByTable[tableId] || [];
  }, [ordersByTable, tableId]);

  const totalPrice = useMemo(() => {
    return currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [currentItems]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div className={styles.receiptContainer}>Загрузка чека...</div>;
  }

  return (
    <FlexLayout direction="col" className={styles.receiptContainer}>
      <div className={styles.header}>Текущий чек</div>

      <FlexLayout direction="col" className={styles.itemsList}>
        {currentItems.map((item) => (
          <FlexLayout key={item.id} justify="between" align="center" className={styles.receiptItem}>
            <FlexLayout direction='col' gap='xs' className={styles.itemInfo}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemPrice}>{item.price} ₽</span>
            </FlexLayout>

            <FlexLayout align="center" gap="xs">
              <button onClick={() => updateQuantity(tableId, item.id, -1)} className={styles.qtyBtn}>-</button>
              <span className={styles.qtyValue}>{item.quantity}</span>
              <button onClick={() => updateQuantity(tableId, item.id, 1)} className={styles.qtyBtn}>+</button>
              <button onClick={() => removeFromOrder(tableId, item.id)} className={styles.deleteBtn}>🗑️</button>
            </FlexLayout>
          </FlexLayout>
        ))}

        {currentItems.length === 0 && (
          <div className={styles.emptyText}>Чек пуст. Выберите блюда из меню справа.</div>
        )}
      </FlexLayout>

      <FlexLayout direction='col' gap="md" className={styles.footer}>
        <FlexLayout justify="between" align="center" className={styles.totalRow}>
          <span className={styles.totalLabel}>Итого к оплате:</span>
          <span className={styles.totalAmount}>{totalPrice} ₽</span>
        </FlexLayout>
        
        <button disabled={currentItems.length === 0} className={styles.submitBtn}>
          Отправить на кухню
        </button>
      </FlexLayout>
    </FlexLayout>
  );
}
