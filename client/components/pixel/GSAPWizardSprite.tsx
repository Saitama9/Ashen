import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { InventoryItem, SpriteAction } from '../../types';
import { soundFx } from '../../utils/audio';

export interface GSAPWizardSpriteProps {
  action?: SpriteAction;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  onActionComplete?: () => void;
  interactive?: boolean;
  className?: string;
  customPngs?: Partial<Record<string, string>>;
  showSpellEffects?: boolean;
  equippedItems?: InventoryItem[];
}

// Frame definitions matching the 8 sprite sheets
export const WIZARD_ANIMATIONS = {
  idle: { name: 'Idle', frames: 8, fps: 10, loop: true, png: '/wizard/Idle.png' },
  run: { name: 'Run', frames: 8, fps: 12, loop: true, png: '/wizard/Run.png' },
  attack: { name: 'Attack 1 (Void Skull)', frames: 8, fps: 14, loop: false, png: '/wizard/Attack1.png' },
  attack2: { name: 'Attack 2 (Staff Slam)', frames: 8, fps: 14, loop: false, png: '/wizard/Attack2.png' },
  jump: { name: 'Jump', frames: 2, fps: 6, loop: false, png: '/wizard/Jump.png' },
  fall: { name: 'Fall', frames: 2, fps: 6, loop: true, png: '/wizard/Fall.png' },
  hit: { name: 'Take Hit', frames: 3, fps: 10, loop: false, png: '/wizard/Take hit.png' },
  death: { name: 'Death', frames: 7, fps: 8, loop: false, png: '/wizard/Death.png' },
} as const;

export const GSAPWizardSprite: React.FC<GSAPWizardSpriteProps> = ({
  action = 'idle',
  size = 'md',
  onActionComplete,
  interactive = true,
  className = '',
  customPngs,
  showSpellEffects = true,
  equippedItems = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [pngAvailable, setPngAvailable] = useState<boolean>(false);
  const [activeAction, setActiveAction] = useState<SpriteAction>(action);

  const animConfig = useMemo(() => {
    const key = (activeAction === 'cast' ? 'attack' : activeAction) as keyof typeof WIZARD_ANIMATIONS;
    return WIZARD_ANIMATIONS[key] || WIZARD_ANIMATIONS.idle;
  }, [activeAction]);

  // Sync external action changes
  useEffect(() => {
    setActiveAction(action);
  }, [action]);

  // Check if PNG sprite sheet is available
  useEffect(() => {
    const pngSrc = customPngs?.[activeAction] || animConfig.png;
    const img = new Image();
    img.src = pngSrc;
    img.onload = () => setPngAvailable(true);
    img.onerror = () => setPngAvailable(false);
  }, [activeAction, customPngs, animConfig.png]);

  // GSAP Frame Stepper & Timeline Engine
  useEffect(() => {
    const totalFrames = animConfig.frames;
    const duration = totalFrames / animConfig.fps;
    const isLoop = animConfig.loop;

    const frameObj = { frame: 0 };
    setCurrentFrame(0);

    const tl = gsap.timeline({
      repeat: isLoop ? -1 : 0,
      onComplete: () => {
        if (!isLoop) {
          onActionComplete?.();
          setActiveAction('idle');
        }
      },
    });

    // Stepped frame animation
    tl.to(frameObj, {
      frame: totalFrames - 1,
      duration: duration,
      ease: `steps(${totalFrames - 1})`,
      roundProps: 'frame',
      onUpdate: () => {
        setCurrentFrame(frameObj.frame);
      },
    });

    // Additional GSAP visual juice per action
    if (containerRef.current) {
      if (activeAction === 'attack') {
        // Thrust forward and snap back
        gsap.fromTo(
          containerRef.current,
          { x: -6 },
          { x: 8, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
        );
      } else if (activeAction === 'attack2') {
        // Jump high and slam
        gsap.timeline()
          .to(containerRef.current, { y: -14, duration: 0.2, ease: 'power1.out' })
          .to(containerRef.current, { y: 0, duration: 0.15, ease: 'bounce.out' });
      } else if (activeAction === 'hit') {
        // Red flash & shake
        gsap.to(containerRef.current, {
          x: -10,
          duration: 0.05,
          yoyo: true,
          repeat: 4,
          ease: 'none',
        });
      } else if (activeAction === 'death') {
        // Drop down and stay
        gsap.to(containerRef.current, {
          y: 4,
          opacity: 0.85,
          duration: 0.8,
          ease: 'power2.in',
        });
      }
    }

    return () => {
      tl.kill();
    };
  }, [activeAction, animConfig, onActionComplete]);

  // Handle interactive click triggers
  const handleClick = () => {
    if (!interactive) return;

    if (activeAction === 'idle') {
      soundFx.playMagicCast();
      setActiveAction('attack');
    } else if (activeAction === 'attack') {
      soundFx.playMagicCast();
      setActiveAction('attack2');
    } else if (activeAction === 'attack2') {
      soundFx.playDodgeRoll();
      setActiveAction('run');
    } else {
      setActiveAction('idle');
    }
  };

  // Dimensions
  const sizeMap = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
    hero: 'w-52 h-52 sm:w-64 sm:h-64',
  };

  const pngSrc = customPngs?.[activeAction] || animConfig.png;

  return (
    <div
      ref={containerRef}
      id="gsap-wizard-character"
      onClick={handleClick}
      className={`relative select-none flex items-center justify-center ${sizeMap[size]} ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      style={{ imageRendering: 'pixelated' }}
      title={interactive ? 'Click Wizard: Attack 1 (Void Skull) ➔ Attack 2 (Slam) ➔ Run!' : undefined}
    >
      {/* Ground Arcane Shadow */}
      <div
        className="absolute bottom-1 w-2/3 h-2.5 bg-[#030406]/75 rounded-full blur-[1px] pointer-events-none transition-all duration-300"
        style={{
          transform:
            activeAction === 'jump'
              ? 'scale(0.5) translateY(12px)'
              : activeAction === 'attack2'
              ? 'scale(1.2)'
              : 'scale(1)',
        }}
      />

      {/* 1. IF PNG SPRITE SHEET IS LOADED */}
      {pngAvailable ? (
        <div
          ref={spriteRef}
          className="w-full h-full relative overflow-hidden"
          style={{
            backgroundImage: `url("${pngSrc}")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${animConfig.frames * 100}% 100%`,
            backgroundPosition: `${(currentFrame / (animConfig.frames - 1)) * 100}% 0%`,
            imageRendering: 'pixelated',
          }}
        />
      ) : (
        /* 2. HIGH-FIDELITY VECTOR/PIXEL RENDERER (Exact 1:1 replica of the uploaded sprite sheets) */
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full drop-shadow-[0_4px_16px_rgba(124,58,237,0.35)] filter transition-transform group-hover:scale-105"
          style={{ shapeRendering: 'crispEdges' }}
        >
          {/* Defs for Arcane Flame Gradients */}
          <defs>
            <radialGradient id="voidStaffFlame" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="35%" stopColor="#A855F7" />
              <stop offset="75%" stopColor="#581C87" />
              <stop offset="100%" stopColor="#2E1065" />
            </radialGradient>
            <radialGradient id="eyeOfVoid" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="60%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </radialGradient>
            <filter id="voidGlow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render the Wizard Frame based on activeAction and currentFrame */}
          <WizardFrameVisual action={activeAction} frame={currentFrame} />
        </svg>
      )}

      {/* ATTACHED EQUIPPED ITEMS ON CHARACTER */}
      {equippedItems && equippedItems.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* 1. Traveler's Cloak - Flowing mantle with golden hem */}
          {equippedItems.some((i) => i.id === 'item-1' || i.iconType === 'cloak') && (
            <div className="absolute -left-2 top-5 w-4 h-9 bg-gradient-to-b from-[#3B2818]/90 via-[#24170D] to-transparent border-l border-[#C99A3D]/60 rounded-xs blur-[0.3px]" />
          )}

          {/* 2. Iron Resolve Armor - Heavy reinforced steel pauldrons & chest rune */}
          {equippedItems.some((i) => i.id === 'item-2' || i.iconType === 'armor') && (
            <div className="absolute left-[36%] top-[34%] w-4 h-3.5 border border-[#94A3B8] bg-[#334155]/85 rounded-xs shadow-[0_0_8px_rgba(148,163,184,0.5)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#CBD5E1] rounded-full" />
            </div>
          )}

          {/* 3. Scholar's Tome - Floating arcane grimoire codex hovering near staff */}
          {equippedItems.some((i) => i.id === 'item-3' || i.iconType === 'tome') && (
            <div className="absolute -left-4 top-5 w-4 h-5 bg-[#1E1B4B] border border-[#818CF8] shadow-[0_0_10px_rgba(129,140,248,0.8)] rounded-xs animate-bounce flex items-center justify-center">
              <div className="w-1.5 h-2 bg-[#A5B4FC] rounded-[1px]" />
            </div>
          )}

          {/* 4. Ember Lantern - Brass lantern casting radiant amber light */}
          {equippedItems.some((i) => i.id === 'item-4' || i.iconType === 'lantern') && (
            <div className="absolute -right-2 bottom-3 w-3 h-4 bg-[#451A03] border border-[#F59E0B] shadow-[0_0_14px_rgba(245,158,11,0.9)] rounded-xs flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#FDE68A] rounded-full animate-ping" />
            </div>
          )}

          {/* 5. Ashen Greatsword - Massive blade slung across back */}
          {equippedItems.some((i) => i.id === 'item-5' || i.iconType === 'sword') && (
            <div className="absolute -right-1.5 top-1.5 w-1.5 h-12 bg-gradient-to-b from-[#E2E8F0] via-[#64748B] to-[#0F172A] border-l border-[#F59E0B] rotate-[-22deg] shadow-[0_0_6px_rgba(0,0,0,0.9)]" />
          )}

          {/* 6. Ring of Focus - Radiant golden crown halo above head */}
          {equippedItems.some((i) => i.id === 'item-6' || i.iconType === 'ring') && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-7 h-2 rounded-full border border-[#FDE047] shadow-[0_0_12px_rgba(250,204,21,0.95)] animate-pulse" />
          )}

          {/* 7. Ancient Reliquary - Orbiting amethyst void motes */}
          {equippedItems.some((i) => i.id === 'item-7' || (i.iconType as string) === 'relic') && (
            <div className="absolute -top-1 -right-3 w-2.5 h-2.5 bg-[#C084FC] rounded-full shadow-[0_0_12px_#A855F7] animate-spin" />
          )}

          {/* 8. Sunlight Talisman - Solar radiance disk aura */}
          {equippedItems.some((i) => i.id === 'item-8' || (i.iconType as string) === 'badge') && (
            <div className="absolute -inset-1 rounded-full border border-dashed border-[#F59E0B]/50 pointer-events-none animate-spin" style={{ animationDuration: '18s' }} />
          )}
        </div>
      )}

      {/* SPELL PARTICLES & DEMON SKULL LAUNCH EFFECT (GSAP-rendered on Attack1 / Attack2) */}
      {showSpellEffects && activeAction === 'attack' && currentFrame >= 3 && (
        <div
          className="absolute right-[-24px] sm:right-[-32px] top-6 pointer-events-none animate-pulse"
          style={{
            transform: `translateX(${(currentFrame - 3) * 16}px)`,
            opacity: currentFrame > 6 ? (8 - currentFrame) / 2 : 1,
          }}
        >
          {/* Screaming Void Demon Spirit */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#7C3AED]/40 rounded-full blur-md" />
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" className="filter drop-shadow-[0_0_8px_#A78BFA]">
              <rect x="5" y="4" width="10" height="7" fill="#E9D5FF" />
              <rect x="4" y="6" width="12" height="6" fill="#E9D5FF" />
              <rect x="6" y="7" width="2" height="2" fill="#7F1D1D" />
              <rect x="12" y="7" width="2" height="2" fill="#7F1D1D" />
              <rect x="7" y="11" width="6" height="3" fill="#C084FC" />
              <rect x="8" y="14" width="4" height="2" fill="#2E1065" />
            </svg>
            <div className="absolute -left-3 w-4 h-2 bg-gradient-to-r from-transparent to-[#A78BFA] opacity-75 blur-[1px]" />
          </div>
        </div>
      )}

      {showSpellEffects && activeAction === 'attack2' && currentFrame >= 4 && (
        <div className="absolute -bottom-2 inset-x-0 pointer-events-none flex justify-center">
          {/* Ground Shockwave Wave */}
          <div className="w-full h-3 bg-gradient-to-r from-transparent via-[#C084FC] to-transparent animate-ping opacity-75" />
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// WIZARD FRAME VISUAL GENERATOR
// Pixel-perfect rendering of the dark hooded wizard with Eye of the Void staff
// ----------------------------------------------------------------------
function WizardFrameVisual({ action, frame }: { action: SpriteAction; frame: number }) {
  // Common Robe and Staff Colors matching the user's uploaded images
  const C = {
    hoodOuter: '#231936',
    hoodInner: '#120B1D',
    robeBody: '#2A1E40',
    robeFold: '#1B132A',
    goldTrim: '#E0B250',
    goldAccent: '#F3D47A',
    woodStaff: '#261A13',
    staffCap: '#4A3428',
    flameVoid: '#8B25C9',
    flameBright: '#D166FF',
    flameCore: '#F3E8FF',
    demonEye: '#FF2A40',
    flesh: '#D8B89E',
  };

  // Breathing / Floating offsets
  const isIdle = action === 'idle';
  const isRun = action === 'run';
  const isAttack1 = action === 'attack';
  const isAttack2 = action === 'attack2';
  const isJump = action === 'jump';
  const isFall = action === 'fall';
  const isHit = action === 'hit';
  const isDeath = action === 'death';

  // Idle hover / breath calculation
  const hoverY = isIdle ? (frame % 4 === 0 ? 0 : frame % 4 === 1 ? -1 : frame % 4 === 2 ? -2 : -1) : 0;
  const flamePulse = (frame % 3) * 0.5;

  // RUNNING ANIMATION
  if (isRun) {
    const runOffset = (frame % 4) - 2;
    const forwardLean = 12; // tilted forward
    return (
      <g transform={`translate(${runOffset}, 2) rotate(6 24 24)`}>
        {/* Trailing robe wisps */}
        <polygon points="12,38 18,34 14,44" fill={C.robeFold} />
        <polygon points="16,39 24,35 18,46" fill={C.robeBody} />
        {/* Main Robe in forward sprint */}
        <path d="M 20 22 L 32 24 L 28 42 L 14 40 Z" fill={C.robeBody} />
        <path d="M 22 24 L 30 25 L 26 40 L 16 38 Z" fill={C.hoodOuter} />
        {/* Gold Trim */}
        <line x1="14" y1="40" x2="28" y2="42" stroke={C.goldTrim} strokeWidth="1.5" />
        <line x1="26" y1="24" x2="22" y2="38" stroke={C.goldTrim} strokeWidth="1" />

        {/* Head & Hood */}
        <circle cx="28" cy="18" r="6" fill={C.hoodOuter} />
        <polygon points="23,17 33,17 29,12" fill={C.hoodOuter} />
        <circle cx="29" cy="19" r="3.5" fill={C.hoodInner} />
        <rect x="29" y="19" width="2" height="1" fill={C.goldAccent} />

        {/* Angled Staff */}
        <line x1="18" y1="36" x2="38" y2="12" stroke={C.woodStaff} strokeWidth="2.5" />
        {/* Staff Flame with Demonic Eye */}
        <circle cx="39" cy="11" r="5" fill={C.flameVoid} filter="url(#voidGlow)" />
        <circle cx="39" cy="11" r="3.5" fill={C.flameBright} />
        <circle cx="39" cy="11" r="1.5" fill={C.demonEye} />
      </g>
    );
  }

  // ATTACK 1 (VOID SKULL ERUPTION)
  if (isAttack1) {
    const isThrust = frame >= 3 && frame <= 6;
    const staffX = isThrust ? 36 : 28 - frame;
    const staffY = isThrust ? 18 : 22;

    return (
      <g>
        {/* Robe Body Braced */}
        <path d="M 16 24 L 28 24 L 30 42 L 12 42 Z" fill={C.robeBody} />
        <line x1="12" y1="42" x2="30" y2="42" stroke={C.goldTrim} strokeWidth="2" />
        <line x1="22" y1="24" x2="20" y2="42" stroke={C.goldTrim} strokeWidth="1" />

        {/* Hood */}
        <circle cx="22" cy="18" r="6" fill={C.hoodOuter} />
        <circle cx="23" cy="19" r="3.5" fill={C.hoodInner} />
        <rect x="23" y="19" width="2" height="1" fill={C.goldAccent} />

        {/* Arm Thrusting Staff */}
        <line x1="22" y1="22" x2={staffX - 4} y2={staffY + 4} stroke={C.flesh} strokeWidth="2" />

        {/* Staff Head & Flaming Skull Spirit */}
        <line x1={staffX - 8} y1={staffY + 14} x2={staffX + 4} y2={staffY - 8} stroke={C.woodStaff} strokeWidth="2.5" />
        <circle cx={staffX + 5} cy={staffY - 9} r={5.5 + flamePulse} fill={C.flameVoid} />
        <circle cx={staffX + 5} cy={staffY - 9} r="3.5" fill={C.flameBright} />
        <circle cx={staffX + 5} cy={staffY - 9} r="1.5" fill={C.demonEye} />

        {/* Skull Demon Projectile bursting from staff (frames 3-7) */}
        {isThrust && (
          <g transform={`translate(${staffX + (frame - 3) * 4}, ${staffY - 12})`}>
            <ellipse cx="6" cy="0" rx="5" ry="4" fill={C.flameVoid} />
            <circle cx="5" cy="-1" r="1" fill={C.demonEye} />
            <circle cx="7" cy="-1" r="1" fill={C.demonEye} />
            <path d="M 3,2 Q 6,4 9,2" stroke={C.demonEye} strokeWidth="0.8" fill="none" />
          </g>
        )}
      </g>
    );
  }

  // ATTACK 2 (SLAM SHOCKWAVE)
  if (isAttack2) {
    const isUp = frame < 4;
    const staffAngle = isUp ? -30 : 60;
    const bodyY = isUp ? -4 : 2;

    return (
      <g transform={`translate(0, ${bodyY})`}>
        {/* Robe */}
        <path d="M 16 24 L 28 24 L 32 42 L 12 42 Z" fill={C.robeBody} />
        <line x1="12" y1="42" x2="32" y2="42" stroke={C.goldTrim} strokeWidth="2" />

        {/* Hood looking up/down */}
        <circle cx="22" cy={isUp ? 15 : 20} r="6" fill={C.hoodOuter} />
        <circle cx="22" cy={isUp ? 15 : 21} r="3.5" fill={C.hoodInner} />

        {/* Staff Raised Above Head / Slammed Down */}
        {isUp ? (
          // Staff high in both hands
          <g>
            <line x1="20" y1="20" x2="26" y2="4" stroke={C.woodStaff} strokeWidth="3" />
            <circle cx="27" cy="3" r="8" fill={C.flameVoid} opacity="0.9" />
            <circle cx="27" cy="3" r="5" fill={C.flameBright} />
            <circle cx="27" cy="3" r="2" fill={C.demonEye} />
          </g>
        ) : (
          // Staff slammed into the earth
          <g>
            <line x1="24" y1="22" x2="36" y2="38" stroke={C.woodStaff} strokeWidth="3" />
            <circle cx="36" cy="38" r="9" fill={C.flameVoid} opacity="0.8" />
            <circle cx="36" cy="38" r="5" fill={C.flameBright} />
            {/* Ground Impact Arc */}
            <path d="M 28 42 Q 36 34 44 42" stroke={C.flameBright} strokeWidth="2.5" fill="none" />
          </g>
        )}
      </g>
    );
  }

  // TAKE HIT (RECOIL)
  if (isHit) {
    const recoilX = -frame * 3;
    return (
      <g transform={`translate(${recoilX}, 0)`}>
        {/* Robe arched back */}
        <path d="M 14 26 L 24 24 L 26 42 L 10 42 Z" fill={C.robeBody} />
        <line x1="10" y1="42" x2="26" y2="42" stroke={C.goldTrim} strokeWidth="2" />

        {/* Hood thrown back */}
        <circle cx="16" cy="18" r="6" fill={C.hoodOuter} />
        <circle cx="17" cy="19" r="3.5" fill={C.hoodInner} />

        {/* Staff slipping backwards */}
        <line x1="20" y1="36" x2="28" y2="16" stroke={C.woodStaff} strokeWidth="2" />
        <circle cx="28" cy="15" r="4" fill={C.flameVoid} />
      </g>
    );
  }

  // DEATH (COLLAPSE & DISINTEGRATION)
  if (isDeath) {
    const collapseY = Math.min(frame * 3, 14);
    const opacity = 1 - frame * 0.12;

    return (
      <g transform={`translate(0, ${collapseY})`} opacity={opacity}>
        {/* Red Lightning Shatter on Staff (Frame 1-2) */}
        {frame < 3 && (
          <path d="M 28,10 L 25,14 L 29,18 L 26,22" stroke={C.demonEye} strokeWidth="1.5" fill="none" />
        )}

        {/* Dropped Staff fallen flat on the stone */}
        <line x1="18" y1="41" x2="38" y2="41" stroke={C.woodStaff} strokeWidth="2" />
        <circle cx="39" cy="41" r="2.5" fill={C.flameVoid} opacity={1 - frame * 0.2} />

        {/* Collapsed Hooded Robes */}
        {frame < 4 ? (
          // Kneeling down
          <g>
            <path d="M 14 30 L 26 30 L 28 42 L 10 42 Z" fill={C.robeBody} />
            <circle cx="18" cy="26" r="5" fill={C.hoodOuter} />
          </g>
        ) : (
          // Flat on the ground
          <g>
            <ellipse cx="18" cy="41" rx="10" ry="3" fill={C.robeBody} />
            <circle cx="10" cy="40" r="3" fill={C.hoodOuter} />
          </g>
        )}
      </g>
    );
  }

  // JUMP & FALL
  if (isJump || isFall) {
    const airY = isJump ? -6 : -2;
    return (
      <g transform={`translate(0, ${airY})`}>
        {/* Billowing robes */}
        <path d="M 16 20 L 28 20 L 32 38 L 12 38 Z" fill={C.robeBody} />
        <line x1="12" y1="38" x2="32" y2="38" stroke={C.goldTrim} strokeWidth="2" />

        {/* Hood */}
        <circle cx="22" cy="14" r="6" fill={C.hoodOuter} />
        <circle cx="23" cy="15" r="3.5" fill={C.hoodInner} />
        <rect x="23" y="15" width="2" height="1" fill={C.goldAccent} />

        {/* Staff floating beside */}
        <line x1="28" y1="38" x2="32" y2="10" stroke={C.woodStaff} strokeWidth="2.5" />
        <circle cx="33" cy="9" r="5.5" fill={C.flameVoid} />
        <circle cx="33" cy="9" r="3.5" fill={C.flameBright} />
        <circle cx="33" cy="9" r="1.5" fill={C.demonEye} />
      </g>
    );
  }

  // DEFAULT: IDLE (8 FRAMES UNDULATING VOID FLAME & BREATHING)
  return (
    <g transform={`translate(0, ${hoverY})`}>
      {/* Robe Shadows & Main Cloak */}
      <path
        d="M 16 22 L 28 22 L 30 42 L 14 42 Z"
        fill={C.robeBody}
      />
      <path
        d="M 18 22 L 26 22 L 27 40 L 16 40 Z"
        fill={C.hoodOuter}
      />

      {/* Ornate Gold Trim and Runes */}
      <line x1="14" y1="42" x2="30" y2="42" stroke={C.goldTrim} strokeWidth="1.8" />
      <line x1="22" y1="22" x2="21" y2="40" stroke={C.goldTrim} strokeWidth="1" />
      {/* Chest Sigil */}
      <polygon points="22,25 24,28 20,28" fill={C.goldAccent} />

      {/* Hood & Deep Cowl Shadow */}
      <circle cx="22" cy="16" r="6.5" fill={C.hoodOuter} />
      <polygon points="16,16 28,16 22,9" fill={C.hoodOuter} />
      <circle cx="22" cy="17" r="4" fill={C.hoodInner} />
      {/* Eyes Glowing under Hood */}
      <rect x="20" y="17" width="2" height="1" fill={C.goldAccent} />
      <rect x="23" y="17" width="2" height="1" fill={C.goldAccent} />

      {/* Staff Hand Grip */}
      <circle cx="29" cy="27" r="2" fill={C.flesh} />

      {/* Ancient Eye of the Void Staff */}
      <g>
        {/* Shaft */}
        <line x1="29" y1="42" x2="30" y2="12" stroke={C.woodStaff} strokeWidth="2.5" />
        <rect x="28" y="12" width="4" height="2" fill={C.staffCap} />

        {/* Crescent Golden Eye Socket Headpiece */}
        <path
          d="M 27 12 C 26 6, 34 6, 33 12"
          stroke={C.goldTrim}
          strokeWidth="1.5"
          fill="none"
        />

        {/* Void Spectral Flame with 8-frame undulation */}
        <circle
          cx="30"
          cy={10 + (frame % 2 === 0 ? 0 : 0.5)}
          r={5.5 + flamePulse}
          fill="url(#voidStaffFlame)"
          filter="url(#voidGlow)"
        />
        <circle
          cx="30"
          cy={10}
          r={3.5 + flamePulse * 0.5}
          fill={C.flameBright}
        />
        <circle cx="30" cy="10" r="1.5" fill={C.flameCore} />

        {/* Glowing Red Demonic Eye embedded in Flame */}
        <ellipse cx="30" cy="10" rx="1.5" ry="2.2" fill="url(#eyeOfVoid)" />
        <circle cx="30" cy="10" r="0.6" fill="#FFFFFF" />

        {/* Emitting purple ember particles */}
        <circle
          cx={28 + (frame % 4)}
          cy={4 - (frame % 3)}
          r="0.8"
          fill={C.flameBright}
          opacity={0.8}
        />
      </g>
    </g>
  );
}
