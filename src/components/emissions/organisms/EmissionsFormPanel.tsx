import { useEffect, useId, useRef } from 'react';

import type { NewEmissionPayload } from '../../../types/emissions';
import { EmissionForm } from '../molecules/EmissionForm';

export interface EmissionsFormPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: NewEmissionPayload) => Promise<{ ok: boolean; message?: string }>;
  isSubmitting: boolean;
  submitError: string | null;
}

export function EmissionsFormPanel({ isOpen, onClose, onSubmit, isSubmitting, submitError }: EmissionsFormPanelProps) {
  const panelRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    window.setTimeout(() => {
      const firstInteractiveElement = panelRef.current?.querySelector<HTMLElement>(
        'input, select, textarea, button:not([disabled])',
      );

      firstInteractiveElement?.focus();
    }, 0);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleBodyScroll = () => {
      document.body.style.overflow = 'hidden';
    };

    handleBodyScroll();

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-30 ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <button
        type="button"
        className={`absolute inset-0 bg-neutral-900/40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-label="Cerrar formulario"
        tabIndex={-1}
      />

    <aside
        ref={(element) => {
          panelRef.current = element;
        }}
        className={`fixed inset-x-4 bottom-4 z-40 rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl transition-all duration-200 lg:inset-y-6 lg:right-6 lg:left-auto lg:w-[440px] ${isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogDescriptionId}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 id={dialogTitleId} className="text-xl font-semibold text-neutral-900">
              Registrar emisión
            </h2>
            <p id={dialogDescriptionId} className="text-sm text-neutral-600">
              Completa los campos para guardar una nueva emisión.
            </p>
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

        {submitError ? (
          <div className="mb-4 rounded-xl border border-error-600/20 bg-error-100 px-4 py-3 text-sm text-error-600" role="status">
            {submitError}
          </div>
        ) : null}

        {isOpen ? <EmissionForm onSubmit={onSubmit} isSubmitting={isSubmitting} onCancel={onClose} /> : null}
      </aside>
    </div>
  );
}