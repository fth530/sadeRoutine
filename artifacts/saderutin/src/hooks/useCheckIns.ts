import { useState, useEffect } from 'react';
import { getAppData, subscribe, saveCheckIn } from '@/lib/storage';
import { DailyCheckIn } from '@/lib/types';

export function useCheckIns() {
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);

  useEffect(() => {
    const update = () => {
      const data = getAppData();
      setCheckIns(data.checkIns);
    };
    update();
    return subscribe(update);
  }, []);

  const getForDate = (date: string) => checkIns.find(c => c.date === date);

  return { checkIns, getForDate, saveCheckIn };
}
