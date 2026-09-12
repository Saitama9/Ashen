import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Database } from '../db/database';
import { PlayerClass } from '../models/types';

const CLASS_UNLOCK_COSTS: Record<PlayerClass, number> = {
  sorcerer: 0,
  knight: 350,
  ronin: 600,
  rogue: 850,
};

export class CharacterController {
  static async getCharacter(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const db = Database.getInstance();
      const character = db.getCharacterByUserId(req.user.id);

      if (!character) {
        res.status(404).json({ error: 'Character profile not found.' });
        return;
      }

      res.json({ character });
    } catch (err) {
      console.error('GetCharacter error:', err);
      res.status(500).json({ error: 'Failed to retrieve character data.' });
    }
  }

  static async switchClass(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { playerClass } = req.body as { playerClass: PlayerClass };
      const db = Database.getInstance();
      const character = db.getCharacterByUserId(req.user.id);

      if (!character) {
        res.status(404).json({ error: 'Character not found.' });
        return;
      }

      if (!character.unlockedClasses.includes(playerClass)) {
        res.status(403).json({ error: 'This champion class has not yet been unlocked.' });
        return;
      }

      const updated = db.updateCharacter(req.user.id, { playerClass });
      res.json({ message: `Vocation switched to ${playerClass}.`, character: updated });
    } catch (err) {
      console.error('SwitchClass error:', err);
      res.status(500).json({ error: 'Failed to switch class.' });
    }
  }

  static async unlockClass(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { playerClass } = req.body as { playerClass: PlayerClass };
      const db = Database.getInstance();
      const character = db.getCharacterByUserId(req.user.id);

      if (!character) {
        res.status(404).json({ error: 'Character not found.' });
        return;
      }

      if (character.unlockedClasses.includes(playerClass)) {
        res.status(400).json({ error: 'Champion is already unlocked.' });
        return;
      }

      const cost = CLASS_UNLOCK_COSTS[playerClass] ?? 500;
      if (character.gold < cost) {
        res.status(400).json({
          error: `Insufficient Gold. Requires ${cost - character.gold} more Gold.`,
          requiredGold: cost,
          currentGold: character.gold,
        });
        return;
      }

      const newGold = character.gold - cost;
      const newUnlocked = [...character.unlockedClasses, playerClass];

      const updated = db.updateCharacter(req.user.id, {
        gold: newGold,
        unlockedClasses: newUnlocked,
        playerClass, // auto-switch to newly unlocked class
      });

      db.addActivityLog({
        id: `act_unlock_${Date.now()}`,
        userId: req.user.id,
        type: 'class_unlocked',
        title: `Champion Summoned: ${playerClass.toUpperCase()}`,
        detail: `Spent ${cost} Gold to awaken a new champion vocation.`,
        timestamp: new Date().toISOString(),
        goldChange: -cost,
      });

      res.json({
        message: `Champion ${playerClass.toUpperCase()} unlocked and summoned!`,
        character: updated,
      });
    } catch (err) {
      console.error('UnlockClass error:', err);
      res.status(500).json({ error: 'Failed to unlock class.' });
    }
  }

  static async restBonfire(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const db = Database.getInstance();
      const character = db.getCharacterByUserId(req.user.id);
      if (!character) {
        res.status(404).json({ error: 'Character not found.' });
        return;
      }

      const updated = db.updateCharacter(req.user.id, {
        kindleLevel: (character.kindleLevel || 1) + 1,
      });

      db.addActivityLog({
        id: `act_bonfire_${Date.now()}`,
        userId: req.user.id,
        type: 'bonfire_rested',
        title: 'Rested at Bonfire',
        detail: `Warmth restored. Kindle Level ${updated?.kindleLevel}.`,
        timestamp: new Date().toISOString(),
      });

      res.json({
        message: 'Bonfire rested.',
        kindleLevel: updated?.kindleLevel,
        character: updated,
      });
    } catch (err) {
      console.error('RestBonfire error:', err);
      res.status(500).json({ error: 'Failed to rest at bonfire.' });
    }
  }
}
