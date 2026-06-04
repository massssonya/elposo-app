import { useTableStore } from '@shared/stores/tableStore';
import { useOrderStore } from '@shared/stores/orderStore';
import type { MenuItem } from '@shared/types/menu';
import { TableStatus } from '@shared/types/tables';

export const orderOrchestrator = {
  addItemToTableOrder: (tableId: string, item: MenuItem) => {
    const tableStore = useTableStore.getState();
    const orderStore = useOrderStore.getState();

    orderStore.addToOrder(tableId, item);

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

    if (sourceTable && sourceTable.status === TableStatus.OCCUPIED) {
      tableStore.setStatus(fromTableId, TableStatus.CLEANING);
    } else {
      tableStore.setStatus(fromTableId, TableStatus.FREE);
    }

    tableStore.setStatus(toTableId, TableStatus.OCCUPIED);
  }
};
