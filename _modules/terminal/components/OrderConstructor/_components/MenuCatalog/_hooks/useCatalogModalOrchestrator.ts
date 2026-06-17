import { useState } from 'react';

import { orderOrchestrator } from "@shared/services/orders.service";
import { MenuItem, Modifier } from '@shared/types/menu';
import { MOCK_ITEMS } from '@shared/mocks/menu.mock';

interface UseCatalogModalOrchestratorParams {
  tableId: string;
}

export function useCatalogModalOrchestrator({ tableId }: UseCatalogModalOrchestratorParams) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const closeModificatorModal = () => setSelectedItemId(null);

  const handleOpenModificatorOrAddItem = (item: MenuItem) => {
    if (item.modifierGroupIds && item.modifierGroupIds.length > 0) {
      setSelectedItemId(item.id);
    } else {
      orderOrchestrator.addItemToTableOrder(tableId, item);
    }
  };

  const handleSuccessModificator = (selectedModifiers: Modifier[]) => {
    if (!selectedItemId) return;

    const item = MOCK_ITEMS.find((i) => i.id === selectedItemId);
    if (item) {
      const orderModifiers = selectedModifiers.map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
      }));

      orderOrchestrator.addItemToTableOrder(tableId, item, orderModifiers);
    }
    
    closeModificatorModal();
  };

  return {
    selectedItemId,
    isModificatorOpen: Boolean(selectedItemId),
    closeModificatorModal,
    handleOpenModificatorOrAddItem,
    handleSuccessModificator,
  };
}
