'use client';

import React, { useEffect } from 'react';
import { FlexLayout } from '../Layout/FlexLayout';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
}: ModalProps) {
  
  // 🌟 Системная бизнес-логика модального окна
  useEffect(() => {
    if (!isOpen) return;

    // 1. Блокируем скролл body под оверлеем
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // 2. Закрытие окна по кнопке Escape (Esc)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Подчищаем слушатели и стили при размонтировании/закрытии
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div 
        className={`${styles.modal} ${styles[`size_${size}`]}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <FlexLayout justify="between" align="center">
          <h3 className={styles.title}>{title}</h3>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Закрыть">
            &times;
          </button>
        </FlexLayout>
        
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
