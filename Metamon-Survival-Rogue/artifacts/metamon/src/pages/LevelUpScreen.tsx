import { COLORS } from "../game/constants";

interface LevelUpScreenProps {
  level: number;
  score: number;
  kills: number;
  onContinue: () => void;
}

export function LevelUpScreen({ level, score, kills, onContinue }: LevelUpScreenProps) {
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
    }}>
      <div style={{ color: COLORS.gold, fontSize: 12, letterSpacing: 4, marginBottom: 8 }}>WAVE CLEARED!</div>
      <h1 style={{ color: "#00ff9f", fontSize: 36, letterSpacing: 4, marginBottom: 8 }}>
        LEVEL {level} COMPLETE
      </h1>
      <p style={{ color: COLORS.gray, fontSize: 13, marginBottom: 28 }}>
        {kills} enemies defeated &nbsp;|&nbsp; Score: {score}
      </p>
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid #333",
        borderRadius: 10,
        padding: "16px 32px",
        marginBottom: 32,
        textAlign: "center",
      }}>
        <div style={{ color: COLORS.gold, fontSize: 13, marginBottom: 6 }}>NEXT LEVEL</div>
        <div style={{ fontSize: 12, color: "#aaa", lineHeight: "1.7" }}>
          {level+1 > 5 ? "ELITE" : level+1 > 3 ? "HARD" : "NORMAL"} difficulty<br/>
          Enemies: +{Math.min(5+level*2, 20)} per wave<br/>
          Enemy HP: +{Math.round(level*18)}%<br/>
          New wave every {Math.max(1.5, 5-level*0.2).toFixed(1)}s
        </div>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <button onClick={onContinue} style={{
          background: COLORS.accent,
          border: "none",
          borderRadius: 8,
          padding: "12px 40px",
          cursor: "pointer",
          color: "#fff",
          fontFamily: "monospace",
          fontWeight: "bold",
          fontSize: 16,
          letterSpacing: 3,
        }}>
          CONTINUE TO LEVEL {level + 1}
        </button>
      </div>
      <p style={{ color: COLORS.gray, fontSize: 11, marginTop: 16 }}>
        Tip: Your team auto-attacks enemies. Survive each wave to progress!
      </p>
    </div>
  );
}
