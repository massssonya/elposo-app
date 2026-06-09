'use client';

import React from 'react';

import { usePanZoom } from './usePanZoom';

import styles from './PanZoomCanvas.module.css';

interface PanZoomCanvasProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  className?: string;
  canvasWidth?: number;
  canvasHeight?: number;
}

export const PanZoomCanvas: React.FC<PanZoomCanvasProps> = ({
  children,
  minScale = 0.4,
  maxScale = 1,
  className = '',
  canvasWidth = 1600,
  canvasHeight = 1200,
}) => {
  const {
    containerRef,
    isDragging,
    matrixTransform,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = usePanZoom({ minScale, maxScale, canvasWidth, canvasHeight });

  const viewportClassName = [
    styles.viewport,
    isDragging ? styles.viewportDragging : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={viewportClassName}
    >
      <div
        className={styles.content}
        style={{ transform: matrixTransform }}
      >
        {children}
      </div>
    </div>
  );
};
