import { PlayerClass, QuestCategory } from '../types';
type QuestDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'epic';

const TOKEN_STORAGE_KEY = 'liferpg_auth_token';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public clearToken() {
    this.setToken(null);
  }

  public hasToken(): boolean {
    return !!this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Server request failed with status ${response.status}`);
    }

    return data as T;
  }

  // ================= AUTH API =================
  async register(params: { email: string; username: string; password: string; playerClass?: PlayerClass }) {
    const res = await this.request<{
      message: string;
      token: string;
      user: { id: string; email: string; username: string };
      character: any;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    this.setToken(res.token);
    return res;
  }

  async login(params: { emailOrUsername: string; password: string }) {
    const res = await this.request<{
      message: string;
      token: string;
      user: { id: string; email: string; username: string };
      character: any;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    this.setToken(res.token);
    return res;
  }

  async demoLogin() {
    const res = await this.request<{
      message: string;
      token: string;
      user: { id: string; email: string; username: string };
      character: any;
    }>('/api/auth/demo', {
      method: 'POST',
    });
    this.setToken(res.token);
    return res;
  }

  async getMe() {
    return this.request<{
      user: { id: string; email: string; username: string };
      character: any;
    }>('/api/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // ================= CHARACTER API =================
  async getCharacter() {
    return this.request<{ character: any }>('/api/character');
  }

  async switchClass(playerClass: PlayerClass) {
    return this.request<{ message: string; character: any }>('/api/character/switch-class', {
      method: 'POST',
      body: JSON.stringify({ playerClass }),
    });
  }

  async unlockClass(playerClass: PlayerClass) {
    return this.request<{ message: string; character: any }>('/api/character/unlock-class', {
      method: 'POST',
      body: JSON.stringify({ playerClass }),
    });
  }

  async restBonfire() {
    return this.request<{ message: string; kindleLevel: number; character: any }>('/api/character/rest-bonfire', {
      method: 'POST',
    });
  }

  // ================= QUESTS API =================
  async getQuests() {
    return this.request<{ quests: any[] }>('/api/quests');
  }

  async createQuest(params: {
    title: string;
    description?: string;
    category?: QuestCategory;
    difficulty?: QuestDifficulty;
    attributeTarget?: string;
    statType?: string;
    statAmount?: number;
    xpReward?: number;
    repeat?: string;
    tags?: string[];
  }) {
    return this.request<{ message: string; quest: any }>('/api/quests', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async updateQuest(id: string, updates: any) {
    return this.request<{ message: string; quest: any }>(`/api/quests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async toggleQuest(id: string) {
    return this.request<{
      message: string;
      quest: any;
      character: any;
      levelUp: any;
    }>(`/api/quests/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  async deleteQuest(id: string) {
    return this.request<{ message: string }>(`/api/quests/${id}`, {
      method: 'DELETE',
    });
  }

  // ================= INVENTORY API =================
  async getInventory() {
    return this.request<{ items: any[] }>('/api/inventory');
  }

  async buyItem(itemId: string) {
    return this.request<{ message: string; item: any; character: any }>('/api/inventory/buy', {
      method: 'POST',
      body: JSON.stringify({ itemId }),
    });
  }

  async equipItem(itemId: string) {
    return this.request<{ message: string; item: any; character: any }>('/api/inventory/equip', {
      method: 'POST',
      body: JSON.stringify({ itemId }),
    });
  }

  // ================= STATS API =================
  async getActivityLogs() {
    return this.request<{ logs: any[] }>('/api/stats/logs');
  }

  async getStatsSummary() {
    return this.request<{
      totalQuests: number;
      completedCount: number;
      completionRate: number;
      streakDays: number;
      gold: number;
      level: number;
      xp: number;
      maxXp: number;
      stats: any;
    }>('/api/stats/summary');
  }
}

export const api = new ApiService();
