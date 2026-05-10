export interface PageTitleProps {
  title: string;
  description?: string;
}

export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="space-y-1">
      <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">{title}</h1>
      {description ? <p className="text-sm text-neutral-600 sm:text-base">{description}</p> : null}
    </div>
  );
}