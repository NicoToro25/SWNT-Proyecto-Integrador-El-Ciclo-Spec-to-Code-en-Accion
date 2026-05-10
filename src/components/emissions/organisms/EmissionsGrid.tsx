import { EmissionCard } from '../molecules/EmissionCard';
import { EmissionsSkeletonGrid } from '../molecules/EmissionsSkeletonGrid';
import { EmptyState } from '../molecules/EmptyState';
import type { Emission } from '../../../types/emissions';

export interface EmissionsGridProps {
  emissions: Emission[];
  isLoading: boolean;
  isRefreshing: boolean;
  onAddClick: () => void;
}

export function EmissionsGrid({ emissions, isLoading, isRefreshing, onAddClick }: EmissionsGridProps) {
  if (isLoading) {
    return <EmissionsSkeletonGrid />;
  }

  if (emissions.length === 0) {
    return <EmptyState onAddClick={onAddClick} />;
  }

  return (
    <section className="space-y-4" aria-live="polite">
      {isRefreshing ? (
        <div className="rounded-2xl border border-brand-100 bg-brand-100 px-4 py-3 text-sm font-medium text-brand-900">
          Actualizando emisiones en segundo plano...
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {emissions.map((emission) => (
          <EmissionCard key={emission.id} emission={emission} />
        ))}
      </div>
    </section>
  );
}