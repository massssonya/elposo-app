'use client';

import { useMemo, useEffect } from 'react';

import { useOrderStore } from '@shared/stores/orderStore';
import { useOrderManager } from '@shared/hooks';

interface UseOrderReceiptProps {
  tableId: string;
}

export function useOrderReceipt({ tableId }: UseOrderReceiptProps) {
  const {
    items: currentItems,
    activeGuestId,
    guests,
    addGuest: addGuestToTable,
    removeGuest: removeGuestFromTable
  } = useOrderManager(tableId)
  const setActiveGuest = useOrderStore((state) => state.setActiveGuest);

  const firstGuestId = guests[0]?.id;

  useEffect(() => {
    if (!activeGuestId && firstGuestId) {
      setActiveGuest(tableId, firstGuestId);
    }
  }, [tableId, firstGuestId, setActiveGuest, activeGuestId]);

  const { itemsByGuest, totalPriceByGuest } = useMemo(() => {
    const groups: Record<string, typeof currentItems> = {};
    const totals: Record<string, number> = {};

    currentItems.forEach((item) => {
      if (!groups[item.guestId]) groups[item.guestId] = [];
      groups[item.guestId].push(item);

      if (!totals[item.guestId]) totals[item.guestId] = 0;
      totals[item.guestId] += item.price * item.quantity;
    });

    return { itemsByGuest: groups, totalPriceByGuest: totals };
  }, [currentItems]);

  const totalPrice = useMemo(() => {
    return Object.values(totalPriceByGuest).reduce((sum, price) => sum + price, 0);
  }, [totalPriceByGuest]);

  const isDisabledSendToKitchen = currentItems.length === 0;

  const handleAddGuest = () => {
    const newGuestId = addGuestToTable();
    setActiveGuest(tableId, newGuestId);
  };

  const handleSelectGuest = (id: string | number) => {
    setActiveGuest(tableId, id as string);
  };

  const handleRemoveGuest = (guestId: string) => {
    removeGuestFromTable(guestId);
  };

  return {
    guests,
    activeGuestId,
    itemsByGuest,
    totalPriceByGuest,
    totalPrice,
    isDisabledSendToKitchen,
    handleAddGuest,
    handleSelectGuest,
    handleRemoveGuest
  };
}
