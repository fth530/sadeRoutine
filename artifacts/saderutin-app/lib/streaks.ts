import { Habit, HabitLog } from "./types";

export function isHabitDueOn(habit: Habit, dateStr: string): boolean {
  if (habit.frequency === "daily") return true;
  const day = new Date(dateStr + "T00:00:00").getDay();
  if (habit.frequency === "weekdays") return day >= 1 && day <= 5;
  return true;
}

export function isCompletedOn(habitId: string, dateStr: string, logs: HabitLog[]): boolean {
  return logs.some(l => l.habitId === habitId && l.date === dateStr && l.completed);
}

export function currentStreak(habit: Habit, logs: HabitLog[]): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    if (!isHabitDueOn(habit, ds)) continue;
    if (isCompletedOn(habit.id, ds, logs)) streak++;
    else break;
  }
  return streak;
}
