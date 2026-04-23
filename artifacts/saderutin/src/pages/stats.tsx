import { useMemo } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useCheckIns } from '@/hooks/useCheckIns';
import { AppHeader } from '@/components/layout/AppHeader';
import { getWeekDays, getPreviousWeekDays } from '@/lib/dates';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function Stats() {
  const { habits, logs } = useHabits();
  const { checkIns } = useCheckIns();

  const thisWeek = getWeekDays();
  const lastWeek = getPreviousWeekDays();

  const weeklyData = useMemo(() => thisWeek.map(d => {
    const dayLogs = logs.filter(l => l.date === d && l.completed).length;
    return { day: format(parseISO(d), 'EEE'), date: d, completed: dayLogs };
  }), [logs, thisWeek.join(',')]);

  const thisWeekTotal = thisWeek.reduce((acc, d) => acc + logs.filter(l => l.date === d && l.completed).length, 0);
  const lastWeekTotal = lastWeek.reduce((acc, d) => acc + logs.filter(l => l.date === d && l.completed).length, 0);
  const trend = thisWeekTotal - lastWeekTotal;

  const perHabit = useMemo(() => habits.map(h => ({
    name: h.name.length > 18 ? h.name.slice(0, 18) + '…' : h.name,
    count: thisWeek.reduce((acc, d) => acc + (logs.find(l => l.habitId === h.id && l.date === d && l.completed) ? 1 : 0), 0),
  })), [habits, logs, thisWeek.join(',')]);

  const moodData = useMemo(() => thisWeek.map(d => {
    const c = checkIns.find(x => x.date === d);
    return { day: format(parseISO(d), 'EEE'), mood: c?.mood ?? null, energy: c?.energy ?? null };
  }), [checkIns, thisWeek.join(',')]);

  return (
    <div>
      <AppHeader title="Your week" subtitle="A gentle look back. No grades." />

      <div className="px-5 pb-8 space-y-6">
        <section className="grid grid-cols-2 gap-3">
          <Stat label="This week" value={thisWeekTotal.toString()} hint="check-offs" />
          <Stat label="vs last week" value={`${trend >= 0 ? '+' : ''}${trend}`} hint={trend >= 0 ? 'a little more' : 'a little less'} />
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-medium mb-3">Daily completions</h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-medium mb-3">Per habit, this week</h2>
          {perHabit.length === 0 ? (
            <p className="text-sm text-muted-foreground">No habits yet.</p>
          ) : (
            <ul className="space-y-2">
              {perHabit.map(h => (
                <li key={h.name} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1">{h.name}</span>
                  <span className="ml-3 text-muted-foreground">{h.count}/7</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-medium mb-3">Mood and energy</h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[1,5]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                <Line type="monotone" dataKey="energy" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> mood</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> energy</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
