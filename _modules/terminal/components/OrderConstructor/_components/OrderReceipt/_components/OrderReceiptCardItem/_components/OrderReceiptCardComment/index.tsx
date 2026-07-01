'use client';

import { memo } from 'react';

import { useOrderManager } from '@shared/hooks';

import styles from './OrderReceiptCardComment.module.css';

interface CardCommentProps {
  tableId: string;
  itemId: string;
  comment?: string;
  isOpen: boolean;
}

export const OrderReceiptCardComment = memo(({ tableId, itemId, comment, isOpen }: CardCommentProps) => {
  const { updateComment: updateOrderItemComment } = useOrderManager(tableId)

  if (!isOpen && !comment) return null;

  return (
    <>
      {!isOpen && comment && (
        <div className={styles.savedCommentBadge}>
          <span className={styles.commentLabel}>Заметка:</span> {comment}
        </div>
      )}

      {isOpen && (
        <div className={styles.commentSection}>
          <textarea
            className={styles.commentInput}
            placeholder="Пожелания к блюду..."
            value={comment || ''}
            onChange={(e) => updateOrderItemComment(itemId, e.target.value)}
            rows={2}
            autoFocus
          />
        </div>
      )}
    </>
  );
});

OrderReceiptCardComment.displayName = 'OrderReceiptCardComment';
