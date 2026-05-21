import { useState } from "react";
import { getFigureSrc } from "../game/spriteCache";
import { ZONE_ENCOUNTERS } from "../game/allMonTemplates";
import type { BattleHero, RPGMon, EncounterConfig } from "../game/battleTypes";
import type { RoninBorg } from "../game/roninBorgDatabase";
import type { HeroClass } from "../game/engine";
import { playSound } from "../game/audioManager";

const EL_COLOR: Record<string, string> = {
  fire: "#ff6b35", water: "#4ecdc4", grass: "#95e277",
  electric: "#ffe66d", dark: "#9b30c8", psychic: "#c77dff", normal: "#aaa",
  ice: "#a5f2f3", poison: "#b8b8d1", ground: "#d4a574", flying: "#c7ceea",
  bug: "#90be6d", rock: "#bcaaa4", ghost: "#9d8189", steel: "#a8dadc",
  dragon: "#ff006e", fairy: "#ffcad4", fighting: "#d62828",
};

// Cyberpunk Neo-Eden locations
const NEO_EDEN_ZONES = [
  { 
    name: "Neon District", 
    element: "electric", 
    icon: "⚡", 
    bg: "#0a0a1a", 
    border: "#00ffff",
    desc: "The bustling heart of Neo-Eden. Wild Ronin Borgs roam the neon-lit streets. Perfect for beginners.",
    minLevel: 1, maxLevel: 5,
    wildMonsters: [1, 2, 3, 4, 5, 6, 7],
    trainerChance: 0.2,
  },
  { 
    name: "Industrial Zone", 
    element: "steel", 
    icon: "⚙️", 
    bg: "#1a0a0a", 
    border: "#ff6600",
    desc: "Abandoned factories where rogue Ronin Borgs hide. Higher level encounters await.",
    minLevel: 5, maxLevel: 12,
    wildMonsters: [8, 9, 10, 11, 12, 13, 14, 15],
    trainerChance: 0.3,
  },
  { 
    name: "Cyber Ruins", 
    element: "dark", 
    icon: "🌑", 
    bg: "#0f0014", 
    border: "#9d00ff",
    desc: "Ancient server farms corrupted by rogue AI. Dangerous but rewarding.",
    minLevel: 10, maxLevel: 20,
    wildMonsters: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    trainerChance: 0.4,
  },
  { 
    name: "Data Streams", 
    element: "water", 
    icon: "💧", 
    bg: "#000a1a", 
    border: "#0080ff",
    desc: "The digital ocean where information flows. Water-type Ronin Borgs thrive here.",
    minLevel: 8, maxLevel: 15,
    wildMonsters: [2, 12, 8, 9, 22],
    trainerChance: 0.35,
  },
  { 
    name: "Olympian Tower", 
    element: "normal", 
    icon: "🏛️", 
    bg: "#1a1a00", 
    border: "#ffd700",
    desc: "The stronghold of the Robo Olympians. Only the strongest trainers dare enter.",
    minLevel: 20, maxLevel: 50,
    wildMonsters: [30, 40, 50, 60, 70, 71, 72, 73, 74, 75],
    trainerChance: 0.6,
    isBoss: true,
  },
];

interface Props {
  hero: BattleHero;
  party: (RPGMon | null)[];
  caught: number[];
  starterRoninBorg: RoninBorg | null;
  heroClass?: HeroClass;
  onStartBattle: (encounter: EncounterConfig, zone: string) => void;
  onBack: () => void;
}

export function WorldScreen({ hero, party, caught, starterRoninBorg, heroClass, onStartBattle, onBack }: Props) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  
  function explore(zone: typeof NEO_EDEN_ZONES[0]) {
    playSound("menu", 0.3);
    
    const isTrainer = Math.random() < zone.trainerChance;
    if (isTrainer) {
      // Cyberpunk trainers
      const CYBER_TRAINERS: Record<string, Array<{name:string;portrait:string;team:{monId:number;level:number}[]}>> = {
        "Neon District":    [{name:"Cipher",  portrait:"raijin",team:[{monId:3,level:3},{monId:1,level:2}]},{name:"Glitch",portrait:"kame",team:[{monId:2,level:4}]}],
        "Industrial Zone":  [{name:"Rust",    portrait:"oni",   team:[{monId:8,level:8},{monId:11,level:7}]},{name:"Gear",  portrait:"kabuto",team:[{monId:10,level:9}]}],
        "Cyber Ruins":      [{name:"Phantom", portrait:"tengu", team:[{monId:16,level:15},{monId:19,level:14}]},{name:"Shadow",portrait:"hanzo",team:[{monId:17,level:16}]}],
        "Data Streams":     [{name:"Wave",    portrait:"kame",  team:[{monId:12,level:12},{monId:2,level:11}]},{name:"Flow",  portrait:"okami",team:[{monId:9,level:13}]}],
        "Olympian Tower":   [{name:"Zeus",    portrait:"raijin",team:[{monId:71,level:25},{monId:72,level:23}]},{name:"Hades", portrait:"tengu",team:[{monId:73,level:24}]}],
      };
      const trainers = CYBER_TRAINERS[zone.name] ?? [];
      const trainer = trainers[Math.floor(Math.random() * trainers.length)];
      if (trainer) {
        onStartBattle({ type: "trainer", trainerName: trainer.name, trainerPortrait: trainer.portrait, trainerTeam: trainer.team }, zone.name);
        return;
      }
    }

    // Wild encounter from zone data
    const monId = zone.wildMonsters[Math.floor(Math.random() * zone.wildMonsters.length)];
    const level = Math.floor(Math.random() * (zone.maxLevel - zone.minLevel + 1)) + zone.minLevel;
    onStartBattle({ type: "wild", wildMonId: monId, wildLevel: level }, zone.name);
  }

  const livingParty = party.filter(Boolean) as RPGMon[];
  const heroSrc = getFigureSrc(hero.portraitKey);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "linear-gradient(180deg, #05050f 0%, #0a0a1e 60%, #07071a 100%)",
      display: "flex", flexDirection: "column",
      fontFamily: "monospace", color: "#f0f0f0",
      overflowY: "auto",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", borderBottom: "1px solid #1a1a2e",
        background: "rgba(0,0,0,0.5)", flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "1px solid #333", color: "#888",
          padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11,
        }}>
          ← MENU
        </button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 9, color: "#f5a623", letterSpacing: 5 }}>ADVENTURE</div>
          <div style={{ fontSize: 16, letterSpacing: 4, color: "#fff" }}>WORLD MAP</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 9, color: "#888" }}>CAUGHT</div>
          <div style={{ fontSize: 14, color: "#f5a623" }}>{caught.length}<span style={{color:"#555"}}>/82</span></div>
        </div>
      </div>

      {/* Party bar with Ronin Borg */}
      <div style={{
        display: "flex", gap: 10, padding: "10px 16px",
        background: "rgba(0,0,0,0.4)", borderBottom: "1px solid #111",
        alignItems: "center", overflowX: "auto", flexShrink: 0,
      }}>
        <div style={{ fontSize: 9, color: "#00ffff", letterSpacing: 2, flexShrink: 0 }}>RONIN BORG</div>

        {/* Starter Ronin Borg Card */}
        {starterRoninBorg && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            background: `linear-gradient(135deg, #00ffff22 0%, #ff00ff22 100%)`, 
            border: `2px solid #00ffff`,
            borderRadius: 8, padding: "6px 10px", flexShrink: 0,
            boxShadow: "0 0 20px rgba(0,255,255,0.3)",
          }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>🤖</div>
            <div style={{ fontSize: 10, color: "#00ffff", letterSpacing: 1, fontWeight: "bold" }}>
              {starterRoninBorg.speciesName}
            </div>
            <div style={{ fontSize: 8, color: "#ff00ff" }}>LV.{starterRoninBorg.level}</div>
            <div style={{ fontSize: 7, color: "#aaa", marginTop: 2 }}>Stage {starterRoninBorg.evolutionStage}</div>
          </div>
        )}

        {/* Hero card */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          background: `${hero.bodyColor}44`, border: `1px solid ${hero.accentColor}66`,
          borderRadius: 8, padding: "4px 8px", flexShrink: 0,
        }}>
          {heroSrc && <img src={heroSrc} alt={hero.name} style={{ height: 48, imageRendering: "pixelated" }} />}
          <div style={{ fontSize: 9, color: hero.accentColor, letterSpacing: 1 }}>{hero.name}</div>
          <div style={{ fontSize: 8, color: "#888" }}>LV.{hero.level}</div>
          <div style={{ width: 44, height: 3, background: "#111", borderRadius: 2, marginTop: 2 }}>
            <div style={{ height: "100%", width: `${(hero.currentHp / hero.maxHp) * 100}%`, background: "#38e868", borderRadius: 2 }} />
          </div>
        </div>

        {/* Mon cards */}
        {livingParty.map((mon, i) => {
          const src = getFigureSrc(mon.portraitKey);
          const hpPct = mon.currentHp / mon.maxHp;
          const hpColor = hpPct > 0.5 ? "#38e868" : hpPct > 0.25 ? "#f0c040" : "#ff3030";
          return (
            <div key={i} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              background: `${mon.bodyColor}44`, border: `1px solid ${mon.accentColor}55`,
              borderRadius: 8, padding: "4px 8px", flexShrink: 0,
            }}>
              {src && <img src={src} alt={mon.name} style={{ height: 42, imageRendering: "pixelated" }} />}
              <div style={{ fontSize: 9, color: "#ddd" }}>{mon.name}</div>
              <div style={{ fontSize: 8, color: "#888" }}>LV.{mon.level}</div>
              <div style={{ width: 44, height: 3, background: "#111", borderRadius: 2, marginTop: 2 }}>
                <div style={{ height: "100%", width: `${hpPct * 100}%`, background: hpColor, borderRadius: 2 }} />
              </div>
            </div>
          );
        })}

        {livingParty.length === 0 && !starterRoninBorg && (
          <div style={{ fontSize: 11, color: "#555" }}>No Ronin Borg active!</div>
        )}
      </div>

      {/* Zone cards */}
      <div style={{ padding: "16px", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {NEO_EDEN_ZONES.map(zone => {
          const elColor = EL_COLOR[zone.element] ?? "#aaa";
          const isBoss = zone.isBoss;
          return (
            <div key={zone.name} style={{
              width: "min(100%, 340px)",
              background: `linear-gradient(135deg, ${zone.bg} 0%, #0a0a18 100%)`,
              border: `2px solid ${isBoss ? '#ffd700' : zone.border}44`,
              borderRadius: 12, overflow: "hidden",
              boxShadow: isBoss ? `0 4px 24px rgba(255,215,0,0.3)` : `0 4px 24px rgba(0,0,0,0.6)`,
            }}>
              {/* Zone header */}
              <div style={{
                padding: "12px 16px",
                background: `linear-gradient(90deg, ${isBoss ? '#ffd70022' : zone.border + '22'} 0%, transparent 100%)`,
                borderBottom: `1px solid ${isBoss ? '#ffd70033' : zone.border + '33'}`,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 24 }}>{zone.icon}</span>
                <div>
                  <div style={{ fontSize: 15, color: isBoss ? "#ffd700" : "#f0f0f0", fontWeight: "bold", letterSpacing: 1 }}>
                    {zone.name} {isBoss && "★"}
                  </div>
                  <div style={{ fontSize: 10, color: elColor, letterSpacing: 3 }}>
                    {zone.element.toUpperCase()} · LV {zone.minLevel}-{zone.maxLevel}
                  </div>
                </div>
              </div>

              {/* Zone body */}
              <div style={{ padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 10, lineHeight: 1.6 }}>
                  {zone.desc}
                </div>

                {/* Possible encounters preview */}
                <div style={{ fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 6 }}>
                  WILD RONIN BORGS
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                  {zone.wildMonsters.slice(0, 5).map(id => (
                    <div key={id} style={{
                      fontSize: 9, padding: "2px 6px",
                      background: `${elColor}11`, border: `1px solid ${elColor}33`,
                      borderRadius: 4, color: "#aaa",
                    }}>
                      #{String(id).padStart(3, "0")}
                    </div>
                  ))}
                  {zone.wildMonsters.length > 5 && (
                    <div style={{ fontSize: 9, color: "#555", padding: "2px 0" }}>
                      +{zone.wildMonsters.length - 5} more
                    </div>
                  )}
                </div>

                <button
                  onClick={() => explore(zone)}
                  style={{
                    width: "100%", padding: "10px 0",
                    background: `linear-gradient(90deg, ${isBoss ? '#ffd70033' : zone.border + '33'} 0%, ${isBoss ? '#ffd70022' : zone.border + '22'} 100%)`,
                    border: `1px solid ${isBoss ? '#ffd70088' : zone.border + '88'}`,
                    color: isBoss ? '#ffd700' : zone.border, borderRadius: 8,
                    cursor: "pointer", fontSize: 12,
                    letterSpacing: 3, fontFamily: "monospace",
                    fontWeight: "bold",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = isBoss ? '#ffd70044' : `${zone.border}44`;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = isBoss ? `0 0 16px rgba(255,215,0,0.4)` : `0 0 16px ${zone.border}44`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(90deg, ${isBoss ? '#ffd70033' : zone.border + '33'} 0%, ${isBoss ? '#ffd70022' : zone.border + '22'} 100%)`;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  {isBoss ? "⚔ CHALLENGE" : "⚔ EXPLORE"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
