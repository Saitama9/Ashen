import React from 'react';
import { DailyBoss } from '../../types';
import { RPGCard } from './RPGCard';
import { Skull, Trophy, Flame } from 'lucide-react';

interface DailyBossWidgetProps {
  boss: DailyBoss;
  onAttackClick?: () => void;
}

export const DailyBossWidget: React.FC<DailyBossWidgetProps> = ({ boss }) => {
  const hpPercent = Math.max(0, Math.min(100, (boss.currentHp / boss.maxHp) * 100));

  return (
    <RPGCard className="p-3.5 sm:p-4 bg-gradient-to-r from-[#1E1116]/95 via-[#14181B]/95 to-[#0E1215]/95 border-[#8C3A2B]/40 shadow-[0_8px_28px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(224,82,45,0.15)] relative overflow-hidden group">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#E0522D]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2D161A] to-[#170E12] border border-[#B84025]/50 flex items-center justify-center text-[#E0522D] shadow-[0_0_12px_rgba(224,82,45,0.3)]">
            <Skull className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs sm:text-sm text-[#E7D8B5] tracking-wide">
              {boss.name}
            </h4>
            <span className="font-serif italic text-[11px] text-[#A99D83] leading-none">
              {boss.title}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border ${
              boss.defeated
                ? 'text-[#7ACB83] bg-[#143524]/60 border-[#62A96B]/40'
                : 'text-[#FCA5A5] bg-[#261010]/60 border-[#991B1B]/40'
            }`}
          >
            {boss.defeated ? 'DEFEATED' : `${boss.currentHp.toLocaleString()} / ${boss.maxHp.toLocaleString()} HP`}
          </span>
        </div>
      </div>

      {/* Smooth Boss Health Bar */}
      <div className="relative h-3 bg-[#080B0D]/90 border border-[#8C6F3D]/25 p-0.5 rounded-full overflow-hidden shadow-inner my-2">
        <div
          className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${
            boss.defeated
              ? 'bg-gradient-to-r from-[#24573D] to-[#62A96B] shadow-[0_0_8px_rgba(98,169,107,0.5)]'
              : 'bg-gradient-to-r from-[#8F2718] via-[#B84025] to-[#E0522D] shadow-[0_0_8px_rgba(224,82,45,0.5)]'
          }`}
          style={{ width: `${hpPercent}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] relative z-10 pt-1">
        <span className="font-serif text-[#A99D83] italic flex items-center gap-1">
          {boss.defeated ? (
            <>
              <Trophy className="w-3 h-3 text-[#F0C75E]" />
              <span>The trial is conquered. The kingdom is safe for today.</span>
            </>
          ) : (
            <>
              <Flame className="w-3 h-3 text-[#E0522D]" />
              <span>Complete quests to strike the beast with your weapon.</span>
            </>
          )}
        </span>
        {boss.defeated && (
          <span className="font-mono text-[#F0C75E] font-bold bg-[#1A1610] px-2 py-0.5 rounded-md border border-[#C99A3D]/40 shadow-sm">
            +150 GOLD REWARD
          </span>
        )}
      </div>
    </RPGCard>
  );
};
