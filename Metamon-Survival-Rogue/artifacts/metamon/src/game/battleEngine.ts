import {
  BattleState, BattleHero, RPGMon, RPGMove, BattleFloat, LootDrop,
  PartRarity, RARITY_POWER_MULT, RARITY_PP, RARITY_COLOR, PlayerAction,
  ReadyActor, EncounterConfig, getEffectiveness,
} from "./battleTypes";
import { ALL_MON_TEMPLATES, getMonTemplate, rollPartRarity } from "./allMonTemplates";
import { ALL_PARTS, getPartById } from "./parts";
import { TEMPLATE_PORTRAIT } from "../assets/mecha/portraitMap";
import type { ElementType, PartType } from "./constants";

let floatCounter = 0;

// ── MON CREATION ────────────────────────────────────────────────────────────

export function createRPGMon(
  templateId: number,
  level: number,
  isPlayerOwned: boolean,
  partOverrides?: Partial<Record<PartType, { partId: string; rarity: PartRarity }>>
): RPGMon {
  const template = getMonTemplate(templateId);
  if (!template) throw new Error(`Unknown templateId ${templateId}`);

  const lvlMult = 1 + (level - 1) * 0.055;

  // Derive element from head part
  const headPart = getPartById(template.defaultParts.head);
  const element: ElementType = (headPart?.element ?? "normal") as ElementType;

  // Build moves from parts
  const partTypes: PartType[] = ["head", "body", "arms", "legs", "tail", "weapon"];
  const moves: RPGMove[] = partTypes.map(pt => {
    const partId = partOverrides?.[pt]?.partId ?? template.defaultParts[pt];
    const rarity = partOverrides?.[pt]?.rarity ?? "common";
    const part = getPartById(partId);
    if (!part) return null;
    const power = Math.round(part.move.damage * RARITY_POWER_MULT[rarity]);
    return {
      name: part.move.name,
      element: part.move.element as ElementType,
      power,
      pp: RARITY_PP[rarity],
      maxPp: RARITY_PP[rarity],
      color: part.move.color,
      partType: pt,
      rarity,
    };
  }).filter(Boolean) as RPGMove[];

  // Loot table: one entry per part
  const lootPartIds = partTypes.map(pt => template.defaultParts[pt]);

  const portrait = TEMPLATE_PORTRAIT[templateId] ?? "kagutsuchi";

  return {
    templateId,
    name: template.name,
    portraitKey: portrait,
    element,
    level,
    currentHp: Math.round(template.baseHp * lvlMult),
    maxHp: Math.round(template.baseHp * lvlMult),
    atk: Math.round(template.baseAtk * lvlMult),
    def_stat: Math.round(template.baseDef * lvlMult),
    spd: Math.round(template.baseSpd * lvlMult),
    atb: Math.random() * 30, // stagger starts
    moves,
    bodyColor: template.bodyColor,
    accentColor: template.accentColor,
    status: undefined,
    statusTurns: 0,
    isFainted: false,
    isPlayerOwned,
    catchRate: template.catchRate,
    tier: template.tier,
    lootPartIds,
    uid: Math.random(),
  };
}

// ── BATTLE INIT ─────────────────────────────────────────────────────────────

export function initBattle(
  hero: BattleHero,
  party: (RPGMon | null)[],
  encounter: EncounterConfig
): BattleState {
  let enemies: RPGMon[] = [];

  if (encounter.type === "wild" && encounter.wildMonId) {
    enemies = [createRPGMon(encounter.wildMonId, encounter.wildLevel ?? 5, false)];
  } else if (encounter.type === "trainer" && encounter.trainerTeam) {
    enemies = encounter.trainerTeam.map(({ monId, level }) =>
      createRPGMon(monId, level, false)
    );
  }

  const introMsg = encounter.type === "wild"
    ? `A wild ${enemies[0]?.name ?? "?"} appeared!`
    : `${encounter.trainerName ?? "Trainer"} wants to battle!`;

  return {
    phase: "intro",
    hero: { ...hero, atb: 0 },
    party: party.map(m => m ? { ...m, atb: 0 } : m),
    enemies,
    readyActor: null,
    log: [introMsg],
    floats: [],
    time: 0,
    animTimer: 1.5,
    shakePlayer: 0,
    shakeEnemy: 0,
    isWild: encounter.type === "wild",
    trainerName: encounter.trainerName,
    trainerPortrait: encounter.trainerPortrait,
    catchShakes: 0,
    catchSuccess: false,
    loot: [],
    expGained: 0,
    caughtMonId: undefined,
  };
}

// ── DAMAGE FORMULA ───────────────────────────────────────────────────────────

function calcDamage(
  atkStat: number,
  power: number,
  defStat: number,
  level: number,
  eff: number
): number {
  const lvlFactor = (2 * level / 5 + 2) / 10;
  const base = Math.round(power * lvlFactor * (atkStat / Math.max(1, defStat)));
  const rng = 0.85 + Math.random() * 0.15;
  return Math.max(1, Math.round(base * eff * rng));
}

// ── FLOAT HELPER ─────────────────────────────────────────────────────────────

function addFloat(
  state: BattleState,
  text: string,
  color: string,
  side: "player" | "enemy",
  actorIdx = 0
): BattleFloat[] {
  return [
    ...state.floats,
    {
      text, color, side, actorIdx,
      life: 1.5, maxLife: 1.5, id: ++floatCounter,
    },
  ];
}

// ── CHECK FAINTED / VICTORY / DEFEAT ─────────────────────────────────────────

function checkFainted(state: BattleState): BattleState {
  let next = { ...state };

  // Check enemies
  next.enemies = next.enemies.map(e =>
    e.currentHp <= 0 && !e.isFainted
      ? { ...e, isFainted: true, atb: 0 }
      : e
  );

  // Check player party + hero
  next.party = next.party.map(m =>
    m && m.currentHp <= 0 && !m.isFainted
      ? { ...m, isFainted: true, atb: 0 }
      : m
  );
  if (next.hero.currentHp <= 0 && !next.hero.isFainted) {
    next.hero = { ...next.hero, isFainted: true, atb: 0 };
  }

  const allEnemiesFainted = next.enemies.every(e => e.isFainted);
  const allPlayerFainted =
    next.hero.isFainted &&
    next.party.every(m => !m || m.isFainted);

  if (allEnemiesFainted) {
    // Roll loot
    const loot: LootDrop[] = [];
    for (const e of next.enemies) {
      for (const partId of e.lootPartIds) {
        const baseDropChance = [0, 0.45, 0.32, 0.20, 0.10][e.tier] ?? 0.30;
        if (Math.random() < baseDropChance) {
          const rarity = rollPartRarity(e.tier - 1);
          loot.push({ partId, rarity, monName: e.name });
        }
      }
    }
    const exp = next.enemies.reduce(
      (acc, e) => acc + Math.round(e.maxHp * 0.3 * e.level * e.tier),
      0
    );
    next.phase = next.caughtMonId ? "catch_result" : "victory";
    next.loot = loot;
    next.expGained = exp;
    if (allEnemiesFainted) {
      next.log = [
        ...next.log.slice(-6),
        "All enemies defeated!",
      ];
    }
  } else if (allPlayerFainted) {
    next.phase = "defeat";
    next.log = [...next.log.slice(-6), "Your team has been defeated..."];
  } else {
    next.phase = "battle";
  }

  return next;
}

// ── ENEMY AI ─────────────────────────────────────────────────────────────────

function doEnemyAction(state: BattleState, enemyIdx: number): BattleState {
  let next = { ...state };
  const enemy = next.enemies[enemyIdx];

  // Pick a random move
  const move = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];

  // Pick a random living target from hero + party
  const candidates: Array<{ kind: "hero" } | { kind: "party"; idx: number }> = [];
  if (!next.hero.isFainted) candidates.push({ kind: "hero" });
  next.party.forEach((m, i) => { if (m && !m.isFainted) candidates.push({ kind: "party", idx: i }); });
  if (candidates.length === 0) return next;

  const target = candidates[Math.floor(Math.random() * candidates.length)];

  let defEl: ElementType;
  let defStat: number;
  let defName: string;
  if (target.kind === "hero") {
    defEl = next.hero.element;
    defStat = next.hero.def_stat;
    defName = next.hero.name;
  } else {
    const m = next.party[target.idx]!;
    defEl = m.element;
    defStat = m.def_stat;
    defName = m.name;
  }

  const eff = getEffectiveness(move.element, defEl);
  const dmg = calcDamage(enemy.atk, move.power, defStat, enemy.level, eff);

  // Apply damage
  if (target.kind === "hero") {
    next.hero = { ...next.hero, currentHp: Math.max(0, next.hero.currentHp - dmg) };
  } else {
    const mon = { ...next.party[target.idx]! };
    mon.currentHp = Math.max(0, mon.currentHp - dmg);
    next.party = next.party.map((m, i) => i === target.idx ? mon : m);
  }

  const effMsg = eff > 1 ? " Super effective!" : eff < 1 ? " Not very effective." : "";
  next.log = [
    ...next.log.slice(-8),
    `${enemy.name} used ${move.name}! ${defName} took ${dmg} dmg!${effMsg}`,
  ];

  const dmgColor = eff > 1 ? "#ff4422" : eff < 1 ? "#888888" : "#ffffff";
  const floatSide = target.kind === "hero" ? "player" as const : "player" as const;
  const floatIdx = target.kind === "hero" ? -1 : (target as { idx: number }).idx;
  next.floats = addFloat(next, `-${dmg}`, dmgColor, floatSide, floatIdx);

  // Reset enemy ATB
  next.enemies = next.enemies.map((e, i) =>
    i === enemyIdx ? { ...e, atb: 0 } : e
  );

  next.phase = "animating";
  next.animTimer = 0.75;
  next.shakePlayer = 0.4;

  return next;
}

// ── MAIN TICK ────────────────────────────────────────────────────────────────

export function tickBattle(state: BattleState, dt: number): BattleState {
  let next = { ...state };

  // Always decay floats
  next.floats = next.floats
    .map(f => ({ ...f, life: f.life - dt }))
    .filter(f => f.life > 0);

  // Decay shake
  if (next.shakePlayer > 0) next.shakePlayer = Math.max(0, next.shakePlayer - dt);
  if (next.shakeEnemy > 0)  next.shakeEnemy  = Math.max(0, next.shakeEnemy  - dt);

  // Intro phase
  if (next.phase === "intro") {
    next.animTimer -= dt;
    if (next.animTimer <= 0) next.phase = "battle";
    return next;
  }

  // Animating phase
  if (next.phase === "animating") {
    next.animTimer -= dt;
    if (next.animTimer <= 0) {
      next = checkFainted(next);
    }
    return next;
  }

  // Catch anim phase
  if (next.phase === "catch_anim") {
    next.animTimer -= dt;
    if (next.animTimer <= 0) {
      if (next.catchSuccess) {
        next.enemies = next.enemies.map((e, i) => i === 0 ? { ...e, isFainted: true } : e);
        next = checkFainted(next);
      } else {
        next.phase = "battle";
        next.log = [...next.log.slice(-8), `${next.enemies[0]?.name} broke free!`];
      }
    }
    return next;
  }

  // Frozen in menu phases
  if (next.phase !== "battle") return next;

  // Tick ATB
  const tickAtb = (spd: number, atb: number, fainted: boolean) =>
    fainted ? 0 : Math.min(100, atb + (spd / 3) * dt);

  next.hero = { ...next.hero, atb: tickAtb(next.hero.spd, next.hero.atb, next.hero.isFainted) };
  next.party = next.party.map(m => m ? { ...m, atb: tickAtb(m.spd, m.atb, m.isFainted) } : m);
  next.enemies = next.enemies.map(e => ({ ...e, atb: tickAtb(e.spd, e.atb, e.isFainted) }));

  next.time += dt;

  // Process first ready enemy
  for (let i = 0; i < next.enemies.length; i++) {
    if (next.enemies[i].atb >= 100 && !next.enemies[i].isFainted) {
      return doEnemyAction(next, i);
    }
  }

  // Process first ready player actor
  if (!next.hero.isFainted && next.hero.atb >= 100) {
    return { ...next, phase: "choosing", readyActor: { kind: "hero" } };
  }
  for (let i = 0; i < next.party.length; i++) {
    const m = next.party[i];
    if (m && !m.isFainted && m.atb >= 100) {
      return { ...next, phase: "choosing", readyActor: { kind: "party", idx: i } };
    }
  }

  return next;
}

// ── PLAYER ACTION ────────────────────────────────────────────────────────────

function resetActorAtb(state: BattleState, actor: ReadyActor | null): BattleState {
  if (!actor) return state;
  if (actor.kind === "hero") {
    return { ...state, hero: { ...state.hero, atb: 0 } };
  }
  if (actor.kind === "party") {
    const party = state.party.map((m, i) =>
      m && i === (actor as { idx: number }).idx ? { ...m, atb: 0 } : m
    );
    return { ...state, party };
  }
  return state;
}

export function applyPlayerAction(state: BattleState, action: PlayerAction): BattleState {
  let next = { ...state };

  if (action.kind === "run") {
    if (next.isWild) {
      next.phase = "fled";
      next.log = [...next.log.slice(-8), "Got away safely!"];
    } else {
      next.log = [...next.log.slice(-8), "Can't flee a trainer battle!"];
    }
    return next;
  }

  if (action.kind === "catch") {
    if (!next.isWild) {
      next.log = [...next.log.slice(-8), "Can't catch a trainer's Metamon!"];
      return next;
    }
    const target = next.enemies.find(e => !e.isFainted);
    if (!target) return next;

    const hpRatio = target.currentHp / target.maxHp;
    const catchChance = (1 - 0.67 * hpRatio) * target.catchRate;
    const success = Math.random() < catchChance;

    next = resetActorAtb(next, next.readyActor);
    next.readyActor = null;
    next.phase = "catch_anim";
    next.catchShakes = success ? 3 : Math.max(0, Math.floor(catchChance * 4));
    next.catchSuccess = success;
    next.animTimer = 2.2;
    next.caughtMonId = success ? target.templateId : undefined;
    next.log = [
      ...next.log.slice(-8),
      "Threw a Capture Orb!",
      success ? `Gotcha! ${target.name} was caught!` : `${target.name} broke free!`,
    ];
    return next;
  }

  if (action.kind === "heal") {
    // Simple heal: restore 30% HP to lowest-HP party member
    next = resetActorAtb(next, next.readyActor);
    next.readyActor = null;
    next.phase = "animating";
    next.animTimer = 0.6;
    const healAmt = Math.round(next.hero.maxHp * 0.30);
    next.hero = { ...next.hero, currentHp: Math.min(next.hero.maxHp, next.hero.currentHp + healAmt) };
    next.log = [...next.log.slice(-8), `Used a Potion! ${next.hero.name} recovered ${healAmt} HP!`];
    next.floats = addFloat(next, `+${healAmt}`, "#44ff88", "player", -1);
    return next;
  }

  if (action.kind === "move") {
    const { moveIdx, actorType, partyIdx } = action;
    const actor = actorType === "hero"
      ? next.hero
      : next.party[partyIdx ?? 0];
    if (!actor) return next;

    const move = actorType === "hero"
      ? next.hero.moves[moveIdx]
      : (next.party[partyIdx ?? 0]?.moves[moveIdx]);
    if (!move) return next;

    // Check PP
    if (actorType === "hero") {
      if (next.hero.ppLeft[moveIdx] <= 0) {
        next.log = [...next.log, "Out of PP for that move!"];
        return next;
      }
    } else {
      const mon = next.party[partyIdx ?? 0];
      if (!mon) return next;
      if (mon.moves[moveIdx] && mon.moves[moveIdx].pp <= 0) {
        next.log = [...next.log, "Out of PP for that move!"];
        return next;
      }
    }

    // Heal move
    const moveEffect = "effect" in move ? (move as import("./battleTypes").HeroMove).effect : undefined;
    const moveEffChance = "effectChance" in move ? (move as import("./battleTypes").HeroMove).effectChance : undefined;
    if (moveEffect === "heal_party") {
      let logs: string[] = [];
      next.hero = {
        ...next.hero,
        currentHp: Math.min(next.hero.maxHp, next.hero.currentHp + Math.round(next.hero.maxHp * 0.25)),
      };
      next.party = next.party.map(m => m
        ? { ...m, currentHp: Math.min(m.maxHp, m.currentHp + Math.round(m.maxHp * 0.25)) }
        : m
      );
      logs.push(`${actor.name} used ${move.name}! Party recovered HP!`);
      next.log = [...next.log.slice(-8), ...logs];
    } else if (moveEffect === "boost_atk" || move.power === 0) {
      // Buff move
      next.log = [...next.log.slice(-8), `${actor.name} used ${move.name}! Party ATK rose!`];
    } else {
      // Damage move — target first non-fainted enemy
      const targetIdx = next.enemies.findIndex(e => !e.isFainted);
      if (targetIdx === -1) return next;
      const target = next.enemies[targetIdx];

      const eff = getEffectiveness(move.element, target.element);
      const atkStat = actorType === "hero" ? next.hero.atk : (next.party[partyIdx ?? 0]?.atk ?? 0);
      const dmg = calcDamage(atkStat, move.power, target.def_stat, actor.level, eff);

      const effMsg = eff > 1 ? " Super effective!" : eff < 1 ? " Not very effective." : "";
      next.log = [
        ...next.log.slice(-8),
        `${actor.name} used ${move.name}! ${target.name} took ${dmg} dmg!${effMsg}`,
      ];

      next.enemies = next.enemies.map((e, i) =>
        i === targetIdx ? { ...e, currentHp: Math.max(0, e.currentHp - dmg) } : e
      );

      const dmgColor = eff > 1 ? "#ff4422" : eff < 1 ? "#888888" : "#ffdd44";
      next.floats = addFloat(next, `-${dmg}`, dmgColor, "enemy", targetIdx);
      next.shakeEnemy = 0.4;

      // Apply effect chance (in damage branch, effect is only burn/freeze/paralyze)
      if (moveEffect && moveEffChance && Math.random() < moveEffChance) {
        next.enemies = next.enemies.map((e, i) =>
          i === targetIdx ? { ...e, status: moveEffect as RPGMon["status"], statusTurns: 3 } : e
        );
        next.log = [...next.log.slice(-8), `${target.name} is ${moveEffect}ed!`];
      }
    }

    // Consume PP
    if (actorType === "hero") {
      const ppLeft = [...next.hero.ppLeft];
      ppLeft[moveIdx] = Math.max(0, ppLeft[moveIdx] - 1);
      next.hero = { ...next.hero, ppLeft };
    } else {
      const pi = partyIdx ?? 0;
      const mon = next.party[pi];
      if (mon) {
        const moves = mon.moves.map((m, i) =>
          i === moveIdx ? { ...m, pp: Math.max(0, m.pp - 1) } : m
        );
        next.party = next.party.map((m, i) => i === pi ? { ...mon, moves } : m);
      }
    }

    // Reset actor ATB
    next = resetActorAtb(next, next.readyActor);
    next.readyActor = null;
    next.phase = "animating";
    next.animTimer = 0.8;
  }

  return next;
}

// ── RANDOM ENCOUNTER ─────────────────────────────────────────────────────────

export function randomEncounter(zone: string): EncounterConfig {
  const { ZONE_ENCOUNTERS, ZONE_TRAINERS } = require("./allMonTemplates");
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
  const level = Math.floor(Math.random() * (zoneData.maxLevel - zoneData.minLevel + 1)) + zoneData.minLevel;
  return { type: "wild", wildMonId: monId, wildLevel: level };
}
