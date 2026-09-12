import React from 'react';

interface XPBarProps {
  level: number;
  currentXp: number;
  maxXp: number;
  showLevel?: boolean;
  compact?: boolean;
  className?: string;
  tall?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({
  level,
  currentXp,
  maxXp,
  showLevel = true,
  compact = false,
  className = '',
  tall = false,
}) => {
  const percentage = Math.min(100, Math.max(0, (currentXp / maxXp) * 100));

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Top Labels with responsive sizing */}
      <div className="flex items-center justify-between mb-2">
        {showLevel && (
          <div className="flex items-center gap-2">
            <span className="font-ornate font-bold text-[#F0C75E] tracking-wider text-sm sm:text-base md:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              LEVEL {level}
            </span>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 bg-[#1A1610] border border-[#C99A3D]/40 rounded-full font-mono text-[10px] text-[#F0C75E] shadow-sm">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <span className="font-mono text-xs sm:text-sm text-[#E7D8B5] tracking-tight ml-auto font-medium">
          {currentXp.toLocaleString()} <span className="text-[#8C7D6B]">/</span> {maxXp.toLocaleString()} XP
        </span>
      </div>

      {/* Signature Smooth Bar with gilded border and inner depth */}
      <div
        className={`w-full bg-[#080B0D]/90 border border-[#8C6F3D]/40 p-0.5 relative shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_2px_8px_rgba(0,0,0,0.4)] rounded-full overflow-hidden ${
          compact ? 'h-3' : tall ? 'h-5 sm:h-6 md:h-7' : 'h-4 sm:h-5'
        }`}
      >
        {/* Progress Fill with ember-to-gold radiant gradient */}
        <div
          className="h-full transition-all duration-300 relative overflow-hidden rounded-full shadow-[0_0_12px_rgba(240,199,94,0.3)]"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #8F2718 0%, #B84025 35%, #E0522D 65%, #F0C75E 100%)',
          }}
        >
          {/* Subtle micro-texture */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.8) 4px, rgba(0,0,0,0.8) 5px)',
            }}
          />
          {/* Smooth animated light shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};
