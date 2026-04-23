import { Link } from 'wouter';
import { Plus } from 'lucide-react';
import { useRoutines } from '@/hooks/useRoutines';
import { AppHeader } from '@/components/layout/AppHeader';
import { RoutineCard } from '@/components/RoutineCard';
import { Routine } from '@/lib/types';
import { getTodayStr } from '@/lib/dates';

const TEMPLATES: Omit<Routine, 'id' | 'createdAt'>[] = [
  { name: 'Gentle morning', timeOfDay: 'morning', steps: [
    { id: 't1', name: 'Glass of water', minutes: 2, includeInMinimum: true },
    { id: 't2', name: 'Stretch gently', minutes: 5, includeInMinimum: false },
    { id: 't3', name: 'Step outside', minutes: 2, includeInMinimum: true },
  ]},
  { name: 'Focus block', timeOfDay: 'midday', steps: [
    { id: 't4', name: 'Clear desk', minutes: 2, includeInMinimum: true },
    { id: 't5', name: 'Pick one task', minutes: 1, includeInMinimum: true },
    { id: 't6', name: 'Work for 25 min', minutes: 25, includeInMinimum: false },
  ]},
  { name: 'Wind-down', timeOfDay: 'evening', steps: [
    { id: 't7', name: 'Tidy one thing', minutes: 2, includeInMinimum: true },
    { id: 't8', name: 'Dim the lights', minutes: 1, includeInMinimum: true },
    { id: 't9', name: 'Phone away', minutes: 0, includeInMinimum: false },
  ]},
  { name: 'Reset', timeOfDay: 'anytime', steps: [
    { id: 't10', name: 'Three slow breaths', minutes: 1, includeInMinimum: true },
    { id: 't11', name: 'Drink water', minutes: 1, includeInMinimum: true },
    { id: 't12', name: 'Step away from screen', minutes: 3, includeInMinimum: false },
  ]},
];

export default function Routines() {
  const { routines, addRoutine } = useRoutines();

  const cloneTemplate = (t: typeof TEMPLATES[number]) => {
    addRoutine({ ...t, id: `r-${Date.now()}`, createdAt: getTodayStr(), steps: t.steps.map(s => ({ ...s, id: `rs-${Date.now()}-${Math.random()}` })) });
  };

  return (
    <div>
      <AppHeader title="Routines" subtitle="Sequences of small steps. Skippable, always." right={
        <Link href="/routines/new" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-label="New routine">
          <Plus className="h-5 w-5" />
        </Link>
      } />
      <div className="px-5 pb-8 space-y-6">
        <section>
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Your routines</h2>
          {routines.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No routines yet. Try a template below.</p>
          ) : (
            <div className="space-y-2">{routines.map(r => <RoutineCard key={r.id} routine={r} />)}</div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Templates</h2>
          <div className="space-y-2">
            {TEMPLATES.map(t => (
              <button key={t.name} onClick={() => cloneTemplate(t)} className="w-full text-left rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
                <div className="flex items-baseline justify-between">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{t.timeOfDay}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{t.steps.length} steps · tap to add</div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
