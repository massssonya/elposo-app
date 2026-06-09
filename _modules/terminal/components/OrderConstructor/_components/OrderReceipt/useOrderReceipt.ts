'use client';

import { useMemo, useEffect } from 'react';
import { useOrderStore } from '@shared/stores/orderStore';

interface UseOrderReceiptProps {
  tableId: string;
}

export function useOrderReceipt({ tableId }: UseOrderReceiptProps) {
  const currentItems = useOrderStore((state) => state.getTableItems(tableId));
  const guests = useOrderStore((state) => state.getTableGuests(tableId));
  const addGuestToTable = useOrderStore((state) => state.addGuestToTable);
  const setActiveGuest = useOrderStore((state) => state.setActiveGuest);

  const activeGuestId = useOrderStore(
    (state) => state.activeGuestIdByTable[tableId] || guests[0]?.id || 'g_1'
  );

  const firstGuestId = guests[0]?.id;

  useEffect(() => {
    const hasActiveGuestSet = useOrderStore.getState().activeGuestIdByTable[tableId];
    if (!hasActiveGuestSet && firstGuestId) {
      setActiveGuest(tableId, firstGuestId);
    }
  }, [tableId, firstGuestId, setActiveGuest]);

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
    const newGuestId = addGuestToTable(tableId);
    setActiveGuest(tableId, newGuestId);
  };

  const handleSelectGuest = (id: string | number) => {
    setActiveGuest(tableId, id as string);
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
  };
}
