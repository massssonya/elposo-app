'use client';

import React from 'react';

import { useTableStore } from '@shared/stores/tableStore';
import { orderOrchestrator } from '@shared/services/orders.service';
import { Modal } from '@shared/components/UI/Modal';
import { GridLayout } from '@shared/components/UI/Layout/GridLayout';
import { TableStatus } from '@shared/types/tables';

import styles from './TransferModal.module.css';

interface TransferModalProps {
  isOpen: boolean;
  currentTableId: string;
  onClose: () => void;
  onSuccessTransfer: (newTableId: string) => void;
}

export function TransferModal({ 
  isOpen, 
  currentTableId, 
  onClose, 
  onSuccessTransfer 
}: TransferModalProps) {
  const zones = useTableStore((state) => state.zones);

  const availableTables = zones
    .flatMap((zone) => zone.tables)
    .filter((table) => table.id !== currentTableId && !table.isDynamic);

  const handleSelectTable = (targetTableId: string) => {
    orderOrchestrator.transferOrder(currentTableId, targetTableId);
    onSuccessTransfer(targetTableId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Перенос заказа" size="md">
      <p className={styles.subtitle}>Выберите стол, на который пересели гости</p>

      <div className={styles.tableGridContainer}>
        <GridLayout cols={3} gap="sm">
          {availableTables.map((table) => (
            <button
              key={table.id}
              onClick={() => handleSelectTable(table.id)}
              className={styles.tableButton}
            >
              <span className={styles.tableLabel}>Стол №{table.number}</span>
              <span className={`${styles.tableStatus} ${styles[`status_${table.status}`]}`}>
                {table.status === TableStatus.FREE && 'Свободен'}
                {table.status === TableStatus.OCCUPIED && 'Занят'}
                {table.status === TableStatus.CLEANING && 'Уборка'}
                {table.status === TableStatus.RESERVED && 'Бронь'}
              </span>
            </button>
          ))}
        </GridLayout>
      </div>
    </Modal>
  );
}
