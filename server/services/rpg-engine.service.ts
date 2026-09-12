import { CharacterAttributes, QuestDifficulty, QuestCategory } from '../models/types';

export class RpgEngineService {
  /**
   * Non-linear level-to-XP scaling curve:
   * Level 1 -> 100 XP
   * Level 2 -> 273 XP
   * Level 3 -> 490 XP
   * Level 4 -> 741 XP
   * Level 5 -> 1022 XP
   * Each subsequent level demands progressively more discipline.
   */
  static calculateMaxXp(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.42));
  }

  static processXpGain(
    currentLevel: number,
    currentXp: number,
    gainedXp: number,
    currentStats: CharacterAttributes,
    attributeTarget?: keyof CharacterAttributes
  ): {
    oldLevel: number;
    newLevel: number;
    newXp: number;
    newMaxXp: number;
    didLevelUp: boolean;
    statIncreases: { stat: keyof CharacterAttributes; from: number; to: number }[];
    updatedStats: CharacterAttributes;
  } {
    let level = currentLevel;
    let xp = currentXp + gainedXp;
    let maxXp = this.calculateMaxXp(level);
    let didLevelUp = false;

    const initialStats = { ...currentStats };
    const updatedStats = { ...currentStats };

    // Direct attribute boost from quest target
    if (attributeTarget && updatedStats[attributeTarget] !== undefined) {
      updatedStats[attributeTarget] += 1;
    }

    // Process cascading level-ups
    while (xp >= maxXp) {
      xp -= maxXp;
      level += 1;
      maxXp = this.calculateMaxXp(level);
      didLevelUp = true;

      // Every level up yields overall stat enhancements
      updatedStats.strength += 2;
      updatedStats.intelligence += 2;
      updatedStats.vitality += 2;
      updatedStats.focus += 2;
    }

    const statIncreases: { stat: keyof CharacterAttributes; from: number; to: number }[] = [
      { stat: 'strength' as const, from: initialStats.strength, to: updatedStats.strength },
      { stat: 'intelligence' as const, from: initialStats.intelligence, to: updatedStats.intelligence },
      { stat: 'vitality' as const, from: initialStats.vitality, to: updatedStats.vitality },
      { stat: 'focus' as const, from: initialStats.focus, to: updatedStats.focus },
    ].filter((s) => s.to > s.from);

    return {
      oldLevel: currentLevel,
      newLevel: level,
      newXp: xp,
      newMaxXp: maxXp,
      didLevelUp,
      statIncreases,
      updatedStats,
    };
  }

  /**
   * Calculate standard rewards based on difficulty
   */
  static getDifficultyRewards(difficulty: QuestDifficulty): { xp: number; gold: number } {
    switch (difficulty) {
      case 'trivial':
        return { xp: 15, gold: 10 };
      case 'easy':
        return { xp: 35, gold: 25 };
      case 'medium':
        return { xp: 60, gold: 45 };
      case 'hard':
        return { xp: 120, gold: 90 };
      case 'epic':
        return { xp: 250, gold: 200 };
      default:
        return { xp: 40, gold: 30 };
    }
  }

  /**
   * Determine primary attribute for quest category
   */
  static getCategoryAttribute(category: QuestCategory): keyof CharacterAttributes {
    switch (category) {
      case 'fitness':
        return 'strength';
      case 'work':
        return 'focus';
      case 'health':
        return 'vitality';
      case 'study':
        return 'intelligence';
      default:
        return 'focus';
    }
  }

  /**
   * Check and update streak days based on last active date
   */
  static updateStreak(lastActiveDateStr: string, currentStreak: number): { newStreak: number; todayStr: string } {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (!lastActiveDateStr) {
      return { newStreak: 1, todayStr };
    }

    const lastDate = new Date(lastActiveDateStr);
    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, streak remains
      return { newStreak: currentStreak || 1, todayStr };
    } else if (diffDays === 1) {
      // Consecutive day!
      return { newStreak: (currentStreak || 0) + 1, todayStr };
    } else {
      // Streak broken
      return { newStreak: 1, todayStr };
    }
  }
}
