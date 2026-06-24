import { OrderItemModifier } from '@shared/types/orders';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';

import styles from './OrderReceiptModifier.module.css'

interface OrderReceiptModifierProps extends OrderItemModifier {}

export const OrderReceiptModifier = ({ name, price, type }: OrderReceiptModifierProps) => {
    const isRemove = type === 'remove';

    return (
        <FlexLayout 
            as='li' 
            justify='between'
            align='center'
            className={styles.modifierItem}
        >
            <span className={styles.modifierName}>
                {isRemove ? `— ` : `+ `}{name}
            </span>
            {price > 0 && (
                <span className={styles.modifierPrice}>
                    {price} ₽
                </span>
            )}
        </FlexLayout>
    );
}