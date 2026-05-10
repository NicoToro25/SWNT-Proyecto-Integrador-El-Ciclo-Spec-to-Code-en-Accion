import { useCallback, useEffect, useRef, useState } from 'react';

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Emission, NewEmissionPayload, UseEmissionsReturn } from '../types/emissions';

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
}

function normalizeEmissionRow(row: Record<string, unknown>): Emission {
  return {
    id: String(row.id ?? ''),
    source_name: String(row.source_name ?? ''),
    category: row.category as Emission['category'],
    co2_kg: Number(row.co2_kg ?? 0),
    recorded_at: String(row.recorded_at ?? new Date().toISOString()),
    created_by: typeof row.created_by === 'string' ? row.created_by : undefined,
    notes: typeof row.notes === 'string' ? row.notes : undefined,
  };
}

export function useEmissions(): UseEmissionsReturn {
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchEmissions = useCallback(async () => {
    if (!isMountedRef.current) {
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      if (!isMountedRef.current) {
        return;
      }

      setEmissions([]);
      setError('Supabase no está configurado. Define las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
      setIsLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('emissions')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (fetchError) {
      if (!isMountedRef.current) {
        return;
      }

      setEmissions([]);
      setError(getErrorMessage(fetchError, 'No fue posible cargar las emisiones.'));
      setIsLoading(false);
      return;
    }

    const normalizedData = Array.isArray(data)
      ? data.map((row) => normalizeEmissionRow(row as Record<string, unknown>))
      : [];

    if (!isMountedRef.current) {
      return;
    }

    setEmissions(normalizedData);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    void (async () => {
      await fetchEmissions();
    })();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchEmissions]);

  const refreshEmissions = useCallback(async () => {
    await fetchEmissions();
  }, [fetchEmissions]);

  const addEmission = useCallback(
    async (payload: NewEmissionPayload) => {
      if (!isMountedRef.current) {
        return;
      }

      setIsSubmitting(true);
      setError(null);

      if (!isSupabaseConfigured) {
        if (!isMountedRef.current) {
          return;
        }

        setIsSubmitting(false);
        setError('Supabase no está configurado. Define las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const insertPayload = {
        ...payload,
        ...(userId ? { created_by: userId } : {}),
      };

      const { error: insertError } = await supabase.from('emissions').insert([insertPayload]);

      if (insertError) {
        if (!isMountedRef.current) {
          return;
        }

        setIsSubmitting(false);
        setError(getErrorMessage(insertError, 'No fue posible registrar la emisión.'));
        return;
      }

      if (!isMountedRef.current) {
        return;
      }

      setIsSubmitting(false);
      await fetchEmissions();
    },
    [fetchEmissions],
  );

  return {
    emissions,
    isLoading,
    isSubmitting,
    error,
    addEmission,
    refreshEmissions,
  };
}