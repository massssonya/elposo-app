'use client';

import { useMemo } from 'react';
import { useOrderStore } from '@shared/stores/orderStore';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { Button } from '@shared/components/UI/Button';

import styles from './OrderReceipt.module.css';

interface Props {
  tableId: string;
}

export function OrderReceipt({ tableId }: Props) {
  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const removeFromOrder = useOrderStore((state) => state.removeFromOrder);

  const ordersByTable = useOrderStore((state) => state.ordersByTable);

  const currentItems = useMemo(() => {
    return ordersByTable[tableId] || [];
  }, [ordersByTable, tableId]);

  const totalPrice = useMemo(() => {
    return currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [currentItems]);

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
              <Button size='sm' onClick={() => updateQuantity(tableId, item.id, -1)} className={styles.qtyBtn}>-</Button>
              <span className={styles.qtyValue}>{item.quantity}</span>
              <Button size='sm' onClick={() => updateQuantity(tableId, item.id, 1)} className={styles.qtyBtn}>+</Button>
              <Button size='sm' onClick={() => removeFromOrder(tableId, item.id)} className={styles.deleteBtn}>🗑️</Button>
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
        
        <Button disabled={currentItems.length === 0} className={styles.submitBtn}>
          Отправить на кухню
        </Button>
      </FlexLayout>
    </FlexLayout>
  );
}
