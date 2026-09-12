import fs from 'fs';
import path from 'path';
import {
  BackendUser,
  BackendCharacter,
  BackendQuest,
  BackendInventoryItem,
  BackendActivityLog,
} from '../models/types';

interface DatabaseSchema {
  users: BackendUser[];
  characters: BackendCharacter[];
  quests: BackendQuest[];
  inventoryItems: BackendInventoryItem[];
  activityLogs: BackendActivityLog[];
  meta: {
    version: number;
    lastSaved: string;
  };
}

const DEFAULT_INVENTORY_ITEMS: BackendInventoryItem[] = [
  {
    id: 'item-1',
    name: "Traveler's Cloak",
    type: 'armor',
    iconType: 'cloak',
    description: 'Weathered hooded mantle woven from coarse thread. Protects against biting mountain winds.',
    price: 0,
    statBonus: { stat: 'vitality', amount: 2 },
    statsBonus: { vitality: 2 },
    equipped: true,
    owned: true,
  },
  {
    id: 'item-2',
    name: 'Iron Resolve',
    type: 'armor',
    iconType: 'armor',
    description: 'Heavy plate forged in the northern kilns. Hardens the wearer against distraction.',
    price: 200,
    statBonus: { stat: 'strength', amount: 4 },
    statsBonus: { strength: 4 },
    equipped: false,
    owned: false,
  },
  {
    id: 'item-3',
    name: "Scholar's Tome",
    type: 'tome',
    iconType: 'tome',
    description: 'An illuminated codex containing lost axioms of the ancient archives.',
    price: 300,
    statBonus: { stat: 'intelligence', amount: 5 },
    statsBonus: { intelligence: 5 },
    equipped: false,
    owned: false,
  },
  {
    id: 'item-4',
    name: 'Ember Lantern',
    type: 'relic',
    iconType: 'lantern',
    description: 'A cage of blackened brass bearing an undying cinder. Banishes shadows.',
    price: 500,
    statBonus: { stat: 'focus', amount: 6 },
    statsBonus: { focus: 6 },
    equipped: false,
    owned: false,
  },
  {
    id: 'item-5',
    name: 'Ashen Greatsword',
    type: 'weapon',
    iconType: 'sword',
    description: 'Heavily chipped blade steeped in the residue of countless bonfires.',
    price: 800,
    statBonus: { stat: 'strength', amount: 8 },
    statsBonus: { strength: 8 },
    equipped: false,
    owned: false,
  },
  {
    id: 'item-6',
    name: 'Ring of Focus',
    type: 'badge',
    iconType: 'ring',
    description: 'Engraved gold band that anchors erratic thoughts into deep discipline.',
    price: 400,
    statBonus: { stat: 'focus', amount: 5 },
    statsBonus: { focus: 5 },
    equipped: false,
    owned: false,
  },
  {
    id: 'item-7',
    name: 'Ancient Reliquary',
    type: 'relic',
    iconType: 'locked',
    description: 'Sealed by ancient rite. Unlocks at Level 20.',
    price: 1500,
    equipped: false,
    owned: false,
  },
  {
    id: 'item-8',
    name: 'Sunlight Talisman',
    type: 'badge',
    iconType: 'locked',
    description: 'Sealed by ancient rite. Unlocks at Level 25.',
    price: 2000,
    equipped: false,
    owned: false,
  },
];

const DEFAULT_SEED_QUESTS = (userId: string): BackendQuest[] => [
  {
    id: 'quest-gym',
    userId,
    title: 'Defeat the Iron Sloth (Gym & Strength Training)',
    description: 'Conquer the weights and forge bodily fortitude for 45 minutes.',
    category: 'fitness',
    difficulty: 'medium',
    xpReward: 65,
    goldReward: 50,
    attributeTarget: 'strength',
    statType: 'strength',
    statAmount: 15,
    repeat: 'daily',
    completed: false,
    streak: 3,
    tags: ['fitness', 'strength', 'health'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'quest-reading',
    userId,
    title: 'Study the Ancient Tomes (Read 25 Pages)',
    description: 'Absorb profound thoughts from literature or technical lore.',
    category: 'study',
    difficulty: 'easy',
    xpReward: 40,
    goldReward: 30,
    attributeTarget: 'intelligence',
    statType: 'intelligence',
    statAmount: 10,
    repeat: 'daily',
    completed: true,
    completedAt: new Date().toISOString(),
    streak: 5,
    tags: ['study', 'mind', 'reading'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'quest-deepwork',
    userId,
    title: 'Channel Unbroken Focus (Deep Work Sprint)',
    description: 'Complete 90 minutes of high-intensity focus without distractions.',
    category: 'work',
    difficulty: 'hard',
    xpReward: 120,
    goldReward: 90,
    attributeTarget: 'focus',
    statType: 'focus',
    statAmount: 20,
    repeat: 'daily',
    completed: false,
    streak: 2,
    tags: ['career', 'focus', 'deepwork'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'quest-hydration',
    userId,
    title: 'Drink from the Fountain of Life (2.5L Water)',
    description: 'Nourish the biological vessel with crisp hydration.',
    category: 'health',
    difficulty: 'trivial',
    xpReward: 20,
    goldReward: 15,
    attributeTarget: 'vitality',
    statType: 'vitality',
    statAmount: 8,
    repeat: 'daily',
    completed: true,
    completedAt: new Date().toISOString(),
    streak: 7,
    tags: ['health', 'vitality', 'wellness'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class Database {
  private static instance: Database;
  private dbPath: string;
  private data: DatabaseSchema;

  private constructor() {
    const dataDir = path.join(process.cwd(), 'server', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbPath = path.join(dataDir, 'liferpg_db.json');
    this.data = this.loadData();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(this.dbPath)) {
      try {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        const parsed: DatabaseSchema = JSON.parse(raw);

        // Ensure canonical inventory items exist
        if (!parsed.inventoryItems || parsed.inventoryItems.length === 0) {
          parsed.inventoryItems = [...DEFAULT_INVENTORY_ITEMS];
        } else {
          for (const defItem of DEFAULT_INVENTORY_ITEMS) {
            if (!parsed.inventoryItems.some((i) => i.id === defItem.id)) {
              parsed.inventoryItems.push(defItem);
            }
          }
        }

        return parsed;
      } catch (err) {
        console.error('Failed to parse database file, initializing fresh store:', err);
      }
    }

    const initialData: DatabaseSchema = {
      users: [],
      characters: [],
      quests: [],
      inventoryItems: [...DEFAULT_INVENTORY_ITEMS],
      activityLogs: [],
      meta: {
        version: 1,
        lastSaved: new Date().toISOString(),
      },
    };

    this.saveData(initialData);
    return initialData;
  }

  public persist(): void {
    this.saveData(this.data);
  }

  private saveData(data: DatabaseSchema): void {
    data.meta.lastSaved = new Date().toISOString();
    const tempPath = `${this.dbPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, this.dbPath);
  }

  // ===================== USER OPERATIONS =====================
  public findUserById(id: string): BackendUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public findUserByEmail(email: string): BackendUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserByUsername(username: string): BackendUser | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  public createUser(user: BackendUser): BackendUser {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  // ===================== CHARACTER OPERATIONS =====================
  public getCharacterByUserId(userId: string): BackendCharacter | undefined {
    return this.data.characters.find((c) => c.userId === userId);
  }

  public createCharacter(character: BackendCharacter): BackendCharacter {
    this.data.characters.push(character);
    this.persist();
    return character;
  }

  public updateCharacter(userId: string, updates: Partial<BackendCharacter>): BackendCharacter | null {
    const idx = this.data.characters.findIndex((c) => c.userId === userId);
    if (idx === -1) return null;

    this.data.characters[idx] = {
      ...this.data.characters[idx],
      ...updates,
    };
    this.persist();
    return this.data.characters[idx];
  }

  // ===================== QUEST CRUD OPERATIONS =====================
  public getQuestsByUserId(userId: string): BackendQuest[] {
    return this.data.quests.filter((q) => q.userId === userId);
  }

  public findQuestById(id: string, userId: string): BackendQuest | undefined {
    return this.data.quests.find((q) => q.id === id && q.userId === userId);
  }

  public createQuest(quest: BackendQuest): BackendQuest {
    this.data.quests.unshift(quest);
    this.persist();
    return quest;
  }

  public seedQuestsForUser(userId: string): BackendQuest[] {
    const existing = this.getQuestsByUserId(userId);
    if (existing.length > 0) return existing;
    const seeded = DEFAULT_SEED_QUESTS(userId);
    this.data.quests.push(...seeded);
    this.persist();
    return seeded;
  }

  public updateQuest(id: string, userId: string, updates: Partial<BackendQuest>): BackendQuest | null {
    const idx = this.data.quests.findIndex((q) => q.id === id && q.userId === userId);
    if (idx === -1) return null;

    this.data.quests[idx] = {
      ...this.data.quests[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.quests[idx];
  }

  public deleteQuest(id: string, userId: string): boolean {
    const initialLen = this.data.quests.length;
    this.data.quests = this.data.quests.filter((q) => !(q.id === id && q.userId === userId));
    const deleted = this.data.quests.length < initialLen;
    if (deleted) this.persist();
    return deleted;
  }

  // ===================== INVENTORY OPERATIONS =====================
  public getInventory(): BackendInventoryItem[] {
    return this.data.inventoryItems;
  }

  public getInventoryForUser(userId?: string): BackendInventoryItem[] {
    if (!userId) return this.data.inventoryItems;
    const character = this.getCharacterByUserId(userId);
    const ownedIds = character?.ownedItemIds || [];
    const equippedIds = character?.equippedItemIds || [];

    return this.data.inventoryItems.map((item) => ({
      ...item,
      owned: ownedIds.includes(item.id) || item.price === 0,
      equipped: equippedIds.includes(item.id),
    }));
  }

  public updateInventoryItem(id: string, updates: Partial<BackendInventoryItem>): BackendInventoryItem | null {
    const idx = this.data.inventoryItems.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    this.data.inventoryItems[idx] = { ...this.data.inventoryItems[idx], ...updates };
    this.persist();
    return this.data.inventoryItems[idx];
  }

  // ===================== ACTIVITY LOGS =====================
  public addActivityLog(log: BackendActivityLog): void {
    this.data.activityLogs.unshift(log);
    // Keep last 200 logs
    if (this.data.activityLogs.length > 200) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 200);
    }
    this.persist();
  }

  public getActivityLogs(userId: string): BackendActivityLog[] {
    return this.data.activityLogs.filter((l) => l.userId === userId);
  }

  // Helper to initialize demo user if none exists
  public ensureDemoUser(): { user: BackendUser; character: BackendCharacter } {
    let demoUser = this.data.users.find((u) => u.username === 'AshenOne');
    if (!demoUser) {
      demoUser = {
        id: 'usr_ashen_hero_01',
        email: 'ashen.one@firelink.realm',
        username: 'AshenOne',
        passwordHash: '$2a$10$w8TKn6/k5uN7pEa.hH9jZ.WbV1M.x0Xl64N9xP5o4i/PzX8R4rIqO', // 'bonfire'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.data.users.push(demoUser);
    }

    let demoCharacter = this.data.characters.find((c) => c.userId === demoUser!.id);
    if (!demoCharacter) {
      demoCharacter = {
        userId: demoUser.id,
        playerClass: 'sorcerer',
        level: 4,
        xp: 320,
        maxXp: 741,
        gold: 1304,
        streakDays: 7,
        lastActiveDate: new Date().toISOString().split('T')[0],
        stats: {
          strength: 14,
          intelligence: 24,
          vitality: 16,
          focus: 22,
        },
        unlockedClasses: ['sorcerer', 'knight'],
        ownedItemIds: ['item-1'],
        equippedItemIds: ['item-1'],
        kindleLevel: 3,
      };
      this.data.characters.push(demoCharacter);

      // Seed quests for demo user
      const seedQuests = DEFAULT_SEED_QUESTS(demoUser.id);
      this.data.quests.push(...seedQuests);
    } else {
      // Ensure existing demo user has valid class roster and ownedItemIds
      if (!demoCharacter.ownedItemIds) {
        demoCharacter.ownedItemIds = ['item-1'];
      }
      demoCharacter.unlockedClasses = demoCharacter.unlockedClasses.filter(
        (c) => c === 'sorcerer' || c === 'knight' || c === 'ronin' || c === 'rogue'
      ) as ('sorcerer' | 'knight' | 'ronin' | 'rogue')[];
      if (demoCharacter.unlockedClasses.length === 0) {
        demoCharacter.unlockedClasses = ['sorcerer'];
      }
    }

    this.persist();
    return { user: demoUser, character: demoCharacter };
  }
}
