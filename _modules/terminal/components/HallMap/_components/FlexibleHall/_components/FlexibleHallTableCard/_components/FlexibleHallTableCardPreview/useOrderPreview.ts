'use client';

import { useMemo } from 'react';

import { OrderItem } from '@shared/types/orders';
import { pluralize } from '@shared/helpers/pluralize';

interface UseOrderPreviewProps {
  items: OrderItem[];
  maxVisibleItems: number;
}

export interface AggregatedPreviewItem {
  name: string;
  quantity: number;
}

export function useOrderPreview({ items, maxVisibleItems }: UseOrderPreviewProps) {
  
  const mergedItems = useMemo(() => {
    if (items.length === 0) return [];

    const aggregated: Record<string, AggregatedPreviewItem> = {};

    items.forEach((item) => {
      if (!aggregated[item.menuItemId]) {
        aggregated[item.menuItemId] = {
          name: item.name,
          quantity: 0,
        };
      }
      aggregated[item.menuItemId].quantity += item.quantity;
    });

    return Object.values(aggregated);
  }, [items]);

  const hiddenItemsCount = mergedItems.length - maxVisibleItems;
  
  const visibleItems = useMemo(() => {
    return mergedItems.slice(0, maxVisibleItems);
  }, [mergedItems, maxVisibleItems]);

  const moreText = useMemo(() => {
    if (hiddenItemsCount <= 0) return '';
    
    const wordForm = pluralize(hiddenItemsCount, 'позиция', 'позиции', 'позиций');
    
    return `+ ещё ${hiddenItemsCount} ${wordForm}...`;
  }, [hiddenItemsCount]);

  return {
    isEmpty: mergedItems.length === 0,
    visibleItems,
    hasMore: hiddenItemsCount > 0,
    moreText,
  };
}
