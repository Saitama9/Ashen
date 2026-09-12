import { useState, useEffect } from 'react';
import {
  Quest,
  QuestCategory,
  CharacterStats,
  InventoryItem,
  DayStreak,
  StatType,
  PlayerClass,
  SpriteAction,
  DailyBoss,
  UserProfile,
} from '../types';
import { PLAYER_CLASSES } from '../utils/classes';
import { soundFx } from '../utils/audio';
import { triggerEmberBurst } from '../utils/animations';
import { api } from '../services/api';

const STORAGE_KEY = 'ashen_path_retro_state_v2';

const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: 'Read for 30 minutes',
    description: 'Read any book for at least 30 minutes. Knowledge lights the way.',
    category: 'study',
    xpReward: 50,
    statType: 'intelligence',
    statAmount: 10,
    completed: true,
    repeat: 'daily',
    flavorQuote: '“A mind once kindled can never be extinguished.”',
  },
  {
    id: 'quest-2',
    title: 'Go to the Gym',
    description: 'Forge the vessel. Physical trials temper the enduring spirit.',
    category: 'fitness',
    xpReward: 70,
    statType: 'strength',
    statAmount: 15,
    completed: false,
    repeat: 'daily',
    flavorQuote: '“Steel is tested in the forge; the body in the strain.”',
  },
  {
    id: 'quest-3',
    title: 'Build a side project',
    description: 'Lay stone upon stone. Bring forth something of lasting craft.',
    category: 'work',
    xpReward: 80,
    statType: 'intelligence',
    statAmount: 15,
    completed: false,
    repeat: 'daily',
    flavorQuote: '“A cathedral rises from solitary bricks.”',
  },
  {
    id: 'quest-4',
    title: 'Morning Meditation',
    description: 'Silence the turbulent mind before the trials of the waking sun.',
    category: 'custom',
    xpReward: 40,
    statType: 'focus',
    statAmount: 10,
    completed: true,
    repeat: 'daily',
    flavorQuote: '“In stillness, find the unwavering center.”',
  },
  {
    id: 'quest-5',
    title: 'Drink 2L spring water',
    description: 'Nourish the biological embers with cold pure water.',
    category: 'health',
    xpReward: 30,
    statType: 'vitality',
    statAmount: 10,
    completed: true,
    repeat: 'daily',
    flavorQuote: '“Water sustains what fire would consume.”',
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'item-1',
    name: "Traveler's Cloak",
    type: 'armor',
    description: 'Weathered hooded mantle woven from coarse thread. Protects against biting mountain winds.',
    price: 0,
    equipped: true,
    owned: true,
    statBonus: { stat: 'vitality', amount: 2 },
    iconType: 'cloak',
  },
  {
    id: 'item-2',
    name: 'Iron Resolve',
    type: 'armor',
    description: 'Heavy plate forged in the northern kilns. Hardens the wearer against distraction.',
    price: 200,
    equipped: false,
    owned: false,
    statBonus: { stat: 'strength', amount: 4 },
    iconType: 'armor',
  },
  {
    id: 'item-3',
    name: "Scholar's Tome",
    type: 'tome',
    description: 'An illuminated codex containing lost axioms of the ancient archives.',
    price: 300,
    equipped: false,
    owned: false,
    statBonus: { stat: 'intelligence', amount: 5 },
    iconType: 'tome',
  },
  {
    id: 'item-4',
    name: 'Ember Lantern',
    type: 'relic',
    description: 'A cage of blackened brass bearing an undying cinder. Banishes shadows.',
    price: 500,
    equipped: false,
    owned: false,
    statBonus: { stat: 'focus', amount: 6 },
    iconType: 'lantern',
  },
  {
    id: 'item-5',
    name: 'Ashen Greatsword',
    type: 'weapon',
    description: 'Heavily chipped blade steeped in the residue of countless bonfires.',
    price: 800,
    equipped: false,
    owned: false,
    statBonus: { stat: 'strength', amount: 8 },
    iconType: 'sword',
  },
  {
    id: 'item-6',
    name: 'Ring of Focus',
    type: 'badge',
    description: 'Engraved gold band that anchors erratic thoughts into deep discipline.',
    price: 400,
    equipped: false,
    owned: false,
    statBonus: { stat: 'focus', amount: 5 },
    iconType: 'ring',
  },
  {
    id: 'item-7',
    name: 'Ancient Reliquary',
    type: 'relic',
    description: 'Sealed by ancient rite. Unlocks at Level 20.',
    price: 1500,
    equipped: false,
    owned: false,
    iconType: 'locked',
  },
  {
    id: 'item-8',
    name: 'Sunlight Talisman',
    type: 'badge',
    description: 'Sealed by ancient rite. Unlocks at Level 25.',
    price: 2000,
    equipped: false,
    owned: false,
    iconType: 'locked',
  },
];

const INITIAL_STREAK: DayStreak[] = [
  { day: 'Mon', completed: true },
  { day: 'Tue', completed: true },
  { day: 'Wed', completed: true },
  { day: 'Thu', completed: true },
  { day: 'Fri', completed: true },
  { day: 'Sat', completed: true },
  { day: 'Sun', completed: true },
];

const INITIAL_BOSS: DailyBoss = {
  name: 'Corrupted Behemoth',
  title: 'Scourge of the Ashen Waste',
  currentHp: 220,
  maxHp: 400,
  defeated: false,
};

export function useGameState() {
  const [playerClass, setPlayerClassState] = useState<PlayerClass>('sorcerer');
  const [unlockedClasses, setUnlockedClasses] = useState<PlayerClass[]>(['sorcerer']);
  const [heroAction, setHeroAction] = useState<SpriteAction>('idle');
  const [level, setLevel] = useState<number>(12);
  const [xp, setXp] = useState<number>(320);
  const [maxXp, setMaxXp] = useState<number>(500);
  const [gold, setGold] = useState<number>(1240);
  const [stats, setStats] = useState<CharacterStats>({
    strength: 10,
    intelligence: 18,
    vitality: 12,
    focus: 15,
  });
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [streak, setStreak] = useState<DayStreak[]>(INITIAL_STREAK);
  const [streakDays, setStreakDays] = useState<number>(7);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [crtScanlines, setCrtScanlines] = useState<boolean>(true);
  const [dailyBoss, setDailyBoss] = useState<DailyBoss>(INITIAL_BOSS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Level Up Modal State
  const [levelUpData, setLevelUpData] = useState<{
    prevLevel: number;
    newLevel: number;
    statIncreases: { stat: StatType; from: number; to: number }[];
  } | null>(null);

  // Normalize quest payload ensuring statType, statAmount, repeat always exist
  const normalizeQuest = (q: any): Quest => {
    const stat: StatType = q.statType || q.attributeTarget || 'focus';
    return {
      id: String(q.id || `quest-${Date.now()}`),
      title: String(q.title || 'Untitled Quest'),
      description: q.description || '',
      category: (q.category as QuestCategory) || 'custom',
      xpReward: Number(q.xpReward) || 50,
      statType: stat,
      statAmount: Number(q.statAmount) || 10,
      completed: Boolean(q.completed),
      repeat: q.repeat || 'daily',
      flavorQuote: q.flavorQuote || undefined,
    };
  };

  const normalizeInventoryItem = (item: any): InventoryItem => {
    let statBonus = item.statBonus;
    if (!statBonus && item.statsBonus) {
      const entries = Object.entries(item.statsBonus);
      if (entries.length > 0) {
        statBonus = { stat: entries[0][0] as StatType, amount: entries[0][1] as number };
      }
    }
    return {
      id: String(item.id),
      name: String(item.name),
      type: item.type || 'relic',
      description: item.description || '',
      price: Number(item.price) || 0,
      equipped: Boolean(item.equipped),
      owned: Boolean(item.owned),
      statBonus,
      iconType: item.iconType || 'relic',
    };
  };

  // Sync state with character payload from backend
  const applyCharacterData = (char: any) => {
    if (!char) return;
    if (char.level !== undefined) setLevel(char.level);
    if (char.xp !== undefined) setXp(char.xp);
    if (char.maxXp !== undefined) setMaxXp(char.maxXp);
    if (char.gold !== undefined) setGold(char.gold);
    if (char.stats) setStats(char.stats);
    if (char.playerClass) setPlayerClassState(char.playerClass);
    if (char.unlockedClasses && Array.isArray(char.unlockedClasses)) {
      setUnlockedClasses(char.unlockedClasses);
    }
  };

  // Initial load: Try local cache first for instant tactile render, then sync with backend
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.playerClass) setPlayerClassState(parsed.playerClass);
        if (parsed.unlockedClasses && Array.isArray(parsed.unlockedClasses)) {
          setUnlockedClasses(parsed.unlockedClasses);
        }
        if (parsed.level) setLevel(parsed.level);
        if (parsed.xp !== undefined) setXp(parsed.xp);
        if (parsed.maxXp) setMaxXp(parsed.maxXp);
        if (parsed.gold !== undefined) setGold(parsed.gold);
        if (parsed.stats) setStats(parsed.stats);
        if (parsed.quests && Array.isArray(parsed.quests)) {
          setQuests(parsed.quests.map(normalizeQuest));
        }
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.streakDays) setStreakDays(parsed.streakDays);
        if (parsed.dailyBoss) setDailyBoss(parsed.dailyBoss);
        if (parsed.crtScanlines !== undefined) setCrtScanlines(parsed.crtScanlines);
        if (parsed.soundEnabled !== undefined) {
          setSoundEnabled(parsed.soundEnabled);
          soundFx.enabled = parsed.soundEnabled;
        }
      }
    } catch {}

    // Initialize with backend database
    const syncBackend = async () => {
      try {
        let authRes;
        if (api.getToken()) {
          try {
            authRes = await api.getMe();
          } catch {
            authRes = await api.demoLogin();
          }
        } else {
          authRes = await api.demoLogin();
        }

        if (authRes && authRes.user) {
          setCurrentUser(authRes.user);
          applyCharacterData(authRes.character);
        }

        // Fetch Quests
        try {
          const qRes = await api.getQuests();
          if (qRes && qRes.quests && qRes.quests.length > 0) {
            setQuests(qRes.quests.map(normalizeQuest));
          }
        } catch {}

        // Fetch Inventory
        try {
          const invRes = await api.getInventory();
          if (invRes && invRes.items && invRes.items.length > 0) {
            setInventory(invRes.items.map(normalizeInventoryItem));
          }
        } catch {}
      } catch (err) {
        console.warn('Backend synchronization warning (using local fallback):', err);
      }
    };

    syncBackend();
  }, []);

  // Save to local storage
  const saveState = (
    updated: Partial<{
      playerClass: PlayerClass;
      unlockedClasses: PlayerClass[];
      level: number;
      xp: number;
      maxXp: number;
      gold: number;
      stats: CharacterStats;
      quests: Quest[];
      inventory: InventoryItem[];
      streakDays: number;
      soundEnabled: boolean;
      crtScanlines: boolean;
      dailyBoss: DailyBoss;
    }>
  ) => {
    try {
      const current = {
        playerClass,
        unlockedClasses,
        level,
        xp,
        maxXp,
        gold,
        stats,
        quests,
        inventory,
        streakDays,
        soundEnabled,
        crtScanlines,
        dailyBoss,
        ...updated,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {}
  };

  const setPlayerClass = (cls: PlayerClass) => {
    if (!unlockedClasses.includes(cls)) return;
    setPlayerClassState(cls);
    triggerHeroAction('victory');
    saveState({ playerClass: cls });
    api.switchClass(cls).catch(() => {});
  };

  const unlockClass = (cls: PlayerClass): boolean => {
    const classDef = PLAYER_CLASSES[cls];
    if (!classDef) return false;
    const cost = classDef.unlockCost;
    if (gold < cost) return false;

    const nextUnlocked = Array.from(new Set([...unlockedClasses, cls]));
    const nextGold = gold - cost;
    setUnlockedClasses(nextUnlocked);
    setGold(nextGold);
    setPlayerClassState(cls);
    triggerHeroAction('victory');
    soundFx.playCoin();
    soundFx.playQuestComplete();
    saveState({
      unlockedClasses: nextUnlocked,
      gold: nextGold,
      playerClass: cls,
    });

    // Authoritative backend unlock
    api.unlockClass(cls).then((res) => {
      if (res && res.character) {
        applyCharacterData(res.character);
      }
    }).catch(() => {});

    return true;
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
    saveState({ soundEnabled: next });
  };

  const toggleScanlines = () => {
    const next = !crtScanlines;
    setCrtScanlines(next);
    saveState({ crtScanlines: next });
  };

  const triggerHeroAction = (action: SpriteAction) => {
    setHeroAction(action);
    if (action === 'attack') {
      if (playerClass === 'knight') soundFx.playSwordSlash();
      else if (playerClass === 'ronin') soundFx.playKatanaSlash();
      else if (playerClass === 'sorcerer') soundFx.playMagicCast();
      else soundFx.playSwordSlash();
    } else if (action === 'roll') {
      soundFx.playDodgeRoll();
    }
  };

  // Helper function matching backend RpgEngineService curve
  const calculateMaxXp = (lvl: number) => Math.floor(100 * Math.pow(lvl, 1.42));

  // Complete / Uncomplete Quest with Backend Progression
  const toggleQuest = (id: string) => {
    const quest = quests.find((q) => q.id === id);
    if (!quest) return;

    const nextCompleted = !quest.completed;
    const updatedQuests = quests.map((q) => (q.id === id ? { ...q, completed: nextCompleted } : q));
    setQuests(updatedQuests);

    let newXp = xp;
    let newGold = gold;
    let newLevel = level;
    let newMaxXp = maxXp;
    let newStats = { ...stats };
    let newBoss = { ...dailyBoss };

    if (nextCompleted) {
      // Trigger character attack animation!
      triggerHeroAction('attack');
      triggerEmberBurst();
      soundFx.playQuestComplete();

      // Damage daily boss
      const damage = Math.floor(quest.xpReward * 1.5);
      const remainingHp = Math.max(0, newBoss.currentHp - damage);
      newBoss = {
        ...newBoss,
        currentHp: remainingHp,
        defeated: remainingHp <= 0,
      };
      setDailyBoss(newBoss);

      newXp += quest.xpReward;
      newGold += (quest.goldReward || Math.floor(quest.xpReward * 0.8));
      
      const targetStat = quest.statType || 'focus';
      newStats[targetStat] = (newStats[targetStat] || 10) + 1;

      // Check Level Up!
      let didLevelUp = false;
      const prevLevel = level;
      const initialStats = { ...stats };

      while (newXp >= newMaxXp) {
        didLevelUp = true;
        newXp -= newMaxXp;
        newLevel += 1;
        newMaxXp = calculateMaxXp(newLevel);
        newStats.strength += 2;
        newStats.intelligence += 2;
        newStats.vitality += 2;
        newStats.focus += 2;
      }

      if (didLevelUp) {
        const statIncreases: { stat: StatType; from: number; to: number }[] = [
          { stat: 'strength' as const, from: initialStats.strength, to: newStats.strength },
          { stat: 'intelligence' as const, from: initialStats.intelligence, to: newStats.intelligence },
          { stat: 'vitality' as const, from: initialStats.vitality, to: newStats.vitality },
          { stat: 'focus' as const, from: initialStats.focus, to: newStats.focus },
        ].filter((s) => s.to > s.from);

        setLevelUpData({
          prevLevel,
          newLevel,
          statIncreases,
        });
        soundFx.playLevelUp();
      }
    } else {
      soundFx.playClick();
      newXp = Math.max(0, newXp - quest.xpReward);
      newGold = Math.max(0, newGold - (quest.goldReward || Math.floor(quest.xpReward * 0.8)));
      const targetStat = quest.statType || 'focus';
      newStats[targetStat] = Math.max(1, (newStats[targetStat] || 10) - 1);
    }

    setXp(newXp);
    setGold(newGold);
    setLevel(newLevel);
    setMaxXp(newMaxXp);
    setStats(newStats);

    saveState({
      quests: updatedQuests,
      xp: newXp,
      gold: newGold,
      level: newLevel,
      maxXp: newMaxXp,
      stats: newStats,
      dailyBoss: newBoss,
    });

    // Authoritative backend call
    api.toggleQuest(id).then((res) => {
      if (res) {
        if (res.character) applyCharacterData(res.character);
        if (res.levelUp && (res.levelUp.didLevelUp || res.levelUp.leveledUp)) {
          setLevelUpData({
            prevLevel: res.levelUp.oldLevel || level,
            newLevel: res.levelUp.newLevel,
            statIncreases: res.levelUp.statIncreases,
          });
          soundFx.playLevelUp();
        }
      }
    }).catch((err) => {
      console.warn('Backend toggleQuest sync error:', err);
    });
  };

  // Add a new quest with backend persistence
  const addQuest = (newQuest: Omit<Quest, 'id' | 'completed'>) => {
    const tempId = `quest-${Date.now()}`;
    const created: Quest = {
      ...newQuest,
      id: tempId,
      completed: false,
    };
    const updated = [...quests, created];
    setQuests(updated);
    saveState({ quests: updated });
    soundFx.playCoin();

    api.createQuest(newQuest).then((res) => {
      if (res && res.quest) {
        const normalized = normalizeQuest(res.quest);
        setQuests((prev) => prev.map((q) => (q.id === tempId ? normalized : q)));
      }
    }).catch((err) => {
      console.warn('Backend createQuest sync error:', err);
    });
  };

  // Buy or Equip inventory item with backend persistence
  const buyOrEquipItem = (item: InventoryItem) => {
    if (item.iconType === 'locked') return;

    let updatedInventory = [...inventory];
    let newGold = gold;
    let newStats = { ...stats };

    if (!item.owned) {
      if (gold >= item.price) {
        soundFx.playCoin();
        newGold -= item.price;
        updatedInventory = updatedInventory.map((i) =>
          i.id === item.id ? { ...i, owned: true, equipped: true } : i
        );
        if (item.statBonus) {
          newStats[item.statBonus.stat] = (newStats[item.statBonus.stat] || 0) + item.statBonus.amount;
        }

        api.buyItem(item.id).then((res) => {
          if (res && res.character) applyCharacterData(res.character);
        }).catch(() => {});
      }
    } else {
      // Toggle equip
      soundFx.playClick();
      const nextEquipped = !item.equipped;
      updatedInventory = updatedInventory.map((i) =>
        i.id === item.id ? { ...i, equipped: nextEquipped } : i
      );
      if (item.statBonus) {
        if (nextEquipped) {
          newStats[item.statBonus.stat] = (newStats[item.statBonus.stat] || 0) + item.statBonus.amount;
        } else {
          newStats[item.statBonus.stat] = Math.max(1, (newStats[item.statBonus.stat] || 0) - item.statBonus.amount);
        }
      }

      api.equipItem(item.id).catch(() => {});
    }

    setGold(newGold);
    setStats(newStats);
    setInventory(updatedInventory);
    saveState({ gold: newGold, stats: newStats, inventory: updatedInventory });
  };

  const closeLevelUp = () => {
    setLevelUpData(null);
  };

  const handleAuthSuccess = (user: UserProfile, character: any) => {
    setCurrentUser(user);
    if (character) {
      applyCharacterData(character);
    }
    // Reload quests and inventory for the authenticated user
    api.getQuests().then((qRes) => {
      if (qRes && qRes.quests) {
        const loadedQuests = qRes.quests.map(normalizeQuest);
        setQuests(loadedQuests);
        saveState({ quests: loadedQuests });
      }
    }).catch(() => {});
    api.getInventory().then((iRes) => {
      if (iRes && iRes.items) {
        const loadedInv = iRes.items.map(normalizeInventoryItem);
        setInventory(loadedInv);
        saveState({ inventory: loadedInv });
      }
    }).catch(() => {});
  };

  const logout = () => {
    api.clearToken();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    api.demoLogin().then((res) => {
      setCurrentUser(res.user);
      applyCharacterData(res.character);
      api.getQuests().then((qRes) => {
        if (qRes && qRes.quests) setQuests(qRes.quests.map(normalizeQuest));
      }).catch(() => {});
      api.getInventory().then((iRes) => {
        if (iRes && iRes.items) setInventory(iRes.items.map(normalizeInventoryItem));
      }).catch(() => {});
    }).catch(() => {});
  };

  return {
    playerClass,
    setPlayerClass,
    unlockedClasses,
    unlockClass,
    heroAction,
    triggerHeroAction,
    level,
    xp,
    maxXp,
    gold,
    stats,
    quests,
    inventory,
    equippedItems: inventory.filter((item) => item.equipped),
    streak,
    streakDays,
    levelUpData,
    soundEnabled,
    crtScanlines,
    dailyBoss,
    currentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleAuthSuccess,
    logout,
    toggleSound,
    toggleScanlines,
    toggleQuest,
    addQuest,
    buyOrEquipItem,
    closeLevelUp,
    setLevelUpData,
  };
}
