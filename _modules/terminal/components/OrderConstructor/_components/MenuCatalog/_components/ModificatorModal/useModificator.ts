import { useState, useMemo } from 'react';

import { MOCK_ITEMS, MODIFIER_GROUPS, MODIFIERS, Modifier } from '@shared/mocks/menu.mock';

export type SelectedState = Record<string, string[]>;

interface UseModificatorParams {
  itemId: string;
  onSuccessModificator: (selectedModifiers: Modifier[]) => void;
}

export const useModificator = ({ itemId, onSuccessModificator }: UseModificatorParams) => {
  const item = useMemo(() => MOCK_ITEMS.find((i) => i.id === itemId), [itemId]);

  const itemGroups = useMemo(() => {
    if (!item) return [];
    return MODIFIER_GROUPS.filter((group) => item.modifierGroupIds?.includes(group.id));
  }, [item]);

  const [selected, setSelected] = useState<SelectedState>(() => {
    const initialState: SelectedState = {};
    if (!item) return initialState;

    const groups = MODIFIER_GROUPS.filter((group) => item.modifierGroupIds?.includes(group.id));
    groups.forEach((group) => {
      if (group.min === 1 && group.max === 1 && group.modifierIds.length > 0) {
        initialState[group.id] = [group.modifierIds[0]];
      } else {
        initialState[group.id] = [];
      }
    });
    return initialState;
  });

  const handleModifierChange = (groupId: string, modId: string, max: number) => {
    setSelected((prev) => {
      const currentGroupSelection = prev[groupId] || [];

      if (max === 1) {
        return { ...prev, [groupId]: [modId] };
      }

      if (currentGroupSelection.includes(modId)) {
        return { ...prev, [groupId]: currentGroupSelection.filter((id) => id !== modId) };
      }

      if (currentGroupSelection.length >= max) {
        return prev;
      }

      return { ...prev, [groupId]: [...currentGroupSelection, modId] };
    });
  };

  const isGroupValid = (groupId: string, min: number) => {
    const count = selected[groupId]?.length || 0;
    return count >= min;
  };

  const isFormValid = useMemo(() => {
    return itemGroups.every((group) => isGroupValid(group.id, group.min));
  }, [itemGroups, selected]);

  const totalPrice = useMemo(() => {
    if (!item) return 0;
    let price = item.price;
    Object.values(selected).flat().forEach((modId) => {
      const modifier = MODIFIERS.find((m) => m.id === modId);
      if (modifier) price += modifier.price;
    });
    return price;
  }, [selected, item]);

  const handleSubmit = () => {
    if (!isFormValid) return;
    const selectedIds = Object.values(selected).flat();
    const finalModifiers = MODIFIERS.filter((m) => selectedIds.includes(m.id));
    onSuccessModificator(finalModifiers);
  };

  return {
    item,
    itemGroups,
    selected,
    totalPrice,
    isFormValid,
    isGroupValid,
    handleModifierChange,
    handleSubmit,
  };
};
