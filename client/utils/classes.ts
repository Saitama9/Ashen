import { ClassDefinition, PlayerClass } from '../types';

export const PLAYER_CLASSES: Record<PlayerClass, ClassDefinition> = {
  sorcerer: {
    id: 'sorcerer',
    name: 'Shadow Sorcerer',
    title: 'Acolyte of the Void',
    description: 'A hooded scholar who unlocked forbidden void pyromancy. Summons spectral purple flames to incinerate procrastination.',
    weapon: 'Eye of the Void Staff',
    primaryStat: 'intelligence',
    quote: '“The dark is not empty; it holds the lost axioms of forgotten kings.”',
    unlockCost: 0,
  },
  knight: {
    id: 'knight',
    name: 'Ashen Knight',
    title: 'Keeper of the Kiln',
    description: 'A heavily armored sentinel forged in ancient iron kilns. Relies on unyielding fortitude and mighty greatsword cleaves.',
    weapon: 'Ashen Greatsword',
    primaryStat: 'strength',
    quote: '“Let the embers temper the blade. Stand firm against the fading light.”',
    unlockCost: 350,
  },
  ronin: {
    id: 'ronin',
    name: 'Crimson Ronin',
    title: 'Wind of the Blood Trail',
    description: 'A masterless wanderer cloaked in a fluttering red scarf and wide kasa hat. Strikes with lightning iaido precision.',
    weapon: 'Crescent Katana',
    primaryStat: 'focus',
    quote: '“One breath. One strike. In absolute stillness, the true path reveals itself.”',
    unlockCost: 600,
  },
  rogue: {
    id: 'rogue',
    name: 'Ashen Rogue',
    title: 'Ghost of the Catacombs',
    description: 'A swift traveler in weathered mantle and leather armor. Weaves through trials with rapid dual daggers and stamina.',
    weapon: 'Twin Stiletto Daggers',
    primaryStat: 'vitality',
    quote: '“Unseen, unheard, unbroken. Speed outlasts even the heaviest armor.”',
    unlockCost: 850,
  },
};
