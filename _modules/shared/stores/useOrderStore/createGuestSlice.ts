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
    const nextNumber = currentGuests.length + 1;
    const newGuest: OrderGuest = {
      id: `g_${Date.now()}`,
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
});
