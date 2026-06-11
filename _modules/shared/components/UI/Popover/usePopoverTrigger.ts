'use client';

import { useState, useRef, useCallback } from 'react';

interface UsePopoverTriggerProps {
  delayMs?: number;
  minTopSpace?: number;
}

export interface PopoverCoords {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function usePopoverTrigger({ delayMs = 500, minTopSpace = 180 }: UsePopoverTriggerProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<PopoverCoords>({ x: 0, y: 0, width: 0, height: 0 });
  const [position, setPosition] = useState<'top' | 'bottom'>('top');

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const startPress = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isLongPressRef.current = false;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setCoords({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });

    if (rect.top < minTopSpace) {
      setPosition('bottom');
    } else {
      setPosition('top');
    }

    pressTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      isLongPressRef.current = true;
    }, delayMs);
  }, [delayMs, minTopSpace]);

  const endPress = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
    setIsOpen(false);
  }, []);

  const handleTriggerClick = useCallback((e: React.MouseEvent, onClickCallback: () => void) => {
    if (isLongPressRef.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPressRef.current = false;
      return;
    }
    onClickCallback();
  }, []);

  return {
    isOpen,
    coords,
    position,
    triggerProps: {
      onPointerDown: startPress,
      onPointerUp: endPress,
      onPointerLeave: endPress,
      onPointerCancel: endPress,
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    },
    handleTriggerClick,
  };
}
