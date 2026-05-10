import { EmissionCard } from '../molecules/EmissionCard';
import { EmissionsSkeletonGrid } from '../molecules/EmissionsSkeletonGrid';
import { EmptyState } from '../molecules/EmptyState';
import type { Emission } from '../../../types/emissions';

export interface EmissionsGridProps {
  emissions: Emission[];
  isLoading: boolean;
}

export function EmissionsGrid({ emissions, isLoading }: EmissionsGridProps) {
  if (isLoading) {
    return <EmissionsSkeletonGrid />;
  }

  if (emissions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {emissions.map((emission) => (
        <EmissionCard key={emission.id} emission={emission} />
      ))}
    </div>
  );
}