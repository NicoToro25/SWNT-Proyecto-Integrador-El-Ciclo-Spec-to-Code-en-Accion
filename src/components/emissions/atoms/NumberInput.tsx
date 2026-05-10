import { forwardRef, useId } from 'react';

export interface NumberInputProps {
  id: string;
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { id, label, value, onChange, min = 0, max, step = 0.01, unit, error, disabled = false, required = false },
  ref,
) {
  const fallbackId = useId();
  const inputId = id || fallbackId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
        {required ? <span className="ml-1 text-error-600">*</span> : null}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue === '' ? '' : Number(nextValue));
          }}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`w-full rounded-xl border px-4 py-2.5 text-base text-neutral-900 outline-none transition focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${unit ? 'pr-16' : ''} ${error ? 'border-error-600 focus:ring-error-600' : 'border-neutral-300'}`}
        />
        {unit ? (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-neutral-500">
            {unit}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-error-600">
          {error}
        </p>
      ) : null}
    </div>
  );
});