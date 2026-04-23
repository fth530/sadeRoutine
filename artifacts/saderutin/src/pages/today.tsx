import { useMemo } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useHabits } from '@/hooks/useHabits';
import { useRoutines } from '@/hooks/useRoutines';
import { useLowEnergy } from '@/hooks/useLowEnergy';
import { getTodayStr } from '@/lib/dates';
import { Habit, HabitLog } from '@/lib/types';
import { HabitCard } from '@/components/HabitCard';
import { LowEnergyToggle } from '@/components/LowEnergyToggle';
import { CheckInCard } from '@/components/CheckInCard';
import { AppHeader } from '@/components/layout/AppHeader';
import { calculateStreak } from '@/lib/streaks';

function greeting(name: string) {
  const h = new Date().getHours();
  const part = h < 5 ? 'Resting hours' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Good night';
  return `${part}, ${name}.`;
}

function isHabitDueToday(h: Habit, date: Date) {
  if (h.archivedAt) return false;
  if (h.frequency.kind === 'daily') return true;
  if (h.frequency.kind === 'weekdays') {
    const dow = (date.getDay() + 6) % 7; // 0 = Mon
    return h.frequency.weekdays?.includes(dow) ?? false;
  }
  return true; // timesPerWeek — show every day; user picks
}

export default function Today() {
  const today = getTodayStr();
  const { profile } = useProfile();
  const { habits, logs, toggleLog } = useHabits();
  const { routines } = useRoutines();
  const { isLowEnergy, toggleLowEnergy } = useLowEnergy(today);

  const todaysHabits = useMemo(() => habits.filter(h => isHabitDueToday(h, new Date())), [habits]);
  const completedSet = new Set(logs.filter((l: HabitLog) => l.date === today && l.completed).map(l => l.habitId));

  const hour = new Date().getHours();
  const slot: 'morning' | 'midday' | 'evening' | 'anytime' = hour < 11 ? 'morning' : hour < 16 ? 'midday' : hour < 21 ? 'evening' : 'anytime';
  const activeRoutine = routines.find(r => r.timeOfDay === slot) ?? routines[0];

  const completedCount = completedSet.size;
  const totalCount = todaysHabits.length;

  return (
    <div>
      <AppHeader title={greeting(profile?.name ?? 'friend')} subtitle="No pressure today. Small things count." />

      <div className="px-5 space-y-6 pb-8">
        <LowEnergyToggle active={isLowEnergy} onChange={toggleLowEnergy} />

        <section aria-labelledby="today-habits">
          <div className="flex items-baseline justify-between mb-3">
            <h2 id="today-habits" className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Today's habits</h2>
            <span className="text-xs text-muted-foreground">{completedCount}/{totalCount}</span>
          </div>
          <div className="space-y-2.5">
            {todaysHabits.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No habits yet. Add one when you're ready.</p>
            )}
            {todaysHabits.map(h => {
              const streak = calculateStreak(logs, h.id);
              return (
                <div key={h.id}>
                  <HabitCard
                    name={h.name}
                    description={h.description}
                    color={h.color}
                    completed={completedSet.has(h.id)}
                    onToggle={() => toggleLog(h.id, today, isLowEnergy)}
                    minimumVersion={h.minimumVersion}
                    isLowEnergyMode={isLowEnergy}
                  />
                  {streak > 1 && !profile?.adhdMode && (
                    <p className="mt-1 ml-2 text-[11px] text-muted-foreground">{streak} days in a row, no pressure.</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {activeRoutine && (
          <section aria-labelledby="active-routine">
            <h2 id="active-routine" className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Right now: {activeRoutine.name}</h2>
            <ol className="rounded-2xl border border-border bg-card divide-y divide-border">
              {activeRoutine.steps
                .filter(s => !isLowEnergy || s.includeInMinimum)
                .map((s, i) => (
                  <li key={s.id} className="flex items-center gap-3 p-4">
                    <span className="text-xs font-medium text-muted-foreground w-5">{i + 1}</span>
                    <span className="flex-1 text-sm">{s.name}</span>
                    {s.minutes > 0 && <span className="text-xs text-muted-foreground">{s.minutes}m</span>}
                  </li>
                ))}
            </ol>
          </section>
        )}

        <CheckInCard />
      </div>
    </div>
  );
}
