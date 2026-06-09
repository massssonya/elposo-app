import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OrderItem, MenuItem } from '@shared/types/menu';

interface OrderState {
  ordersByTable: Record<string, OrderItem[]>;
  
  addToOrder: (tableId: string, item: MenuItem) => void;
  removeFromOrder: (tableId: string, orderItemId: string) => void;
  updateQuantity: (tableId: string, orderItemId: string, delta: number) => void;
  updateItemComment: (tableId: string, orderItemId: string, comment: string) => void;
  clearOrder: (tableId: string) => void;
  transferOrder: (fromTableId: string, toTableId: string) => void;
  
  getTableItems: (tableId: string) => OrderItem[];
  getTotalPrice: (tableId: string) => number;
}

const INIT_TABLE_ITEMS: OrderItem[] = [];

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            ordersByTable: {},
          
            getTableItems: (tableId) => {
              return get().ordersByTable[tableId] || INIT_TABLE_ITEMS;
            },
          
            addToOrder: (tableId, menuItem) => {
              const tableItems = get().getTableItems(tableId);
              const existingItem = tableItems.find((item) => item.menuItemId === menuItem.id);
          
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
