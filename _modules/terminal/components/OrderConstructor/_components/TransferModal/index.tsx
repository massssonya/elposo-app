'use client';

import { useMemo, memo, useState } from 'react';

import { useTableStore } from '@shared/stores/tableStore';
import { orderOrchestrator } from '@shared/services/orders.service';
import { Modal } from '@shared/components/UI/Modal';
import { GridLayout } from '@shared/components/UI/Layout/GridLayout';
import { Button } from '@shared/components/UI/Button';
import { TabsGroup } from '@shared/components/UI/TabsGroup';
import { TableStatus } from '@shared/types/tables';

import styles from './TransferModal.module.css';

interface StatusDisplayStrategy {
  label: string;
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

const TITLE_ITEMS = [
  { id: 'tables', name: 'Столы', subtitle: 'Выберите стол, на который пересели гости', label: 'Стол'  },
  { id: 'trackers', name: 'Трекеры', subtitle: 'Выберите трекер для выдачи', label: 'Трекер' }
]

interface TransferModalProps {
  isOpen: boolean;
  currentTableId: string;
  onClose: () => void;
  onSuccessTransfer: (newTableId: string) => void;
}

export const TransferModal = memo(({ 
  isOpen, 
  currentTableId, 
  onClose, 
  onSuccessTransfer 
}: TransferModalProps) => {
  const [activeCatId, setActiveCatId] = useState<string>(TITLE_ITEMS[0].id);
  const getAvailableTables = useTableStore((state) => state.getAvailableTables);
  const activeSubtitle = TITLE_ITEMS.find(item => item.id === activeCatId)?.subtitle
  const activeLabel = TITLE_ITEMS.find(item => item.id === activeCatId)?.label

  const availableTables = useMemo(() => {
    switch(activeCatId){
      case 'tables':
        return getAvailableTables({ excludeId: currentTableId, isDynamic: false });
      case 'trackers':
        return getAvailableTables({ excludeId: currentTableId, isDynamic: true  });
      default: 
        return getAvailableTables({ excludeId: currentTableId });
    }
  }, [activeCatId, getAvailableTables]);

  const handleSelectTable = (targetTableId: string) => {
    orderOrchestrator.transferOrder(currentTableId, targetTableId);
    onSuccessTransfer(targetTableId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Перенос заказа" size="md">
      <TabsGroup 
        items={TITLE_ITEMS}
        activeId={activeCatId}
        onSelect={setActiveCatId}
        renderLabel={(cat) => cat.name}
      />
      <p className={styles.subtitle}>{activeSubtitle}</p>

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
                <span className={styles.tableLabel}>{activeLabel} №{table.number}</span>
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
})

TransferModal.displayName = 'TransferModal'