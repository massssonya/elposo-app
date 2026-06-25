'use client';

import { memo } from 'react';

import { useOrderStore } from '@shared/stores/useOrderStore';
import { Button } from '@shared/components/UI/Button';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { OrderItemStatus } from '@shared/types/orders';

import styles from './OrderReceiptCardActions.module.css';

interface CardActionsProps {
  tableId: string;
  itemId: string;
  itemStatus: OrderItemStatus;
  quantity: number;
  hasComment: boolean;
  isCommentOpen: boolean;
  onToggleComment: () => void;
}

export const OrderReceiptCardActions = memo(({
  tableId,
  itemId,
  itemStatus,
  quantity,
  hasComment,
  isCommentOpen,
  onToggleComment,
}: CardActionsProps) => {
  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const removeFromOrder = useOrderStore((state) => state.removeFromOrder);

  const isDisabled = itemStatus !== OrderItemStatus.DRAFT

  return (
    <FlexLayout align="center" gap="xs">
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={onToggleComment} 
        className={`${styles.commentToggleBtn} ${hasComment ? styles.hasComment : ''} ${isCommentOpen ? styles.commentActive : ''}`}
        title="Добавить комментарий к блюду"
        disabled={isDisabled}
      >
        💬
      </Button>

      <Button size="sm" onClick={() => updateQuantity(tableId, itemId, -1)} className={styles.qtyBtn} disabled={isDisabled}>-</Button>
      <span className={styles.qtyValue}>{quantity}</span>
      <Button size="sm" onClick={() => updateQuantity(tableId, itemId, 1)} className={styles.qtyBtn} disabled={isDisabled}>+</Button>
      <Button size="sm" onClick={() => removeFromOrder(tableId, itemId)} className={styles.deleteBtn} disabled={isDisabled}>🗑️</Button>
    </FlexLayout>
  );
});

OrderReceiptCardActions.displayName = 'OrderReceiptCardActions';
