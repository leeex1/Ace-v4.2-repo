import { RONIN_BORG_PARTS, type RoninBorg, type RoninBorgPart } from "./roninBorgDatabase";

export type PartRarity = "common" | "uncommon" | "rare" | "ultra_rare" | "super_rare" | "mega_rare" | "legendary";

export const RARITY_TIERS: PartRarity[] = [
  "common",
  "uncommon", 
  "rare",
  "ultra_rare",
  "super_rare",
  "mega_rare",
  "legendary"
];

export const RARITY_COLORS: Record<PartRarity, string> = {
  common: "#cccccc",
  uncommon: "#4caf50",
  rare: "#2196f3",
  ultra_rare: "#03a9f4",
  super_rare: "#9c27b0",
  mega_rare: "#e91e63",
  legendary: "#ffd700"
};

export const RARITY_STAT_MULTIPLIERS: Record<PartRarity, number> = {
  common: 1.0,
  uncommon: 1.2,
  rare: 1.5,
  ultra_rare: 2.0,
  super_rare: 2.5,
  mega_rare: 3.0,
  legendary: 4.0
};

export interface SetBonus {
  requiredPieces: number;
  bonus: {
    hp?: number;
    atk?: number;
    def?: number;
    spd?: number;
    specialAbility?: string;
  };
  description: string;
}

export interface PartSet {
  id: string;
  name: string;
  description: string;
  parts: string[];
  bonuses: SetBonus[];
}

export const PART_SETS: PartSet[] = [
  {
    id: "neon_kensei_set",
    name: "Neon Kensei Set",
    description: "Complete set of electric Ronin Borg parts. Grants speed and accuracy bonuses.",
    parts: [
      "head_neon_kensei",
      "body_neon_kensei", 
      "arms_neon_kensei",
      "legs_neon_kensei",
      "tail_neon_kensei",
      "weapon_neon_kensei"
    ],
    bonuses: [
      {
        requiredPieces: 3,
        bonus: { spd: 15, atk: 10 },
        description: "3 pieces: +15 SPD, +10 ATK"
      },
      {
        requiredPieces: 6,
        bonus: { spd: 30, atk: 25, specialAbility: "lightning_strike" },
        description: "6 pieces: +30 SPD, +25 ATK, Lightning Strike ability"
      }
    ]
  },
  {
    id: "chrome_shogun_set",
    name: "Chrome Shogun Set", 
    description: "Heavy defensive armor set. Maximizes durability and defense.",
    parts: [
      "head_chrome_shogun",
      "body_chrome_shogun",
      "arms_chrome_shogun", 
      "legs_chrome_shogun",
      "tail_chrome_shogun",
      "weapon_chrome_shogun"
    ],
    bonuses: [
      {
        requiredPieces: 3,
        bonus: { hp: 30, def: 20 },
        description: "3 pieces: +30 HP, +20 DEF"
      },
      {
        requiredPieces: 6,
        bonus: { hp: 60, def: 45, specialAbility: "iron_wall" },
        description: "6 pieces: +60 HP, +45 DEF, Iron Wall ability"
      }
    ]
  },
  {
    id: "phantom_strider_set",
    name: "Phantom Strider Set",
    description: "Stealth-focused set for critical strikes and evasion.",
    parts: [
      "head_phantom_strider",
      "body_phantom_strider",
      "arms_phantom_strider",
      "legs_phantom_strider", 
      "tail_phantom_strider",
      "weapon_phantom_strider"
    ],
    bonuses: [
      {
        requiredPieces: 3,
        bonus: { atk: 20, spd: 15 },
        description: "3 pieces: +20 ATK, +15 SPD"
      },
      {
        requiredPieces: 6,
        bonus: { atk: 40, spd: 30, specialAbility: "phantom_strike" },
        description: "6 pieces: +40 ATK, +30 SPD, Phantom Strike ability"
      }
    ]
  }
];

export function getPartRarity(partId: string): PartRarity | null {
  const part = RONIN_BORG_PARTS[partId];
  return part ? part.rarity : null;
}

export function getPartRarityColor(partId: string): string {
  const rarity = getPartRarity(partId);
  return rarity ? RARITY_COLORS[rarity] : "#ffffff";
}

export function calculatePartStats(part: RoninBorgPart): {
  hp: number;
  atk: number;
  def: number;
  spd: number;
} {
  const multiplier = RARITY_STAT_MULTIPLIERS[part.rarity];
  
  return {
    hp: Math.floor(part.hpBonus * multiplier),
    atk: Math.floor(part.atkBonus * multiplier),
    def: Math.floor(part.defBonus * multiplier),
    spd: Math.floor(part.spdBonus * multiplier)
  };
}

export function checkSetBonuses(borg: RoninBorg): SetBonus[] {
  const activeBonuses: SetBonus[] = [];
  
  PART_SETS.forEach(set => {
    const equippedPieces = set.parts.filter(partId => 
      Object.values(borg.parts).includes(partId)
    ).length;
    
    // Apply highest qualifying bonus
    const qualifyingBonuses = set.bonuses.filter(bonus => 
      equippedPieces >= bonus.requiredPieces
    );
    
    if (qualifyingBonuses.length > 0) {
      // Get the highest tier bonus
      const highestBonus = qualifyingBonuses.reduce((max, current) => 
        current.requiredPieces > max.requiredPieces ? current : max
      );
      activeBonuses.push(highestBonus);
    }
  });
  
  return activeBonuses;
}

export function calculateTotalStatsWithRarity(borg: RoninBorg): {
  hp: number;
  atk: number;
  def: number;
  spd: number;
  setBonuses: SetBonus[];
} {
  let totalHp = 50 + (borg.level * 10);
  let totalAtk = 30 + (borg.level * 5);
  let totalDef = 20 + (borg.level * 3);
  let totalSpd = 15 + (borg.level * 2);

  // Add part stats with rarity multipliers
  Object.values(borg.parts).forEach(partId => {
    if (partId && RONIN_BORG_PARTS[partId]) {
      const part = RONIN_BORG_PARTS[partId];
      const stats = calculatePartStats(part);
      totalHp += stats.hp;
      totalAtk += stats.atk;
      totalDef += stats.def;
      totalSpd += stats.spd;
    }
  });

  // Add set bonuses
  const setBonuses = checkSetBonuses(borg);
  setBonuses.forEach(bonus => {
    if (bonus.bonus.hp) totalHp += bonus.bonus.hp;
    if (bonus.bonus.atk) totalAtk += bonus.bonus.atk;
    if (bonus.bonus.def) totalDef += bonus.bonus.def;
    if (bonus.bonus.spd) totalSpd += bonus.bonus.spd;
  });

  return {
    hp: totalHp,
    atk: totalAtk,
    def: totalDef,
    spd: totalSpd,
    setBonuses
  };
}

export function getRarityProgression(currentRarity: PartRarity): PartRarity | null {
  const currentIndex = RARITY_TIERS.indexOf(currentRarity);
  if (currentIndex < RARITY_TIERS.length - 1) {
    return RARITY_TIERS[currentIndex + 1];
  }
  return null;
}

export function canUpgradePart(partId: string): boolean {
  const part = RONIN_BORG_PARTS[partId];
  if (!part) return false;
  
  return getRarityProgression(part.rarity) !== null;
}

export function getUpgradeRequirements(partId: string): {
  gold: number;
  materials: string[];
} | null {
  const part = RONIN_BORG_PARTS[partId];
  if (!part) return null;
  
  const rarityCosts: Record<PartRarity, number> = {
    common: 100,
    uncommon: 250,
    rare: 500,
    ultra_rare: 1000,
    super_rare: 2000,
    mega_rare: 5000,
    legendary: 10000
  };
  
  return {
    gold: rarityCosts[part.rarity],
    materials: [`${part.rarity}_core`]
  };
}
