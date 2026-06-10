import { StateCreator } from 'zustand';
import { OrderStoreState, GuestSlice } from './types';
import { OrderGuest } from '@shared/types/orders';

export const DEFAULT_GUESTS_ARRAY: OrderGuest[] = [{ id: 'g_1', name: 'Гость 1' }];

export const createGuestSlice: StateCreator<
  OrderStoreState,
  [['rxjs/slices', unknown]],
  [],
  GuestSlice
> = (set, get) => ({
  guestsByTable: {},
  activeGuestIdByTable: {},

  getTableGuests: (tableId) => {
    const guests = get().guestsByTable[tableId];
    if (!guests || guests.length === 0) {
      return DEFAULT_GUESTS_ARRAY;
    }
    return guests;
  },

  setActiveGuest: (tableId, guestId) => {
    set((state) => ({
      activeGuestIdByTable: {
        ...state.activeGuestIdByTable,
        [tableId]: guestId,
      },
    }));
  },

  addGuestToTable: (tableId) => {
    const currentGuests = get().getTableGuests(tableId);
    
    let maxNumber = 0;
    
    currentGuests.forEach((guest) => {
      const match = guest.name.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    const nextNumber = maxNumber > 0 ? maxNumber + 1 : currentGuests.length + 1;

    const newGuest: OrderGuest = {
      id: `g_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: `Гость ${nextNumber}`,
    };

    set((state) => ({
      guestsByTable: {
        ...state.guestsByTable,
        [tableId]: [...currentGuests, newGuest],
      },
    }));

    return newGuest.id;
  },

  removeGuestFromTable: (tableId, guestId) => {
    const currentGuests = get().getTableGuests(tableId);
    
    if (currentGuests.length <= 1) return;

    const tableItems = get().getTableItems(tableId);
    const orderStatus = get().getOrderStatus(tableId);
    
    const hasItems = tableItems.some((item) => item.guestId === guestId);

    if (hasItems && orderStatus !== OrderStatus.DRAFT) {
      console.warn('Нельзя удалить гостя с блюдами, если заказ уже отправлен на кухню');
      return;
    }

    const updatedGuests = currentGuests.filter((g) => g.id !== guestId);

    set((state) => {
      const nextActiveGuestIdByTable = { ...state.activeGuestIdByTable };
      const nextOrdersByTable = { ...state.ordersByTable };

      if (nextActiveGuestIdByTable[tableId] === guestId) {
        nextActiveGuestIdByTable[tableId] = updatedGuests[0].id;
      }

      if (hasItems && nextOrdersByTable[tableId]) {
        nextOrdersByTable[tableId] = {
          ...nextOrdersByTable[tableId]!,
          items: tableItems.filter((item) => item.guestId !== guestId),
        };
      }

      return {
        guestsByTable: {
          ...state.guestsByTable,
          [tableId]: updatedGuests,
        },
        ordersByTable: nextOrdersByTable,
        activeGuestIdByTable: nextActiveGuestIdByTable,
      };
    });
  },
});
