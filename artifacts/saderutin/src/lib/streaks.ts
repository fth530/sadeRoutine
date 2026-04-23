import { HabitLog } from './types';
import { parseISO, differenceInDays, isToday, isYesterday } from 'date-fns';
import { getTodayStr } from './dates';

export function calculateStreak(logs: HabitLog[], habitId: string): number {
  const habitLogs = logs
    .filter(l => l.habitId === habitId && l.completed)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (habitLogs.length === 0) return 0;

  let streak = 0;
  let currentDateStr = getTodayStr();

  // If the first log is today or yesterday, we start counting
  const latestLogDate = habitLogs[0].date;
  if (!isToday(parseISO(latestLogDate)) && !isYesterday(parseISO(latestLogDate))) {
    return 0; // Streak broken
  }

  let expectedDate = latestLogDate;

  for (let i = 0; i < habitLogs.length; i++) {
    const logDate = habitLogs[i].date;
    if (logDate === expectedDate) {
      streak++;
      // Calculate next expected date (previous day)
      const prevDate = new Date(parseISO(expectedDate));
      prevDate.setDate(prevDate.getDate() - 1);
      expectedDate = prevDate.toISOString().split('T')[0];
    } else if (logDate > expectedDate) {
      // Skip duplicates if any
      continue;
    } else {
      // Gap found
      break;
    }
  }

  return streak;
}
