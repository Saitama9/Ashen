import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Database } from '../db/database';
import { CharacterAttributes } from '../models/types';

export class InventoryController {
  static async getInventory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const db = Database.getInstance();
      const inventory = db.getInventoryForUser(req.user?.id);
      res.json({ items: inventory });
    } catch (err) {
      console.error('GetInventory error:', err);
      res.status(500).json({ error: 'Failed to retrieve inventory items.' });
    }
  }

  static async buyItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { itemId } = req.body;
      const db = Database.getInstance();
      const character = db.getCharacterByUserId(req.user.id);
      const inventory = db.getInventoryForUser(req.user.id);

      if (!character) {
        res.status(404).json({ error: 'Character not found.' });
        return;
      }

      const item = inventory.find((i) => i.id === itemId);
      if (!item) {
        res.status(404).json({ error: 'Item not found in armory.' });
        return;
      }

      const ownedItemIds = character.ownedItemIds || [];
      if (ownedItemIds.includes(item.id)) {
        res.status(400).json({ error: 'Item is already owned.' });
        return;
      }

      if (character.gold < item.price) {
        res.status(400).json({
          error: `Not enough Gold. Requires ${item.price - character.gold} more Gold.`,
          requiredGold: item.price,
          currentGold: character.gold,
        });
        return;
      }

      // Deduct gold & update owned/equipped IDs
      const newGold = character.gold - item.price;
      const updatedOwned = Array.from(new Set([...ownedItemIds, item.id]));
      const updatedEquipped = Array.from(new Set([...(character.equippedItemIds || []), item.id]));

      // Apply stat bonus
      const stats: CharacterAttributes = { ...character.stats };
      if (item.statBonus) {
        stats[item.statBonus.stat] = (stats[item.statBonus.stat] || 0) + item.statBonus.amount;
      } else if (item.statsBonus) {
        for (const [k, v] of Object.entries(item.statsBonus)) {
          const key = k as keyof CharacterAttributes;
          if (typeof v === 'number') {
            stats[key] = (stats[key] || 0) + v;
          }
        }
      }

      const updatedCharacter = db.updateCharacter(req.user.id, {
        gold: newGold,
        ownedItemIds: updatedOwned,
        equippedItemIds: updatedEquipped,
        stats,
      });

      db.addActivityLog({
        id: `act_item_${Date.now()}`,
        userId: req.user.id,
        type: 'item_purchased',
        title: `Forged Artifact: ${item.name}`,
        detail: `Spent ${item.price} Gold to acquire ${item.name}.`,
        timestamp: new Date().toISOString(),
        goldChange: -item.price,
      });

      res.json({
        message: `${item.name} acquired and placed in inventory!`,
        item: { ...item, owned: true, equipped: true },
        character: updatedCharacter,
      });
    } catch (err) {
      console.error('BuyItem error:', err);
      res.status(500).json({ error: 'Failed to purchase item.' });
    }
  }

  static async equipItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { itemId } = req.body;
      const db = Database.getInstance();
      const character = db.getCharacterByUserId(req.user.id);
      const inventory = db.getInventoryForUser(req.user.id);

      if (!character) {
        res.status(404).json({ error: 'Character not found.' });
        return;
      }

      const item = inventory.find((i) => i.id === itemId);
      if (!item) {
        res.status(404).json({ error: 'Item not found.' });
        return;
      }

      const ownedItemIds = character.ownedItemIds || [];
      const isOwned = ownedItemIds.includes(item.id) || item.price === 0;

      if (!isOwned) {
        res.status(400).json({ error: 'You must purchase this relic before equipping it.' });
        return;
      }

      const equippedIds = character.equippedItemIds || [];
      const currentlyEquipped = equippedIds.includes(item.id);
      const willEquip = !currentlyEquipped;

      const newEquippedIds = willEquip
        ? Array.from(new Set([...equippedIds, item.id]))
        : equippedIds.filter((id) => id !== item.id);

      // Apply or remove stat bonus
      const stats: CharacterAttributes = { ...character.stats };
      if (item.statBonus) {
        const delta = willEquip ? item.statBonus.amount : -item.statBonus.amount;
        stats[item.statBonus.stat] = Math.max(1, (stats[item.statBonus.stat] || 0) + delta);
      } else if (item.statsBonus) {
        for (const [k, v] of Object.entries(item.statsBonus)) {
          const key = k as keyof CharacterAttributes;
          if (typeof v === 'number') {
            const delta = willEquip ? v : -v;
            stats[key] = Math.max(1, (stats[key] || 0) + delta);
          }
        }
      }

      const updatedCharacter = db.updateCharacter(req.user.id, {
        equippedItemIds: newEquippedIds,
        stats,
      });

      res.json({
        message: willEquip ? `${item.name} equipped!` : `${item.name} unequipped.`,
        item: { ...item, owned: true, equipped: willEquip },
        character: updatedCharacter,
      });
    } catch (err) {
      console.error('EquipItem error:', err);
      res.status(500).json({ error: 'Failed to equip item.' });
    }
  }
}
