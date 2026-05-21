import type { PartType, ElementType } from "./constants";
import type { Part } from "./parts";

export type PartRarity = "common" | "uncommon" | "rare" | "legendary";

export const RARITY_COLOR: Record<PartRarity, string> = {
  common: "#aaaaaa", uncommon: "#4ecdc4", rare: "#c77dff", legendary: "#f5a623",
};
export const RARITY_POWER_MULT: Record<PartRarity, number> = {
  common: 1.0, uncommon: 1.35, rare: 1.75, legendary: 2.6,
};
export const RARITY_PP: Record<PartRarity, number> = {
  common: 10, uncommon: 12, rare: 10, legendary: 6,
};
export const RARITY_LABEL: Record<PartRarity, string> = {
  common: "Common", uncommon: "Uncommon", rare: "Rare", legendary: "★ Legendary",
};

export interface OwnedPart { part: Part; rarity: PartRarity; }

export interface RPGMove {
  name: string;
  element: ElementType;
  power: number;
  pp: number;
  maxPp: number;
  color: string;
  partType: PartType;
  rarity: PartRarity;
}

export interface HeroMove {
  name: string;
  element: ElementType;
  power: number;
  pp: number;
  maxPp: number;
  color: string;
  effect?: "burn" | "freeze" | "paralyze" | "boost_atk" | "heal_party";
  effectChance?: number;
  description: string;
}

export interface HeroClass {
  id: string;
  name: string;
  element: ElementType;
  portraitKey: string;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseSpd: number;
  bodyColor: string;
  accentColor: string;
  moves: HeroMove[];
  description: string;
}

export interface BattleHero {
  classId: string;
  name: string;
  portraitKey: string;
  element: ElementType;
  level: number;
  currentHp: number;
  maxHp: number;
  atk: number;
  def_stat: number;
  spd: number;
  atb: number;
  moves: HeroMove[];
  ppLeft: number[];
  bodyColor: string;
  accentColor: string;
  status?: "burn" | "freeze" | "paralyze" | "poison" | "sleep";
  statusTurns: number;
  isFainted: boolean;
}

export interface RPGMon {
  templateId: number;
  name: string;
  portraitKey: string;
  element: ElementType;
  level: number;
  currentHp: number;
  maxHp: number;
  atk: number;
  def_stat: number;
  spd: number;
  atb: number;
  moves: RPGMove[];
  bodyColor: string;
  accentColor: string;
  status?: "burn" | "freeze" | "paralyze" | "poison" | "sleep";
  statusTurns: number;
  isFainted: boolean;
  isPlayerOwned: boolean;
  catchRate: number;
  tier: 1 | 2 | 3 | 4;
  lootPartIds: string[];
  uid: number;
}

export type BattlePhase =
  | "intro" | "battle" | "choosing" | "choosing_skill"
  | "animating" | "catch_anim" | "catch_result"
  | "victory" | "defeat" | "fled";

export interface BattleFloat {
  text: string;
  color: string;
  side: "player" | "enemy";
  actorIdx: number;
  life: number;
  maxLife: number;
  id: number;
}

export interface LootDrop { partId: string; rarity: PartRarity; monName: string; }

export type ReadyActor =
  | { kind: "hero" }
  | { kind: "party"; idx: number }
  | { kind: "enemy"; idx: number };

export interface BattleState {
  phase: BattlePhase;
  hero: BattleHero;
  party: (RPGMon | null)[];
  enemies: RPGMon[];
  readyActor: ReadyActor | null;
  log: string[];
  floats: BattleFloat[];
  time: number;
  animTimer: number;
  shakePlayer: number;
  shakeEnemy: number;
  isWild: boolean;
  trainerName?: string;
  trainerPortrait?: string;
  catchShakes: number;
  catchSuccess: boolean;
  loot: LootDrop[];
  expGained: number;
  caughtMonId?: number;
}

export interface EncounterConfig {
  type: "wild" | "trainer";
  wildMonId?: number;
  wildLevel?: number;
  trainerName?: string;
  trainerPortrait?: string;
  trainerTeam?: Array<{ monId: number; level: number }>;
}

export type PlayerAction =
  | { kind: "move"; moveIdx: number; actorType: "hero" | "party"; partyIdx?: number }
  | { kind: "catch" }
  | { kind: "run" }
  | { kind: "heal" };

// Type effectiveness
const EFF: Partial<Record<ElementType, Partial<Record<ElementType, number>>>> = {
  fire:     { grass: 2, water: 0.5, fire: 0.5 },
  water:    { fire: 2, grass: 0.5, water: 0.5 },
  grass:    { water: 2, fire: 0.5, grass: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5 },
  dark:     { psychic: 2, dark: 0.5 },
  psychic:  { dark: 0.5, psychic: 0.5 },
  normal:   {},
};
export function getEffectiveness(atk: ElementType, def: ElementType): number {
  return EFF[atk]?.[def] ?? 1;
}
