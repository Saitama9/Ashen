import React, { useEffect, useRef } from 'react';
import { PixelButton } from '../primitives/PixelButton';
import { RPGCard } from '../primitives/RPGCard';
import { IntelligenceIcon, VitalityIcon, StrengthIcon, FocusIcon } from '../icons/PixelIcons';
import { StatType, PlayerClass } from '../../types';
import { PixelCharacter } from '../pixel/PixelCharacter';
import { soundFx } from '../../utils/audio';
import { triggerTriumphantBurst } from '../../utils/animations';
import gsap from 'gsap';

interface LevelUpModalProps {
  prevLevel: number;
  newLevel: number;
  playerClass?: PlayerClass;
  statIncreases?: { stat: StatType | string; from: number; to: number }[];
  onContinue: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  prevLevel = 12,
  newLevel = 13,
  playerClass = 'knight' as PlayerClass,
  statIncreases = [
    { stat: 'intelligence', from: 14, to: 15 },
    { stat: 'vitality', from: 10, to: 11 },
  ],
  onContinue,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fire triumphant celebratory burst
    triggerTriumphantBurst();

    // GSAP modal entrance animation
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)' }
      );
    }

    // Rotating celestial light rays
    if (raysRef.current) {
      gsap.to(raysRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      });
    }
  }, []);

  const getStatDetails = (stat: string) => {
    switch (stat) {
      case 'strength':
        return { label: 'Strength', icon: <StrengthIcon size={16} color="#D94B38" /> };
      case 'intelligence':
        return { label: 'Intellect', icon: <IntelligenceIcon size={16} color="#4CA7D8" /> };
      case 'vitality':
        return { label: 'Vitality', icon: <VitalityIcon size={16} color="#62A96B" /> };
      case 'focus':
        return { label: 'Focus', icon: <FocusIcon size={16} color="#D5A441" /> };
      default:
        return { label: 'Intellect', icon: <IntelligenceIcon size={16} color="#4CA7D8" /> };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Background Rotating Sunburst Rays */}
      <div
        ref={raysRef}
        className="absolute w-[500px] h-[500px] pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'conic-gradient(from 0deg, transparent 0deg 15deg, #F0C75E 15deg 30deg, transparent 30deg 45deg, #F0C75E 45deg 60deg, transparent 60deg 75deg, #F0C75E 75deg 90deg, transparent 90deg 105deg, #F0C75E 105deg 120deg, transparent 120deg 135deg, #F0C75E 135deg 150deg, transparent 150deg 165deg, #F0C75E 165deg 180deg, transparent 180deg 195deg, #F0C75E 195deg 210deg, transparent 210deg 225deg, #F0C75E 225deg 240deg, transparent 240deg 255deg, #F0C75E 255deg 270deg, transparent 270deg 285deg, #F0C75E 285deg 300deg, transparent 300deg 315deg, #F0C75E 315deg 330deg, transparent 330deg 345deg, #F0C75E 345deg 360deg)',
        }}
      />

      <div ref={containerRef} className="w-full max-w-sm my-auto space-y-4 text-center relative z-10">
        {/* Level Up Banner Text */}
        <div>
          <h1 className="font-display font-black text-2xl tracking-[0.25em] text-[#F0C75E] drop-shadow-[0_0_16px_rgba(240,199,94,0.6)]">
            LEVEL UP
          </h1>
          <p className="font-display text-lg tracking-widest text-[#E7D8B5] mt-1 font-bold">
            LEVEL {prevLevel} → {newLevel}
          </p>
        </div>

        {/* Triumphant Character Victory Pose */}
        <div className="flex justify-center py-2">
          <div className="p-3 bg-[#0D1215] border-2 border-[#C99A3D] shadow-[0_0_20px_rgba(201,154,61,0.25)]">
            <PixelCharacter
              playerClass={playerClass}
              action="victory"
              size="lg"
              interactive={false}
            />
          </div>
        </div>

        {/* Stat Increase Box */}
        <RPGCard variant="highlight" className="p-4 space-y-2.5">
          {statIncreases.map((item, idx) => {
            const details = getStatDetails(item.stat);
            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {details.icon}
                  <span className="font-display font-semibold text-[#E7D8B5] tracking-wider">
                    {details.label}
                  </span>
                </div>
                <div className="font-pixel text-xs text-[#F0C75E] tracking-tight">
                  {item.from} → {item.to}
                </div>
              </div>
            );
          })}
        </RPGCard>

        {/* Atmospheric Quote */}
        <p className="font-body italic text-xs text-[#A99D83] px-4">
          “The flame burns hotter in the vessel forged through devotion.”
        </p>

        {/* Continue Button */}
        <div className="pt-2">
          <PixelButton
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => {
              soundFx.playClick();
              onContinue();
            }}
          >
            Continue Journey
          </PixelButton>
        </div>
      </div>
    </div>
  );
};
