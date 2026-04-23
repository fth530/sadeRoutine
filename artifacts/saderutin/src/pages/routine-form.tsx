import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useRoutines } from '@/hooks/useRoutines';
import { Routine, RoutineStep } from '@/lib/types';
import { getTodayStr } from '@/lib/dates';
import { ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2, X } from 'lucide-react';

export default function RoutineForm() {
  const [, navigate] = useLocation();
  const [, params] = useRoute('/routines/:id');
  const id = params?.id;
  const { routines, addRoutine, updateRoutine, deleteRoutine } = useRoutines();
  const existing = id ? routines.find(r => r.id === id) : undefined;

  const [name, setName] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<Routine['timeOfDay']>('anytime');
  const [steps, setSteps] = useState<RoutineStep[]>([]);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setTimeOfDay(existing.timeOfDay ?? 'anytime');
      setSteps(existing.steps);
    }
  }, [existing?.id]);

  const addStep = () => setSteps([...steps, { id: `s-${Date.now()}-${Math.random()}`, name: '', minutes: 5, includeInMinimum: false }]);
  const updateStep = (i: number, patch: Partial<RoutineStep>) => setSteps(steps.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps];
    [next[i], next[j]] = [next[j], next[i]];
    setSteps(next);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const cleanSteps = steps.filter(s => s.name.trim());
    const routine: Routine = {
      id: existing?.id ?? `r-${Date.now()}`,
      name: name.trim(),
      timeOfDay,
      steps: cleanSteps,
      createdAt: existing?.createdAt ?? getTodayStr(),
    };
    if (existing) updateRoutine(existing.id, routine); else addRoutine(routine);
    navigate('/routines');
  };

  const onDelete = () => {
    if (existing && confirm('Remove this routine?')) {
      deleteRoutine(existing.id);
      navigate('/routines');
    }
  };

  return (
    <div>
      <header className="px-5 pt-8 pb-4 flex items-center gap-3">
        <button onClick={() => navigate('/routines')} className="h-10 w-10 inline-flex items-center justify-center rounded-full hover-elevate" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold">{existing ? 'Edit routine' : 'New routine'}</h1>
      </header>

      <form onSubmit={submit} className="px-5 pb-8 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required placeholder="Gentle morning" className="w-full min-h-[48px] rounded-xl border border-border bg-card px-4 text-base focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">When</label>
          <div className="grid grid-cols-4 gap-2">
            {(['morning','midday','evening','anytime'] as const).map(t => (
              <button key={t} type="button" onClick={() => setTimeOfDay(t)} className={`min-h-[44px] rounded-xl border text-xs capitalize ${timeOfDay === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Steps</label>
            <span className="text-xs text-muted-foreground">Tap "min" to keep this in your low-energy version</span>
          </div>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={s.id} className="rounded-xl border border-border bg-card p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input value={s.name} onChange={e => updateStep(i, { name: e.target.value })} placeholder={`Step ${i + 1}`} className="flex-1 min-h-[40px] rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <button type="button" onClick={() => removeStep(i)} aria-label="Remove step" className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min={0} max={120} value={s.minutes} onChange={e => updateStep(i, { minutes: Number(e.target.value) })} className="w-20 min-h-[36px] rounded-lg border border-border bg-background px-2 text-sm" />
                  <span className="text-xs text-muted-foreground">min</span>
                  <button type="button" onClick={() => updateStep(i, { includeInMinimum: !s.includeInMinimum })} className={`ml-auto rounded-full px-3 py-1.5 text-xs font-medium ${s.includeInMinimum ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    {s.includeInMinimum ? 'in low-energy' : 'add to low-energy'}
                  </button>
                  <button type="button" onClick={() => move(i, -1)} aria-label="Move up" className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" onClick={() => move(i, 1)} aria-label="Move down" className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"><ArrowDown className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addStep} className="w-full min-h-[48px] rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors inline-flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> Add step
            </button>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <button type="submit" className="w-full min-h-[52px] rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            {existing ? 'Save changes' : 'Create routine'}
          </button>
          {existing && (
            <button type="button" onClick={onDelete} className="w-full min-h-[48px] rounded-2xl border border-border text-destructive font-medium inline-flex items-center justify-center gap-2 hover:border-destructive/40 transition-colors">
              <Trash2 className="h-4 w-4" /> Remove routine
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
