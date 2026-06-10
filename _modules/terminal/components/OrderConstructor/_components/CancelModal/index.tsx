'use client';

import { memo } from 'react';

import { Modal } from '@shared/components/UI/Modal';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { Button } from '@shared/components/UI/Button';

import styles from './CancelModal.module.css';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancelOrder: () => void;
}

export const CancelModal = memo(({ 
  isOpen,
  onClose,
  onCancelOrder
}: CancelModalProps) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Отмена заказа" size="md">
        <div className={styles.modalContent}>
            <p className={styles.subtitle}>
                Вы уверены, что хотите полностью аннулировать этот черновик заказа? 
                Все выбранные блюда будут стерты.
            </p>
            <FlexLayout justify="end" gap='xs' className={styles.btnGroup}>
                <Button size='sm' variant="danger" onClick={onCancelOrder}>Да, отменить</Button>
                <Button size='sm' variant="secondary" onClick={onClose}>Нет, оставить</Button>
            </FlexLayout>
        </div>
    </Modal>
  );
})

CancelModal.displayName = 'CancelModal'
