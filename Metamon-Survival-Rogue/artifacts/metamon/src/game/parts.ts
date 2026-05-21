import type { PartType, ElementType } from "./constants";

// Pattern determines the attack firing shape:
// aimed    = tracks nearest enemy
// horizontal = fires left + right simultaneously
// vertical   = fires up + down simultaneously
// spread3    = 3 shots in a fan toward enemy
// spread5    = 5 shots in a wide fan
// radial8    = 8 shots in all directions (no enemy needed)
// random     = 1 shot in a random direction each trigger
// melee      = instant AoE around caster (no projectile)
export type AttackPattern = "aimed" | "horizontal" | "vertical" | "spread3" | "spread5" | "radial8" | "random" | "melee";

export interface Move {
  name: string;
  damage: number;
  cooldown: number;
  range: number;
  aoe: number;
  projectileSpeed: number;
  element: ElementType;
  color: string;
  pattern: AttackPattern;
}

export interface Part {
  id: string;
  type: PartType;
  name: string;
  element: ElementType;
  statBonus: { hp?: number; atk?: number; spd?: number; def?: number };
  move: Move;
  color: string;
  shape: string;
}

export const ALL_PARTS: Part[] = [
  // ── HEADS ──────────────────────────────────────────────────────────────────
  {
    id:"head_flame", type:"head", name:"Flame Crown", element:"fire",
    statBonus:{hp:5,atk:15},
    move:{name:"Ember Burst",    damage:18, cooldown:1.1, range:170, aoe:0,  projectileSpeed:230, element:"fire",     color:"#ff6b35", pattern:"aimed"},
    color:"#ff6b35", shape:"crown"
  },
  {
    id:"head_cyber", type:"head", name:"Cyber Core", element:"electric",
    statBonus:{atk:10,spd:10},
    move:{name:"Zap Spread",     damage:12, cooldown:0.7, range:190, aoe:0,  projectileSpeed:300, element:"electric", color:"#ffe66d", pattern:"spread3"},
    color:"#ffe66d", shape:"visor"
  },
  {
    id:"head_crystal", type:"head", name:"Crystal Helm", element:"psychic",
    statBonus:{hp:10,def:10},
    move:{name:"Psi Ring",       damage:20, cooldown:2.0, range:150, aoe:0,  projectileSpeed:170, element:"psychic",  color:"#c77dff", pattern:"radial8"},
    color:"#c77dff", shape:"gem"
  },
  {
    id:"head_aqua", type:"head", name:"Aqua Dome", element:"water",
    statBonus:{hp:20,def:5},
    move:{name:"Water Jet",      damage:16, cooldown:0.9, range:220, aoe:0,  projectileSpeed:280, element:"water",    color:"#4ecdc4", pattern:"aimed"},
    color:"#4ecdc4", shape:"dome"
  },
  {
    id:"head_leaf", type:"head", name:"Leaf Crest", element:"grass",
    statBonus:{hp:15,atk:5},
    move:{name:"Spore Fan",      damage:11, cooldown:1.4, range:145, aoe:0,  projectileSpeed:155, element:"grass",    color:"#95e277", pattern:"spread5"},
    color:"#95e277", shape:"leaf"
  },

  // ── BODIES ─────────────────────────────────────────────────────────────────
  {
    id:"body_steel", type:"body", name:"Steel Plate", element:"normal",
    statBonus:{hp:30,def:20},
    move:{name:"Shield Bash",    damage:12, cooldown:2.5, range:90,  aoe:85, projectileSpeed:0,   element:"normal",   color:"#c5c5c5", pattern:"melee"},
    color:"#aaa", shape:"plate"
  },
  {
    id:"body_magma", type:"body", name:"Magma Core", element:"fire",
    statBonus:{atk:20,hp:10},
    move:{name:"Magma Ring",     damage:22, cooldown:2.2, range:130, aoe:0,  projectileSpeed:145, element:"fire",     color:"#ff4500", pattern:"radial8"},
    color:"#cc3300", shape:"molten"
  },
  {
    id:"body_shadow", type:"body", name:"Shadow Cloak", element:"dark",
    statBonus:{spd:20,atk:10},
    move:{name:"Shadow Bolt",    damage:18, cooldown:0.9, range:200, aoe:0,  projectileSpeed:270, element:"dark",     color:"#9b30c8", pattern:"random"},
    color:"#4a1a5e", shape:"wispy"
  },
  {
    id:"body_vine", type:"body", name:"Vine Wrap", element:"grass",
    statBonus:{hp:25,def:10},
    move:{name:"Vine Lash",      damage:13, cooldown:1.5, range:140, aoe:0,  projectileSpeed:160, element:"grass",    color:"#6ab04c", pattern:"horizontal"},
    color:"#3d7a2e", shape:"vines"
  },
  {
    id:"body_storm", type:"body", name:"Storm Mantle", element:"electric",
    statBonus:{spd:15,atk:15},
    move:{name:"Storm Column",   damage:20, cooldown:1.6, range:200, aoe:0,  projectileSpeed:210, element:"electric", color:"#ffe66d", pattern:"vertical"},
    color:"#c9a500", shape:"storm"
  },

  // ── ARMS ───────────────────────────────────────────────────────────────────
  {
    id:"arms_cannon", type:"arms", name:"Blast Cannon", element:"fire",
    statBonus:{atk:25},
    move:{name:"Cannon Ball",    damage:36, cooldown:2.0, range:260, aoe:0,  projectileSpeed:360, element:"fire",     color:"#ff6b35", pattern:"aimed"},
    color:"#8B4513", shape:"cannon"
  },
  {
    id:"arms_claws", type:"arms", name:"Shadow Claws", element:"dark",
    statBonus:{atk:18,spd:8},
    move:{name:"Claw Storm",     damage:16, cooldown:0.7, range:95,  aoe:70, projectileSpeed:0,   element:"dark",     color:"#9b30c8", pattern:"melee"},
    color:"#333", shape:"claws"
  },
  {
    id:"arms_hydro", type:"arms", name:"Hydro Fists", element:"water",
    statBonus:{atk:12,hp:15},
    move:{name:"Tidal Punch",    damage:14, cooldown:0.6, range:120, aoe:0,  projectileSpeed:200, element:"water",    color:"#4ecdc4", pattern:"horizontal"},
    color:"#1a7a9a", shape:"fist"
  },
  {
    id:"arms_plasma", type:"arms", name:"Plasma Blades", element:"electric",
    statBonus:{atk:22,spd:5},
    move:{name:"Plasma Fan",     damage:20, cooldown:1.0, range:140, aoe:0,  projectileSpeed:285, element:"electric", color:"#ffe66d", pattern:"spread3"},
    color:"#6060ff", shape:"blade"
  },
  {
    id:"arms_leaf", type:"arms", name:"Leaf Whips", element:"grass",
    statBonus:{atk:14,spd:10},
    move:{name:"Leaf Storm",     damage:13, cooldown:0.8, range:130, aoe:0,  projectileSpeed:195, element:"grass",    color:"#95e277", pattern:"spread5"},
    color:"#3d7a2e", shape:"whip"
  },

  // ── LEGS ───────────────────────────────────────────────────────────────────
  {
    id:"legs_rocket", type:"legs", name:"Rocket Boosters", element:"fire",
    statBonus:{spd:30,atk:5},
    move:{name:"Afterburn",      damage:14, cooldown:1.3, range:160, aoe:0,  projectileSpeed:0,   element:"fire",     color:"#ff6b35", pattern:"melee"},
    color:"#888", shape:"rocket"
  },
  {
    id:"legs_root", type:"legs", name:"Root Stompers", element:"grass",
    statBonus:{hp:20,def:15},
    move:{name:"Root Burst",     damage:18, cooldown:1.8, range:100, aoe:90, projectileSpeed:0,   element:"grass",    color:"#95e277", pattern:"melee"},
    color:"#5a3a1a", shape:"stomp"
  },
  {
    id:"legs_hydro", type:"legs", name:"Hydro Treads", element:"water",
    statBonus:{spd:20,hp:10},
    move:{name:"Geyser Spray",   damage:11, cooldown:1.1, range:150, aoe:0,  projectileSpeed:185, element:"water",    color:"#4ecdc4", pattern:"spread3"},
    color:"#1a5a7a", shape:"fluid"
  },
  {
    id:"legs_shadow", type:"legs", name:"Shadow Steps", element:"dark",
    statBonus:{spd:25,def:5},
    move:{name:"Blink Bolt",     damage:20, cooldown:1.3, range:200, aoe:0,  projectileSpeed:480, element:"dark",     color:"#9b30c8", pattern:"aimed"},
    color:"#2a1a3a", shape:"mist"
  },
  {
    id:"legs_thunder", type:"legs", name:"Thunder Hooves", element:"electric",
    statBonus:{spd:22,atk:8},
    move:{name:"Shock Stomp",    damage:15, cooldown:0.9, range:110, aoe:75, projectileSpeed:0,   element:"electric", color:"#ffe66d", pattern:"melee"},
    color:"#7a5a00", shape:"hoof"
  },

  // ── TAILS ──────────────────────────────────────────────────────────────────
  {
    id:"tail_scorpion", type:"tail", name:"Scorpion Sting", element:"dark",
    statBonus:{atk:15,def:5},
    move:{name:"Venom Lance",    damage:26, cooldown:1.4, range:170, aoe:0,  projectileSpeed:265, element:"dark",     color:"#9b30c8", pattern:"aimed"},
    color:"#4a2060", shape:"scorpion"
  },
  {
    id:"tail_flame", type:"tail", name:"Flame Tail", element:"fire",
    statBonus:{atk:12,spd:8},
    move:{name:"Tail Spread",    damage:14, cooldown:1.0, range:140, aoe:0,  projectileSpeed:175, element:"fire",     color:"#ff6b35", pattern:"spread3"},
    color:"#ff4500", shape:"flame"
  },
  {
    id:"tail_electric", type:"tail", name:"Tesla Tail", element:"electric",
    statBonus:{atk:18,spd:10},
    move:{name:"Arc Barrage",    damage:18, cooldown:1.2, range:155, aoe:0,  projectileSpeed:225, element:"electric", color:"#ffe66d", pattern:"vertical"},
    color:"#998800", shape:"coil"
  },
  {
    id:"tail_leaf", type:"tail", name:"Seed Cannon Tail", element:"grass",
    statBonus:{hp:10,atk:14},
    move:{name:"Seed Burst",     damage:13, cooldown:1.5, range:185, aoe:0,  projectileSpeed:190, element:"grass",    color:"#95e277", pattern:"spread5"},
    color:"#2d6a1a", shape:"seed"
  },
  {
    id:"tail_aqua", type:"tail", name:"Hydro Fin", element:"water",
    statBonus:{hp:15,def:8},
    move:{name:"Hydro Walls",    damage:12, cooldown:1.1, range:155, aoe:0,  projectileSpeed:175, element:"water",    color:"#4ecdc4", pattern:"horizontal"},
    color:"#1a5a8a", shape:"fin"
  },

  // ── WEAPONS ────────────────────────────────────────────────────────────────
  {
    id:"weapon_sword", type:"weapon", name:"Flame Sword", element:"fire",
    statBonus:{atk:30,spd:-5},
    move:{name:"Flame Sweep",    damage:36, cooldown:1.4, range:110, aoe:90, projectileSpeed:0,   element:"fire",     color:"#ff6b35", pattern:"melee"},
    color:"#ff3300", shape:"sword"
  },
  {
    id:"weapon_staff", type:"weapon", name:"Psychic Staff", element:"psychic",
    statBonus:{atk:25,hp:5},
    move:{name:"Psi Barrage",    damage:28, cooldown:1.8, range:230, aoe:0,  projectileSpeed:195, element:"psychic",  color:"#c77dff", pattern:"radial8"},
    color:"#8833cc", shape:"staff"
  },
  {
    id:"weapon_bow", type:"weapon", name:"Thunder Bow", element:"electric",
    statBonus:{atk:28,spd:8},
    move:{name:"Arrow Rain",     damage:22, cooldown:0.7, range:290, aoe:0,  projectileSpeed:380, element:"electric", color:"#ffe66d", pattern:"spread3"},
    color:"#aa8800", shape:"bow"
  },
  {
    id:"weapon_shield", type:"weapon", name:"Tide Shield", element:"water",
    statBonus:{def:25,hp:20},
    move:{name:"Tidal Slam",     damage:18, cooldown:2.2, range:100, aoe:95, projectileSpeed:0,   element:"water",    color:"#4ecdc4", pattern:"melee"},
    color:"#1a4a8a", shape:"shield"
  },
  {
    id:"weapon_scythe", type:"weapon", name:"Shadow Scythe", element:"dark",
    statBonus:{atk:35,def:-10},
    move:{name:"Scythe Cross",   damage:34, cooldown:2.0, range:150, aoe:0,  projectileSpeed:240, element:"dark",     color:"#9b30c8", pattern:"horizontal"},
    color:"#1a001a", shape:"scythe"
  },
];

export function getPartsByType(type: PartType): Part[] {
  return ALL_PARTS.filter(p => p.type === type);
}

export function getPartById(id: string): Part | undefined {
  return ALL_PARTS.find(p => p.id === id);
}
