'use client';

import { Modal } from '@shared/components/UI/Modal';
import { Button } from '@shared/components/UI/Button';
import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { Modifier } from '@shared/mocks/menu.mock';

import { useModificator } from './useModificator';
import { ModifierGroup } from './ModifierGroup';

import styles from './ModificatorModal.module.css';

interface ModificatorModalProps {
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccessModificator: (selectedModifiers: Modifier[]) => void;
}

export const ModificatorModal = ({
  itemId,
  isOpen,
  onClose,
  onSuccessModificator,
}: ModificatorModalProps) => {
  const {
    item,
    itemGroups,
    selected,
    totalPrice,
    isFormValid,
    isGroupValid,
    handleModifierChange,
    handleSubmit,
  } = useModificator({ itemId, onSuccessModificator });

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item.name} size="md">
      <FlexLayout direction="col" className={styles.modalContent}>
        <div className={styles.groupsContainer}>
          {itemGroups.map((group) => (
            <ModifierGroup
              key={group.id}
              group={group}
              isValid={isGroupValid(group.id, group.min)}
              selectedIds={selected[group.id] || []}
              onModifierChange={(modId, max) => handleModifierChange(group.id, modId, max)}
            />
          ))}
        </div>

        <div className={styles.footer}>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            variant="primary"
            className={styles.submitButton}
          >
            Добавить за {totalPrice} ₽
          </Button>
        </div>
      </FlexLayout>
    </Modal>
  );
};
