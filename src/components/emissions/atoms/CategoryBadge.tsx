import type { EmissionCategory } from '../../../types/emissions';

const CATEGORY_STYLES: Record<EmissionCategory, string> = {
  energia: 'bg-amber-100 text-amber-700',
  transporte: 'bg-blue-100 text-blue-700',
  manufactura: 'bg-purple-100 text-purple-700',
  agricultura: 'bg-green-100 text-green-700',
  residuos: 'bg-slate-100 text-slate-600',
  otro: 'bg-neutral-100 text-neutral-600',
};

const CATEGORY_LABELS: Record<EmissionCategory, string> = {
  energia: 'Energía',
  transporte: 'Transporte',
  manufactura: 'Manufactura',
  agricultura: 'Agricultura',
  residuos: 'Residuos',
  otro: 'Otro',
};

export interface CategoryBadgeProps {
  category: EmissionCategory;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'} ${CATEGORY_STYLES[category]}`}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}