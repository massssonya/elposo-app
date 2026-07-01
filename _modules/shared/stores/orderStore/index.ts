'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OrderStoreState } from './types';
import { createOrderSlice } from './createOrderSlice';
import { createGuestSlice } from './createGuestSlice';

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (...args) => ({
      ...createOrderSlice(...args),
      ...createGuestSlice(...args),
    }),
    {
      name: 'pos-active-orders',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ordersByTable: state.ordersByTable,
        guestsByTable: state.guestsByTable,
        activeGuestIdByTable: state.activeGuestIdByTable,
      }),
    }
  )
);

export type { TableOrder } from './types';
