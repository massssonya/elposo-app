'use client';

import React, { useMemo } from 'react';

import { useTableStore } from '@shared/stores/tableStore';
import { orderOrchestrator } from '@shared/services/orders.service';
import { Modal } from '@shared/components/UI/Modal';
import { GridLayout } from '@shared/components/UI/Layout/GridLayout';
import { Button } from '@shared/components/UI/Button';
import { TableStatus } from '@shared/types/tables';

import styles from './TransferModal.module.css';

interface StatusDisplayStrategy {
  label: string;
  className: string;
}

export const TABLE_STATUS_STRATEGY: Record<TableStatus, StatusDisplayStrategy> = {
  [TableStatus.FREE]: {
    label: 'Свободен',
  },
  [TableStatus.OCCUPIED]: {
    label: 'Занят',
  },
  [TableStatus.CLEANING]: {
    label: 'Уборка',
  },
  [TableStatus.RESERVED]: {
    label: 'Бронь',
  },
  [TableStatus.BILL_PAID]: {
    label: 'Счет выдан',
  },
  [TableStatus.OUT_OF_SERVICE]: {
    label: 'Не работает',
  },
};

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
  const getAvailableTables = useTableStore((state) => state.getAvailableTables);

  const availableTables = useMemo(() => {
    return getAvailableTables(currentTableId);
  }, [getAvailableTables, currentTableId]);

  const handleSelectTable = (targetTableId: string) => {
    orderOrchestrator.transferOrder(currentTableId, targetTableId);
    onSuccessTransfer(targetTableId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Перенос заказа" size="md">
      <p className={styles.subtitle}>Выберите стол, на который пересели гости</p>

      <div className={styles.tableGridContainer}>
        <GridLayout cols={3} gap="sm">
          {availableTables.map((table) => {
            const statusConfig = TABLE_STATUS_STRATEGY[table.status];

            return(
              <Button
                key={table.id}
                onClick={() => handleSelectTable(table.id)}
                className={styles.tableButton}
              >
                <span className={styles.tableLabel}>Стол №{table.number}</span>
                <span className={`${styles.tableStatus} pos-status-${table.status}`}>
                  {statusConfig.label}
                </span>
              </Button>
            )
          })}
        </GridLayout>
      </div>
    </Modal>
  );
}
