import React, { useState, useMemo } from 'react';
import { PlayerClass, CharacterStats } from '../../types';
import { PLAYER_CLASSES } from '../../utils/classes';
import { soundFx } from '../../utils/audio';
import { BellIcon } from '../icons/PixelIcons';
import {
  Sparkles,
  ChevronRight,
  X,
  Flame,
  Coins,
  Sun,
  Moon,
  Sunrise,
  ScrollText,
  Lock,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface CharacterGreetingHeaderProps {
  playerClass: PlayerClass;
  onSelectClass: (cls: PlayerClass) => void;
  level: number;
  gold: number;
  streakDays: number;
  stats: CharacterStats;
  unlockedClasses?: PlayerClass[];
}

export const CharacterGreetingHeader: React.FC<CharacterGreetingHeaderProps> = ({
  playerClass,
  onSelectClass,
  level,
  gold,
  streakDays,
  stats,
  unlockedClasses = ['sorcerer'],
}) => {
  const [showCodex, setShowCodex] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Time of day detection (pure Lucide icons, no emojis)
  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: 'Good Morning,', Icon: Sunrise, phase: 'Dawn Watch' };
    }
    if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon,', Icon: Sun, phase: 'Midday Solstice' };
    }
    if (hour >= 17 && hour < 22) {
      return { text: 'Good Evening,', Icon: Moon, phase: 'Twilight Vigil' };
    }
    return { text: 'Good Evening,', Icon: Moon, phase: 'Midnight Eclipse' };
  }, []);

  const classDef = PLAYER_CLASSES[playerClass] || PLAYER_CLASSES.sorcerer;

  // Class theme colors
  const themeColors = useMemo(() => {
    switch (playerClass) {
      case 'sorcerer':
        return {
          glow: 'from-[#7C3AED]/25 via-[#4C1D95]/15 to-transparent',
          border: 'border-[#7C3AED]/60 hover:border-[#C084FC]',
          badgeBg: 'bg-[#1D1129]',
          badgeText: 'text-[#C4B5FD]',
          badgeBorder: 'border-[#6D28D9]',
          accent: '#A78BFA',
          quoteBg: 'bg-gradient-to-r from-[#170E24]/95 via-[#100B1A]/95 to-[#170E24]/95',
          quoteBorder: 'border-[#7C3AED]/50 hover:border-[#C084FC]',
          quoteGlow: 'shadow-[0_0_24px_rgba(124,58,237,0.2)]',
        };
      case 'ronin':
        return {
          glow: 'from-[#DC2626]/25 via-[#7F1D1D]/15 to-transparent',
          border: 'border-[#DC2626]/60 hover:border-[#F87171]',
          badgeBg: 'bg-[#261010]',
          badgeText: 'text-[#FCA5A5]',
          badgeBorder: 'border-[#991B1B]',
          accent: '#F87171',
          quoteBg: 'bg-gradient-to-r from-[#200D0D]/95 via-[#140808]/95 to-[#200D0D]/95',
          quoteBorder: 'border-[#DC2626]/50 hover:border-[#F87171]',
          quoteGlow: 'shadow-[0_0_24px_rgba(220,38,38,0.2)]',
        };
      case 'rogue':
        return {
          glow: 'from-[#059669]/25 via-[#064E3B]/15 to-transparent',
          border: 'border-[#059669]/60 hover:border-[#34D399]',
          badgeBg: 'bg-[#0B1E17]',
          badgeText: 'text-[#6EE7B7]',
          badgeBorder: 'border-[#047857]',
          accent: '#34D399',
          quoteBg: 'bg-gradient-to-r from-[#0C1A14]/95 via-[#08120E]/95 to-[#0C1A14]/95',
          quoteBorder: 'border-[#059669]/50 hover:border-[#34D399]',
          quoteGlow: 'shadow-[0_0_24px_rgba(5,150,105,0.2)]',
        };
      case 'knight':
      default:
        return {
          glow: 'from-[#D97706]/25 via-[#78350F]/15 to-transparent',
          border: 'border-[#D97706]/60 hover:border-[#FBBF24]',
          badgeBg: 'bg-[#21170A]',
          badgeText: 'text-[#FDE68A]',
          badgeBorder: 'border-[#B45309]',
          accent: '#FBBF24',
          quoteBg: 'bg-gradient-to-r from-[#1C1408]/95 via-[#120D05]/95 to-[#1C1408]/90',
          quoteBorder: 'border-[#D97706]/50 hover:border-[#FBBF24]',
          quoteGlow: 'shadow-[0_0_24px_rgba(217,119,6,0.2)]',
        };
    }
  }, [playerClass]);

  const handleQuoteClick = () => {
    soundFx.playMagicCast();
    setShowCodex(true);
  };

  const TimeIcon = timeGreeting.Icon;

  return (
    <div id="character-greeting-header" className="w-full relative select-none">
      {/* Background ambient atmospheric lighting */}
      <div
        className={`absolute -inset-2 bg-gradient-to-b ${themeColors.glow} blur-xl pointer-events-none -z-10 rounded-2xl opacity-75`}
      />

      {/* TOP ROW: Time Phase, Gold, Streak & Notifications */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#8C6F3D]/20 text-xs">
        {/* Left: Time Phase & Celestial Status */}
        <div className="flex items-center gap-2 text-[#A99D83] font-display">
          <TimeIcon className="w-3.5 h-3.5 text-[#F0C75E]" />
          <span className="text-[11px] sm:text-xs tracking-wider uppercase font-medium text-[#C8BEA8]">
            {timeGreeting.phase}
          </span>
          <span className="text-[#8C6F3D]">•</span>
          <span className="font-mono text-[10px] text-[#F0C75E] uppercase font-bold">
            Cycle XII
          </span>
        </div>

        {/* Right: Gold, Streak & Notifications */}
        <div className="flex items-center gap-2">
          {/* Day Streak */}
          <div
            className="px-3 py-1 bg-gradient-to-r from-[#241410] to-[#141A1E] border border-[#B84025]/40 flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.4)] rounded-full"
            title="Consecutive Day Streak"
          >
            <Flame className="w-3.5 h-3.5 text-[#E0522D]" />
            <span className="font-mono text-xs text-[#E0522D] font-bold">
              {streakDays}d
            </span>
          </div>

          {/* Gold Counter */}
          <div
            className="px-3 py-1 bg-gradient-to-r from-[#1A1610] to-[#141A1E] border border-[#C99A3D]/40 flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.4)] rounded-full"
            title="Soul Coins / Gold"
          >
            <Coins className="w-3.5 h-3.5 text-[#F0C75E]" />
            <span className="font-mono text-xs text-[#F0C75E] font-bold">
              {gold.toLocaleString()}
            </span>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playClick();
                setNotificationsOpen(!notificationsOpen);
              }}
              className="p-1.5 bg-[#141A1E] border border-[#8C6F3D]/30 hover:border-[#C99A3D] transition-colors rounded-lg shadow-sm"
              title="Notifications"
            >
              <BellIcon size={16} color="#E7D8B5" hasUnread />
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 top-10 w-72 z-50 bg-[#0E1317]/95 backdrop-blur-xl border border-[#C99A3D]/60 p-3.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-[#8C6F3D]/25 pb-2 mb-2.5">
                  <span className="font-display text-xs text-[#F0C75E] uppercase tracking-wider font-bold">
                    Chronicles & Signals
                  </span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[#6F695C] hover:text-[#E7D8B5]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-[#141A1E] rounded-lg border-l-2 border-[#E0522D] text-[#E7D8B5] shadow-sm">
                    <div className="font-display font-semibold text-[#F0C75E]">
                      The Bonfire Whispers
                    </div>
                    <div className="font-serif text-[11px] text-[#A99D83] mt-0.5 leading-relaxed">
                      The flame burns steadily. Complete your daily rituals to maintain the flame.
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#141A1E] rounded-lg border-l-2 border-[#C99A3D] text-[#E7D8B5] shadow-sm">
                    <div className="font-display font-semibold text-[#F0C75E]">
                      Void Rift Stirs
                    </div>
                    <div className="font-serif text-[11px] text-[#A99D83] mt-0.5 leading-relaxed">
                      New champion vocations await summoning in the Character Hall.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN HERO GREETING CARD */}
      <div className="pt-3.5 pb-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          {/* Left: Salutation, Character Name, Level Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-display font-medium text-lg sm:text-xl text-[#C8BEA8] tracking-wide">
                {timeGreeting.text}
              </span>
              <span className="h-[1px] w-8 bg-gradient-to-r from-[#C99A3D]/70 to-transparent hidden sm:inline-block" />
            </div>

            {/* Character Name + Level Chip */}
            <div className="flex flex-wrap items-center gap-3">
              <h1
                id="header-class-name"
                className="font-ornate font-bold text-2xl sm:text-3xl md:text-4xl tracking-[0.06em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5DC] via-[#E8BE6B] to-[#F0C75E] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              >
                {classDef.name}
              </h1>

              {/* LV.12 Badge */}
              <div
                id="header-level-badge"
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#1A1610] to-[#12171A] border border-[#C99A3D]/60 shadow-[0_0_12px_rgba(201,154,61,0.25)] rounded-full"
              >
                <span className="w-2 h-2 bg-[#F0C75E] rounded-full animate-ping shadow-[0_0_6px_rgba(240,199,94,0.8)]" />
                <span className="font-mono text-xs text-[#F0C75E] font-bold tracking-wider">
                  LV.{level}
                </span>
              </div>
            </div>

            {/* Character Class Subtitle & Archetype Badge */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
              <span className="font-display font-medium text-[#D1BD93] tracking-wider text-xs sm:text-sm">
                {classDef.title}
              </span>
              <span className="text-[#8C6F3D]">•</span>
              <span
                className={`px-2 py-0.5 font-mono text-[10px] uppercase font-bold rounded-md border ${themeColors.badgeBg} ${themeColors.badgeText} ${themeColors.badgeBorder}`}
              >
                {classDef.primaryStat.toUpperCase()} (+{stats[classDef.primaryStat]})
              </span>
              <span className="text-[#8C6F3D] hidden sm:inline">•</span>
              <span className="font-serif text-[#A99D83] text-xs hidden sm:inline">
                {classDef.weapon}
              </span>
            </div>
          </div>

          {/* Right: Quick Vocation Selector */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5">
            <span className="font-display text-[9px] text-[#A99D83] uppercase tracking-wider font-semibold">
              Champion:
            </span>
            <div className="flex items-center gap-1 bg-[#0A0D0F] p-1 border border-[#8C6F3D]/25 rounded-lg">
              {(['sorcerer', 'knight', 'ronin', 'rogue'] as PlayerClass[]).map((cls) => {
                const isCurrent = playerClass === cls;
                const isUnlocked = unlockedClasses.includes(cls);
                const labels: Record<PlayerClass, string> = {
                  sorcerer: 'SORC',
                  knight: 'KNIGHT',
                  ronin: 'RONIN',
                  rogue: 'ROGUE',
                };
                return (
                  <button
                    key={cls}
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (!isUnlocked) return;
                      soundFx.playClick();
                      onSelectClass(cls);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-display font-semibold transition-all rounded-md flex items-center gap-1 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-[#D5A441] to-[#B88728] text-[#080B0D] font-bold shadow-[0_0_10px_rgba(201,154,61,0.5)] scale-105'
                        : isUnlocked
                        ? 'text-[#A99D83] hover:text-[#E7D8B5] hover:bg-white/5'
                        : 'text-[#443828] opacity-50 cursor-not-allowed'
                    }`}
                    title={
                      isUnlocked
                        ? `Switch Champion to ${PLAYER_CLASSES[cls].name}`
                        : `Unlock in Character Hall for ${PLAYER_CLASSES[cls].unlockCost} Gold`
                    }
                  >
                    {!isUnlocked && <Lock className="w-2.5 h-2.5 inline" />}
                    {labels[cls]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* THE REDESIGNED AXIOM INSCRIPTION CARD */}
        <div className="mt-3.5 relative group">
          <div
            onClick={handleQuoteClick}
            className={`cursor-pointer transition-all duration-300 relative p-3.5 sm:p-4 rounded-xl border ${themeColors.quoteBg} ${themeColors.quoteBorder} ${themeColors.quoteGlow} overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.6)]`}
          >
            {/* Corner Decorative Pixel Brackets */}
            <div className="absolute top-1 left-1.5 text-[#C99A3D]/40 font-pixel text-[9px] leading-none">┌</div>
            <div className="absolute top-1 right-1.5 text-[#C99A3D]/40 font-pixel text-[9px] leading-none">┐</div>
            <div className="absolute bottom-1 left-1.5 text-[#C99A3D]/40 font-pixel text-[9px] leading-none">└</div>
            <div className="absolute bottom-1 right-1.5 text-[#C99A3D]/40 font-pixel text-[9px] leading-none">┘</div>

            {/* Subtle background occult diagram */}
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full border border-dashed border-[#C99A3D]/10 pointer-events-none" />

            <div className="relative z-10 flex items-start gap-3">
              {/* ESOTERIC AXIOM SYMBOL (CUSTOM OCCULT RUNIC SEAL) */}
              <div
                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded border flex items-center justify-center transition-transform group-hover:scale-105 shadow-inner mt-0.5"
                style={{
                  backgroundColor: playerClass === 'sorcerer' ? '#1B0F2A' : '#141A1E',
                  borderColor: themeColors.accent,
                }}
              >
                <svg
                  viewBox="0 0 40 40"
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Runic Circle */}
                  <circle
                    cx="20"
                    cy="20"
                    r="17"
                    stroke={themeColors.accent}
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    className="opacity-70"
                  />
                  {/* Inner Concentric Ring */}
                  <circle
                    cx="20"
                    cy="20"
                    r="13"
                    stroke="#F0C75E"
                    strokeWidth="1.2"
                    className="opacity-90"
                  />
                  {/* Sacred Geometry Diamond */}
                  <polygon
                    points="20,7 33,20 20,33 7,20"
                    stroke="#F0C75E"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.85"
                  />
                  {/* Cardinal Cross Rays */}
                  <line x1="20" y1="4" x2="20" y2="36" stroke={themeColors.accent} strokeWidth="1" />
                  <line x1="4" y1="20" x2="36" y2="20" stroke={themeColors.accent} strokeWidth="1" />
                  {/* Central Radiant Eye / Void Core */}
                  <circle cx="20" cy="20" r="3.5" fill="#F0C75E" />
                  <circle cx="20" cy="20" r="1.5" fill={playerClass === 'sorcerer' ? '#7C3AED' : '#080B0D'} />
                  {/* Runic Sparks */}
                  <circle cx="20" cy="9" r="1" fill="#F0C75E" />
                  <circle cx="20" cy="31" r="1" fill="#F0C75E" />
                  <circle cx="9" cy="20" r="1" fill="#F0C75E" />
                  <circle cx="31" cy="20" r="1" fill="#F0C75E" />
                </svg>
              </div>

              {/* Quote Content */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5 text-[#C99A3D] text-xs mb-1">
                  <ScrollText className="w-3 h-3 text-[#F0C75E]" />
                  <span className="font-pixel text-[8.5px] uppercase tracking-wider">
                    Axiom Inscription
                  </span>
                  <span className="text-[#59452A]">•</span>
                  <span className="font-display text-[10px] text-[#A99D83] italic">
                    Consult Ancient Codex
                  </span>
                </div>

                <p className="font-body italic text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#E7D8B5] tracking-wide">
                  {classDef.quote}
                </p>
              </div>

              {/* Right Arrow / Action hint */}
              <div className="shrink-0 self-center text-[#A99D83] group-hover:text-[#F0C75E] transition-transform group-hover:translate-x-1">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: The Lost Axioms of Forgotten Kings (Deep Lore Codex) */}
      {showCodex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0B0E12] border-2 border-[#C99A3D] max-w-lg w-full p-5 sm:p-6 relative rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.9)] text-[#E7D8B5] max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setShowCodex(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-[#A99D83] hover:text-[#E7D8B5] transition-colors rounded-xs border border-transparent hover:border-[#59452A]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center pb-4 border-b border-[#59452A]/60 mb-4">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#181224] border-2 border-[#7C3AED] flex items-center justify-center text-[#A78BFA] shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-ornate font-bold text-xl text-[#F0C75E] tracking-wider uppercase">
                Axioms of Forgotten Kings
              </h3>
              <p className="font-body italic text-xs text-[#A99D83] mt-1">
                Recovered by {classDef.name} • Level {level}
              </p>
            </div>

            {/* Lore Content Entries */}
            <div className="space-y-3.5 text-xs sm:text-sm font-body">
              {/* Primary Quote Focus */}
              <div className="p-3.5 bg-[#140E20] border-l-2 border-[#A78BFA] rounded-r text-[#E7D8B5] italic leading-relaxed">
                {classDef.quote}
              </div>

              {/* Axiom I */}
              <div className="p-3 bg-[#11171A] border border-[#59452A] rounded-xs space-y-1">
                <div className="flex items-center justify-between text-[#F0C75E] font-display font-bold text-xs uppercase tracking-wide">
                  <span>Axiom I: The Law of Daily Ignition</span>
                  <span className="font-pixel text-[9px] text-[#A99D83]">Discipline</span>
                </div>
                <p className="text-[#C8BEA8] leading-relaxed">
                  The mightiest bonfire dies in a single night of neglect. Great sorceries and empires are built not by sudden fury, but by lighting one branch each dawn.
                </p>
              </div>

              {/* Axiom II */}
              <div className="p-3 bg-[#11171A] border border-[#59452A] rounded-xs space-y-1">
                <div className="flex items-center justify-between text-[#A78BFA] font-display font-bold text-xs uppercase tracking-wide">
                  <span>Axiom II: The Vessel of Intellect</span>
                  <span className="font-pixel text-[9px] text-[#A99D83]">Insight</span>
                </div>
                <p className="text-[#C8BEA8] leading-relaxed">
                  Knowledge without physical vessel will crumble into madness. Temper the vessel with clean water, deep sleep, and steady breath so the void flame finds a hearth.
                </p>
              </div>

              {/* Axiom III */}
              <div className="p-3 bg-[#11171A] border border-[#59452A] rounded-xs space-y-1">
                <div className="flex items-center justify-between text-[#62A96B] font-display font-bold text-xs uppercase tracking-wide">
                  <span>Axiom III: The Defeat of Procrastination</span>
                  <span className="font-pixel text-[9px] text-[#A99D83]">Courage</span>
                </div>
                <p className="text-[#C8BEA8] leading-relaxed">
                  The dark beast before you grows taller only when you avert your eyes. Strike the first minute of your quest, and the beast will reveal its mortal wounds.
                </p>
              </div>
            </div>

            {/* Bottom Close Action */}
            <div className="mt-5 pt-3 border-t border-[#59452A]/60 flex justify-end">
              <button
                onClick={() => {
                  soundFx.playCoin();
                  setShowCodex(false);
                }}
                className="px-4 py-2 bg-[#C99A3D] hover:bg-[#E0B250] text-[#080B0D] font-display font-bold text-xs uppercase tracking-wider rounded-xs transition-colors shadow-md"
              >
                Close Codex
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
