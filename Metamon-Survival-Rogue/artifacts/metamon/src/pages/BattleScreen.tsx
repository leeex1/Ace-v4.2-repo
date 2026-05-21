import { useState, useEffect, useRef } from "react";
import { initBattle, tickBattle, applyPlayerAction, createRPGMon } from "../game/battleEngine";
import { getFigureSrc } from "../game/spriteCache";
import {
  BattleState, BattleHero, RPGMon, RPGMove, HeroMove,
  RARITY_COLOR, RARITY_LABEL, LootDrop, EncounterConfig,
} from "../game/battleTypes";
import { getPartById } from "../game/parts";
import type { ElementType } from "../game/constants";
import { BattleTransition } from "../components/BattleTransition";
import { ScreenShake } from "../components/ScreenShake";
import { AnimatedSprite } from "../components/AnimatedSprite";
import { DamageNumber } from "../components/DamageNumber";
import { HeroClass } from "../game/engine";

const EL_COLOR: Record<string, string> = {
  fire: "#ff6b35", water: "#4ecdc4", grass: "#95e277",
  electric: "#ffe66d", dark: "#9b30c8", psychic: "#c77dff", normal: "#aaaaaa",
};

function hpColor(pct: number) {
  return pct > 0.5 ? "#38e868" : pct > 0.25 ? "#f0c040" : "#ff3030";
}

interface Props {
  hero: BattleHero;
  party: (RPGMon | null)[];
  encounter: EncounterConfig;
  onVictory: (result: { loot: LootDrop[]; caughtMonId?: number; exp: number }) => void;
  onDefeat: () => void;
  onFlee: () => void;
}

export function BattleScreen({ hero, party, encounter, onVictory, onDefeat, onFlee }: Props) {
  const [battle, setBattle] = useState<BattleState>(() => initBattle(hero, party, encounter));
  const [menuMode, setMenuMode] = useState<"main" | "fight">("main");
  const battleRef = useRef<BattleState>(battle);
  battleRef.current = battle;
  const rafRef = useRef(0);
  
  // Visual effects state
  const [showBattleStart, setShowBattleStart] = useState(true);
  const [screenShake, setScreenShake] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(15);
  
  // Sprite animation states
  const [playerAnim, setPlayerAnim] = useState<"idle" | "attack" | "hit" | "victory" | "defeat">("idle");
  const [enemyAnim, setEnemyAnim] = useState<"idle" | "attack" | "hit" | "victory" | "defeat">("idle");
  
  // Initialize idle animations after battle start transition
  useEffect(() => {
    if (!showBattleStart) {
      const timer = setTimeout(() => {
        setPlayerAnim("idle");
        setEnemyAnim("idle");
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showBattleStart]);
  
  // Damage numbers
  const [damageNumbers, setDamageNumbers] = useState<Array<{
    id: number;
    value: number;
    x: number;
    y: number;
    isCritical: boolean;
    isHeal: boolean;
  }>>([]);
  const damageIdRef = useRef(0);

  // ATB loop
  useEffect(() => {
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const next = tickBattle(battleRef.current, dt);
      if (next !== battleRef.current) {
        battleRef.current = next;
        setBattle({ ...next });
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Emit result when terminal phase reached
  useEffect(() => {
    if (battle.phase === "victory" || battle.phase === "catch_result") {
      // slight delay for user to see result
    }
    if (battle.phase === "defeat") {
      // handled by button
    }
    if (battle.phase === "fled") {
      onFlee();
    }
  }, [battle.phase]);

  function handleFight() { setMenuMode("fight"); }
  function handleBack()  { setMenuMode("main"); }

  function handleMove(moveIdx: number) {
    const actor = battle.readyActor;
    if (!actor || actor.kind === "enemy") return;
    
    // Get move for damage calculation
    const moves = actor.kind === "hero" ? battle.hero.moves : battle.party[(actor as { idx: number }).idx]?.moves || [];
    const move = moves[moveIdx];
    
    // Trigger player attack animation
    setPlayerAnim("attack");
    
    // After attack animation hits
    setTimeout(() => {
      // Enemy takes hit
      setEnemyAnim("hit");
      
      // Screen shake
      const isPowerful = (move?.power || 20) > 50;
      setShakeIntensity(isPowerful ? 20 : 12);
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 400);
      
      // Show damage number
      const dmgId = damageIdRef.current++;
      const isCrit = Math.random() > 0.85;
      const baseDamage = move?.power || 20;
      const dmgValue = Math.floor(baseDamage * (isCrit ? 1.5 : 1) * (0.8 + Math.random() * 0.4));
      
      setDamageNumbers(prev => [...prev, {
        id: dmgId,
        value: dmgValue,
        x: 120, // Enemy position
        y: 100,
        isCritical: isCrit,
        isHeal: false,
      }]);
      
      // Reset to idle after hit
      setTimeout(() => {
        setPlayerAnim("idle");
        setEnemyAnim(prev => prev === "hit" ? "idle" : prev);
      }, 600);
    }, 250);
    
    const next = applyPlayerAction(battleRef.current, {
      kind: "move", moveIdx,
      actorType: actor.kind === "hero" ? "hero" : "party",
      partyIdx: actor.kind === "party" ? (actor as { kind:"party"; idx:number }).idx : undefined,
    });
    battleRef.current = next;
    setBattle({ ...next });
    setMenuMode("main");
  }

  function handleCatch() {
    const next = applyPlayerAction(battleRef.current, { kind: "catch" });
    battleRef.current = next;
    setBattle({ ...next });
    setMenuMode("main");
  }

  function handleItem() {
    const next = applyPlayerAction(battleRef.current, { kind: "heal" });
    battleRef.current = next;
    setBattle({ ...next });
    setMenuMode("main");
  }

  function handleRun() {
    const next = applyPlayerAction(battleRef.current, { kind: "run" });
    battleRef.current = next;
    setBattle({ ...next });
    setMenuMode("main");
  }

  const { phase, hero: bHero, party: bParty, enemies, readyActor, log, floats,
          shakePlayer, shakeEnemy, catchShakes, catchSuccess, loot, expGained, caughtMonId } = battle;

  const activeEnemy = enemies.find(e => !e.isFainted) ?? enemies[0];
  const isAnimating = phase === "animating" || phase === "intro" || phase === "catch_anim";
  const isChoosing  = phase === "choosing";
  const isTerminal  = phase === "victory" || phase === "defeat" || phase === "catch_result";

  // Active actor for whose turn it is
  const actorName = (() => {
    if (!readyActor) return "";
    if (readyActor.kind === "hero") return bHero.name;
    if (readyActor.kind === "party") {
      const m = bParty[(readyActor as { idx: number }).idx];
      return m?.name ?? "";
    }
    return "";
  })();

  // Moves to display
  const currentMoves: Array<RPGMove | HeroMove> = (() => {
    if (!readyActor) return [];
    if (readyActor.kind === "hero") return bHero.moves;
    const m = bParty[(readyActor as { idx: number }).idx];
    return m?.moves ?? [];
  })();

  const currentPpLeft: number[] = (() => {
    if (!readyActor) return [];
    if (readyActor.kind === "hero") return bHero.ppLeft;
    const m = bParty[(readyActor as { idx: number }).idx];
    return m?.moves.map(mv => mv.pp) ?? [];
  })();

  return (<>
    <ScreenShake shake={screenShake} intensity={shakeIntensity} duration={500}>
    <div style={{
      position: "fixed", inset: 0,
      background: "linear-gradient(180deg, #060614 0%, #0a0a1e 50%, #07071a 100%)",
      display: "flex", flexDirection: "column",
      fontFamily: "monospace", userSelect: "none",
    }}>

      {/* ── BATTLE FIELD (55vh) ────────────────────────────────────── */}
      <div style={{ flex: "0 0 55%", position: "relative", overflow: "hidden" }}>

        {/* Subtle ground line */}
        <div style={{
          position: "absolute", bottom: "26%", left: 0, right: 0,
          height: 1, background: "rgba(255,255,255,0.04)",
        }} />

        {/* ── ENEMY ── */}
        {activeEnemy && (
          <>
            {/* Enemy sprite */}
            <div
              className={shakeEnemy > 0 ? "anim-shake" : ""}
              style={{
                position: "absolute", top: "8%", left: "6%",
                display: "flex", flexDirection: "column", alignItems: "center",
              }}
            >
              {phase === "catch_anim" && (
                <div style={{
                  position: "absolute", top: -10, left: "50%",
                  transform: "translateX(-50%)", fontSize: 28,
                  animation: "catchBounce 0.5s ease-in-out infinite",
                }}>
                  ⚫
                </div>
              )}
              {/* Animated Enemy Sprite */}
              {getFigureSrc(activeEnemy.portraitKey) ? (
                <AnimatedSprite
                  src={getFigureSrc(activeEnemy.portraitKey)}
                  alt={activeEnemy.name}
                  size={160}
                  isEnemy={true}
                  animation={activeEnemy.isFainted ? "defeat" : enemyAnim}
                  elementColor={activeEnemy.accentColor}
                  onAnimationComplete={() => {
                    if (enemyAnim === "hit") setEnemyAnim("idle");
                  }}
                />
              ) : (
                <div style={{ color: activeEnemy.accentColor, fontSize: 60, lineHeight: 1 }}>?</div>
              )}
              {activeEnemy.tier >= 4 && (
                <div style={{ fontSize: 9, color: "#f5a623", letterSpacing: 3, marginTop: 4 }}>
                  ★ LEGENDARY
                </div>
              )}
            </div>

            {/* Enemy info box */}
            <div style={{
              position: "absolute", top: "8%", right: "4%",
              background: "rgba(0,0,0,0.75)", border: "1px solid #2a2a3a",
              borderRadius: 10, padding: "10px 14px", minWidth: 180,
              backdropFilter: "blur(4px)",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, color: "#fff", fontWeight: "bold" }}>{activeEnemy.name}</span>
                <span style={{ fontSize: 10, color: "#666" }}>LV.{activeEnemy.level}</span>
              </div>
              <div style={{ fontSize: 9, color: EL_COLOR[activeEnemy.element] ?? "#aaa", letterSpacing: 3, marginBottom: 8 }}>
                {activeEnemy.element.toUpperCase()}
              </div>

              {/* HP */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#666", marginBottom: 2 }}>
                  <span>HP</span>
                  <span style={{ color: "#bbb" }}>{activeEnemy.currentHp}/{activeEnemy.maxHp}</span>
                </div>
                <div style={{ height: 6, background: "#111", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.max(0, activeEnemy.currentHp / activeEnemy.maxHp * 100)}%`,
                    background: hpColor(activeEnemy.currentHp / activeEnemy.maxHp),
                    transition: "width 0.3s ease",
                    borderRadius: 3,
                  }} />
                </div>
              </div>

              {/* ATB */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#666", marginBottom: 2 }}>
                  <span>ATB</span>
                  {activeEnemy.atb >= 100 && <span style={{ color: "#ffdd00" }}>READY!</span>}
                </div>
                <div style={{ height: 4, background: "#111", borderRadius: 2, overflow: "hidden" }}>
                  <div
                    className={activeEnemy.atb >= 100 ? "atb-ready" : ""}
                    style={{
                      height: "100%",
                      width: `${activeEnemy.atb}%`,
                      background: activeEnemy.atb >= 100 ? "#ffdd00" : "#4477ee",
                      transition: "width 0.1s linear",
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>

              {activeEnemy.status && (
                <div style={{ marginTop: 4, fontSize: 9, color: "#ff8855" }}>
                  ◉ {activeEnemy.status.toUpperCase()}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── PLAYER PARTY (bottom of field) ── */}
        <div style={{
          position: "absolute", bottom: "4%", left: "4%", right: "4%",
          display: "flex", gap: 10, alignItems: "flex-end",
        }}>
          {/* Hero */}
          <PartyCard
            name={bHero.name}
            portraitKey={bHero.portraitKey}
            bodyColor={bHero.bodyColor}
            accentColor={bHero.accentColor}
            currentHp={bHero.currentHp}
            maxHp={bHero.maxHp}
            atb={bHero.atb}
            level={bHero.level}
            isFainted={bHero.isFainted}
            shake={shakePlayer > 0}
            isReady={readyActor?.kind === "hero"}
            isHero
            animation={playerAnim}
          />
          {/* Party mons */}
          {bParty.map((mon, i) => mon ? (
            <PartyCard
              key={mon.uid}
              name={mon.name}
              portraitKey={mon.portraitKey}
              bodyColor={mon.bodyColor}
              accentColor={mon.accentColor}
              currentHp={mon.currentHp}
              maxHp={mon.maxHp}
              atb={mon.atb}
              level={mon.level}
              isFainted={mon.isFainted}
              shake={shakePlayer > 0}
              isReady={readyActor?.kind === "party" && (readyActor as { idx: number }).idx === i}
            />
          ) : null)}
        </div>

        {/* ── DAMAGE NUMBERS ── */}
        {damageNumbers.map(dmg => (
          <DamageNumber
            key={dmg.id}
            value={dmg.value}
            x={dmg.x}
            y={dmg.y}
            isCritical={dmg.isCritical}
            isHeal={dmg.isHeal}
            onComplete={() => {
              setDamageNumbers(prev => prev.filter(d => d.id !== dmg.id));
            }}
          />
        ))}

        {/* ── FLOATING DAMAGE NUMBERS ── */}
        {floats.map(f => {
          const leftPct = f.side === "enemy" ? "20%" : "65%";
          const topPct  = f.side === "enemy" ? "35%" : "55%";
          return (
            <div
              key={f.id}
              className="float-dmg"
              style={{
                position: "absolute",
                left: leftPct, top: topPct,
                color: f.color, fontSize: 22, fontWeight: "bold",
                textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                transform: "translateX(-50%)",
                zIndex: 10,
              }}
            >
              {f.text}
            </div>
          );
        })}
      </div>

      {/* ── BATTLE LOG (13vh) ─────────────────────────────────────── */}
      <div style={{
        flex: "0 0 13%", background: "rgba(0,0,0,0.8)",
        borderTop: "1px solid #1a1a2e", padding: "8px 14px",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        overflow: "hidden",
      }}>
        {log.slice(-3).map((msg, i, arr) => (
          <div key={i} style={{
            fontSize: 11, lineHeight: 1.6,
            color: i === arr.length - 1 ? "#f5a623" : "#666",
          }}>
            {i === arr.length - 1 ? "▶ " : "  "}{msg}
          </div>
        ))}
      </div>

      {/* ── ACTION MENU (32vh) ────────────────────────────────────── */}
      <div style={{
        flex: "0 0 32%", background: "rgba(6,6,20,0.98)",
        borderTop: "2px solid #1a1a2e", padding: "10px 14px",
        display: "flex", flexDirection: "column",
      }}>
        {isTerminal ? (
          /* Victory / Defeat overlay */
          <TerminalPanel
            phase={phase}
            loot={loot}
            expGained={expGained}
            caughtMonId={caughtMonId}
            onContinue={() =>
              phase === "defeat"
                ? onDefeat()
                : onVictory({ loot, caughtMonId, exp: expGained })
            }
          />
        ) : menuMode === "fight" && isChoosing ? (
          /* Move list */
          <MovePanel
            moves={currentMoves}
            ppLeft={currentPpLeft}
            actorName={actorName}
            onSelect={handleMove}
            onBack={handleBack}
          />
        ) : (
          /* Main action buttons */
          <MainMenu
            actorName={actorName}
            isChoosing={isChoosing}
            isAnimating={isAnimating}
            isWild={battle.isWild}
            onFight={handleFight}
            onCatch={handleCatch}
            onItem={handleItem}
            onRun={handleRun}
          />
        )}
      </div>
    </div>
    </ScreenShake>
    
    {/* Battle Start Transition Overlay */}
    <BattleTransition
      isActive={showBattleStart}
      type="battleStart"
      onComplete={() => setShowBattleStart(false)}
    />
  </>);
}

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function PartyCard({
  name, portraitKey, bodyColor, accentColor,
  currentHp, maxHp, atb, level, isFainted, shake, isReady, isHero,
  animation = "idle",
}: {
  name: string; portraitKey: string; bodyColor: string; accentColor: string;
  currentHp: number; maxHp: number; atb: number; level: number;
  isFainted: boolean; shake: boolean; isReady?: boolean; isHero?: boolean;
  animation?: "idle" | "attack" | "hit" | "victory" | "defeat";
}) {
  const hpPct = currentHp / maxHp;
  const src = getFigureSrc(portraitKey);
  const size = isHero ? 80 : 66;
  return (
    <div
      className={shake && !isFainted ? "anim-shake" : ""}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        opacity: isFainted ? 0.3 : 1,
        background: isReady ? `${accentColor}22` : "rgba(0,0,0,0.5)",
        border: `1px solid ${isReady ? accentColor : "#1a1a2e"}`,
        borderRadius: 8, padding: "4px 6px",
        boxShadow: isReady ? `0 0 14px ${accentColor}66` : "none",
        transition: "opacity 0.4s, box-shadow 0.2s, border 0.2s",
      }}
    >
      {src ? (
        <AnimatedSprite
          src={src}
          alt={name}
          size={size}
          isEnemy={false}
          animation={isFainted ? "defeat" : animation}
          elementColor={accentColor}
        />
      ) : (
        <div style={{ color: accentColor, fontSize: 28 }}>?</div>
      )}
      <div style={{ fontSize: 8, color: isReady ? accentColor : "#aaa", letterSpacing: 1, marginTop: 2 }}>{name}</div>
      <div style={{ fontSize: 7, color: "#555", marginBottom: 3 }}>LV.{level}</div>
      {/* HP bar */}
      <div style={{ width: size, height: 3, background: "#111", borderRadius: 2 }}>
        <div style={{ height:"100%", width:`${hpPct*100}%`, background: hpColor(hpPct), borderRadius: 2, transition:"width 0.3s" }} />
      </div>
      {/* ATB bar */}
      <div style={{ width: size, height: 2, background: "#0a0a1a", borderRadius: 1, marginTop: 2 }}>
        <div
          className={atb >= 100 ? "atb-ready" : ""}
          style={{ height:"100%", width:`${Math.min(100,atb)}%`, background: atb >= 100 ? "#ffdd00" : "#3355cc", borderRadius: 1, transition:"width 0.1s linear" }}
        />
      </div>
    </div>
  );
}

function MainMenu({
  actorName, isChoosing, isAnimating, isWild,
  onFight, onCatch, onItem, onRun,
}: {
  actorName: string; isChoosing: boolean; isAnimating: boolean; isWild: boolean;
  onFight: () => void; onCatch: () => void; onItem: () => void; onRun: () => void;
}) {
  const disabled = !isChoosing || isAnimating;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ fontSize: 10, color: "#555", letterSpacing: 3, marginBottom: 8 }}>
        {isAnimating
          ? "⌛  ..."
          : isChoosing
            ? `⚔  ${actorName.toUpperCase()}'S TURN`
            : "● ATB CHARGING..."}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1 }}>
        {[
          { label: "⚔ FIGHT",   color: "#e94560", action: onFight,  always: true },
          { label: "⚪ CATCH",  color: "#4ecdc4", action: onCatch,  show: isWild },
          { label: "🧪 ITEM",   color: "#95e277", action: onItem,   always: true },
          { label: "↩ RUN",     color: "#888",    action: onRun,    show: isWild },
        ].filter(b => b.always || b.show).map(btn => (
          <button
            key={btn.label}
            onClick={btn.action}
            disabled={disabled}
            style={{
              background: disabled ? "#0a0a1a" : `${btn.color}11`,
              border: `1px solid ${disabled ? "#1a1a2e" : btn.color + "55"}`,
              color: disabled ? "#333" : btn.color,
              borderRadius: 8, cursor: disabled ? "default" : "pointer",
              fontSize: 13, letterSpacing: 2, fontFamily: "monospace",
              fontWeight: "bold", padding: "10px 0",
              transition: "all 0.1s",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MovePanel({
  moves, ppLeft, actorName, onSelect, onBack,
}: {
  moves: Array<RPGMove | HeroMove>;
  ppLeft: number[];
  actorName: string;
  onSelect: (idx: number) => void;
  onBack: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "1px solid #333",
          color: "#888", padding: "2px 8px", borderRadius: 5,
          cursor: "pointer", fontSize: 10, fontFamily: "monospace",
        }}>← BACK</button>
        <span style={{ fontSize: 10, color: "#555", letterSpacing: 3 }}>
          {actorName.toUpperCase()}'S MOVES
        </span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        {moves.map((mv, i) => {
          const pp = ppLeft[i] ?? mv.pp;
          const noPp = pp <= 0;
          const elColor = EL_COLOR[mv.element] ?? "#aaa";
          const rarity = "rarity" in mv ? mv.rarity : "common";
          const rColor = RARITY_COLOR[rarity as keyof typeof RARITY_COLOR] ?? "#aaa";
          return (
            <button
              key={i}
              onClick={() => !noPp && onSelect(i)}
              disabled={noPp}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: noPp ? "#07071a" : `${elColor}08`,
                border: `1px solid ${noPp ? "#1a1a2e" : elColor + "44"}`,
                borderRadius: 7, padding: "6px 10px",
                cursor: noPp ? "default" : "pointer",
                transition: "all 0.1s", textAlign: "left",
                opacity: noPp ? 0.4 : 1,
              }}
              onMouseEnter={e => { if (!noPp) (e.currentTarget as HTMLElement).style.background = `${elColor}18`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = noPp ? "#07071a" : `${elColor}08`; }}
            >
              <div style={{
                width: 3, height: 28, background: elColor,
                borderRadius: 2, flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: noPp ? "#555" : "#f0f0f0", fontWeight: "bold" }}>{mv.name}</span>
                  <span style={{ fontSize: 8, color: elColor, letterSpacing: 2 }}>{mv.element.toUpperCase()}</span>
                  {rarity !== "common" && (
                    <span style={{ fontSize: 7, color: rColor, letterSpacing: 1 }}>
                      {RARITY_LABEL[rarity as keyof typeof RARITY_LABEL]}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 2 }}>
                  {mv.power > 0 && (
                    <span style={{ fontSize: 9, color: "#888" }}>PWR <span style={{ color: "#bbb" }}>{mv.power}</span></span>
                  )}
                  {mv.power === 0 && <span style={{ fontSize: 9, color: "#95e277" }}>HEAL / BUFF</span>}
                  <span style={{ fontSize: 9, color: "#888" }}>
                    PP <span style={{ color: pp > 3 ? "#bbb" : "#ff8855" }}>{pp}</span>/{mv.maxPp}
                  </span>
                  {"effect" in mv && mv.effect && mv.effect !== "heal_party" && mv.effect !== "boost_atk" && (
                    <span style={{ fontSize: 9, color: "#ff9955" }}>
                      {(mv as HeroMove).effect?.toUpperCase()} {Math.round(((mv as HeroMove).effectChance ?? 0) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TerminalPanel({
  phase, loot, expGained, caughtMonId, onContinue,
}: {
  phase: string;
  loot: LootDrop[];
  expGained: number;
  caughtMonId?: number;
  onContinue: () => void;
}) {
  const isVictory = phase === "victory" || phase === "catch_result";
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", justifyContent: "center" }}>
      <div
        className={isVictory ? "victory-txt" : ""}
        style={{
          fontSize: 24, letterSpacing: 6, fontWeight: "bold", marginBottom: 8,
          color: isVictory ? "#f5a623" : "#ff3030",
        }}
      >
        {isVictory ? (caughtMonId ? "CAPTURED!" : "VICTORY!") : "DEFEATED..."}
      </div>

      {isVictory && (
        <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>
          +{expGained} EXP
          {caughtMonId && <span style={{ color: "#4ecdc4", marginLeft: 8 }}>★ New Metamon!</span>}
        </div>
      )}

      {isVictory && loot.length > 0 && (
        <div style={{ marginBottom: 10, width: "100%", maxHeight: 80, overflowY: "auto" }}>
          <div style={{ fontSize: 8, color: "#555", letterSpacing: 3, marginBottom: 4 }}>PARTS DROPPED</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {loot.map((drop, i) => {
              const part = getPartById(drop.partId);
              const rColor = RARITY_COLOR[drop.rarity];
              return (
                <div key={i} style={{
                  fontSize: 9, padding: "2px 6px",
                  background: `${rColor}11`, border: `1px solid ${rColor}55`,
                  borderRadius: 4, color: rColor,
                }}>
                  {part?.name ?? drop.partId} [{drop.rarity}]
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={onContinue}
        style={{
          padding: "10px 40px",
          background: isVictory ? "#f5a62322" : "#ff303022",
          border: `1px solid ${isVictory ? "#f5a623" : "#ff3030"}`,
          color: isVictory ? "#f5a623" : "#ff3030",
          borderRadius: 8, cursor: "pointer", fontSize: 13,
          letterSpacing: 3, fontFamily: "monospace", fontWeight: "bold",
        }}
      >
        {isVictory ? "CONTINUE →" : "RETRY"}
      </button>
    </div>
  );
}
