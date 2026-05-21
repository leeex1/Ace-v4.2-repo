import { ALL_PARTS, type Part } from "./parts";
import type { PartType } from "./constants";
import { PART_TYPES } from "./constants";

export interface MetamonTemplate {
  id: number;
  name: string;
  baseHp: number;
  baseAtk: number;
  baseSpd: number;
  baseDef: number;
  defaultParts: Record<PartType, string>;
  bodyColor: string;
  accentColor: string;
}

export const METAMON_TEMPLATES: MetamonTemplate[] = [
  { id:1, name:"Flambit", baseHp:80, baseAtk:70, baseSpd:75, baseDef:50,
    defaultParts:{head:"head_flame",body:"body_magma",arms:"arms_cannon",legs:"legs_rocket",tail:"tail_flame",weapon:"weapon_sword"},
    bodyColor:"#cc3300", accentColor:"#ff6b35" },
  { id:2, name:"Aquashell", baseHp:110, baseAtk:55, baseSpd:60, baseDef:80,
    defaultParts:{head:"head_aqua",body:"body_vine",arms:"arms_hydro",legs:"legs_hydro",tail:"tail_aqua",weapon:"weapon_shield"},
    bodyColor:"#1a5a8a", accentColor:"#4ecdc4" },
  { id:3, name:"Zaptor", baseHp:70, baseAtk:80, baseSpd:90, baseDef:45,
    defaultParts:{head:"head_cyber",body:"body_storm",arms:"arms_plasma",legs:"legs_thunder",tail:"tail_electric",weapon:"weapon_bow"},
    bodyColor:"#998800", accentColor:"#ffe66d" },
  { id:4, name:"Leafang", baseHp:95, baseAtk:65, baseSpd:70, baseDef:65,
    defaultParts:{head:"head_leaf",body:"body_vine",arms:"arms_leaf",legs:"legs_root",tail:"tail_leaf",weapon:"weapon_staff"},
    bodyColor:"#2d6a1a", accentColor:"#95e277" },
  { id:5, name:"Shadowpyre", baseHp:85, baseAtk:90, baseSpd:80, baseDef:40,
    defaultParts:{head:"head_crystal",body:"body_shadow",arms:"arms_claws",legs:"legs_shadow",tail:"tail_scorpion",weapon:"weapon_scythe"},
    bodyColor:"#2a1a3a", accentColor:"#7b2d8b" },
  { id:6, name:"Ironclad", baseHp:130, baseAtk:60, baseSpd:45, baseDef:100,
    defaultParts:{head:"head_crystal",body:"body_steel",arms:"arms_hydro",legs:"legs_root",tail:"tail_aqua",weapon:"weapon_shield"},
    bodyColor:"#666", accentColor:"#aaa" },
  { id:7, name:"Pyrostrike", baseHp:75, baseAtk:95, baseSpd:85, baseDef:40,
    defaultParts:{head:"head_flame",body:"body_magma",arms:"arms_claws",legs:"legs_rocket",tail:"tail_flame",weapon:"weapon_sword"},
    bodyColor:"#aa1100", accentColor:"#ff9933" },
  { id:8, name:"Stormwing", baseHp:80, baseAtk:75, baseSpd:95, baseDef:50,
    defaultParts:{head:"head_cyber",body:"body_storm",arms:"arms_plasma",legs:"legs_thunder",tail:"tail_electric",weapon:"weapon_bow"},
    bodyColor:"#5533cc", accentColor:"#99aaff" },
  { id:9, name:"Tidecrawl", baseHp:105, baseAtk:60, baseSpd:65, baseDef:85,
    defaultParts:{head:"head_aqua",body:"body_steel",arms:"arms_hydro",legs:"legs_hydro",tail:"tail_aqua",weapon:"weapon_shield"},
    bodyColor:"#0a4a6a", accentColor:"#55ddee" },
  { id:10, name:"Venomscale", baseHp:90, baseAtk:85, baseSpd:70, baseDef:55,
    defaultParts:{head:"head_crystal",body:"body_shadow",arms:"arms_claws",legs:"legs_shadow",tail:"tail_scorpion",weapon:"weapon_scythe"},
    bodyColor:"#1a2a0a", accentColor:"#55aa22" },
  { id:11, name:"Boulderback", baseHp:140, baseAtk:50, baseSpd:40, baseDef:110,
    defaultParts:{head:"head_leaf",body:"body_steel",arms:"arms_hydro",legs:"legs_root",tail:"tail_leaf",weapon:"weapon_shield"},
    bodyColor:"#554433", accentColor:"#aa8866" },
  { id:12, name:"Prismshard", baseHp:75, baseAtk:90, baseSpd:80, baseDef:55,
    defaultParts:{head:"head_crystal",body:"body_storm",arms:"arms_plasma",legs:"legs_thunder",tail:"tail_electric",weapon:"weapon_staff"},
    bodyColor:"#4422aa", accentColor:"#bb99ff" },
  { id:13, name:"Torchback", baseHp:85, baseAtk:80, baseSpd:75, baseDef:60,
    defaultParts:{head:"head_flame",body:"body_magma",arms:"arms_cannon",legs:"legs_rocket",tail:"tail_scorpion",weapon:"weapon_sword"},
    bodyColor:"#881100", accentColor:"#ffaa33" },
  { id:14, name:"Cloudpuff", baseHp:70, baseAtk:70, baseSpd:100, baseDef:45,
    defaultParts:{head:"head_cyber",body:"body_shadow",arms:"arms_plasma",legs:"legs_shadow",tail:"tail_electric",weapon:"weapon_bow"},
    bodyColor:"#bbccdd", accentColor:"#eeeeff" },
  { id:15, name:"Mudslug", baseHp:120, baseAtk:55, baseSpd:35, baseDef:95,
    defaultParts:{head:"head_leaf",body:"body_vine",arms:"arms_hydro",legs:"legs_root",tail:"tail_aqua",weapon:"weapon_shield"},
    bodyColor:"#664422", accentColor:"#997755" },
  { id:16, name:"Thunderfang", baseHp:80, baseAtk:88, baseSpd:85, baseDef:48,
    defaultParts:{head:"head_cyber",body:"body_storm",arms:"arms_claws",legs:"legs_thunder",tail:"tail_electric",weapon:"weapon_bow"},
    bodyColor:"#334400", accentColor:"#aacc00" },
  { id:17, name:"Frostclaw", baseHp:90, baseAtk:75, baseSpd:70, baseDef:70,
    defaultParts:{head:"head_aqua",body:"body_steel",arms:"arms_claws",legs:"legs_hydro",tail:"tail_aqua",weapon:"weapon_sword"},
    bodyColor:"#224466", accentColor:"#aaddff" },
  { id:18, name:"Spiritox", baseHp:75, baseAtk:82, baseSpd:88, baseDef:55,
    defaultParts:{head:"head_crystal",body:"body_shadow",arms:"arms_plasma",legs:"legs_shadow",tail:"tail_scorpion",weapon:"weapon_staff"},
    bodyColor:"#2a004a", accentColor:"#cc44ff" },
  { id:19, name:"Lavarock", baseHp:110, baseAtk:70, baseSpd:50, baseDef:85,
    defaultParts:{head:"head_flame",body:"body_steel",arms:"arms_cannon",legs:"legs_root",tail:"tail_flame",weapon:"weapon_sword"},
    bodyColor:"#882200", accentColor:"#ffaa66" },
  { id:20, name:"Seaserpent", baseHp:95, baseAtk:72, baseSpd:80, baseDef:68,
    defaultParts:{head:"head_aqua",body:"body_vine",arms:"arms_hydro",legs:"legs_hydro",tail:"tail_aqua",weapon:"weapon_staff"},
    bodyColor:"#004455", accentColor:"#00cccc" },
  { id:21, name:"Blazewing", baseHp:72, baseAtk:92, baseSpd:92, baseDef:44,
    defaultParts:{head:"head_flame",body:"body_storm",arms:"arms_cannon",legs:"legs_rocket",tail:"tail_flame",weapon:"weapon_bow"},
    bodyColor:"#993300", accentColor:"#ffcc33" },
  { id:22, name:"Darkveil", baseHp:82, baseAtk:88, baseSpd:82, baseDef:52,
    defaultParts:{head:"head_crystal",body:"body_shadow",arms:"arms_claws",legs:"legs_shadow",tail:"tail_scorpion",weapon:"weapon_scythe"},
    bodyColor:"#110022", accentColor:"#9922cc" },
  { id:23, name:"Gaiafist", baseHp:100, baseAtk:78, baseSpd:62, baseDef:78,
    defaultParts:{head:"head_leaf",body:"body_vine",arms:"arms_leaf",legs:"legs_root",tail:"tail_leaf",weapon:"weapon_sword"},
    bodyColor:"#113300", accentColor:"#66dd00" },
  { id:24, name:"Voltbreaker", baseHp:76, baseAtk:86, baseSpd:94, baseDef:46,
    defaultParts:{head:"head_cyber",body:"body_storm",arms:"arms_plasma",legs:"legs_thunder",tail:"tail_electric",weapon:"weapon_scythe"},
    bodyColor:"#555500", accentColor:"#ffff00" },
  { id:25, name:"Crystalhorn", baseHp:88, baseAtk:80, baseSpd:72, baseDef:72,
    defaultParts:{head:"head_crystal",body:"body_steel",arms:"arms_plasma",legs:"legs_hydro",tail:"tail_aqua",weapon:"weapon_staff"},
    bodyColor:"#334488", accentColor:"#aabbff" },
  { id:26, name:"Thornback", baseHp:98, baseAtk:68, baseSpd:66, baseDef:80,
    defaultParts:{head:"head_leaf",body:"body_steel",arms:"arms_leaf",legs:"legs_root",tail:"tail_scorpion",weapon:"weapon_shield"},
    bodyColor:"#223300", accentColor:"#77cc00" },
  { id:27, name:"Infernotail", baseHp:78, baseAtk:94, baseSpd:76, baseDef:50,
    defaultParts:{head:"head_flame",body:"body_magma",arms:"arms_cannon",legs:"legs_rocket",tail:"tail_scorpion",weapon:"weapon_scythe"},
    bodyColor:"#661100", accentColor:"#ff5500" },
  { id:28, name:"Wavecrest", baseHp:105, baseAtk:62, baseSpd:78, baseDef:76,
    defaultParts:{head:"head_aqua",body:"body_vine",arms:"arms_hydro",legs:"legs_hydro",tail:"tail_fin",weapon:"weapon_shield"},
    bodyColor:"#003355", accentColor:"#33aacc" },
  { id:29, name:"Shadowblaze", baseHp:80, baseAtk:91, baseSpd:85, baseDef:50,
    defaultParts:{head:"head_flame",body:"body_shadow",arms:"arms_claws",legs:"legs_shadow",tail:"tail_flame",weapon:"weapon_scythe"},
    bodyColor:"#220011", accentColor:"#cc1144" },
  { id:30, name:"Omegacore", baseHp:100, baseAtk:90, baseSpd:85, baseDef:75,
    defaultParts:{head:"head_crystal",body:"body_storm",arms:"arms_cannon",legs:"legs_rocket",tail:"tail_electric",weapon:"weapon_staff"},
    bodyColor:"#112244", accentColor:"#5588ff" },
];

export interface ActiveMetamon {
  templateId: number;
  name: string;
  parts: Record<PartType, Part>;
  maxHp: number;
  currentHp: number;
  atk: number;
  spd: number;
  def: number;
  bodyColor: string;
  accentColor: string;
  moveCooldowns: Record<number, number>;
  atbGauge: number;
  atbGaugeMax: number;
  isPlayer: boolean;
  isBoss: boolean;
  canUseHeroCommand?: boolean; // Flag for hero command availability
}

function buildStats(template: MetamonTemplate, parts: Record<PartType, Part>) {
  let hp = template.baseHp;
  let atk = template.baseAtk;
  let spd = template.baseSpd;
  let def = template.baseDef;
  for (const p of Object.values(parts)) {
    hp += p.statBonus.hp ?? 0;
    atk += p.statBonus.atk ?? 0;
    spd += p.statBonus.spd ?? 0;
    def += p.statBonus.def ?? 0;
  }
  return { hp: Math.max(10, hp), atk: Math.max(1, atk), spd: Math.max(10, spd), def: Math.max(0, def) };
}

export function createActiveMetamon(templateId: number, customParts?: Partial<Record<PartType, string>>): ActiveMetamon {
  const template = METAMON_TEMPLATES.find(t => t.id === templateId)!;
  const resolvedParts: Record<PartType, Part> = {} as Record<PartType, Part>;
  for (const pt of PART_TYPES) {
    const id = customParts?.[pt] ?? template.defaultParts[pt];
    resolvedParts[pt] = ALL_PARTS.find(p => p.id === id) ?? ALL_PARTS.find(p => p.type === pt)!;
  }
  const stats = buildStats(template, resolvedParts);
  return {
    templateId: template.id,
    name: template.name,
    parts: resolvedParts,
    maxHp: stats.hp,
    currentHp: stats.hp,
    atk: stats.atk,
    spd: stats.spd,
    def: stats.def,
    bodyColor: template.bodyColor,
    accentColor: template.accentColor,
    moveCooldowns: {},
  };
}
