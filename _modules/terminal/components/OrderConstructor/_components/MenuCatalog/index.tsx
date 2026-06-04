'use client';

import React, { useState } from 'react';

import { orderOrchestrator } from "@shared/services/orders.service"
import { GridLayout } from '@shared/components/Layout/GridLayout';
import { FlexLayout } from '@shared/components/Layout/FlexLayout';
import { MenuCategory, MenuItem } from '@shared/types/menu';

import styles from './MenuCatalog.module.css';

interface Props {
  tableId: string;
}

// Моковые данные для проверки верстки
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

  // Фильтруем блюда по выбранной категории
  const filteredItems = MOCK_ITEMS.filter(item => item.categoryId === activeCatId);

  return (
    <FlexLayout direction="col" className={styles.catalogContainer}>
      {/* 📂 Горизонтальная лента категорий меню */}
      <FlexLayout gap="sm" className={styles.categoriesRow}>
        {MOCK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.categoryTab} ${cat.id === activeCatId ? styles.catActive : ''}`}
            onClick={() => setActiveCatId(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </FlexLayout>

      {/* 🍔 Адаптивная CSS-Grid сетка блюд */}
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
