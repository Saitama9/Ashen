import React from 'react';

export const LevelUpArt: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden border border-[#C99A3D] bg-[#090C0E] select-none ${className}`}
      style={{
        borderRadius: '3px',
        height: '240px',
        boxShadow: '0 0 24px rgba(213, 164, 65, 0.25), inset 0 0 30px rgba(184, 64, 37, 0.25)',
      }}
    >
      <svg
        viewBox="0 0 400 240"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        <defs>
          <radialGradient id="sunburstGrad" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#F0C75E" stop-opacity="0.9" />
            <stop offset="25%" stop-color="#D5A441" stop-opacity="0.6" />
            <stop offset="60%" stop-color="#B84025" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#080B0D" stop-opacity="0" />
          </radialGradient>
        </defs>

        {/* Deep Dark Sky */}
        <rect width="400" height="240" fill="#090D10" />

        {/* Radiating Rays of Light */}
        <g stroke="#D5A441" strokeWidth="1" opacity="0.35">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x2 = 200 + Math.cos(angle) * 350;
            const y2 = 80 + Math.sin(angle) * 350;
            return <line key={i} x1="200" y1="80" x2={x2} y2={y2} strokeDasharray="4 4" />;
          })}
        </g>

        {/* Concentric Golden Aura Circles */}
        <circle cx="200" cy="80" r="110" fill="url(#sunburstGrad)" />
        <circle cx="200" cy="80" r="60" fill="none" stroke="#F0C75E" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" />
        <circle cx="200" cy="80" r="85" fill="none" stroke="#D5A441" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />

        {/* Cathedral Ruin Spires on Edges */}
        <polygon points="0,240 40,160 50,110 55,110 65,160 80,240" fill="#0C1216" />
        <polygon points="40,240 70,140 75,90 80,90 90,140 110,240" fill="#11171A" />
        <polygon points="400,240 360,160 350,110 345,110 335,160 320,240" fill="#0C1216" />
        <polygon points="360,240 330,140 325,90 320,90 310,140 290,240" fill="#11171A" />

        {/* Ground of Ash */}
        <polygon points="0,210 400,210 400,240 0,240" fill="#080B0D" />
        <line x1="0" y1="210" x2="400" y2="210" stroke="#59452A" strokeWidth="2" />

        {/* Triumphant Knight Silhouette in Center Raising Sword */}
        <g transform="translate(175, 45)">
          {/* Raised Greatsword Blade pointing straight up into the light */}
          <polygon points="25,5 21,90 29,90" fill="#F0C75E" />
          <polygon points="25,5 25,90 29,90" fill="#D5A441" />
          {/* Glowing Aura along Blade */}
          <rect x="23" y="10" width="4" height="75" fill="#FFFFFF" opacity="0.6" />
          {/* Crossguard */}
          <rect x="12" y="90" width="26" height="5" fill="#C99A3D" />
          <rect x="23" y="95" width="4" height="12" fill="#59452A" />
          <circle cx="25" cy="110" r="3" fill="#F0C75E" />

          {/* Raised Arms & Gauntlets */}
          <polygon points="12,96 16,96 22,120 16,120" fill="#D5A441" />
          <polygon points="38,96 34,96 28,120 34,120" fill="#D5A441" />

          {/* Knight Helmet / Visor with Glow */}
          <rect x="18" y="112" width="14" height="15" fill="#182024" />
          <rect x="20" y="118" width="10" height="3" fill="#F0C75E" />

          {/* Torso Armor & Flowing Cape billowing in wind */}
          <polygon points="12,127 38,127 48,165 2,165" fill="#141C20" stroke="#2B363D" strokeWidth="1" />
          <polygon points="5,165 45,165 40,140 10,140" fill="#11171A" />
          <path d="M5,135 Q-15,150 0,165 Q10,150 12,135 Z" fill="#B84025" opacity="0.8" />
          <path d="M45,135 Q65,150 50,165 Q40,150 38,135 Z" fill="#B84025" opacity="0.8" />
        </g>

        {/* Ascending Fire & Gold Sparkles */}
        <rect x="190" y="30" width="4" height="4" fill="#FFFFFF" />
        <rect x="210" y="45" width="3" height="3" fill="#F0C75E" />
        <rect x="160" y="70" width="3" height="3" fill="#E0522D" />
        <rect x="235" y="80" width="4" height="4" fill="#F0C75E" />
        <rect x="175" y="110" width="2" height="2" fill="#F0C75E" />
        <rect x="225" y="125" width="3" height="3" fill="#E0522D" />
        <rect x="145" y="140" width="3" height="3" fill="#F0C75E" />
        <rect x="255" y="150" width="2" height="2" fill="#B84025" />
      </svg>
    </div>
  );
};
