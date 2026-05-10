export interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-error-600/20 bg-error-100 px-4 py-3 text-error-600">
      <p className="text-sm font-medium">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-error-600 transition-colors hover:bg-error-600/10"
          aria-label="Cerrar mensaje de error"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}