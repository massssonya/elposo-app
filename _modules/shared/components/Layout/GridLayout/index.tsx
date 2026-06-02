'use client';

import React from 'react';
import styles from './GridLayout.module.css';

interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto'; // Фиксированные колонки или авто-заполнение
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  minWidth?: string; // Используется только если cols="auto" (например, "150px")
  className?: string; // Для возможности точечно докинуть кастомные стили
}

export function GridLayout({
  children,
  cols = 3,
  gap = 'md',
  minWidth,
  className = '',
  style,
  ...props
}: GridLayoutProps) {
  // Собираем классы
  const gridClasses = [
    styles.grid,
    styles[`cols_${cols}`],
    styles[`gap_${gap}`],
    className
  ].filter(Boolean).join(' ');

  // Передаем переменную min-width в CSS, если выбран авто-режим
  const customStyle: React.CSSProperties = {
    ...style,
    ...(cols === 'auto' && minWidth ? { '--grid-min-width': minWidth } : {}),
  } as React.CSSProperties;

  return (
    <div className={gridClasses} style={customStyle} {...props}>
      {children}
    </div>
  );
}
