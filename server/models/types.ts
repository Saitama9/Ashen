export type PlayerClass = 'sorcerer' | 'knight' | 'ronin' | 'rogue';

export type QuestCategory = 'fitness' | 'work' | 'health' | 'study' | 'custom';
export type QuestDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'epic';

export interface BackendUser {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterAttributes {
  strength: number;
  intelligence: number;
  vitality: number;
  focus: number;
}

export interface BackendCharacter {
  userId: string;
  playerClass: PlayerClass;
  level: number;
  xp: number;
  maxXp: number;
  gold: number;
  streakDays: number;
  lastActiveDate: string;
  stats: CharacterAttributes;
  unlockedClasses: PlayerClass[];
  ownedItemIds?: string[];
  equippedItemIds: string[];
  kindleLevel: number;
}

export interface BackendQuest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  attributeTarget: keyof CharacterAttributes;
  statType?: keyof CharacterAttributes;
  statAmount?: number;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  streak: number;
  tags: string[];
  repeat?: 'daily' | 'weekly' | 'none';
  flavorQuote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendInventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'relic' | 'badge' | 'tome' | 'theme';
  iconType: string;
  description: string;
  price: number;
  statBonus?: {
    stat: keyof CharacterAttributes;
    amount: number;
  };
  statsBonus?: Partial<CharacterAttributes>;
  equipped: boolean;
  owned: boolean;
}

export interface BackendActivityLog {
  id: string;
  userId: string;
  type: 'quest_completed' | 'level_up' | 'item_purchased' | 'bonfire_rested' | 'class_unlocked';
  title: string;
  detail: string;
  timestamp: string;
  xpGained?: number;
  goldChange?: number;
}
