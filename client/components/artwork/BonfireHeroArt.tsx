import React, { useState, useEffect } from 'react';
import { InventoryItem, PlayerClass, SpriteAction } from '../../types';
import { PixelCharacter } from '../pixel/PixelCharacter';
import { soundFx } from '../../utils/audio';
import { Flame, Sparkles } from 'lucide-react';

interface BonfireHeroArtProps {
  compact?: boolean;
  className?: string;
  playerClass?: PlayerClass;
  heroAction?: SpriteAction;
  onHeroAction?: (act: SpriteAction) => void;
  equippedItems?: InventoryItem[];
}

export const BonfireHeroArt: React.FC<BonfireHeroArtProps> = ({
  compact = false,
  className = '',
  playerClass = 'sorcerer' as PlayerClass,
  heroAction = 'idle',
  onHeroAction,
  equippedItems = [],
}) => {
  const [activeAction, setActiveAction] = useState<SpriteAction>(heroAction);
  const [isKindling, setIsKindling] = useState(false);
  const [kindleCount, setKindleCount] = useState(1);

  useEffect(() => {
    setActiveAction(heroAction);
  }, [heroAction]);

  const handleBonfireClick = () => {
    soundFx.playBonfireKindle();
    setIsKindling(true);
    setKindleCount((prev) => prev + 1);

    // Hero performs reverent kneel / victory action
    setActiveAction('victory');
    onHeroAction?.('victory');

    setTimeout(() => {
      setIsKindling(false);
    }, 1200);
  };

  return (
    <div
      className={`relative overflow-hidden border-2 border-[#59452A] bg-[#090C0E] select-none ${
        compact
          ? 'h-48 sm:h-52'
          : 'h-64 sm:h-76 md:h-84 lg:h-92'
      } ${className}`}
    >
      {/* 16-bit Dark Fantasy Cathedral Horizon & Bonfire Canvas */}
      <svg
        viewBox="0 0 420 280"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#050709" />
            <stop offset="50%" stopColor="#0B1218" />
            <stop offset="85%" stopColor="#101920" />
            <stop offset="100%" stopColor="#152028" />
          </linearGradient>

          <radialGradient id="eclipseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E0522D" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#B84025" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#4A180E" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#080B0D" stopOpacity="0" />
          </radialGradient>

          {/* Dynamic Warm Bonfire Radial Light */}
          <radialGradient id="bonfireGlowDynamic" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity={isKindling ? 0.95 : 0.8} />
            <stop offset="25%" stopColor="#F59E0B" stopOpacity={isKindling ? 0.75 : 0.55} />
            <stop offset="55%" stopColor="#E0522D" stopOpacity={isKindling ? 0.45 : 0.28} />
            <stop offset="80%" stopColor="#7F1D1D" stopOpacity={isKindling ? 0.2 : 0.1} />
            <stop offset="100%" stopColor="#080B0D" stopOpacity="0" />
          </radialGradient>

          {/* Glowing Coals Gradients */}
          <linearGradient id="coalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="30%" stopColor="#E0522D" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#B84025" />
            <stop offset="100%" stopColor="#1F2937" />
          </linearGradient>

          <linearGradient id="swordBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5E7EB" />
            <stop offset="40%" stopColor="#9CA3AF" />
            <stop offset="75%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Night Sky with subtle pixel stars */}
        <rect width="420" height="280" fill="url(#skyGrad)" />

        {/* Distant Pixel Stars */}
        <rect x="40" y="25" width="2" height="2" fill="#93C5FD" opacity="0.6" />
        <rect x="95" y="45" width="2" height="2" fill="#E2E8F0" opacity="0.8" />
        <rect x="160" y="20" width="3" height="3" fill="#FDE047" opacity="0.7" />
        <rect x="215" y="35" width="2" height="2" fill="#E2E8F0" opacity="0.5" />
        <rect x="260" y="15" width="2" height="2" fill="#93C5FD" opacity="0.8" />
        <rect x="380" y="30" width="2" height="2" fill="#FDE047" opacity="0.6" />
        <rect x="395" y="60" width="3" height="3" fill="#E2E8F0" opacity="0.75" />

        {/* The Darksign (Crimson Eclipse Moon) */}
        <circle cx="345" cy="55" r="45" fill="url(#eclipseGlow)" />
        <circle cx="345" cy="55" r="19" fill="#B84025" stroke="#E0522D" strokeWidth="2.5" />
        <circle cx="348" cy="53" r="17" fill="#06090B" />
        <path d="M336,45 Q348,32 355,42 Q348,50 336,45 Z" fill="#F0C75E" opacity="0.7" />

        {/* Distant Cathedral Spires (Silhouette 1) */}
        <path
          d="M0,205 L25,205 L30,155 L35,155 L38,115 L42,115 L45,75 L49,75 L52,115 L56,115 L60,155 L65,155 L70,205 
             L105,205 L112,135 L120,135 L125,90 L130,90 L135,135 L144,135 L150,205 
             L195,205 L205,125 L215,125 L220,65 L225,65 L230,125 L240,125 L250,205 
             L310,205 L315,145 L325,145 L330,105 L335,105 L340,145 L350,145 L360,205 L420,205 L420,280 L0,280 Z"
          fill="#0B1014"
        />

        {/* Midground Cathedral Arches, Buttresses & Ruined Walls */}
        <path
          d="M0,225 L45,225 L55,165 L70,165 L75,135 L85,135 L90,165 L105,165 L115,225 
             L170,225 L180,155 L200,155 L210,225 
             L270,225 L280,145 L300,145 L310,225 L420,225 L420,280 L0,280 Z"
          fill="#10171D"
        />

        {/* Foreground Rubble & Rocky Ground */}
        <polygon points="0,236 420,236 420,280 0,280" fill="#080B0D" />
        <rect x="18" y="242" width="28" height="14" fill="#151C21" stroke="#3D2D1B" strokeWidth="1" />
        <rect x="52" y="248" width="38" height="15" fill="#11171A" stroke="#3D2D1B" strokeWidth="1" />
        <rect x="175" y="244" width="32" height="16" fill="#151C21" stroke="#3D2D1B" strokeWidth="1" />
        <rect x="235" y="246" width="36" height="16" fill="#182024" stroke="#59452A" strokeWidth="1" />
        <rect x="365" y="248" width="45" height="18" fill="#11171A" stroke="#3D2D1B" strokeWidth="1" />

        {/* Cobblestone paving details */}
        <rect x="110" y="240" width="16" height="6" fill="#12181C" />
        <rect x="135" y="244" width="20" height="7" fill="#151C21" />
        <rect x="280" y="248" width="24" height="8" fill="#1F1712" />

        {/* ======================================================== */}
        {/* DYNAMIC BONFIRE HEARTH (Anchored at x=310, y=228) */}
        {/* ======================================================== */}

        {/* Hearth Radial Light (Animated Pulsing) */}
        <circle
          cx="310"
          cy="215"
          r={isKindling ? "125" : "95"}
          fill="url(#bonfireGlowDynamic)"
          className="transition-all duration-700"
          style={{
            animation: 'bonfireGlowPulse 2.5s infinite ease-in-out',
            transformOrigin: '310px 215px',
          }}
        />

        {/* Ground light reflection pool */}
        <ellipse
          cx="310"
          cy="242"
          rx={isKindling ? "75" : "55"}
          ry="12"
          fill="#D97706"
          opacity={isKindling ? "0.45" : "0.25"}
          style={{ animation: 'coalGlow 2s infinite ease-in-out' }}
        />

        {/* Bonfire Ash & Bone Mound */}
        <ellipse cx="310" cy="242" rx="42" ry="11" fill="#11171A" stroke="#3D2D1B" strokeWidth="1.5" />
        <ellipse cx="310" cy="240" rx="34" ry="7" fill="#1F2937" />

        {/* Bleached skull/bones in the ash */}
        <rect x="290" y="238" width="5" height="4" fill="#D1D5DB" />
        <rect x="292" y="241" width="3" height="3" fill="#9CA3AF" />
        <rect x="326" y="239" width="6" height="3" fill="#E5E7EB" />

        {/* Charred Firewood Logs (Criss-crossed) */}
        <polygon points="278,244 338,233 342,238 282,248" fill="#1A1412" stroke="#4A180E" strokeWidth="1" />
        <polygon points="340,245 280,233 276,238 336,248" fill="#241B15" stroke="#3D2D1B" strokeWidth="1" />

        {/* Glowing Ember Cracks in Wood */}
        <g style={{ animation: 'coalGlow 1.8s infinite ease-in-out' }}>
          <rect x="295" y="237" width="14" height="2" fill="url(#coalGrad)" />
          <rect x="312" y="241" width="12" height="2" fill="#F59E0B" />
          <rect x="286" y="242" width="9" height="2" fill="#EF4444" />
          <rect x="322" y="236" width="10" height="2" fill="#FDE047" />
        </g>

        {/* ======================================================== */}
        {/* THE COILED SWORD (Twisted Greatsword of Firelink) */}
        {/* ======================================================== */}
        {/* Coiled Sword Pommel & Grip */}
        <circle cx="310" cy="118" r="4.5" fill="#374151" stroke="#9CA3AF" strokeWidth="1" />
        <rect x="308" y="122" width="4" height="14" fill="#1F2937" stroke="#4B5563" strokeWidth="0.5" />
        {/* Spiral grip wraps */}
        <line x1="308" y1="125" x2="312" y2="127" stroke="#D1D5DB" strokeWidth="1" />
        <line x1="308" y1="130" x2="312" y2="132" stroke="#D1D5DB" strokeWidth="1" />

        {/* Twisted Crossguard */}
        <path d="M294,136 L326,136 L324,141 L312,139 L310,141 L308,139 L296,141 Z" fill="#4B5563" stroke="#1F2937" strokeWidth="1" />
        <circle cx="295" cy="138" r="2.5" fill="#9CA3AF" />
        <circle cx="325" cy="138" r="2.5" fill="#9CA3AF" />

        {/* Coiled/Twisted Blade plunges into ash (136px down to 238px) */}
        <path
          d="M308,140 
             L312,140 
             L313,158 Q316,163 311,168 Q306,173 312,179 Q317,185 309,192 Q305,198 313,205 Q318,212 309,219 
             L312,238 
             L308,238 
             L306,219 Q313,212 307,205 Q301,198 307,192 Q313,185 306,179 Q301,173 308,168 Q313,163 307,158 Z"
          fill="url(#swordBladeGrad)"
          stroke="#78350F"
          strokeWidth="0.8"
        />

        {/* Coiled Spiral Ridges & Glowing Molten Metal highlights */}
        <g opacity="0.9">
          <ellipse cx="310" cy="158" rx="4.5" ry="1.5" fill="#FDE047" />
          <ellipse cx="310" cy="173" rx="4.5" ry="1.5" fill="#F59E0B" />
          <ellipse cx="310" cy="188" rx="5" ry="1.5" fill="#EF4444" />
          <ellipse cx="310" cy="203" rx="5" ry="1.5" fill="#DC2626" />
          <ellipse cx="310" cy="218" rx="5.5" ry="2" fill="#FDE047" />
        </g>

        {/* ======================================================== */}
        {/* MULTI-TIERED DANCING PIXEL FLAMES (High Fidelity) */}
        {/* ======================================================== */}

        {/* Layer 1: Outer Wild Crimson Licking Flames */}
        <g
          style={{
            transformOrigin: '310px 238px',
            animation: 'bonfireFlicker 1.4s infinite ease-in-out',
          }}
        >
          {/* Left wild flame lick */}
          <polygon points="310,135 292,185 300,210 286,228 314,240" fill="#991B1B" />
          {/* Right wild flame lick */}
          <polygon points="310,132 328,182 320,208 334,228 306,240" fill="#B91C1C" />
          {/* Center leaping tongue */}
          <polygon points="310,122 298,172 322,172" fill="#DC2626" />
        </g>

        {/* Layer 2: Main Dancing Orange Fire Body */}
        <g
          style={{
            transformOrigin: '310px 238px',
            animation: 'innerFlameDance 1.1s infinite ease-in-out alternate',
          }}
        >
          <polygon points="310,140 295,190 304,215 292,236 328,236 316,215 325,190" fill="#EA580C" />
          <polygon points="310,148 300,195 320,195" fill="#F97316" />
          {/* Pixelated stepped edge flame teeth */}
          <rect x="296" y="205" width="5" height="12" fill="#EA580C" />
          <rect x="319" y="205" width="5" height="12" fill="#EA580C" />
          <rect x="303" y="185" width="4" height="14" fill="#F97316" />
          <rect x="313" y="185" width="4" height="14" fill="#F97316" />
        </g>

        {/* Layer 3: Intense Bright Gold Flame Core */}
        <g
          style={{
            transformOrigin: '310px 238px',
            animation: 'bonfireFlicker 0.85s infinite ease-in-out reverse',
          }}
        >
          <polygon points="310,165 300,210 320,210" fill="#FACC15" />
          <polygon points="310,178 303,222 317,222" fill="#FDE047" />
          {/* White-Hot Incandescent Heart */}
          <polygon points="310,198 306,230 314,230" fill="#FFFBEB" />
          <circle cx="310" cy="225" r="5" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* Extra Sparks Burst on Kindle */}
        {isKindling && (
          <g>
            <circle cx="310" cy="180" r="35" fill="#FDE047" opacity="0.4" />
            <polygon points="310,105 302,150 318,150" fill="#FEF08A" />
            <rect x="300" y="115" width="4" height="4" fill="#FFFFFF" />
            <rect x="316" y="125" width="3" height="3" fill="#FDE047" />
            <rect x="292" y="145" width="4" height="4" fill="#F97316" />
            <rect x="325" y="145" width="4" height="4" fill="#F97316" />
          </g>
        )}

        {/* ======================================================== */}
        {/* RISING PIXEL EMBERS (Animated Drift into the Night Sky) */}
        {/* ======================================================== */}
        <g opacity="0.9">
          {/* Stream 1 - Left Drift */}
          <rect
            x="302"
            y="200"
            width="3"
            height="3"
            fill="#FEF08A"
            style={{ animation: 'emberRise1 2.2s infinite linear' }}
          />
          <rect
            x="298"
            y="215"
            width="2"
            height="2"
            fill="#F97316"
            style={{ animation: 'emberRise1 2.6s infinite linear 0.7s' }}
          />
          <rect
            x="305"
            y="190"
            width="3"
            height="3"
            fill="#FDE047"
            style={{ animation: 'emberRise1 3.1s infinite linear 1.4s' }}
          />

          {/* Stream 2 - Right Drift */}
          <rect
            x="316"
            y="205"
            width="3"
            height="3"
            fill="#FACC15"
            style={{ animation: 'emberRise2 2.4s infinite linear 0.3s' }}
          />
          <rect
            x="322"
            y="218"
            width="2"
            height="2"
            fill="#EF4444"
            style={{ animation: 'emberRise2 2.8s infinite linear 1.1s' }}
          />
          <rect
            x="314"
            y="185"
            width="3"
            height="3"
            fill="#FEF08A"
            style={{ animation: 'emberRise2 3.3s infinite linear 1.8s' }}
          />

          {/* Stream 3 - Center High Float */}
          <rect
            x="309"
            y="195"
            width="2.5"
            height="2.5"
            fill="#FFFBEB"
            style={{ animation: 'emberRise3 2.5s infinite linear 0.5s' }}
          />
          <rect
            x="311"
            y="210"
            width="2"
            height="2"
            fill="#F97316"
            style={{ animation: 'emberRise3 3.0s infinite linear 1.5s' }}
          />
          <rect
            x="307"
            y="175"
            width="2"
            height="2"
            fill="#FDE047"
            style={{ animation: 'emberRise3 2.1s infinite linear 0.9s' }}
          />
        </g>
      </svg>

      {/* ======================================================== */}
      {/* REAL ANIMATED PIXEL CHARACTER (Responsive Left Placement) */}
      {/* ======================================================== */}
      <div className="absolute left-[6%] sm:left-[10%] md:left-[12%] bottom-2 sm:bottom-3 z-10 flex flex-col items-center">
        <PixelCharacter
          playerClass={playerClass}
          action={activeAction}
          size="lg"
          interactive
          equippedItems={equippedItems}
          onActionComplete={() => setActiveAction('idle')}
        />

        {/* Character Vocation Tag */}
        <div className="mt-1 px-2 py-0.5 bg-[#080B0D]/90 border border-[#59452A] rounded-xs font-pixel text-[7.5px] text-[#C99A3D] uppercase tracking-wider backdrop-blur-xs">
          {playerClass}
        </div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE BONFIRE TAP / CLICK ZONE (Responsive Right) */}
      {/* ======================================================== */}
      <button
        onClick={handleBonfireClick}
        className="absolute right-[8%] sm:right-[14%] md:right-[18%] bottom-2 sm:bottom-3 w-28 sm:w-32 h-32 sm:h-36 z-20 cursor-pointer focus:outline-none group flex flex-col items-center justify-end"
        title="Rest at the Bonfire"
      >
        <span className="sr-only">Kindle Bonfire</span>

        {/* Hover / Active Badge */}
        <div className="opacity-85 group-hover:opacity-100 transition-opacity mb-2 px-2.5 py-1 bg-[#0D1215]/95 border border-[#C99A3D] rounded-xs text-[8px] font-pixel text-[#F0C75E] uppercase tracking-wider shadow-xl flex items-center gap-1.5 backdrop-blur-xs group-hover:scale-105 transition-transform">
          <Flame className="w-3 h-3 text-[#E0522D] animate-pulse" />
          <span>Rest at Bonfire</span>
        </div>
      </button>

      {/* Subtle bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#080B0D] to-transparent pointer-events-none" />
    </div>
  );
};
