import React, { useState } from 'react';
import {
  CharacterStats,
  DayStreak,
  InventoryItem,
  PlayerClass,
  SpriteAction,
} from '../../types';
import { XPBar } from '../primitives/XPBar';
import { StatBar } from '../primitives/StatBar';
import { RPGCard } from '../primitives/RPGCard';
import { PixelCharacter } from '../pixel/PixelCharacter';
import { PLAYER_CLASSES } from '../../utils/classes';
import { soundFx } from '../../utils/audio';
import {
  Flame,
  Swords,
  Shield,
  Wand2,
  Sparkles,
  Lock,
  Check,
  Coins,
  ChevronDown,
  Upload,
  Calendar,
  Layers,
  Award,
  X,
  AlertCircle,
} from 'lucide-react';

interface CharacterScreenProps {
  playerClass: PlayerClass;
  onSelectClass: (cls: PlayerClass) => void;
  level: number;
  xp: number;
  maxXp: number;
  gold: number;
  stats: CharacterStats;
  streakDays: number;
  streak: DayStreak[];
  unlockedClasses?: PlayerClass[];
  onUnlockClass?: (cls: PlayerClass) => boolean;
  equippedItems?: InventoryItem[];
}

export const CharacterScreen: React.FC<CharacterScreenProps> = ({
  playerClass = 'sorcerer' as PlayerClass,
  onSelectClass,
  level,
  xp,
  maxXp,
  gold,
  stats,
  streakDays,
  streak,
  unlockedClasses = ['sorcerer'],
  onUnlockClass,
  equippedItems = [],
}) => {
  const [activeAction, setActiveAction] = useState<SpriteAction>('idle');
  const [customPngs, setCustomPngs] = useState<Record<string, string>>({});
  const [showSpritesheetLab, setShowSpritesheetLab] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [failingClass, setFailingClass] = useState<PlayerClass | null>(null);

  const classDef = PLAYER_CLASSES[playerClass] || PLAYER_CLASSES.sorcerer;

  const handleAction = (act: SpriteAction) => {
    setActiveAction(act);
    if (act === 'attack' || act === 'attack2') {
      if (playerClass === 'sorcerer') soundFx.playMagicCast();
      else if (playerClass === 'ronin') soundFx.playKatanaSlash();
      else soundFx.playSwordSlash();
    } else if (act === 'roll') {
      soundFx.playDodgeRoll();
    } else {
      soundFx.playClick();
    }
  };

  const handleUnlock = (cls: PlayerClass) => {
    const cost = PLAYER_CLASSES[cls].unlockCost;
    if (gold < cost) {
      const remaining = cost - gold;
      setUnlockError(`Requires ${remaining.toLocaleString()} more Gold to summon ${PLAYER_CLASSES[cls].name}. Complete more quests or rest at the bonfire!`);
      setFailingClass(cls);
      soundFx.playClick();
      setTimeout(() => {
        setUnlockError(null);
        setFailingClass(null);
      }, 5000);
      return;
    }
    if (onUnlockClass) {
      const success = onUnlockClass(cls);
      if (success) {
        setUnlockError(null);
        setFailingClass(null);
      }
    }
  };

  // Upload handler for user-provided custom sprite sheets (Attack1.png, Idle.png, etc.)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMap: Record<string, string> = { ...customPngs };
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = file.name.toLowerCase();
      const url = URL.createObjectURL(file);

      if (name.includes('idle')) newMap.idle = url;
      else if (name.includes('run')) newMap.run = url;
      else if (name.includes('attack1') || (name.includes('attack') && !name.includes('2')))
        newMap.attack = url;
      else if (name.includes('attack2')) newMap.attack2 = url;
      else if (name.includes('jump')) newMap.jump = url;
      else if (name.includes('fall')) newMap.fall = url;
      else if (name.includes('hit') || name.includes('take')) newMap.hit = url;
      else if (name.includes('death')) newMap.death = url;
    }
    setCustomPngs(newMap);
    soundFx.playQuestComplete();
  };

  return (
    <div className="min-h-screen pb-44 sm:pb-48 md:pb-16 max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto p-4 sm:p-6 space-y-6 select-none overflow-x-hidden">
      {/* Header with Responsive 1304 G Imperial Treasury */}
      <div className="pt-2 border-b border-[#59452A]/40 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-ornate font-bold text-2xl text-[#F0C75E] tracking-wide">
              Champion Sanctum
            </h1>
            <span className="font-pixel text-[8px] px-2 py-0.5 bg-[#17130A] text-[#F0C75E] border border-[#C99A3D] rounded-xs uppercase tracking-wider">
              Vocation Codex
            </span>
          </div>
          <p className="font-body text-xs text-[#A99D83] mt-0.5">
            Inspect your active hero, allocate attributes, and awaken ancient champions.
          </p>
        </div>

        {/* 1304 G Imperial Treasury Coffer (Tactile & Fully Responsive) */}
        <div
          id="character-gold-coffer"
          className="self-start sm:self-auto px-3.5 py-2 bg-gradient-to-r from-[#17130A] via-[#241A0B] to-[#17130A] border-2 border-[#D5A441] rounded-xs flex items-center gap-3 shadow-[0_0_15px_rgba(213,164,65,0.25)] shrink-0 hover:border-[#F0C75E] transition-all cursor-default"
          title="Imperial Treasury Gold Balance"
        >
          <div className="w-8 h-8 rounded-xs bg-[#0C0F12] border border-[#F0C75E] flex items-center justify-center text-[#F0C75E] shadow-inner shrink-0">
            <Coins className="w-4 h-4 text-[#F0C75E] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-pixel text-[8px] text-[#A99D83] tracking-widest uppercase">
              Imperial Treasury
            </span>
            <span className="font-pixel text-sm sm:text-base text-[#F0C75E] font-black tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {gold.toLocaleString()} G
            </span>
          </div>
        </div>
      </div>

      {/* FIXED VIEWPORT ALERT FOR MOBILE & DESKTOP (Always visible when clicked on any screen size) */}
      {unlockError && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-3.5 bg-[#1C0A0A]/95 border-2 border-[#EF4444] rounded-xs text-[#FCA5A5] shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xs bg-[#3B1111] border border-[#DC2626] flex items-center justify-center shrink-0 text-[#FCA5A5]">
              <Lock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-ornate font-bold text-xs text-[#FEE2E2] tracking-wide flex items-center gap-1.5">
                <span>Sanctum Seal Intact</span>
                <span className="font-pixel text-[8px] text-[#EF4444] uppercase px-1 py-0.2 bg-[#2D0B0B] border border-[#EF4444]/40">Alert</span>
              </div>
              <p className="font-body text-xs text-[#FCA5A5] mt-0.5 leading-snug">
                {unlockError}
              </p>
            </div>
          </div>
          <button
            onClick={() => setUnlockError(null)}
            className="p-1 text-[#FCA5A5] hover:text-white shrink-0 hover:bg-[#3B1111] rounded-xs cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. INTERACTIVE HERO STAGE WITH EQUIPPED ITEMS ATTACHED */}
      <RPGCard
        variant="highlight"
        className="p-5 relative overflow-hidden bg-gradient-to-b from-[#121920] to-[#090C0E] border-2 border-[#C99A3D]"
      >
        <div className="flex flex-col items-center justify-center py-2">
          {/* Sprite Renderer with Visual Gear Attachments */}
          <div className="relative my-2">
            <PixelCharacter
              playerClass={playerClass}
              action={activeAction}
              size="hero"
              onActionComplete={() => setActiveAction('idle')}
              interactive
              customPngs={customPngs}
              equippedItems={equippedItems}
            />

            {/* Action pill label */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#080B0D] border border-[#C99A3D] font-pixel text-[8.5px] text-[#F0C75E] uppercase tracking-wider shadow-lg flex items-center gap-1.5 rounded-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C99A3D] animate-ping" />
              <span>{activeAction}</span>
            </div>
          </div>

          {/* EXACTLY 3-4 HERO ACTIONS (User requested: "give only 3-4 action") */}
          <div className="w-full mt-6 pt-3 border-t border-[#59452A]/60">
            <div className="flex items-center justify-between mb-2">
              <span className="font-pixel text-[8.5px] text-[#C99A3D] uppercase tracking-wider">
                Hero Combat Actions (4)
              </span>
              <span className="font-display text-[11px] text-[#A99D83] italic">
                {classDef.name}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 w-full">
              {playerClass === 'sorcerer' ? (
                <>
                  <button
                    onClick={() => handleAction('idle')}
                    className={`py-2 px-1.5 text-[9px] font-pixel uppercase rounded-xs transition-all flex flex-col items-center justify-center gap-1 ${
                      activeAction === 'idle'
                        ? 'bg-[#7C3AED] text-white font-bold border border-[#C084FC] shadow-[0_0_8px_rgba(124,58,237,0.5)]'
                        : 'bg-[#182024] text-[#E7D8B5] hover:bg-[#25333A] border border-[#59452A]'
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5 text-[#C084FC]" />
                    <span>Stance</span>
                  </button>

                  <button
                    onClick={() => handleAction('attack')}
                    className={`py-2 px-1.5 text-[9px] font-pixel uppercase rounded-xs transition-all flex flex-col items-center justify-center gap-1 ${
                      activeAction === 'attack'
                        ? 'bg-[#7C3AED] text-white font-bold border border-[#C084FC] shadow-[0_0_8px_rgba(124,58,237,0.5)]'
                        : 'bg-[#182024] text-[#E7D8B5] hover:bg-[#25333A] border border-[#59452A]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F0C75E]" />
                    <span>Void Skull</span>
                  </button>

                  <button
                    onClick={() => handleAction('attack2')}
                    className={`py-2 px-1.5 text-[9px] font-pixel uppercase rounded-xs transition-all flex flex-col items-center justify-center gap-1 ${
                      activeAction === 'attack2'
                        ? 'bg-[#7C3AED] text-white font-bold border border-[#C084FC] shadow-[0_0_8px_rgba(124,58,237,0.5)]'
                        : 'bg-[#182024] text-[#E7D8B5] hover:bg-[#25333A] border border-[#59452A]'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-[#E0522D]" />
                    <span>Staff Slam</span>
                  </button>

                  <button
                    onClick={() => handleAction('victory')}
                    className={`py-2 px-1.5 text-[9px] font-pixel uppercase rounded-xs transition-all flex flex-col items-center justify-center gap-1 ${
                      activeAction === 'victory'
                        ? 'bg-[#7C3AED] text-white font-bold border border-[#C084FC] shadow-[0_0_8px_rgba(124,58,237,0.5)]'
                        : 'bg-[#182024] text-[#E7D8B5] hover:bg-[#25333A] border border-[#59452A]'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-[#F0C75E]" />
                    <span>Rest Flame</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAction('idle')}
                    className={`py-2 px-1.5 text-[9px] font-pixel uppercase rounded-xs transition-all flex flex-col items-center justify-center gap-1 ${
                      activeAction === 'idle'
                        ? 'bg-[#C99A3D] text-[#080B0D] font-bold shadow-md'
                        : 'bg-[#182024] text-[#E7D8B5] hover:bg-[#25333A] border border-[#59452A]'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-[#A99D83]" />
                    <span>Stance</span>
                  </button>

                  <button
                    onClick={() => handleAction('attack')}
                    className={`py-2 px-1.5 text-[9px] font-pixel uppercase rounded-xs transition-all flex flex-col items-center justify-center gap-1 ${
                      activeAction === 'attack'
                        ? 'bg-[#C99A3D] text-[#080B0D] font-bold shadow-md'
                        : 'bg-[#182024] text-[#E7D8B5] hover:bg-[#25333A] border border-[#59452A]'
                    }`}
                  >
                    <Swords className="w-3.5 h-3.5 text-[#E7D8B5]" />
                    <span>Strike</span>
                  </button>

                  <button
                    onClick={() => handleAction('roll')}
                    className={`py-2 px-1.5 text-[9px] font-pixel uppercase rounded-xs transition-all flex flex-col items-center justify-center gap-1 ${
                      activeAction === 'roll'
                        ? 'bg-[#C99A3D] text-[#080B0D] font-bold shadow-md'
                        : 'bg-[#182024] text-[#E7D8B5] hover:bg-[#25333A] border border-[#59452A]'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-[#A99D83]" />
                    <span>Roll</span>
                  </button>

                  <button
                    onClick={() => handleAction('victory')}
                    className={`py-2 px-1.5 text-[9px] font-pixel uppercase rounded-xs transition-all flex flex-col items-center justify-center gap-1 ${
                      activeAction === 'victory'
                        ? 'bg-[#C99A3D] text-[#080B0D] font-bold shadow-md'
                        : 'bg-[#182024] text-[#E7D8B5] hover:bg-[#25333A] border border-[#59452A]'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-[#E0522D]" />
                    <span>Kindle</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Optional Spritesheet Lab Drawer */}
          {playerClass === 'sorcerer' && (
            <div className="w-full mt-3">
              <button
                onClick={() => setShowSpritesheetLab(!showSpritesheetLab)}
                className="w-full py-1.5 px-2 bg-[#090C0E] border border-[#59452A] rounded-xs font-pixel text-[8px] text-[#A99D83] hover:text-[#E7D8B5] flex items-center justify-between"
              >
                <span>Custom PNG Spritesheet Uploader</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    showSpritesheetLab ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showSpritesheetLab && (
                <div className="mt-2 p-3 bg-[#090C0E] border border-dashed border-[#7C3AED]/70 rounded-xs animate-fade-in space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs text-[#C084FC]">
                      Upload Wauzar Spritesheets
                    </span>
                    <label className="cursor-pointer px-2.5 py-1 bg-[#26153B] hover:bg-[#381F54] border border-[#7C3AED] text-[#E9D5FF] font-pixel text-[8px] uppercase tracking-wider rounded-xs flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      Select PNGs
                      <input
                        type="file"
                        multiple
                        accept="image/png,image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="font-body text-[10px] text-[#A99D83]">
                    Upload PNG files named `Attack1.png`, `Attack2.png`, `Idle.png`, `Run.png`,
                    `Death.png` to replace the sprite in real time.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visual Attached Gear Summary */}
        <div className="mt-4 pt-3 border-t border-[#59452A]/60">
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-[8.5px] text-[#C99A3D] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              Equipped Visual Gear ({equippedItems.length})
            </span>
            <span className="font-display text-[10px] text-[#A99D83]">
              Attached to Champion Sprite
            </span>
          </div>

          {equippedItems.length === 0 ? (
            <div className="p-2.5 bg-[#090C0E] border border-[#59452A]/60 rounded-xs text-center text-xs text-[#A99D83] font-body italic">
              No items equipped. Visit the Merchant Hall to buy armor, tomes, or relics.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {equippedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2 bg-[#0C1215] border border-[#C99A3D]/70 rounded-xs flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-xs bg-[#182024] border border-[#59452A] flex items-center justify-center shrink-0">
                    <Shield className="w-3 h-3 text-[#F0C75E]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-[11px] text-[#E7D8B5] truncate">
                      {item.name}
                    </div>
                    <div className="font-pixel text-[7.5px] text-[#62A96B] uppercase">
                      Equipped
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </RPGCard>

      {/* 2. VOCATION & CHAMPION UNLOCK HALL (Start with one, buy other characters) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#59452A] pb-2">
          <h2 className="font-display font-bold text-sm uppercase tracking-widest text-[#D5A441]">
            Champion Roster & Vocations
          </h2>
          <span className="font-pixel text-[9px] text-[#A99D83]">
            {unlockedClasses.length} / 4 Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(['sorcerer', 'knight', 'ronin', 'rogue'] as PlayerClass[]).map((cls) => {
            const def = PLAYER_CLASSES[cls];
            const isCurrent = playerClass === cls;
            const isUnlocked = unlockedClasses.includes(cls);

            return (
              <div
                key={cls}
                className={`p-3.5 border-2 rounded-xs transition-all relative ${
                  isCurrent
                    ? 'bg-[#182226] border-[#C99A3D] shadow-lg'
                    : isUnlocked
                    ? 'bg-[#0D1215] border-[#59452A] hover:border-[#8E7246]'
                    : 'bg-[#0A0D10] border-[#362B1D] opacity-85'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Class Sprite Miniature */}
                    <div className="w-12 h-12 bg-[#080B0D] border border-[#59452A] flex items-center justify-center overflow-hidden rounded-xs shrink-0">
                      <PixelCharacter
                        playerClass={cls}
                        action="idle"
                        size="sm"
                        interactive={false}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-ornate font-bold text-sm text-[#F0C75E]">
                          {def.name}
                        </h3>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 bg-[#C99A3D] text-[#080B0D] font-pixel text-[7.5px] uppercase font-bold rounded-xs">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="font-display text-[11px] text-[#A99D83]">
                        {def.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#C8BEA8] font-body">
                        <span className="font-pixel text-[8px] text-[#C99A3D] uppercase">
                          {def.primaryStat.toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>{def.weapon}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="font-body text-[11px] text-[#A99D83] mt-2 line-clamp-2 leading-relaxed">
                  {def.description}
                </p>

                {/* Unlock or Equip Action Button */}
                <div className="mt-3 pt-2.5 border-t border-[#59452A]/40 flex items-center justify-between">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        if (isCurrent) return;
                        soundFx.playClick();
                        onSelectClass(cls);
                      }}
                      disabled={isCurrent}
                      className={`w-full py-1.5 px-3 rounded-xs font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        isCurrent
                          ? 'bg-[#1A261D] text-[#62A96B] border border-[#62A96B]/50 cursor-default'
                          : 'bg-[#182024] hover:bg-[#C99A3D] text-[#E7D8B5] hover:text-[#080B0D] border border-[#59452A]'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Currently Equipped
                        </>
                      ) : (
                        'Select Champion'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnlock(cls)}
                      className={`w-full py-1.5 px-3 rounded-xs font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        gold >= def.unlockCost
                          ? 'bg-[#C99A3D] hover:bg-[#E0B250] text-[#080B0D] shadow-md cursor-pointer'
                          : 'bg-[#1A1412] text-[#8E7246] border border-[#59452A]/50 cursor-pointer'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        Unlock for {def.unlockCost} Gold
                      </span>
                    </button>
                  )}
                </div>

                {/* Inline Alert Feedback for Mobile & Desktop */}
                {failingClass === cls && (
                  <div className="mt-2.5 p-2 bg-[#2D0B0B] border border-[#EF4444] rounded-xs text-xs text-[#FCA5A5] flex items-center gap-2 animate-shake shadow-md">
                    <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                    <span className="font-body text-[11px] leading-tight">
                      Requires {(def.unlockCost - gold).toLocaleString()} more Gold to summon {def.name}.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. LEVEL & XP PROGRESSION */}
      <RPGCard className="p-4 bg-[#0B0F12] border-2 border-[#59452A]">
        <XPBar level={level} currentXp={xp} maxXp={maxXp} tall />
      </RPGCard>

      {/* 4. CORE RPG ATTRIBUTES */}
      <RPGCard className="p-4 space-y-3.5 bg-[#0B0F12] border-2 border-[#59452A]">
        <h2 className="font-display font-bold text-xs uppercase tracking-widest text-[#D5A441] border-b border-[#59452A] pb-2">
          Champion Attributes
        </h2>
        <StatBar type="strength" value={stats.strength} />
        <StatBar type="intelligence" value={stats.intelligence} />
        <StatBar type="vitality" value={stats.vitality} />
        <StatBar type="focus" value={stats.focus} />
      </RPGCard>

      {/* 5. CURRENT STREAK SECTION (Fully visible and scrollable with generous padding) */}
      <RPGCard id="streak-section" className="p-4 space-y-3 bg-[#0B0F12] border-2 border-[#59452A] shadow-lg mb-8">
        <div className="flex items-center justify-between border-b border-[#59452A] pb-2">
          <h2 className="font-display font-bold text-xs uppercase tracking-widest text-[#D5A441] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#E0522D]" />
            Consecutive Day Streak
          </h2>
          <span className="font-pixel text-[9px] text-[#F0C75E]">
            {streakDays} Days Burning
          </span>
        </div>

        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 bg-[#140E0C] border-2 border-[#B84025] flex items-center justify-center shrink-0 rounded-xs shadow-inner">
            <Flame className="w-5 h-5 text-[#E0522D]" />
          </div>
          <div>
            <div className="font-display font-bold text-base text-[#E7D8B5]">
              {streakDays} Days Unbroken
            </div>
            <div className="font-body text-xs text-[#A99D83]">
              Keep the bonfire blazing. Missing a day extinguishes the flame.
            </div>
          </div>
        </div>

        {/* Day Streak Circles */}
        <div className="flex items-center justify-between pt-2">
          {streak.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="font-display text-[10px] text-[#A99D83] font-semibold">
                {item.day}
              </span>
              <div
                className={`w-7 h-7 flex items-center justify-center border-2 transition-all rounded-full ${
                  item.completed
                    ? 'bg-[#8F3021] border-[#F0C75E] shadow-[0_0_10px_rgba(240,199,94,0.4)]'
                    : 'bg-[#090C0E] border-[#59452A]'
                }`}
              >
                {item.completed ? (
                  <Flame className="w-3.5 h-3.5 text-[#F0C75E]" />
                ) : (
                  <span className="w-1.5 h-1.5 bg-[#59452A] rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </RPGCard>
    </div>
  );
};
