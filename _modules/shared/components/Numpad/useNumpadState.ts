import { useState, useCallback } from 'react';

export interface NumpadValidationResult {
  success: boolean;
  error?: string;
}

interface UseNumpadStateOptions {
  maxLength?: number;
  onComplete?: (finalValue: string) => NumpadValidationResult; 
}

export function useNumpadState(options: UseNumpadStateOptions = {}) {
  const { maxLength = Infinity, onComplete } = options;
  
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleKeyPress = useCallback((digit: string) => {
    setValue((prev) => {
      if (prev.length >= maxLength) return prev;
      
      setError(null);
      const newValue = prev + digit;

      if (newValue.length === maxLength && onComplete) {
        const result = onComplete(newValue);

        if (!result.success) {
          setError(result.error || 'Ошибка валидации');
          return '';
        }
      }

      return newValue;
    });
  }, [maxLength, onComplete]);

  const handleClear = useCallback(() => {
    setValue('');
    setError(null);
  }, []);

  const handleDelete = useCallback(() => {
    setError(null);
    setValue((prev) => (prev.length === 0 ? prev : prev.slice(0, -1)));
  }, []);

  const resetAll = useCallback(() => {
    setValue('');
    setError(null);
  }, []);

  const resetValue = useCallback(() => setValue(''), [])

  const setManualError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setValue('');
  }, []);

  return {
    value,
    error,   
    resetValue,
    resetAll,
    setManualError,
    numpadProps: {
      onKeyPress: handleKeyPress,
      onClear: handleClear,
      onDelete: handleDelete,
    }
  };
}
