import React from 'react';

interface IrlQuestCrestProps {
  className?: string;
}

export const IrlQuestCrest: React.FC<IrlQuestCrestProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} id="irl-quest-crest">
      <svg
        viewBox="0 0 240 80"
        className="w-48 sm:w-56 h-auto drop-shadow-[0_2px_12px_rgba(255,160,40,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFF5D6" />
            <stop offset="35%" stop-color="#E5BE6C" />
            <stop offset="70%" stop-color="#B88A3A" />
            <stop offset="100%" stop-color="#845920" />
          </linearGradient>

          <linearGradient id="crestFlame" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#E53818" />
            <stop offset="40%" stop-color="#FF7518" />
            <stop offset="75%" stop-color="#FFAE26" />
            <stop offset="100%" stop-color="#FFF6A8" />
          </linearGradient>

          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FF9E26" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#FF9E26" stop-opacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow behind Sword */}
        <circle cx="120" cy="40" r="30" fill="url(#sunGlow)" />

        {/* LEFT ORNAMENTAL WING (───◇───) */}
        <g stroke="url(#crestGold)" strokeWidth="1.5">
          <line x1="20" y1="42" x2="82" y2="42" strokeOpacity="0.7" />
          {/* Diamond Finial */}
          <polygon
            points="50,38 54,42 50,46 46,42"
            fill="#E5BE6C"
            stroke="none"
          />
          <circle cx="82" cy="42" r="2" fill="#E5BE6C" stroke="none" />
        </g>

        {/* RIGHT ORNAMENTAL WING (───◇───) */}
        <g stroke="url(#crestGold)" strokeWidth="1.5">
          <line x1="158" y1="42" x2="220" y2="42" strokeOpacity="0.7" />
          {/* Diamond Finial */}
          <polygon
            points="190,38 194,42 190,46 186,42"
            fill="#E5BE6C"
            stroke="none"
          />
          <circle cx="158" cy="42" r="2" fill="#E5BE6C" stroke="none" />
        </g>

        {/* SEMICIRCULAR ASTROLABE / SUNBURST ARCH */}
        <g stroke="url(#crestGold)" strokeWidth="1.5" fill="none">
          {/* Outer arc */}
          <path d="M 94 44 A 26 26 0 0 1 146 44" strokeOpacity="0.9" />
          {/* Inner fine arc */}
          <path d="M 99 44 A 21 21 0 0 1 141 44" strokeWidth="1" strokeOpacity="0.6" />

          {/* Radiating Sunburst Rays */}
          <line x1="120" y1="18" x2="120" y2="10" strokeWidth="1.5" />
          <line x1="106" y1="23" x2="100" y2="17" strokeWidth="1.2" />
          <line x1="134" y1="23" x2="140" y2="17" strokeWidth="1.2" />
          <line x1="96" y1="33" x2="89" y2="29" strokeWidth="1.2" />
          <line x1="144" y1="33" x2="151" y2="29" strokeWidth="1.2" />
        </g>

        {/* FLAMES BURSTING AROUND SWORD BASE */}
        <g fill="url(#crestFlame)" className="animate-pulse">
          <path d="M110,48 Q106,36 113,28 Q111,22 116,16 Q119,25 116,33 Q123,24 125,18 Q127,27 124,36 Q132,28 130,38 Q131,44 128,48 Z" />
          <path d="M114,46 Q112,38 117,30 Q120,26 120,20 Q122,28 122,34 Q126,30 125,40 Z" fill="#FFF8C7" />
        </g>

        {/* THE UPRIGHT CROSS-SWORD */}
        <g id="crest-sword">
          {/* Blade pointing up */}
          <path
            d="M117.5,44 L117.5,8 L120,2 L122.5,8 L122.5,44 Z"
            fill="url(#crestGold)"
          />
          {/* Central fuller line */}
          <line x1="120" y1="4" x2="120" y2="44" stroke="#FFF7D9" strokeWidth="0.8" />

          {/* Crossguard */}
          <rect
            x="110"
            y="43"
            width="20"
            height="3"
            rx="1"
            fill="url(#crestGold)"
          />
          <circle cx="110" cy="44.5" r="1.5" fill="#FFF5D6" />
          <circle cx="130" cy="44.5" r="1.5" fill="#FFF5D6" />

          {/* Grip / Hilt */}
          <rect x="118.5" y="46" width="3" height="9" fill="#52391C" />
          <line x1="118.5" y1="48" x2="121.5" y2="48" stroke="#E5BE6C" strokeWidth="0.8" />
          <line x1="118.5" y1="51" x2="121.5" y2="51" stroke="#E5BE6C" strokeWidth="0.8" />

          {/* Pommel */}
          <circle cx="120" cy="58" r="3" fill="url(#crestGold)" />
          <circle cx="120" cy="58" r="1.5" fill="#FFF7D9" />
        </g>
      </svg>
    </div>
  );
};
