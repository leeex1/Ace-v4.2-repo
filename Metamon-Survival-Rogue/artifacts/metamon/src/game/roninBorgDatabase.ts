import { PART_TYPES, type PartType, type ElementType } from "./constants";

export interface RoninBorgPart {
  id: string;
  name: string;
  type: PartType;
  element: ElementType;
  rarity: "common" | "uncommon" | "rare" | "ultra_rare" | "super_rare" | "mega_rare" | "legendary";
  hpBonus: number;
  atkBonus: number;
  defBonus: number;
  spdBonus: number;
  specialAbility?: string;
  description: string;
}

export interface RoninBorgParts {
  head: string;
  body: string;
  arms: string;
  legs: string;
  tail: string;
  weapon: string;
}

export interface RoninBorg {
  speciesId: number;
  speciesName: string;
  evolutionStage: 0 | 1 | 2 | 3; // 0=basic, 1=stage1, 2=stage2, 3=final
  level: number;
  experience: number;
  parts: Record<PartType, string>;
  nickname?: string;
}

export const RONIN_BORG_PARTS: Record<string, RoninBorgPart> = {
  // Head Parts
  "head_neon_kensei": {
    id: "head_neon_kensei",
    name: "Neon Kensei Helm",
    type: "head",
    element: "electric",
    rarity: "common",
    hpBonus: 10,
    atkBonus: 5,
    defBonus: 3,
    spdBonus: 2,
    description: "A sleek helmet with glowing neon circuits. Grants enhanced accuracy."
  },
  "head_chrome_shogun": {
    id: "head_chrome_shogun",
    name: "Chrome Shogun Helm",
    type: "head",
    element: "normal",
    rarity: "common",
    hpBonus: 15,
    atkBonus: 2,
    defBonus: 8,
    spdBonus: 1,
    description: "Heavy armor plating. Grants damage resistance."
  },
  "head_phantom_strider": {
    id: "head_phantom_strider",
    name: "Phantom Strider Mask",
    type: "head",
    element: "psychic",
    rarity: "uncommon",
    hpBonus: 5,
    atkBonus: 8,
    defBonus: 2,
    spdBonus: 5,
    specialAbility: "stealth_boost",
    description: "Advanced optics grant invisibility in shadows."
  },

  // Body Parts
  "body_neon_kensei": {
    id: "body_neon_kensei",
    name: "Neon Kensei Frame",
    type: "body",
    element: "electric",
    rarity: "common",
    hpBonus: 20,
    atkBonus: 10,
    defBonus: 5,
    spdBonus: 3,
    description: "Lightweight frame with enhanced speed."
  },
  "body_chrome_shogun": {
    id: "body_chrome_shogun",
    name: "Chrome Shogun Armor",
    type: "body",
    element: "normal",
    rarity: "common",
    hpBonus: 30,
    atkBonus: 5,
    defBonus: 15,
    spdBonus: 1,
    description: "Heavy armor plating. Maximum defense."
  },
  "body_phantom_strider": {
    id: "body_phantom_strider",
    name: "Phantom Strider Chassis",
    type: "body",
    element: "psychic",
    rarity: "uncommon",
    hpBonus: 10,
    atkBonus: 12,
    defBonus: 3,
    spdBonus: 8,
    description: "Stealth-enhanced frame with silent movement."
  },

  // Arm Parts
  "arms_neon_kensei": {
    id: "arms_neon_kensei",
    name: "Neon Kensei Blades",
    type: "arms",
    element: "electric",
    rarity: "common",
    hpBonus: 5,
    atkBonus: 15,
    defBonus: 2,
    spdBonus: 3,
    description: "Twin energy blades with rapid strike capability."
  },
  "arms_chrome_shogun": {
    id: "arms_chrome_shogun",
    name: "Chrome Shogun Gauntlets",
    type: "arms",
    element: "normal",
    rarity: "common",
    hpBonus: 8,
    atkBonus: 8,
    defBonus: 10,
    spdBonus: 1,
    description: "Heavy gauntlets for defensive combat."
  },
  "arms_phantom_strider": {
    id: "arms_phantom_strider",
    name: "Phantom Strider Claws",
    type: "arms",
    element: "psychic",
    rarity: "uncommon",
    hpBonus: 3,
    atkBonus: 18,
    defBonus: 1,
    spdBonus: 6,
    specialAbility: "critical_strike",
    description: "Assassin's claws with enhanced critical chance."
  },

  // Leg Parts
  "legs_neon_kensei": {
    id: "legs_neon_kensei",
    name: "Neon Kensei Boosters",
    type: "legs",
    element: "electric",
    rarity: "common",
    hpBonus: 5,
    atkBonus: 3,
    defBonus: 2,
    spdBonus: 8,
    description: "High-speed propulsion systems."
  },
  "legs_chrome_shogun": {
    id: "legs_chrome_shogun",
    name: "Chrome Shogun Greaves",
    type: "legs",
    element: "normal",
    rarity: "common",
    hpBonus: 10,
    atkBonus: 2,
    defBonus: 8,
    spdBonus: 2,
    description: "Heavy armor plating. Stable but slow."
  },
  "legs_phantom_strider": {
    id: "legs_phantom_strider",
    name: "Phantom Strider Hydraulics",
    type: "legs",
    element: "psychic",
    rarity: "uncommon",
    hpBonus: 3,
    atkBonus: 5,
    defBonus: 3,
    spdBonus: 10,
    description: "Silent movement with enhanced evasion."
  },

  // Tail Parts
  "tail_neon_kensei": {
    id: "tail_neon_kensei",
    name: "Neon Kensei Coil",
    type: "tail",
    element: "electric",
    rarity: "common",
    hpBonus: 3,
    atkBonus: 5,
    defBonus: 2,
    spdBonus: 4,
    description: "Energy tail that boosts electric attacks."
  },
  "tail_chrome_shogun": {
    id: "tail_chrome_shogun",
    name: "Chrome Shogun Plating",
    type: "tail",
    element: "normal",
    rarity: "common",
    hpBonus: 8,
    atkBonus: 2,
    defBonus: 6,
    spdBonus: 1,
    description: "Heavy armor tail for maximum protection."
  },
  "tail_phantom_strider": {
    id: "tail_phantom_strider",
    name: "Phantom Strider Cloak",
    type: "tail",
    element: "psychic",
    rarity: "uncommon",
    hpBonus: 2,
    atkBonus: 8,
    defBonus: 1,
    spdBonus: 6,
    specialAbility: "camouflage",
    description: "Adaptive camouflage system."
  },

  // Weapon Parts
  "weapon_neon_kensei": {
    id: "weapon_neon_kensei",
    name: "Neon Kensei Katana",
    type: "weapon",
    element: "electric",
    rarity: "common",
    hpBonus: 0,
    atkBonus: 20,
    defBonus: 1,
    spdBonus: 2,
    description: "High-frequency energy blade."
  },
  "weapon_chrome_shogun": {
    id: "weapon_chrome_shogun",
    name: "Chrome Shogun Shield",
    type: "weapon",
    element: "normal",
    rarity: "common",
    hpBonus: 5,
    atkBonus: 5,
    defBonus: 15,
    spdBonus: 1,
    description: "Heavy shield for defensive combat."
  },
  "weapon_phantom_strider": {
    id: "weapon_phantom_strider",
    name: "Phantom Strider Shuriken",
    type: "weapon",
    element: "psychic",
    rarity: "uncommon",
    hpBonus: 0,
    atkBonus: 25,
    defBonus: 0,
    spdBonus: 8,
    specialAbility: "poison",
    description: "Toxic shuriken with damage over time."
  }
};

export const RONIN_BORG_SPECIES: Record<string, { speciesName: string; baseElement: ElementType; evolutionLevels: number }> = {
  // Tier 1 - Basic Ronin (1-15)
  1: { speciesName: "Volt Ronin", baseElement: "electric", evolutionLevels: 3 },
  2: { speciesName: "Aqua Ronin", baseElement: "water", evolutionLevels: 3 },
  3: { speciesName: "Pyro Ronin", baseElement: "fire", evolutionLevels: 3 },
  4: { speciesName: "Terra Ronin", baseElement: "grass", evolutionLevels: 3 },
  5: { speciesName: "Cyber Ronin", baseElement: "psychic", evolutionLevels: 3 },
  6: { speciesName: "Shadow Ronin", baseElement: "dark", evolutionLevels: 3 },
  7: { speciesName: "Nova Ronin", baseElement: "normal", evolutionLevels: 3 },
  8: { speciesName: "Frost Ronin", baseElement: "water", evolutionLevels: 3 },
  9: { speciesName: "Storm Ronin", baseElement: "electric", evolutionLevels: 3 },
  10: { speciesName: "Luna Ronin", baseElement: "psychic", evolutionLevels: 3 },
  11: { speciesName: "Blaze Ronin", baseElement: "fire", evolutionLevels: 3 },
  12: { speciesName: "Vapor Ronin", baseElement: "water", evolutionLevels: 3 },
  13: { speciesName: "Crystal Ronin", baseElement: "psychic", evolutionLevels: 3 },
  14: { speciesName: "Dusk Ronin", baseElement: "dark", evolutionLevels: 3 },
  15: { speciesName: "Dawn Ronin", baseElement: "normal", evolutionLevels: 3 },
  
  // Tier 2 - Evolved Ronin (16-30)
  16: { speciesName: "Thunder Ronin", baseElement: "electric", evolutionLevels: 3 },
  17: { speciesName: "Abyss Ronin", baseElement: "water", evolutionLevels: 3 },
  18: { speciesName: "Inferno Ronin", baseElement: "fire", evolutionLevels: 3 },
  19: { speciesName: "Nature Ronin", baseElement: "grass", evolutionLevels: 3 },
  20: { speciesName: "Mind Ronin", baseElement: "psychic", evolutionLevels: 3 },
  21: { speciesName: "Void Ronin", baseElement: "dark", evolutionLevels: 3 },
  22: { speciesName: "Steel Ronin", baseElement: "normal", evolutionLevels: 3 },
  23: { speciesName: "Ice Ronin", baseElement: "water", evolutionLevels: 3 },
  24: { speciesName: "Plasma Ronin", baseElement: "electric", evolutionLevels: 3 },
  25: { speciesName: "Spirit Ronin", baseElement: "psychic", evolutionLevels: 3 },
  26: { speciesName: "Magma Ronin", baseElement: "fire", evolutionLevels: 3 },
  27: { speciesName: "Wave Ronin", baseElement: "water", evolutionLevels: 3 },
  28: { speciesName: "Gem Ronin", baseElement: "psychic", evolutionLevels: 3 },
  29: { speciesName: "Night Ronin", baseElement: "dark", evolutionLevels: 3 },
  30: { speciesName: "Day Ronin", baseElement: "normal", evolutionLevels: 3 },
  
  // Tier 3 - Hybrid Ronin (31-50)
  31: { speciesName: "Spark Ronin", baseElement: "electric", evolutionLevels: 3 },
  32: { speciesName: "Ocean Ronin", baseElement: "water", evolutionLevels: 3 },
  33: { speciesName: "Flame Ronin", baseElement: "fire", evolutionLevels: 3 },
  34: { speciesName: "Leaf Ronin", baseElement: "grass", evolutionLevels: 3 },
  35: { speciesName: "Psych Ronin", baseElement: "psychic", evolutionLevels: 3 },
  36: { speciesName: "Phantom Ronin", baseElement: "dark", evolutionLevels: 3 },
  37: { speciesName: "Chrome Ronin", baseElement: "normal", evolutionLevels: 3 },
  38: { speciesName: "Snow Ronin", baseElement: "water", evolutionLevels: 3 },
  39: { speciesName: "Volt Strike Ronin", baseElement: "electric", evolutionLevels: 3 },
  40: { speciesName: "Soul Ronin", baseElement: "psychic", evolutionLevels: 3 },
  41: { speciesName: "Heat Ronin", baseElement: "fire", evolutionLevels: 3 },
  42: { speciesName: "Tide Ronin", baseElement: "water", evolutionLevels: 3 },
  43: { speciesName: "Prism Ronin", baseElement: "psychic", evolutionLevels: 3 },
  44: { speciesName: "Shadow Strike Ronin", baseElement: "dark", evolutionLevels: 3 },
  45: { speciesName: "Pure Ronin", baseElement: "normal", evolutionLevels: 3 },
  46: { speciesName: "Bolt Ronin", baseElement: "electric", evolutionLevels: 3 },
  47: { speciesName: "Mist Ronin", baseElement: "water", evolutionLevels: 3 },
  48: { speciesName: "Ember Ronin", baseElement: "fire", evolutionLevels: 3 },
  49: { speciesName: "Root Ronin", baseElement: "grass", evolutionLevels: 3 },
  50: { speciesName: "Brain Ronin", baseElement: "psychic", evolutionLevels: 3 }
};

export function createRoninBorg(speciesId: number, level: number = 1, parts: Partial<RoninBorgParts> = {}): RoninBorg {
  const species = RONIN_BORG_SPECIES[speciesId];
  if (!species) {
    throw new Error(`Unknown species ID: ${speciesId}`);
  }

  const defaultParts: RoninBorgParts = {
    head: `head_${species.baseElement}_basic`,
    body: `body_${species.baseElement}_basic`,
    arms: `arms_${species.baseElement}_basic`,
    legs: `legs_${species.baseElement}_basic`,
    tail: `tail_${species.baseElement}_basic`,
    weapon: `weapon_${species.baseElement}_basic`
  };

  return {
    speciesId,
    speciesName: species.speciesName,
    evolutionStage: level >= 50 ? 3 : level >= 25 ? 2 : level >= 10 ? 1 : 0,
    level,
    experience: calculateExperience(level),
    parts: { ...defaultParts, ...parts }
  };
}

export function calculateExperience(level: number): number {
  // Experience formula: level^2.5 * 100
  return Math.floor(Math.pow(level, 2.5) * 100);
}

export function getRequiredExperience(level: number): number {
  return calculateExperience(level + 1) - calculateExperience(level);
}

export function getRoninBorgStats(borg: RoninBorg): { hp: number; atk: number; def: number; spd: number } {
  let totalHp = 50 + (borg.level * 10);
  let totalAtk = 30 + (borg.level * 8);
  let totalDef = 20 + (borg.level * 5);
  let totalSpd = 25 + (borg.level * 3);

  // Add part bonuses
  PART_TYPES.forEach(partType => {
    const partId = borg.parts[partType];
    if (partId && RONIN_BORG_PARTS[partId]) {
      const part = RONIN_BORG_PARTS[partId];
      totalHp += part.hpBonus;
      totalAtk += part.atkBonus;
      totalDef += part.defBonus;
      totalSpd += part.spdBonus;
    }
  });

  return {
    hp: totalHp,
    atk: totalAtk,
    def: totalDef,
    spd: totalSpd
  };
}

export function canEvolve(borg: RoninBorg): boolean {
  return borg.level >= 25 && borg.evolutionStage < 2;
}

export function canEvolveToStage2(borg: RoninBorg): boolean {
  return borg.level >= 50 && borg.evolutionStage < 3;
}
