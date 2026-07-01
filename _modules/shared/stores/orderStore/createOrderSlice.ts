import { StateCreator } from 'zustand';

import { OrderService } from '@shared/services';
import { OrderValidator } from '@shared/validators';

import { OrderStoreState, OrderSlice, TableOrder } from './types';
import { OrderItem, OrderStatus, OrderItemModifier, OrderItemStatus } from '@shared/types/orders';

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

  getOrderByTable: (tableId: string) => {
    return get().ordersByTable[tableId];
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

  addOrderItem: (
    tableId: string, 
    menuItem: MenuItem, 
    guestId: string, 
    selectedModifiers: OrderItemModifier[] = []
  ) => {
    let order = get().ordersByTable[tableId];
    
    if (!order) {
      get().initTableOrder(tableId);
      order = get().ordersByTable[tableId];
      
      if (!order) {
        console.error('Не удалось создать заказ');
        return;
      }
    }

    if (!OrderValidator.canAddItem(order)) {
      console.warn('Нельзя добавить блюдо в текущем статусе заказа');
      return;
    }

    try {
      const updatedOrder = OrderService.addItem(order, menuItem, guestId, selectedModifiers);
      set((state) => ({
        ordersByTable: {
          ...state.ordersByTable,
          [tableId]: updatedOrder,
        },
      }));
    } catch (error) {
      console.error('Ошибка при добавлении блюда:', error);
    }
  },

  removeOrderItem: (tableId: string, orderItemId: string) => {
    const order = get().ordersByTable[tableId];

    if (!order) {
      console.warn(`Заказ для стола ${tableId} не найден`);
      return;
    }

    const validation = OrderValidator.canRemoveItem(order, orderItemId);
    if (!validation.isValid) {
      console.warn(validation.reason);
      return;
    }

    try {
      const updatedOrder = OrderService.removeItem(order, orderItemId);
      set((state) => ({
        ordersByTable: {
          ...state.ordersByTable,
          [tableId]: updatedOrder,
        },
      }));
    } catch (error) {
      console.error('Ошибка при удалении блюда:', error);
    }
  },

  updateOrderItem: (payload: {
    tableId: string;
    orderItemId: string;
    updates: OrderItemUpdate;
  }) => {
    const { tableId, orderItemId, updates } = payload;
    
    set((state) => {
      const order = state.ordersByTable[tableId];
      if (!order) {
        console.warn(`Заказ для стола ${tableId} не найден`);
        return state;
      }

      const itemExists = order.items.some(item => item.id === orderItemId);
      if (!itemExists) {
        console.warn(`Блюдо ${orderItemId} не найдено в заказе`);
        return state;
      }

      return {
        ordersByTable: {
          ...state.ordersByTable,
          [tableId]: {
            ...order,
            items: order.items.map((item) =>
              item.id === orderItemId ? { ...item, ...updates } : item
            ),
          },
        },
      };
    });
  },

  updateOrderItemQuantity: (tableId: string, orderItemId: string, delta: number) => {
    set((state) => {
      const order = state.ordersByTable[tableId];
      if (!order) {
        console.warn(`Заказ для стола ${tableId} не найден`);
        return state;
      }

      const validation = OrderValidator.canUpdateOrderItemQuantity(order, orderItemId, delta);
      if (!validation.isValid) {
        console.warn(validation.reason);
        return state;
      }

      try {
        const result = OrderService.updateQuantity(order, orderItemId, delta);
        
        return {
          ordersByTable: {
            ...state.ordersByTable,
            [tableId]: result.order,
          },
        };
      } catch (error) {
        console.error('Ошибка при обновлении количества:', error);
        return state;
      }
    });
  },

  updateOrderItemComment: (tableId: string, orderItemId: string, comment: string) => {
    set((state) => {
      const order = state.ordersByTable[tableId];
      if (!order) {
        console.warn(`Заказ для стола ${tableId} не найден`);
        return state;
      }

      try {
        const updatedOrder = OrderService.updateComment(order, orderItemId, comment);
        return {
          ordersByTable: {
            ...state.ordersByTable,
            [tableId]: updatedOrder,
          },
        };
      } catch (error) {
        console.error('Ошибка при обновлении комментария:', error);
        return state;
      }
    });
  },

  updateOrderStatus: (tableId: string, status: OrderStatus) => {
    const order = get().ordersByTable[tableId];
    if (!order) {
      console.warn(`Заказ для стола ${tableId} не найден`);
      return;
    }

    set((state) => ({
      ordersByTable: {
        ...state.ordersByTable,
        [tableId]: { ...order, status },
      },
    }));
  },

  updateOrderItemStatus: (tableId: string, itemIds: string[], newStatus: OrderItemStatus) => {
    set((state) => {
      const order = state.ordersByTable[tableId];
      if (!order) {
        console.warn(`Заказ для стола ${tableId} не найден`);
        return state;
      }

      try {
        const updatedOrder = OrderService.updateItemStatus(order, itemIds, newStatus);
        return {
          ordersByTable: {
            ...state.ordersByTable,
            [tableId]: updatedOrder,
          },
        };
      } catch (error) {
        console.error('Ошибка при обновлении статуса блюд:', error);
        return state;
      }
    });
  },

  updateOrder: (tableId: string, updates: OrderUpdate) => {
    const order = get().ordersByTable[tableId];
    if (!order) {
      console.warn(`Заказ для стола ${tableId} не найден`);
      return;
    }

    set((state) => ({
      ordersByTable: {
        ...state.ordersByTable,
        [tableId]: { ...order, ...updates },
      },
    }));
  },

  updateOrderStatus: (tableId: string, status: OrderStatus) => {
    const order = get().ordersByTable[tableId];
    if (!order) {
      console.warn(`Заказ для стола ${tableId} не найден`);
      return;
    }

    set((state) => ({
      ordersByTable: {
        ...state.ordersByTable,
        [tableId]: { ...order, status },
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

  removeOrderFromTable: (tableId: string) => {
    set((state) => {
      const newOrders = { ...state.ordersByTable };
      delete newOrders[tableId];
      return { ordersByTable: newOrders };
    });
  },

  mergeOrdersData: (
    targetTableId: string,
    sourceOrder: Order,
    guestIdMap: Record<string, string>
  ) => {
    const targetOrder = get().ordersByTable[targetTableId];
    const mergedOrder = OrderService.mergeOrders(targetOrder, sourceOrder, guestIdMap);

    set((state) => ({
      ordersByTable: {
        ...state.ordersByTable,
        [targetTableId]: mergedOrder,
      },
    }));

    return mergedOrder;
  },

  prepareOrderForTransfer: (tableId: string) => {
    const order = get().ordersByTable[tableId];
    if (!order || order.items.length === 0) {
      return null;
    }

    const guests = get().getTableGuests(tableId);
    
    return {
      order,
      guests,
    };
  },
});
