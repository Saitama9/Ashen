import React from 'react';

interface IrlQuestBackgroundProps {
  className?: string;
  showEmbers?: boolean;
}

export const IrlQuestBackground: React.FC<IrlQuestBackgroundProps> = ({
  className = '',
  showEmbers = true,
}) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none ${className}`}>
      {/* High-fidelity Vector Background Artwork */}
      <img
        src="/ashen-bonfire-bg.svg"
        alt="Dark Souls Bonfire Knight & Eclipse Background"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-bottom pixel-art"
      />

      {/* Atmospheric Ember Particle Layer */}
      {showEmbers && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Key rising embers positioned relative to the bonfire hearth */}
          <div className="absolute left-[62%] bottom-[25%] w-1.5 h-1.5 bg-[#FFC84A] rounded-full animate-ping opacity-75 duration-1000" />
          <div className="absolute left-[59%] bottom-[28%] w-1 h-1 bg-[#FF8D24] rounded-full animate-pulse opacity-90" />
          <div className="absolute left-[64%] bottom-[32%] w-1.5 h-1.5 bg-[#FFA834] rounded-full animate-bounce opacity-70 duration-700" />
          <div className="absolute left-[57%] bottom-[22%] w-2 h-2 bg-[#FF581C] rounded-full animate-pulse opacity-80" />
          <div className="absolute left-[66%] bottom-[36%] w-1 h-1 bg-[#FFDD78] rounded-full animate-ping opacity-60" />
        </div>
      )}

      {/* Edge Vignette & Readability Shadow Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-transparent opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070A] via-transparent to-transparent opacity-50" />
    </div>
  );
};
