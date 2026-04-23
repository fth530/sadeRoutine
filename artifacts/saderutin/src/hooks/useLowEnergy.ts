import { useState, useEffect } from 'react';
import { getAppData, subscribe, setLowEnergy as setStorageLowEnergy } from '@/lib/storage';

export function useLowEnergy(date: string) {
  const [isLowEnergy, setIsLowEnergy] = useState(false);

  useEffect(() => {
    const update = () => {
      const data = getAppData();
      const state = data.lowEnergyStates.find(s => s.date === date);
      setIsLowEnergy(state?.active ?? false);
    };
    update();
    return subscribe(update);
  }, [date]);

  const toggleLowEnergy = (active: boolean) => {
    setStorageLowEnergy(date, active);
  };

  return { isLowEnergy, toggleLowEnergy };
}
