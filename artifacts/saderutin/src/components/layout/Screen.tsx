import React from 'react';

export function Screen({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[480px] min-h-[100dvh] bg-background ${className}`}>
      {children}
    </div>
  );
}
