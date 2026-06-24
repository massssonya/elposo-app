'use client';

import { memo } from 'react';

import { useOrderStore } from '@shared/stores/useOrderStore';
import { Button } from '@shared/components/UI/Button';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';

import styles from './OrderReceiptCardActions.module.css';

interface CardActionsProps {
  tableId: string;
  itemId: string;
  quantity: number;
  hasComment: boolean;
  isCommentOpen: boolean;
  onToggleComment: () => void;
}

export const OrderReceiptCardActions = memo(({
  tableId,
  itemId,
  quantity,
  hasComment,
  isCommentOpen,
  onToggleComment,
}: CardActionsProps) => {
  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const removeFromOrder = useOrderStore((state) => state.removeFromOrder);

  return (
    <FlexLayout align="center" gap="xs">
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={onToggleComment} 
        className={`${styles.commentToggleBtn} ${hasComment ? styles.hasComment : ''} ${isCommentOpen ? styles.commentActive : ''}`}
        title="Добавить комментарий к блюду"
      >
        💬
      </Button>

      <Button size="sm" onClick={() => updateQuantity(tableId, itemId, -1)} className={styles.qtyBtn}>-</Button>
      <span className={styles.qtyValue}>{quantity}</span>
      <Button size="sm" onClick={() => updateQuantity(tableId, itemId, 1)} className={styles.qtyBtn}>+</Button>
      <Button size="sm" onClick={() => removeFromOrder(tableId, itemId)} className={styles.deleteBtn}>🗑️</Button>
    </FlexLayout>
  );
});

OrderReceiptCardActions.displayName = 'OrderReceiptCardActions';
