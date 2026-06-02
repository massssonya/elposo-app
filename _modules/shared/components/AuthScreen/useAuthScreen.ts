import { useCallback } from 'react';
import { useNumpadState, NumpadValidationResult } from '@shared/components/Numpad/useNumpadState';
import { useAuthStore } from '@shared/stores/authStore';
import { Permission } from '@shared/types/auth';

const PIN_LENGTH = 4;

interface UseAuthScreenProps {
  onSuccessRedirect: (permissions: Permission[]) => void;
}

export function useAuthScreen({ onSuccessRedirect }: UseAuthScreenProps) {
  const authByPin = useAuthStore((state) => state.authByPin);

  const handleAuthComplete = useCallback((finalPin: string): NumpadValidationResult => {
    const result = authByPin(finalPin);

    if (result.success) {
      const loggedUser = useAuthStore.getState().user;
      if (loggedUser) {
        setTimeout(() => onSuccessRedirect(loggedUser.permissions), 0);
      }
      return { success: true };
    }

    return { 
      success: false, 
      error: result.error || 'Неверный ПИН-код' 
    };
  }, [authByPin, onSuccessRedirect]);

  const { value: pin, error, numpadProps } = useNumpadState({
    maxLength: PIN_LENGTH,
    onComplete: handleAuthComplete,
  });

  return {
    pin,
    error,
    maxLength: PIN_LENGTH,
    numpadProps,
  };
}
