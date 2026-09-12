import React, { useEffect } from 'react';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    // Enable native smooth scrolling on the root document
    if (typeof document !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
    }
  }, []);

  return <div className="w-full min-h-screen">{children}</div>;
}
