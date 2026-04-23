import { Link } from 'wouter';
import { Plus, ChevronRight } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { AppHeader } from '@/components/layout/AppHeader';
import { calculateStreak } from '@/lib/streaks';

export default function Habits() {
  const { habits, logs } = useHabits();

  return (
    <div>
      <AppHeader title="Habits" subtitle="Small things, repeated kindly." right={
        <Link href="/habits/new" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-label="New habit">
          <Plus className="h-5 w-5" />
        </Link>
      } />
      <div className="px-5 pb-8 space-y-2">
        {habits.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">You don't have any habits yet. Start with one — really, just one.</p>
            <Link href="/habits/new" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
              <Plus className="h-4 w-4" /> Add a habit
            </Link>
          </div>
        )}
        {habits.map(h => {
          const streak = calculateStreak(logs, h.id);
          return (
            <Link key={h.id} href={`/habits/${h.id}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition-colors">
              <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: h.color }} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{h.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {h.frequency.kind === 'daily' ? 'Daily' : h.frequency.kind === 'weekdays' ? 'Selected weekdays' : `${h.frequency.timesPerWeek}× / week`}
                  {streak > 0 && ` · ${streak} in a row`}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
