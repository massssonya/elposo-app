'use client';

import { GridLayout } from '@shared/components/UI/Layout/GridLayout';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { TabsGroup } from '@shared/components/UI/TabsGroup';
import { MenuCategory } from '@shared/types/menu';

import { ModificatorModal } from './_components/ModificatorModal';
import { MenuCatalogCardItem } from './_components/MenuCatalogCardItem';

import { useCatalogNavigation } from './_hooks/useCatalogNavigation';
import { useCatalogModalOrchestrator } from './_hooks/useCatalogModalOrchestrator';

import styles from './MenuCatalog.module.css';

interface Props {
  tableId: string;
}

const MOCK_CATEGORIES: MenuCategory[] = [
  { id: 'cat_1', name: 'Горячее' },
  { id: 'cat_2', name: 'Напитки' },
  { id: 'cat_3', name: 'Десерты' },
  { id: 'cat_4', name: 'Закуски' },
];

export function MenuCatalog({ tableId }: Props) {
  const { activeCatId, setActiveCatId, filteredItems } = useCatalogNavigation(MOCK_CATEGORIES[0].id);

  const {
    selectedItemId,
    isModificatorOpen,
    closeModificatorModal,
    handleOpenModificatorOrAddItem,
    handleSuccessModificator,
  } = useCatalogModalOrchestrator({ tableId });

  return (
    <>
      <FlexLayout direction="col" className={styles.catalogContainer}>
        <TabsGroup
          items={MOCK_CATEGORIES}
          activeId={activeCatId}
          onSelect={setActiveCatId}
          renderLabel={(cat) => cat.name}
          containerProps={{ className: styles.tabsGroup }}
        />

        <GridLayout cols="auto" minWidth="140px" gap="sm" className={styles.itemsGrid}>
          {filteredItems.map((item) => (
            <MenuCatalogCardItem 
              key={item.id}
              item={item}
              onClick={() => handleOpenModificatorOrAddItem(item)} 
            />
          ))}
        </GridLayout>
      </FlexLayout>

      {isModificatorOpen && selectedItemId && (
        <ModificatorModal
          itemId={selectedItemId}
          isOpen={isModificatorOpen}
          onClose={closeModificatorModal}
          onSuccessModificator={handleSuccessModificator}
        />
      )}
    </>
  );
}
