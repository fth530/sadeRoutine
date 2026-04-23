export function getTodayStr(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function getDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function getWeekDays(): string[] {
  const today = new Date();
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(getDateStr(d));
  }
  return days;
}

export function getPreviousWeekDays(): string[] {
  const today = new Date();
  const days: string[] = [];
  for (let i = 13; i >= 7; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(getDateStr(d));
  }
  return days;
}

export function getTimeOfDayLabel(): "morning" | "midday" | "evening" {
  const h = new Date().getHours();
  if (h < 11) return "morning";
  if (h < 17) return "midday";
  return "evening";
}

export function greeting(name: string): string {
  const t = getTimeOfDayLabel();
  const map = { morning: "Good morning", midday: "Hey", evening: "Good evening" } as const;
  return `${map[t]}, ${name}`;
}

export function dayShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
}
