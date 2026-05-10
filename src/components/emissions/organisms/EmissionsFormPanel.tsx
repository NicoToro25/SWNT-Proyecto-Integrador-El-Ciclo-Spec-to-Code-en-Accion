import { useEffect } from 'react';

import type { NewEmissionPayload } from '../../../types/emissions';
import { EmissionForm } from '../molecules/EmissionForm';

export interface EmissionsFormPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: NewEmissionPayload) => Promise<void>;
  isSubmitting: boolean;
}

export function EmissionsFormPanel({ isOpen, onClose, onSubmit, isSubmitting }: EmissionsFormPanelProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <aside
      className={`fixed inset-x-4 bottom-4 z-30 rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl transition-all duration-200 lg:inset-y-6 lg:right-6 lg:left-auto lg:w-[440px] ${isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
      aria-hidden={!isOpen}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Registrar emisión</h2>
          <p className="text-sm text-neutral-600">Completa los campos para guardar una nueva emisión.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          aria-label="Cerrar formulario"
        >
          ×
        </button>
      </div>

      {isOpen ? <EmissionForm onSubmit={onSubmit} isSubmitting={isSubmitting} onCancel={onClose} /> : null}
    </aside>
  );
}