import { AppState, Habit, Routine } from "./types";
import { getTodayStr } from "./dates";

const id = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function buildDemoState(): AppState {
  const today = getTodayStr();
  const habits: Habit[] = [
    { id: id("h"), name: "Drink a glass of water", color: "#88B4B0", frequency: "daily", reminderTime: "09:00", minimumNote: "One sip counts", createdAt: today },
    { id: id("h"), name: "5-minute stretch", color: "#6E9E83", frequency: "daily", minimumNote: "Just stand up", createdAt: today },
    { id: id("h"), name: "Read 1 page", color: "#C9A66B", frequency: "daily", minimumNote: "Open the book", createdAt: today },
    { id: id("h"), name: "Walk outside", color: "#9CB380", frequency: "x-per-week", perWeek: 3, createdAt: today },
  ];
  const routines: Routine[] = [
    {
      id: id("r"), name: "Gentle morning", timeOfDay: "morning", createdAt: today,
      steps: [
        { id: id("s"), name: "Open curtains", minutes: 1, includeInMinimum: true },
        { id: id("s"), name: "Glass of water", minutes: 2, includeInMinimum: true },
        { id: id("s"), name: "Brush teeth", minutes: 3, includeInMinimum: true },
        { id: id("s"), name: "Quick stretch", minutes: 5, includeInMinimum: false },
        { id: id("s"), name: "Plan top 1 thing", minutes: 3, includeInMinimum: false },
      ],
    },
    {
      id: id("r"), name: "Wind-down", timeOfDay: "evening", createdAt: today,
      steps: [
        { id: id("s"), name: "Dim the lights", minutes: 1, includeInMinimum: true },
        { id: id("s"), name: "Phone in another room", minutes: 1, includeInMinimum: true },
        { id: id("s"), name: "Tidy one surface", minutes: 5, includeInMinimum: false },
        { id: id("s"), name: "Slow breaths x10", minutes: 3, includeInMinimum: true },
      ],
    },
    {
      id: id("r"), name: "Focus block", timeOfDay: "midday", createdAt: today,
      steps: [
        { id: id("s"), name: "Pick one task", minutes: 2, includeInMinimum: true },
        { id: id("s"), name: "Timer 25 min", minutes: 25, includeInMinimum: true },
        { id: id("s"), name: "Stand & stretch", minutes: 3, includeInMinimum: false },
      ],
    },
  ];
  return {
    profile: {
      id: id("p"),
      name: "You",
      email: "demo@local",
      isDemo: true,
      adhdMode: true,
      reminderPrefs: { morning: true, midday: false, evening: true },
      goal: "Be a little kinder to myself",
      createdAt: today,
    },
    habits,
    habitLogs: [],
    routines,
    checkIns: [],
    lowEnergy: false,
  };
}

export function emptyState(): AppState {
  return { profile: null, habits: [], habitLogs: [], routines: [], checkIns: [], lowEnergy: false };
}

export function starterRoutines(): Routine[] {
  const today = getTodayStr();
  return [
    {
      id: id("r"), name: "Gentle morning", timeOfDay: "morning", createdAt: today,
      steps: [
        { id: id("s"), name: "Open curtains", minutes: 1, includeInMinimum: true },
        { id: id("s"), name: "Glass of water", minutes: 2, includeInMinimum: true },
        { id: id("s"), name: "Brush teeth", minutes: 3, includeInMinimum: true },
      ],
    },
  ];
}
