import { useCallback, useEffect, useRef, useState } from 'react';

import { emissionsRepository } from '../data/emissionsRepository';
import type { Emission, MutationResult, NewEmissionPayload, UseEmissionsReturn } from '../types/emissions';

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
}

function createMutationResult(ok: boolean, message?: string): MutationResult {
  return {
    ok,
    message,
  };
}

export function useEmissions(): UseEmissionsReturn {
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchEmissions = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    if (!isMountedRef.current) {
      return;
    }

    if (mode === 'initial') {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);

    try {
      const data = await emissionsRepository.list();

      if (!isMountedRef.current) {
        return;
      }

      setEmissions(data);
      setError(null);
    } catch (errorValue: unknown) {
      if (!isMountedRef.current) {
        return;
      }

      setError(getErrorMessage(errorValue, 'No fue posible cargar las emisiones.'));
    } finally {
      if (!isMountedRef.current) {
        return;
      }

      if (mode === 'initial') {
        setIsLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    void (async () => {
      await fetchEmissions('initial');
    })();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchEmissions]);

  const refreshEmissions = useCallback(async () => {
    await fetchEmissions('refresh');
  }, [fetchEmissions]);

  const addEmission = useCallback(
    async (payload: NewEmissionPayload): Promise<MutationResult> => {
      if (!isMountedRef.current) {
        return createMutationResult(false, 'La vista ya no está disponible.');
      }

      setIsSubmitting(true);
      setError(null);

      try {
        await emissionsRepository.add(payload);

        if (!isMountedRef.current) {
          return createMutationResult(false, 'La vista ya no está disponible.');
        }

        await fetchEmissions('refresh');
        return createMutationResult(true, 'Emisión registrada con éxito.');
      } catch (errorValue: unknown) {
        if (!isMountedRef.current) {
          return createMutationResult(false, 'La vista ya no está disponible.');
        }

        const message = getErrorMessage(errorValue, 'No fue posible registrar la emisión.');
        setError(message);
        return createMutationResult(false, message);
      } finally {
        if (isMountedRef.current) {
          setIsSubmitting(false);
        }
      }
    },
    [fetchEmissions],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    emissions,
    isLoading,
    isRefreshing,
    isSubmitting,
    error,
    addEmission,
    refreshEmissions,
    clearError,
  };
}