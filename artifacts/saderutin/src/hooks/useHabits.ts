import { useState, useEffect } from 'react';
import { getAppData, subscribe, toggleHabitLog, addHabit, updateHabit, deleteHabit } from '@/lib/storage';
import { Habit, HabitLog } from '@/lib/types';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);

  useEffect(() => {
    const update = () => {
      const data = getAppData();
      setHabits(data.habits);
      setLogs(data.habitLogs);
    };
    update();
    return subscribe(update);
  }, []);

  return {
    habits,
    logs,
    toggleLog: toggleHabitLog,
    addHabit,
    updateHabit,
    deleteHabit
  };
}
