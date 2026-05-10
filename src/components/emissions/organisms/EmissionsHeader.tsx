import { AddEmissionButton } from '../atoms/AddEmissionButton';
import { PageTitle } from '../atoms/PageTitle';

export interface EmissionsHeaderProps {
  onAddClick: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function EmissionsHeader({ onAddClick, onRefresh, isRefreshing = false }: EmissionsHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <PageTitle
        title="EmissionsTracker"
        description="Registra, consulta y controla las emisiones de CO2 del módulo de sostenibilidad."
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-100 px-5 py-2.5 font-medium text-brand-700 transition-colors hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Actualizar emisiones"
        >
          {isRefreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
        <AddEmissionButton onClick={onAddClick} disabled={isRefreshing} isLoading={isRefreshing} />
      </div>
    </header>
  );
}