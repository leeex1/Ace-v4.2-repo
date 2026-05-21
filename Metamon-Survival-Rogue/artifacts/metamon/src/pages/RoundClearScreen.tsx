import { useState } from "react";
import { COLORS, ROUNDS_PER_LEVEL, ELEMENT_COLORS, PART_TYPES } from "../game/constants";
import type { RunState } from "../game/engine";
import type { MetamonUpgradeOption } from "../game/engine";
import type { ActiveMetamon } from "../game/metamon";

interface RoundClearScreenProps {
  state: RunState;
  onApplyUpgrade: (monIndex: number, optIndex: number) => void;
  onContinue: () => void;
}

export function RoundClearScreen({ state, onApplyUpgrade, onContinue }: RoundClearScreenProps) {
  const [chosen, setChosen] = useState<Record<number, number>>({});
  const isLastRound = state.round >= ROUNDS_PER_LEVEL;
  const activeMons = state.team.map((m, i) => ({m, i})).filter(({m}) => m !== null);

  function pick(monIdx: number, optIdx: number) {
    if (chosen[monIdx] !== undefined) return;
    onApplyUpgrade(monIdx, optIdx);
    setChosen(prev => ({...prev, [monIdx]: optIdx}));
  }

  const allChosen = activeMons.every(({i}) => chosen[i] !== undefined || !state.upgradeChoices[i]?.length);

  return (
    <div style={{
      width:"100%", height:"100vh",
      background: COLORS.bg,
      color:"#f0f0f0",
      fontFamily:"monospace",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      overflowY:"auto",
      padding:"18px 8px",
      boxSizing:"border-box",
    }}>
      {/* Header */}
      <div style={{ color: COLORS.gold, fontSize:11, letterSpacing:5, marginBottom:6 }}>
        {isLastRound ? "LEVEL COMPLETE!" : "ROUND CLEARED!"}
      </div>
      <h1 style={{
        color: isLastRound ? "#00ff9f" : COLORS.accent,
        fontSize: 28, letterSpacing:4, margin:"0 0 4px",
      }}>
        {isLastRound
          ? `LEVEL ${state.level} COMPLETE`
          : `ROUND ${state.round} OF ${ROUNDS_PER_LEVEL}`}
      </h1>
      <div style={{ display:"flex", gap:24, marginBottom:20 }}>
        <Stat label="KILLS" value={state.roundKills} color={COLORS.accent}/>
        <Stat label="TOTAL" value={state.kills} color={COLORS.gray}/>
        <Stat label="SCORE" value={state.score} color={COLORS.gold}/>
      </div>

      {/* Round pip indicator */}
      <div style={{ display:"flex", gap:8, marginBottom:20, alignItems:"center" }}>
        {Array.from({length:ROUNDS_PER_LEVEL}).map((_,i) => (
          <div key={i} style={{
            width:28, height:8,
            borderRadius:4,
            background: i < state.round ? COLORS.accent : "#222",
            border:`1px solid ${i < state.round ? COLORS.accent : "#444"}`,
            transition:"background 0.3s",
          }}/>
        ))}
        {isLastRound && (
          <span style={{ fontSize:11, color:COLORS.gold, marginLeft:8 }}>LEVEL UP!</span>
        )}
      </div>

      {/* Upgrade pickers per Metamon */}
      <div style={{ fontSize:13, color:COLORS.gray, marginBottom:12 }}>
        Choose an upgrade for each Metamon:
      </div>

      <div style={{
        display:"flex", flexWrap:"wrap", gap:14,
        justifyContent:"center",
        width:"100%", maxWidth:880,
        marginBottom:24,
      }}>
        {activeMons.map(({m: mon, i}) => {
          if (!mon) return null;
          const opts: MetamonUpgradeOption[] = state.upgradeChoices[i] ?? [];
          const pickedIdx = chosen[i];
          const picked = pickedIdx !== undefined;
          return (
            <MetamonUpgradeCard
              key={i}
              mon={mon}
              options={opts}
              picked={pickedIdx}
              onPick={(optIdx) => pick(i, optIdx)}
            />
          );
        })}
      </div>

      {/* Continue */}
      <button
        onClick={onContinue}
        disabled={!allChosen}
        style={{
          background: allChosen ? (isLastRound ? "#00ff9f" : COLORS.accent) : "#333",
          border:"none", borderRadius:10,
          padding:"13px 44px",
          cursor: allChosen ? "pointer" : "not-allowed",
          color: allChosen ? "#000" : "#555",
          fontFamily:"monospace", fontWeight:"bold",
          fontSize:16, letterSpacing:3,
          opacity: allChosen ? 1 : 0.6,
          transition:"all 0.2s",
        }}
      >
        {allChosen
          ? (isLastRound ? `ENTER LEVEL ${state.level + 1}` : `START ROUND ${state.round + 1}`)
          : "PICK UPGRADES FIRST"}
      </button>
      {!allChosen && (
        <p style={{ color: COLORS.gray, fontSize:11, marginTop:8 }}>
          Choose one upgrade per Metamon to continue
        </p>
      )}
    </div>
  );
}

function MetamonUpgradeCard({
  mon,
  options,
  picked,
  onPick,
}: {
  mon: ActiveMetamon;
  options: MetamonUpgradeOption[];
  picked?: number;
  onPick: (i: number) => void;
}) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.04)",
      border:`2px solid ${mon.accentColor}44`,
      borderRadius:10,
      padding:14,
      width:240,
      flexShrink:0,
    }}>
      {/* Metamon header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <MetamonMini mon={mon}/>
        <div>
          <div style={{ color:mon.accentColor, fontWeight:"bold", fontSize:13 }}>{mon.name}</div>
          <div style={{ fontSize:9, color:COLORS.gray }}>
            HP:{Math.ceil(mon.currentHp)}/{mon.maxHp} · ATK:{mon.atk} · SPD:{mon.spd}
          </div>
          {/* Part elements */}
          <div style={{ display:"flex", gap:3, marginTop:4 }}>
            {PART_TYPES.map(pt => {
              const ec = (ELEMENT_COLORS as Record<string,string>)[mon.parts[pt]?.element ?? "normal"] ?? "#aaa";
              return (
                <div key={pt} title={`${pt}: ${mon.parts[pt]?.name}`} style={{
                  width:8, height:8, borderRadius:"50%",
                  background:ec,
                }}/>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upgrade choices */}
      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const isDisabled = picked !== undefined && !isPicked;
          return (
            <button
              key={i}
              onClick={() => onPick(i)}
              disabled={isDisabled}
              style={{
                background: isPicked
                  ? `${opt.color}33`
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${isPicked ? opt.color : "#333"}`,
                borderRadius:7,
                padding:"8px 10px",
                cursor: isDisabled ? "default" : "pointer",
                textAlign:"left",
                fontFamily:"monospace",
                opacity: isDisabled ? 0.35 : 1,
                transition:"all 0.15s",
              }}
            >
              <div style={{
                color: opt.color,
                fontWeight:"bold", fontSize:12,
                marginBottom:2,
              }}>
                {isPicked ? "✓ " : ""}{opt.label}
              </div>
              <div style={{ color:COLORS.gray, fontSize:10, lineHeight:"1.3" }}>
                {opt.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MetamonMini({ mon }: { mon: ActiveMetamon }) {
  const bc = mon.bodyColor;
  const ac = mon.accentColor;
  const wc = mon.parts.weapon?.color ?? ac;
  const tc = mon.parts.tail?.color ?? bc;
  return (
    <svg width={40} height={48} viewBox="0 0 60 72" style={{ imageRendering:"pixelated", flexShrink:0 }}>
      <rect x="22" y="59" width="5" height="10" fill={tc}/>
      <rect x="25" y="65" width="10" height="5" fill={tc}/>
      <rect x="20" y="52" width="8" height="13" fill={bc}/>
      <rect x="32" y="52" width="8" height="13" fill={bc}/>
      <rect x="18" y="32" width="24" height="22" fill={bc}/>
      <rect x="18" y="32" width="5" height="22" fill={`${bc}88`}/>
      <rect x="8" y="34" width="10" height="10" fill={bc}/>
      <rect x="42" y="34" width="10" height="10" fill={ac}/>
      <rect x="42" y="24" width="8" height="14" fill={wc}/>
      <rect x="20" y="18" width="20" height="16" fill={ac}/>
      <rect x="20" y="15" width="20" height="4" fill={`${ac}cc`}/>
      <rect x="22" y="21" width="5" height="5" fill="#fff"/>
      <rect x="33" y="21" width="5" height="5" fill="#fff"/>
      <rect x="23" y="22" width="3" height="3" fill="#111"/>
      <rect x="34" y="22" width="3" height="3" fill="#111"/>
    </svg>
  );
}

function Stat({ label, value, color }: { label:string; value:number; color:string }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:9, color:COLORS.gray }}>{label}</div>
      <div style={{ fontSize:20, fontWeight:"bold", color }}>{value}</div>
    </div>
  );
}
