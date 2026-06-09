'use client';

import { memo } from 'react';

import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { Button } from '@shared/components/UI/Button';

import styles from './OrderReceiptFooter.module.css';

interface FooterProps {
    totalPrice: number;
    isDisabledSendToKitchen: boolean;
  }

export const OrderReceiptFooter = memo(({ totalPrice, isDisabledSendToKitchen }: FooterProps) => {
    return (
      <FlexLayout direction="col" gap="md" className={styles.footer}>
        <FlexLayout justify="between" align="center" className={styles.totalRow}>
          <span className={styles.totalLabel}>Итого к оплате:</span>
          <span className={styles.totalAmount}>{totalPrice} ₽</span>
        </FlexLayout>
        
        <Button disabled={isDisabledSendToKitchen} className={styles.submitBtn}>
          Отправить на кухню
        </Button>
      </FlexLayout>
    );
  });
  
  OrderReceiptFooter.displayName = 'OrderReceiptFooter';