import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { MenuItem } from '@shared/types/menu';

import styles from './MenuCatalogCardItem.module.css';

interface MenuCatalogCardItemProps {
    item: MenuItem,
    onClick: () => void
}

export const MenuCatalogCardItem = ({ item, onClick } : MenuCatalogCardItemProps) => {
    return(
      <FlexLayout
        as='button'
        direction='col'
        justify='space-between'
        className={styles.menuCard}
        disabled={!item.isAvailable}
        onClick={onClick}
      >
        <div className={styles.itemName}>{item.name}</div>
        <div className={styles.itemPrice}>{item.price} ₽</div>
      </FlexLayout>
    )
}