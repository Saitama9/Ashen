import React from 'react';
import { StatType } from '../../types';
import { StrengthIcon, IntelligenceIcon, VitalityIcon, FocusIcon } from '../icons/PixelIcons';

interface StatBarProps {
  type: StatType;
  value: number;
  maxValue?: number;
  showBlocks?: boolean;
  className?: string;
}

const STAT_CONFIG = {
  strength: {
    label: 'STR',
    fullName: 'Strength',
    color: '#D94B38',
    gradient: 'from-[#D94B38] to-[#991B1B]',
    glow: 'rgba(217, 75, 56, 0.3)',
    icon: (size: number) => <StrengthIcon size={size} color="#D94B38" />,
  },
  intelligence: {
    label: 'INT',
    fullName: 'Intellect',
    color: '#4CA7D8',
    gradient: 'from-[#4CA7D8] to-[#1E40AF]',
    glow: 'rgba(76, 167, 216, 0.3)',
    icon: (size: number) => <IntelligenceIcon size={size} color="#4CA7D8" />,
  },
  vitality: {
    label: 'VIT',
    fullName: 'Vitality',
    color: '#62A96B',
    gradient: 'from-[#62A96B] to-[#166534]',
    glow: 'rgba(98, 169, 107, 0.3)',
    icon: (size: number) => <VitalityIcon size={size} color="#62A96B" />,
  },
  focus: {
    label: 'FOC',
    fullName: 'Focus',
    color: '#D5A441',
    gradient: 'from-[#F0C75E] to-[#B45309]',
    glow: 'rgba(213, 164, 65, 0.3)',
    icon: (size: number) => <FocusIcon size={size} color="#D5A441" />,
  },
};

export const StatBar: React.FC<StatBarProps> = ({
  type,
  value,
  maxValue = 20,
  showBlocks = true,
  className = '',
}) => {
  const config = STAT_CONFIG[type];
  const totalBlocks = 10;
  const filledBlocks = Math.min(totalBlocks, Math.max(1, Math.round((value / maxValue) * totalBlocks)));

  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      {/* Icon & Label */}
      <div className="flex items-center gap-2 w-28 shrink-0">
        <div className="p-1 rounded-md bg-[#141A1E] border border-[#8C6F3D]/30 flex items-center justify-center shadow-sm">
          {config.icon(15)}
        </div>
        <span className="font-display font-semibold text-xs tracking-wider text-[#E7D8B5]">
          {config.fullName}
        </span>
      </div>

      {/* Segmented Smooth Bar */}
      {showBlocks ? (
        <div className="flex items-center gap-1.5 flex-1 bg-[#090C0E]/90 border border-[#8C6F3D]/25 p-1 rounded-lg h-5 shadow-inner">
          {Array.from({ length: totalBlocks }).map((_, idx) => {
            const isFilled = idx < filledBlocks;
            return (
              <div
                key={idx}
                className="h-full flex-1 rounded-xs transition-all duration-300"
                style={{
                  backgroundColor: isFilled ? config.color : 'rgba(24, 32, 36, 0.4)',
                  boxShadow: isFilled ? `0 0 6px ${config.glow}` : 'none',
                  border: isFilled ? `1px solid ${config.color}` : '1px solid rgba(255, 255, 255, 0.03)',
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="h-3.5 flex-1 bg-[#090C0E]/90 border border-[#8C6F3D]/30 p-0.5 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${config.gradient}`}
            style={{
              width: `${Math.min(100, (value / maxValue) * 100)}%`,
              boxShadow: `0 0 8px ${config.glow}`,
            }}
          />
        </div>
      )}

      {/* Numeric Value in Clean Monospace */}
      <div className="w-8 text-right font-mono text-xs font-bold text-[#F0C75E]">
        {value}
      </div>
    </div>
  );
};
