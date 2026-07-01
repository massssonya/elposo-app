import { useTableStore, type TableState } from '@shared/stores/tableStore';
import { useOrderStore } from '@shared/stores/orderStore';
import { useOrderManager, useOrderFacade } from '@shared/hooks';

import type { MenuItem } from '@shared/types/menu';
import { TableStatus } from '@shared/types/tables';
import { OrderStatus,  OrderItemModifier } from '@shared/types/orders';

const sourceTableStrategy = {
  dynamic: (tableId: string, tableStore: TableState) => {
    tableStore.removeDynamicTable(tableId);
  },
  staticOccupied: (tableId: string, tableStore: TableState) => {
    tableStore.setStatus(tableId, TableStatus.CLEANING);
  },
  staticFree: (tableId: string, tableStore: TableState) => {
    tableStore.setStatus(tableId, TableStatus.FREE);
  },
  staticCleaning: (tableId: string, tableStore: TableState) => {
    tableStore.setStatus(tableId, TableStatus.FREE);
  }
}

const getTableStrategy = (table: any): keyof typeof sourceTableStrategy => {
  if (table.isDynamic) return 'dynamic';
  
  switch (table.status) {
    case TableStatus.OCCUPIED:
      return 'staticOccupied';
    case TableStatus.CLEANING:
      return 'staticCleaning';
    default:
      return 'staticFree';
  }
};

export const OrderOrchestrator = {
  addItemToTableOrder: (tableId: string, item: MenuItem, modifiers: OrderItemModifier[] = []) => {
    const tableStore = useTableStore.getState();
    const orderStore = useOrderStore.getState();
    const orderFacade = useOrderFacade();

    let activeGuestId = orderStore.activeGuestIdByTable[tableId];
    if (!activeGuestId) {
      const guests = orderStore.getTableGuests(tableId);
      activeGuestId = guests[0]?.id || 'g_1';
      
      if (guests[0]?.id) {
        orderStore.setActiveGuest(tableId, guests[0].id);
      }
    }

    orderStore.addOrderItem(tableId, item, activeGuestId, modifiers);

    const currentTable = tableStore.getTableById(tableId);

    if (currentTable && (currentTable.status === TableStatus.FREE || currentTable.status === TableStatus.CLEANING)) {
      tableStore.setStatus(tableId, TableStatus.OCCUPIED);
    }
  },

  transferOrder: (fromTableId: string, toTableId: string) => {
    const tableStore = useTableStore.getState();
    const orderFacade = useOrderFacade();

    if (fromTableId === toTableId) {
      console.warn('Нельзя перенести заказ на тот же стол');
      return { success: false, error: 'Столы должны быть разными' };
    }

    const orderStore = useOrderStore.getState();
    const sourceOrder = orderStore.getOrderByTable(fromTableId);
    
    if (!sourceOrder || sourceOrder.items.length === 0) {
      console.warn(`Нет заказа для переноса со стола ${fromTableId}`);
      return { success: false, error: 'Нет заказа для переноса' };
    }

    const targetTable = tableStore.getTableById(toTableId);
    if (!targetTable) {
      console.warn(`Целевой стол ${toTableId} не найден`);
      return { success: false, error: 'Целевой стол не найден' };
    }

    try {
      orderFacade.transferOrder(fromTableId, toTableId);
    } catch (error) {
      console.error('Ошибка при переносе заказа:', error);
      return { success: false, error: error.message };
    }

    const sourceTable = tableStore.getTableById(fromTableId);

    if (sourceTable) {
      const strategy = getTableStrategy(sourceTable);
      sourceTableStrategy[strategy](fromTableId, tableStore);
    }

    if (targetTable) {
      if (targetTable.status === TableStatus.FREE || 
          targetTable.status === TableStatus.CLEANING) {
        tableStore.setStatus(toTableId, TableStatus.OCCUPIED);
      }
    }

    return { success: true };
  },
  
  cancelOrCloseDraftOrder: (tableId: string) => {
    const tableStore = useTableStore.getState();
    const orderStore = useOrderStore.getState();

    const currentStatus = orderStore.getOrderStatus(tableId);

    if (currentStatus !== OrderStatus.DRAFT) {
      console.warn('Нельзя аннулировать заказ, который уже отправлен на кухню');
      return { success: false, error: 'Заказ уже готовится' };
    }

    const currentTable = tableStore.getTableById(tableId);

    orderStore.updateOrderStatus(tableId, OrderStatus.CANCELLED);
    orderStore.clearOrder(tableId);

    if (currentTable) {
      if (currentTable.isDynamic) {
        sourceTableStrategy.dynamic(tableId, tableStore);
      } else {
        sourceTableStrategy.staticFree(tableId, tableStore);
      }
    }

    return { success: true };
  },

  createDynamicTableAndOrder: (zoneId: string, tableNumber: string) => {
    const tableStore = useTableStore.getState();
    const orderStore = useOrderStore.getState();

    const result = tableStore.createDynamicTable(zoneId, tableNumber);

    if (result.success && result.table) {
      const newTable = result.table;

      orderStore.initTableOrder(newTable.id);

      return { success: true, table: newTable };
    }

    return { success: false, error: result.error };
  }
};
