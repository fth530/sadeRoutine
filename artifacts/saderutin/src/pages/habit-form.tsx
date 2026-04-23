import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/lib/types';
import { getTodayStr } from '@/lib/dates';
import { ArrowLeft, Trash2 } from 'lucide-react';

const COLORS = [
  'hsl(150 25% 55%)', 'hsl(180 25% 55%)', 'hsl(40 35% 65%)',
  'hsl(20 40% 70%)', 'hsl(220 25% 65%)', 'hsl(280 20% 65%)',
];

export default function HabitForm() {
  const [, navigate] = useLocation();
  const [, params] = useRoute('/habits/:id');
  const id = params?.id;
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();
  const existing = id ? habits.find(h => h.id === id) : undefined;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [freqKind, setFreqKind] = useState<'daily' | 'weekdays' | 'timesPerWeek'>('daily');
  const [weekdays, setWeekdays] = useState<number[]>([0,1,2,3,4]);
  const [timesPerWeek, setTimesPerWeek] = useState(3);
  const [color, setColor] = useState(COLORS[0]);
  const [minimumVersion, setMinimumVersion] = useState('');
  const [reminder, setReminder] = useState('09:00');

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setDescription(existing.description ?? '');
      setFreqKind(existing.frequency.kind);
      setWeekdays(existing.frequency.weekdays ?? [0,1,2,3,4]);
      setTimesPerWeek(existing.frequency.timesPerWeek ?? 3);
      setColor(existing.color);
      setMinimumVersion(existing.minimumVersion ?? '');
      setReminder(existing.reminderTimes[0] ?? '09:00');
    }
  }, [existing?.id]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const habit: Habit = {
      id: existing?.id ?? `h-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      frequency: freqKind === 'daily' ? { kind: 'daily' } : freqKind === 'weekdays' ? { kind: 'weekdays', weekdays } : { kind: 'timesPerWeek', timesPerWeek },
      reminderTimes: reminder ? [reminder] : [],
      color,
      minimumVersion: minimumVersion.trim() || undefined,
      createdAt: existing?.createdAt ?? getTodayStr(),
    };
    if (existing) updateHabit(existing.id, habit);
    else addHabit(habit);
    navigate('/habits');
  };

  const onDelete = () => {
    if (existing && confirm('Remove this habit? Logged entries are kept for your stats.')) {
      deleteHabit(existing.id);
      navigate('/habits');
    }
  };

  return (
    <div>
      <header className="px-5 pt-8 pb-4 flex items-center gap-3">
        <button onClick={() => navigate('/habits')} className="h-10 w-10 inline-flex items-center justify-center rounded-full hover-elevate" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold">{existing ? 'Edit habit' : 'New habit'}</h1>
      </header>

      <form onSubmit={submit} className="px-5 pb-8 space-y-5">
        <Field label="Name">
          <input value={name} onChange={e => setName(e.target.value)} required placeholder="Drink a glass of water" className="w-full min-h-[48px] rounded-xl border border-border bg-card px-4 text-base focus:outline-none focus:ring-2 focus:ring-ring" />
        </Field>

        <Field label="A note to your future self (optional)">
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Anything that helps you remember why" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring" />
        </Field>

        <Field label="How often">
          <div className="grid grid-cols-3 gap-2">
            {(['daily','weekdays','timesPerWeek'] as const).map(k => (
              <button key={k} type="button" onClick={() => setFreqKind(k)} className={`min-h-[48px] rounded-xl border text-sm transition-colors ${freqKind === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>
                {k === 'daily' ? 'Daily' : k === 'weekdays' ? 'Weekdays' : 'X / week'}
              </button>
            ))}
          </div>
          {freqKind === 'weekdays' && (
            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {['M','T','W','T','F','S','S'].map((l, i) => (
                <button key={i} type="button" onClick={() => setWeekdays(weekdays.includes(i) ? weekdays.filter(d => d !== i) : [...weekdays, i])} className={`h-10 rounded-lg border text-sm font-medium ${weekdays.includes(i) ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'}`}>{l}</button>
              ))}
            </div>
          )}
          {freqKind === 'timesPerWeek' && (
            <input type="number" min={1} max={7} value={timesPerWeek} onChange={e => setTimesPerWeek(Number(e.target.value))} className="mt-3 w-full min-h-[48px] rounded-xl border border-border bg-card px-4 text-base" />
          )}
        </Field>

        <Field label="Minimum version (for low-energy days)">
          <input value={minimumVersion} onChange={e => setMinimumVersion(e.target.value)} placeholder="e.g. Take one sip" className="w-full min-h-[48px] rounded-xl border border-border bg-card px-4 text-base focus:outline-none focus:ring-2 focus:ring-ring" />
        </Field>

        <Field label="Gentle reminder time">
          <input type="time" value={reminder} onChange={e => setReminder(e.target.value)} className="w-full min-h-[48px] rounded-xl border border-border bg-card px-4 text-base focus:outline-none focus:ring-2 focus:ring-ring" />
        </Field>

        <Field label="Color">
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)} aria-label={`Color ${c}`} className={`h-10 w-10 rounded-full border-2 ${color === c ? 'border-foreground' : 'border-transparent'}`} style={{ backgroundColor: c }} />
            ))}
          </div>
        </Field>

        <div className="pt-2 space-y-2">
          <button type="submit" className="w-full min-h-[52px] rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            {existing ? 'Save changes' : 'Create habit'}
          </button>
          {existing && (
            <button type="button" onClick={onDelete} className="w-full min-h-[48px] rounded-2xl border border-border text-destructive font-medium inline-flex items-center justify-center gap-2 hover:border-destructive/40 transition-colors">
              <Trash2 className="h-4 w-4" /> Remove habit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
