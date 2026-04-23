type Props = { value?: number; onChange: (n: number) => void };
const MOODS = [
  { v: 1, label: 'rough' },
  { v: 2, label: 'okay' },
  { v: 3, label: 'steady' },
  { v: 4, label: 'good' },
  { v: 5, label: 'great' },
];
export function MoodPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="How are you feeling">
      {MOODS.map(({ v, label }) => {
        const active = value === v;
        return (
          <button
            key={v}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={`flex flex-col items-center justify-center rounded-xl border py-3 text-xs font-medium transition-colors min-h-[56px] ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}
          >
            <span className="capitalize">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
