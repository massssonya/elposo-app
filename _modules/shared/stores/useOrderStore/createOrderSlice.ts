import { StateCreator } from 'zustand';

import { OrderStoreState, OrderSlice, TableOrder } from './types';
import { OrderItem, OrderStatus, OrderItemModifier, OrderItemStatus } from '@shared/types/orders';

const areModifiersEqual = (mods1: OrderItemModifier[] = [], mods2: OrderItemModifier[] = []) => {
  if (mods1.length !== mods2.length) return false;
  const ids1 = mods1.map(m => m.id).sort();
  const ids2 = mods2.map(m => m.id).sort();
  return ids1.every((id, index) => id === ids2[index]);
};

export const INIT_TABLE_ITEMS: OrderItem[] = [];

export const createOrderSlice: StateCreator<
  OrderStoreState,
  [['rxjs/slices', unknown]],
  [],
  OrderSlice
> = (set, get) => ({
  ordersByTable: {},

  getTableItems: (tableId) => {
    return get().ordersByTable[tableId]?.items || INIT_TABLE_ITEMS;
  },

  getOrderStatus: (tableId) => {
    return get().ordersByTable[tableId]?.status || OrderStatus.DRAFT;
  },

  initTableOrder: (tableId) => {
    const currentOrder = get().ordersByTable[tableId];
    if (currentOrder) return;

    const newOrder: TableOrder = {
      id: `ord_${Date.now()}`,
      tableId,
      status: OrderStatus.DRAFT,
      items: [],
      createdAt: Date.now(),
    };

    set((state) => ({
      ordersByTable: { ...state.ordersByTable, [tableId]: newOrder },
    }));
  },

  addToOrder: (tableId, menuItem, guestId, selectedModifiers = []) => {
    get().initTableOrder(tableId);
    const order = get().ordersByTable[tableId]!;

    if (order.status !== OrderStatus.DRAFT && order.status !== OrderStatus.IN_PROGRESS) {
      console.warn('Нельзя добавить блюдо в текущем статусе заказа');
      return;
    }

    const tableItems = order.items;
    
    const existingItem = tableItems.find(
      (item) => 
        item.menuItemId === menuItem.id && 
        item.guestId === guestId &&
        areModifiersEqual(item.modifiers, selectedModifiers)
    );

    let updatedItems: OrderItem[];

    if (existingItem) {
      updatedItems = tableItems.map((item) =>
        item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      const modifiersSum = selectedModifiers.reduce((sum, m) => sum + m.price, 0);
      const finalPrice = menuItem.price + modifiersSum;

      const newItem: OrderItem = {
        id: `oi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: finalPrice,
        quantity: 1,
        guestId,
        modifiers: selectedModifiers.length > 0 ? selectedModifiers : undefined,
        status: OrderItemStatus.DRAFT
      };
      updatedItems = [...tableItems, newItem];
    }

    set((state) => ({
      ordersByTable: {
        ...state.ordersByTable,
        [tableId]: { ...state.ordersByTable[tableId]!, items: updatedItems },
      },
    }))
  },

  removeFromOrder: (tableId, orderItemId) => {
    const order = get().ordersByTable[tableId];
    if (!order) return;

    set((state) => ({
      ordersByTable: {
        ...state.ordersByTable,
        [tableId]: { ...state.ordersByTable[tableId]!, items: order.items.filter((item) => item.id !== orderItemId) },
      },
    }));
  },

  updateQuantity: (tableId, orderItemId, delta) => {
    const order = get().ordersByTable[tableId];
    if (!order) return;

    const updatedItems = order.items
      .map((item) => (item.id !== orderItemId ? item : { ...item, quantity: item.quantity + delta }))
      .filter((item) => item.quantity > 0);

    set((state) => ({
      ordersByTable: {
        ...state.ordersByTable,
        [tableId]: { ...state.ordersByTable[tableId]!, items: updatedItems },
      },
    }));
  },

  updateItemComment: (tableId, orderItemId, comment) => {
    const order = get().ordersByTable[tableId];
    if (!order) return;

    const updatedItems = order.items.map((item) => {
      if (item.id !== orderItemId) return item;
      return { ...item, comment };
    });

    set((state) => ({
      ordersByTable: {
        ...state.ordersByTable,
        [tableId]: { ...state.ordersByTable[tableId]!, items: updatedItems },
      },
    }));
  },

  updateOrderStatus: (tableId, status) => {
    const order = get().ordersByTable[tableId];
    if (!order) return;

    set((state) => ({
      ordersByTable: {
        ...state.ordersByTable,
        [tableId]: { ...state.ordersByTable[tableId]!, status },
      },
    }));
  },

  clearOrder: (tableId) => {
    set((state) => {
      const newOrders = { ...state.ordersByTable };
      delete newOrders[tableId];

      const newGuests = { ...state.guestsByTable };
      delete newGuests[tableId];

      const newActiveGuests = { ...state.activeGuestIdByTable };
      delete newActiveGuests[tableId];

      return {
        ordersByTable: newOrders,
        guestsByTable: newGuests,
        activeGuestIdByTable: newActiveGuests,
      };
    });
  },

  transferOrder: (fromTableId, toTableId) => {
    const sourceOrder = get().ordersByTable[fromTableId];
    if (!sourceOrder || sourceOrder.items.length === 0) return;

    const targetOrder = get().ordersByTable[toTableId];
    const sourceGuests = get().getTableGuests(fromTableId);
    const targetGuests = get().guestsByTable[toTableId] || [];
    const targetGuestsCount = targetGuests.length;

    const guestIdMap: Record<string, string> = {};
    const remappedSourceGuests: typeof sourceGuests = [];

    sourceGuests.forEach((sourceGuest, index) => {
      const newGuestId = `g_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      guestIdMap[sourceGuest.id] = newGuestId;
      const nextGuestNumber = targetGuestsCount + index + 1;

      remappedSourceGuests.push({
        id: newGuestId,
        name: `Гость ${nextGuestNumber}`,
      });
    });

    const finalGuests = [...targetGuests, ...remappedSourceGuests];
    const sourceItems = sourceOrder.items;
    const targetItems = targetOrder?.items || [];
    const mergedItems = [...targetItems];

    sourceItems.forEach((sourceItem) => {
      const remappedGuestId = guestIdMap[sourceItem.guestId] || sourceItem.guestId;
      
      const existingItem = mergedItems.find(
        (item) => 
          item.menuItemId === sourceItem.menuItemId && 
          item.guestId === remappedGuestId &&
          areModifiersEqual(item.modifiers, sourceItem.modifiers)
      );

      if (existingItem) {
        existingItem.quantity += sourceItem.quantity;
      } else {
        mergedItems.push({ ...sourceItem, guestId: remappedGuestId });
      }
    });

    set((state) => {
      const updatedOrders = { ...state.ordersByTable };
      updatedOrders[toTableId] = {
        id: targetOrder?.id || `ord_${Date.now()}`,
        tableId: toTableId,
        status: targetOrder?.status || sourceOrder.status,
        items: mergedItems,
        createdAt: targetOrder?.createdAt || Date.now(),
      };
      delete updatedOrders[fromTableId];

      const updatedGuestsMap = { ...state.guestsByTable };
      updatedGuestsMap[toTableId] = finalGuests;
      delete updatedGuestsMap[fromTableId];

      const updatedActiveGuests = { ...state.activeGuestIdByTable };
      delete updatedActiveGuests[fromTableId];
      if (finalGuests.length > 0) {
        updatedActiveGuests[toTableId] = finalGuests[0].id;
      }

      return {
        ordersByTable: updatedOrders,
        guestsByTable: updatedGuestsMap,
        activeGuestIdByTable: updatedActiveGuests,
      };
    });
  },
});
