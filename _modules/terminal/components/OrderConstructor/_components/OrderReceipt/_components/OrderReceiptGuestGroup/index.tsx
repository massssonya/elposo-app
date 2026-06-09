'use client';

import { memo } from 'react';

import { OrderReceiptCardItem } from '../OrderReceiptCardItem'
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { OrderItem } from '@shared/types/menu';

import styles from './OrderReceiptGuestGroup.module.css';

interface GuestGroupProps {
    guest: OrderGuest;
    isActive: boolean;
    guestItems: OrderItem[];
    guestTotal: number;
    tableId: string;
  }
  
export const OrderReceiptGuestGroup = memo(({ guest, isActive, guestItems, guestTotal, tableId }: GuestGroupProps) => {
    return (
      <div className={`${styles.guestGroup} ${isActive ? styles.activeGroup : ''}`}>
        <FlexLayout justify="between" align="center" className={styles.guestGroupHeader}>
          <h4>{guest.name}</h4>
          {isActive && <span className={styles.activeBadge}>Ввод заказа</span>}
        </FlexLayout>
        
        {guestItems.length > 0 ? (
          guestItems.map((item) => (
            <OrderReceiptCardItem 
              key={item.id} 
              item={item} 
              tableId={tableId}
            />
          ))
        ) : (
          <div className={styles.emptyGuestText}>Ничего не выбрано</div>
        )}

      {guestTotal > 0 && (
        <FlexLayout justify="between" align="center" className={styles.guestGroupFooter}>
          <span className={styles.guestTotalLabel}>Итого по гостю:</span>
          <span className={styles.guestTotalAmount}>{guestTotal} ₽</span>
        </FlexLayout>
      )}
      </div>
    );
  });
  
  OrderReceiptGuestGroup.displayName = 'OrderReceiptGuestGroup';