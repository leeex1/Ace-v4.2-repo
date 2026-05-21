import { COLORS, ROUNDS_PER_LEVEL } from "../game/constants";

interface GameOverScreenProps {
  score: number;
  level: number;
  kills: number;
  onRestart: () => void;
}

export function GameOverScreen({ score, level, kills, onRestart }: GameOverScreenProps) {
  const reached = `Level ${level}`;
  return (
    <div style={{
      width:"100%", height:"100vh",
      background: COLORS.bg,
      color:"#f0f0f0",
      fontFamily:"monospace",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"center",
      padding:20,
      boxSizing:"border-box",
    }}>
      <div style={{ color:COLORS.accent, fontSize:11, letterSpacing:6, marginBottom:6 }}>TEAM DEFEATED</div>
      <h1 style={{
        color: COLORS.accent,
        fontSize:38, letterSpacing:6, margin:"0 0 6px",
        textShadow:`0 0 30px ${COLORS.accent}`,
      }}>
        GAME OVER
      </h1>
      <p style={{ color:COLORS.gray, fontSize:13, marginBottom:28 }}>
        You reached <span style={{ color:"#fff" }}>{reached}</span> — your Metamon fought bravely!
      </p>

      <div style={{ display:"flex", gap:24, marginBottom:36, flexWrap:"wrap", justifyContent:"center" }}>
        <StatBox label="SCORE" value={score} color={COLORS.gold}/>
        <StatBox label="LEVEL" value={level} color="#00ff9f"/>
        <StatBox label="KILLS" value={kills} color={COLORS.accent}/>
      </div>

      <div style={{
        background:"rgba(255,255,255,0.03)",
        border:"1px solid #1a1a30",
        borderRadius:10,
        padding:"12px 24px",
        marginBottom:28,
        textAlign:"center",
        maxWidth:360,
      }}>
        <div style={{ color:COLORS.gold, fontSize:11, marginBottom:6 }}>NEXT TIME...</div>
        <div style={{ fontSize:11, color:"#666", lineHeight:"1.8" }}>
          • Mix elements for broader coverage<br/>
          • Pick ATK upgrades to clear waves faster<br/>
          • Heal between rounds to survive longer<br/>
          • {ROUNDS_PER_LEVEL} rounds per level — boss on final round!
        </div>
      </div>

      <button onClick={onRestart} style={{
        background: COLORS.accent,
        border:"none", borderRadius:10,
        padding:"14px 52px",
        cursor:"pointer",
        color:"#fff",
        fontFamily:"monospace", fontWeight:"bold",
        fontSize:18, letterSpacing:4,
        boxShadow:`0 0 24px ${COLORS.accent}55`,
      }}
        onMouseOver={e => (e.currentTarget.style.transform="scale(1.04)")}
        onMouseOut={e => (e.currentTarget.style.transform="scale(1)")}
      >
        PLAY AGAIN
      </button>
    </div>
  );
}

function StatBox({ label, value, color }: { label:string; value:number; color:string }) {
  return (
    <div style={{
      textAlign:"center",
      padding:"14px 24px",
      background:"rgba(255,255,255,0.04)",
      border:"1px solid #1a1a30",
      borderRadius:10,
      minWidth:90,
    }}>
      <div style={{ fontSize:10, color:COLORS.gray, letterSpacing:3, marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:30, fontWeight:"bold", color }}>{value}</div>
    </div>
  );
}
