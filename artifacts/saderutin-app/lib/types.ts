export type Mood = 1 | 2 | 3 | 4 | 5;
export type Energy = 1 | 2 | 3 | 4 | 5;
export type TimeOfDay = "morning" | "midday" | "evening" | "anytime";
export type Frequency = "daily" | "weekdays" | "x-per-week";

export interface Profile {
  id: string;
  name: string;
  email: string;
  isDemo: boolean;
  adhdMode: boolean;
  reminderPrefs: { morning: boolean; midday: boolean; evening: boolean };
  goal?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  frequency: Frequency;
  perWeek?: number;
  reminderTime?: string;
  minimumNote?: string;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export interface RoutineStep {
  id: string;
  name: string;
  minutes: number;
  includeInMinimum: boolean;
}

export interface Routine {
  id: string;
  name: string;
  timeOfDay: TimeOfDay;
  steps: RoutineStep[];
  createdAt: string;
}

export interface CheckIn {
  date: string;
  mood: Mood;
  energy: Energy;
  note?: string;
}

export interface AppState {
  profile: Profile | null;
  habits: Habit[];
  habitLogs: HabitLog[];
  routines: Routine[];
  checkIns: CheckIn[];
  lowEnergy: boolean;
}
