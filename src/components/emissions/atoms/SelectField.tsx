import { forwardRef, useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { id, label, value, options, onChange, placeholder = 'Seleccionar...', error, disabled = false, required = false },
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
      <select
        ref={ref}
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`w-full rounded-xl border px-4 py-2.5 text-base text-neutral-900 outline-none transition focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-error-600 focus:ring-error-600' : 'border-neutral-300'}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="text-xs text-error-600">
          {error}
        </p>
      ) : null}
    </div>
  );
});