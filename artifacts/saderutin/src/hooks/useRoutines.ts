import { useState, useEffect } from 'react';
import { getAppData, subscribe, addRoutine, updateRoutine, deleteRoutine } from '@/lib/storage';
import { Routine } from '@/lib/types';

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    const update = () => {
      const data = getAppData();
      setRoutines(data.routines);
    };
    update();
    return subscribe(update);
  }, []);

  return { routines, addRoutine, updateRoutine, deleteRoutine };
}
