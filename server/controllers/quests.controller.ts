import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Database } from '../db/database';
import { RpgEngineService } from '../services/rpg-engine.service';
import { BackendQuest } from '../models/types';

export class QuestsController {
  static async getQuests(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const db = Database.getInstance();
      const rawQuests = db.getQuestsByUserId(req.user.id);
      const quests = rawQuests.map((q) => ({
        ...q,
        statType: q.statType || q.attributeTarget || 'focus',
        statAmount: q.statAmount || 10,
        repeat: q.repeat || 'daily',
      }));
      res.json({ quests });
    } catch (err) {
      console.error('GetQuests error:', err);
      res.status(500).json({ error: 'Failed to retrieve quests.' });
    }
  }

  static async createQuest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const {
        title,
        description = '',
        category = 'custom',
        difficulty = 'medium',
        attributeTarget,
        statType,
        statAmount,
        repeat = 'daily',
        tags = [],
      } = req.body;

      if (!title || !title.trim()) {
        res.status(400).json({ error: 'Quest title is required.' });
        return;
      }

      const rewards = RpgEngineService.getDifficultyRewards(difficulty);
      const targetAttr = statType || attributeTarget || RpgEngineService.getCategoryAttribute(category);

      const db = Database.getInstance();
      const newQuest: BackendQuest = {
        id: `qst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: req.user.id,
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        xpReward: req.body.xpReward || rewards.xp,
        goldReward: req.body.goldReward || rewards.gold,
        attributeTarget: targetAttr,
        statType: targetAttr,
        statAmount: statAmount || 10,
        repeat,
        completed: false,
        streak: 0,
        tags: Array.isArray(tags) ? tags : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.createQuest(newQuest);

      res.status(201).json({
        message: 'Quest inscribed in the archives.',
        quest: newQuest,
      });
    } catch (err) {
      console.error('CreateQuest error:', err);
      res.status(500).json({ error: 'Failed to create quest.' });
    }
  }

  static async updateQuest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { id } = req.params;
      const updates = req.body;

      const db = Database.getInstance();
      const existing = db.findQuestById(id, req.user.id);
      if (!existing) {
        res.status(404).json({ error: 'Quest not found.' });
        return;
      }

      const updated = db.updateQuest(id, req.user.id, updates);
      res.json({ message: 'Quest updated.', quest: updated });
    } catch (err) {
      console.error('UpdateQuest error:', err);
      res.status(500).json({ error: 'Failed to update quest.' });
    }
  }

  static async toggleQuest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { id } = req.params;
      const db = Database.getInstance();
      const quest = db.findQuestById(id, req.user.id);

      if (!quest) {
        res.status(404).json({ error: 'Quest not found.' });
        return;
      }

      const character = db.getCharacterByUserId(req.user.id);
      if (!character) {
        res.status(404).json({ error: 'Character profile missing.' });
        return;
      }

      const willBeCompleted = !quest.completed;

      let levelUpResult: ReturnType<typeof RpgEngineService.processXpGain> | null = null;
      let newGold = character.gold;
      let newStreak = character.streakDays;

      if (willBeCompleted) {
        // Gain XP & Level progression
        levelUpResult = RpgEngineService.processXpGain(
          character.level,
          character.xp,
          quest.xpReward,
          character.stats,
          quest.attributeTarget
        );

        newGold += quest.goldReward;

        // Update streak
        const streakUpdate = RpgEngineService.updateStreak(
          character.lastActiveDate,
          character.streakDays
        );
        newStreak = streakUpdate.newStreak;

        // Update character in DB
        db.updateCharacter(req.user.id, {
          level: levelUpResult.newLevel,
          xp: levelUpResult.newXp,
          maxXp: levelUpResult.newMaxXp,
          gold: newGold,
          streakDays: newStreak,
          lastActiveDate: streakUpdate.todayStr,
          stats: levelUpResult.updatedStats,
        });

        // Update quest
        db.updateQuest(id, req.user.id, {
          completed: true,
          completedAt: new Date().toISOString(),
          streak: (quest.streak || 0) + 1,
        });

        // Log activity
        db.addActivityLog({
          id: `act_${Date.now()}`,
          userId: req.user.id,
          type: 'quest_completed',
          title: `Quest Vanquished: ${quest.title}`,
          detail: `+${quest.xpReward} XP, +${quest.goldReward} Gold. Attribute increased: ${quest.attributeTarget}.`,
          timestamp: new Date().toISOString(),
          xpGained: quest.xpReward,
          goldChange: quest.goldReward,
        });

        if (levelUpResult.didLevelUp) {
          db.addActivityLog({
            id: `act_lvl_${Date.now()}`,
            userId: req.user.id,
            type: 'level_up',
            title: `Ascended to Level ${levelUpResult.newLevel}!`,
            detail: `Attributes boosted across all disciplines.`,
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        // Un-completing quest
        newGold = Math.max(0, character.gold - quest.goldReward);
        const newXp = Math.max(0, character.xp - quest.xpReward);

        db.updateCharacter(req.user.id, {
          xp: newXp,
          gold: newGold,
        });

        db.updateQuest(id, req.user.id, {
          completed: false,
          completedAt: undefined,
        });
      }

      const updatedCharacter = db.getCharacterByUserId(req.user.id);
      const updatedQuest = db.findQuestById(id, req.user.id);

      res.json({
        message: willBeCompleted ? 'Quest conquered!' : 'Quest returned to pending ledger.',
        quest: updatedQuest,
        character: updatedCharacter,
        levelUp: levelUpResult?.didLevelUp ? levelUpResult : null,
      });
    } catch (err) {
      console.error('ToggleQuest error:', err);
      res.status(500).json({ error: 'Failed to toggle quest state.' });
    }
  }

  static async deleteQuest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { id } = req.params;
      const db = Database.getInstance();
      const success = db.deleteQuest(id, req.user.id);

      if (!success) {
        res.status(404).json({ error: 'Quest not found or already banished.' });
        return;
      }

      res.json({ message: 'Quest banished from the realm.' });
    } catch (err) {
      console.error('DeleteQuest error:', err);
      res.status(500).json({ error: 'Failed to delete quest.' });
    }
  }
}
