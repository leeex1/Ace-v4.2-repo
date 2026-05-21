export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const TILE_SIZE = 32;

export const TEAM_SIZE = 4;
export const MAX_ENEMIES_ON_SCREEN = 80;
export const POOL_SIZE = 120;

export const BASE_MOVE_SPEED = 95;
export const BASE_ENEMY_SPEED = 44;
export const ROUND_DURATION = 25;
export const ROUNDS_PER_LEVEL = 3;
export const WAVE_INTERVAL = 4.5;

export const CELL_SIZE = 64;

export const COLORS = {
  bg: "#070712",
  ground: "#111128",
  groundAlt: "#0e0e22",
  accent: "#e94560",
  accentBlue: "#0f3460",
  gold: "#f5a623",
  green: "#00ff9f",
  red: "#ff4757",
  white: "#f0f0f0",
  gray: "#777",
  darkGray: "#2a2a3a",
  purple: "#7b2d8b",
};

export const PART_TYPES = ["head","body","arms","legs","tail","weapon"] as const;
export type PartType = typeof PART_TYPES[number];

export const ELEMENT_TYPES = ["fire","water","grass","electric","psychic","dark","normal"] as const;
export type ElementType = typeof ELEMENT_TYPES[number];

export const ELEMENT_COLORS: Record<ElementType, string> = {
  fire: "#ff6b35",
  water: "#4ecdc4",
  grass: "#95e277",
  electric: "#ffe66d",
  psychic: "#c77dff",
  dark: "#7b2d8b",
  normal: "#c5c5c5",
};
