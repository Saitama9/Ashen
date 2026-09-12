export type StatType = 'strength' | 'intelligence' | 'vitality' | 'focus';

export type QuestCategory = 'study' | 'fitness' | 'work' | 'health' | 'custom';

export type PlayerClass = 'knight' | 'ronin' | 'sorcerer' | 'rogue';

export type SpriteAction =
  | 'idle'
  | 'run'
  | 'attack'
  | 'attack2'
  | 'roll'
  | 'cast'
  | 'victory'
  | 'hit'
  | 'jump'
  | 'fall'
  | 'death';

export interface ClassDefinition {
  id: PlayerClass;
  name: string;
  title: string;
  description: string;
  weapon: string;
  primaryStat: StatType;
  quote: string;
  unlockCost: number;
  unlocked?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  category: QuestCategory;
  xpReward: number;
  goldReward?: number;
  statType: StatType;
  statAmount: number;
  completed: boolean;
  repeat: 'daily' | 'weekly' | 'none';
  flavorQuote?: string;
}

export interface CharacterStats {
  strength: number;
  intelligence: number;
  vitality: number;
  focus: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'armor' | 'weapon' | 'tome' | 'relic' | 'badge' | 'theme';
  description: string;
  price: number;
  equipped: boolean;
  owned: boolean;
  statBonus?: {
    stat: StatType;
    amount: number;
  };
  iconType: 'cloak' | 'armor' | 'tome' | 'lantern' | 'sword' | 'ring' | 'locked';
}

export interface DayStreak {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  completed: boolean;
  dateStr?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  goldReward: number;
}

export interface DailyBoss {
  name: string;
  title: string;
  currentHp: number;
  maxHp: number;
  defeated: boolean;
}

export type ScreenId =
  | 'splash'
  | 'home'
  | 'add-quest'
  | 'quest-detail'
  | 'level-up'
  | 'character'
  | 'inventory'
  | 'profile';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
}
