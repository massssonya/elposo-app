import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { MenuItem } from '@shared/types/menu';

import styles from './MenuCatalogCardItem.module.css';

interface MenuCatalogCardItemProps {
  item: MenuItem;
  onClick: () => void;
}

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2IzYjNiMyIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgeD0iMyIgeT0iMyIgcng9IjIiIHJ5PSIyIi8+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjIiLz48cGF0aCBkPSJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIvPjwvc3ZnPg==';

export const MenuCatalogCardItem = ({ item, onClick }: MenuCatalogCardItemProps) => {
  const hasModifiers = item.modifierGroupIds && item.modifierGroupIds.length > 0;

  return (
    <FlexLayout
      as="button"
      direction="col"
      className={`${styles.menuCard} ${!item.isAvailable ? styles.disabledCard : ''}`}
      disabled={!item.isAvailable}
      onClick={onClick}
    >
      <div className={styles.imageWrapper}>
        <img
          src={item.imageUrl || DEFAULT_IMAGE}
          alt={item.name}
          className={styles.itemImage}
          loading="lazy"
        />
        
        {hasModifiers && item.isAvailable && (
          <FlexLayout 
            as='span' 
            align='center' 
            justify='center' 
            className={styles.modifierBadge} 
            title="Есть модификаторы">
            ⌥
          </FlexLayout>
        )}

        {!item.isAvailable && (
          <FlexLayout  
            align='center' 
            justify='center'
            className={styles.stopListOverlay}
          >
            <span className={styles.stopListBadge}>Стоп-лист</span>
          </FlexLayout>
        )}
      </div>

      <FlexLayout direction="col" justify="between" className={styles.infoContainer}>
        <div className={styles.itemName} title={item.name}>
          {item.name}
        </div>
        <div className={styles.itemPrice}>
          {item.price} ₽
        </div>
      </FlexLayout>
    </FlexLayout>
  );
};
