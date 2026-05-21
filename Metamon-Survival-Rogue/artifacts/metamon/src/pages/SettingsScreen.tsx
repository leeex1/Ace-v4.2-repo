import { useState, useEffect } from "react";
import { COLORS } from "../game/constants";
import { playSound, stopAllSounds } from "../game/audioManager";

interface SettingsScreenProps {
  onClose: () => void;
  isMobile?: boolean;
}

interface GameSettings {
  soundVolume: number;
  autoSave: boolean;
  showParticles: boolean;
  quality: "low" | "medium" | "high";
}

export function SettingsScreen({ onClose, isMobile }: SettingsScreenProps) {
  const [settings, setSettings] = useState<GameSettings>({
    soundVolume: 0.5,
    autoSave: true,
    showParticles: true,
    quality: "high",
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("metamon_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsed });
      } catch (error) {
        console.warn("Failed to load settings:", error);
      }
    }
  }, []);

  const saveSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem("metamon_settings", JSON.stringify(newSettings));
    
    // Apply settings immediately
    if (newSettings.soundVolume === 0) {
      stopAllSounds();
    }
  };

  const handleVolumeChange = (volume: number) => {
    saveSettings({ ...settings, soundVolume: volume });
  };

  const handleToggleAutoSave = () => {
    saveSettings({ ...settings, autoSave: !settings.autoSave });
  };

  const handleToggleParticles = () => {
    saveSettings({ ...settings, showParticles: !settings.showParticles });
  };

  const handleQualityChange = (quality: "low" | "medium" | "high") => {
    saveSettings({ ...settings, quality });
  };

  const handleBack = () => {
    playSound('menu', 0.3);
    onClose();
  };

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
      <div style={{
        background: "#111128",
        border: `2px solid ${COLORS.accent}`,
        borderRadius: 12,
        padding: isMobile ? "20px" : "32px",
        maxWidth: isMobile ? "90vw" : "500px",
        width: "100%",
        boxShadow: `0 0 40px ${COLORS.accent}33`,
      }}>
        <h2 style={{
          fontSize: isMobile ? 24 : 28,
          color: COLORS.accent,
          margin: "0 0 24px",
          letterSpacing: 4,
          textAlign: "center",
          textShadow: `0 0 20px ${COLORS.accent}`,
        }}>
          SETTINGS
        </h2>

        {/* Sound Volume */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: "block",
            fontSize: 12,
            color: COLORS.gold,
            letterSpacing: 2,
            marginBottom: 8,
          }}>
            SOUND VOLUME: {Math.round(settings.soundVolume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.soundVolume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            onClick={() => playSound('menu', 0.2)}
            style={{
              width: "100%",
              height: 6,
              background: "#333",
              outline: "none",
              borderRadius: 3,
            }}
          />
        </div>

        {/* Auto Save */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => {
              playSound('menu', 0.2);
              handleToggleAutoSave();
            }}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: 12,
              letterSpacing: 2,
              background: settings.autoSave ? `${COLORS.green}22` : "#333",
              color: settings.autoSave ? COLORS.green : "#888",
              border: `1px solid ${settings.autoSave ? COLORS.green : "#555"}`,
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "monospace",
              textAlign: "left",
            }}
          >
            {settings.autoSave ? "✓" : "○"} AUTO-SAVE GAMES
          </button>
        </div>

        {/* Show Particles */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => {
              playSound('menu', 0.2);
              handleToggleParticles();
            }}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: 12,
              letterSpacing: 2,
              background: settings.showParticles ? `${COLORS.green}22` : "#333",
              color: settings.showParticles ? COLORS.green : "#888",
              border: `1px solid ${settings.showParticles ? COLORS.green : "#555"}`,
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "monospace",
              textAlign: "left",
            }}
          >
            {settings.showParticles ? "✓" : "○"} SHOW PARTICLES
          </button>
        </div>

        {/* Quality Settings */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: "block",
            fontSize: 12,
            color: COLORS.gold,
            letterSpacing: 2,
            marginBottom: 8,
          }}>
            GRAPHICS QUALITY
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["low", "medium", "high"] as const).map((quality) => (
              <button
                key={quality}
                onClick={() => {
                  playSound('menu', 0.2);
                  handleQualityChange(quality);
                }}
                style={{
                  flex: 1,
                  padding: "8px",
                  fontSize: 11,
                  letterSpacing: 1,
                  background: settings.quality === quality ? `${COLORS.accent}22` : "#333",
                  color: settings.quality === quality ? COLORS.accent : "#888",
                  border: `1px solid ${settings.quality === quality ? COLORS.accent : "#555"}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                }}
              >
                {quality}
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: 14,
            letterSpacing: 3,
            background: "transparent",
            color: COLORS.accent,
            border: `2px solid ${COLORS.accent}`,
            borderRadius: 8,
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: "bold",
            boxShadow: `0 0 14px ${COLORS.accent}33`,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = `${COLORS.accent}11`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          ← BACK
        </button>
      </div>
    </div>
  );
}
