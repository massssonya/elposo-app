import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { MODIFIERS } from '@shared/mocks/menu.mock';
import { ModifierGroupType } from '@shared/types/menu';
import { ModifierItem } from './ModifierItem';

import styles from './ModificatorModal.module.css';

interface ModifierGroupProps {
  group: ModifierGroupType;
  isValid: boolean;
  selectedIds: string[];
  onModifierChange: (modId: string, max: number) => void;
}

export const ModifierGroup = ({ group, isValid, selectedIds, onModifierChange }: ModifierGroupProps) => {
  return (
    <div className={styles.groupCard}>
      <FlexLayout justify="between" align="center" className={styles.groupHeader}>
        <h4 className={styles.groupName}>{group.name}</h4>
        {group.min > 0 && !isValid && (
          <span className={styles.requiredBadge}>Обязательно</span>
        )}
      </FlexLayout>

      <FlexLayout direction="col" gap="xs">
        {group.modifierIds.map((modId) => {
          const modifier = MODIFIERS.find((m) => m.id === modId);
          if (!modifier) return null;

          const isChecked = selectedIds.includes(modId);
          const isRadio = group.max === 1;

          return (
            <ModifierItem
              key={modifier.id}
              modifier={modifier}
              groupId={group.id}
              isChecked={isChecked}
              isRadio={isRadio}
              onChange={() => onModifierChange(modId, group.max)}
            />
          );
        })}
      </FlexLayout>
    </div>
  );
};
