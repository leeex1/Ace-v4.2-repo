import type { PartType } from "./constants";
import type { PartRarity } from "./battleTypes";

export interface ExtendedTemplate {
  id: number;
  name: string;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseSpd: number;
  defaultParts: Record<PartType, string>;
  bodyColor: string;
  accentColor: string;
  tier: 1 | 2 | 3 | 4;
  catchRate: number;
}

function m(
  id: number, name: string,
  hp: number, atk: number, def: number, spd: number,
  hd: string, bd: string, ar: string, lg: string, tl: string, wp: string,
  bc: string, ac: string,
  tier: 1 | 2 | 3 | 4, cr: number
): ExtendedTemplate {
  return {
    id, name, baseHp: hp, baseAtk: atk, baseDef: def, baseSpd: spd,
    defaultParts: { head: hd, body: bd, arms: ar, legs: lg, tail: tl, weapon: wp },
    bodyColor: bc, accentColor: ac, tier, catchRate: cr,
  };
}

// Shorthand part IDs
const HF = "head_flame", HC = "head_cyber", HX = "head_crystal", HA = "head_aqua", HL = "head_leaf";
const BS = "body_steel", BM = "body_magma", BW = "body_shadow", BV = "body_vine", BO = "body_storm";
const AC = "arms_cannon", AK = "arms_claws", AH = "arms_hydro", AP = "arms_plasma", AL = "arms_leaf";
const LR = "legs_rocket", LO = "legs_root", LH = "legs_hydro", LS = "legs_shadow", LT = "legs_thunder";
const TS = "tail_scorpion", TF = "tail_flame", TQ = "tail_aqua", TE = "tail_electric", TL = "tail_leaf";
const WS = "weapon_sword", WT = "weapon_staff", WB = "weapon_bow", WD = "weapon_shield", WC = "weapon_scythe";

export const ALL_MON_TEMPLATES: ExtendedTemplate[] = [
  // ── TIER 1: COMMON (IDs 1-30) ────────────────────────────────────────────
  m(1,  "Flambit",     80,  70, 50, 75,  HF,BM,AC,LR,TF,WS, "#cc3300","#ff6b35", 1, 0.65),
  m(2,  "Aquashell",  110,  55, 80, 60,  HA,BV,AH,LH,TQ,WD, "#1a5a8a","#4ecdc4", 1, 0.65),
  m(3,  "Zaptor",      70,  80, 45, 90,  HC,BO,AP,LT,TE,WB, "#998800","#ffe66d", 1, 0.60),
  m(4,  "Leafang",     95,  65, 65, 70,  HL,BV,AL,LO,TL,WT, "#2d6a1a","#95e277", 1, 0.65),
  m(5,  "Shadowpyre",  85,  90, 40, 80,  HX,BW,AK,LS,TS,WC, "#2a1a3a","#7b2d8b", 1, 0.60),
  m(6,  "Ironclad",   130,  60,100, 45,  HX,BS,AH,LO,TQ,WD, "#555555","#aaaaaa", 1, 0.60),
  m(7,  "Pyrostrike",  75,  95, 40, 85,  HF,BM,AK,LR,TF,WC, "#aa1100","#ff9933", 1, 0.62),
  m(8,  "Stormwing",   80,  75, 50, 95,  HC,BO,AP,LT,TE,WB, "#5533cc","#99aaff", 1, 0.62),
  m(9,  "Tidecrawl",  105,  60, 85, 65,  HA,BS,AH,LH,TQ,WD, "#0a4a6a","#55ddee", 1, 0.65),
  m(10, "Venomscale",  90,  85, 55, 70,  HX,BW,AK,LS,TS,WC, "#1a2a0a","#55aa22", 1, 0.62),
  m(11, "Boulderback",140,  50,110, 40,  HL,BS,AH,LO,TL,WD, "#554433","#aa8866", 1, 0.62),
  m(12, "Prismshard",  75,  90, 55, 80,  HX,BO,AP,LT,TE,WT, "#4422aa","#bb99ff", 1, 0.60),
  m(13, "Torchback",   85,  80, 60, 75,  HF,BM,AC,LR,TS,WS, "#881100","#ffaa33", 1, 0.65),
  m(14, "Cloudpuff",   70,  70, 45,100,  HC,BW,AP,LS,TE,WB, "#bbccdd","#eeeeff", 1, 0.68),
  m(15, "Mudslug",    120,  55, 95, 35,  HL,BV,AH,LO,TQ,WD, "#664422","#997755", 1, 0.65),
  m(16, "Thunderfang",  80,  88, 48, 85, HC,BO,AK,LT,TE,WB, "#334400","#aacc00", 1, 0.62),
  m(17, "Frostclaw",   90,  75, 70, 70,  HA,BS,AK,LH,TQ,WS, "#224466","#aaddff", 1, 0.62),
  m(18, "Spiritox",    75,  82, 55, 88,  HX,BW,AP,LS,TS,WT, "#2a004a","#cc44ff", 1, 0.60),
  m(19, "Lavarock",   110,  70, 85, 50,  HF,BS,AC,LO,TF,WS, "#882200","#ffaa66", 1, 0.65),
  m(20, "Seaserpent",  95,  72, 68, 80,  HA,BV,AH,LH,TQ,WT, "#004455","#00cccc", 1, 0.65),
  m(21, "Blazewing",   72,  92, 44, 92,  HF,BO,AC,LR,TF,WB, "#993300","#ffcc33", 1, 0.62),
  m(22, "Darkveil",    82,  88, 52, 82,  HX,BW,AK,LS,TS,WC, "#110022","#9922cc", 1, 0.60),
  m(23, "Gaiafist",   100,  78, 78, 62,  HL,BV,AL,LO,TL,WS, "#113300","#66dd00", 1, 0.65),
  m(24, "Voltbreaker",  76,  86, 46, 94, HC,BO,AP,LT,TE,WC, "#555500","#ffff00", 1, 0.62),
  m(25, "Crystalhorn",  88,  80, 72, 72, HX,BS,AP,LH,TQ,WT, "#334488","#aabbff", 1, 0.60),
  m(26, "Thornback",   98,  68, 80, 66,  HL,BS,AL,LO,TS,WD, "#223300","#77cc00", 1, 0.65),
  m(27, "Infernotail",  78,  94, 50, 76, HF,BM,AC,LR,TS,WC, "#661100","#ff5500", 1, 0.62),
  m(28, "Wavecrest",  105,  62, 76, 78,  HA,BV,AH,LH,TQ,WD, "#003355","#33aacc", 1, 0.65),
  m(29, "Shadowblaze",  80,  91, 50, 85, HF,BW,AK,LS,TF,WC, "#220011","#cc1144", 1, 0.60),
  m(30, "Omegacore",  100,  90, 75, 85,  HX,BO,AC,LR,TE,WT, "#112244","#5588ff", 1, 0.58),

  // ── TIER 2: EVOLVED (IDs 31-55) ──────────────────────────────────────────
  m(31, "Infernoback", 125,112, 72,102,  HF,BM,AC,LR,TF,WS, "#8B0000","#ff4400", 2, 0.42),
  m(32, "Deepshell",   148, 78,114, 82,  HA,BS,AH,LH,TQ,WD, "#003366","#00ccff", 2, 0.42),
  m(33, "Voltking",     98,112, 62,125,  HC,BO,AP,LT,TE,WB, "#665500","#ffee44", 2, 0.40),
  m(34, "Forestlord",  132, 92, 92, 96,  HL,BV,AL,LO,TL,WT, "#1a4400","#77ee22", 2, 0.42),
  m(35, "Voidpyre",    118,125, 56,112,  HX,BW,AK,LS,TS,WC, "#1a0033","#aa33ff", 2, 0.38),
  m(36, "Titanwall",   175, 85,145, 62,  HX,BS,AH,LO,TQ,WD, "#444444","#cccccc", 2, 0.40),
  m(37, "Blazemaster", 105,132, 56,118,  HF,BM,AK,LR,TF,WC, "#881100","#ff7722", 2, 0.40),
  m(38, "Stormking",   110,108, 70,132,  HC,BO,AP,LT,TE,WB, "#441188","#aabbff", 2, 0.40),
  m(39, "Abysscrawl",  142, 88,118, 90,  HA,BS,AH,LH,TQ,WD, "#002244","#44ddff", 2, 0.42),
  m(40, "Viperking",   122,118, 76, 98,  HX,BW,AK,LS,TS,WC, "#0a1a04","#44bb11", 2, 0.40),
  m(41, "Mountainback",188, 72,152, 56,  HL,BS,AH,LO,TL,WD, "#443322","#ccaa88", 2, 0.40),
  m(42, "Diamondshard",104,128, 78,112,  HX,BO,AP,LT,TE,WT, "#2a1188","#ddccff", 2, 0.38),
  m(43, "Magmatitan",  118,115, 85,105,  HF,BM,AC,LR,TS,WS, "#661100","#ff9944", 2, 0.42),
  m(44, "Stormcloud",   96, 98, 65,142,  HC,BW,AP,LS,TE,WB, "#888899","#ddeeff", 2, 0.42),
  m(45, "Quicksand",   158, 78,130, 50,  HA,BV,AH,LO,TQ,WD, "#443311","#998866", 2, 0.42),
  m(46, "Thunderlord",  108,122, 68,118, HC,BO,AK,LT,TE,WB, "#224400","#bbdd00", 2, 0.40),
  m(47, "Glacierclaw",  122,105, 98, 98, HA,BS,AK,LH,TQ,WS, "#163348","#99eeff", 2, 0.40),
  m(48, "Wraithox",     105,115, 78,122, HX,BW,AP,LS,TS,WT, "#1e0038","#ee55ff", 2, 0.38),
  m(49, "Volcanrock",   148, 98,118, 70, HF,BS,AC,LO,TF,WS, "#661800","#ffcc88", 2, 0.42),
  m(50, "Tidalwyrm",   128, 102, 96,112, HA,BV,AH,LH,TQ,WT, "#002f3a","#00dddd", 2, 0.42),
  m(51, "Phoenixwing",   98,130, 62,128, HF,BO,AC,LR,TF,WB, "#772200","#ffdd22", 2, 0.40),
  m(52, "Shadowlord",   112,125, 74,116, HX,BW,AK,LS,TS,WC, "#0d0018","#bb22ee", 2, 0.38),
  m(53, "Terrafist",   135,112,108, 86,  HL,BV,AL,LO,TL,WS, "#0d2200","#88ee22", 2, 0.42),
  m(54, "Thunderknight",104,122, 66,132, HC,BO,AP,LT,TE,WC, "#3a3a00","#eedd00", 2, 0.40),
  m(55, "Cosmicshard",  118,118,102,102, HX,BO,AH,LH,TQ,WT, "#221166","#bb99ff", 2, 0.38),

  // ── TIER 3: HYBRIDS & FUSIONS (IDs 56-70) ────────────────────────────────
  m(56, "Steamjaw",    145,128, 95,108,  HF,BM,AH,LH,TQ,WS, "#5a1a00","#ff8855", 3, 0.22),
  m(57, "Magmavine",   138,122, 98, 95,  HF,BV,AC,LO,TF,WT, "#443300","#ff8800", 3, 0.22),
  m(58, "Plasmadrake", 132,138, 78,125,  HF,BO,AP,LR,TE,WB, "#552200","#ffcc22", 3, 0.20),
  m(59, "Ashwalker",   128,142, 72,128,  HF,BW,AK,LS,TF,WC, "#330011","#ff3333", 3, 0.20),
  m(60, "Mistcrawler", 155,108,118, 95,  HA,BV,AL,LO,TQ,WT, "#002211","#44ddaa", 3, 0.22),
  m(61, "Stormtide",   138,132, 85,122,  HA,BO,AP,LT,TE,WB, "#002244","#44aaff", 3, 0.20),
  m(62, "Darkwater",   142,128, 95,112,  HA,BW,AK,LS,TQ,WC, "#001122","#2299aa", 3, 0.20),
  m(63, "Thunderleaf", 128,138, 80,125,  HL,BO,AP,LT,TL,WB, "#223300","#aaff33", 3, 0.22),
  m(64, "Thornshade",  145,122,105,105,  HL,BW,AK,LO,TS,WC, "#111a00","#88aa22", 3, 0.22),
  m(65, "Voidstrike",  118,148, 68,138,  HC,BW,AK,LS,TE,WC, "#110033","#cc88ff", 3, 0.20),
  m(66, "Fusionblade", 162,145, 98,118,  HF,BO,AC,LR,TQ,WS, "#551100","#ff9911", 3, 0.18),
  m(67, "Omegastorm",  148,152, 82,138,  HC,BW,AP,LS,TE,WT, "#220044","#dd44ff", 3, 0.16),
  m(68, "Primecrawl",  168,118,128,102,  HA,BV,AK,LO,TQ,WT, "#001122","#33bbaa", 3, 0.16),
  m(69, "Riftcleave",  142,158, 75,132,  HF,BO,AP,LS,TS,WC, "#330022","#ff4488", 3, 0.15),
  m(70, "Corewarden",  198, 95,165, 70,  HX,BS,AH,LO,TQ,WD, "#333344","#99aabb", 3, 0.18),

  // ── TIER 4: LEGENDARIES (IDs 71-82) ──────────────────────────────────────
  m(71, "Solanox",     200,170, 95,130,  HF,BM,AC,LR,TF,WS, "#7a0000","#ff5500", 4, 0.07),
  m(72, "Aquarion",    210,150,130,118,  HA,BS,AH,LH,TQ,WD, "#002255","#00eeff", 4, 0.07),
  m(73, "Sylvanon",    220,140,148,115,  HL,BV,AL,LO,TL,WT, "#0a2200","#66ff22", 4, 0.07),
  m(74, "Tempestix",   185,175, 88,155,  HC,BO,AP,LT,TE,WB, "#443300","#ffffaa", 4, 0.06),
  m(75, "Umbralith",   195,165,108,138,  HX,BW,AK,LS,TS,WC, "#0a0011","#cc00ff", 4, 0.06),
  m(76, "Drakonix",    215,185, 95,142,  HF,BW,AC,LR,TS,WC, "#440011","#ff2244", 4, 0.05),
  m(77, "Galestrike",  188,172,100,158,  HC,BV,AP,LO,TE,WB, "#224400","#aaffaa", 4, 0.05),
  m(78, "Frostlord",   205,158,128,125,  HA,BS,AK,LH,TQ,WS, "#002244","#aaffff", 4, 0.06),
  m(79, "Primordius",  225,162,138,112,  HF,BV,AC,LO,TF,WT, "#221100","#ff8844", 4, 0.05),
  m(80, "Eternaclad",  240,145,178, 85,  HX,BS,AH,LO,TQ,WD, "#222233","#ddeeff", 4, 0.05),
  m(81, "Voidknight",  195,178,112,148,  HX,BW,AK,LS,TS,WT, "#050010","#ee66ff", 4, 0.04),
  m(82, "Celestamon",  230,180,140,145,  HX,BO,AC,LR,TE,WT, "#001122","#ffffff", 4, 0.03),
];

export function getMonTemplate(id: number): ExtendedTemplate | undefined {
  return ALL_MON_TEMPLATES.find(t => t.id === id);
}

// Zone encounter tables
export const ZONE_ENCOUNTERS: Record<string, { monIds: number[]; minLevel: number; maxLevel: number; trainerChance: number }> = {
  "Ember Dojo":    { monIds: [1,7,13,19,21,27],       minLevel: 3,  maxLevel: 9,  trainerChance: 0.25 },
  "Tidal Shrine":  { monIds: [2,9,15,17,20,28],       minLevel: 5,  maxLevel: 12, trainerChance: 0.30 },
  "Thunder Ridge": { monIds: [3,8,16,24,12,18],       minLevel: 8,  maxLevel: 15, trainerChance: 0.35 },
  "Shadow Temple": { monIds: [5,10,22,25,29,4],       minLevel: 12, maxLevel: 20, trainerChance: 0.40 },
  "Ancient Ruins": { monIds: [30,71,72,73,74,75,76],  minLevel: 18, maxLevel: 28, trainerChance: 0.50 },
};

// Per-zone trainer definitions (use samurai portrait keys as trainer avatars)
export const ZONE_TRAINERS: Record<string, Array<{name: string; portrait: string; team: {monId: number; level: number}[]}>> = {
  "Ember Dojo":    [
    { name: "Kenshi", portrait: "kagutsuchi", team: [{monId:1,level:5},{monId:13,level:4}] },
    { name: "Ryoka",  portrait: "suzaku",     team: [{monId:7,level:6}] },
  ],
  "Tidal Shrine":  [
    { name: "Mizuki", portrait: "kame",   team: [{monId:2,level:8},{monId:20,level:7}] },
    { name: "Sora",   portrait: "okami",  team: [{monId:9,level:9},{monId:17,level:8}] },
  ],
  "Thunder Ridge": [
    { name: "Raiden", portrait: "raijin",   team: [{monId:3,level:12},{monId:16,level:11}] },
    { name: "Kira",   portrait: "daitenku", team: [{monId:8,level:13},{monId:24,level:12}] },
  ],
  "Shadow Temple": [
    { name: "Kuronaga", portrait: "tengu",  team: [{monId:5,level:16},{monId:22,level:15}] },
    { name: "Yomi",     portrait: "hanzo",  team: [{monId:10,level:17},{monId:29,level:16}] },
  ],
  "Ancient Ruins": [
    { name: "Izanagi",  portrait: "oni",       team: [{monId:30,level:22},{monId:76,level:20}] },
    { name: "Amaterasu",portrait: "kagutsuchi",team: [{monId:71,level:24},{monId:75,level:22}] },
  ],
};

// Loot table helpers
const RARITY_WEIGHTS: Record<PartRarity, number> = {
  common: 0.60, uncommon: 0.27, rare: 0.11, legendary: 0.02,
};

export function rollPartRarity(tierBoost = 0): PartRarity {
  const r = Math.random();
  const leg  = RARITY_WEIGHTS.legendary + tierBoost * 0.005;
  const rare = RARITY_WEIGHTS.rare      + tierBoost * 0.02;
  const unc  = RARITY_WEIGHTS.uncommon  + tierBoost * 0.04;
  if (r < leg)              return "legendary";
  if (r < leg + rare)       return "rare";
  if (r < leg + rare + unc) return "uncommon";
  return "common";
}

import type { EncounterConfig } from "./battleTypes";

export function generateEncounter(zone: string): EncounterConfig {
  const zoneData = ZONE_ENCOUNTERS[zone];
  if (!zoneData) return { type: "wild", wildMonId: 1, wildLevel: 3 };

  const isTrainer = Math.random() < zoneData.trainerChance;
  const trainers = ZONE_TRAINERS[zone] ?? [];

  if (isTrainer && trainers.length > 0) {
    const trainer = trainers[Math.floor(Math.random() * trainers.length)];
    return {
      type: "trainer",
      trainerName: trainer.name,
      trainerPortrait: trainer.portrait,
      trainerTeam: trainer.team,
    };
  }

  const monId = zoneData.monIds[Math.floor(Math.random() * zoneData.monIds.length)];
  const level = Math.floor(
    Math.random() * (zoneData.maxLevel - zoneData.minLevel + 1)
  ) + zoneData.minLevel;
  return { type: "wild", wildMonId: monId, wildLevel: level };
}
