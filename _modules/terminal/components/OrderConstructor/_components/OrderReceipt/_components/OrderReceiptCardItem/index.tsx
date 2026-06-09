'use client';

import { memo, useState } from 'react';

import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { OrderItem } from '@shared/types/menu';
import { OrderReceiptCardActions } from '../OrderReceiptCardActions';
import { OrderReceiptCardComment } from '../OrderReceiptCardComment';

import styles from './OrderReceiptCardItem.module.css';

interface CardItemProps {
  item: OrderItem;
  tableId: string;
}

export const OrderReceiptCardItem = memo(({ item, tableId }: CardItemProps) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  return (
    <FlexLayout direction="col" gap="none" className={styles.receiptItemWrapper}>

      <FlexLayout justify="between" align="center" className={styles.receiptItemRow}>
        <FlexLayout direction="col" gap="xs" className={styles.itemInfo}>
          <span className={styles.itemName}>{item.name}</span>
          <span className={styles.itemPrice}>{item.price} ₽</span>
        </FlexLayout>

        <OrderReceiptCardActions
          tableId={tableId}
          itemId={item.id}
          quantity={item.quantity}
          hasComment={Boolean(item.comment)}
          isCommentOpen={isCommentOpen}
          onToggleComment={() => setIsCommentOpen((prev) => !prev)}
        />
      </FlexLayout>

      <OrderReceiptCardComment 
        tableId={tableId}
        itemId={item.id}
        comment={item.comment}
        isOpen={isCommentOpen}
      />
      
    </FlexLayout>
  );
});

OrderReceiptCardItem.displayName = 'OrderReceiptCardItem';
