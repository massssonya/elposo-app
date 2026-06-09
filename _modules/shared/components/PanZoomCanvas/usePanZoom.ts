'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface UsePanZoomProps {
  minScale: number;
  maxScale: number;
  canvasWidth: number;
  canvasHeight: number;
}

export function usePanZoom({ minScale, maxScale, canvasWidth, canvasHeight }: UsePanZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.6 });
  const [isDragging, setIsDragging] = useState(false);

  const clampCoordinates = useCallback((x: number, y: number, scale: number) => {
    if (!containerRef.current) return { x, y };

    const rect = containerRef.current.getBoundingClientRect();
    const screenWidth = rect.width;
    const screenHeight = rect.height;

    const scaledWidth = canvasWidth * scale;
    const scaledHeight = canvasHeight * scale;

    let minX = 0, maxX = 0, minY = 0, maxY = 0;

    if (scaledWidth > screenWidth) {
      minX = screenWidth - scaledWidth;
      maxX = 0;
    } else {
      minX = (screenWidth - scaledWidth) / 2;
      maxX = minX;
    }

    if (scaledHeight > screenHeight) {
      minY = screenHeight - scaledHeight;
      maxY = 0;
    } else {
      minY = (screenHeight - scaledHeight) / 2;
      maxY = minY;
    }

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  }, [canvasWidth, canvasHeight]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    
    setTransform((prev) => {
      let newScale = prev.scale * zoomFactor;
      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      const scaleRatio = newScale / prev.scale;
      const targetX = mouseX - (mouseX - prev.x) * scaleRatio;
      const targetY = mouseY - (mouseY - prev.y) * scaleRatio;

      const clamped = clampCoordinates(targetX, targetY, newScale);
      return { x: clamped.x, y: clamped.y, scale: newScale };
    });
  }, [minScale, maxScale, clampCoordinates]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return; 
    setIsDragging(true);
    
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [transform.x, transform.y]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;

    const targetX = e.clientX - dragStart.current.x;
    const targetY = e.clientY - dragStart.current.y;

    const clamped = clampCoordinates(targetX, targetY, transform.scale);
    setTransform((prev) => ({ ...prev, x: clamped.x, y: clamped.y }));
  }, [isDragging, clampCoordinates, transform.scale]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, [isDragging]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    setTransform((prev) => {
      const clamped = clampCoordinates(prev.x, prev.y, prev.scale);
      return { ...prev, x: clamped.x, y: clamped.y };
    });
  }, [clampCoordinates]);

  const matrixTransform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;

  return {
    containerRef,
    isDragging,
    matrixTransform,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
