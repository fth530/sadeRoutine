type Props = { value?: number; onChange: (n: number) => void };
export function EnergyPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Energy level">
      {[1, 2, 3, 4, 5].map(n => {
        const active = value === n;
        return (
          <button
            key={n}
            role="radio"
            aria-checked={active}
            aria-label={`Energy ${n}`}
            onClick={() => onChange(n)}
            className={`flex items-center justify-center rounded-xl border py-3 text-base font-medium transition-colors min-h-[56px] ${active ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
