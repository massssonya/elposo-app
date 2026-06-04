'use client';

import React from 'react';
import styles from './FlexLayout.module.css';

type AsProp<T extends React.ElementType> = {
  as?: T;
};

type FlexLayoutProps<T extends React.ElementType> = AsProp<T> & {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  align?: 'start' | 'end' | 'center' | 'stretch';
  wrap?: 'yes' | 'no';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof AsProp<T> | 'direction' | 'justify' | 'align' | 'wrap' | 'gap'>;

export function FlexLayout<T extends React.ElementType = 'div'>({
  as,
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  wrap = 'no',
  gap = 'none',
  className = '',
  ...props
}: FlexLayoutProps<T>) {
  
  const Component = as || 'div';

  const flexClasses = [
    styles.flex,
    styles[`dir_${direction}`],
    styles[`justify_${justify}`],
    styles[`align_${align}`],
    styles[`wrap_${wrap}`],
    gap !== 'none' ? styles[`gap_${gap}`] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={flexClasses} {...props}>
      {children}
    </Component>
  );
}
