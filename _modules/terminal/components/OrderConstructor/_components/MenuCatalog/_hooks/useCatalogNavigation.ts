import { useState, useMemo } from 'react';

import { MOCK_ITEMS } from '@shared/mocks/menu.mock';

export function useCatalogNavigation(initialCategoryId: string = 'cat_1') {
  const [activeCatId, setActiveCatId] = useState<string>(initialCategoryId);

  const filteredItems = useMemo(() => {
    return MOCK_ITEMS.filter((item) => item.categoryId === activeCatId);
  }, [activeCatId]);

  return {
    activeCatId,
    setActiveCatId,
    filteredItems,
  };
}
