import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';

import { EMISSION_CATEGORIES, type EmissionCategory, type NewEmissionPayload } from '../../../types/emissions';
import { FormFeedback } from '../atoms/FormFeedback';
import { InputField } from '../atoms/InputField';
import { NumberInput } from '../atoms/NumberInput';
import { SelectField } from '../atoms/SelectField';
import { SubmitButton } from '../atoms/SubmitButton';

export interface EmissionFormProps {
  onSubmit: (payload: NewEmissionPayload) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

type FormValues = {
  source_name: string;
  category: EmissionCategory | '';
  co2_kg: number | '';
  notes: string;
};

type FieldErrors = Partial<Record<'source_name' | 'category' | 'co2_kg' | 'notes', string>>;

const initialValues: FormValues = {
  source_name: '',
  category: '',
  co2_kg: '',
  notes: '',
};

function validateForm(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.source_name.trim()) {
    errors.source_name = 'El nombre de la fuente es obligatorio.';
  } else if (values.source_name.trim().length > 100) {
    errors.source_name = 'El nombre de la fuente no puede superar 100 caracteres.';
  }

  if (!values.category) {
    errors.category = 'La categoría es obligatoria.';
  } else if (!EMISSION_CATEGORIES.includes(values.category)) {
    errors.category = 'La categoría seleccionada no es válida.';
  }

  if (values.co2_kg === '') {
    errors.co2_kg = 'El valor de CO2 es obligatorio.';
  } else if (values.co2_kg <= 0) {
    errors.co2_kg = 'El valor de CO2 debe ser mayor que 0.';
  } else if (values.co2_kg > 999.999) {
    errors.co2_kg = 'El valor de CO2 no puede superar 999.999.';
  }

  if (values.notes.trim().length > 500) {
    errors.notes = 'Las notas no pueden superar 500 caracteres.';
  }

  return errors;
}

export function EmissionForm({ onSubmit, isSubmitting, onCancel }: EmissionFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const isValid = useMemo(() => Object.keys(validateForm(values)).length === 0, [values]);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  const handleChange = <K extends keyof FormValues>(field: K, nextValue: FormValues[K]) => {
    setValues((current) => {
      const nextValues = { ...current, [field]: nextValue };

      if (isDirty) {
        setFieldErrors(validateForm(nextValues));
      }

      return nextValues;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDirty(true);

    const validationErrors = validateForm(values);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit({
      source_name: values.source_name.trim(),
      category: values.category as EmissionCategory,
      co2_kg: Number(values.co2_kg),
      notes: values.notes.trim() ? values.notes.trim() : undefined,
    });

    setValues(initialValues);
    setFieldErrors({});
    setIsDirty(false);
    onCancel?.();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <InputField
        ref={firstFieldRef}
        id="source_name"
        label="Nombre de la fuente"
        value={values.source_name}
        onChange={(nextValue) => handleChange('source_name', nextValue)}
        placeholder="Ej. Flota logística"
        error={fieldErrors.source_name}
        required
        maxLength={100}
      />

      <SelectField
        id="category"
        label="Categoría"
        value={values.category}
        options={EMISSION_CATEGORIES.map((category) => ({ value: category, label: category }))}
        onChange={(nextValue) => handleChange('category', nextValue as EmissionCategory | '')}
        placeholder="Selecciona una categoría"
        error={fieldErrors.category}
        required
      />

      <NumberInput
        id="co2_kg"
        label="CO2 producido"
        value={values.co2_kg}
        onChange={(nextValue) => handleChange('co2_kg', nextValue)}
        min={0}
        max={999.999}
        step={0.001}
        unit="kg"
        error={fieldErrors.co2_kg}
        required
      />

      <div className="space-y-1.5">
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-neutral-700">
          Notas
        </label>
        <textarea
          id="notes"
          value={values.notes}
          onChange={(event) => handleChange('notes', event.target.value)}
          rows={4}
          maxLength={500}
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-base text-neutral-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Información adicional opcional"
        />
        {fieldErrors.notes ? <p className="text-xs text-error-600">{fieldErrors.notes}</p> : null}
      </div>

      {!isValid && isDirty ? <FormFeedback message="Revisa los campos marcados antes de continuar." tone="error" /> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButton isLoading={isSubmitting} disabled={isSubmitting} className="w-full sm:w-auto">
          Registrar emisión
        </SubmitButton>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-100 px-5 py-2.5 font-medium text-brand-700 transition-colors hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}