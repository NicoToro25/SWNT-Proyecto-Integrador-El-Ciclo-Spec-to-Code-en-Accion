import { useCallback, useState } from 'react';

import { EmissionsTrackerLayout } from '../layouts/EmissionsTrackerLayout';
import { useEmissions } from '../hooks/useEmissions';
import { EmissionsFormPanel } from '../components/emissions/organisms/EmissionsFormPanel';
import { EmissionsGrid } from '../components/emissions/organisms/EmissionsGrid';
import { EmissionsHeader } from '../components/emissions/organisms/EmissionsHeader';
import { ErrorBanner } from '../components/emissions/atoms/ErrorBanner';

export function EmissionsTrackerPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { emissions, isLoading, isRefreshing, isSubmitting, error, addEmission, refreshEmissions, clearError } = useEmissions();

  const handleOpenForm = useCallback(() => {
    clearError();
    setIsFormOpen(true);
  }, [clearError]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleRefresh = useCallback(() => {
    void refreshEmissions();
  }, [refreshEmissions]);

  return (
    <EmissionsTrackerLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:pr-[472px]">
        <EmissionsHeader
          onAddClick={handleOpenForm}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {error ? <ErrorBanner message={error} onDismiss={clearError} /> : null}

        <main>
          <EmissionsGrid emissions={emissions} isLoading={isLoading} isRefreshing={isRefreshing} onAddClick={handleOpenForm} />
        </main>
      </div>

      <EmissionsFormPanel
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={addEmission}
        isSubmitting={isSubmitting}
        submitError={error}
      />
    </EmissionsTrackerLayout>
  );
}