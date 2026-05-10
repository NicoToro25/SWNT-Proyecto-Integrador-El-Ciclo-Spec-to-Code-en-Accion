type AddEmissionButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export function AddEmissionButton({ onClick, disabled = false, isLoading = false }: AddEmissionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-700 px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? 'Actualizando...' : 'Nueva emisión'}
    </button>
  );
}