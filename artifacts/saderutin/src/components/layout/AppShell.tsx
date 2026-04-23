import React from 'react';
import { Screen } from './Screen';
import { BottomTabs } from './BottomTabs';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Screen className="pb-20">
      {children}
      <BottomTabs />
    </Screen>
  );
}
