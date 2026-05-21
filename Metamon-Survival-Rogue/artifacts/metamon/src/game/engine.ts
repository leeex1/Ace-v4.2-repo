import { CANVAS_WIDTH, CANVAS_HEIGHT, BASE_MOVE_SPEED, BASE_ENEMY_SPEED, MAX_ENEMIES_ON_SCREEN, POOL_SIZE, ROUND_DURATION, ROUNDS_PER_LEVEL, WAVE_INTERVAL, CELL_SIZE } from "./constants";
import type { ActiveMetamon } from "./metamon";
import type { Move, AttackPattern } from "./parts";
import type { PartType } from "./constants";
import { PART_TYPES } from "./constants";
import { ALL_PARTS } from "./parts";
import { playSound } from "./audioManager";

export interface Vec2 { x: number; y: number }

export interface Projectile {
  alive: boolean;
  x: number; y: number;
  vx: number; vy: number;
  damage: number;
  range: number;
  traveledSq: number;
  aoe: number;
  color: string;
  element: string;
  radius: number;
  fromPlayer: boolean;
}

export interface EnemyEntity {
  alive: boolean;
  x: number; y: number;
  hp: number;
  maxHp: number;
  speed: number;
  atk: number;
  radius: number;
  color: string;
  accentColor: string;
  shootTimer: number;
  shootInterval: number;
  wiggleTimer: number;
  tier: number;
  isBoss: boolean;
}

export interface ParticleEntity {
  alive: boolean;
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  radius: number;
  color: string;
}

export interface FloatingText {
  alive: boolean;
  x: number; y: number;
  vy: number;
  text: string;
  color: string;
  life: number;
}

export interface BurstEntity {
  alive: boolean;
  x: number; y: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
  element: string;
  kind: "ring" | "slash" | "shockwave" | "fan";
  angle: number;
}

export interface MetamonUpgradeOption {
  label: string;
  desc: string;
  apply: (mon: ActiveMetamon) => ActiveMetamon;
  color: string;
}

export interface HeroCommand {
  name: string;
  description: string;
  energyCost: number;
  execute: (state: RunState, heroClass: HeroClass) => void;
}

export type GamePhase = "menu" | "prep" | "playing" | "roundclear" | "gameover";

export enum HeroClass {
  SAMURAI = "samurai",
  NINJA = "ninja"
}

export interface HeroData {
  class: HeroClass;
  level: number;
  experience: number;
  nextLevelExp: number;
}

export interface SaveData {
  version: string;
  timestamp: number;
  gameData: {
    phase: GamePhase;
    level: number;
    round: number;
    score: number;
    kills: number;
    xp: number;
    xpToNext: number;
    team: (ActiveMetamon | null)[];
    playerHp: number;
    playerMaxHp: number;
    autoMove: boolean;
  };
}

export interface RunState {
  phase: GamePhase;
  level: number;
  round: number;
  score: number;
  roundTimer: number;
  waveTimer: number;
  kills: number;
  roundKills: number;
  team: (ActiveMetamon | null)[];
  teamPositions: Vec2[];
  playerX: number;
  playerY: number;
  playerHp: number;
  playerMaxHp: number;
  playerInvincible: number;
  projectiles: Projectile[];
  enemies: EnemyEntity[];
  particles: ParticleEntity[];
  floatingTexts: FloatingText[];
  bursts: BurstEntity[];
  spatialGrid: Map<number, number[]>;
  moveKeys: Set<string>;
  touchJoystick: Vec2;
  globalCooldowns: number[][];
  xp: number;
  xpToNext: number;
  screenShake: Vec2;
  bossSpawned: boolean;
  upgradeChoices: MetamonUpgradeOption[];
  bgScrollY: number;
  autoMove: boolean;
  heroClass: HeroClass;
  heroLevel: number;
  heroExperience: number;
  heroNextLevelExp: number;
  heroEnergy?: number;
  heroEnergyMax?: number;
}

function mkProjectile(): Projectile {
  return { alive:false, x:0,y:0,vx:0,vy:0,damage:0,range:0,traveledSq:0,aoe:0,color:"#fff",element:"normal",radius:6,fromPlayer:true };
}
function mkEnemy(): EnemyEntity {
  return { alive:false,x:0,y:0,hp:100,maxHp:100,speed:50,atk:10,radius:14,color:"#e94560",accentColor:"#ff8",shootTimer:0,shootInterval:3,wiggleTimer:0,tier:1,isBoss:false };
}
function mkParticle(): ParticleEntity {
  return { alive:false,x:0,y:0,vx:0,vy:0,life:0,maxLife:0.5,radius:4,color:"#fff" };
}

export function initRunState(heroClass: HeroClass = HeroClass.SAMURAI): RunState {
  const projectiles: Projectile[] = Array.from({length:POOL_SIZE*2}, mkProjectile);
  const enemies: EnemyEntity[] = Array.from({length:POOL_SIZE}, mkEnemy);
  const particles: ParticleEntity[] = Array.from({length:POOL_SIZE*4}, mkParticle);
  const floatingTexts: FloatingText[] = Array.from({length:80}, () => ({alive:false,x:0,y:0,vy:-60,text:"",color:"#fff",life:0}));
  const bursts: BurstEntity[] = Array.from({length:60}, () => ({alive:false,x:0,y:0,life:0,maxLife:0.3,radius:0,color:"#fff",element:"normal",kind:"ring" as const,angle:0}));

  return {
    phase: "menu",
    level: 1,
    round: 1,
    score: 0,
    roundTimer: ROUND_DURATION,
    waveTimer: 0,
    kills: 0,
    roundKills: 0,
    team: [null,null,null,null],
    teamPositions: [
      {x:CANVAS_WIDTH/2, y:CANVAS_HEIGHT/2},
      {x:CANVAS_WIDTH/2+40, y:CANVAS_HEIGHT/2},
      {x:CANVAS_WIDTH/2, y:CANVAS_HEIGHT/2+40},
      {x:CANVAS_WIDTH/2+40, y:CANVAS_HEIGHT/2+40},
    ],
    playerX: CANVAS_WIDTH/2,
    playerY: CANVAS_HEIGHT/2,
    playerHp: 100,
    playerMaxHp: 100,
    playerInvincible: 0,
    projectiles,
    enemies,
    particles,
    floatingTexts,
    bursts,
    spatialGrid: new Map(),
    moveKeys: new Set(),
    touchJoystick: {x:0,y:0},
    globalCooldowns: Array.from({length:10}, () => Array(10).fill(0)),
    xp: 0,
    xpToNext: 100,
    screenShake: {x:0,y:0},
    bossSpawned: false,
    upgradeChoices: [],
    bgScrollY: 0,
    autoMove: false,
    heroClass,
    heroLevel: 1,
    heroExperience: 0,
    heroNextLevelExp: 100,
  };
}

function spawnProjectile(state: RunState, proj: Partial<Projectile> & {x:number,y:number,vx:number,vy:number,damage:number,range:number,fromPlayer:boolean}) {
  for (let i=0; i<state.projectiles.length; i++) {
    if (!state.projectiles[i].alive) {
      Object.assign(state.projectiles[i], {alive:true,aoe:0,color:"#fff",element:"normal",radius:6,traveledSq:0,...proj});
      
      // Play shoot sound for player projectiles
      if (proj.fromPlayer) {
        playSound('shoot', 0.3);
      }
      
      return;
    }
  }
}

function spawnParticle(state: RunState, x:number, y:number, color:string, count:number=4, spd:number=60) {
  let spawned = 0;
  for (let i=0; i<state.particles.length && spawned<count; i++) {
    if (!state.particles[i].alive) {
      const p = state.particles[i];
      const a = Math.random()*Math.PI*2;
      const s = spd*(0.5+Math.random());
      p.alive=true; p.x=x; p.y=y;
      p.vx=Math.cos(a)*s; p.vy=Math.sin(a)*s;
      p.life=0.3+Math.random()*0.35; p.maxLife=p.life;
      p.radius=2+Math.random()*5; p.color=color;
      spawned++;
    }
  }
}

function spawnBurst(state: RunState, x:number, y:number, radius:number, color:string, element:string, kind: BurstEntity["kind"], angle=0) {
  for (let i=0; i<state.bursts.length; i++) {
    if (!state.bursts[i].alive) {
      const b = state.bursts[i];
      b.alive=true; b.x=x; b.y=y;
      b.life=0.32; b.maxLife=0.32;
      b.radius=radius; b.color=color; b.element=element; b.kind=kind; b.angle=angle;
      return;
    }
  }
}

function spawnFloat(state: RunState, x:number, y:number, text:string, color:string) {
  for (let i=0; i<state.floatingTexts.length; i++) {
    if (!state.floatingTexts[i].alive) {
      const f = state.floatingTexts[i];
      f.alive=true; f.x=x+((Math.random()-0.5)*20); f.y=y; f.vy=-55; f.text=text; f.color=color; f.life=0.9;
      return;
    }
  }
}

function hashCell(cx:number, cy:number) { return cx*100000+cy; }
function cellOf(v:number) { return Math.floor(v/CELL_SIZE); }

function rebuildGrid(state: RunState) {
  state.spatialGrid.clear();
  for (let i=0; i<state.enemies.length; i++) {
    const e = state.enemies[i];
    if (!e.alive) continue;
    const cx=cellOf(e.x), cy=cellOf(e.y);
    const k=hashCell(cx,cy);
    let arr=state.spatialGrid.get(k);
    if (!arr) { arr=[]; state.spatialGrid.set(k,arr); }
    arr.push(i);
  }
}

function queryNear(state: RunState, x:number, y:number, radius:number): number[] {
  const results: number[] = [];
  const minCX=cellOf(x-radius), maxCX=cellOf(x+radius);
  const minCY=cellOf(y-radius), maxCY=cellOf(y+radius);
  for (let cx=minCX; cx<=maxCX; cx++) {
    for (let cy=minCY; cy<=maxCY; cy++) {
      const arr=state.spatialGrid.get(hashCell(cx,cy));
      if (arr) for (const i of arr) results.push(i);
    }
  }
  return results;
}

// Diamond formation: front, left, right, back — spread for 82-px portrait sprites
const TEAM_OFFSETS: Vec2[] = [
  {x:  0, y:-58},  // slot 0 — front/north (leader)
  {x:-66, y:  4},  // slot 1 — left/west
  {x: 66, y:  4},  // slot 2 — right/east
  {x:  0, y: 56},  // slot 3 — back/south
];

export function spawnEnemy(state: RunState, forceBoss=false) {
  const aliveCount = state.enemies.filter(e=>e.alive).length;
  if (aliveCount >= MAX_ENEMIES_ON_SCREEN) return;

  const lvl = state.level;
  const isBoss = forceBoss;
  const tier = isBoss ? 4 : Math.min(4, 1+Math.floor((lvl+state.round-1)/3));
  const hpMult = isBoss ? 8 : 1;
  const hp = (55 + lvl*16 + state.round*8) * tier * 0.65 * hpMult;
  const spd = BASE_ENEMY_SPEED * (1 + lvl*0.05 + state.round*0.01);
  const atk = (7 + lvl*2.5 + state.round*1.5) * tier * 0.55;

  const edge = Math.floor(Math.random()*4);
  let x=0, y=0;
  const pad = isBoss ? 60 : 25;
  if (edge===0) { x=Math.random()*CANVAS_WIDTH; y=-pad; }
  else if (edge===1) { x=CANVAS_WIDTH+pad; y=Math.random()*CANVAS_HEIGHT; }
  else if (edge===2) { x=Math.random()*CANVAS_WIDTH; y=CANVAS_HEIGHT+pad; }
  else { x=-pad; y=Math.random()*CANVAS_HEIGHT; }

  const tColors   = ["#b52a3d","#cc6600","#8800cc","#cc2200"];
  const tAccents  = ["#ff6060","#ffaa44","#cc66ff","#ff8866"];
  const bossBg    = "#1a001a";
  const bossAcc   = "#ff00ff";
  const radius = isBoss ? 28 : 11 + tier*3;

  for (let i=0; i<state.enemies.length; i++) {
    if (!state.enemies[i].alive) {
      const e = state.enemies[i];
      e.alive=true; e.x=x; e.y=y; e.hp=hp; e.maxHp=hp;
      e.speed=isBoss?spd*0.6:spd; e.atk=atk; e.radius=radius;
      e.color=isBoss?bossBg:tColors[tier-1];
      e.accentColor=isBoss?bossAcc:tAccents[tier-1];
      e.shootTimer=Math.random()*1.5;
      e.shootInterval=isBoss?1.2:2.5-lvl*0.04;
      e.wiggleTimer=Math.random()*10; e.tier=isBoss?4:tier; e.isBoss=isBoss;
      return;
    }
  }
}

function fireMove(state: RunState, metamonIndex: number, moveIndex: number, targetX: number, targetY: number) {
  const mon = state.team[metamonIndex];
  if (!mon) return;
  const move: Move = mon.parts[PART_TYPES[moveIndex]]?.move;
  if (!move) return;

  const origin = state.teamPositions[metamonIndex] ?? {x:state.playerX, y:state.playerY};
  const dmgMult = mon.atk / 100;
  const baseRadius = 6 + move.aoe * 0.1;
  const pattern: AttackPattern = move.pattern ?? "aimed";

  // Angle toward target
  const dx = targetX - origin.x;
  const dy = targetY - origin.y;
  const aimAngle = Math.atan2(dy, dx);

  function shoot(angle: number) {
    const spd = move.projectileSpeed;
    spawnProjectile(state, {
      x: origin.x, y: origin.y,
      vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
      damage: move.damage * dmgMult,
      range: move.range,
      aoe: move.aoe,
      color: move.color,
      element: move.element,
      radius: baseRadius,
      fromPlayer: true,
    });
  }

  function doMelee() {
    const r = move.aoe > 0 ? move.aoe : 80;
    const nearby = queryNear(state, origin.x, origin.y, r);
    for (const ei of nearby) {
      const e = state.enemies[ei];
      if (!e.alive) continue;
      const ex = e.x - origin.x, ey = e.y - origin.y;
      if (ex*ex + ey*ey < r*r) {
        const dmg = Math.round(move.damage * dmgMult);
        e.hp -= dmg;
        spawnFloat(state, e.x, e.y - e.radius, `-${dmg}`, move.color);
        spawnParticle(state, e.x, e.y, move.color, 6, 85);
        if (e.hp <= 0) killEnemy(state, ei, mon?.accentColor ?? "#ffffff");
      }
    }
    spawnParticle(state, origin.x, origin.y, move.color, 8, 110);
    // Melee burst sprite — kind chosen by element / weapon shape
    const wShape = mon?.parts.weapon?.shape ?? "";
    const isSlash = wShape === "sword" || wShape === "scythe" || mon?.parts.arms?.shape === "claws";
    const kind: BurstEntity["kind"] = isSlash ? "slash" : (move.element === "electric" ? "shockwave" : "ring");
    spawnBurst(state, origin.x, origin.y, r, move.color, move.element, kind, Math.random()*Math.PI*2);
  }

  switch (pattern) {
    case "aimed":
      shoot(aimAngle);
      break;
    case "horizontal":
      shoot(0);
      shoot(Math.PI);
      break;
    case "vertical":
      shoot(-Math.PI / 2);
      shoot(Math.PI / 2);
      break;
    case "spread3": {
      const s = Math.PI / 5;
      shoot(aimAngle - s);
      shoot(aimAngle);
      shoot(aimAngle + s);
      break;
    }
    case "spread5": {
      const s = Math.PI / 6;
      for (let i = -2; i <= 2; i++) shoot(aimAngle + i * s);
      break;
    }
    case "radial8":
      for (let i = 0; i < 8; i++) shoot((i / 8) * Math.PI * 2);
      break;
    case "random":
      shoot(Math.random() * Math.PI * 2);
      break;
    case "melee":
      doMelee();
      break;
  }
}

function killEnemy(state: RunState, idx: number, color:string) {
  const e = state.enemies[idx];
  e.alive = false;
  spawnParticle(state, e.x, e.y, e.isBoss?"#ff00ff":color, e.isBoss?20:10, e.isBoss?120:90);
  spawnParticle(state, e.x, e.y, "#fff", 5, 60);
  spawnFloat(state, e.x, e.y, `+${10*e.tier*(e.isBoss?5:1)}`, e.isBoss?"#ff00ff":"#ffe66d");
  state.score += 10 * e.tier * (e.isBoss?5:1);
  state.kills++;
  state.roundKills++;
  state.xp += 8 * e.tier * (e.isBoss?4:1);
  if (e.isBoss) {
    // screen shake
    state.screenShake = {x:12,y:12};
  }
}

export function stepGame(state: RunState, dt: number, _mouseX: number, _mouseY: number) {
  if (state.phase !== "playing") return;

  dt = Math.min(dt, 0.05);

  // bg scroll
  state.bgScrollY = (state.bgScrollY + dt*18) % 32;

  // screen shake decay
  state.screenShake.x *= 0.75;
  state.screenShake.y *= 0.75;
  if (Math.abs(state.screenShake.x)<0.1) state.screenShake.x=0;
  if (Math.abs(state.screenShake.y)<0.1) state.screenShake.y=0;

  // round timer
  state.roundTimer -= dt;
  if (state.roundTimer <= 0) {
    endRound(state);
    return;
  }

  // player movement from keys + touch joystick
  let mx = 0, my = 0;
  if (state.autoMove) {
    // AUTO mode: kite away from nearest enemy threat, drift toward open space
    let nearestDx = 0, nearestDy = 0, nearestDistSq = Infinity;
    for (const e of state.enemies) {
      if (!e.alive) continue;
      const dx = e.x - state.playerX, dy = e.y - state.playerY;
      const d2 = dx*dx + dy*dy;
      if (d2 < nearestDistSq) {
        nearestDistSq = d2;
        nearestDx = dx; nearestDy = dy;
      }
    }
    const KITE_RADIUS_SQ = 140*140;
    if (nearestDistSq < KITE_RADIUS_SQ && nearestDistSq > 0) {
      // Move away from nearest enemy
      const d = Math.sqrt(nearestDistSq);
      mx = -nearestDx / d;
      my = -nearestDy / d;
      // Add slight perpendicular drift to avoid corners
      mx += -nearestDy / d * 0.3;
      my +=  nearestDx / d * 0.3;
    } else {
      // No threat nearby: drift gently toward center to avoid corner-camping
      const cx = CANVAS_WIDTH/2 - state.playerX;
      const cy = CANVAS_HEIGHT/2 - state.playerY;
      const cd = Math.sqrt(cx*cx + cy*cy);
      if (cd > 80) {
        mx = cx / cd * 0.5;
        my = cy / cd * 0.5;
      }
    }
    // Wall avoidance: push away from edges
    const margin = 60;
    if (state.playerX < margin) mx += (margin - state.playerX) / margin;
    if (state.playerX > CANVAS_WIDTH - margin) mx -= (state.playerX - (CANVAS_WIDTH - margin)) / margin;
    if (state.playerY < margin) my += (margin - state.playerY) / margin;
    if (state.playerY > CANVAS_HEIGHT - margin) my -= (state.playerY - (CANVAS_HEIGHT - margin)) / margin;
  } else {
    mx = state.touchJoystick.x;
    my = state.touchJoystick.y;
    if (state.moveKeys.has("ArrowLeft")||state.moveKeys.has("a")||state.moveKeys.has("A")) mx -= 1;
    if (state.moveKeys.has("ArrowRight")||state.moveKeys.has("d")||state.moveKeys.has("D")) mx += 1;
    if (state.moveKeys.has("ArrowUp")||state.moveKeys.has("w")||state.moveKeys.has("W")) my -= 1;
    if (state.moveKeys.has("ArrowDown")||state.moveKeys.has("s")||state.moveKeys.has("S")) my += 1;
  }
  const mlen = Math.sqrt(mx*mx+my*my)||1;
  if (mx!==0||my!==0) {
    const spd = BASE_MOVE_SPEED;
    state.playerX += (mx/mlen)*spd*dt;
    state.playerY += (my/mlen)*spd*dt;
  }
  state.playerX = Math.max(22, Math.min(CANVAS_WIDTH-22, state.playerX));
  state.playerY = Math.max(22, Math.min(CANVAS_HEIGHT-22, state.playerY));

  // ATB gauge system - update active Ronin Borg
  if (state.team.length > 0 && state.team[0]) {
    const activeBorg = state.team[0];
    if (!activeBorg.atbGaugeMax) {
      activeBorg.atbGaugeMax = 100;
    }

    // Fill ATB gauge based on speed stat
    const atbFillRate = activeBorg.spd * 0.8; // Speed determines fill rate
    activeBorg.atbGauge = Math.min(activeBorg.atbGaugeMax, activeBorg.atbGauge + atbFillRate * dt);

    // Regenerate hero energy
    if (!state.heroEnergyMax) {
      state.heroEnergyMax = 100;
    }
    if (!state.heroEnergy) {
      state.heroEnergy = state.heroEnergyMax;
    }
    state.heroEnergy = Math.min(state.heroEnergyMax, state.heroEnergy + 20 * dt); // Regenerate 20 energy per second
  }

  // Team positions orbit around player
  for (let i=0; i<4; i++) {
    const off = TEAM_OFFSETS[i];
    state.teamPositions[i] = {x:state.playerX+off.x, y:state.playerY+off.y};
  }

  // Auto-fire all Metamon moves
  for (let mi=0; mi<4; mi++) {
    const mon = state.team[mi];
    if (!mon || mon.currentHp <= 0) continue;
    const pos = state.teamPositions[mi];
    for (let pi=0; pi<PART_TYPES.length; pi++) {
      if (!state.globalCooldowns[mi]) state.globalCooldowns[mi]=[];
      if (state.globalCooldowns[mi][pi] === undefined) state.globalCooldowns[mi][pi]=Math.random()*0.5;
      state.globalCooldowns[mi][pi] -= dt;
      if (state.globalCooldowns[mi][pi] <= 0) {
        const move = mon.parts[PART_TYPES[pi]]?.move;
        if (!move) continue;
        const pat = move.pattern ?? "aimed";
        // Patterns that fire in fixed/random directions don't need a target
        const targetFree = pat === "horizontal" || pat === "vertical" || pat === "radial8" || pat === "random" || pat === "melee";
        // Find nearest enemy within range for aimed patterns
        let bestDist = move.range * move.range;
        let bestX = pos.x, bestY = pos.y;
        let found = false;
        for (const e of state.enemies) {
          if (!e.alive) continue;
          const ddx=e.x-pos.x, ddy=e.y-pos.y;
          const dsq=ddx*ddx+ddy*ddy;
          if (dsq < bestDist) { bestDist=dsq; bestX=e.x; bestY=e.y; found=true; }
        }
        if (found || targetFree) {
          fireMove(state, mi, pi, bestX, bestY);
          state.globalCooldowns[mi][pi] = move.cooldown;
        }
      }
    }
  }

  // Enemy wave spawn
  state.waveTimer -= dt;
  if (state.waveTimer <= 0) {
    const waveSize = Math.min(3 + state.level*2 + state.round, 18);
    for (let i=0; i<waveSize; i++) spawnEnemy(state);
    state.waveTimer = Math.max(1.2, WAVE_INTERVAL - state.level*0.18 - state.round*0.1);
  }

  // Boss at last 8 seconds of round 3
  if (state.round >= ROUNDS_PER_LEVEL && !state.bossSpawned && state.roundTimer < 8) {
    spawnEnemy(state, true);
    spawnFloat(state, CANVAS_WIDTH/2, CANVAS_HEIGHT/2-60, "⚠ BOSS!", "#ff00ff");
    state.bossSpawned = true;
  }

  rebuildGrid(state);

  // Update enemies
  for (let i=0; i<state.enemies.length; i++) {
    const e = state.enemies[i];
    if (!e.alive) continue;
    e.wiggleTimer += dt;
    const wAngle = e.isBoss ? 0 : Math.sin(e.wiggleTimer*2.5+i)*0.35;
    const baseAngle = Math.atan2(state.playerY-e.y, state.playerX-e.x);
    const angle = baseAngle + wAngle;
    e.x += Math.cos(angle)*e.speed*dt;
    e.y += Math.sin(angle)*e.speed*dt;

    // Enemy ranged attack
    e.shootTimer -= dt;
    if (e.shootTimer <= 0 && (e.tier >= 2 || e.isBoss)) {
      const dx=state.playerX-e.x, dy=state.playerY-e.y;
      const d=Math.sqrt(dx*dx+dy*dy)||1;
      if (d < 340) {
        spawnProjectile(state, {
          x:e.x, y:e.y, vx:(dx/d)*125, vy:(dy/d)*125,
          damage:e.atk*(e.isBoss?1.5:1), range:380, aoe:0, color:e.isBoss?"#ff00ff":"#ff4444",
          element:"dark", radius:e.isBoss?8:5, fromPlayer:false,
        });
      }
      e.shootTimer = e.isBoss?0.9:e.shootInterval;
    }

    // Melee with player
    const dx=e.x-state.playerX, dy=e.y-state.playerY;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if (dist < e.radius+20 && state.playerInvincible<=0) {
      state.playerHp -= e.atk*dt*2.2;
      state.playerInvincible = 0.4;
      state.screenShake = {x:6*(Math.random()>.5?1:-1), y:6*(Math.random()>.5?1:-1)};
      spawnParticle(state, state.playerX, state.playerY, "#ff4444", 4, 55);
      if (state.playerHp<=0) { state.phase="gameover"; return; }
    }
  }

  state.playerInvincible = Math.max(0, state.playerInvincible-dt);

  // Update projectiles
  for (const p of state.projectiles) {
    if (!p.alive) continue;
    const dx = p.vx*dt, dy=p.vy*dt;
    p.x+=dx; p.y+=dy;
    p.traveledSq += dx*dx+dy*dy;
    if (p.traveledSq > p.range*p.range || p.x<-50||p.x>CANVAS_WIDTH+50||p.y<-50||p.y>CANVAS_HEIGHT+50) {
      p.alive=false; continue;
    }
    if (p.fromPlayer) {
      const nearby = queryNear(state, p.x, p.y, Math.max(p.radius, p.aoe));
      for (const ei of nearby) {
        const e = state.enemies[ei];
        if (!e.alive) continue;
        const ex=e.x-p.x, ey=e.y-p.y;
        const hitR = (p.aoe>0?p.aoe:p.radius)+e.radius;
        if (ex*ex+ey*ey < hitR*hitR) {
          const dmg = Math.round(p.damage);
          e.hp -= dmg;
          spawnFloat(state, e.x, e.y-e.radius, `-${dmg}`, p.color);
          spawnParticle(state, e.x, e.y, p.color, 3, 65);
          if (e.hp<=0) killEnemy(state, ei, p.color);
          if (p.aoe<=0) { p.alive=false; break; }
        }
      }
    } else {
      if (state.playerInvincible <= 0) {
        const dx=p.x-state.playerX, dy=p.y-state.playerY;
        if (dx*dx+dy*dy < (p.radius+20)*(p.radius+20)) {
          state.playerHp -= p.damage;
          state.playerInvincible = 0.5;
          state.screenShake = {x:4*(Math.random()>.5?1:-1), y:4*(Math.random()>.5?1:-1)};
          spawnParticle(state, state.playerX, state.playerY, "#ff4444",4,65);
          p.alive=false;
          if (state.playerHp<=0) { state.phase="gameover"; return; }
        }
      }
    }
  }

  // Update particles
  for (const p of state.particles) {
    if (!p.alive) continue;
    p.x+=p.vx*dt; p.y+=p.vy*dt;
    p.vx*=0.86; p.vy*=0.86;
    p.life-=dt;
    if (p.life<=0) p.alive=false;
  }

  // Update floating texts
  for (const f of state.floatingTexts) {
    if (!f.alive) continue;
    f.y+=f.vy*dt;
    f.life-=dt;
    if (f.life<=0) f.alive=false;
  }

  // Update bursts (just life decay; rendering interpolates)
  for (const b of state.bursts) {
    if (!b.alive) continue;
    b.life -= dt;
    if (b.life <= 0) b.alive = false;
  }

  // XP level up
  if (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.xpToNext = Math.round(state.xpToNext*1.4);
    state.playerHp = Math.min(state.playerMaxHp, state.playerHp+20);
    spawnFloat(state, state.playerX, state.playerY-36, "XP LEVEL UP +20HP", "#00ff9f");
  }
}

function endRound(state: RunState) {
  // Clear field
  for (const e of state.enemies) e.alive=false;
  for (const p of state.projectiles) p.alive=false;

  state.score += 100 * state.round * state.level;

  // Generate upgrade choices per Metamon
  state.upgradeChoices = state.team.map((mon) => {
    if (!mon) return [];
    return generateUpgrades(mon, state.round, state.level);
  });

  state.phase = "roundclear";
}

function generateUpgrades(mon: ActiveMetamon, round: number, level: number): MetamonUpgradeOption[] {
  const opts: MetamonUpgradeOption[] = [];
  const power = 1 + (level-1)*0.15 + round*0.05;

  // Stat boosts
  const hpGain = Math.round(15 * power);
  opts.push({
    label: `HP +${hpGain}`,
    desc: "Boost max health and restore it",
    color: "#00ff9f",
    apply: (m) => {
      const updated = { ...m, maxHp: m.maxHp+hpGain, currentHp: m.currentHp+hpGain };
      return updated;
    }
  });

  const atkGain = Math.round(10 * power);
  opts.push({
    label: `ATK +${atkGain}`,
    desc: "Increase attack power for all moves",
    color: "#ff6b35",
    apply: (m) => ({ ...m, atk: m.atk+atkGain }),
  });

  const spdGain = Math.round(8 * power);
  opts.push({
    label: `SPD +${spdGain}`,
    desc: "Increase move/attack speed",
    color: "#ffe66d",
    apply: (m) => ({ ...m, spd: m.spd+spdGain }),
  });

  // Random part swap
  const partTypes = ["head","body","arms","legs","tail","weapon"] as const;
  const pt = partTypes[Math.floor(Math.random()*partTypes.length)];
  const candidates = ALL_PARTS.filter(p => p.type===pt && p.id !== mon.parts[pt]?.id);
  if (candidates.length > 0) {
    const newPart = candidates[Math.floor(Math.random()*candidates.length)];
    opts.push({
      label: `Equip: ${newPart.name}`,
      desc: `${pt.toUpperCase()} slot → ${newPart.move.name} (${newPart.move.damage}dmg, cd ${newPart.move.cooldown}s)`,
      color: newPart.color,
      apply: (m) => ({
        ...m,
        parts: { ...m.parts, [pt]: newPart },
      }),
    });
  }

  // Heal option
  const healAmt = Math.round(mon.maxHp * 0.35);
  opts.push({
    label: `Heal ${healAmt}HP`,
    desc: "Restore health now",
    color: "#aaffaa",
    apply: (m) => ({ ...m, currentHp: Math.min(m.maxHp, m.currentHp+healAmt) }),
  });

  // Shuffle and return 3
  for (let i=opts.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [opts[i],opts[j]]=[opts[j],opts[i]]; }
  return opts.slice(0, 3);
}

export function applyUpgrade(state: RunState, monIndex: number, optIndex: number) {
  const mon = state.team[monIndex];
  if (!mon) return;
  const choices = state.upgradeChoices[monIndex];
  if (!choices || !choices[optIndex]) return;
  const newMon = choices[optIndex].apply(mon);
  state.team[monIndex] = newMon;
  state.upgradeChoices[monIndex] = [];
}

export function startRound(state: RunState) {
  state.phase = "playing";
  state.roundTimer = ROUND_DURATION + state.level*4 + state.round*3;
  state.waveTimer = 0.4;
  for (const p of state.particles) p.alive=false;
  for (const f of state.floatingTexts) f.alive=false;
  for (const b of state.bursts) b.alive=false;
  state.screenShake = {x:0,y:0};
  state.roundKills = 0;
  state.roundTimer = ROUND_DURATION;
  state.waveTimer = 0;
  state.bossSpawned = false;
  state.upgradeChoices = [];

  // Enable hero commands for active Ronin Borg
  if (state.team.length > 0 && state.team[0]) {
    state.team[0].canUseHeroCommand = true;
  }
}

export function advanceRound(state: RunState) {
  state.round++;
  state.phase = "prep";
  
  // Level up every 3 rounds
  if (state.round % 3 === 0) {
    state.level++;
    // Heal player on level up
    state.playerHp = state.playerMaxHp;
    playSound('levelup', 0.5);
  }
  
  // Generate upgrade choices for each Metamon
  for (let i = 0; i < state.team.length; i++) {
    const mon = state.team[i];
    if (mon && mon.currentHp > 0) {
      state.upgradeChoices[i] = generateUpgradeOptions(mon);
    }
  }
}

export function saveGame(state: RunState, slot: number = 0): boolean {
  try {
    const saveData: SaveData = {
      version: "1.0.0",
      timestamp: Date.now(),
      gameData: {
        phase: state.phase,
        level: state.level,
        round: state.round,
        score: state.score,
        kills: state.kills,
        xp: state.xp,
        xpToNext: state.xpToNext,
        team: state.team.map(mon => mon ? {
          ...mon,
          parts: { ...mon.parts }
        } : null),
        playerHp: state.playerHp,
        playerMaxHp: state.playerMaxHp,
        autoMove: state.autoMove
      }
    };
    
    localStorage.setItem(`metamon_save_${slot}`, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error("Failed to save game:", error);
    return false;
  }
}

export function loadGame(slot: number = 0): RunState | null {
  try {
    const saveDataStr = localStorage.getItem(`metamon_save_${slot}`);
    if (!saveDataStr) return null;
    
    const saveData: SaveData = JSON.parse(saveDataStr);
    
    // Create new run state and load saved data
    const newState = initRunState();
    
    // Restore saved game state
    newState.phase = saveData.gameData.phase;
    newState.level = saveData.gameData.level;
    newState.round = saveData.gameData.round;
    newState.score = saveData.gameData.score;
    newState.kills = saveData.gameData.kills;
    newState.xp = saveData.gameData.xp;
    newState.xpToNext = saveData.gameData.xpToNext;
    newState.team = saveData.gameData.team || [];
    newState.playerHp = saveData.gameData.playerHp;
    newState.playerMaxHp = saveData.gameData.playerMaxHp;
    newState.autoMove = saveData.gameData.autoMove;
    
    return newState;
  } catch (error) {
    console.error("Failed to load game:", error);
    return null;
  }
}

export function getSaveSlots(): Array<{ slot: number; exists: boolean; timestamp?: number; level?: number; score?: number }> {
  const slots: Array<{ slot: number; exists: boolean; timestamp?: number; level?: number; score?: number }> = [];
  for (let i=0; i<3; i++) {
    const saveDataStr = localStorage.getItem(`metamon_save_${i}`);
    if (!saveDataStr) {
      slots.push({ slot: i, exists: false });
    } else {
      const saveData: SaveData = JSON.parse(saveDataStr);
      slots.push({ 
        slot: i, 
        exists: true,
        timestamp: saveData.timestamp,
        level: saveData.gameData.level,
        score: saveData.gameData.score
      });
    }
  }
  return slots;
}

// ── HERO COMMAND SYSTEM ──────────────────────────────────────────────

export const HERO_COMMANDS: Record<HeroClass, HeroCommand[]> = {
  [HeroClass.SAMURAI]: [
    {
      name: "Focused Strike",
      description: "Ignore 30% of target's DEF and gain +20% accuracy",
      energyCost: 50,
      execute: (state, activeBorg) => {
        // Find the next enemy and apply focused strike
        if (state.enemies.length > 0) {
          const target = state.enemies.find(e => e.alive);
          if (target) {
            // Deal 150% damage with perfect accuracy
            target.hp *= 0.7;
            // Visual effect for focused strike
            state.screenShake = { x: 5, y: 5 };
            playSound('hit', 0.6);
          }
        }
      }
    }
  ],
  [HeroClass.NINJA]: [
    {
      name: "Shadow Shift",
      description: "Force active Ronin Borg to act next, ignoring turn order",
      energyCost: 40,
      execute: (state, activeBorg) => {
        // Fill the active Ronin Borg's ATB gauge instantly
        if (state.team.length > 0 && state.team[0]) {
          state.team[0].atbGauge = 100;
          playSound('levelup', 0.4);
        }
      }
    }
  ]
};

export function executeHeroCommand(
  state: RunState,
  commandName: string,
  heroClass: HeroClass
): boolean {
  const commands = HERO_COMMANDS[heroClass];
  const command = commands.find(cmd => cmd.name === commandName);
  
  if (!command || state.heroExperience < command.energyCost) {
    return false;
  }

  command.execute(state, heroClass);
  state.heroExperience -= command.energyCost;
  return true;
}

export function deleteSave(slot: number = 0): boolean {
  try {
    localStorage.removeItem(`metamon_save_${slot}`);
    return true;
  } catch (error) {
    console.error("Failed to delete save:", error);
    return false;
  }
}
