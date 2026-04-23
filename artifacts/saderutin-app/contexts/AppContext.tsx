import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppState, CheckIn, Habit, HabitLog, Profile, Routine } from "@/lib/types";
import { buildDemoState, emptyState } from "@/lib/seed";
import { getTodayStr } from "@/lib/dates";

const STORAGE_KEY = "saderutin:v1";

interface AppContextValue extends AppState {
  ready: boolean;
  signUp: (name: string, email: string) => void;
  signOut: () => void;
  startDemo: () => void;
  updateProfile: (patch: Partial<Profile>) => void;
  addHabit: (h: Habit) => void;
  updateHabit: (id: string, patch: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (habitId: string, date: string) => void;
  addRoutine: (r: Routine) => void;
  updateRoutine: (id: string, patch: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  saveCheckIn: (c: CheckIn) => void;
  setLowEnergy: (v: boolean) => void;
  exportJson: () => string;
  wipeAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const id = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try { setState(JSON.parse(raw)); } catch { setState(emptyState()); }
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const persist = useCallback((updater: (s: AppState) => AppState) => setState(updater), []);

  const value: AppContextValue = useMemo(() => ({
    ...state,
    ready,
    signUp: (name, email) => persist(s => ({
      ...s,
      profile: {
        id: id("p"), name: name.trim() || "You", email: email.trim(),
        isDemo: false, adhdMode: false,
        reminderPrefs: { morning: true, midday: false, evening: true },
        createdAt: getTodayStr(),
      },
    })),
    signOut: () => persist(() => emptyState()),
    startDemo: () => persist(() => buildDemoState()),
    updateProfile: (patch) => persist(s => s.profile ? { ...s, profile: { ...s.profile, ...patch } } : s),
    addHabit: (h) => persist(s => ({ ...s, habits: [...s.habits, h] })),
    updateHabit: (hid, patch) => persist(s => ({ ...s, habits: s.habits.map(h => h.id === hid ? { ...h, ...patch } : h) })),
    deleteHabit: (hid) => persist(s => ({ ...s, habits: s.habits.filter(h => h.id !== hid), habitLogs: s.habitLogs.filter(l => l.habitId !== hid) })),
    toggleHabit: (habitId, date) => persist(s => {
      const existing = s.habitLogs.find(l => l.habitId === habitId && l.date === date);
      if (existing) {
        return { ...s, habitLogs: s.habitLogs.map(l => l === existing ? { ...l, completed: !l.completed } : l) };
      }
      const log: HabitLog = { id: id("l"), habitId, date, completed: true };
      return { ...s, habitLogs: [...s.habitLogs, log] };
    }),
    addRoutine: (r) => persist(s => ({ ...s, routines: [...s.routines, r] })),
    updateRoutine: (rid, patch) => persist(s => ({ ...s, routines: s.routines.map(r => r.id === rid ? { ...r, ...patch } : r) })),
    deleteRoutine: (rid) => persist(s => ({ ...s, routines: s.routines.filter(r => r.id !== rid) })),
    saveCheckIn: (c) => persist(s => ({ ...s, checkIns: [...s.checkIns.filter(x => x.date !== c.date), c] })),
    setLowEnergy: (v) => persist(s => ({ ...s, lowEnergy: v })),
    exportJson: () => JSON.stringify(state, null, 2),
    wipeAll: () => { AsyncStorage.removeItem(STORAGE_KEY); setState(emptyState()); },
  }), [state, ready, persist]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export { id as makeId };
