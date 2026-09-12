import React from 'react';
import { GoldCoinIcon } from '../icons/PixelIcons';

interface GoldBadgeProps {
  amount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GoldBadge: React.FC<GoldBadgeProps> = ({
  amount,
  className = '',
  size = 'md',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#1A1610] to-[#121619] border border-[#C99A3D]/40 shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(240,199,94,0.15)] ${className}`}
    >
      <GoldCoinIcon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      <span className="font-mono text-xs font-bold text-[#F0C75E] tracking-tight">
        {amount.toLocaleString()}
      </span>
    </div>
  );
};
