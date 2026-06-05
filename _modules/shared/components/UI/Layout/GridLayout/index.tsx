'use client';

import React from 'react';
import styles from './GridLayout.module.css';

const GAP_PRESETS = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
} as const;

interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: number | 'auto'; // 🌟 Теперь принимает абсолютно ЛЮБОЕ число колонок!
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string; // Пресет или кастомная строка (например, "24px")
  minWidth?: string; // Используется при cols="auto"
}

export function GridLayout({
  children,
  cols = 'auto',
  gap = 'md',
  minWidth = '120px',
  className = '',
  style,
  ...props
}: GridLayoutProps) {
  
  const resolvedGap = GAP_PRESETS[gap as keyof typeof GAP_PRESETS] || gap;

  const dynamicStyles: React.CSSProperties = {
    ...style,
    '--grid-gap': resolvedGap,
    '--grid-min-width': minWidth,
    '--grid-cols': typeof cols === 'number' ? `repeat(${cols}, minmax(0, 1fr))` : undefined,
  } as React.CSSProperties;

  return (
    <div 
      className={`${styles.grid} ${className}`} 
      style={dynamicStyles} 
      {...props}
    >
      {children}
    </div>
  );
}
