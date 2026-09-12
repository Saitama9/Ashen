import React, { useState, useEffect, useRef } from 'react';
import { InventoryItem, PlayerClass, SpriteAction } from '../../types';
import { soundFx } from '../../utils/audio';
import { GSAPWizardSprite } from './GSAPWizardSprite';

interface PixelCharacterProps {
  playerClass?: PlayerClass;
  action?: SpriteAction;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  onActionComplete?: () => void;
  interactive?: boolean;
  className?: string;
  customPngs?: Partial<Record<string, string>>;
  equippedItems?: InventoryItem[];
}

export function PixelCharacter({
  playerClass = 'knight',
  action = 'idle',
  size = 'md',
  onActionComplete,
  interactive = true,
  className = '',
  customPngs,
  equippedItems = [],
}: PixelCharacterProps) {
  // Use GSAP Sprite engine for Sorcerer (Wizard)
  if (playerClass === 'sorcerer') {
    return (
      <GSAPWizardSprite
        action={action}
        size={size}
        onActionComplete={onActionComplete}
        interactive={interactive}
        className={className}
        customPngs={customPngs}
        equippedItems={equippedItems}
      />
    );
  }

  const [frame, setFrame] = useState(0);
  const [currentAction, setCurrentAction] = useState<SpriteAction>(action);
  const frameTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external action changes
  useEffect(() => {
    setCurrentAction(action);
    setFrame(0);
  }, [action]);

  // Frame animation loop
  useEffect(() => {
    if (frameTimerRef.current) clearInterval(frameTimerRef.current);

    let maxFrames = 4;
    let speed = 180; // ms per frame

    if (currentAction === 'idle') {
      maxFrames = 4;
      speed = 220;
    } else if (currentAction === 'run') {
      maxFrames = 6;
      speed = 110;
    } else if (currentAction === 'attack') {
      maxFrames = 6;
      speed = 90;
    } else if (currentAction === 'roll') {
      maxFrames = 6;
      speed = 85;
    } else if (currentAction === 'victory') {
      maxFrames = 4;
      speed = 250;
    } else if (currentAction === 'hit') {
      maxFrames = 3;
      speed = 120;
    }

    frameTimerRef.current = setInterval(() => {
      setFrame((prev) => {
        const next = prev + 1;
        if (next >= maxFrames) {
          // If non-looping action, return to idle
          if (currentAction !== 'idle' && currentAction !== 'run') {
            setTimeout(() => {
              setCurrentAction('idle');
              onActionComplete?.();
            }, 50);
            return 0;
          }
          return 0;
        }
        return next;
      });
    }, speed);

    return () => {
      if (frameTimerRef.current) clearInterval(frameTimerRef.current);
    };
  }, [currentAction, onActionComplete]);

  const handleClick = () => {
    if (!interactive) return;
    if (currentAction === 'idle') {
      triggerAction('attack');
    } else if (currentAction === 'attack') {
      triggerAction('roll');
    }
  };

  const triggerAction = (act: SpriteAction) => {
    setCurrentAction(act);
    setFrame(0);
    if (act === 'attack') {
      if (playerClass === 'knight') soundFx.playSwordSlash();
      else if (playerClass === 'ronin') soundFx.playKatanaSlash();
      else soundFx.playSwordSlash();
    } else if (act === 'roll') {
      soundFx.playDodgeRoll();
    }
  };

  // Dimensions
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
    hero: 'w-48 h-48 md:w-60 md:h-60',
  };

  return (
    <div
      onClick={handleClick}
      className={`relative select-none flex items-center justify-center ${sizeMap[size]} ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      title={interactive ? 'Click to attack or roll!' : undefined}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Dynamic Action Visual Sprite in Pixel-Perfect 32x32 Grid */}
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] filter transition-transform group-hover:scale-105"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Ground shadow */}
        <ellipse cx="16" cy="29" rx={currentAction === 'roll' ? '6' : '7'} ry="2" fill="#040607" opacity="0.75" />

        {/* ======================= ASHEN KNIGHT ======================= */}
        {playerClass === 'knight' && (
          <KnightSprite action={currentAction} frame={frame} />
        )}

        {/* ======================= CRIMSON RONIN ======================= */}
        {playerClass === 'ronin' && (
          <RoninSprite action={currentAction} frame={frame} />
        )}

        {/* ======================= ASHEN ROGUE ======================= */}
        {playerClass === 'rogue' && (
          <RogueSprite action={currentAction} frame={frame} />
        )}
      </svg>

      {/* EQUIPPED INVENTORY ITEMS VISUAL ATTACHMENTS (for Knight, Ronin, Rogue) */}
      {equippedItems && equippedItems.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Traveler's Cloak */}
          {equippedItems.some((i) => i.id === 'item-1' || i.iconType === 'cloak') && (
            <div className="absolute left-1 top-6 w-3 h-8 bg-[#3B2818]/80 border-l border-[#C99A3D]/60 rounded-xs" />
          )}
          {/* Iron Resolve Armor */}
          {equippedItems.some((i) => i.id === 'item-2' || i.iconType === 'armor') && (
            <div className="absolute left-[38%] top-[40%] w-3.5 h-3 border border-[#94A3B8] bg-[#334155]/85 rounded-xs" />
          )}
          {/* Scholar's Tome */}
          {equippedItems.some((i) => i.id === 'item-3' || i.iconType === 'tome') && (
            <div className="absolute -left-3 top-6 w-3.5 h-4.5 bg-[#1E1B4B] border border-[#818CF8] shadow-[0_0_8px_#818CF8] rounded-xs animate-bounce" />
          )}
          {/* Ember Lantern */}
          {equippedItems.some((i) => i.id === 'item-4' || i.iconType === 'lantern') && (
            <div className="absolute -right-1 bottom-4 w-3 h-4 bg-[#451A03] border border-[#F59E0B] shadow-[0_0_10px_#F59E0B] rounded-xs" />
          )}
          {/* Ring of Focus */}
          {equippedItems.some((i) => i.id === 'item-6' || i.iconType === 'ring') && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-6 h-1.5 rounded-full border border-[#FDE047] shadow-[0_0_8px_#FACC15] animate-pulse" />
          )}
          {/* Ancient Reliquary */}
          {equippedItems.some((i) => i.id === 'item-7' || i.type === 'relic') && (
            <div className="absolute -top-1 -right-2 w-2 h-2 bg-[#C084FC] rounded-full shadow-[0_0_10px_#A855F7] animate-spin" />
          )}
          {/* Sunlight Talisman */}
          {equippedItems.some((i) => i.id === 'item-8' || i.type === 'badge') && (
            <div className="absolute -inset-1 rounded-full border border-dashed border-[#F59E0B]/50 pointer-events-none animate-spin" style={{ animationDuration: '18s' }} />
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 1. ASHEN KNIGHT PIXEL RENDERING (Heavy Plate, Greatsword)
// ----------------------------------------------------
function KnightSprite({ action, frame }: { action: SpriteAction; frame: number }) {
  const isAttack = action === 'attack';
  const isRoll = action === 'roll';
  const isRun = action === 'run';
  const isVictory = action === 'victory';

  // Breathing offset
  const bobY = isRun ? (frame % 2 === 0 ? 0 : -1) : frame % 2 === 0 ? 0 : 1;

  if (isRoll) {
    // 6-step combat roll animation
    const rot = frame * 60;
    return (
      <g transform={`rotate(${rot} 16 20)`}>
        {/* Curled armor body ball */}
        <rect x="11" y="15" width="10" height="10" fill="#8E95A5" />
        <rect x="13" y="17" width="6" height="6" fill="#D3D6DE" />
        <rect x="10" y="18" width="12" height="3" fill="#B84025" />
        {/* Sword trailing sparks */}
        <rect x="8" y="13" width="3" height="3" fill="#C99A3D" />
      </g>
    );
  }

  return (
    <g transform={`translate(0, ${bobY})`}>
      {/* --- Greatsword --- */}
      {!isAttack && !isVictory && (
        // Sheathed or held at rest
        <g>
          {/* Blade on back / hip */}
          <rect x="8" y="9" width="2" height="14" fill="#D3D6DE" />
          <rect x="7" y="10" width="1" height="12" fill="#FFFFFF" />
          <rect x="7" y="8" width="4" height="2" fill="#C99A3D" />
          <rect x="8" y="6" width="2" height="2" fill="#4E5565" />
          <rect x="8" y="5" width="2" height="1" fill="#C99A3D" />
        </g>
      )}

      {/* --- Legs & Boots --- */}
      {isRun ? (
        // Stride frames
        frame % 2 === 0 ? (
          <g>
            <rect x="11" y="22" width="3" height="6" fill="#4E5565" />
            <rect x="10" y="27" width="4" height="2" fill="#2B303A" />
            <rect x="17" y="20" width="3" height="6" fill="#8E95A5" />
            <rect x="18" y="25" width="4" height="2" fill="#4E5565" />
          </g>
        ) : (
          <g>
            <rect x="12" y="20" width="3" height="6" fill="#8E95A5" />
            <rect x="13" y="25" width="4" height="2" fill="#4E5565" />
            <rect x="16" y="22" width="3" height="6" fill="#4E5565" />
            <rect x="15" y="27" width="4" height="2" fill="#2B303A" />
          </g>
        )
      ) : (
        // Idle legs
        <g>
          <rect x="12" y="22" width="3" height="6" fill="#4E5565" />
          <rect x="11" y="27" width="4" height="2" fill="#2B303A" />
          <rect x="17" y="22" width="3" height="6" fill="#4E5565" />
          <rect x="17" y="27" width="4" height="2" fill="#2B303A" />
        </g>
      )}

      {/* --- Torso & Breastplate --- */}
      <rect x="11" y="14" width="10" height="8" fill="#4E5565" />
      <rect x="12" y="14" width="8" height="7" fill="#8E95A5" />
      <rect x="13" y="15" width="6" height="5" fill="#D3D6DE" />
      {/* Belt */}
      <rect x="11" y="21" width="10" height="2" fill="#59452A" />
      <rect x="15" y="21" width="2" height="2" fill="#C99A3D" />

      {/* --- Red Knight Scarf / Mantle --- */}
      <rect x="10" y="12" width="12" height="3" fill="#B84025" />
      <rect x="9" y="14" width="3" height={frame % 2 === 0 ? 5 : 6} fill="#E0522D" />
      <rect x="9" y="19" width="2" height="2" fill="#8A2814" />

      {/* --- Great Helmet & Visor --- */}
      <rect x="12" y="5" width="8" height="8" fill="#4E5565" />
      <rect x="13" y="5" width="6" height="7" fill="#8E95A5" />
      <rect x="14" y="6" width="4" height="3" fill="#D3D6DE" />
      {/* Visor slit with fiery glow */}
      <rect x="15" y="8" width="5" height="1" fill="#0D1215" />
      <rect x="16" y="8" width="2" height="1" fill="#F0C75E" />

      {/* Helmet crest */}
      <rect x="14" y="4" width="3" height="1" fill="#B84025" />
      <rect x="15" y="3" width="2" height="1" fill="#E0522D" />

      {/* --- Left Arm / Shield or Hand --- */}
      <rect x="9" y="14" width="3" height="6" fill="#4E5565" />
      <rect x="9" y="19" width="3" height="3" fill="#8E95A5" />

      {/* --- Right Arm & Attack Swing / Victory --- */}
      {isAttack && (
        <g>
          {/* Frame 0-1: Windup, Frame 2-3: Slash swing, Frame 4-5: Followthrough */}
          {frame < 2 ? (
            // Windup overhead
            <g>
              <rect x="17" y="8" width="4" height="4" fill="#8E95A5" />
              <rect x="18" y="1" width="3" height="12" fill="#D3D6DE" />
              <rect x="19" y="1" width="1" height="11" fill="#FFFFFF" />
              <rect x="17" y="11" width="5" height="2" fill="#C99A3D" />
            </g>
          ) : frame < 4 ? (
            // Full Swing forward with blade light arc
            <g>
              {/* Crescent Arc Effect */}
              <path
                d="M 18 4 C 29 7, 31 19, 24 28"
                stroke="#72C7F0"
                strokeWidth="3"
                fill="none"
                opacity="0.9"
              />
              <path
                d="M 19 6 C 27 9, 29 18, 23 26"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Sword forward */}
              <rect x="20" y="16" width="10" height="3" fill="#D3D6DE" />
              <rect x="22" y="17" width="8" height="1" fill="#FFFFFF" />
              <rect x="18" y="15" width="2" height="5" fill="#C99A3D" />
              <rect x="16" y="16" width="3" height="3" fill="#8E95A5" />
            </g>
          ) : (
            // Recovery stance
            <g>
              <rect x="19" y="18" width="6" height="3" fill="#8E95A5" />
              <rect x="22" y="20" width="3" height="8" fill="#D3D6DE" />
              <rect x="21" y="19" width="4" height="2" fill="#C99A3D" />
            </g>
          )}
        </g>
      )}

      {isVictory && (
        <g>
          {/* Greatsword thrust into sky */}
          <rect x="16" y="7" width="3" height="5" fill="#8E95A5" />
          <rect x="17" y="0" width="3" height="10" fill="#D3D6DE" />
          <rect x="18" y="0" width="1" height="9" fill="#FFFFFF" />
          <rect x="16" y="8" width="5" height="2" fill="#C99A3D" />
          {/* Gleam spark */}
          <rect x="18" y="1" width="3" height="3" fill="#F0C75E" />
          <rect x="17" y="2" width="5" height="1" fill="#FFF" />
        </g>
      )}

      {!isAttack && !isVictory && (
        // Resting right arm
        <g>
          <rect x="20" y="14" width="3" height="6" fill="#4E5565" />
          <rect x="20" y="19" width="3" height="3" fill="#8E95A5" />
        </g>
      )}
    </g>
  );
}

// ----------------------------------------------------
// 2. CRIMSON RONIN PIXEL RENDERING (Kasa Hat, Red Scarf, Katana)
// ----------------------------------------------------
function RoninSprite({ action, frame }: { action: SpriteAction; frame: number }) {
  const isAttack = action === 'attack';
  const isRoll = action === 'roll';
  const isRun = action === 'run';
  const isVictory = action === 'victory';

  const bobY = isRun ? (frame % 2 === 0 ? 0 : -1) : frame % 2 === 0 ? 0 : 1;

  if (isRoll) {
    const rot = frame * 60;
    return (
      <g transform={`rotate(${rot} 16 20)`}>
        <rect x="10" y="14" width="12" height="12" fill="#1C151A" />
        <rect x="11" y="16" width="10" height="4" fill="#C8283E" />
        <rect x="8" y="17" width="16" height="2" fill="#F0F4FA" />
      </g>
    );
  }

  return (
    <g transform={`translate(0, ${bobY})`}>
      {/* --- Hakama (Dark Pleated Pants) & Tabi --- */}
      {isRun ? (
        frame % 2 === 0 ? (
          <g>
            <rect x="11" y="22" width="4" height="6" fill="#1C151A" />
            <rect x="10" y="27" width="4" height="2" fill="#D8D2C8" />
            <rect x="17" y="20" width="4" height="6" fill="#2C2229" />
            <rect x="18" y="25" width="4" height="2" fill="#D8D2C8" />
          </g>
        ) : (
          <g>
            <rect x="12" y="20" width="4" height="6" fill="#2C2229" />
            <rect x="13" y="25" width="4" height="2" fill="#D8D2C8" />
            <rect x="16" y="22" width="4" height="6" fill="#1C151A" />
            <rect x="15" y="27" width="4" height="2" fill="#D8D2C8" />
          </g>
        )
      ) : (
        <g>
          <rect x="11" y="22" width="5" height="6" fill="#1C151A" />
          <rect x="11" y="27" width="4" height="2" fill="#D8D2C8" />
          <rect x="16" y="22" width="5" height="6" fill="#2C2229" />
          <rect x="17" y="27" width="4" height="2" fill="#D8D2C8" />
        </g>
      )}

      {/* --- Gi / Kimono (Off-white silk) --- */}
      <rect x="12" y="14" width="8" height="8" fill="#D8D2C8" />
      <rect x="14" y="14" width="4" height="7" fill="#F0EBE1" />
      {/* Dark Obi Sash */}
      <rect x="11" y="20" width="10" height="2" fill="#1C151A" />
      <rect x="15" y="20" width="2" height="2" fill="#C8283E" />

      {/* --- Sheathed Katana on Hip --- */}
      {!isAttack && (
        <g>
          {/* Purple scabbard */}
          <rect x="7" y="19" width="7" height="2" fill="#4E2868" />
          {/* Gold Tsuba (guard) */}
          <rect x="13" y="18" width="2" height="4" fill="#C99A3D" />
          {/* Tsuka (hilt) wrapped with black cord */}
          <rect x="15" y="19" width="3" height="2" fill="#E7D8B5" />
          <rect x="16" y="19" width="1" height="2" fill="#1C151A" />
        </g>
      )}

      {/* --- Flowing Crimson Scarf (Dynamic Wind Animation) --- */}
      <rect x="11" y="12" width="10" height="3" fill="#C8283E" />
      <g>
        {/* Trailing scarf fluttering behind */}
        <rect x="6" y="13" width="6" height="3" fill="#E0384E" />
        <rect
          x={frame % 2 === 0 ? '3' : '2'}
          y={frame % 2 === 0 ? '14' : '15'}
          width="4"
          height="2"
          fill="#C8283E"
        />
        <rect
          x={frame % 2 === 0 ? '1' : '0'}
          y={frame % 2 === 0 ? '15' : '16'}
          width="3"
          height="2"
          fill="#8A1828"
        />
      </g>

      {/* --- Head & Face Shadow --- */}
      <rect x="14" y="8" width="4" height="5" fill="#E2BA96" />
      {/* Fierce gaze under shadow */}
      <rect x="15" y="10" width="2" height="1" fill="#201518" />

      {/* --- Broad Kasa Hat (Straw conical hat) --- */}
      <polygon points="16,3 27,9 5,9" fill="#3B2A1E" />
      <polygon points="16,4 25,8 7,8" fill="#5A4332" />
      <polygon points="16,5 23,8 9,8" fill="#84654D" />
      <rect x="14" y="3" width="4" height="2" fill="#2A1C12" />

      {/* --- Katana Iaido Slash Attack --- */}
      {isAttack && (
        <g>
          {frame < 2 ? (
            // Stance ready to draw
            <g>
              <rect x="10" y="18" width="8" height="2" fill="#4E2868" />
              <rect x="16" y="17" width="4" height="4" fill="#E2BA96" />
            </g>
          ) : frame < 4 ? (
            // Lightning Flash Blade Sweep
            <g>
              {/* Blade trail arc in cyan/white */}
              <path
                d="M 6 12 Q 22 8 30 18"
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 5 13 Q 22 9 29 19"
                stroke="#C8283E"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Katana blade extended */}
              <rect x="19" y="14" width="11" height="2" fill="#F0F4FA" />
              <rect x="18" y="13" width="2" height="4" fill="#C99A3D" />
              <rect x="16" y="14" width="3" height="2" fill="#1C151A" />
            </g>
          ) : (
            // Re-sheathing snap
            <g>
              <rect x="18" y="15" width="7" height="2" fill="#F0F4FA" />
              <rect x="16" y="14" width="3" height="3" fill="#E2BA96" />
              <rect x="24" y="14" width="2" height="2" fill="#FFFFFF" />
            </g>
          )}
        </g>
      )}

      {isVictory && (
        <g>
          {/* Blade pointing gracefully up */}
          <rect x="18" y="5" width="2" height="12" fill="#F0F4FA" />
          <rect x="17" y="16" width="4" height="2" fill="#C99A3D" />
          <rect x="17" y="17" width="3" height="3" fill="#E2BA96" />
        </g>
      )}
    </g>
  );
}

// ----------------------------------------------------
// 3. SHADOW SORCERER PIXEL RENDERING (Purple Hood, Void Staff)
// ----------------------------------------------------
function SorcererSprite({ action, frame }: { action: SpriteAction; frame: number }) {
  const isAttack = action === 'attack' || action === 'cast';
  const isRun = action === 'run';
  const isVictory = action === 'victory';

  // Floating hover motion
  const hoverY = frame % 2 === 0 ? -1 : 1;

  return (
    <g transform={`translate(0, ${hoverY})`}>
      {/* --- Flowing Shadow Robes --- */}
      <path
        d="M 11 15 L 21 15 L 24 28 L 8 28 Z"
        fill="#261638"
      />
      <path
        d="M 12 16 L 20 16 L 22 27 L 10 27 Z"
        fill="#392454"
      />
      {/* Gold Arcane Runes & Hem Trim */}
      <rect x="8" y="27" width="16" height="2" fill="#C99A3D" />
      <rect x="15" y="18" width="2" height="7" fill="#C99A3D" />

      {/* --- Deep Void Hood & Glowing Eyes --- */}
      <polygon points="16,4 23,12 9,12" fill="#261638" />
      <polygon points="16,5 21,11 11,11" fill="#140A1F" />
      {/* Inner cowl black abyss */}
      <rect x="12" y="9" width="8" height="4" fill="#0A0510" />
      {/* Burning purple/cyan eyes */}
      <rect x="13" y="10" width="2" height="1" fill="#B446D8" />
      <rect x="17" y="10" width="2" height="1" fill="#B446D8" />
      <rect x="14" y="10" width="1" height="1" fill="#FFFFFF" />
      <rect x="18" y="10" width="1" height="1" fill="#FFFFFF" />

      {/* --- Ancient Void Staff with Purple Flame --- */}
      <g>
        {/* Twisted black gnarled wood staff */}
        <rect x="22" y="7" width="2" height="21" fill="#150E1A" />
        <rect x="21" y="8" width="4" height="2" fill="#4B315E" />
        {/* Staff Headpiece: Crescent eye socket */}
        <path
          d="M 20 5 C 20 2, 26 2, 26 5 C 26 8, 20 8, 20 5"
          fill="#C99A3D"
        />
        {/* Floating Void Flame (pulsing with frame) */}
        <ellipse
          cx="23"
          cy={frame % 2 === 0 ? '3' : '4'}
          rx={frame % 2 === 0 ? '3' : '4'}
          ry="4"
          fill="#8D2AB8"
        />
        <ellipse
          cx="23"
          cy={frame % 2 === 0 ? '3' : '4'}
          rx="2"
          ry="2"
          fill="#E86BFF"
        />
        <rect
          x="22"
          y={frame % 2 === 0 ? '2' : '3'}
          width="2"
          height="2"
          fill="#FFFFFF"
        />
      </g>

      {/* --- Spell Attack Animation --- */}
      {isAttack && (
        <g>
          {/* Purple void projectile charging / firing forward */}
          <ellipse
            cx={24 + frame * 3}
            cy="12"
            rx="4"
            ry="4"
            fill="#B446D8"
            opacity="0.9"
          />
          <ellipse
            cx={24 + frame * 3}
            cy="12"
            rx="2"
            ry="2"
            fill="#FFFFFF"
          />
          {/* Trailing dark energy wisps */}
          <circle cx={20 + frame * 2} cy="10" r="1.5" fill="#6A1B8A" />
          <circle cx={18 + frame * 2} cy="14" r="1.5" fill="#6A1B8A" />
        </g>
      )}

      {isVictory && (
        <g>
          {/* Dual staff surge */}
          <circle cx="23" cy="2" r="5" fill="#B446D8" opacity="0.6" />
          <circle cx="23" cy="2" r="3" fill="#FFFFFF" />
        </g>
      )}
    </g>
  );
}

// ----------------------------------------------------
// 4. ASHEN ROGUE / HUNTER PIXEL RENDERING (Brown Hair, Cloak, Daggers)
// ----------------------------------------------------
function RogueSprite({ action, frame }: { action: SpriteAction; frame: number }) {
  const isAttack = action === 'attack';
  const isRoll = action === 'roll';
  const isRun = action === 'run';
  const isVictory = action === 'victory';

  const bobY = isRun ? (frame % 2 === 0 ? 0 : -1) : frame % 2 === 0 ? 0 : 1;

  if (isRoll) {
    const rot = frame * 60;
    return (
      <g transform={`rotate(${rot} 16 20)`}>
        <rect x="11" y="15" width="10" height="10" fill="#3D2B3F" />
        <rect x="12" y="16" width="8" height="6" fill="#6F4D38" />
        <rect x="9" y="18" width="14" height="2" fill="#D3D6DE" />
      </g>
    );
  }

  return (
    <g transform={`translate(0, ${bobY})`}>
      {/* --- Agile Leather Greaves & Boots --- */}
      {isRun ? (
        frame % 2 === 0 ? (
          <g>
            <rect x="11" y="21" width="3" height="7" fill="#4B3322" />
            <rect x="10" y="27" width="4" height="2" fill="#25180E" />
            <rect x="17" y="19" width="3" height="7" fill="#755034" />
            <rect x="18" y="25" width="4" height="2" fill="#25180E" />
          </g>
        ) : (
          <g>
            <rect x="12" y="19" width="3" height="7" fill="#755034" />
            <rect x="13" y="25" width="4" height="2" fill="#25180E" />
            <rect x="16" y="21" width="3" height="7" fill="#4B3322" />
            <rect x="15" y="27" width="4" height="2" fill="#25180E" />
          </g>
        )
      ) : (
        <g>
          <rect x="12" y="22" width="3" height="6" fill="#4B3322" />
          <rect x="11" y="27" width="4" height="2" fill="#25180E" />
          <rect x="17" y="22" width="3" height="6" fill="#4B3322" />
          <rect x="17" y="27" width="4" height="2" fill="#25180E" />
        </g>
      )}

      {/* --- Violet Cloak & Leather Tunic --- */}
      <rect x="11" y="14" width="10" height="8" fill="#3D2B3F" />
      <rect x="12" y="14" width="8" height="7" fill="#573D5A" />
      <rect x="11" y="20" width="10" height="2" fill="#C99A3D" />

      {/* --- Flowing Brown Hair (From Sprite Sheet) --- */}
      <rect x="12" y="6" width="8" height="7" fill="#6F4D38" />
      <rect x="10" y="8" width="4" height="8" fill="#523928" />
      <rect x="10" y="14" width={frame % 2 === 0 ? 3 : 2} height="4" fill="#3A271B" />

      {/* --- Face & Keen Blue Eyes --- */}
      <rect x="14" y="8" width="5" height="5" fill="#ECC3A0" />
      <rect x="16" y="9" width="2" height="1" fill="#4CA7D8" />
      <rect x="17" y="9" width="1" height="1" fill="#FFFFFF" />

      {/* --- Twin Daggers --- */}
      {!isAttack && (
        <g>
          <rect x="9" y="17" width="2" height="5" fill="#D3D6DE" />
          <rect x="8" y="17" width="4" height="1" fill="#C99A3D" />
          <rect x="21" y="17" width="2" height="5" fill="#D3D6DE" />
          <rect x="20" y="17" width="4" height="1" fill="#C99A3D" />
        </g>
      )}

      {/* --- Dagger Cross Slash Attack --- */}
      {isAttack && (
        <g>
          {frame < 3 ? (
            <g>
              {/* Dual blade thrust */}
              <rect x="19" y="14" width="8" height="2" fill="#FFFFFF" />
              <rect x="20" y="18" width="7" height="2" fill="#D3D6DE" />
              {/* Swift blade lines */}
              <line x1="20" y1="12" x2="30" y2="16" stroke="#72C7F0" strokeWidth="1.5" />
              <line x1="20" y1="20" x2="29" y2="16" stroke="#72C7F0" strokeWidth="1.5" />
            </g>
          ) : (
            <g>
              <rect x="18" y="16" width="6" height="2" fill="#D3D6DE" />
            </g>
          )}
        </g>
      )}

      {isVictory && (
        <g>
          <rect x="10" y="6" width="2" height="6" fill="#FFFFFF" />
          <rect x="20" y="6" width="2" height="6" fill="#FFFFFF" />
        </g>
      )}
    </g>
  );
}
