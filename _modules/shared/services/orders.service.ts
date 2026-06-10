import { useTableStore, type TableState } from '@shared/stores/tableStore';
import { useOrderStore } from '@shared/stores/useOrderStore';
import type { MenuItem } from '@shared/types/menu';
import { TableStatus } from '@shared/types/tables';

const sourceTableStrategy = {
  // Стол динамический -> полностью удаляем его
  dynamic: (tableId: string, tableStore: TableState) => {
    tableStore.removeDynamicTable(tableId);
  },
  // Стол статичный и был занят -> отправляем на уборку
  staticOccupied: (tableId: string, tableStore: TableState) => {
    tableStore.setStatus(tableId, TableStatus.CLEANING);
  },
  // Стол статичный и НЕ был занят (бронь, ошибка) -> просто освобождаем
  staticFree: (tableId: string, tableStore: TableState) => {
    tableStore.setStatus(tableId, TableStatus.FREE);
  } 
}

export const orderOrchestrator = {
  addItemToTableOrder: (tableId: string, item: MenuItem) => {
    const tableStore = useTableStore.getState();
    const orderStore = useOrderStore.getState();

    const activeGuestId = 
        orderStore.activeGuestIdByTable[tableId] || 
        orderStore.getTableGuests(tableId)[0]?.id || 
        'g_1';

    orderStore.addToOrder(tableId, item, activeGuestId);

    const currentTable = tableStore.getTableById(tableId);

    if (currentTable && (currentTable.status === TableStatus.FREE || currentTable.status === TableStatus.CLEANING)) {
      tableStore.setStatus(tableId, TableStatus.OCCUPIED);
    }
  },
  transferOrder: (fromTableId: string, toTableId: string) => {
    const tableStore = useTableStore.getState();
    const orderStore = useOrderStore.getState();

    orderStore.transferOrder(fromTableId, toTableId);

    const sourceTable = tableStore.getTableById(fromTableId);

    if (sourceTable) {
      const strategyKey = sourceTable.isDynamic
        ? 'dynamic'
        : sourceTable.status === TableStatus.OCCUPIED
        ? 'staticOccupied'
        : 'staticFree';

      sourceTableStrategy[strategyKey](fromTableId, tableStore);
    }

    tableStore.setStatus(toTableId, TableStatus.OCCUPIED);
  }
};
