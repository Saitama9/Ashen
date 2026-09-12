import React from 'react';

export const StudyQuestArt: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden border border-[#59452A] bg-[#090C0E] select-none ${className}`}
      style={{ borderRadius: '3px', height: '200px' }}
    >
      <svg
        viewBox="0 0 400 200"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        <defs>
          <radialGradient id="candleGlow" cx="65%" cy="50%" r="55%">
            <stop offset="0%" stop-color="#F0C75E" stop-opacity="0.8" />
            <stop offset="40%" stop-color="#D5A441" stop-opacity="0.4" />
            <stop offset="75%" stop-color="#68251B" stop-opacity="0.1" />
            <stop offset="100%" stop-color="#080B0D" stop-opacity="0" />
          </radialGradient>
        </defs>

        {/* Stone Chamber Walls */}
        <rect width="400" height="200" fill="#0E1418" />

        {/* Stone Brick Pattern */}
        {Array.from({ length: 6 }).map((_, row) => (
          <g key={row} opacity="0.3">
            {Array.from({ length: 8 }).map((_, col) => (
              <rect
                key={col}
                x={col * 55 + (row % 2 === 0 ? 0 : 25)}
                y={row * 24}
                width="50"
                height="20"
                fill="none"
                stroke="#2A3840"
                strokeWidth="1"
              />
            ))}
          </g>
        ))}

        {/* Gothic Arched Window on Left */}
        <path d="M40,30 Q80,10 120,30 L120,130 L40,130 Z" fill="#080C10" stroke="#59452A" strokeWidth="2" />
        <path d="M48,36 Q80,18 112,36 L112,125 L48,125 Z" fill="#14222C" opacity="0.8" />
        {/* Window Stained Glass Tracery */}
        <line x1="80" y1="20" x2="80" y2="125" stroke="#59452A" strokeWidth="2" />
        <line x1="48" y1="75" x2="112" y2="75" stroke="#59452A" strokeWidth="1.5" />
        {/* Night sky with stars outside */}
        <rect x="65" y="45" width="2" height="2" fill="#72C7F0" />
        <rect x="95" y="55" width="2" height="2" fill="#72C7F0" />
        <rect x="70" y="90" width="1.5" height="1.5" fill="#E7D8B5" />

        {/* Bookshelves on Right Wall */}
        <rect x="310" y="20" width="80" height="130" fill="#11171A" stroke="#59452A" strokeWidth="1.5" />
        <line x1="310" y1="60" x2="390" y2="60" stroke="#59452A" strokeWidth="2" />
        <line x1="310" y1="100" x2="390" y2="100" stroke="#59452A" strokeWidth="2" />
        {/* Books on shelf 1 */}
        <rect x="315" y="28" width="6" height="30" fill="#68251B" />
        <rect x="323" y="24" width="8" height="34" fill="#4CA7D8" />
        <rect x="333" y="26" width="7" height="32" fill="#D5A441" />
        <rect x="342" y="30" width="5" height="28" fill="#62A96B" />
        <rect x="350" y="22" width="10" height="36" fill="#8D70B8" />
        <rect x="362" y="26" width="8" height="32" fill="#B84025" />
        {/* Books on shelf 2 */}
        <rect x="315" y="68" width="9" height="30" fill="#D5A441" />
        <rect x="326" y="72" width="6" height="26" fill="#68251B" />
        <rect x="334" y="66" width="12" height="32" fill="#2A3840" />
        <rect x="348" y="70" width="7" height="28" fill="#4CA7D8" />

        {/* Heavy Carved Oak Study Table */}
        <polygon points="120,130 380,130 395,190 90,190" fill="#1F1610" stroke="#59452A" strokeWidth="2" />
        <polygon points="120,130 380,130 375,142 125,142" fill="#33241A" />
        {/* Table Legs */}
        <rect x="130" y="142" width="22" height="58" fill="#140E0A" stroke="#59452A" strokeWidth="1" />
        <rect x="345" y="142" width="22" height="58" fill="#140E0A" stroke="#59452A" strokeWidth="1" />

        {/* Ambient Candlelight Glow */}
        <circle cx="280" cy="120" r="100" fill="url(#candleGlow)" />

        {/* The Great Open Grimoire on Desk */}
        <polygon points="180,138 270,138 285,170 165,170" fill="#2E2015" stroke="#59452A" strokeWidth="1.5" />
        {/* Left Page (Parchment) */}
        <polygon points="182,140 224,140 222,168 170,168" fill="#E7D8B5" />
        {/* Right Page (Parchment) */}
        <polygon points="226,140 268,140 280,168 228,168" fill="#DFCEAA" />
        {/* Center Spine */}
        <line x1="225" y1="138" x2="225" y2="168" stroke="#59452A" strokeWidth="2" />
        {/* Runic text lines */}
        <line x1="186" y1="145" x2="218" y2="145" stroke="#6F695C" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="184" y1="150" x2="216" y2="150" stroke="#6F695C" strokeWidth="1.5" strokeDasharray="4 2" />
        <line x1="182" y1="155" x2="214" y2="155" stroke="#6F695C" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="178" y1="160" x2="210" y2="160" stroke="#6F695C" strokeWidth="1.5" strokeDasharray="4 2" />

        <line x1="232" y1="145" x2="264" y2="145" stroke="#6F695C" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="234" y1="150" x2="266" y2="150" stroke="#6F695C" strokeWidth="1.5" strokeDasharray="4 2" />
        <line x1="236" y1="155" x2="268" y2="155" stroke="#6F695C" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="238" y1="160" x2="272" y2="160" stroke="#6F695C" strokeWidth="1.5" strokeDasharray="4 2" />

        {/* Brass Candlestick with Flame */}
        <rect x="290" y="125" width="12" height="4" fill="#D5A441" />
        <rect x="294" y="105" width="4" height="20" fill="#E7D8B5" />
        <rect x="295" y="100" width="2" height="5" fill="#182024" />
        {/* Candle Flame Pixels */}
        <polygon points="296,88 293,98 299,98" fill="#F0C75E" />
        <polygon points="296,92 294,99 298,99" fill="#E0522D" />

        {/* Ancient Skull on Desk */}
        <g transform="translate(140, 142)">
          <ellipse cx="12" cy="12" rx="10" ry="9" fill="#D8CEBA" />
          <rect x="6" y="14" width="12" height="7" fill="#C4B8A0" />
          {/* Eye Sockets */}
          <rect x="7" y="10" width="3" height="4" fill="#182024" />
          <rect x="14" y="10" width="3" height="4" fill="#182024" />
          {/* Nose */}
          <polygon points="12,14 11,16 13,16" fill="#182024" />
        </g>
      </svg>
    </div>
  );
};
