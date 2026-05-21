import { useState, useEffect } from "react";
import { COLORS } from "../style/colors";
import { playSound } from "../utils/sound";
import { METAMON_TEMPLATES } from "../data/metamonTemplates";
import { getPortrait } from "../assets/mecha/portraitMap";
import { getSaveSlots } from "../utils/saveSlots";

interface MenuScreenProps {
  onStart?: () => void;
  onAdventure?: () => void;
  onContinue?: () => void;
  onSettings?: () => void;
  onSpriteDebug?: () => void;
  onSpriteTest?: () => void;
  onAssetValidator?: () => void;
  onSpriteUsageValidator?: () => void;
  onOpenGameTest?: () => void;
  onOpenMinimalTest?: () => void;
  isMobile?: boolean;
}

export function MenuScreen({ onStart, onAdventure, onContinue, onSettings, onSpriteDebug, onSpriteTest, onAssetValidator, onSpriteUsageValidator, onOpenGameTest, onOpenMinimalTest, isMobile }: MenuScreenProps) {
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
              position: "relative",
              width: isMobile ? 48 : 64,
              height: isMobile ? 48 : 64,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: 4,
              boxSizing: "border-box",
              transition: "all 0.2s",
            }}>
              <img
                src={src}
                alt={t.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  imageRendering: "pixelated",
                }}
              />
              <div style={{
                position: "absolute", bottom: -2, left: 0, right: 0,
                textAlign: "center", fontSize: 8, color: "#666",
              }}>
                {t.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main menu buttons */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 12,
        width: isMobile ? "100%" : "auto",
        minWidth: isMobile ? undefined : 280,
      }}>
        <button
          onClick={() => {
            playSound('menu', 0.3);
            onStart?.();
          }}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "monospace",
            letterSpacing: 2,
            transition: "all 0.2s",
            boxShadow: "0 4px 15px rgba(74,222,128,0.3)",
            transform: "translateY(0)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(74,222,128,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(74,222,128,0.3)";
          }}
        >
          🏃 SURVIVAL RUN
        </button>

        <button
          onClick={() => {
            playSound('menu', 0.3);
            onAdventure?.();
          }}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "monospace",
            letterSpacing: 2,
            transition: "all 0.2s",
            boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
            transform: "translateY(0)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(59,130,246,0.3)";
          }}
        >
          ⚔️ ADVENTURE
        </button>

        {/* Continue button */}
        {saveSlots.some(s => s.exists) && (
          <button
            onClick={() => {
              playSound('menu', 0.3);
              onContinue?.();
            }}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "monospace",
              letterSpacing: 1,
              transition: "all 0.2s",
              boxShadow: "0 4px 15px rgba(107,114,128,0.3)",
              transform: "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(107,114,128,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(107,114,128,0.3)";
            }}
          >
            📁 CONTINUE
          </button>
        )}

        <button
          onClick={() => {
            playSound('menu', 0.3);
            onSettings?.();
          }}
          style={{
            padding: "8px 16px",
            fontSize: "12px",
            background: "transparent",
            color: "#888",
            border: "1px solid #444",
            borderRadius: "6px",
            cursor: "pointer",
            fontFamily: "monospace",
            letterSpacing: 1,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#aaa";
            e.currentTarget.style.borderColor = "#666";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#888";
            e.currentTarget.style.borderColor = "#444";
          }}
        >
          ⚙️ SETTINGS
        </button>
      </div>

      {/* Debug Section */}
      {(onSpriteDebug || onSpriteTest || onAssetValidator || onSpriteUsageValidator || onOpenGameTest || onOpenMinimalTest) && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 10, color: "#666", letterSpacing: 2, marginBottom: 12, textAlign: "center" }}>
            🔧 DEBUG TOOLS
          </div>
          <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
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
