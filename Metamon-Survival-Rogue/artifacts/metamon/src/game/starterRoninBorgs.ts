import { HeroClass } from "./engine";
import { RONIN_BORG_PORTRAIT } from "../assets/roninBorg/portraitMap";
import { createRoninBorg, type RoninBorg } from "./roninBorgDatabase";

export interface StarterRoninBorg {
  speciesId: number;
  name: string;
  description: string;
  recommendedHeroClass: HeroClass;
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    spd: number;
  };
  startingParts: {
    head: string;
    body: string;
    arms: string;
    legs: string;
    tail: string;
    weapon: string;
  };
}

// Map starters to existing mecha sprites (1-82) that actually exist
export const STARTER_RONIN_BORGS: StarterRoninBorg[] = [
  {
    speciesId: 3,  // Raijin - electric type
    name: "Neon Kensei",
    description: "A sleek electric warrior with lightning-fast reflexes and precision strikes. Built for speed and accuracy.",
    recommendedHeroClass: HeroClass.SAMURAI,
    baseStats: {
      hp: 85,
      atk: 75,
      def: 45,
      spd: 80
    },
    startingParts: {
      head: "head_electric",
      body: "body_electric",
      arms: "arms_electric",
      legs: "legs_electric",
      tail: "tail_electric",
      weapon: "weapon_electric"
    }
  },
  {
    speciesId: 7,  // Suzaku - fire/balanced type
    name: "Chrome Shogun",
    description: "A heavily armored tank designed for defensive combat. Slow but incredibly durable with high defense.",
    recommendedHeroClass: HeroClass.SAMURAI,
    baseStats: {
      hp: 110,
      atk: 55,
      def: 80,
      spd: 50
    },
    startingParts: {
      head: "head_fire",
      body: "body_fire",
      arms: "arms_fire",
      legs: "legs_fire",
      tail: "tail_fire",
      weapon: "weapon_fire"
    }
  },
  {
    speciesId: 22, // Hanzo - dark/psychic type
    name: "Phantom Strider",
    description: "A stealthy cyber-ninja with enhanced speed and critical strike capabilities. Built for hit-and-run tactics.",
    recommendedHeroClass: HeroClass.NINJA,
    baseStats: {
      hp: 70,
      atk: 85,
      def: 40,
      spd: 95
    },
    startingParts: {
      head: "head_dark",
      body: "body_dark",
      arms: "arms_dark",
      legs: "legs_dark",
      tail: "tail_dark",
      weapon: "weapon_dark"
    }
  }
];

export function getStarterRoninBorgs(heroClass: HeroClass): StarterRoninBorg[] {
  // Filter starters based on hero class
  if (heroClass === HeroClass.NINJA) {
    return STARTER_RONIN_BORGS.filter(starter => 
      starter.recommendedHeroClass === HeroClass.NINJA
    );
  }
  
  // For Samurai, include Chrome Shogun as balanced option
  return STARTER_RONIN_BORGS.filter(starter => 
    starter.recommendedHeroClass === HeroClass.SAMURAI || starter.name === "Chrome Shogun"
  );
}

export function createStarterRoninBorg(
  starter: StarterRoninBorg,
  level: number = 4
): RoninBorg {
  // Create the Ronin Borg with starter parts
  const parts = {
    head: starter.startingParts.head,
    body: starter.startingParts.body,
    arms: starter.startingParts.arms,
    legs: starter.startingParts.legs,
    tail: starter.startingParts.tail,
    weapon: starter.startingParts.weapon
  };

  return createRoninBorg(
    starter.speciesId,
    level,
    parts
  );
}

export function getStarterRoninBorgPortrait(starter: StarterRoninBorg): string {
  return RONIN_BORG_PORTRAIT[starter.speciesId];
}
