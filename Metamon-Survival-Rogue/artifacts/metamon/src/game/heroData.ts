import type { HeroClass, HeroMove, BattleHero } from "./battleTypes";

function hm(
  name: string, element: string, power: number, pp: number, color: string,
  description: string, effect?: HeroMove["effect"], effectChance?: number
): HeroMove {
  return {
    name, element: element as HeroMove["element"],
    power, pp, maxPp: pp, color, description, effect, effectChance,
  };
}

export const HERO_CLASSES: HeroClass[] = [
  {
    id: "ronin", name: "Ronin", element: "fire", portraitKey: "kagutsuchi",
    baseHp: 140, baseAtk: 95, baseDef: 60, baseSpd: 85,
    bodyColor: "#5a0000", accentColor: "#ff4422",
    description: "A masterless flame-wielding samurai. High ATK, fast, hits hard.",
    moves: [
      hm("Flame Strike",   "fire",  45, 14, "#ff6b35", "Basic fire katana slash."),
      hm("Blazing Slash",  "fire",  72, 10, "#ff4500", "Deep cut that may burn.", "burn", 0.30),
      hm("Bushido Guard",  "normal", 0,  8, "#f5a623", "Rally party — heals 20% HP.", "heal_party"),
      hm("Inferno Blade",  "fire",  95,  6, "#cc2200", "Massive fire strike.", "burn", 0.50),
      hm("Dragon's Wrath", "fire", 125,  4, "#ff9900", "Legendary katana technique."),
    ],
  },
  {
    id: "tidebreaker", name: "Tidebreaker", element: "water", portraitKey: "kame",
    baseHp: 130, baseAtk: 85, baseDef: 80, baseSpd: 80,
    bodyColor: "#002244", accentColor: "#00bbff",
    description: "A balanced water swordmaster. Reliable with crowd-freeze control.",
    moves: [
      hm("Tidal Slash",    "water",  42, 14, "#4ecdc4", "Quick water-infused slash."),
      hm("Aqua Strike",    "water",  68, 10, "#00aacc", "Water strike, may freeze.", "freeze", 0.20),
      hm("Mist Veil",      "normal",  0,  8, "#88eeff", "Shroud party in mist, boost DEF.", "boost_atk"),
      hm("Ocean Blade",    "water",  92,  6, "#0066aa", "Ocean-force katana blow."),
      hm("Tsunami Cut",    "water", 118,  4, "#003388", "Legendary wave-blade technique."),
    ],
  },
  {
    id: "stormcaller", name: "Stormcaller", element: "electric", portraitKey: "raijin",
    baseHp: 120, baseAtk: 100, baseDef: 55, baseSpd: 105,
    bodyColor: "#333300", accentColor: "#ffee00",
    description: "A lightning-fast electric duelist. Paralyzes before enemies act.",
    moves: [
      hm("Thunder Slash",    "electric",  40, 14, "#ffe66d", "Fast lightning katana cut."),
      hm("Bolt Dash",        "electric",  65, 10, "#ffcc00", "Charges with electric speed.", "paralyze", 0.25),
      hm("Battle Cry",       "normal",     0,  8, "#ffaa00", "Boost the whole party ATK.", "boost_atk"),
      hm("Lightning Katana", "electric",  90,  6, "#ddaa00", "High-voltage blade strike."),
      hm("Thundergod's Cut", "electric", 120,  4, "#ff8800", "Legendary storm-god technique."),
    ],
  },
  {
    id: "shadowblade", name: "Shadow Blade", element: "dark", portraitKey: "tengu",
    baseHp: 115, baseAtk: 105, baseDef: 50, baseSpd: 110,
    bodyColor: "#110022", accentColor: "#cc44ff",
    description: "A shadow-arts assassin. Fastest class. Strikes from darkness.",
    moves: [
      hm("Shadow Strike",  "dark",  44, 14, "#9b30c8", "A quick dark-element strike."),
      hm("Dark Slash",     "dark",  70, 10, "#7a1fa0", "Vicious slash with armor shred.", "paralyze", 0.20),
      hm("Phase Step",     "normal", 0,  8, "#cc66ff", "Step through shadows, boost SPD.", "boost_atk"),
      hm("Void Blade",     "dark",  95,  6, "#550088", "Cuts through space itself."),
      hm("Death Cut",      "dark", 128,  4, "#330055", "Legendary one-cut finishing move."),
    ],
  },
  {
    id: "forestmonk", name: "Forest Monk", element: "grass", portraitKey: "mantisu",
    baseHp: 150, baseAtk: 80, baseDef: 90, baseSpd: 75,
    bodyColor: "#112200", accentColor: "#55cc00",
    description: "A nature-bonded guardian. Toughest class, sustains the team.",
    moves: [
      hm("Leaf Slash",      "grass",  38, 14, "#95e277", "A precise leaf-blade strike."),
      hm("Vine Cut",        "grass",  62, 10, "#6ab04c", "Razor vine whip attack.", "burn", 0.15),
      hm("Bark Shield",     "normal",  0,  8, "#8B6914", "Root team in nature, heal HP.", "heal_party"),
      hm("Forest Blade",    "grass",  88,  6, "#338800", "Ancient forest-spirit technique."),
      hm("Nature's Wrath",  "grass", 115,  4, "#225500", "Legendary force of nature."),
    ],
  },
];

export function getHeroClass(id: string): HeroClass {
  return HERO_CLASSES.find(h => h.id === id) ?? HERO_CLASSES[0];
}

export function createBattleHero(classId: string, level: number): BattleHero {
  const hc = getHeroClass(classId);
  const lvlMult = 1 + (level - 1) * 0.06;
  return {
    classId: hc.id,
    name: hc.name,
    portraitKey: hc.portraitKey,
    element: hc.element,
    level,
    currentHp: Math.round(hc.baseHp * lvlMult),
    maxHp: Math.round(hc.baseHp * lvlMult),
    atk: Math.round(hc.baseAtk * lvlMult),
    def_stat: Math.round(hc.baseDef * lvlMult),
    spd: Math.round(hc.baseSpd * lvlMult),
    atb: 0,
    moves: hc.moves,
    ppLeft: hc.moves.map(m => m.pp),
    bodyColor: hc.bodyColor,
    accentColor: hc.accentColor,
    status: undefined,
    statusTurns: 0,
    isFainted: false,
  };
}
