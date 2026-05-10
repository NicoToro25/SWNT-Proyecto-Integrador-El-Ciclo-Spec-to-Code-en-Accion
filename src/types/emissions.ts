export type EmissionCategory =
  | 'energia'
  | 'transporte'
  | 'manufactura'
  | 'agricultura'
  | 'residuos'
  | 'otro';

export const EMISSION_CATEGORIES: ReadonlyArray<EmissionCategory> = [
  'energia',
  'transporte',
  'manufactura',
  'agricultura',
  'residuos',
  'otro',
];

export interface Emission {
  id: string;
  source_name: string;
  category: EmissionCategory;
  co2_kg: number;
  recorded_at: string;
  created_by?: string;
  notes?: string;
}

export interface NewEmissionPayload {
  source_name: string;
  category: EmissionCategory;
  co2_kg: number;
  notes?: string;
}

export interface MutationResult {
  ok: boolean;
  message?: string;
}

export interface UseEmissionsReturn {
  emissions: Emission[];
  isLoading: boolean;
  isRefreshing: boolean;
  isSubmitting: boolean;
  error: string | null;
  addEmission: (payload: NewEmissionPayload) => Promise<MutationResult>;
  refreshEmissions: () => Promise<void>;
  clearError: () => void;
}