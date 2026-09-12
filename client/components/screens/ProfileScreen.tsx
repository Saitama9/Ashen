import React, { useState, useMemo } from 'react';
import { RPGCard } from '../primitives/RPGCard';
import { CathedralFooterArt } from '../artwork/CathedralFooterArt';
import { PWAInstallButton } from '../primitives/PWAInstallButton';
import { PixelCharacter } from '../pixel/PixelCharacter';
import { StatBar } from '../primitives/StatBar';
import { XPBar } from '../primitives/XPBar';
import {
  CharacterStats,
  InventoryItem,
  PlayerClass,
  Quest,
  DayStreak,
  DailyBoss,
  UserProfile,
  ScreenId,
  SpriteAction,
} from '../../types';
import { PLAYER_CLASSES } from '../../utils/classes';
import { soundFx } from '../../utils/audio';
import {
  Shield,
  Tv,
  Volume2,
  VolumeX,
  Trophy,
  Activity,
  LogOut,
  Flame,
  Coins,
  Sparkles,
  ScrollText,
  Sliders,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Lock,
  Compass,
  Cpu,
  Bookmark,
  Layers,
  UserCheck,
  Key,
  HelpCircle,
  BookOpen,
  Swords,
  Zap,
  Award,
  Download,
  Copy,
  Check,
  Info,
  Star,
  Target,
  Heart,
  User,
  Settings,
  RefreshCw,
} from 'lucide-react';

type ProfileTab = 'profile' | 'achievements' | 'help' | 'settings';

interface ProfileScreenProps {
  playerClass: PlayerClass;
  onSelectClass: (cls: PlayerClass) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtScanlines: boolean;
  onToggleScanlines: () => void;
  onResetToSplash: () => void;
  level?: number;
  xp?: number;
  maxXp?: number;
  gold?: number;
  stats?: CharacterStats;
  quests?: Quest[];
  inventory?: InventoryItem[];
  streakDays?: number;
  streak?: DayStreak[];
  dailyBoss?: DailyBoss;
  unlockedClasses?: PlayerClass[];
  equippedItems?: InventoryItem[];
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  onNavigate?: (screen: ScreenId) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  playerClass = 'sorcerer',
  onSelectClass,
  soundEnabled,
  onToggleSound,
  crtScanlines,
  onToggleScanlines,
  onResetToSplash,
  level = 12,
  xp = 320,
  maxXp = 500,
  gold = 1240,
  stats = { strength: 14, intelligence: 24, vitality: 16, focus: 22 },
  quests = [],
  inventory = [],
  streakDays = 7,
  streak = [],
  dailyBoss = { name: 'Corrupted Behemoth', title: 'Scourge of the Ashen Waste', currentHp: 0, maxHp: 400, defeated: true },
  unlockedClasses = ['sorcerer'],
  equippedItems = [],
  currentUser,
  onOpenAuthModal,
  onLogout,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [characterAction, setCharacterAction] = useState<SpriteAction>('idle');
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [achievementCategory, setAchievementCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [expandedGuide, setExpandedGuide] = useState<string | null>('quests');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedState, setCopiedState] = useState(false);

  const classDef = PLAYER_CLASSES[playerClass] || PLAYER_CLASSES.sorcerer;

  // Real-time calculated game progression metrics
  const completedQuestsCount = useMemo(() => quests.filter((q) => q.completed).length, [quests]);
  const ownedItemsCount = useMemo(() => inventory.filter((i) => i.owned).length, [inventory]);

  // Master Achievements Database with dynamic unlocking & progress
  const ACHIEVEMENTS = useMemo(() => {
    return [
      {
        id: 'first-flame',
        title: 'First Kindling',
        category: 'Initiation',
        desc: 'Complete your first habit and kindle the flame of discipline.',
        unlocked: completedQuestsCount >= 1 || level > 1,
        progress: Math.min(1, completedQuestsCount),
        maxProgress: 1,
        goldReward: 50,
        xpReward: 30,
        icon: <Flame className="w-4 h-4 text-[#E0522D]" />,
      },
      {
        id: 'streak-7',
        title: 'Keeper of Embers',
        category: 'Discipline',
        desc: 'Maintain an unbroken 7-day streak at the sacred Bonfire.',
        unlocked: streakDays >= 7,
        progress: Math.min(7, streakDays),
        maxProgress: 7,
        goldReward: 150,
        xpReward: 100,
        icon: <Sparkles className="w-4 h-4 text-[#F0C75E]" />,
      },
      {
        id: 'streak-14',
        title: 'Titan of Will',
        category: 'Discipline',
        desc: 'Sustain uninterrupted daily discipline for 14 continuous suns.',
        unlocked: streakDays >= 14,
        progress: Math.min(14, streakDays),
        maxProgress: 14,
        goldReward: 300,
        xpReward: 250,
        icon: <Shield className="w-4 h-4 text-[#C99A3D]" />,
      },
      {
        id: 'level-5',
        title: 'Aspirant of the Path',
        category: 'Mastery',
        desc: 'Rise through the ranks and achieve Character Level 5.',
        unlocked: level >= 5,
        progress: Math.min(5, level),
        maxProgress: 5,
        goldReward: 100,
        xpReward: 75,
        icon: <Award className="w-4 h-4 text-[#4CA7D8]" />,
      },
      {
        id: 'level-10',
        title: 'Arch-Mage Champion',
        category: 'Mastery',
        desc: 'Attain Level 10 and surpass 20 points in your primary discipline.',
        unlocked: level >= 10 && (stats.intelligence >= 20 || stats.strength >= 20 || stats.vitality >= 20 || stats.focus >= 20),
        progress: Math.min(10, level),
        maxProgress: 10,
        goldReward: 250,
        xpReward: 200,
        icon: <Zap className="w-4 h-4 text-[#A78BFA]" />,
      },
      {
        id: 'level-25',
        title: 'Lord of the Hearth',
        category: 'Mastery',
        desc: 'Surpass Level 25 and establish legendary sovereign discipline.',
        unlocked: level >= 25,
        progress: Math.min(25, level),
        maxProgress: 25,
        goldReward: 1000,
        xpReward: 800,
        icon: <Trophy className="w-4 h-4 text-[#F0C75E]" />,
      },
      {
        id: 'boss-slayer',
        title: 'Behemoth Vanquisher',
        category: 'Combat',
        desc: 'Fulfill your daily quests and completely vanquish the Daily Realm Boss.',
        unlocked: dailyBoss?.defeated || (dailyBoss?.currentHp === 0),
        progress: dailyBoss?.defeated ? 1 : Math.max(0, (dailyBoss.maxHp - dailyBoss.currentHp) / dailyBoss.maxHp),
        maxProgress: 1,
        goldReward: 200,
        xpReward: 180,
        icon: <Swords className="w-4 h-4 text-[#D94B38]" />,
      },
      {
        id: 'relic-collector',
        title: 'Relic Bearer',
        category: 'Armory',
        desc: 'Equip relics, weapons, or enchanted robes from your inventory.',
        unlocked: equippedItems.length > 0,
        progress: Math.min(1, equippedItems.length),
        maxProgress: 1,
        goldReward: 80,
        xpReward: 50,
        icon: <Layers className="w-4 h-4 text-[#62A96B]" />,
      },
      {
        id: 'armory-master',
        title: 'Arsenal of Kings',
        category: 'Armory',
        desc: 'Acquire at least 3 distinct pieces of equipment in the Armory.',
        unlocked: ownedItemsCount >= 3,
        progress: Math.min(3, ownedItemsCount),
        maxProgress: 3,
        goldReward: 200,
        xpReward: 150,
        icon: <Bookmark className="w-4 h-4 text-[#E0522D]" />,
      },
      {
        id: 'vocation-master',
        title: 'Legion Commander',
        category: 'Mastery',
        desc: 'Unlock multiple player vocations in the sacred sanctum.',
        unlocked: unlockedClasses.length > 1,
        progress: Math.min(4, unlockedClasses.length),
        maxProgress: 4,
        goldReward: 350,
        xpReward: 300,
        icon: <Compass className="w-4 h-4 text-[#F0C75E]" />,
      },
      {
        id: 'gold-hoarder',
        title: 'Cinder Merchant',
        category: 'Wealth',
        desc: 'Amass a personal fortune of 1,000+ Gold coins.',
        unlocked: gold >= 1000,
        progress: Math.min(1000, gold),
        maxProgress: 1000,
        goldReward: 150,
        xpReward: 100,
        icon: <Coins className="w-4 h-4 text-[#F0C75E]" />,
      },
      {
        id: 'intellect-master',
        title: 'Sanctum of Intellect',
        category: 'Discipline',
        desc: 'Raise your Intelligence attribute to 20 or higher through study.',
        unlocked: stats.intelligence >= 20,
        progress: Math.min(20, stats.intelligence),
        maxProgress: 20,
        goldReward: 120,
        xpReward: 100,
        icon: <BookOpen className="w-4 h-4 text-[#4CA7D8]" />,
      },
      {
        id: 'strength-master',
        title: 'Crucible of Fortitude',
        category: 'Discipline',
        desc: 'Raise your Strength attribute to 20 or higher through physical trials.',
        unlocked: stats.strength >= 20,
        progress: Math.min(20, stats.strength),
        maxProgress: 20,
        goldReward: 120,
        xpReward: 100,
        icon: <Activity className="w-4 h-4 text-[#D94B38]" />,
      },
      {
        id: 'focus-zenith',
        title: 'Zenith of Concentration',
        category: 'Discipline',
        desc: 'Elevate your Focus attribute to 20 or higher via deep work sessions.',
        unlocked: stats.focus >= 20,
        progress: Math.min(20, stats.focus),
        maxProgress: 20,
        goldReward: 120,
        xpReward: 100,
        icon: <Target className="w-4 h-4 text-[#D5A441]" />,
      },
    ];
  }, [completedQuestsCount, streakDays, level, stats, dailyBoss, equippedItems, ownedItemsCount, unlockedClasses, gold]);

  const unlockedCount = useMemo(() => ACHIEVEMENTS.filter((a) => a.unlocked).length, [ACHIEVEMENTS]);
  const completionPercentage = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100);

  const categories = useMemo(() => {
    const set = new Set(ACHIEVEMENTS.map((a) => a.category));
    return ['all', ...Array.from(set)];
  }, [ACHIEVEMENTS]);

  const filteredAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter((ach) => {
      if (achievementFilter === 'unlocked' && !ach.unlocked) return false;
      if (achievementFilter === 'locked' && ach.unlocked) return false;
      if (achievementCategory !== 'all' && ach.category !== achievementCategory) return false;
      return true;
    });
  }, [ACHIEVEMENTS, achievementFilter, achievementCategory]);

  // Copy or export state
  const handleExportState = () => {
    const data = {
      username: currentUser?.username || 'AshenOne',
      email: currentUser?.email || 'demo@ashen.realm',
      playerClass,
      level,
      xp,
      maxXp,
      gold,
      stats,
      streakDays,
      unlockedClasses,
      equippedItems: equippedItems.map((i) => i.id),
      unlockedAchievements: ACHIEVEMENTS.filter((a) => a.unlocked).map((a) => a.id),
      exportedAt: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedState(true);
    soundFx.playCoin();
    setTimeout(() => setCopiedState(false), 2500);
  };

  const handleTriggerSpriteAction = (action: SpriteAction) => {
    setCharacterAction(action);
    if (action === 'attack') {
      if (playerClass === 'knight') soundFx.playSwordSlash();
      else if (playerClass === 'ronin') soundFx.playKatanaSlash();
      else if (playerClass === 'sorcerer') soundFx.playMagicCast();
      else soundFx.playSwordSlash();
    } else if (action === 'cast') {
      soundFx.playMagicCast();
    } else if (action === 'victory') {
      soundFx.playLevelUp();
    } else if (action === 'roll') {
      soundFx.playDodgeRoll();
    }
  };

  return (
    <div className="min-h-screen pb-44 sm:pb-48 md:pb-16 max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto p-4 sm:p-6 space-y-6 select-none overflow-x-hidden">
      {/* 1. TOP HEADER & SANCTUARY BANNER */}
      <div className="pt-2 border-b border-[#59452A]/40 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-ornate font-bold text-2xl sm:text-3xl text-[#F0C75E] tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Sanctuary & Archives
            </h1>
            <span className="px-2 py-0.5 bg-[#141A1E] border border-[#59452A] rounded-xs font-pixel text-[9px] text-[#C99A3D]">
              v2.0
            </span>
          </div>
          <p className="font-body text-xs text-[#A99D83] mt-1">
            Soul identity, feats of valor, sanctuary chronicles, acoustic synthesizer & realm controls.
          </p>
        </div>

        {/* Quick Return to Title Gateway Button */}
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            onResetToSplash();
          }}
          className="self-start sm:self-auto px-3.5 py-1.5 bg-gradient-to-r from-[#171C20] to-[#101417] hover:from-[#222B32] hover:to-[#171E23] border border-[#8C6F3D]/35 hover:border-[#C99A3D] text-[#E7D8B5] hover:text-[#F0C75E] font-display text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Return to Ashen Gate"
        >
          <Compass className="w-3.5 h-3.5 text-[#C99A3D]" />
          <span>Title Gateway</span>
        </button>
      </div>

      {/* 2. PERSISTENT RETRO NAVIGATION TABS */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-[#090C0E]/90 border border-[#8C6F3D]/30 rounded-xl shadow-inner">
        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setActiveTab('profile');
          }}
          className={`py-2 px-1 sm:px-3 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg transition-all cursor-pointer font-display text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-[#241A10] to-[#182024] border border-[#C99A3D]/70 text-[#F0C75E] shadow-[0_2px_10px_rgba(201,154,61,0.25)]'
              : 'text-[#8E7246] hover:text-[#E7D8B5] hover:bg-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">Profile</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setActiveTab('achievements');
          }}
          className={`py-2 px-1 sm:px-3 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg transition-all cursor-pointer font-display text-[11px] sm:text-xs font-bold uppercase tracking-wider relative ${
            activeTab === 'achievements'
              ? 'bg-gradient-to-r from-[#241A10] to-[#182024] border border-[#C99A3D]/70 text-[#F0C75E] shadow-[0_2px_10px_rgba(201,154,61,0.25)]'
              : 'text-[#8E7246] hover:text-[#E7D8B5] hover:bg-white/5'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#D5A441]" />
          <span className="truncate">Feats</span>
          <span className="hidden sm:inline-block px-2 py-0.2 bg-[#080B0D] border border-[#C99A3D]/40 font-mono text-[9px] text-[#F0C75E] rounded-full">
            {unlockedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setActiveTab('help');
          }}
          className={`py-2 px-1 sm:px-3 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg transition-all cursor-pointer font-display text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
            activeTab === 'help'
              ? 'bg-gradient-to-r from-[#241A10] to-[#182024] border border-[#C99A3D]/70 text-[#F0C75E] shadow-[0_2px_10px_rgba(201,154,61,0.25)]'
              : 'text-[#8E7246] hover:text-[#E7D8B5] hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#4CA7D8]" />
          <span className="truncate">Codex</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setActiveTab('settings');
          }}
          className={`py-2 px-1 sm:px-3 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg transition-all cursor-pointer font-display text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-[#241A10] to-[#182024] border border-[#C99A3D]/70 text-[#F0C75E] shadow-[0_2px_10px_rgba(201,154,61,0.25)]'
              : 'text-[#8E7246] hover:text-[#E7D8B5] hover:bg-white/5'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#A78BFA]" />
          <span className="truncate">Settings</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HERO PROFILE & SOUL DETAILS                                        */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Hero Identity Card */}
          <RPGCard
            variant="highlight"
            ornate={true}
            className="p-5 bg-gradient-to-b from-[#141A1E] via-[#0E1317] to-[#12181C] border-2 border-[#C99A3D]"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              {/* Avatar & Animation Controller */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#080B0D] border-2 border-[#D5A441] overflow-hidden flex items-center justify-center relative shadow-[0_0_20px_rgba(213,164,65,0.3)] rounded-xs">
                  <PixelCharacter
                    playerClass={playerClass}
                    action={characterAction}
                    size="lg"
                    interactive={true}
                    equippedItems={equippedItems}
                  />
                  {/* Subtle corner badge */}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.2 bg-[#080B0D]/90 border border-[#59452A] font-pixel text-[7.5px] text-[#A99D83]">
                    16-BIT
                  </span>
                </div>

                {/* Tactical sprite pose preview buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTriggerSpriteAction('idle')}
                    className={`px-2 py-0.5 border rounded-xs font-pixel text-[8px] transition-colors cursor-pointer ${
                      characterAction === 'idle'
                        ? 'bg-[#2B2313] border-[#C99A3D] text-[#F0C75E]'
                        : 'bg-[#10171B] border-[#59452A] text-[#8E7246] hover:text-[#E7D8B5]'
                    }`}
                  >
                    Idle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerSpriteAction('attack')}
                    className={`px-2 py-0.5 border rounded-xs font-pixel text-[8px] transition-colors cursor-pointer ${
                      characterAction === 'attack'
                        ? 'bg-[#2B2313] border-[#C99A3D] text-[#F0C75E]'
                        : 'bg-[#10171B] border-[#59452A] text-[#8E7246] hover:text-[#E7D8B5]'
                    }`}
                  >
                    Attack
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerSpriteAction('cast')}
                    className={`px-2 py-0.5 border rounded-xs font-pixel text-[8px] transition-colors cursor-pointer ${
                      characterAction === 'cast'
                        ? 'bg-[#2B2313] border-[#C99A3D] text-[#F0C75E]'
                        : 'bg-[#10171B] border-[#59452A] text-[#8E7246] hover:text-[#E7D8B5]'
                    }`}
                  >
                    Cast
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerSpriteAction('victory')}
                    className={`px-2 py-0.5 border rounded-xs font-pixel text-[8px] transition-colors cursor-pointer ${
                      characterAction === 'victory'
                        ? 'bg-[#2B2313] border-[#C99A3D] text-[#F0C75E]'
                        : 'bg-[#10171B] border-[#59452A] text-[#8E7246] hover:text-[#E7D8B5]'
                    }`}
                  >
                    Cheer
                  </button>
                </div>
              </div>

              {/* Character Details & XP Progression */}
              <div className="flex-1 w-full space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#59452A]/50 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="font-ornate font-bold text-xl sm:text-2xl text-[#FFF5DC]">
                        {classDef.name}
                      </h2>
                      <span className="px-2 py-0.5 bg-[#080B0D] border border-[#C99A3D] font-pixel text-[10px] text-[#F0C75E] font-bold rounded-xs">
                        LV.{level}
                      </span>
                    </div>
                    <p className="font-display text-xs sm:text-sm text-[#C99A3D] mt-0.5">
                      {classDef.title}
                    </p>
                  </div>

                  {/* Vocation Switcher Button */}
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setShowClassModal(true);
                    }}
                    className="self-start sm:self-auto px-3 py-1.5 bg-[#172026] hover:bg-[#233038] border border-[#C99A3D] text-[#F0C75E] font-display text-[11px] font-bold uppercase tracking-wider rounded-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <RefreshCw className="w-3 h-3 text-[#C99A3D]" />
                    <span>Change Vocation</span>
                  </button>
                </div>

                {/* Level and XP Bar */}
                <div>
                  <XPBar level={level} currentXp={xp} maxXp={maxXp} tall={true} />
                </div>

                {/* Quick Resource Bar */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 bg-[#090D10] border border-[#59452A] rounded-xs flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#1F190D] border border-[#C99A3D] flex items-center justify-center rounded-xs shrink-0">
                      <Coins className="w-3.5 h-3.5 text-[#F0C75E]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-pixel text-[8px] text-[#8E7246] uppercase">Treasury</div>
                      <div className="font-pixel text-[10px] text-[#F0C75E] truncate">{gold} Gold</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#090D10] border border-[#59452A] rounded-xs flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#21120D] border border-[#B84025] flex items-center justify-center rounded-xs shrink-0">
                      <Flame className="w-3.5 h-3.5 text-[#E0522D]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-pixel text-[8px] text-[#8E7246] uppercase">Bonfire</div>
                      <div className="font-pixel text-[10px] text-[#E0522D] truncate">{streakDays}d Streak</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#090D10] border border-[#59452A] rounded-xs flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#0F1E14] border border-[#62A96B] flex items-center justify-center rounded-xs shrink-0">
                      <Layers className="w-3.5 h-3.5 text-[#62A96B]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-pixel text-[8px] text-[#8E7246] uppercase">Equipment</div>
                      <div className="font-pixel text-[10px] text-[#62A96B] truncate">{equippedItems.length} Relics</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RPGCard>

          {/* Core Disciplines & Attributes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#59452A] pb-2">
              <h2 className="font-display font-bold text-xs uppercase tracking-widest text-[#D5A441] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#D5A441]" />
                <span>Core Disciplines & Attributes</span>
              </h2>
              <span className="font-pixel text-[8.5px] text-[#8E7246]">
                MAX 40
              </span>
            </div>

            <RPGCard className="p-4 bg-[#0D1215] border-2 border-[#59452A] space-y-3.5">
              <StatBar type="strength" value={stats.strength} maxValue={35} />
              <StatBar type="intelligence" value={stats.intelligence} maxValue={35} />
              <StatBar type="vitality" value={stats.vitality} maxValue={35} />
              <StatBar type="focus" value={stats.focus} maxValue={35} />
            </RPGCard>
          </div>

          {/* Soul Identity & Cloud State Card */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-xs uppercase tracking-widest text-[#D5A441] border-b border-[#59452A] pb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#62A96B]" />
              <span>Soul Link & Cloud Sanctum</span>
            </h2>

            <RPGCard
              variant="highlight"
              className="p-4 sm:p-5 bg-gradient-to-r from-[#10171B] via-[#0D1215] to-[#12191D] border-2 border-[#C99A3D]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xs bg-[#1F190D] border-2 border-[#C99A3D] flex items-center justify-center text-[#F0C75E] shrink-0 shadow-inner">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-base text-[#FFF5DC] tracking-wide truncate">
                        {currentUser?.username || 'AshenOne'}
                      </span>
                      <span className="font-pixel text-[8px] px-2 py-0.5 bg-[#102016] text-[#62A96B] border border-[#62A96B]/60 rounded-xs uppercase">
                        Synchronized
                      </span>
                    </div>
                    <div className="font-body text-xs text-[#A99D83] truncate mt-0.5">
                      {currentUser?.email || 'ashen.one@firelink.realm'} • Soul ID: {currentUser?.id || 'usr_ashen_hero_01'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#59452A]/40">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      onOpenAuthModal?.();
                    }}
                    className="px-3.5 py-2 bg-[#1B150A] hover:bg-[#2D210F] border border-[#C99A3D] text-[#F0C75E] font-display text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Key className="w-3.5 h-3.5 text-[#C99A3D]" />
                    <span>Switch Soul</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setShowLogoutConfirm(true);
                    }}
                    className="px-3.5 py-2 bg-gradient-to-r from-[#2B1414] to-[#1E0D0D] hover:from-[#3D1A1A] hover:to-[#2B1414] border border-[#DC2626]/70 text-[#FCA5A5] hover:text-white font-display text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    title="Sign Out / Logout"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </RPGCard>
          </div>

          {/* Journey Lifetime Milestones Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <RPGCard className="p-3 bg-[#0D1215] border border-[#59452A] text-center space-y-1">
              <div className="font-pixel text-[8px] text-[#8E7246] uppercase">Quests Completed</div>
              <div className="font-ornate font-bold text-lg text-[#F0C75E]">{completedQuestsCount} / {quests.length}</div>
              <div className="font-body text-[10px] text-[#A99D83]">Daily Habits Done</div>
            </RPGCard>

            <RPGCard className="p-3 bg-[#0D1215] border border-[#59452A] text-center space-y-1">
              <div className="font-pixel text-[8px] text-[#8E7246] uppercase">Feats Unlocked</div>
              <div className="font-ornate font-bold text-lg text-[#62A96B]">{unlockedCount} / {ACHIEVEMENTS.length}</div>
              <div className="font-body text-[10px] text-[#A99D83]">{completionPercentage}% Completed</div>
            </RPGCard>

            <RPGCard className="p-3 bg-[#0D1215] border border-[#59452A] text-center space-y-1">
              <div className="font-pixel text-[8px] text-[#8E7246] uppercase">Daily Behemoth</div>
              <div className="font-ornate font-bold text-lg text-[#D94B38]">
                {dailyBoss?.defeated ? 'Vanquished' : `${dailyBoss?.currentHp} HP`}
              </div>
              <div className="font-body text-[10px] text-[#A99D83]">Realm Defense</div>
            </RPGCard>

            <RPGCard className="p-3 bg-[#0D1215] border border-[#59452A] text-center space-y-1">
              <div className="font-pixel text-[8px] text-[#8E7246] uppercase">Vocations Mastered</div>
              <div className="font-ornate font-bold text-lg text-[#A78BFA]">{unlockedClasses.length} / 4</div>
              <div className="font-body text-[10px] text-[#A99D83]">Classes Unlocked</div>
            </RPGCard>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FEATS OF VALOR & ACHIEVEMENTS CODEX                                */}
      {/* ========================================================================= */}
      {activeTab === 'achievements' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Overview Banner */}
          <RPGCard
            variant="highlight"
            className="p-4 sm:p-5 bg-gradient-to-r from-[#17140B] via-[#0E1317] to-[#17140B] border-2 border-[#C99A3D]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xs bg-[#241B0B] border-2 border-[#F0C75E] flex items-center justify-center text-[#F0C75E] shadow-[0_0_15px_rgba(240,199,94,0.3)] shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-ornate font-bold text-lg sm:text-xl text-[#F0C75E]">
                    Feats of Valor Codex
                  </h2>
                  <p className="font-body text-xs text-[#A99D83] mt-0.5">
                    Permanent milestones across discipline, habit consistency, combat, and wealth.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#090C0E] border border-[#59452A] p-2.5 rounded-xs shrink-0 self-start sm:self-auto">
                <div className="text-right">
                  <div className="font-pixel text-[8.5px] text-[#8E7246] uppercase">Mastery Index</div>
                  <div className="font-pixel text-xs text-[#F0C75E] font-bold">
                    {unlockedCount} / {ACHIEVEMENTS.length}
                  </div>
                </div>
                <div className="w-12 h-12 relative flex items-center justify-center bg-[#141A1E] border border-[#C99A3D] rounded-full">
                  <span className="font-pixel text-[10px] text-[#F0C75E] font-bold">{completionPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Overall Progress Meter */}
            <div className="mt-4 pt-3 border-t border-[#59452A]/50">
              <div className="w-full bg-[#080B0D] border border-[#59452A] p-[2px] h-3 rounded-xs">
                <div
                  className="h-full bg-gradient-to-r from-[#B84025] via-[#C99A3D] to-[#F0C75E] transition-all duration-500 rounded-[1px]"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </RPGCard>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0A0D10] p-3 border border-[#59452A] rounded-xs">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {(['all', 'unlocked', 'locked'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setAchievementFilter(filter);
                  }}
                  className={`px-3 py-1 rounded-xs font-display text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    achievementFilter === filter
                      ? 'bg-[#C99A3D] text-[#080B0D]'
                      : 'bg-[#11171A] border border-[#59452A] text-[#8E7246] hover:text-[#E7D8B5]'
                  }`}
                >
                  {filter === 'all' ? 'All Feats' : filter === 'unlocked' ? 'Unlocked' : 'Locked'}
                </button>
              ))}
            </div>

            {/* Category Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setAchievementCategory(cat);
                  }}
                  className={`px-2.5 py-1 rounded-xs font-pixel text-[8.5px] uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    achievementCategory === cat
                      ? 'bg-[#1F190D] border border-[#C99A3D] text-[#F0C75E]'
                      : 'bg-[#0E1317] border border-[#3D2D1B] text-[#8E7246] hover:text-[#E7D8B5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Achievement Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAchievements.map((ach) => {
              const progressPct = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

              return (
                <RPGCard
                  key={ach.id}
                  variant={ach.unlocked ? 'highlight' : 'dark'}
                  className={`p-4 transition-all ${
                    ach.unlocked
                      ? 'bg-gradient-to-r from-[#12191D] via-[#0E1418] to-[#12191D] border-2 border-[#C99A3D]/90 shadow-md'
                      : 'bg-[#0A0D10] border border-[#3D2D1B] opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xs border flex items-center justify-center shrink-0 mt-0.5 ${
                          ach.unlocked
                            ? 'bg-[#20180B] border-[#F0C75E] text-[#F0C75E] shadow-sm'
                            : 'bg-[#0F1418] border-[#3D2D1B] text-[#59452A]'
                        }`}
                      >
                        {ach.icon}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-display font-bold text-sm tracking-wide truncate ${
                              ach.unlocked ? 'text-[#F0C75E]' : 'text-[#8E7246]'
                            }`}
                          >
                            {ach.title}
                          </h3>
                        </div>

                        <span className="font-pixel text-[7.5px] px-1.5 py-0.2 bg-[#080B0D] border border-[#59452A]/70 text-[#A99D83] rounded-xs uppercase mt-0.5 inline-block">
                          {ach.category}
                        </span>

                        <p className="font-body text-xs text-[#A99D83] mt-1.5 leading-relaxed">
                          {ach.desc}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {ach.unlocked ? (
                        <div className="flex items-center gap-1 bg-[#102016] border border-[#62A96B] px-2 py-0.5 rounded-xs text-[#62A96B]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="font-pixel text-[7.5px] font-bold">UNLOCKED</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-[#14181B] border border-[#59452A] px-2 py-0.5 rounded-xs text-[#8E7246]">
                          <Lock className="w-3.5 h-3.5" />
                          <span className="font-pixel text-[7.5px]">LOCKED</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar & Reward Tokens */}
                  <div className="mt-3.5 pt-2.5 border-t border-[#59452A]/40 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between font-pixel text-[8px] text-[#8E7246] mb-1">
                        <span>Progress</span>
                        <span className={ach.unlocked ? 'text-[#62A96B]' : 'text-[#C99A3D]'}>
                          {ach.progress} / {ach.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-[#080B0D] border border-[#59452A] p-[1px] h-2 rounded-xs">
                        <div
                          className={`h-full transition-all duration-300 rounded-[1px] ${
                            ach.unlocked
                              ? 'bg-[#62A96B]'
                              : 'bg-gradient-to-r from-[#B84025] to-[#C99A3D]'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-pixel text-[8px] text-[#F0C75E] bg-[#1A140A] border border-[#C99A3D]/60 px-2 py-0.5 rounded-xs flex items-center gap-1">
                        <Coins className="w-2.5 h-2.5" />
                        +{ach.goldReward}G
                      </span>
                      <span className="font-pixel text-[8px] text-[#4CA7D8] bg-[#0A141A] border border-[#4CA7D8]/60 px-2 py-0.5 rounded-xs flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" />
                        +{ach.xpReward}XP
                      </span>
                    </div>
                  </div>
                </RPGCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SANCTUARY CODEX, HELP & LORE MANUAL                                */}
      {/* ========================================================================= */}
      {activeTab === 'help' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner */}
          <RPGCard
            variant="highlight"
            className="p-4 sm:p-5 bg-gradient-to-r from-[#141B20] via-[#0E1317] to-[#141B20] border-2 border-[#4CA7D8]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xs bg-[#0F202B] border-2 border-[#4CA7D8] flex items-center justify-center text-[#72C7F0] shadow-[0_0_15px_rgba(76,167,216,0.3)] shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-ornate font-bold text-lg sm:text-xl text-[#72C7F0]">
                  Codex of Sovereign Knowledge
                </h2>
                <p className="font-body text-xs text-[#A99D83] mt-0.5">
                  The definitive guide to the Ashen Path habit mechanics, combat formulas, attribute scaling, and keybindings.
                </p>
              </div>
            </div>
          </RPGCard>

          {/* Interactive Guides Section */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-[#D5A441] border-b border-[#59452A] pb-2 flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-[#D5A441]" />
              <span>Sanctuary Guides & Mechanics</span>
            </h3>

            {/* Guide 1: Core Habit Tracker */}
            <RPGCard
              onClick={() => {
                soundFx.playClick();
                setExpandedGuide(expandedGuide === 'quests' ? null : 'quests');
              }}
              className="p-4 bg-[#0D1215] border-2 border-[#59452A] cursor-pointer hover:border-[#C99A3D] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xs bg-[#1C160B] border border-[#C99A3D] flex items-center justify-center text-[#F0C75E]">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="font-display font-bold text-sm text-[#E7D8B5]">
                    1. The Sacred Crucible: Habits into Power
                  </span>
                </div>
                {expandedGuide === 'quests' ? (
                  <ChevronUp className="w-4 h-4 text-[#C99A3D]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#8E7246]" />
                )}
              </div>

              {expandedGuide === 'quests' && (
                <div className="mt-3 pt-3 border-t border-[#59452A]/50 text-xs font-body text-[#C8BEA8] leading-relaxed space-y-2">
                  <p>
                    Every daily habit in your life is mapped to a sacred <strong>Quest</strong> in the realm. When you complete a habit in the physical world and mark it in Ashen Path:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[#E7D8B5] pl-2">
                    <li>You earn <strong>Experience Points (XP)</strong> that elevate your character level.</li>
                    <li>You gain <strong>Gold coins</strong> to spend at the Armory on permanent gear.</li>
                    <li>Your hero executes a real-time combat slash, striking the <strong>Daily Behemoth</strong> for direct damage.</li>
                    <li>Your assigned discipline attribute (Strength, Intellect, Vitality, or Focus) increases by +1.</li>
                  </ul>
                </div>
              )}
            </RPGCard>

            {/* Guide 2: The Daily Behemoth */}
            <RPGCard
              onClick={() => {
                soundFx.playClick();
                setExpandedGuide(expandedGuide === 'boss' ? null : 'boss');
              }}
              className="p-4 bg-[#0D1215] border-2 border-[#59452A] cursor-pointer hover:border-[#C99A3D] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xs bg-[#240F0D] border border-[#D94B38] flex items-center justify-center text-[#D94B38]">
                    <Swords className="w-4 h-4" />
                  </div>
                  <span className="font-display font-bold text-sm text-[#E7D8B5]">
                    2. Combat with the Daily Realm Behemoth
                  </span>
                </div>
                {expandedGuide === 'boss' ? (
                  <ChevronUp className="w-4 h-4 text-[#C99A3D]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#8E7246]" />
                )}
              </div>

              {expandedGuide === 'boss' && (
                <div className="mt-3 pt-3 border-t border-[#59452A]/50 text-xs font-body text-[#C8BEA8] leading-relaxed space-y-2">
                  <p>
                    At the rise of each sun, a new Behemoth threatens the gates of the sanctuary. The creature boasts a health bar scaled to your total daily quests.
                  </p>
                  <p>
                    Each quest you fulfill strikes the beast for <strong className="text-[#F0C75E]">1.5x XP value in damage</strong>. Fulfilling all your daily rituals results in complete victory, vanquishing the nightmare and unlocking prestigious combat achievements.
                  </p>
                </div>
              )}
            </RPGCard>

            {/* Guide 3: The Bonfire & Streak Multipliers */}
            <RPGCard
              onClick={() => {
                soundFx.playClick();
                setExpandedGuide(expandedGuide === 'bonfire' ? null : 'bonfire');
              }}
              className="p-4 bg-[#0D1215] border-2 border-[#59452A] cursor-pointer hover:border-[#C99A3D] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xs bg-[#26130B] border border-[#E0522D] flex items-center justify-center text-[#E0522D]">
                    <Flame className="w-4 h-4" />
                  </div>
                  <span className="font-display font-bold text-sm text-[#E7D8B5]">
                    3. The Sacred Bonfire & Unbroken Streaks
                  </span>
                </div>
                {expandedGuide === 'bonfire' ? (
                  <ChevronUp className="w-4 h-4 text-[#C99A3D]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#8E7246]" />
                )}
              </div>

              {expandedGuide === 'bonfire' && (
                <div className="mt-3 pt-3 border-t border-[#59452A]/50 text-xs font-body text-[#C8BEA8] leading-relaxed space-y-2">
                  <p>
                    The Bonfire is the beating heart of your kingdom. Maintaining your daily streak feeds the ancient hearth with kindling:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[#E7D8B5] pl-2">
                    <li><strong>7-Day Streak:</strong> Kindles the flame to Rank 1 and unlocks the <em>Keeper of Embers</em> title.</li>
                    <li><strong>14-Day Streak:</strong> Unlocks higher tier shop relics and <em>Titan of Will</em>.</li>
                    <li><strong>30-Day Streak:</strong> Ignites the Great Flame, granting a permanent aesthetic aura to your hero sprite.</li>
                  </ul>
                </div>
              )}
            </RPGCard>

            {/* Guide 4: Vocations & Disciplines */}
            <RPGCard
              onClick={() => {
                soundFx.playClick();
                setExpandedGuide(expandedGuide === 'classes' ? null : 'classes');
              }}
              className="p-4 bg-[#0D1215] border-2 border-[#59452A] cursor-pointer hover:border-[#C99A3D] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xs bg-[#1F1429] border border-[#8D70B8] flex items-center justify-center text-[#A78BFA]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-display font-bold text-sm text-[#E7D8B5]">
                    4. Vocations & Attribute Synergy
                  </span>
                </div>
                {expandedGuide === 'classes' ? (
                  <ChevronUp className="w-4 h-4 text-[#C99A3D]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#8E7246]" />
                )}
              </div>

              {expandedGuide === 'classes' && (
                <div className="mt-3 pt-3 border-t border-[#59452A]/50 text-xs font-body text-[#C8BEA8] leading-relaxed space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 bg-[#11171A] border border-[#59452A] rounded-xs">
                      <div className="font-display font-bold text-[#F0C75E] text-[11px]">SORCERER (Intellect & Focus)</div>
                      <p className="text-[11px] text-[#A99D83] mt-1">Specializes in reading, technical mastery, code architecture, and study habits.</p>
                    </div>
                    <div className="p-2.5 bg-[#11171A] border border-[#59452A] rounded-xs">
                      <div className="font-display font-bold text-[#D94B38] text-[11px]">KNIGHT (Strength & Vitality)</div>
                      <p className="text-[11px] text-[#A99D83] mt-1">Specializes in physical conditioning, gym sessions, athletic stamina, and martial vigor.</p>
                    </div>
                    <div className="p-2.5 bg-[#11171A] border border-[#59452A] rounded-xs">
                      <div className="font-display font-bold text-[#F0C75E] text-[11px]">RONIN (Focus & Strength)</div>
                      <p className="text-[11px] text-[#A99D83] mt-1">Master of deep work sprints, unwavering stoicism, and razor-sharp concentration.</p>
                    </div>
                    <div className="p-2.5 bg-[#11171A] border border-[#59452A] rounded-xs">
                      <div className="font-display font-bold text-[#62A96B] text-[11px]">ROGUE (Vitality & Agility)</div>
                      <p className="text-[11px] text-[#A99D83] mt-1">Specializes in sleep hygiene, cold hydration, recovery, and daily routine efficiency.</p>
                    </div>
                  </div>
                </div>
              )}
            </RPGCard>
          </div>

          {/* Frequently Asked Questions (FAQ) */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-[#D5A441] border-b border-[#59452A] pb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#4CA7D8]" />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-2">
              {[
                {
                  q: 'How do I add a new custom habit/quest?',
                  a: 'Navigate to the Home screen and tap the "+ Forge New Quest" button. Choose your habit category, attribute reward, XP yield, and repeat frequency (daily or weekly).',
                },
                {
                  q: 'Can I change my vocation or class later?',
                  a: 'Yes! Unlock new vocations in the Stats screen or via the Vocation Switcher in your Profile. Once unlocked, you can switch between Knight, Ronin, Sorcerer, and Rogue at zero penalty.',
                },
                {
                  q: 'Does Ashen Path work offline without an internet connection?',
                  a: 'Yes. All state is automatically mirrored in high-speed local browser storage. When you reconnect, it will sync with the sovereign backend database.',
                },
                {
                  q: 'How do I purchase and equip relics from the Armory?',
                  a: 'Open the Inventory tab from the bottom navigation. Use gold earned from your daily quests to buy armor, swords, tomes, and lanterns. Tap "Equip" to activate their passive stat bonuses.',
                },
                {
                  q: 'What are the keyboard shortcuts for desktop navigation?',
                  a: 'You can quickly navigate tabs: [1] Quests/Home, [2] Stats & Character, [3] Inventory & Armory, [4] Profile & Sanctuary. Press [Space] to kindle the bonfire, and [Escape] to close open modals.',
                },
              ].map((faq, idx) => (
                <RPGCard
                  key={idx}
                  onClick={() => {
                    soundFx.playClick();
                    setExpandedFaq(expandedFaq === idx ? null : idx);
                  }}
                  className="p-3.5 bg-[#0D1215] border border-[#59452A] cursor-pointer hover:border-[#C99A3D] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-xs text-[#E7D8B5]">
                      {faq.q}
                    </span>
                    {expandedFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-[#C99A3D] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8E7246] shrink-0" />
                    )}
                  </div>
                  {expandedFaq === idx && (
                    <p className="mt-2.5 pt-2 border-t border-[#59452A]/40 font-body text-xs text-[#A99D83] leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </RPGCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SETTINGS, SHADERS, AUDIO & REALM CONTROLS                          */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* PWA Install Banner */}
          <PWAInstallButton />

          {/* Visual & Audio Engine Settings */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-xs uppercase tracking-widest text-[#D5A441] border-b border-[#59452A] pb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D5A441]" />
              <span>Acoustic Synthesizer & Visual Shaders</span>
            </h2>

            <div className="space-y-2.5">
              {/* CRT Scanline Shader */}
              <RPGCard
                onClick={() => {
                  soundFx.playClick();
                  onToggleScanlines();
                }}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:border-[#C99A3D] bg-[#0D1215] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xs bg-[#141B20] border border-[#59452A] flex items-center justify-center text-[#A78BFA] shrink-0">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-semibold text-xs tracking-wider text-[#E7D8B5] truncate sm:whitespace-normal">
                      CRT Phosphor Scanline Shader
                    </div>
                    <div className="font-body text-[11px] text-[#A99D83] line-clamp-1 sm:line-clamp-none">
                      Authentic 1990s retro cathode ray tube phosphor effect overlay
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`font-pixel text-[8.5px] px-2.5 py-1 border rounded-xs whitespace-nowrap ${
                      crtScanlines
                        ? 'bg-[#18261E] border-[#62A96B] text-[#62A96B] font-bold'
                        : 'bg-[#11171A] border-[#59452A] text-[#6F695C]'
                    }`}
                  >
                    {crtScanlines ? 'ACTIVE' : 'OFF'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#59452A] shrink-0" />
                </div>
              </RPGCard>

              {/* Web Audio 16-bit Synthesizer */}
              <RPGCard
                onClick={() => {
                  onToggleSound();
                }}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:border-[#C99A3D] bg-[#0D1215] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xs bg-[#141B20] border border-[#59452A] flex items-center justify-center text-[#F0C75E] shrink-0">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-[#8E7246]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-semibold text-xs tracking-wider text-[#E7D8B5] truncate sm:whitespace-normal">
                      Web Audio 16-bit Synthesizer
                    </div>
                    <div className="font-body text-[11px] text-[#A99D83] line-clamp-1 sm:line-clamp-none">
                      Square-wave retro bleeps, sword slashes, coin chimes & magic casts
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`font-pixel text-[8.5px] px-2.5 py-1 border rounded-xs whitespace-nowrap ${
                      soundEnabled
                        ? 'bg-[#211E10] border-[#C99A3D] text-[#F0C75E] font-bold'
                        : 'bg-[#11171A] border-[#59452A] text-[#6F695C]'
                    }`}
                  >
                    {soundEnabled ? 'ENABLED' : 'MUTED'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#59452A] shrink-0" />
                </div>
              </RPGCard>

              {/* Acoustic Synthesizer Sound Board */}
              <RPGCard className="p-3 bg-[#0B0E10] border border-[#59452A]/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[8px] text-[#A99D83] uppercase tracking-wider">
                    Audio Synthesizer Soundboard Test:
                  </span>
                  <span className="font-pixel text-[7.5px] text-[#8E7246]">Oscillator Matrix</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => soundFx.playCoin()}
                    className="px-2.5 py-1 bg-[#151D20] hover:bg-[#1F2B30] border border-[#59452A] text-[#F0C75E] font-pixel text-[8px] rounded-xs cursor-pointer"
                  >
                    Coin Chime
                  </button>
                  <button
                    type="button"
                    onClick={() => soundFx.playSwordSlash()}
                    className="px-2.5 py-1 bg-[#151D20] hover:bg-[#1F2B30] border border-[#59452A] text-[#D94B38] font-pixel text-[8px] rounded-xs cursor-pointer"
                  >
                    Sword Slash
                  </button>
                  <button
                    type="button"
                    onClick={() => soundFx.playMagicCast()}
                    className="px-2.5 py-1 bg-[#151D20] hover:bg-[#1F2B30] border border-[#59452A] text-[#A78BFA] font-pixel text-[8px] rounded-xs cursor-pointer"
                  >
                    Magic Cast
                  </button>
                  <button
                    type="button"
                    onClick={() => soundFx.playLevelUp()}
                    className="px-2.5 py-1 bg-[#151D20] hover:bg-[#1F2B30] border border-[#59452A] text-[#62A96B] font-pixel text-[8px] rounded-xs cursor-pointer"
                  >
                    Fanfare
                  </button>
                  <button
                    type="button"
                    onClick={() => soundFx.playBonfireKindle()}
                    className="px-2.5 py-1 bg-[#151D20] hover:bg-[#1F2B30] border border-[#59452A] text-[#E0522D] font-pixel text-[8px] rounded-xs cursor-pointer"
                  >
                    Bonfire Roar
                  </button>
                </div>
              </RPGCard>
            </div>
          </div>

          {/* Soul State Management & Data Portability */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-xs uppercase tracking-widest text-[#D5A441] border-b border-[#59452A] pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D5A441]" />
              <span>Soul State & Data Management</span>
            </h2>

            <div className="space-y-2.5">
              {/* Soul Switch & Authentication */}
              <RPGCard
                onClick={() => {
                  soundFx.playClick();
                  onOpenAuthModal?.();
                }}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:border-[#C99A3D] bg-[#0D1215] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xs bg-[#1F190D] border border-[#C99A3D] flex items-center justify-center text-[#F0C75E] shrink-0">
                    <Key className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-semibold text-xs tracking-wider text-[#E7D8B5]">
                      Switch Soul / Sanctum Login
                    </div>
                    <div className="font-body text-[11px] text-[#A99D83]">
                      Connected as <strong className="text-[#F0C75E]">{currentUser?.username || 'AshenOne'}</strong> • Register or switch profile
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#59452A] shrink-0" />
              </RPGCard>

              {/* Export Character Journal JSON */}
              <RPGCard
                onClick={() => {
                  soundFx.playClick();
                  setShowExportModal(true);
                }}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:border-[#C99A3D] bg-[#0D1215] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xs bg-[#0F1E26] border border-[#4CA7D8] flex items-center justify-center text-[#4CA7D8] shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-semibold text-xs tracking-wider text-[#E7D8B5]">
                      Export Soul Journal (JSON Backup)
                    </div>
                    <div className="font-body text-[11px] text-[#A99D83]">
                      Save an offline cryptographic backup of your character progress
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#59452A] shrink-0" />
              </RPGCard>

              {/* Sever Soul Connection / Logout */}
              <RPGCard
                onClick={() => {
                  soundFx.playClick();
                  setShowLogoutConfirm(true);
                }}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:border-[#DC2626] bg-[#120E0E] group transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 text-[#DC2626] group-hover:text-[#F87171]">
                  <div className="w-9 h-9 rounded-xs bg-[#241010] border border-[#DC2626]/60 flex items-center justify-center text-[#F87171] shrink-0">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-display font-semibold text-xs tracking-wider block">
                      Sever Soul Connection (Sign Out)
                    </span>
                    <div className="font-body text-[11px] text-[#A99D83]">
                      Disconnect current session and clear authentication credentials
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#DC2626] shrink-0" />
              </RPGCard>
            </div>
          </div>

          {/* Engine Manifest Information */}
          <RPGCard className="p-3.5 flex items-center justify-between gap-3 bg-[#090C0E] border border-[#59452A]/60">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xs bg-[#141B20] border border-[#59452A] flex items-center justify-center text-[#38BDF8] shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display font-semibold text-xs tracking-wider text-[#E7D8B5]">
                  LifeRPG Sovereign Core Architecture
                </div>
                <div className="font-body text-[11px] text-[#8E7246]">
                  React 19 • Tailwind v4 • Web Audio API • SQLite Data Layer • Lenis Engine
                </div>
              </div>
            </div>
            <span className="font-pixel text-[8px] text-[#38BDF8] bg-[#0B1720] px-2 py-0.5 border border-[#0284C7] rounded-xs whitespace-nowrap">
              Online
            </span>
          </RPGCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATHEDRAL FOOTER ART                                                      */}
      {/* ========================================================================= */}
      <CathedralFooterArt quote="“From cinder to flame, the path is forged step by step.”" />

      {/* ========================================================================= */}
      {/* MODAL 1: SEVER SOUL LINK / LOGOUT CONFIRMATION MODAL                      */}
      {/* ========================================================================= */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0B0E12] border-2 border-[#C99A3D] max-w-md w-full p-5 sm:p-6 relative rounded-xs shadow-2xl text-[#E7D8B5]">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 p-1 text-[#A99D83] hover:text-[#E7D8B5] rounded-xs border border-transparent hover:border-[#59452A] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#59452A]/60 pb-3 mb-4">
              <div className="w-10 h-10 rounded-xs bg-[#2B1212] border border-[#DC2626] flex items-center justify-center text-[#F87171] shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-ornate font-bold text-lg text-[#FCA5A5]">
                  Sever Soul Connection?
                </h3>
                <p className="font-pixel text-[8.5px] text-[#A99D83]">
                  Sanctuary Disconnect Ritual
                </p>
              </div>
            </div>

            <p className="font-body text-xs text-[#C8BEA8] leading-relaxed mb-6">
              You are about to sign out of soul account <strong className="text-[#F0C75E]">{currentUser?.username || 'AshenOne'}</strong>. All quests, attributes, and inventory relics will remain securely archived in the sanctum database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#59452A]/60">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setShowLogoutConfirm(false);
                }}
                className="px-4 py-2 bg-[#141A1E] hover:bg-[#1E262C] border border-[#59452A] text-[#E7D8B5] font-display text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer"
              >
                Stay in Sanctum
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setShowLogoutConfirm(false);
                  onLogout?.();
                }}
                className="px-4 py-2 bg-[#8F3021] hover:bg-[#B84025] border border-[#FCA5A5] text-[#FFF5DC] font-display text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-md"
              >
                Sever Soul Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: VOCATION SELECTOR / CLASS DRAWER                                  */}
      {/* ========================================================================= */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0B0E12] border-2 border-[#C99A3D] max-w-lg w-full p-5 sm:p-6 relative rounded-xs shadow-2xl text-[#E7D8B5] max-h-[85vh] flex flex-col">
            <button
              onClick={() => setShowClassModal(false)}
              className="absolute top-4 right-4 p-1 text-[#A99D83] hover:text-[#E7D8B5] rounded-xs border border-transparent hover:border-[#59452A] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#59452A]/60 pb-3 mb-4 shrink-0">
              <div className="w-10 h-10 rounded-xs bg-[#21170A] border border-[#C99A3D] flex items-center justify-center text-[#F0C75E] shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-ornate font-bold text-lg text-[#F0C75E]">
                  Select Hero Vocation
                </h3>
                <p className="font-pixel text-[8.5px] text-[#A99D83]">
                  Switch between unlocked sacred vocations
                </p>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {(Object.keys(PLAYER_CLASSES) as PlayerClass[]).map((clsKey) => {
                const cls = PLAYER_CLASSES[clsKey];
                const isUnlocked = unlockedClasses.includes(clsKey);
                const isActive = playerClass === clsKey;

                return (
                  <div
                    key={clsKey}
                    onClick={() => {
                      if (isUnlocked && !isActive) {
                        soundFx.playCoin();
                        onSelectClass(clsKey);
                        setShowClassModal(false);
                      }
                    }}
                    className={`p-3.5 border-2 rounded-xs transition-all ${
                      isActive
                        ? 'bg-[#1D2520] border-[#62A96B] shadow-[0_0_12px_rgba(98,169,107,0.2)]'
                        : isUnlocked
                        ? 'bg-[#11171A] border-[#59452A] hover:border-[#C99A3D] cursor-pointer'
                        : 'bg-[#090C0E] border-[#362B1D] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-[#080B0D] border border-[#59452A] rounded-xs overflow-hidden flex items-center justify-center shrink-0">
                          <PixelCharacter playerClass={clsKey} action="idle" size="sm" interactive={false} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-ornate font-bold text-base text-[#FFF5DC]">
                              {cls.name}
                            </span>
                            {isActive && (
                              <span className="font-pixel text-[8px] bg-[#102016] text-[#62A96B] border border-[#62A96B] px-1.5 py-0.2 rounded-xs uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="font-display text-xs text-[#C99A3D]">{cls.title}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isUnlocked ? (
                          isActive ? (
                            <div className="w-7 h-7 bg-[#102016] border border-[#62A96B] rounded-xs flex items-center justify-center text-[#62A96B]">
                              <Check className="w-4 h-4" />
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="px-3 py-1 bg-[#182024] border border-[#C99A3D] text-[#F0C75E] font-display text-[10px] uppercase font-bold rounded-xs hover:bg-[#233038]"
                            >
                              Equip
                            </button>
                          )
                        ) : (
                          <div className="flex items-center gap-1 text-[#8E7246] font-pixel text-[8px]">
                            <Lock className="w-3.5 h-3.5" />
                            <span>{cls.unlockCost}G</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="font-body text-xs text-[#A99D83] mt-2 leading-relaxed">
                      {cls.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#59452A]/60 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowClassModal(false)}
                className="px-4 py-1.5 bg-[#C99A3D] text-[#080B0D] font-display font-bold text-xs uppercase tracking-wider rounded-xs hover:bg-[#E0B250] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EXPORT SOUL JOURNAL BACKUP MODAL                                  */}
      {/* ========================================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0B0E12] border-2 border-[#C99A3D] max-w-md w-full p-5 sm:p-6 relative rounded-xs shadow-2xl text-[#E7D8B5]">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 p-1 text-[#A99D83] hover:text-[#E7D8B5] rounded-xs border border-transparent hover:border-[#59452A] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#59452A]/60 pb-3 mb-4">
              <div className="w-10 h-10 rounded-xs bg-[#0F1E26] border border-[#4CA7D8] flex items-center justify-center text-[#4CA7D8] shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-ornate font-bold text-lg text-[#F0C75E]">
                  Export Soul Journal
                </h3>
                <p className="font-pixel text-[8.5px] text-[#A99D83]">
                  Cryptographic State Backup
                </p>
              </div>
            </div>

            <p className="font-body text-xs text-[#C8BEA8] leading-relaxed mb-4">
              Copy your complete character state, level progress, unlocked vocations, and achievements as a JSON payload for local archival or migration.
            </p>

            <div className="p-3 bg-[#080B0D] border border-[#59452A] rounded-xs mb-5 max-h-36 overflow-y-auto">
              <pre className="font-pixel text-[8px] text-[#A99D83] leading-normal whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    username: currentUser?.username || 'AshenOne',
                    playerClass,
                    level,
                    xp,
                    gold,
                    stats,
                    streakDays,
                    unlockedCount,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#59452A]/60">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-3.5 py-1.5 bg-[#141A1E] hover:bg-[#1E262C] border border-[#59452A] text-[#E7D8B5] font-display text-xs font-semibold uppercase tracking-wider rounded-xs cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleExportState}
                className="px-4 py-1.5 bg-[#C99A3D] hover:bg-[#E0B250] text-[#080B0D] font-display text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                {copiedState ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedState ? 'Copied to Clipboard!' : 'Copy Journal JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
