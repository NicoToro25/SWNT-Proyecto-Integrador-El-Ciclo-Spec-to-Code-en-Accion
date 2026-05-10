export interface EmptyStateProps {
  onAddClick?: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
      <p className="text-lg font-semibold text-neutral-900">No hay emisiones registradas</p>
      <p className="mt-2 text-sm text-neutral-600">Crea la primera emisión para empezar a monitorear el inventario.</p>
      {onAddClick ? (
        <button
          type="button"
          onClick={onAddClick}
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-700 px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-900"
        >
          Nueva emisión
        </button>
      ) : null}
    </div>
  );
}