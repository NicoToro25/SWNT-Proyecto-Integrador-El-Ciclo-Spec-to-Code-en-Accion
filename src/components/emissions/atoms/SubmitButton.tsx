import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type SubmitButtonProps = PropsWithChildren<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    isLoading?: boolean;
  }
>;

export function SubmitButton({ children, isLoading = false, disabled, ...props }: SubmitButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? 'submit'}
      disabled={disabled || isLoading}
      className={`inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-700 px-5 py-2.5 font-medium text-white transition-colors hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50 ${props.className ?? ''}`.trim()}
    >
      {isLoading ? 'Guardando...' : children}
    </button>
  );
}