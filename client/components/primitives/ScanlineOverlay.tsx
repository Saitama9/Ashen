import React from 'react';

interface ScanlineOverlayProps {
  enabled?: boolean;
}

export function ScanlineOverlay({ enabled = true }: ScanlineOverlayProps) {
  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {/* Horizontal CRT scanlines */}
      <div
        className="w-full h-full opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
      {/* Subtle CRT screen edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.75)',
        }}
      />
    </div>
  );
}
