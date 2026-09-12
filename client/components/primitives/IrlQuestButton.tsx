import React from 'react';

interface IrlQuestButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  id?: string;
}

export const IrlQuestButton: React.FC<IrlQuestButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
  icon,
  className = '',
  id,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <button
      id={id}
      onClick={onClick}
      className={`relative w-full group transition-all duration-200 active:scale-[0.98] select-none ${className}`}
    >
      {/* SVG Notched Border & Background for Pixel-Perfect Corner Chamfers */}
      <div className="relative w-full h-[52px] sm:h-[56px] flex items-center justify-center">
        {/* Background SVG with Notched Chamfers & Double Gold Borders */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 320 54"
        >
          <defs>
            <linearGradient id="primaryBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#691B1B" />
              <stop offset="50%" stopColor="#4E1313" />
              <stop offset="100%" stopColor="#360C0C" />
            </linearGradient>

            <linearGradient id="secondaryBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#101519" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#080C0E" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="primaryGoldBorder" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C99B42" />
              <stop offset="50%" stopColor="#F5D078" />
              <stop offset="100%" stopColor="#C99B42" />
            </linearGradient>

            <linearGradient id="secondaryGoldBorder" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5E4B33" />
              <stop offset="50%" stopColor="#8C6E44" />
              <stop offset="100%" stopColor="#5E4B33" />
            </linearGradient>
          </defs>

          {/* Outer Chamfered Polygon */}
          <polygon
            points="
              6,0 314,0 320,6 
              320,48 314,54 6,54 
              0,48 0,6
            "
            fill={isPrimary ? 'url(#primaryBg)' : 'url(#secondaryBg)'}
            stroke={isPrimary ? 'url(#primaryGoldBorder)' : 'url(#secondaryGoldBorder)'}
            strokeWidth="1.5"
            className="transition-all duration-200 group-hover:filter group-hover:brightness-110"
          />

          {/* Inner Inset Border for Primary Variant */}
          {isPrimary && (
            <polygon
              points="
                8,3 312,3 317,8 
                317,46 312,51 8,51 
                3,46 3,8
              "
              fill="none"
              stroke="#F6D588"
              strokeWidth="0.8"
              strokeOpacity="0.75"
            />
          )}

          {/* Subtle Corner Brackets */}
          <g stroke={isPrimary ? '#FFE59E' : '#9E8055'} strokeWidth="1.2" fill="none">
            {/* Top-Left Corner Notch Accent */}
            <path d="M 1,8 L 8,1" />
            {/* Top-Right Corner Notch Accent */}
            <path d="M 319,8 L 312,1" />
            {/* Bottom-Right Corner Notch Accent */}
            <path d="M 319,46 L 312,53" />
            {/* Bottom-Left Corner Notch Accent */}
            <path d="M 1,46 L 8,53" />
          </g>
        </svg>

        {/* Button Content Label */}
        <div className="relative z-10 flex items-center justify-center space-x-2.5 px-6">
          {icon && (
            <span className="flex-shrink-0 text-base leading-none">
              {icon}
            </span>
          )}
          <span
            className={`font-display font-medium tracking-[0.08em] whitespace-nowrap text-sm sm:text-base ${
              isPrimary
                ? 'text-[#F5E6CC] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] group-hover:text-[#FFFFFF]'
                : 'text-[#B0A188] group-hover:text-[#E2D2B8]'
            }`}
          >
            {children}
          </span>
        </div>
      </div>
    </button>
  );
};
