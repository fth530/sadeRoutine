type Props = { title: string; subtitle?: string; right?: React.ReactNode };
export function AppHeader({ title, subtitle, right }: Props) {
  return (
    <header className="px-5 pt-8 pb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
