'use client';

import React, { useState } from 'react';

import { orderOrchestrator } from "@shared/services/orders.service"
import { GridLayout } from '@shared/components/UI/Layout/GridLayout';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { TabsGroup } from '@shared/components/UI/TabsGroup';
import { MenuCategory, MenuItem } from '@shared/types/menu';

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

const MOCK_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Бургер Фирменный', price: 450, categoryId: 'cat_1', isAvailable: true },
  { id: 'm2', name: 'Стейк Рибай', price: 1200, categoryId: 'cat_1', isAvailable: true },
  { id: 'm3', name: 'Капучино 300мл', price: 220, categoryId: 'cat_2', isAvailable: true },
  { id: 'm4', name: 'Кола Классик', price: 150, categoryId: 'cat_2', isAvailable: true },
  { id: 'm5', name: 'Чизкейк Нью-Йорк', price: 350, categoryId: 'cat_3', isAvailable: false },
];

export function MenuCatalog({ tableId }: Props) {
  const [activeCatId, setActiveCatId] = useState<string>('cat_1');

  const filteredItems = MOCK_ITEMS.filter(item => item.categoryId === activeCatId);

  return (
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
          <FlexLayout
            key={item.id}
            as='button'
            direction='col'
            justify='space-between'
            className={styles.menuCard}
            disabled={!item.isAvailable}
            onClick={() => orderOrchestrator.addItemToTableOrder(tableId, item)}
          >
            <div className={styles.itemName}>{item.name}</div>
            <div className={styles.itemPrice}>{item.price} ₽</div>
          </FlexLayout>
        ))}
      </GridLayout>
    </FlexLayout>
  );
}
