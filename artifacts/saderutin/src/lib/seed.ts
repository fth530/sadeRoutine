import { Habit, Routine, Profile } from './types';
import { getTodayStr } from './dates';

export const SEED_HABITS: Habit[] = [
  {
    id: 'h1',
    name: 'Drink a glass of water',
    description: 'Keep it simple. Just one glass.',
    frequency: { kind: 'daily' },
    reminderTimes: ['09:00'],
    color: 'hsl(180 20% 50%)', // Dusty teal
    minimumVersion: 'Take one sip',
    createdAt: getTodayStr(),
  },
  {
    id: 'h2',
    name: 'Step outside for 2 minutes',
    description: 'Look at the sky, not your phone.',
    frequency: { kind: 'daily' },
    reminderTimes: ['12:00'],
    color: 'hsl(40 30% 70%)', // Warm sand/gold
    minimumVersion: 'Open a window and take a deep breath',
    createdAt: getTodayStr(),
  },
  {
    id: 'h3',
    name: 'Tidy one small thing',
    description: 'A mug, a piece of trash. Just one.',
    frequency: { kind: 'daily' },
    reminderTimes: ['18:00'],
    color: 'hsl(150 20% 50%)', // Sage
    createdAt: getTodayStr(),
  }
];

export const SEED_ROUTINES: Routine[] = [
  {
    id: 'r1',
    name: 'Gentle morning',
    timeOfDay: 'morning',
    createdAt: getTodayStr(),
    steps: [
      { id: 'rs1', name: 'Drink a glass of water', minutes: 2, habitId: 'h1', includeInMinimum: true },
      { id: 'rs2', name: 'Stretch gently', minutes: 5, includeInMinimum: false },
      { id: 'rs3', name: 'Step outside', minutes: 2, habitId: 'h2', includeInMinimum: true },
    ]
  },
  {
    id: 'r2',
    name: 'Wind-down',
    timeOfDay: 'evening',
    createdAt: getTodayStr(),
    steps: [
      { id: 'rs4', name: 'Tidy one small thing', minutes: 2, habitId: 'h3', includeInMinimum: true },
      { id: 'rs5', name: 'Dim the lights', minutes: 1, includeInMinimum: true },
      { id: 'rs6', name: 'Put phone away', minutes: 0, includeInMinimum: false },
    ]
  }
];

export const DEMO_PROFILE: Profile = {
  id: 'demo',
  name: 'Friend',
  email: 'demo@saderutin.local',
  createdAt: getTodayStr(),
  isDemo: true,
  adhdMode: false,
  reminderPrefs: { morning: true, midday: false, evening: true },
  theme: 'system'
};
