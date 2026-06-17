import { FlexLayout } from '@shared/components/UI/Layout/FlexLayout';
import { SelectionControl } from '@shared/components/UI/SelectionControl';
import { Modifier } from '@shared/mocks/menu.mock';

import styles from './ModificatorModal.module.css';

interface ModifierItemProps {
  modifier: Modifier;
  groupId: string;
  isChecked: boolean;
  isRadio: boolean;
  onChange: () => void;
}

export const ModifierItem = ({ modifier, groupId, isChecked, isRadio, onChange }: ModifierItemProps) => {
  const itemClass = [
    styles.modifierItem,
    isChecked ? styles.activeItem : '',
    modifier.type === 'remove' ? styles.typeRemove : styles.typeAdd,
  ].join(' ');

  return (
    <FlexLayout as="label" justify="between" align="center" className={itemClass}>
      <SelectionControl
        type={isRadio ? 'radio' : 'checkbox'}
        name={groupId}
        checked={isChecked}
        onChange={onChange}
        containerClassName={styles.modifierControlOverride}
      >
        <span className={styles.modifierName}>
          {modifier.type === 'remove' && isChecked ? (
            <del>{modifier.name}</del>
          ) : (
            modifier.name
          )}
        </span>
      </SelectionControl>
      {modifier.price > 0 && (
        <span className={styles.modifierPrice}>+{modifier.price} ₽</span>
      )}
    </FlexLayout>
  );
};
