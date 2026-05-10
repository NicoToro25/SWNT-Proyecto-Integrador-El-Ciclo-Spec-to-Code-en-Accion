export interface CO2DisplayProps {
  value: number;
  unit?: 'kg' | 'ton';
  className?: string;
}

export function CO2Display({ value, unit = 'kg', className = '' }: CO2DisplayProps) {
  const displayValue = unit === 'ton' ? value / 1000 : value;
  const displayUnit = unit === 'ton' ? 'ton' : 'kg';

  return (
    <div className={className}>
      <span className="font-mono text-2xl font-bold text-neutral-900">
        {displayValue.toLocaleString('es-CO', {
          minimumFractionDigits: unit === 'ton' ? 3 : 0,
          maximumFractionDigits: 3,
        })}
      </span>
      <span className="ml-2 text-sm font-medium text-neutral-600">CO2 {displayUnit}</span>
    </div>
  );
}