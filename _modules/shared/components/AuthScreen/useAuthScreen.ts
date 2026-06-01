import { useState, useCallback } from 'react';
import { useAuthStore } from '@shared/stores/authStore';
import { Permission } from '@shared/types/auth';

const PIN_LENGTH = 4;

interface UseAuthScreenProps {
  onSuccessRedirect: (permissions: Permission[]) => void;
}

export function useAuthScreen({ onSuccessRedirect }: UseAuthScreenProps) {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const authByPin = useAuthStore((state) => state.authByPin);

  const handleKeyPress = useCallback(
    (digit: string) => {
      setPin((prevPin) => {
        if (prevPin.length >= PIN_LENGTH) return prevPin;

        setError(null);
        const newPin = prevPin + digit;

        if (newPin.length === PIN_LENGTH) {
          const result = authByPin(newPin);

          if (result.success) {
            const loggedUser = useAuthStore.getState().user;
            if (loggedUser) {
              setTimeout(() => onSuccessRedirect(loggedUser.permissions), 0);
            }
          } else {
            setError(result.error || 'Ошибка входа');
            return '';
          }
        }

        return newPin;
      });
    },
    [authByPin, onSuccessRedirect]
  );

  const handleClear = useCallback(() => {
    setPin('');
    setError(null);
  }, []);

  const handleDelete = useCallback(() => {
    setPin((prev) => {
      if (prev.length === 0) return prev;
      setError(null);
      return prev.slice(0, -1);
    });
  }, []);

  return {
    pin,
    error,
    PIN_LENGTH,
    handleKeyPress,
    handleClear,
    handleDelete,
  };
}
