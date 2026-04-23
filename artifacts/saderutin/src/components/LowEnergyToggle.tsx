import { Battery, BatteryLow } from 'lucide-react';

type Props = { active: boolean; onChange: (v: boolean) => void };
export function LowEnergyToggle({ active, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!active)}
      aria-pressed={active}
      className={`w-full flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors min-h-[64px] ${active ? 'bg-accent/10 border-accent text-foreground' : 'bg-card border-border text-foreground hover:border-primary/40'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>
          {active ? <BatteryLow className="h-5 w-5" /> : <Battery className="h-5 w-5" />}
        </div>
        <div>
          <div className="font-medium">{active ? 'Low energy mode is on' : 'Low energy today?'}</div>
          <div className="text-xs text-muted-foreground">{active ? 'Showing the gentler version of your routine.' : 'Switch to the minimum routine. No pressure.'}</div>
        </div>
      </div>
      <div className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${active ? 'bg-accent' : 'bg-muted'}`}>
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
    </button>
  );
}
