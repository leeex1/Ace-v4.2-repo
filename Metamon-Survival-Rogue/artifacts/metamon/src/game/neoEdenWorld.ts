import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";

export interface WorldLocation {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  connections: string[];
  npcs: WorldNPC[];
  spawns: WorldSpawn[];
  background: string;
  music?: string;
}

export interface WorldNPC {
  id: string;
  name: string;
  dialogue: string[];
  position: { x: number; y: number };
  sprite?: string;
  quest?: string;
}

export interface WorldSpawn {
  roninBorgSpecies: number[];
  level: number;
  frequency: number;
  area: { x: number; y: number; width: number; height: number };
}

export interface NeoEdenWorld {
  currentLocation: string;
  visitedLocations: Set<string>;
  unlockedAreas: Set<string>;
  playerPosition: { x: number; y: number };
  worldTime: number;
  weather: "clear" | "rain" | "neon" | "cyberstorm";
}

export const NEO_EDEN_LOCATIONS: WorldLocation[] = [
  // Starting Area
  {
    id: "hacker_lab",
    name: "Hacker's Lab",
    description: "A dimly lit underground lab filled with monitors and crypto terminals.",
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    width: 400,
    height: 300,
    background: "lab_interior",
    music: "cyberpunk_ambient",
    npcs: [
      {
        id: "hacker_mentor",
        name: "Cipher",
        dialogue: [
          "Welcome to Neo-Eden, kid.",
          "The system's been corrupt for too long. Time to shake things up.",
          "Take this crypto key and log into the Botverse.",
          "Your father's worried about you, but I see potential.",
          "Choose your first Ronin Borg wisely - it'll be your partner.",
          "The Olympians rule this city with iron fists, but we... we'll show them what real power looks like."
        ],
        position: { x: CANVAS_WIDTH / 2 - 100, y: CANVAS_HEIGHT / 2 }
      }
    ],
    connections: ["player_home", "downtown_neon", "industrial_zone"]
  },
  {
    id: "player_home",
    name: "Player's Home",
    description: "A small apartment in the residential district. Your father waits here.",
    x: CANVAS_WIDTH / 2 + 200,
    y: CANVAS_HEIGHT / 2 - 100,
    width: 300,
    height: 250,
    background: "apartment_night",
    npcs: [
      {
        id: "caring_father",
        name: "Kenji",
        dialogue: [
          "Be careful out there, my child.",
          "The world has changed since I was young.",
          "Your Ronin Borg will need regular maintenance.",
          "I've prepared some supplies for your journey."
        ],
        position: { x: 50, y: 50 }
      }
    ],
    connections: ["hacker_lab", "downtown_neon", "industrial_zone"]
  },
  {
    id: "downtown_neon",
    name: "Neon District",
    description: "A bustling cyberpunk district filled with neon lights and digital billboards. Wild Ronin Borgs roam the streets.",
    x: CANVAS_WIDTH / 2 + 150,
    y: CANVAS_HEIGHT / 2,
    width: 500,
    height: 400,
    background: "neon_city_night",
    npcs: [
      {
        id: "parts_merchant",
        name: "TechDealer",
        dialogue: [
          "Looking for custom parts?",
          "I've got rare components if you're interested.",
          "Special deal today - evolution cores!"
        ],
        position: { x: 100, y: 200 }
      }
    ],
    spawns: [
      {
        roninBorgSpecies: [201, 202, 203, 204, 205, 206, 207], // Basic Ronin Borgs
        level: 1,
        frequency: 0.3,
        area: { x: 50, y: 100, width: 400, height: 200 }
      }
    ],
    connections: ["player_home", "hacker_lab", "industrial_zone"]
  },
  {
    id: "industrial_zone",
    name: "Industrial Zone",
    description: "Abandoned factories and warehouses where rogue Ronin Borgs hide. Higher level wild encounters.",
    x: CANVAS_WIDTH / 2 - 200,
    y: CANVAS_HEIGHT / 2 + 150,
    width: 600,
    height: 300,
    background: "industrial_wasteland",
    spawns: [
      {
        roninBorgSpecies: [201, 202, 203, 204, 205, 206, 207], // Basic Ronin Borgs
        level: 3,
        frequency: 0.5,
        area: { x: 100, y: 50, width: 400, height: 200 }
      }
    ],
    connections: ["downtown_neon", "player_home"]
  }
];

export function initializeNeoEdenWorld(): NeoEdenWorld {
  return {
    currentLocation: "hacker_lab",
    visitedLocations: new Set(["hacker_lab"]),
    unlockedAreas: new Set(),
    playerPosition: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    worldTime: 0,
    weather: "clear"
  };
}

export function getLocation(locationId: string): WorldLocation | undefined {
  return NEO_EDEN_LOCATIONS.find(loc => loc.id === locationId);
}

export function canTravelTo(from: string, to: string, unlockedAreas: Set<string>): boolean {
  const fromLocation = getLocation(from);
  const toLocation = getLocation(to);
  
  if (!fromLocation || !toLocation) return false;
  
  // Check if destination is unlocked
  if (!unlockedAreas.has(to)) return false;
  
  // Check if locations are connected
  return fromLocation.connections.includes(to);
}

export function travelToLocation(world: NeoEdenWorld, locationId: string): boolean {
  const location = getLocation(locationId);
  if (!location) return false;
  
  // Update world state
  world.currentLocation = locationId;
  world.visitedLocations.add(locationId);
  world.playerPosition = { x: location.x, y: location.y };
  
  return true;
}

export function getWildSpawns(locationId: string): WorldSpawn[] {
  const location = getLocation(locationId);
  return location ? location.spawns : [];
}
