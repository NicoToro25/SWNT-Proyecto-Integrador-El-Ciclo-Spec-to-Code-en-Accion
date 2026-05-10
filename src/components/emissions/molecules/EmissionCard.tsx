import { memo } from 'react';

import { CategoryBadge } from '../atoms/CategoryBadge';
import { CO2Display } from '../atoms/CO2Display';
import type { Emission } from '../../../types/emissions';

export interface EmissionCardProps {
  emission: Emission;
}

function formatRecordedAt(recordedAt: string): string {
  const date = new Date(recordedAt);

  if (Number.isNaN(date.getTime())) {
    return recordedAt;
  }

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function EmissionCardComponent({ emission }: EmissionCardProps) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <CategoryBadge category={emission.category} />
          <div>
            <h3 className="text-base font-semibold text-neutral-900">{emission.source_name}</h3>
            {emission.notes ? <p className="mt-1 text-sm text-neutral-600">{emission.notes}</p> : null}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <CO2Display value={emission.co2_kg} />
      </div>

      <p className="mt-4 text-xs text-neutral-500">Registrada el {formatRecordedAt(emission.recorded_at)}</p>
    </article>
  );
}

export const EmissionCard = memo(EmissionCardComponent);