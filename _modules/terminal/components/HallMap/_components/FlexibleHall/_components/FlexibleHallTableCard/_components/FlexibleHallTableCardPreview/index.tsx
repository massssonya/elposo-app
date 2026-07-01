'use client';

import { memo, useMemo } from 'react';

import { OrderItem } from '@shared/types/orders';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { Popover, PopoverCoords } from '@shared/components/UI/Popover';
import { useOrderPreview } from './useOrderPreview';

import styles from './FlexibleHallTableCardPreview.module.css';

interface PreviewProps {
  items: OrderItem[];
  isVisible: boolean;
  coords: PopoverCoords;
  position: 'top' | 'bottom';
}

const MAX_VISIBLE_PREVIEW_ITEMS = 5;

export const FlexibleHallTableCardPreview = memo(({ items, isVisible, coords, position }: PreviewProps) => {
    const { isEmpty, visibleItems, hasMore, moreText } = useOrderPreview({
      items,
      maxVisibleItems: MAX_VISIBLE_PREVIEW_ITEMS
    });
  
    return (
      <Popover isOpen={isVisible} coords={coords} position={position} width={240}>
        <div className={styles.previewTitle}>Сводный заказ:</div>
        
        {isEmpty ? (
          <div className={styles.previewEmpty}>В чеке пока нет блюд</div>
        ) : (
          <FlexLayout direction="col" gap="xs" className={styles.previewList}>
            {visibleItems.map((item, index) => (
              <FlexLayout key={index} justify="between" align="center" className={styles.previewItem}>
                <span className={styles.previewItemName}>{item.name}</span>
                <span className={styles.previewItemQty}>x{item.quantity}</span>
              </FlexLayout>
            ))}
            
            {hasMore && (
              <div className={styles.previewMoreIndicator}>
                {moreText}
              </div>
            )}
          </FlexLayout>
        )}
      </Popover>
    );
  });
  
  FlexibleHallTableCardPreview.displayName = 'FlexibleHallTableCardPreview';
