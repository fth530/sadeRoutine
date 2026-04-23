import { AppData, Profile, Habit, HabitLog, Routine, DailyCheckIn, LowEnergyState } from './types';
import { SEED_HABITS, SEED_ROUTINES, DEMO_PROFILE } from './seed';

const STORAGE_KEY = 'saderutin:v1';

type Listeners = Set<() => void>;
const listeners: Listeners = new Set();

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach(l => l());
}

export function getAppData(): AppData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as AppData;
    }
  } catch (e) {
    console.error('Failed to parse storage', e);
  }
  
  return {
    profile: null,
    habits: [],
    habitLogs: [],
    routines: [],
    checkIns: [],
    lowEnergyStates: []
  };
}

export function saveAppData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  notify();
}

export function wipeAll() {
  localStorage.removeItem(STORAGE_KEY);
  notify();
}

export function initDemo() {
  const current = getAppData();
  saveAppData({
    ...current,
    profile: DEMO_PROFILE,
    habits: SEED_HABITS,
    routines: SEED_ROUTINES,
  });
}

// Typed setters/getters
export function setProfile(profile: Profile) {
  const data = getAppData();
  saveAppData({ ...data, profile });
}

export function updateProfile(updates: Partial<Profile>) {
  const data = getAppData();
  if (data.profile) {
    saveAppData({ ...data, profile: { ...data.profile, ...updates } });
  }
}

export function addHabit(habit: Habit) {
  const data = getAppData();
  saveAppData({ ...data, habits: [...data.habits, habit] });
}

export function updateHabit(id: string, updates: Partial<Habit>) {
  const data = getAppData();
  saveAppData({
    ...data,
    habits: data.habits.map(h => h.id === id ? { ...h, ...updates } : h)
  });
}

export function deleteHabit(id: string) {
  const data = getAppData();
  saveAppData({
    ...data,
    habits: data.habits.filter(h => h.id !== id),
    // Optional: could clean up logs and routine steps, but keeping simple for now
  });
}

export function toggleHabitLog(habitId: string, date: string, usedMinimum: boolean = false) {
  const data = getAppData();
  const existingIndex = data.habitLogs.findIndex(l => l.habitId === habitId && l.date === date);
  
  let newLogs = [...data.habitLogs];
  if (existingIndex >= 0) {
    newLogs.splice(existingIndex, 1);
  } else {
    newLogs.push({ id: `${habitId}-${date}`, habitId, date, completed: true, usedMinimum });
  }
  
  saveAppData({ ...data, habitLogs: newLogs });
}

export function addRoutine(routine: Routine) {
  const data = getAppData();
  saveAppData({ ...data, routines: [...data.routines, routine] });
}

export function updateRoutine(id: string, updates: Partial<Routine>) {
  const data = getAppData();
  saveAppData({
    ...data,
    routines: data.routines.map(r => r.id === id ? { ...r, ...updates } : r)
  });
}

export function deleteRoutine(id: string) {
  const data = getAppData();
  saveAppData({ ...data, routines: data.routines.filter(r => r.id !== id) });
}

export function saveCheckIn(checkIn: DailyCheckIn) {
  const data = getAppData();
  const existing = data.checkIns.findIndex(c => c.date === checkIn.date);
  let newCheckIns = [...data.checkIns];
  if (existing >= 0) {
    newCheckIns[existing] = checkIn;
  } else {
    newCheckIns.push(checkIn);
  }
  saveAppData({ ...data, checkIns: newCheckIns });
}

export function setLowEnergy(date: string, active: boolean) {
  const data = getAppData();
  const existing = data.lowEnergyStates.findIndex(s => s.date === date);
  let newStates = [...data.lowEnergyStates];
  if (existing >= 0) {
    newStates[existing].active = active;
  } else {
    newStates.push({ date, active });
  }
  saveAppData({ ...data, lowEnergyStates: newStates });
}

export function exportAll() {
  const data = getAppData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `saderutin-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
