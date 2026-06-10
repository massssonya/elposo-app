'use client';

import dynamic from 'next/dynamic';

import { useOrderConstructorModals } from './_hooks/useOrderConstructorModals';
import { useOrderConstructor } from './_hooks/useOrderConstructor';

import { OrderReceipt } from './_components/OrderReceipt';
import { MenuCatalog } from './_components/MenuCatalog';
import { TopBar } from './_components/TopBar';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';

import styles from './OrderConstructor.module.css';

const TransferModal = dynamic(
  () => import('./_components/TransferModal').then((mod) => mod.TransferModal),
  { ssr: false } 
);

const CancelModal = dynamic(
  () => import('./_components/CancelModal').then((mod) => mod.CancelModal),
  { ssr: false } 
);

export default function OrderConstructor() {
  const modals = useOrderConstructorModals();

  const {
    tableId,
    currentTable,
    hasItems,
    handleBack,
    handleSuccessTransfer,
    handleCancelOrder,
  } = useOrderConstructor({ closeTransferModal: modals.transfer.close });

  if (!currentTable) {
    return <div className={styles.screen}>Загрузка данных заказа...</div>;
  }

  return (
    <FlexLayout direction="col" className={styles.screen}>
      <TopBar
        tableNumber={currentTable.number}
        isDynamic={currentTable.isDynamic}
        hasItems={hasItems}
        onBack={handleBack}
        onCancel={modals.cancel.open}
        onTransfer={modals.transfer.open}
      />

      <FlexLayout direction="row" gap="lg" className={styles.mainContent}>
        <OrderReceipt tableId={tableId} />
        <MenuCatalog tableId={tableId} />
      </FlexLayout>
      
      {modals.isTransferOpen && (
        <TransferModal
        isOpen={modals.isTransferOpen}
        currentTableId={tableId}
        onClose={modals.transfer.close}
        onSuccessTransfer={handleSuccessTransfer}
        />
      )}
      {modals.isCancelOpen && (
        <CancelModal
        isOpen={modals.isCancelOpen}
        onClose={modals.cancel.close}
        onCancelOrder={handleCancelOrder}
        />
      )}
    </FlexLayout>
  );
}
