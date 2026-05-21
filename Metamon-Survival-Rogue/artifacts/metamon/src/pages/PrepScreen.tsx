import { useState } from "react";
import { METAMON_TEMPLATES } from "../game/metamon";
import { ALL_PARTS, getPartsByType } from "../game/parts";
import { PART_TYPES, ELEMENT_COLORS, COLORS } from "../game/constants";
import type { ActiveMetamon } from "../game/metamon";
import type { PartType } from "../game/constants";
import { createActiveMetamon } from "../game/metamon";
import { ROUNDS_PER_LEVEL } from "../game/constants";
import { getPortrait } from "../assets/mecha";
import { TEMPLATE_PORTRAIT } from "../assets/mecha/portraitMap";

interface PrepScreenProps {
  team: (ActiveMetamon | null)[];
  onTeamChange: (team: (ActiveMetamon | null)[]) => void;
  onStart: () => void;
  level: number;
  round: number;
  score: number;
}

export function PrepScreen({ team, onTeamChange, onStart, level, round, score }: PrepScreenProps) {
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [customParts, setCustomParts] = useState<Record<number, Partial<Record<PartType, string>>>>({});

  function addToTeam(slot: number, templateId: number) {
    const parts = customParts[templateId] ?? {};
    const mon = createActiveMetamon(templateId, parts);
    const newTeam = [...team];
    newTeam[slot] = mon;
    onTeamChange(newTeam);
    setEditingSlot(null);
  }

  function removeFromTeam(slot: number) {
    const newTeam = [...team];
    newTeam[slot] = null;
    onTeamChange(newTeam);
  }

  function swapPart(templateId: number, partType: PartType, partId: string) {
    setCustomParts(prev => ({
      ...prev,
      [templateId]: { ...(prev[templateId] ?? {}), [partType]: partId }
    }));
  }

  const activeCount = team.filter(Boolean).length;
  const isFirstLevel = level === 1 && round === 1;

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
      padding:"16px 8px",
      boxSizing:"border-box",
    }}>
      <div style={{ color:COLORS.accent, fontSize:11, letterSpacing:5, marginBottom:4 }}>
        {isFirstLevel ? "BUILD YOUR SQUAD" : `LEVEL ${level} · ROUND ${round}/${ROUNDS_PER_LEVEL}`}
      </div>
      <h1 style={{ color:"#fff", fontSize:24, margin:"0 0 4px", letterSpacing:3 }}>
        METAMON ROGUE
      </h1>
      {!isFirstLevel && (
        <div style={{ color:COLORS.gold, fontSize:12, marginBottom:4 }}>SCORE: {score}</div>
      )}
      <p style={{ color:COLORS.gray, fontSize:11, marginBottom:14, textAlign:"center", maxWidth:480 }}>
        Choose up to 4 Metamon. Swap parts to customize moves. Mix elements for best results!
      </p>

      {/* Team slots */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", justifyContent:"center" }}>
        {[0,1,2,3].map(slot => {
          const mon = team[slot];
          return (
            <div key={slot} style={{
              width:152,
              border:`2px solid ${mon ? mon.accentColor+"88" : "#2a2a3a"}`,
              borderRadius:10,
              padding:10,
              background:"rgba(255,255,255,0.03)",
              display:"flex",
              flexDirection:"column",
              gap:4,
            }}>
              <div style={{ fontSize:10, color:COLORS.gray }}>SLOT {slot+1}</div>
              {mon ? (
                <>
                  <MetamonPreviewSvg mon={mon} />
                  <div style={{ color:mon.accentColor, fontWeight:"bold", fontSize:13 }}>{mon.name}</div>
                  <div style={{ fontSize:9, color:COLORS.gray, lineHeight:"1.5" }}>
                    HP:{mon.maxHp} ATK:{mon.atk}<br/>SPD:{mon.spd} DEF:{mon.def}
                  </div>
                  <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                    {PART_TYPES.map(pt => {
                      const ec = (ELEMENT_COLORS as Record<string,string>)[mon.parts[pt]?.element ?? "normal"] ?? "#aaa";
                      return (
                        <span key={pt} title={`${pt}: ${mon.parts[pt]?.name} → ${mon.parts[pt]?.move.name}`} style={{
                          fontSize:7, padding:"1px 4px",
                          background:ec, borderRadius:3,
                          color:"#000", fontWeight:"bold",
                        }}>
                          {pt.slice(0,3).toUpperCase()}
                        </span>
                      );
                    })}
                  </div>
                  <button onClick={() => removeFromTeam(slot)} style={btnStyle(COLORS.accent, "transparent", "#fff")}>
                    REMOVE
                  </button>
                </>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 0", gap:8 }}>
                  <div style={{ fontSize:28, color:"#333" }}>+</div>
                  <button onClick={() => setEditingSlot(slot)} style={btnStyle(COLORS.accent, "transparent", "#fff")}>
                    ADD
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onStart}
        disabled={activeCount === 0}
        style={{
          background: activeCount>0 ? COLORS.accent : "#222",
          border:"none", borderRadius:10,
          padding:"13px 40px",
          cursor: activeCount>0 ? "pointer" : "not-allowed",
          color: activeCount>0 ? "#fff" : "#555",
          fontFamily:"monospace", fontWeight:"bold",
          fontSize:16, letterSpacing:3,
          opacity: activeCount>0 ? 1 : 0.5,
          marginBottom:8,
          boxShadow: activeCount>0 ? `0 0 20px ${COLORS.accent}55` : "none",
        }}
      >
        {activeCount > 0 ? `START LEVEL ${level}` : "ADD AT LEAST 1"}
      </button>
      <p style={{ color:COLORS.gray, fontSize:10, textAlign:"center" }}>
        WASD / Arrow keys or joystick to move · Team auto-attacks enemies
      </p>

      {/* Modal picker */}
      {editingSlot !== null && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.88)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:100, overflowY:"auto",
        }} onClick={() => setEditingSlot(null)}>
          <div style={{
            background:"#0c0c1e", border:"2px solid #333",
            borderRadius:14, padding:18,
            maxWidth:820, width:"96%",
            maxHeight:"90vh", overflowY:"auto",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <h2 style={{ color:COLORS.accent, margin:0, fontSize:16 }}>Choose Metamon — Slot {editingSlot+1}</h2>
              <button onClick={() => setEditingSlot(null)} style={btnStyle("#333","#111","#aaa")}>✕ CLOSE</button>
            </div>

            {/* Template grid */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
              {METAMON_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setSelectedTemplate(t.id)} style={{
                  background: selectedTemplate===t.id ? t.bodyColor+"cc" : "rgba(255,255,255,0.04)",
                  border:`2px solid ${selectedTemplate===t.id ? t.accentColor : "#2a2a3a"}`,
                  borderRadius:7, padding:"5px 10px",
                  cursor:"pointer",
                  color: selectedTemplate===t.id ? "#fff" : COLORS.gray,
                  fontSize:10, fontFamily:"monospace",
                  transition:"all 0.1s",
                }}>
                  {t.name}
                </button>
              ))}
            </div>

            {/* Selected template detail */}
            {(() => {
              const t = METAMON_TEMPLATES.find(t=>t.id===selectedTemplate)!;
              const curParts = customParts[t.id] ?? {};
              const preview = createActiveMetamon(t.id, curParts);
              return (
                <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
                  {/* Preview panel */}
                  <div style={{ flex:"0 0 170px" }}>
                    <div style={{
                      padding:14, background:"rgba(255,255,255,0.04)",
                      borderRadius:10, textAlign:"center",
                      border:`1px solid ${t.accentColor}33`,
                    }}>
                      <MetamonPreviewSvg mon={preview} size={1.6}/>
                      <div style={{ color:t.accentColor, fontWeight:"bold", fontSize:15, marginTop:6 }}>{t.name}</div>
                      <div style={{ fontSize:10, color:COLORS.gray, marginTop:4, lineHeight:"1.6" }}>
                        HP:{preview.maxHp} ATK:{preview.atk}<br/>SPD:{preview.spd} DEF:{preview.def}
                      </div>
                    </div>
                    <button onClick={() => addToTeam(editingSlot!, t.id)} style={{
                      ...btnStyle("#00ff9f","transparent","#000"),
                      width:"100%", marginTop:10, fontSize:13, padding:"10px 0"
                    }}>
                      + ADD TO TEAM
                    </button>
                  </div>

                  {/* Part picker */}
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ fontSize:11, color:COLORS.gold, marginBottom:8 }}>
                      CUSTOMIZE PARTS — hover for move details
                    </div>
                    {PART_TYPES.map(pt => {
                      const availParts = getPartsByType(pt);
                      const currentPartId = curParts[pt] ?? t.defaultParts[pt];
                      const currentPart = ALL_PARTS.find(p=>p.id===currentPartId);
                      return (
                        <div key={pt} style={{ marginBottom:10 }}>
                          <div style={{
                            display:"flex", alignItems:"center", gap:6, marginBottom:4
                          }}>
                            <span style={{ fontSize:9, color:COLORS.gold, textTransform:"uppercase", letterSpacing:2 }}>
                              {pt}
                            </span>
                            {currentPart && (
                              <span style={{ fontSize:9, color:COLORS.gray }}>
                                → {currentPart.move.name} ({currentPart.move.damage}dmg · {currentPart.move.cooldown}s cd)
                              </span>
                            )}
                          </div>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                            {availParts.map(p => {
                              const isActive = currentPartId===p.id;
                              const ec = (ELEMENT_COLORS as Record<string,string>)[p.element] ?? "#aaa";
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => swapPart(t.id, pt, p.id)}
                                  title={`${p.name} | ${p.move.name} · DMG:${p.move.damage} · CD:${p.move.cooldown}s · Range:${p.move.range}`}
                                  style={{
                                    background: isActive ? p.color+"cc" : "rgba(255,255,255,0.04)",
                                    border:`1px solid ${isActive ? p.color : "#2a2a3a"}`,
                                    borderRadius:5, padding:"3px 8px",
                                    cursor:"pointer",
                                    color: isActive ? "#000" : COLORS.gray,
                                    fontSize:10, fontFamily:"monospace",
                                    transition:"all 0.1s",
                                    display:"flex", alignItems:"center", gap:4,
                                  }}
                                >
                                  <span style={{
                                    width:6, height:6, borderRadius:"50%",
                                    background:ec, display:"inline-block", flexShrink:0
                                  }}/>
                                  {p.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {/* Move summary */}
                    <div style={{
                      marginTop:8, padding:"8px 10px",
                      background:"rgba(255,255,255,0.03)",
                      borderRadius:6, fontSize:10,
                    }}>
                      <div style={{ color:COLORS.gold, marginBottom:4 }}>MOVE LOADOUT:</div>
                      {PART_TYPES.map(pt => {
                        const pId = curParts[pt] ?? t.defaultParts[pt];
                        const part = ALL_PARTS.find(p=>p.id===pId);
                        if (!part) return null;
                        const ec = (ELEMENT_COLORS as Record<string,string>)[part.element] ?? "#aaa";
                        return (
                          <div key={pt} style={{ display:"flex", gap:6, alignItems:"center", marginBottom:2 }}>
                            <span style={{ width:6, height:6, borderRadius:"50%", background:ec, flexShrink:0 }}/>
                            <span style={{ color:"#aaa", minWidth:52 }}>{pt}:</span>
                            <span style={{ color:"#ddd" }}>{part.move.name}</span>
                            <span style={{ color:COLORS.gray }}>{part.move.damage}dmg</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

function btnStyle(bg:string, border:string, color:string) {
  return {
    background:bg, border:`1px solid ${border}`,
    borderRadius:6, padding:"6px 12px",
    cursor:"pointer", color,
    fontFamily:"monospace", fontWeight:"bold" as const,
    fontSize:10, transition:"opacity 0.15s",
  };
}

function MetamonPreviewSvg({ mon, size=1.2 }: { mon: ActiveMetamon; size?: number }) {
  const src = getPortrait(TEMPLATE_PORTRAIT[mon.templateId]);
  const w = Math.round(120 * size);
  if (!src) {
    return (
      <div style={{
        width: w, height: Math.round(w * 4/3),
        background: mon.bodyColor,
        border: `2px solid ${mon.accentColor}`,
        borderRadius: 8,
      }} />
    );
  }
  return (
    <img
      src={src}
      alt={mon.name}
      style={{
        width: w,
        height: "auto",
        display: "block",
        borderRadius: 8,
        boxShadow: `0 4px 16px ${mon.accentColor}33, 0 0 0 1px ${mon.accentColor}44`,
        imageRendering: "auto",
      }}
    />
  );
}

