# SadeRutin

A calm, mobile-first, ADHD-friendly habit tracker and routine manager. Installable as a PWA. All data stays on your device.

## Features

- **Demo mode or local account** — Try it instantly, or create a local profile (no password, no server).
- **Onboarding** — Goal, current energy, reminder windows, and an opt-in ADHD mode.
- **Today dashboard** — Greeting, today's habits, current routine for the time of day, low-energy toggle, and a daily mood/energy check-in.
- **Habits** — Create, edit, delete. Frequencies (daily / weekdays / X per week), reminder times, color, optional "minimum version" for low-energy days. Streaks shown gently.
- **Routines** — Build ordered steps with estimated minutes; mark which steps stay in the low-energy version. Templates included (Gentle morning, Focus block, Wind-down, Reset).
- **Low energy / minimum routine mode** — One tap swaps to the smaller version of every habit and routine.
- **Stats** — Weekly bar chart, per-habit completion counts, mood and energy line chart.
- **Pricing** — Transparent: Free forever, optional Supporter tier, no features paywalled, no dark patterns.
- **Settings** — Profile, ADHD mode, theme (light / dark / system), reminder toggles, JSON export, account deletion (wipes local storage), billing placeholder.
- **PWA** — Installable, offline shell, manifest, theme color, soft icon.
- **SEO landing page** — Optimized for "habit tracker", "routine app", "ADHD friendly habit tracker".
- **Accessibility** — Large tap targets (min 48px), full keyboard navigation, semantic landmarks, aria labels, soft motion.

## Tech

- React 18 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui primitives
- wouter (routing), framer-motion (gentle motion), recharts (charts), date-fns, next-themes, lucide-react (icons)
- localStorage-backed typed storage layer (`src/lib/storage.ts`) — no backend required

> Note: The original brief mentioned Next.js + Supabase. To keep the project runnable in this environment with zero external configuration, SadeRutin is implemented as a Vite-powered SPA + PWA with a fully working local/demo mode. The architecture is portable — the storage layer in `src/lib/storage.ts` is a single seam you can replace with Supabase or any backend later, without touching components or pages.

## Project structure

```
artifacts/saderutin/
  index.html              # PWA meta, manifest, SW registration
  public/
    manifest.webmanifest
    sw.js                 # Minimal service worker (shell cache)
    icon-512.png, icon-192.png, favicon.svg
  src/
    App.tsx               # Router + theme + bottom-tab shell
    main.tsx
    index.css             # Tailwind v4 theme, soft sage/sand palette + dark mode
    lib/
      types.ts            # Profile, Habit, Routine, etc.
      storage.ts          # Versioned localStorage layer + subscribers
      seed.ts             # Demo profile + starter habits/routines
      streaks.ts, dates.ts, utils.ts
    hooks/                # useProfile, useHabits, useRoutines, useCheckIns, useLowEnergy
    components/           # HabitCard, RoutineCard, MoodPicker, EnergyPicker,
                          # LowEnergyToggle, CheckInCard, ProgressDots, ThemeToggle, layout/*
    pages/                # landing, auth, onboarding, today, habits, habit-form,
                          # routines, routine-form, stats, pricing, settings, not-found
```

## Running on Replit

This artifact runs as a workflow inside the workspace. From the Replit UI, the app is available in the preview pane. The dev server reads `PORT` and `BASE_PATH` from the environment — they're already wired up by the workflow.

## Running locally

```bash
pnpm install
pnpm --filter @workspace/saderutin run dev
```

The dev server requires `PORT` and `BASE_PATH`:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/saderutin run dev
```

Then open `http://localhost:5173/`.

## Building for production

```bash
pnpm --filter @workspace/saderutin run build
PORT=4173 BASE_PATH=/ pnpm --filter @workspace/saderutin run serve
```

## Data and privacy

All app data lives in your browser's `localStorage` under the key `saderutin:v1`. Nothing leaves the device. **Settings → Export as JSON** downloads everything; **Settings → Delete all my data** wipes it.
