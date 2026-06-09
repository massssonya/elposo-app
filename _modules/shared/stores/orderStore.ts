import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OrderItem, MenuItem, OrderGuest } from '@shared/types/menu';

interface OrderState {
  ordersByTable: Record<string, OrderItem[]>;
  guestsByTable: Record<string, OrderGuest[]>;
  activeGuestIdByTable: Record<string, string>;
  
  addToOrder: (tableId: string, item: MenuItem, guestId: string) => void;
  removeFromOrder: (tableId: string, orderItemId: string) => void;
  updateQuantity: (tableId: string, orderItemId: string, delta: number) => void;
  updateItemComment: (tableId: string, orderItemId: string, comment: string) => void;
  clearOrder: (tableId: string) => void;
  transferOrder: (fromTableId: string, toTableId: string) => void;

  addGuestToTable: (tableId: string) => string;
  getTableGuests: (tableId: string) => OrderGuest[];
  getTableItems: (tableId: string) => OrderItem[];
  setActiveGuest: (tableId: string, guestId: string) => void;
  
  getTableItems: (tableId: string) => OrderItem[];
  getTotalPrice: (tableId: string) => number;
}

const INIT_TABLE_ITEMS: OrderItem[] = [];

const DEFAULT_GUESTS_ARRAY: OrderGuest[] = [{ id: 'g_1', name: 'Гость 1' }];

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            ordersByTable: {},
            guestsByTable: {},
            activeGuestIdByTable: {},
          
            getTableItems: (tableId) => {
              return get().ordersByTable[tableId] || INIT_TABLE_ITEMS;
            },

            getTableGuests: (tableId) => {
              const guests = get().guestsByTable[tableId];
              if (!guests || guests.length === 0) {
                return DEFAULT_GUESTS_ARRAY;
              }
              return guests;
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
          
            addToOrder: (tableId, menuItem, guestId) => {
              const tableItems = get().getTableItems(tableId);
              const existingItem = tableItems.find(
                (item) => item.menuItemId === menuItem.id && item.guestId === guestId
              );
              let updatedItems: OrderItem[];
          
              if (existingItem) {
                updatedItems = tableItems.map((item) =>
                  item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item
                );
              } else {
                const newItem: OrderItem = {
                  id: `oi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                  menuItemId: menuItem.id,
                  name: menuItem.name,
                  price: menuItem.price,
                  quantity: 1,
                  guestId,
                };
                updatedItems = [...tableItems, newItem];
              }
          
              set((state) => ({
                ordersByTable: {
                  ...state.ordersByTable,
                  [tableId]: updatedItems,
                },
              }));
            },
          
            removeFromOrder: (tableId, orderItemId) => {
              const tableItems = get().getTableItems(tableId);
              set((state) => ({
                ordersByTable: {
                  ...state.ordersByTable,
                  [tableId]: tableItems.filter((item) => item.id !== orderItemId),
                },
              }));
            },
          
            updateQuantity: (tableId, orderItemId, delta) => {
              const tableItems = get().getTableItems(tableId);
              const updatedItems = tableItems
                .map((item) => {
                  if (item.id !== orderItemId) return item;
                  return { ...item, quantity: item.quantity + delta };
                })
                .filter((item) => item.quantity > 0);
          
              set((state) => ({
                ordersByTable: {
                  ...state.ordersByTable,
                  [tableId]: updatedItems,
                },
              }));
            },

            updateItemComment: (tableId, orderItemId, comment) => {
              const tableItems = get().getTableItems(tableId);
              const updatedItems = tableItems.map((item) => {
                if (item.id !== orderItemId) return item;
                return { ...item, comment };
              });
            
              set((state) => ({
                ordersByTable: {
                  ...state.ordersByTable,
                  [tableId]: updatedItems,
                },
              }));
            },
          
            clearOrder: (tableId) => {
              set((state) => {
                const newOrders = { ...state.ordersByTable };
                delete newOrders[tableId];
                return { ordersByTable: newOrders };
              });
            },

            transferOrder: (fromTableId, toTableId) => {
              const currentOrders = get().ordersByTable;
              const sourceItems = currentOrders[fromTableId] || [];
              
              if (sourceItems.length === 0) return;
            
              const targetItems = currentOrders[toTableId] || [];
              const mergedItems = [...targetItems];
              
              sourceItems.forEach((sourceItem) => {
                const existingItem = mergedItems.find(item => item.menuItemId === sourceItem.menuItemId);
                if (existingItem) {
                  existingItem.quantity += sourceItem.quantity;
                } else {
                  mergedItems.push({ ...sourceItem });
                }
              });
            
              set((state) => {
                const updatedOrders = { ...state.ordersByTable };
 
                delete updatedOrders[fromTableId]; 
                updatedOrders[toTableId] = mergedItems;
            
                return { ordersByTable: updatedOrders };
              });
            },

            setActiveGuest: (tableId, guestId) => set((state) => ({
              activeGuestIdByTable: { ...state.activeGuestIdByTable, [tableId]: guestId }
            })),
          
            getTotalPrice: (tableId) => {
              const tableItems = get().getTableItems(tableId);
              return tableItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            },
          }),
          {
            name: 'pos-active-orders',
            storage: createJSONStorage(() => localStorage),
          }
    )
);
