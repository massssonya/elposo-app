'use client';

import { useMemo, useEffect, memo } from 'react';

import { OrderReceiptGuestGroup } from './_components/OrderReceiptGuestGroup'
import { OrderReceiptFooter } from './_components/OrderReceiptFooter'

import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { Button } from '@shared/components/UI/Button';
import { TabsGroup } from '@shared/components/UI/TabsGroup';
import { useOrderReceipt } from "./useOrderReceipt"

import styles from './OrderReceipt.module.css';

interface Props {
  tableId: string;
}

export function OrderReceipt({ tableId }: Props) {
  const {
    guests,
    activeGuestId,
    itemsByGuest,
    totalPriceByGuest,
    totalPrice,
    isDisabledSendToKitchen,
    handleAddGuest,
    handleSelectGuest,
    handleRemoveGuest
  } = useOrderReceipt({ tableId });

  return (
    <FlexLayout direction="col" className={styles.receiptContainer}>
      <FlexLayout justify="between" align="center" className={styles.header}>
        <h3>Текущий чек</h3>
        <Button size="sm" variant="secondary" onClick={handleAddGuest}>
          👤 + Добавить гостя
        </Button>
      </FlexLayout>

      <FlexLayout direction='col' gap="sm" className={styles.guestSelectorBlock}>
        <span className={styles.selectorLabel}>Сейчас выбирает:</span>
        <TabsGroup
          items={guests}
          activeId={activeGuestId}
          onSelect={handleSelectGuest}
          renderLabel={(g) => g.name}
        />
      </FlexLayout>

      <FlexLayout direction="col" className={styles.itemsList}>

      {guests.map((guest) => (
          <OrderReceiptGuestGroup
            key={guest.id}
            guest={guest}
            isActive={guest.id === activeGuestId}
            guestItems={itemsByGuest[guest.id] || []}
            guestTotal={totalPriceByGuest[guest.id] || 0}
            tableId={tableId}
            removeGuest={() => handleRemoveGuest(guest.id)}
            isOnlyGuest={guests.length === 1}
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
