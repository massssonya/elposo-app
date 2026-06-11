'use client';

import React, { memo, useEffect, useState } from 'react';

import { createPortal } from 'react-dom';
import { PopoverCoords } from './usePopoverTrigger';

import styles from './Popover.module.css';

interface PopoverProps {
  isOpen: boolean;
  coords: PopoverCoords;
  position: 'top' | 'bottom';
  children: React.ReactNode;
  width?: number;
  containerId?: string; 
}

const DEFAULT_CONTAINER = 'popover-root'

export const Popover = memo(({ 
  isOpen, 
  coords, 
  position, 
  children,
  width = 220,
  containerId = DEFAULT_CONTAINER
}: PopoverProps) => {
  const [targetContainer, setTargetContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const container = document.getElementById(containerId);
    setTargetContainer(container || document.getElementById(DEFAULT_CONTAINER) || document.body);
  }, [isOpen, containerId]);

  if (!isOpen || !targetContainer) return null;

  const topPosition = position === 'top' 
    ? coords.y - 12 
    : coords.y + coords.height + 12;

  const inlineStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${topPosition}px`,
    left: `${coords.x + coords.width / 2}px`,
    width: `${width}px`,
  };

  const popoverClassName = [
    styles.popover,
    position === 'bottom' ? styles.popoverBottom : ''
  ].filter(Boolean).join(' ');

  return createPortal(
    <div className={popoverClassName} style={inlineStyle}>
      {children}
    </div>,
    targetContainer
  );
});

Popover.displayName = 'Popover';
