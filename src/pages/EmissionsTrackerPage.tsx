import { useState } from 'react';

import { EmissionsTrackerLayout } from '../layouts/EmissionsTrackerLayout';
import { useEmissions } from '../hooks/useEmissions';
import { EmissionsFormPanel } from '../components/emissions/organisms/EmissionsFormPanel';
import { EmissionsGrid } from '../components/emissions/organisms/EmissionsGrid';
import { EmissionsHeader } from '../components/emissions/organisms/EmissionsHeader';
import { ErrorBanner } from '../components/emissions/atoms/ErrorBanner';

export function EmissionsTrackerPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { emissions, isLoading, isSubmitting, error, addEmission, refreshEmissions } = useEmissions();

  return (
    <EmissionsTrackerLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:pr-[472px]">
        <EmissionsHeader
          onAddClick={() => setIsFormOpen(true)}
          onRefresh={() => {
            void refreshEmissions();
          }}
          isRefreshing={isLoading}
        />

        {error ? <ErrorBanner message={error} /> : null}

        <main>
          <EmissionsGrid emissions={emissions} isLoading={isLoading} />
        </main>
      </div>

      <EmissionsFormPanel
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={addEmission}
        isSubmitting={isSubmitting}
      />
    </EmissionsTrackerLayout>
  );
}