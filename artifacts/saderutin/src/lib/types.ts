export type Profile = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isDemo: boolean;
  adhdMode: boolean;
  reminderPrefs: {
    morning: boolean;
    midday: boolean;
    evening: boolean;
  };
  theme: 'light' | 'dark' | 'system';
};

export type Habit = {
  id: string;
  name: string;
  description?: string;
  frequency: {
    kind: 'daily' | 'weekdays' | 'timesPerWeek';
    weekdays?: number[];
    timesPerWeek?: number;
  };
  reminderTimes: string[];
  color: string;
  minimumVersion?: string;
  createdAt: string;
  archivedAt?: string;
};

export type HabitLog = {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  usedMinimum: boolean;
};

export type RoutineStep = {
  id: string;
  name: string;
  minutes: number;
  habitId?: string;
  includeInMinimum: boolean;
};

export type Routine = {
  id: string;
  name: string;
  steps: RoutineStep[];
  timeOfDay?: 'morning' | 'midday' | 'evening' | 'anytime';
  createdAt: string;
};

export type DailyCheckIn = {
  date: string; // YYYY-MM-DD
  mood: number; // 1..5
  energy: number; // 1..5
  note?: string;
};

export type LowEnergyState = {
  date: string;
  active: boolean;
};

export type AppData = {
  profile: Profile | null;
  habits: Habit[];
  habitLogs: HabitLog[];
  routines: Routine[];
  checkIns: DailyCheckIn[];
  lowEnergyStates: LowEnergyState[];
};
