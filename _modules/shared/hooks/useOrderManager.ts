import { useCallback } from 'react';

import { useOrderStore } from '@shared/stores/orderStore';
import { useOrderFacade } from '@shared/hooks';

export const useOrderManager = (tableId: string) => {
  const store = useOrderStore();
  const facade = useOrderFacade();

  const getItems = useCallback(() => {
    return store.getTableItems(tableId);
  }, [store, tableId]);

  const getGuests = useCallback(() => {
    return store.getTableGuests(tableId);
  }, [store, tableId]);

  const addItem = useCallback((menuItem: any, guestId: string, modifiers?: any[]) => {
    store.addOrderItem(tableId, menuItem, guestId, modifiers);
  }, [store, tableId]);

  const removeItem = useCallback((itemId: string) => {
    store.removeOrderItem(tableId, itemId);
  }, [store, tableId]);

  const updateQuantity = useCallback((itemId: string, delta: number) => {
    store.updateOrderItemQuantity(tableId, itemId, delta);
  }, [store, tableId]);

  const updateComment = useCallback((itemId: string, comment: string) => {
    store.updateOrderItemComment(tableId, itemId, comment);
  }, [store, tableId]);

  const addGuest = useCallback(() => {
    return store.addGuestToTable(tableId);
  }, [store, tableId]);

  const removeGuest = useCallback((guestId: string) => {
    store.removeGuestFromTable(tableId, guestId);
  }, [store, tableId]);

  const transferOrder = useCallback((toTableId: string) => {
    facade.transferOrder(tableId, toTableId);
  }, [facade, tableId]);

  const removeGuestWithItems = useCallback((guestId: string) => {
    facade.removeGuestWithItems(tableId, guestId);
  }, [facade, tableId]);

  const splitOrder = useCallback(() => {
    facade.splitOrderByGuests(tableId);
  }, [facade, tableId]);

  const bulkAddItems = useCallback((items: Array<{ menuItem: any; guestId: string; modifiers?: any[] }>) => {
    facade.bulkAddItems(tableId, items);
  }, [facade, tableId]);

  const clearOrder = useCallback(() => {
    store.clearOrder(tableId);
  }, [store, tableId]);

  return {
    items: getItems(),
    guests: getGuests(),
    activeGuestId: store.activeGuestIdByTable[tableId],
    orderStatus: store.getOrderStatus(tableId),
    
    addItem,
    removeItem,
    updateQuantity,
    updateComment,
    addGuest,
    removeGuest,
    clearOrder,
    
    transferOrder,
    removeGuestWithItems,
    splitOrder,
    bulkAddItems,
  };
};