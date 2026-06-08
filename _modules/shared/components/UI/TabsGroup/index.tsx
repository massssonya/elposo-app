import React, { ElementType, ComponentPropsWithoutRef } from 'react';
import defaultStyles from './TabsGroup.module.css';

type TabsGroupProps<
  TContainer extends ElementType,
  TButton extends ElementType,
  TItem
> = {
  items: TItem[];
  activeId: string | number;
  onSelect: (id: TItem extends { id: infer U } ? U : string | number) => void;
  renderLabel: (item: TItem) => React.ReactNode;
  
  variant?: 'default' | 'custom';

  containerAs?: TContainer;
  containerProps?: ComponentPropsWithoutRef<TContainer>;
  
  buttonAs?: TButton;
  buttonProps?: ComponentPropsWithoutRef<TButton> & {
    getActiveProps?: (isActive: boolean) => ComponentPropsWithoutRef<TButton>;
  };
};

export const TabsGroup = <
  TContainer extends ElementType = 'div',
  TButton extends ElementType = 'button',
  TItem extends { id: string | number } = { id: string | number }
>({
  items,
  activeId,
  onSelect,
  renderLabel,
  variant = 'default',
  containerAs,
  containerProps,
  buttonAs,
  buttonProps,
}: TabsGroupProps<TContainer, TButton, TItem>) => {
  
  const Container = containerAs || 'div';
  const TabButton = buttonAs || 'button';
  const { getActiveProps, className: userButtonClassName, ...restButtonProps } = buttonProps || {};
  const isDefault = variant === 'default';

  const containerClassName = [
    isDefault ? defaultStyles.defaultContainer : '',
    containerProps?.className || ''
  ].filter(Boolean).join(' ');

  return (
    <Container {...containerProps} className={containerClassName}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        
        const baseButtonClass = isDefault ? defaultStyles.defaultButton : '';
        const activeButtonClass = (isDefault && isActive) ? defaultStyles.defaultActive : '';
        const userDynamicProps = getActiveProps ? getActiveProps(isActive) : {};

        const mergedButtonClassName = [
          baseButtonClass,
          activeButtonClass,
          userButtonClassName,
          userDynamicProps.className || ''
        ].filter(Boolean).join(' ');

        return (
          <TabButton
            key={item.id}
            onClick={() => onSelect(item.id)}
            {...restButtonProps}
            {...userDynamicProps}
            className={mergedButtonClassName}
          >
            {renderLabel(item)}
          </TabButton>
        );
      })}
    </Container>
  );
};
