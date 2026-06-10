'use client';

import { useState, useCallback } from 'react';

export function useOrderConstructorModals() {
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const handleTransferOpen = useCallback(() => setIsTransferOpen(true), []);
  const handleTransferClose = useCallback(() => setIsTransferOpen(false), []);

  const handleCancelOpen = useCallback(() => setIsCancelOpen(true), []);
  const handleCancelClose = useCallback(() => setIsCancelOpen(false), []);

  return {
    isTransferOpen,
    isCancelOpen,

    transfer: {
      open: handleTransferOpen,
      close: handleTransferClose,
      set: setIsTransferOpen,
    },
    cancel: {
      open: handleCancelOpen,
      close: handleCancelClose,
    },
  };
}
