import { useState } from "react";
import { HERO_CLASSES } from "../game/heroData";
import { getFigureSrc } from "../game/spriteCache";
import type { ElementType } from "../game/constants";

const EL_COLOR: Record<ElementType, string> = {
  fire: "#ff6b35", water: "#4ecdc4", grass: "#95e277",
  electric: "#ffe66d", dark: "#9b30c8", psychic: "#c77dff", normal: "#aaa",
};

interface Props {
  onSelect: (heroClassId: string) => void;
  onBack: () => void;
}

export function HeroSelectScreen({ onSelect, onBack }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "linear-gradient(180deg, #07071a 0%, #0e0a22 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 16px", boxSizing: "border-box", overflowY: "auto",
    }}>
      <button onClick={onBack} style={{
        alignSelf: "flex-start", background: "transparent",
        border: "1px solid #444", color: "#888", padding: "4px 12px",
        borderRadius: 6, cursor: "pointer", fontSize: 12, marginBottom: 16,
      }}>
        ← BACK
      </button>

      <div style={{ fontSize: 11, color: "#f5a623", letterSpacing: 6, marginBottom: 6 }}>
        ADVENTURE MODE
      </div>
      <h2 style={{
        fontSize: 28, color: "#f0f0f0", margin: "0 0 6px",
        letterSpacing: 4, textAlign: "center",
      }}>
        CHOOSE YOUR SAMURAI
      </h2>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 28 }}>
        Your hero fights alongside your Metamon team
      </div>

      <div style={{
        display: "flex", flexWrap: "wrap", gap: 14,
        justifyContent: "center", maxWidth: 900,
      }}>
        {HERO_CLASSES.map(hc => {
          const isHovered = hovered === hc.id;
          const elColor = EL_COLOR[hc.element] ?? "#aaa";
          const src = getFigureSrc(hc.portraitKey);
          return (
            <div
              key={hc.id}
              onMouseEnter={() => setHovered(hc.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: 160, background: isHovered ? "#1a1a2e" : "#0d0d1e",
                border: `2px solid ${isHovered ? elColor : "#2a2a3a"}`,
                borderRadius: 12, padding: "14px 10px",
                display: "flex", flexDirection: "column", alignItems: "center",
                cursor: "pointer", transition: "all 0.15s",
                boxShadow: isHovered ? `0 0 20px ${elColor}44, 0 4px 16px rgba(0,0,0,0.5)` : "0 4px 12px rgba(0,0,0,0.5)",
                transform: isHovered ? "translateY(-3px)" : "none",
              }}
              onClick={() => onSelect(hc.id)}
            >
              {/* Portrait */}
              <div style={{
                width: 90, height: 90,
                border: `2px solid ${elColor}55`,
                borderRadius: 8, overflow: "hidden",
                background: `radial-gradient(circle, ${hc.bodyColor}cc 0%, #07071a 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 8,
              }}>
                {src ? (
                  <img src={src} alt={hc.name} style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }} />
                ) : (
                  <div style={{ color: elColor, fontSize: 36 }}>⚔</div>
                )}
              </div>

              {/* Name + Element */}
              <div style={{ color: "#f0f0f0", fontSize: 14, fontWeight: "bold", marginBottom: 2 }}>
                {hc.name}
              </div>
              <div style={{
                fontSize: 9, color: elColor, letterSpacing: 3,
                background: `${elColor}22`, padding: "2px 8px",
                borderRadius: 4, marginBottom: 8,
              }}>
                {hc.element.toUpperCase()}
              </div>

              {/* Stats */}
              {[
                ["HP",  hc.baseHp,  180],
                ["ATK", hc.baseAtk, 120],
                ["DEF", hc.baseDef, 120],
                ["SPD", hc.baseSpd, 120],
              ].map(([label, val, max]) => (
                <div key={label as string} style={{ width: "100%", marginBottom: 3 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#888", marginBottom: 2 }}>
                    <span>{label}</span>
                    <span style={{ color: "#bbb" }}>{val}</span>
                  </div>
                  <div style={{ height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${((val as number) / (max as number)) * 100}%`,
                      background: elColor, borderRadius: 2,
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                </div>
              ))}

              {/* Description */}
              <div style={{ fontSize: 9, color: "#666", textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
                {hc.description}
              </div>

              <button style={{
                marginTop: 12, width: "100%", padding: "8px 0",
                background: isHovered ? elColor : "transparent",
                border: `1px solid ${elColor}`,
                color: isHovered ? "#000" : elColor,
                borderRadius: 6, cursor: "pointer", fontSize: 11,
                letterSpacing: 2, fontFamily: "monospace",
                fontWeight: "bold", transition: "all 0.15s",
              }}>
                SELECT
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
