'use client';

import React from 'react';
import styles from './FlexLayout.module.css';

const GAP_PRESETS = {
  none: '0rem',
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
} as const;

type AsProp<T extends React.ElementType> = {
  as?: T;
};

type FlexLayoutProps<T extends React.ElementType> = AsProp<T> & {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  align?: 'start' | 'end' | 'center' | 'stretch';
  wrap?: 'yes' | 'no';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
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
  style,
  ...props
}: FlexLayoutProps<T>) {
  
  const Component = as || 'div';

  const resolvedGap = GAP_PRESETS[gap as keyof typeof GAP_PRESETS] || gap;

  const flexClasses = [
    styles.flex,
    styles[`dir_${direction}`],
    styles[`justify_${justify}`],
    styles[`align_${align}`],
    styles[`wrap_${wrap}`],
    styles.flexContainer,
    className
  ].filter(Boolean).join(' ');

  const dynamicStyles = {
    ...style,
    '--flex-gap': resolvedGap,
  } as React.CSSProperties;

  return (
    <Component className={flexClasses} style={dynamicStyles} {...(props as React.ComponentPropsWithoutRef<any>)}>
      {children}
    </Component>
  );
}
