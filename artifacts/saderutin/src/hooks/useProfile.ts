import { useState, useEffect } from 'react';
import { getAppData, subscribe } from '@/lib/storage';
import { Profile } from '@/lib/types';

export function useProfile() {
  const [profile, setProfileState] = useState<Profile | null>(null);

  useEffect(() => {
    const update = () => {
      const data = getAppData();
      setProfileState(data.profile);
    };
    update();
    return subscribe(update);
  }, []);

  return { profile };
}
