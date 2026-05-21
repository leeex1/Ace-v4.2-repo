import { useState, useEffect } from "react";
import { COLORS } from "../game/constants";
import { METAMON_TEMPLATES } from "../game/metamon";
import { getPortrait } from "../assets/mecha";
import { TEMPLATE_PORTRAIT } from "../assets/mecha/portraitMap";
import { getSaveSlots, type SaveData } from "../game/engine";
import { playSound } from "../game/audioManager";

interface MenuScreenProps {
  onStart: () => void;
  onAdventure: () => void;
  onContinue: (saveSlot: number) => void;
  onSettings: () => void;
  onSpriteDebug?: () => void;
  onSpriteTest?: () => void;
  onAssetValidator?: () => void;
  onSpriteUsageValidator?: () => void;
  onOpenGameTest?: () => void;
  onOpenMinimalTest?: () => void;
  isMobile?: boolean;
}

export function MenuScreen({ onStart, onAdventure, onContinue, onSettings, onSpriteDebug, onSpriteTest, onAssetValidator, onSpriteUsageValidator, onOpenGameTest, isMobile }: MenuScreenProps) {
  const preview = METAMON_TEMPLATES.slice(0, isMobile ? 4 : 6);
  const [saveSlots, setSaveSlots] = useState<Array<{ slot: number; exists: boolean; timestamp?: number; level?: number; score?: number }>>([]);

  useEffect(() => {
    setSaveSlots(getSaveSlots());
  }, []);

  return (
    <div style={{
      width: "100%", height: "100vh",
      background: COLORS.bg,
      color: "#f0f0f0",
      fontFamily: "monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: "16px",
      boxSizing: "border-box",
    }}>
      <div style={{ fontSize: 10, color: COLORS.gold, letterSpacing: 7, marginBottom: 4 }}>
        SAMURAI MECHA CATCHER RPG
      </div>
      <h1 style={{
        fontSize: isMobile ? 38 : 50,
        color: COLORS.accent,
        margin: "0 0 4px",
        letterSpacing: 8,
        textShadow: `0 0 40px ${COLORS.accent}`,
        lineHeight: 1,
      }}>
        METAMON
      </h1>
      <div style={{ fontSize: 12, color: "#888", letterSpacing: 4, marginBottom: 28 }}>
        CATCH · BUILD · BATTLE · SURVIVE
      </div>

      {/* Portrait showcase */}
      <div style={{
        display: "flex", gap: isMobile ? 8 : 14, marginBottom: 28,
        alignItems: "flex-end", justifyContent: "center",
        flexWrap: "wrap", maxWidth: "100%",
      }}>
        {preview.map((t) => {
          const src = getPortrait(TEMPLATE_PORTRAIT[t.id]);
          return (
            <div key={t.id} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              borderRadius: 10, overflow: "hidden",
              boxShadow: `0 4px 20px ${t.accentColor}22, 0 0 0 1px ${t.accentColor}33`,
            }}>
              {src ? (
                <img
                  src={src}
                  alt={t.name}
                  style={{
                    width: isMobile ? 56 : 72,
                    height: isMobile ? 56 : 72,
                    objectFit: "contain",
                    imageRendering: "pixelated",
                    background: `radial-gradient(circle, ${t.bodyColor}88 0%, transparent 100%)`,
                  }}
                />
              ) : (
                <div style={{ width: isMobile ? 56 : 72, height: isMobile ? 56 : 72, background: t.bodyColor }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Feature pills */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap", justifyContent: "center",
      }}>
        {[
          { label: "82+ METAMON",    color: "#f5a623" },
          { label: "ATB BATTLE",     color: "#4ecdc4" },
          { label: "PART LOOT",      color: "#c77dff" },
          { label: "SAMURAI HERO",   color: "#ff6b35" },
        ].map(p => (
          <div key={p.label} style={{
            fontSize: 9, letterSpacing: 2, padding: "3px 10px",
            background: `${p.color}11`, border: `1px solid ${p.color}44`,
            borderRadius: 20, color: p.color,
          }}>
            {p.label}
          </div>
        ))}
      </div>

      {/* Continue Game Section */}
      {saveSlots.some(slot => slot.exists) && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: COLORS.gold, letterSpacing: 3, marginBottom: 8, textAlign: "center" }}>
            CONTINUE GAME
          </div>
          <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "center" }}>
            {saveSlots.filter(slot => slot.exists).map(slot => (
              <button
                key={slot.slot}
                onClick={() => {
                  playSound('menu', 0.3);
                  onContinue(slot.slot);
                }}
                style={{
                  padding: isMobile ? "8px 16px" : "10px 20px",
                  fontSize: 11,
                  letterSpacing: 2,
                  background: "linear-gradient(135deg, #00ff9f22 0%, #00cc7f22 100%)",
                  color: "#00ff9f",
                  border: "1px solid #00ff9f",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  boxShadow: "0 0 16px #00ff9f44, 0 2px 8px rgba(0,0,0,0.5)",
                  transition: "all 0.15s",
                  minWidth: 120,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #00ff9f44 0%, #00cc7f33 100%)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px #00ff9f66, 0 2px 8px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #00ff9f22 0%, #00cc7f22 100%)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px #00ff9f44, 0 2px 8px rgba(0,0,0,0.5)";
                }}
              >
                SLOT {slot.slot + 1} - LVL {slot.level} - {slot.score}pts
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main buttons */}
      <div style={{ display: "flex", gap: 12, flexDirection: isMobile ? "column" : "row", alignItems: "center" }}>
        {/* Adventure */}
        <button
          onClick={() => {
            playSound('menu', 0.3);
            onAdventure();
          }}
          style={{
            padding: isMobile ? "14px 32px" : "16px 44px",
            fontSize: 15,
            letterSpacing: 5,
            background: "linear-gradient(135deg, #f5a62322 0%, #ff630022 100%)",
            color: "#f5a623",
            border: "2px solid #f5a623",
            borderRadius: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: "bold",
            boxShadow: "0 0 24px #f5a62344, 0 4px 16px rgba(0,0,0,0.5)",
            transition: "all 0.15s",
            minWidth: 200,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #f5a62344 0%, #ff630033 100%)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 36px #f5a62366, 0 4px 16px rgba(0,0,0,0.5)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #f5a62322 0%, #ff630022 100%)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px #f5a62344, 0 4px 16px rgba(0,0,0,0.5)";
          }}
        >
          ⚔ ADVENTURE
        </button>

        {/* Survival */}
        <button
          onClick={() => {
            playSound('menu', 0.3);
            onStart();
          }}
          style={{
            padding: isMobile ? "12px 28px" : "14px 36px",
            fontSize: 13,
            letterSpacing: 4,
            background: "transparent",
            color: COLORS.accent,
            border: `2px solid ${COLORS.accent}`,
            borderRadius: 10,
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: "bold",
            boxShadow: `0 0 14px ${COLORS.accent}33`,
            transition: "all 0.15s",
            minWidth: 180,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = `${COLORS.accent}11`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          ◈ SURVIVAL
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            playSound('menu', 0.3);
            onSettings();
          }}
          style={{
            padding: isMobile ? "10px 24px" : "12px 32px",
            fontSize: 11,
            letterSpacing: 3,
            background: "transparent",
            color: "#888",
            border: "1px solid #555",
            borderRadius: 8,
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: "bold",
            boxShadow: "0 0 8px #55533",
            transition: "all 0.15s",
            minWidth: 140,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#55511";
            (e.currentTarget as HTMLButtonElement).style.color = "#aaa";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#888";
          }}
        >
          ⚙ SETTINGS
        </button>
      </div>

      {/* Debug Section */}
      {(onSpriteDebug || onSpriteTest || onAssetValidator || onSpriteUsageValidator) && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 10, color: "#666", letterSpacing: 2, marginBottom: 12, textAlign: "center" }}>
            🔧 DEBUG TOOLS
          </div>
          <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "center" }}>
            {onSpriteDebug && (
              <button
                onClick={() => {
                  playSound('menu', 0.3);
                  onSpriteDebug();
                }}
                style={{
                  padding: "6px 12px",
                  fontSize: 9,
                  letterSpacing: 1,
                  background: "transparent",
                  color: "#4ecdc4",
                  border: "1px solid #4ecdc444",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#4ecdc411";
                  (e.currentTarget as HTMLButtonElement).style.color = "#4ecdc4";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#4ecdc4";
                }}
              >
                🎨 Sprite Gallery
              </button>
            )}
            
            {onSpriteTest && (
              <button
                onClick={() => {
                  playSound('menu', 0.3);
                  onSpriteTest();
                }}
                style={{
                  padding: "6px 12px",
                  fontSize: 9,
                  letterSpacing: 1,
                  background: "transparent",
                  color: "#f5a623",
                  border: "1px solid #f5a62344",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#f5a62311";
                  (e.currentTarget as HTMLButtonElement).style.color = "#f5a623";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#f5a623";
                }}
              >
                🧪 Sprite Test
              </button>
            )}
            
            {onAssetValidator && (
              <button
                onClick={() => {
                  playSound('menu', 0.3);
                  onAssetValidator();
                }}
                style={{
                  padding: "15px 30px",
                  fontSize: "16px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                ⚙️ ASSET VALIDATOR
              </button>
            )}
            
            {onOpenGameTest && (
              <button
                onClick={() => {
                  playSound('menu', 0.3);
                  onOpenGameTest();
                }}
                style={{
                  padding: "15px 30px",
                  fontSize: "16px",
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                🎮 GAME TEST
              </button>
            )}
            
            {onOpenMinimalTest && (
              <button
                onClick={() => {
                  playSound('menu', 0.3);
                  onOpenMinimalTest();
                }}
                style={{
                  padding: "15px 30px",
                  fontSize: "16px",
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                🧪 MINIMAL TEST
              </button>
            )}
              <button
                onClick={() => {
                  playSound('menu', 0.3);
                  onOpenMinimalTest();
                }}
                style={{
                  padding: "15px 30px",
                  fontSize: "16px",
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                🧪 MINIMAL TEST
              </button>
            )}
            
            {onSpriteUsageValidator && (
              <button
                onClick={() => {
                  playSound('menu', 0.3);
                  onSpriteUsageValidator();
                }}
                style={{
                  padding: "6px 12px",
                  fontSize: 9,
                  letterSpacing: 1,
                  background: "transparent",
                  color: "#ff6b35",
                  border: "1px solid #ff6b3544",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#ff6b3511";
                  (e.currentTarget as HTMLButtonElement).style.color = "#ff6b35";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#ff6b35";
                }}
              >
                🧪 Usage Validator
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ fontSize: 9, color: "#444", marginTop: 20, letterSpacing: 3 }}>
        ADVENTURE: RPG CATCHER · SURVIVAL: WAVE DEFENSE
      </div>
    </div>
  );
}
