import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Database } from '../db/database';

export class StatsController {
  static async getActivityLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const db = Database.getInstance();
      const logs = db.getActivityLogs(req.user.id);
      res.json({ logs });
    } catch (err) {
      console.error('GetActivityLogs error:', err);
      res.status(500).json({ error: 'Failed to retrieve chronicles.' });
    }
  }

  static async getSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const db = Database.getInstance();
      const quests = db.getQuestsByUserId(req.user.id);
      const character = db.getCharacterByUserId(req.user.id);

      const completedCount = quests.filter((q) => q.completed).length;
      const totalQuests = quests.length;
      const completionRate = totalQuests > 0 ? Math.round((completedCount / totalQuests) * 100) : 0;

      res.json({
        totalQuests,
        completedCount,
        completionRate,
        streakDays: character?.streakDays || 1,
        gold: character?.gold || 0,
        level: character?.level || 1,
        xp: character?.xp || 0,
        maxXp: character?.maxXp || 100,
        stats: character?.stats,
      });
    } catch (err) {
      console.error('GetSummary error:', err);
      res.status(500).json({ error: 'Failed to retrieve stats summary.' });
    }
  }
}
