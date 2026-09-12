import React, { useRef, useState } from 'react';
import {
  Quest,
  CharacterStats,
  ScreenId,
  PlayerClass,
  SpriteAction,
  DailyBoss,
  InventoryItem,
} from '../../types';
import { XPBar } from '../primitives/XPBar';
import { RPGCard } from '../primitives/RPGCard';
import { PixelButton } from '../primitives/PixelButton';
import { BonfireHeroArt } from '../artwork/BonfireHeroArt';
import { DailyBossWidget } from '../primitives/DailyBossWidget';
import { CharacterGreetingHeader } from '../character/CharacterGreetingHeader';
import { PLAYER_CLASSES } from '../../utils/classes';
import {
  FireIcon,
  IntelligenceIcon,
  VitalityIcon,
  FocusIcon,
  PixelCheck,
  FitnessIcon,
  WorkIcon,
  CustomDotsIcon,
} from '../icons/PixelIcons';
import { soundFx } from '../../utils/audio';
import { animateQuestSlash } from '../../utils/animations';
import { Wand2, Sparkles, Flame, Swords, Shield, Plus, ChevronRight } from 'lucide-react';

interface HomeScreenProps {
  playerClass: PlayerClass;
  onSelectClass: (cls: PlayerClass) => void;
  heroAction: SpriteAction;
  onTriggerHeroAction: (act: SpriteAction) => void;
  dailyBoss: DailyBoss;
  level: number;
  xp: number;
  maxXp: number;
  gold: number;
  stats: CharacterStats;
  quests: Quest[];
  onToggleQuest: (id: string) => void;
  onSelectQuest: (quest: Quest) => void;
  onNavigate: (screen: ScreenId) => void;
  streakDays?: number;
  equippedItems?: InventoryItem[];
  unlockedClasses?: PlayerClass[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  playerClass,
  onSelectClass,
  heroAction,
  onTriggerHeroAction,
  dailyBoss,
  level,
  xp,
  maxXp,
  gold,
  stats,
  quests,
  onToggleQuest,
  onSelectQuest,
  onNavigate,
  streakDays = 7,
  equippedItems = [],
  unlockedClasses = ['sorcerer'],
}) => {
  const questRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [filterCategory, setFilterCategory] = useState<'all' | 'pending' | 'completed'>('all');
  const completedCount = quests.filter((q) => q.completed).length;

  const currentClassDef = PLAYER_CLASSES[playerClass] || PLAYER_CLASSES.sorcerer;

  const filteredQuests = quests.filter((q) => {
    if (filterCategory === 'pending') return !q.completed;
    if (filterCategory === 'completed') return q.completed;
    return true;
  });

  const handleQuestToggle = (quest: Quest) => {
    const cardEl = questRefs.current[quest.id];
    if (!quest.completed) {
      // Trigger character attack animation
      onTriggerHeroAction('attack');
      if (playerClass === 'sorcerer') {
        soundFx.playMagicCast();
      } else {
        soundFx.playSwordSlash();
      }

      if (cardEl) {
        animateQuestSlash(cardEl, () => {
          onToggleQuest(quest.id);
        });
      } else {
        onToggleQuest(quest.id);
      }
    } else {
      onToggleQuest(quest.id);
    }
  };

  const getCategoryIcon = (category: Quest['category']) => {
    switch (category) {
      case 'fitness':
        return <FitnessIcon size={16} color="#D94B38" />;
      case 'work':
        return <WorkIcon size={16} color="#4CA7D8" />;
      case 'health':
        return <VitalityIcon size={16} color="#62A96B" />;
      case 'study':
        return <IntelligenceIcon size={16} color="#4CA7D8" />;
      case 'custom':
      default:
        return <CustomDotsIcon size={16} color="#D5A441" />;
    }
  };

  return (
    <div
      id="home-screen-container"
      className="min-h-screen pb-36 sm:pb-44 md:pb-16 w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-6 overflow-x-hidden"
    >
      {/* 1. CHARACTER GREETING & OCCULT AXIOM SEAL */}
      <CharacterGreetingHeader
        playerClass={playerClass}
        onSelectClass={onSelectClass}
        level={level}
        gold={gold}
        streakDays={streakDays}
        stats={stats}
        unlockedClasses={unlockedClasses}
      />

      {/* 2. RESPONSIVE BENTO / DASHBOARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* LEFT COLUMN: Hero Bonfire Stage, Taller XP Bar, 3 Actions, Core Stats */}
        <div className="md:col-span-5 lg:col-span-5 space-y-4">
          {/* TALL HERO BONFIRE STAGE */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#8C6F3D]/40">
            <BonfireHeroArt
              playerClass={playerClass}
              heroAction={heroAction}
              onHeroAction={onTriggerHeroAction}
              equippedItems={equippedItems}
              className="h-64 sm:h-72 md:h-80 lg:h-92 w-full"
            />
          </div>

          {/* DEDICATED TALL LEVEL & XP PROGRESSION */}
          <RPGCard variant="highlight" className="p-4 bg-gradient-to-b from-[#141B20]/95 to-[#0D1215]/95 border border-[#C99A3D]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            <XPBar level={level} currentXp={xp} maxXp={maxXp} tall />
          </RPGCard>

          {/* ONLY 3 ACTIONS ON MAIN SCREEN (User requested strictly 3 actions) */}
          <div className="bg-gradient-to-b from-[#12181B]/95 to-[#0A0D0F]/95 p-3.5 border border-[#8C6F3D]/30 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.03)] space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#8C6F3D]/20 pb-2">
              <span className="font-display font-bold text-[10px] text-[#F0C75E] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#F0C75E]" />
                Hero Actions (3)
              </span>
              <span className="font-serif text-xs text-[#A99D83] italic">
                {currentClassDef.name}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {playerClass === 'sorcerer' ? (
                <>
                  {/* Action 1 */}
                  <button
                    onClick={() => {
                      soundFx.playMagicCast();
                      onTriggerHeroAction('attack');
                    }}
                    className="py-2.5 px-2 bg-gradient-to-b from-[#241738] to-[#160E22] hover:from-[#352252] hover:to-[#221535] border border-[#7C3AED]/70 hover:border-[#A78BFA] text-[#E9D5FF] flex flex-col items-center justify-center gap-1.5 transition-all rounded-lg active:scale-95 shadow-sm group"
                    title="Void Skull Spell Projectile"
                  >
                    <Wand2 className="w-4 h-4 text-[#C084FC] group-hover:scale-110 transition-transform" />
                    <span className="font-display text-[9px] font-bold uppercase tracking-tight">Void Strike</span>
                  </button>

                  {/* Action 2 */}
                  <button
                    onClick={() => {
                      soundFx.playMagicCast();
                      onTriggerHeroAction('attack2');
                    }}
                    className="py-2.5 px-2 bg-gradient-to-b from-[#241738] to-[#160E22] hover:from-[#352252] hover:to-[#221535] border border-[#7C3AED]/70 hover:border-[#A78BFA] text-[#C084FC] flex flex-col items-center justify-center gap-1.5 transition-all rounded-lg active:scale-95 shadow-sm group"
                    title="Staff Slam Shockwave"
                  >
                    <Sparkles className="w-4 h-4 text-[#F0C75E] group-hover:scale-110 transition-transform" />
                    <span className="font-display text-[9px] font-bold uppercase tracking-tight">Staff Slam</span>
                  </button>

                  {/* Action 3 */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onTriggerHeroAction('victory');
                    }}
                    className="py-2.5 px-2 bg-gradient-to-b from-[#221A14] to-[#15100B] hover:from-[#33261D] hover:to-[#1E1710] border border-[#C99A3D]/50 hover:border-[#F0C75E] text-[#F0C75E] flex flex-col items-center justify-center gap-1.5 transition-all rounded-lg active:scale-95 shadow-sm group"
                    title="Rest at Bonfire"
                  >
                    <Flame className="w-4 h-4 text-[#E0522D] group-hover:scale-110 transition-transform" />
                    <span className="font-display text-[9px] font-bold uppercase tracking-tight">Rest Flame</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Action 1 */}
                  <button
                    onClick={() => {
                      soundFx.playSwordSlash();
                      onTriggerHeroAction('attack');
                    }}
                    className="py-2.5 px-2 bg-gradient-to-b from-[#1C252B] to-[#101518] hover:from-[#27343D] hover:to-[#171E23] border border-[#8C6F3D]/40 hover:border-[#C99A3D] text-[#E7D8B5] flex flex-col items-center justify-center gap-1.5 transition-all rounded-lg active:scale-95 shadow-sm group"
                    title="Hero Strike Attack"
                  >
                    <Swords className="w-4 h-4 text-[#E7D8B5] group-hover:scale-110 transition-transform" />
                    <span className="font-display text-[9px] font-bold uppercase tracking-tight">Strike</span>
                  </button>

                  {/* Action 2 */}
                  <button
                    onClick={() => {
                      soundFx.playDodgeRoll();
                      onTriggerHeroAction('roll');
                    }}
                    className="py-2.5 px-2 bg-gradient-to-b from-[#1C252B] to-[#101518] hover:from-[#27343D] hover:to-[#171E23] border border-[#8C6F3D]/40 hover:border-[#C99A3D] text-[#E7D8B5] flex flex-col items-center justify-center gap-1.5 transition-all rounded-lg active:scale-95 shadow-sm group"
                    title="Combat Dodge Roll"
                  >
                    <Shield className="w-4 h-4 text-[#A99D83] group-hover:scale-110 transition-transform" />
                    <span className="font-display text-[9px] font-bold uppercase tracking-tight">Roll</span>
                  </button>

                  {/* Action 3 */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onTriggerHeroAction('victory');
                    }}
                    className="py-2.5 px-2 bg-gradient-to-b from-[#221A14] to-[#15100B] hover:from-[#33261D] hover:to-[#1E1710] border border-[#C99A3D]/50 hover:border-[#F0C75E] text-[#F0C75E] flex flex-col items-center justify-center gap-1.5 transition-all rounded-lg active:scale-95 shadow-sm group"
                    title="Kindle Bonfire"
                  >
                    <Flame className="w-4 h-4 text-[#E0522D] group-hover:scale-110 transition-transform" />
                    <span className="font-display text-[9px] font-bold uppercase tracking-tight">Kindle</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Four Core Stat Badges */}
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {/* STR */}
            <RPGCard className="p-2 sm:p-2.5 text-center flex flex-col items-center justify-center hover:border-[#D94B38]/60 transition-colors">
              <div className="flex items-center gap-1 text-[#D94B38] mb-1">
                <FireIcon size={14} />
                <span className="font-display font-bold text-[10px] tracking-wider">STR</span>
              </div>
              <span className="font-pixel text-xs sm:text-sm text-[#E7D8B5]">{stats.strength}</span>
            </RPGCard>

            {/* INT */}
            <RPGCard
              className={`p-2 sm:p-2.5 text-center flex flex-col items-center justify-center transition-colors ${
                playerClass === 'sorcerer' ? 'border-[#A78BFA] bg-[#160F24]' : 'hover:border-[#4CA7D8]/60'
              }`}
            >
              <div className="flex items-center gap-1 text-[#4CA7D8] mb-1">
                <IntelligenceIcon size={14} />
                <span className="font-display font-bold text-[10px] tracking-wider">INT</span>
              </div>
              <span
                className={`font-pixel text-xs sm:text-sm ${
                  playerClass === 'sorcerer' ? 'text-[#C4B5FD] font-bold' : 'text-[#E7D8B5]'
                }`}
              >
                {stats.intelligence}
              </span>
            </RPGCard>

            {/* VIT */}
            <RPGCard className="p-2 sm:p-2.5 text-center flex flex-col items-center justify-center hover:border-[#62A96B]/60 transition-colors">
              <div className="flex items-center gap-1 text-[#62A96B] mb-1">
                <VitalityIcon size={14} />
                <span className="font-display font-bold text-[10px] tracking-wider">VIT</span>
              </div>
              <span className="font-pixel text-xs sm:text-sm text-[#E7D8B5]">{stats.vitality}</span>
            </RPGCard>

            {/* FOC */}
            <RPGCard className="p-2 sm:p-2.5 text-center flex flex-col items-center justify-center hover:border-[#D5A441]/60 transition-colors">
              <div className="flex items-center gap-1 text-[#D5A441] mb-1">
                <FocusIcon size={14} />
                <span className="font-display font-bold text-[10px] tracking-wider">FOC</span>
              </div>
              <span className="font-pixel text-xs sm:text-sm text-[#E7D8B5]">{stats.focus}</span>
            </RPGCard>
          </div>
        </div>

        {/* RIGHT COLUMN: Daily Boss Combat & Quests Journal */}
        <div className="md:col-span-7 lg:col-span-7 space-y-4">
          {/* Daily Boss Combat Bar */}
          <DailyBossWidget boss={dailyBoss} />

          {/* Today's Quests Section */}
          <div className="space-y-3.5 bg-gradient-to-b from-[#12181B]/95 to-[#0A0D0F]/95 border border-[#8C6F3D]/30 p-4 sm:p-5 rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.03)]">
            {/* Header with Title, Filter Tabs, and Counter */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#8C6F3D]/20">
              <div className="flex items-center gap-2.5">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#E7D8B5] tracking-wide">
                  Today’s Quests
                </h3>
                <span className="font-mono text-xs text-[#F0C75E] px-2.5 py-0.5 bg-[#1A1610] border border-[#C99A3D]/40 rounded-full font-bold shadow-sm">
                  {completedCount} / {quests.length}
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-[#0A0D0F] p-1 border border-[#8C6F3D]/25 rounded-lg text-xs font-display">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1 rounded-md transition-all font-semibold ${
                    filterCategory === 'all'
                      ? 'bg-gradient-to-r from-[#D5A441] to-[#B88728] text-[#080B0D] shadow-sm'
                      : 'text-[#A99D83] hover:text-[#E7D8B5] hover:bg-white/5'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterCategory('pending')}
                  className={`px-3 py-1 rounded-md transition-all font-semibold ${
                    filterCategory === 'pending'
                      ? 'bg-gradient-to-r from-[#D5A441] to-[#B88728] text-[#080B0D] shadow-sm'
                      : 'text-[#A99D83] hover:text-[#E7D8B5] hover:bg-white/5'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterCategory('completed')}
                  className={`px-3 py-1 rounded-md transition-all font-semibold ${
                    filterCategory === 'completed'
                      ? 'bg-gradient-to-r from-[#D5A441] to-[#B88728] text-[#080B0D] shadow-sm'
                      : 'text-[#A99D83] hover:text-[#E7D8B5] hover:bg-white/5'
                  }`}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Quest List */}
            <div className="space-y-2.5">
              {filteredQuests.length === 0 ? (
                <div className="text-center py-8 text-[#A99D83] font-body italic text-xs">
                  No quests in this category. Kindling the bonfire awaits.
                </div>
              ) : (
                filteredQuests.map((quest) => (
                  <div
                    key={quest.id}
                    ref={(el) => {
                      questRefs.current[quest.id] = el;
                    }}
                    className="relative transition-transform duration-200"
                  >
                    <RPGCard
                      className={`p-3.5 sm:p-4 flex items-center gap-3.5 transition-all duration-200 rounded-xl ${
                        quest.completed
                          ? 'opacity-65 bg-[#090C0E]/80 border-[#3A2E1E]/40'
                          : 'hover:border-[#C99A3D]/70 bg-gradient-to-r from-[#141A1E]/90 to-[#0F1417]/90 hover:shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuestToggle(quest);
                        }}
                        className="shrink-0 p-1 focus:outline-none cursor-pointer group"
                        title={quest.completed ? 'Mark pending' : 'Complete quest'}
                      >
                        <PixelCheck checked={quest.completed} size={22} />
                      </button>

                      {/* Category Icon Box */}
                      <div
                        onClick={() => onSelectQuest(quest)}
                        className="w-9 h-9 shrink-0 bg-gradient-to-br from-[#1C252B] to-[#101518] border border-[#8C6F3D]/30 flex items-center justify-center cursor-pointer hover:border-[#C99A3D] transition-colors rounded-lg shadow-sm"
                      >
                        {getCategoryIcon(quest.category)}
                      </div>

                      {/* Quest Details */}
                      <div
                        onClick={() => onSelectQuest(quest)}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <h4
                          className={`font-body font-semibold text-sm sm:text-base truncate transition-colors ${
                            quest.completed ? 'line-through text-[#6F695C]' : 'text-[#E7D8B5] group-hover:text-white'
                          }`}
                        >
                          {quest.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[11px] font-bold text-[#F0C75E] bg-[#1A1610] px-2 py-0.5 rounded border border-[#C99A3D]/30">
                            +{quest.xpReward || 50} XP
                          </span>
                          <span className="text-[#8C6F3D] text-xs">•</span>
                          <span className="font-serif text-xs text-[#A99D83]">
                            +{quest.statAmount || 10}{' '}
                            {(() => {
                              const s = quest.statType || (quest as any).attributeTarget || 'focus';
                              return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Focus';
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* Right Arrow */}
                      <div
                        onClick={() => onSelectQuest(quest)}
                        className="text-[#6F695C] hover:text-[#D5A441] cursor-pointer pl-1"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </RPGCard>
                  </div>
                ))
              )}
            </div>

            {/* Add Quest Button */}
            <div className="pt-2">
              <PixelButton
                variant="primary"
                fullWidth
                size="md"
                onClick={() => {
                  soundFx.playClick();
                  onNavigate('add-quest');
                }}
                icon={<Plus className="w-4 h-4" />}
              >
                New Quest
              </PixelButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
