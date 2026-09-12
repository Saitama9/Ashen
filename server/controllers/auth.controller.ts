import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Database } from '../db/database';
import { AuthService } from '../services/auth.service';
import { RpgEngineService } from '../services/rpg-engine.service';
import { BackendUser, BackendCharacter, PlayerClass } from '../models/types';

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { email, username, password, playerClass = 'sorcerer' } = req.body;

      if (!email || !username || !password) {
        res.status(400).json({ error: 'Email, username, and password are required.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long.' });
        return;
      }

      const db = Database.getInstance();

      if (db.findUserByEmail(email)) {
        res.status(409).json({ error: 'An account with this email already exists.' });
        return;
      }

      if (db.findUserByUsername(username)) {
        res.status(409).json({ error: 'Username is already taken by another champion.' });
        return;
      }

      const validClasses: PlayerClass[] = ['sorcerer', 'knight', 'ronin', 'rogue'];
      const selectedClass: PlayerClass = validClasses.includes(playerClass) ? playerClass : 'sorcerer';

      const initialStatsMap: Record<PlayerClass, { strength: number; intelligence: number; vitality: number; focus: number }> = {
        sorcerer: { strength: 8, intelligence: 14, vitality: 10, focus: 12 },
        knight: { strength: 14, intelligence: 8, vitality: 14, focus: 8 },
        ronin: { strength: 13, intelligence: 10, vitality: 10, focus: 11 },
        rogue: { strength: 10, intelligence: 11, vitality: 10, focus: 13 },
      };

      const passwordHash = await AuthService.hashPassword(password);
      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newUser: BackendUser = {
        id: userId,
        email: email.trim().toLowerCase(),
        username: username.trim(),
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.createUser(newUser);

      // Create initial character
      const newCharacter: BackendCharacter = {
        userId,
        playerClass: selectedClass,
        level: 1,
        xp: 0,
        maxXp: RpgEngineService.calculateMaxXp(1),
        gold: 150, // Starting gold
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        stats: initialStatsMap[selectedClass],
        unlockedClasses: [selectedClass],
        ownedItemIds: ['item-1'],
        equippedItemIds: ['item-1'],
        kindleLevel: 1,
      };

      db.createCharacter(newCharacter);

      // Seed starter quests for this newly summoned hero
      db.seedQuestsForUser(userId);

      const token = AuthService.generateToken(newUser);

      res.status(201).json({
        message: 'Account successfully summoned into the realm.',
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
        character: newCharacter,
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Internal server error during registration.' });
    }
  }

  static async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { emailOrUsername, password } = req.body;

      if (!emailOrUsername || !password) {
        res.status(400).json({ error: 'Email/Username and password are required.' });
        return;
      }

      const db = Database.getInstance();
      const user =
        db.findUserByEmail(emailOrUsername) || db.findUserByUsername(emailOrUsername);

      if (!user) {
        res.status(401).json({ error: 'Invalid champion credentials.' });
        return;
      }

      const isMatch = await AuthService.verifyPassword(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid champion credentials.' });
        return;
      }

      const token = AuthService.generateToken(user);
      let character = db.getCharacterByUserId(user.id);

      if (!character) {
        character = {
          userId: user.id,
          playerClass: 'sorcerer',
          level: 1,
          xp: 0,
          maxXp: RpgEngineService.calculateMaxXp(1),
          gold: 150,
          streakDays: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
          stats: { strength: 10, intelligence: 12, vitality: 10, focus: 10 },
          unlockedClasses: ['sorcerer'],
          ownedItemIds: ['item-1'],
          equippedItemIds: ['item-1'],
          kindleLevel: 1,
        };
        db.createCharacter(character);
        db.seedQuestsForUser(user.id);
      }

      res.json({
        message: 'Welcome back to the sanctuary, champion.',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        character,
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal server error during login.' });
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const db = Database.getInstance();
      const character = db.getCharacterByUserId(req.user.id);

      res.json({
        user: {
          id: req.user.id,
          email: req.user.email,
          username: req.user.username,
        },
        character,
      });
    } catch (err) {
      console.error('GetMe error:', err);
      res.status(500).json({ error: 'Failed to retrieve profile.' });
    }
  }

  static async demoLogin(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const db = Database.getInstance();
      const { user, character } = db.ensureDemoUser();
      const token = AuthService.generateToken(user);

      res.json({
        message: 'Logged into Demo Ashen Hero session.',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        character,
      });
    } catch (err) {
      console.error('DemoLogin error:', err);
      res.status(500).json({ error: 'Failed to initiate demo session.' });
    }
  }
}
