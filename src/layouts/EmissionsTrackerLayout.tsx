import type { PropsWithChildren } from 'react';

export function EmissionsTrackerLayout({ children }: PropsWithChildren) {
  return <div className="min-h-screen bg-neutral-100 px-4 py-6 font-body text-neutral-900 sm:px-6 lg:px-8">{children}</div>;
}