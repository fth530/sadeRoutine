import { format, parseISO, isToday, isYesterday, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from 'date-fns';

export function getTodayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateStr(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

export function isDateToday(dateStr: string): boolean {
  return isToday(parseISO(dateStr));
}

export function getWeekDays(date: Date = new Date()): string[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'));
}

export function getPreviousWeekDays(date: Date = new Date()): string[] {
  return getWeekDays(subWeeks(date, 1));
}
