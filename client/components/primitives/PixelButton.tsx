import React from 'react';
import { soundFx } from '../../utils/audio';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'gold';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  children,
  icon,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      if (variant === 'success') {
        soundFx.playQuestComplete();
      } else {
        soundFx.playClick();
      }
    }
    if (onClick) onClick(e);
  };

  const getVariantStyles = () => {
    if (disabled) {
      return 'bg-[#141A1D] border border-[#3A4247] text-[#6F695C] cursor-not-allowed opacity-50 shadow-none';
    }

    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-b from-[#A63824] via-[#8F3021] to-[#6E2215] border border-[#D5A441]/80 text-[#F3E4BF] shadow-[0_4px_16px_rgba(184,64,37,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:from-[#B84025] hover:to-[#7F2618] hover:border-[#F0C75E] hover:shadow-[0_0_20px_rgba(240,199,94,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]';
      case 'gold':
        return 'bg-gradient-to-b from-[#D5A441] via-[#B88728] to-[#8C6418] border border-[#F0C75E] text-[#080B0D] font-bold shadow-[0_4px_16px_rgba(213,164,65,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]';
      case 'secondary':
        return 'bg-gradient-to-b from-[#182024] to-[#0E1417] border border-[#8C6F3D]/40 text-[#E7D8B5] shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(240,199,94,0.1)] hover:border-[#C99A3D] hover:bg-[#1E292E] hover:text-[#F0C75E] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]';
      case 'success':
        return 'bg-gradient-to-b from-[#1C4530] via-[#143524] to-[#0C2418] border border-[#62A96B]/80 text-[#A8E6AF] shadow-[0_4px_16px_rgba(98,169,107,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-[#24573D] hover:to-[#173C29] hover:border-[#7ACB83] hover:shadow-[0_0_20px_rgba(98,169,107,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]';
      case 'danger':
        return 'bg-gradient-to-b from-[#7A2B20] via-[#5C1F16] to-[#42140D] border border-[#B84025]/80 text-[#F3E4BF] shadow-[0_4px_16px_rgba(104,37,27,0.4)] hover:from-[#8F3021] hover:to-[#50180F] hover:border-[#E0522D] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]';
      case 'ghost':
        return 'bg-transparent border border-transparent text-[#A99D83] hover:text-[#E7D8B5] hover:bg-white/[0.05] hover:border-[#8C6F3D]/30';
      default:
        return 'bg-[#8F3021] border border-[#D5A441] text-[#F3E4BF]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-lg';
      case 'lg':
        return 'px-6 py-3.5 text-base tracking-wider rounded-xl';
      case 'md':
      default:
        return 'px-4.5 py-2.5 text-sm tracking-wide rounded-lg';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-display font-semibold transition-all duration-200 select-none cursor-pointer ${
        fullWidth ? 'w-full' : ''
      } ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
