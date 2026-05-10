import type { Emission, NewEmissionPayload } from '../types/emissions';

export interface EmissionsRepository {
  list(): Promise<Emission[]>;
  add(payload: NewEmissionPayload): Promise<Emission>;
}

const INITIAL_EMISSIONS: Emission[] = [
  {
    id: 'emm_001',
    source_name: 'Flota logística Bogotá',
    category: 'transporte',
    co2_kg: 1840.25,
    recorded_at: '2026-05-10T10:15:00.000Z',
    notes: 'Consumo mensual estimado para distribución urbana.',
  },
  {
    id: 'emm_002',
    source_name: 'Planta de manufactura Norte',
    category: 'manufactura',
    co2_kg: 2920.5,
    recorded_at: '2026-05-09T16:40:00.000Z',
    notes: 'Energía térmica y procesos industriales combinados.',
  },
  {
    id: 'emm_003',
    source_name: 'Compra de energía renovable',
    category: 'energia',
    co2_kg: 580.75,
    recorded_at: '2026-05-08T08:05:00.000Z',
    notes: 'Factor de emisión actualizado para red híbrida.',
  },
];

let emissionsStore: Emission[] = [...INITIAL_EMISSIONS];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `emm_${crypto.randomUUID()}`;
  }

  return `emm_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const emissionsRepository: EmissionsRepository = {
  async list() {
    await delay(450);
    return [...emissionsStore].sort((left, right) => right.recorded_at.localeCompare(left.recorded_at));
  },

  async add(payload) {
    await delay(600);

    const emission: Emission = {
      id: generateId(),
      source_name: payload.source_name,
      category: payload.category,
      co2_kg: payload.co2_kg,
      recorded_at: new Date().toISOString(),
      notes: payload.notes,
    };

    emissionsStore = [emission, ...emissionsStore];
    return emission;
  },
};