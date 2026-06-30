import React, { ElementType, ComponentPropsWithoutRef, useRef, useEffect } from 'react';
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
    getActiveProps?: (isActive: boolean) => ComponentPropsWithoutRef<TContainer>;
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

  const containerRef = useRef<HTMLElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const containerClassName = [
    isDefault ? defaultStyles.defaultContainer : '',
    containerProps?.className || ''
  ].filter(Boolean).join(' ');

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    if (!containerRef.current) return;
    isDragging.current = false;
    containerRef.current.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  }, []);

  return (
    <Container 
      {...containerProps} 
      className={containerClassName}
      ref={containerRef as React.Ref<any>}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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