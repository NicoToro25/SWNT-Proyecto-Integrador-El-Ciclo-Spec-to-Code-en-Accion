export interface EmissionsSkeletonGridProps {
  count?: number;
}

export function EmissionsSkeletonGrid({ count = 6 }: EmissionsSkeletonGridProps) {
  return (
    <div aria-busy="true" aria-label="Cargando emisiones" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="h-5 w-24 rounded-full bg-neutral-200" />
          <div className="mt-4 h-4 w-3/4 rounded-full bg-neutral-200" />
          <div className="mt-6 h-10 w-40 rounded-xl bg-neutral-200" />
          <div className="mt-4 h-3 w-1/2 rounded-full bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}