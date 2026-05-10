export interface FormFeedbackProps {
  message: string;
  tone?: 'info' | 'success' | 'error';
}

const TONE_CLASSES: Record<NonNullable<FormFeedbackProps['tone']>, string> = {
  info: 'border-brand-100 bg-brand-100 text-brand-900',
  success: 'border-success-600/20 bg-green-50 text-success-600',
  error: 'border-error-600/20 bg-error-100 text-error-600',
};

export function FormFeedback({ message, tone = 'info' }: FormFeedbackProps) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${TONE_CLASSES[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
      {message}
    </div>
  );
}