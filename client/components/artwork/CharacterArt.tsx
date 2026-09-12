import React from 'react';

export const CharacterArt: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden border border-[#59452A] bg-[#090C0E] select-none ${className}`}
      style={{ borderRadius: '3px', height: '180px' }}
    >
      <svg
        viewBox="0 0 400 180"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        <defs>
          <linearGradient id="charSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#080B0D" />
            <stop offset="70%" stop-color="#0E161C" />
            <stop offset="100%" stop-color="#141F26" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="400" height="180" fill="url(#charSky)" />

        {/* Distant Spire silhouettes */}
        <polygon points="30,180 50,110 55,60 60,60 65,110 85,180" fill="#0C1216" />
        <polygon points="120,180 140,120 145,80 150,80 155,120 175,180" fill="#0E151A" />
        <polygon points="280,180 300,100 305,50 310,50 315,100 335,180" fill="#0C1216" />
        <polygon points="340,180 355,130 360,95 365,95 370,130 385,180" fill="#0E151A" />

        {/* Floating Embers */}
        <rect x="70" y="50" width="2" height="2" fill="#E0522D" />
        <rect x="190" y="35" width="2" height="2" fill="#F0C75E" />
        <rect x="310" y="40" width="2" height="2" fill="#E0522D" />
        <rect x="250" y="60" width="2" height="2" fill="#F0C75E" />

        {/* Center Character (The Wanderer) */}
        <g transform="translate(180, 25)">
          {/* Hood */}
          <path d="M10,20 Q20,2 30,20 Z" fill="#182024" stroke="#59452A" strokeWidth="1" />
          {/* Dark Face Mask / Shadow */}
          <rect x="15" y="16" width="10" height="6" fill="#080B0D" />
          <rect x="17" y="18" width="2" height="2" fill="#D5A441" />
          <rect x="21" y="18" width="2" height="2" fill="#D5A441" />

          {/* Pauldrons / Shoulders */}
          <rect x="5" y="24" width="30" height="8" fill="#243037" stroke="#59452A" strokeWidth="1" />

          {/* Flowing Ragged Cloak */}
          <polygon points="5,28 35,28 45,135 -5,135" fill="#11171A" />
          {/* Cloak Fold Highlights */}
          <path d="M12,28 L5,130 L10,130 L16,28 Z" fill="#182024" />
          <path d="M22,28 L20,130 L25,130 L26,28 Z" fill="#182024" />
          <path d="M28,28 L35,130 L40,130 L32,28 Z" fill="#182024" />

          {/* Greatsword on Back */}
          <line x1="8" y1="10" x2="38" y2="105" stroke="#A99D83" strokeWidth="3" />
          <line x1="5" y1="20" x2="16" y2="16" stroke="#D5A441" strokeWidth="2.5" />
          <circle cx="7" cy="11" r="2.5" fill="#D5A441" />
        </g>

        {/* Edge Vignette */}
        <rect width="400" height="180" fill="none" stroke="#59452A" strokeWidth="1" />
      </svg>
    </div>
  );
};
