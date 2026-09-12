import React from 'react';

export const CathedralFooterArt: React.FC<{ quote?: string; className?: string }> = ({
  quote = '“The journey continues…”',
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden border border-[#59452A] bg-[#090C0E] select-none p-4 ${className}`}
      style={{ borderRadius: '3px' }}
    >
      <div className="relative z-10 text-center py-6">
        <p className="font-body italic text-sm text-[#A99D83] tracking-wide">
          {quote}
        </p>
      </div>

      {/* Background Skyline Silhouette with Eclipse Moon */}
      <svg
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-45"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 360 80"
      >
        <defs>
          <radialGradient id="footerMoon" cx="80%" cy="30%" r="50%">
            <stop offset="0%" stop-color="#E0522D" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#080B0D" stop-opacity="0" />
          </radialGradient>
        </defs>
        {/* Crescent Eclipse */}
        <circle cx="280" cy="25" r="16" fill="url(#footerMoon)" />
        <circle cx="280" cy="25" r="8" fill="#B84025" />
        <circle cx="282" cy="24" r="7.5" fill="#090C0E" />

        {/* Cathedral Silhouette */}
        <path
          d="M0,80 L20,80 L25,50 L30,30 L35,50 L40,80 
             L80,80 L85,45 L90,20 L95,45 L100,80 
             L160,80 L168,55 L175,25 L182,55 L190,80 
             L240,80 L248,50 L255,15 L262,50 L270,80 
             L320,80 L325,48 L330,28 L335,48 L340,80 L360,80 Z"
          fill="#11181D"
        />
      </svg>
    </div>
  );
};
