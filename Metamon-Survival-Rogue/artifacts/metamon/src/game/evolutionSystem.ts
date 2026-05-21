import { RONIN_BORG_PARTS, RONIN_BORG_SPECIES, type RoninBorg, type RoninBorgPart } from "./roninBorgDatabase";

export interface EvolutionRequirements {
  level: number;
  requiredItem?: string;
  experiencePoints: number;
}

export interface EvolutionStage {
  stage: 0 | 1 | 2 | 3;
  name: string;
  description: string;
  statBoost: {
    hp: number;
    atk: number;
    def: number;
    spd: number;
  };
  visualChange: string;
}

export const EVOLUTION_STAGES: Record<number, EvolutionStage> = {
  0: {
    stage: 0,
    name: "Base Form",
    description: "The initial form of a Ronin Borg. Simple but full of potential.",
    statBoost: { hp: 0, atk: 0, def: 0, spd: 0 },
    visualChange: "basic"
  },
  1: {
    stage: 1,
    name: "Awakened",
    description: "First evolution. Gains enhanced abilities and improved stats.",
    statBoost: { hp: 20, atk: 15, def: 10, spd: 8 },
    visualChange: "enhanced"
  },
  2: {
    stage: 2,
    name: "Cyber Master",
    description: "Second evolution. Unlocks advanced cybernetic capabilities.",
    statBoost: { hp: 35, atk: 25, def: 18, spd: 15 },
    visualChange: "advanced"
  },
  3: {
    stage: 3,
    name: "Omega Form",
    description: "Final evolution. Reaches maximum potential with legendary power.",
    statBoost: { hp: 50, atk: 40, def: 30, spd: 25 },
    visualChange: "legendary"
  }
};

export const EVOLUTION_REQUIREMENTS: Record<number, EvolutionRequirements> = {
  1: { level: 16, experiencePoints: 5000 },
  2: { level: 36, experiencePoints: 15000 },
  3: { level: 50, experiencePoints: 30000, requiredItem: "Evolution Core" }
};

export function getEvolutionRequirements(stage: number): EvolutionRequirements | null {
  return EVOLUTION_REQUIREMENTS[stage] || null;
}

export function canEvolve(borg: RoninBorg): boolean {
  const nextStage = borg.evolutionStage + 1;
  const requirements = getEvolutionRequirements(nextStage);
  
  if (!requirements) return false;
  
  return borg.level >= requirements.level && borg.experience >= requirements.experiencePoints;
}

export function getEvolutionStageInfo(stage: number): EvolutionStage | null {
  return EVOLUTION_STAGES[stage] || null;
}

export function evolveRoninBorg(borg: RoninBorg): RoninBorg | null {
  if (!canEvolve(borg)) return null;
  
  const nextStage = borg.evolutionStage + 1;
  const stageInfo = getEvolutionStageInfo(nextStage);
  
  if (!stageInfo) return null;
  
  // Create evolved Ronin Borg
  const evolvedBorg: RoninBorg = {
    ...borg,
    evolutionStage: nextStage as 0 | 1 | 2 | 3,
    speciesName: getEvolvedSpeciesName(borg.speciesId, nextStage),
    experience: borg.experience - (EVOLUTION_REQUIREMENTS[nextStage]?.experiencePoints || 0)
  };
  
  return evolvedBorg;
}

function getEvolvedSpeciesName(speciesId: number, stage: number): string {
  const baseSpecies = RONIN_BORG_SPECIES[speciesId];
  if (!baseSpecies) return "Unknown Ronin";
  
  const stageNames = ["", "Neo-", "Cyber-", "Omega-"];
  return `${stageNames[stage]}${baseSpecies.speciesName}`;
}

export function getEvolvedParts(borg: RoninBorg, stage: number): Record<string, string> {
  const evolvedParts: Record<string, string> = {};
  
  // Update part names to reflect evolution stage
  Object.entries(borg.parts).forEach(([partType, partId]) => {
    if (partId && RONIN_BORG_PARTS[partId]) {
      const part = RONIN_BORG_PARTS[partId];
      evolvedParts[partType] = partId.replace(/_basic|_stage\d/, `_stage${stage}`);
    }
  });
  
  return evolvedParts;
}

export function calculateEvolutionStats(borg: RoninBorg): {
  hp: number;
  atk: number;
  def: number;
  spd: number;
} {
  const baseStats = {
    hp: 50 + (borg.level * 10),
    atk: 30 + (borg.level * 5),
    def: 20 + (borg.level * 3),
    spd: 15 + (borg.level * 2)
  };
  
  // Add evolution stage bonuses
  const stageInfo = getEvolutionStageInfo(borg.evolutionStage);
  if (stageInfo) {
    baseStats.hp += stageInfo.statBoost.hp;
    baseStats.atk += stageInfo.statBoost.atk;
    baseStats.def += stageInfo.statBoost.def;
    baseStats.spd += stageInfo.statBoost.spd;
  }
  
  return baseStats;
}

// Evolution item system
export interface EvolutionItem {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "rare" | "legendary";
  effect: string;
}

export const EVOLUTION_ITEMS: EvolutionItem[] = [
  {
    id: "evo_shard",
    name: "Evolution Shard",
    description: "A common material used for basic evolution.",
    rarity: "common",
    effect: "Required for Stage 1 evolution"
  },
  {
    id: "evo_core",
    name: "Evolution Core",
    description: "A rare component needed for advanced evolution.",
    rarity: "rare",
    effect: "Required for Stage 2 evolution"
  },
  {
    id: "evo_omega",
    name: "Omega Core",
    description: "A legendary crystal for final evolution.",
    rarity: "legendary",
    effect: "Required for Stage 3 evolution"
  }
];

export function getEvolutionItem(itemId: string): EvolutionItem | undefined {
  return EVOLUTION_ITEMS.find(item => item.id === itemId);
}
