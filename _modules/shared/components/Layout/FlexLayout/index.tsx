'use client';

import React from 'react';
import styles from './FlexLayout.module.css';

interface FlexLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  align?: 'start' | 'end' | 'center' | 'stretch';
  wrap?: 'yes' | 'no';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function FlexLayout({
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  wrap = 'no',
  gap = 'none',
  className = '',
  ...props
}: FlexLayoutProps) {
  
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
    <div className={flexClasses} {...props}>
      {children}
    </div>
  );
}
