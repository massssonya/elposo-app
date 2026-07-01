import { StateCreator } from 'zustand';
import { OrderStoreState, GuestSlice } from './types';
import { GuestService } from '@shared/services/guest-service';
import { OrderGuest, OrderItem } from '@shared/types/orders';

export const DEFAULT_GUESTS_ARRAY: OrderGuest[] = [{ id: 'g_1', name: 'Гость 1' }];

export const createGuestSlice: StateCreator<
  OrderStoreState,
  [],
  [],
  GuestSlice
> = (set, get) => ({
  guestsByTable: {},
  activeGuestIdByTable: {},

  getTableGuests: (tableId: string) => {
    const guests = get().guestsByTable[tableId];
    if (!guests || guests.length === 0) {
      return DEFAULT_GUESTS_ARRAY;
    }
    return guests;
  },

  getGuestById: (tableId: string, guestId: string) => {
    const guests = get().getTableGuests(tableId);
    return guests.find(guest => guest.id === guestId);
  },

  setActiveGuest: (tableId: string, guestId: string) => {
    set((state) => ({
      activeGuestIdByTable: {
        ...state.activeGuestIdByTable,
        [tableId]: guestId,
      },
    }));
  },

  addGuestToTable: (tableId: string) => {
    const currentGuests = get().getTableGuests(tableId);
    const newGuest = GuestService.createGuest(
      GuestService.generateGuestName(currentGuests)
    );

    const updatedGuests = GuestService.addGuest(currentGuests, newGuest);

    set((state) => ({
      guestsByTable: {
        ...state.guestsByTable,
        [tableId]: updatedGuests,
      },
    }));

    return newGuest.id;
  },

  removeGuestFromTable: (tableId: string, guestId: string) => {
    const currentGuests = get().getTableGuests(tableId);
    
    try {
      const updatedGuests = GuestService.removeGuest(currentGuests, guestId);
      
      set((state) => ({
        guestsByTable: {
          ...state.guestsByTable,
          [tableId]: updatedGuests,
        },
        activeGuestIdByTable: {
          ...state.activeGuestIdByTable,
          [tableId]: updatedGuests[0]?.id,
        },
      }));
    } catch (error) {
      console.warn(error.message);
    }
  },

  updateGuestsForTable: (tableId: string, guests: OrderGuest[]) => {
    set((state) => ({
      guestsByTable: {
        ...state.guestsByTable,
        [tableId]: guests,
      },
      activeGuestIdByTable: {
        ...state.activeGuestIdByTable,
        [tableId]: guests[0]?.id,
      },
    }));
  },

  removeGuestsFromTable: (tableId: string) => {
    set((state) => {
      const newGuests = { ...state.guestsByTable };
      const newActiveGuests = { ...state.activeGuestIdByTable };
      delete newGuests[tableId];
      delete newActiveGuests[tableId];
      return {
        guestsByTable: newGuests,
        activeGuestIdByTable: newActiveGuests,
      };
    });
  },

  prepareGuestRemoval: (tableId: string, guestId: string) => {
    const currentGuests = get().getTableGuests(tableId);
    const guestToRemove = currentGuests.find(g => g.id === guestId);
    
    if (!guestToRemove) {
      console.warn(`Гость ${guestId} не найден`);
      return null;
    }

    try {
      const updatedGuests = GuestService.removeGuest(currentGuests, guestId);
      
      return {
        updatedGuests,
        removedGuest: guestToRemove,
      };
    } catch (error) {
      console.warn(error.message);
      return null;
    }
  },
});