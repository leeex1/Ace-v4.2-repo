import { useId } from "react";

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", "").padStart(6, "0").slice(0, 6), 16);
  const r = Math.min(255, Math.max(0, ((n >> 16) & 0xff) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
  return `rgb(${r},${g},${b})`;
}

interface MechaProps {
  bodyColor: string;
  accentColor: string;
  headShape?: string;   // "dome" | "crown" | "visor" | "leaf" | "gem"
  weapShape?: string;   // "sword" | "staff" | "bow" | "shield" | "scythe"
  tailShape?: string;   // "flame" | "scorpion" | "fin" | "coil" | "seed"
  // Optional per-part color overrides (for swapped parts)
  headColor?: string;
  weapColor?: string;
  tailColor?: string;
  legColor?: string;
  armColor?: string;
  elementGlow?: string;  // color tint for eye glow / mouth glow
  size?: number;
  glow?: boolean;
}

/**
 * Outlined block — draws a chunky pixel rect with a 1px black outline and
 * manual top-edge highlight + bottom-edge shadow for that cell-shaded mecha look.
 */
function OBlock({
  x, y, w, h, fill, outline = "#0a0a14",
  hi, sh, hiPx = 1, shPx = 1, specular,
}: {
  x: number; y: number; w: number; h: number;
  fill: string; outline?: string;
  hi?: string; sh?: string; hiPx?: number; shPx?: number;
  specular?: { x: number; y: number; w: number; h: number; color?: string };
}) {
  return (
    <>
      {/* outline */}
      <rect x={x - 1} y={y - 1} width={w + 2} height={h + 2} fill={outline} />
      {/* fill */}
      <rect x={x} y={y} width={w} height={h} fill={fill} />
      {/* top highlight */}
      {hi && <rect x={x} y={y} width={w} height={hiPx} fill={hi} />}
      {/* bottom shadow */}
      {sh && <rect x={x} y={y + h - shPx} width={w} height={shPx} fill={sh} />}
      {/* specular */}
      {specular && (
        <rect x={x + specular.x} y={y + specular.y} width={specular.w} height={specular.h} fill={specular.color ?? "#ffffff"} opacity={0.55} />
      )}
    </>
  );
}

function palette(c: string) {
  return {
    dark: shade(c, -50),
    sh:   shade(c, -25),
    mid:  c,
    hi:   shade(c, 28),
    bri:  shade(c, 55),
  };
}

export function MechaSprite({
  bodyColor: bc,
  accentColor: ac,
  headShape = "dome",
  weapShape = "sword",
  tailShape = "flame",
  headColor,
  weapColor,
  tailColor,
  legColor,
  armColor,
  elementGlow,
  size = 1,
  glow = true,
}: MechaProps) {
  const W = Math.round(96 * size);
  const H = Math.round(118 * size);
  const id = useId().replace(/:/g, "");

  // body / accent base palettes
  const bodyP = palette(bc);
  const accP  = palette(ac);

  // per-part palettes (fall back to body or accent)
  const legP  = legColor  ? palette(legColor)  : bodyP;
  const armP  = armColor  ? palette(armColor)  : bodyP;
  const headP = headColor ? palette(headColor) : bodyP;
  const weapP = weapColor ? palette(weapColor) : accP;
  const tailP = tailColor ? palette(tailColor) : accP;

  // legacy name aliases used throughout the body section
  const { dark, sh, mid, hi, bri } = bodyP;
  const { dark: aDark, sh: aSh, mid: aMid, hi: aHi, bri: aBri } = accP;

  // glow color for eyes & mouth (defaults to accent)
  const glowC = elementGlow ?? ac;
  const glowP = palette(glowC);

  // viewBox is 96 wide x 118 tall
  return (
    <svg
      width={W}
      height={H}
      viewBox="0 0 96 118"
      shapeRendering="crispEdges"
      style={{ display: "block", filter: glow ? `drop-shadow(0 0 8px ${ac}55)` : undefined }}
    >
      <defs>
        <radialGradient id={`eye${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor={aHi} />
          <stop offset="100%" stopColor={aDark} />
        </radialGradient>
      </defs>

      {/* GROUND SHADOW */}
      <ellipse cx="48" cy="112" rx="26" ry="4" fill="#000" opacity="0.35" />
      <ellipse cx="48" cy="112" rx="18" ry="2" fill="#000" opacity="0.5" />

      {/* ============== TAIL ============== */}
      {tailShape === "scorpion" && (
        <>
          <OBlock x={50} y={70} w={6} h={10} fill={tailP.mid} hi={tailP.hi} sh={tailP.dark} />
          <OBlock x={56} y={62} w={6} h={9}  fill={tailP.mid} hi={tailP.hi} sh={tailP.dark} />
          <OBlock x={62} y={54} w={5} h={9}  fill={tailP.sh}  hi={tailP.mid} />
          <OBlock x={66} y={48} w={4} h={6}  fill={tailP.bri} sh={tailP.dark} />
          <rect x={67} y={49} width={1} height={1} fill="#fff" />
        </>
      )}
      {tailShape === "fin" && (
        <>
          <OBlock x={20} y={74} w={22} h={6} fill={tailP.mid} hi={tailP.hi} sh={tailP.dark} />
          <OBlock x={16} y={68} w={10} h={6} fill={tailP.sh}  hi={tailP.mid} sh={tailP.dark} />
          <rect x={18} y={70} width={2} height={2} fill={tailP.bri} />
        </>
      )}
      {tailShape === "coil" && (
        <>
          <OBlock x={42} y={70} w={6} h={6} fill={tailP.mid} hi={tailP.hi} sh={tailP.dark} />
          <OBlock x={48} y={76} w={9} h={6} fill={tailP.sh}  hi={tailP.mid} sh={tailP.dark} />
          <OBlock x={42} y={82} w={9} h={6} fill={tailP.mid} hi={tailP.hi} sh={tailP.dark} />
          <OBlock x={50} y={88} w={6} h={5} fill={tailP.bri} sh={tailP.dark} />
          <rect x={51} y={89} width={2} height={2} fill="#fff" />
        </>
      )}
      {tailShape === "seed" && (
        <>
          <OBlock x={44} y={72} w={5} h={9}  fill={sh}        hi={mid} />
          <OBlock x={36} y={80} w={16} h={12} fill={tailP.mid} hi={tailP.hi} sh={tailP.dark}
            specular={{ x: 2, y: 2, w: 4, h: 2 }} />
          <rect x={42} y={88} width={4} height={2} fill={tailP.dark} />
        </>
      )}
      {tailShape === "flame" && (
        <>
          <OBlock x={28} y={72} w={5} h={14} fill={tailP.mid} hi={tailP.hi} sh={tailP.dark} />
          <OBlock x={22} y={80} w={5} h={10} fill={tailP.sh}  hi={tailP.mid} />
          <OBlock x={32} y={86} w={5} h={8}  fill={tailP.bri} hi="#ffe680" />
          <rect x={24} y={86} width={2} height={3} fill="#ffdd55" />
          <rect x={33} y={90} width={2} height={2} fill="#ffe680" />
        </>
      )}

      {/* ============== LEGS ============== */}
      {/* left leg */}
      <OBlock x={22} y={78} w={14} h={18} fill={legP.mid} hi={legP.hi} sh={legP.dark} hiPx={2} shPx={2} />
      <OBlock x={20} y={94} w={18} h={6}  fill={legP.dark} hi={legP.sh} />
      <rect x={28} y={88} width={3} height={3} fill={legP.dark} />
      {/* right leg */}
      <OBlock x={60} y={78} w={14} h={18} fill={legP.mid} hi={legP.hi} sh={legP.dark} hiPx={2} shPx={2} />
      <OBlock x={58} y={94} w={18} h={6}  fill={legP.dark} hi={legP.sh} />
      <rect x={66} y={88} width={3} height={3} fill={legP.dark} />

      {/* ============== BODY ============== */}
      <OBlock x={18} y={42} w={60} h={38} fill={mid} hi={hi} sh={dark} hiPx={3} shPx={3}
        specular={{ x: 2, y: 2, w: 8, h: 3 }} />
      {/* shoulder yokes */}
      <OBlock x={14} y={42} w={10} h={14} fill={sh} hi={mid} sh={dark} />
      <OBlock x={72} y={42} w={10} h={14} fill={sh} hi={mid} sh={dark} />
      {/* chest plate / insignia */}
      <OBlock x={32} y={50} w={32} h={20} fill={aMid} hi={aHi} sh={aDark} hiPx={2} shPx={2}
        specular={{ x: 2, y: 2, w: 6, h: 2 }} />
      {/* center reactor */}
      <rect x={45} y={56} width={6} height={6} fill={aDark} />
      <rect x={46} y={57} width={4} height={4} fill={aBri} />
      <rect x={47} y={58} width={2} height={2} fill="#fff" />
      {/* belly seam */}
      <rect x={32} y={70} width={32} height={1} fill={dark} />
      {/* hip joints */}
      <rect x={28} y={76} width={5} height={4} fill={dark} />
      <rect x={63} y={76} width={5} height={4} fill={dark} />

      {/* ============== ARMS ============== */}
      {/* left arm */}
      <OBlock x={4}  y={46} w={12} h={20} fill={armP.mid} hi={armP.hi} sh={armP.dark} hiPx={2} shPx={2} />
      <rect  x={5}  y={48} width={2} height={2} fill={armP.bri} />
      <OBlock x={3}  y={64} w={14} h={8}  fill={aMid} hi={aHi} sh={aDark} />
      {/* shoulder rivet */}
      <rect x={9}  y={50} width={2} height={2} fill={armP.dark} />
      {/* right arm */}
      <OBlock x={80} y={46} w={12} h={20} fill={armP.mid} hi={armP.hi} sh={armP.dark} hiPx={2} shPx={2} />
      <rect  x={81} y={48} width={2} height={2} fill={armP.bri} />
      <OBlock x={79} y={64} w={14} h={8}  fill={aMid} hi={aHi} sh={aDark} />
      <rect x={85} y={50} width={2} height={2} fill={armP.dark} />

      {/* ============== WEAPON (held in right hand) ============== */}
      {weapShape === "staff" && (
        <>
          <OBlock x={84} y={6}  w={4}  h={42} fill={weapP.dark} hi={weapP.sh} />
          <OBlock x={80} y={2}  w={12} h={10} fill={weapP.mid} hi={weapP.hi} sh={weapP.dark} />
          <rect x={84} y={4} width={4} height={2} fill={weapP.bri} />
          <rect x={85} y={5} width={2} height={1} fill="#fff" />
          {/* glow orb */}
          <circle cx={86} cy={7} r={5} fill={weapP.bri} opacity={0.3} />
        </>
      )}
      {weapShape === "bow" && (
        <>
          <OBlock x={89} y={12} w={4} h={38} fill={weapP.dark} hi={weapP.sh} />
          <OBlock x={84} y={12} w={6} h={5}  fill={weapP.mid} hi={weapP.hi} sh={weapP.dark} />
          <OBlock x={84} y={45} w={6} h={5}  fill={weapP.mid} hi={weapP.hi} sh={weapP.dark} />
          <rect x={91} y={16} width={2} height={30} fill={weapP.bri} opacity={0.7} />
          {/* arrow */}
          <rect x={86} y={28} width={6} height={2} fill={weapP.dark} />
          <polygon points="80,29 84,27 84,31" fill={weapP.bri} stroke={weapP.dark} strokeWidth={1} />
        </>
      )}
      {weapShape === "shield" && (
        <>
          <OBlock x={80} y={26} w={16} h={24} fill={weapP.mid} hi={weapP.hi} sh={weapP.dark} hiPx={2} shPx={2}
            specular={{ x: 2, y: 2, w: 4, h: 3 }} />
          <rect x={86} y={32} width={4} height={12} fill={weapP.dark} />
          <rect x={87} y={33} width={2} height={2} fill={weapP.bri} />
          {/* boss stud */}
          <rect x={87} y={37} width={2} height={2} fill="#fff" opacity={0.7} />
        </>
      )}
      {weapShape === "scythe" && (
        <>
          <OBlock x={84} y={26} w={4} h={36} fill={weapP.dark} hi={weapP.sh} />
          <polygon points="58,12 90,12 90,18 86,22 60,18" fill={weapP.mid} stroke={weapP.dark} strokeWidth={1} />
          <polygon points="60,12 88,12 88,15 60,15" fill={weapP.hi} />
          <rect x={62} y={18} width={20} height={1} fill={weapP.bri} opacity={0.8} />
        </>
      )}
      {weapShape === "sword" && (
        <>
          <OBlock x={84} y={14} w={6} h={26} fill={weapP.mid} hi={weapP.hi} sh={weapP.dark}
            specular={{ x: 1, y: 2, w: 2, h: 6 }} />
          <rect x={85} y={14} width={4} height={2} fill="#fff" opacity={0.6} />
          <rect x={86} y={40} width={2} height={2} fill={weapP.bri} />
          <OBlock x={80} y={40} w={14} h={4} fill={weapP.dark} hi={weapP.sh} />
          <OBlock x={84} y={44} w={6}  h={4} fill={weapP.sh} hi={weapP.mid} />
        </>
      )}

      {/* ============== HEAD ============== */}
      {/* neck */}
      <OBlock x={42} y={38} w={12} h={6} fill={dark} hi={sh} />

      {headShape === "crown" && (
        <>
          <OBlock x={26} y={16} w={44} h={24} fill={headP.mid} hi={headP.hi} sh={headP.dark} hiPx={3} shPx={2}
            specular={{ x: 4, y: 3, w: 8, h: 3 }} />
          {/* crown spikes */}
          <polygon points="30,16 36,4 38,16" fill={aMid} stroke={aDark} strokeWidth={1} />
          <polygon points="42,16 48,0 50,16" fill={aBri} stroke={aDark} strokeWidth={1} />
          <polygon points="58,16 62,4 66,16" fill={aMid} stroke={aDark} strokeWidth={1} />
          <rect x={47} y={2} width={2} height={2} fill="#fff" />
          {/* visor band */}
          <rect x={26} y={22} width={44} height={2} fill={headP.dark} />
        </>
      )}
      {headShape === "visor" && (
        <>
          <OBlock x={24} y={16} w={48} h={26} fill={headP.mid} hi={headP.hi} sh={headP.dark} hiPx={3} shPx={2}
            specular={{ x: 4, y: 3, w: 10, h: 3 }} />
          {/* big visor band */}
          <rect x={22} y={22} width={52} height={10} fill={headP.dark} />
          <rect x={24} y={24} width={48} height={6} fill={glowP.mid} />
          <rect x={24} y={24} width={48} height={1} fill={glowP.hi} />
          {/* visor specular shine */}
          <rect x={28} y={26} width={8} height={2} fill="#fff" opacity={0.6} />
          <rect x={50} y={27} width={4} height={1} fill="#fff" opacity={0.4} />
          {/* antennas */}
          <OBlock x={32} y={8}  w={3} h={10} fill={headP.dark} />
          <rect x={32} y={6} width={3} height={3} fill={aBri} />
          <OBlock x={61} y={8}  w={3} h={10} fill={headP.dark} />
          <rect x={61} y={6} width={3} height={3} fill={aBri} />
        </>
      )}
      {headShape === "leaf" && (
        <>
          <OBlock x={28} y={16} w={40} h={24} fill={headP.mid} hi={headP.hi} sh={headP.dark} hiPx={3} shPx={2}
            specular={{ x: 4, y: 3, w: 8, h: 3 }} />
          {/* leaf ears */}
          <polygon points="14,28 28,18 28,32 22,34" fill={aMid} stroke={aDark} strokeWidth={1.2} />
          <polygon points="68,18 82,28 74,34 68,32" fill={aMid} stroke={aDark} strokeWidth={1.2} />
          <polygon points="20,26 26,22 26,30" fill={aHi} />
          <polygon points="76,26 70,22 70,30" fill={aHi} />
          {/* leaf vein */}
          <rect x={20} y={26} width={6} height={1} fill={aDark} />
          <rect x={70} y={26} width={6} height={1} fill={aDark} />
          {/* forehead gem */}
          <rect x={45} y={20} width={6} height={4} fill={aBri} />
          <rect x={46} y={21} width={4} height={2} fill="#fff" opacity={0.6} />
        </>
      )}
      {headShape === "gem" && (
        <>
          <OBlock x={28} y={20} w={40} h={20} fill={headP.mid} hi={headP.hi} sh={headP.dark} hiPx={3} shPx={2}
            specular={{ x: 4, y: 3, w: 8, h: 3 }} />
          {/* gem horn */}
          <polygon points="40,20 48,2 56,20" fill={aMid} stroke={aDark} strokeWidth={1.2} />
          <polygon points="44,20 48,8 52,20" fill={aBri} />
          <rect x={47} y={4} width={2} height={2} fill="#fff" />
          {/* side fins */}
          <polygon points="22,28 28,22 28,32" fill={headP.sh} stroke={headP.dark} strokeWidth={1} />
          <polygon points="74,28 68,22 68,32" fill={headP.sh} stroke={headP.dark} strokeWidth={1} />
        </>
      )}
      {headShape === "dome" && (
        <>
          <OBlock x={26} y={16} w={44} h={26} fill={headP.mid} hi={headP.hi} sh={headP.dark} hiPx={3} shPx={2}
            specular={{ x: 4, y: 3, w: 8, h: 3 }} />
          {/* helmet ridge */}
          <rect x={26} y={20} width={44} height={2} fill={headP.dark} />
          <rect x={45} y={10} width={6} height={6} fill={aMid} stroke={aDark} strokeWidth={1} />
          <rect x={46} y={11} width={4} height={2} fill={aBri} />
          {/* ear vents */}
          <OBlock x={22} y={26} w={6} h={8} fill={headP.sh} hi={headP.mid} sh={headP.dark} />
          <OBlock x={68} y={26} w={6} h={8} fill={headP.sh} hi={headP.mid} sh={headP.dark} />
          <rect x={23} y={28} width={4} height={1} fill={headP.dark} />
          <rect x={23} y={30} width={4} height={1} fill={headP.dark} />
          <rect x={69} y={28} width={4} height={1} fill={headP.dark} />
          <rect x={69} y={30} width={4} height={1} fill={headP.dark} />
        </>
      )}

      {/* ============== EYES (always on top) ============== */}
      {/* eye sockets */}
      <rect x={31} y={26} width={12} height={9} fill="#0a0a14" />
      <rect x={53} y={26} width={12} height={9} fill="#0a0a14" />
      {/* eye glow */}
      <rect x={32} y={27} width={10} height={7} fill={`url(#eye${id})`} />
      <rect x={54} y={27} width={10} height={7} fill={`url(#eye${id})`} />
      {/* pupil shine */}
      <rect x={34} y={28} width={3} height={2} fill="#ffffff" />
      <rect x={56} y={28} width={3} height={2} fill="#ffffff" />
      <rect x={37} y={30} width={2} height={2} fill={glowP.bri} />
      <rect x={59} y={30} width={2} height={2} fill={glowP.bri} />

      {/* mouth grille */}
      <rect x={40} y={37} width={16} height={3} fill={headP.dark} />
      <rect x={42} y={38} width={2} height={1} fill={glowP.bri} />
      <rect x={46} y={38} width={2} height={1} fill={glowP.bri} />
      <rect x={50} y={38} width={2} height={1} fill={glowP.bri} />
    </svg>
  );
}
