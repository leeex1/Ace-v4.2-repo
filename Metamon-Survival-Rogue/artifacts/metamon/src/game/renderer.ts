import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, ELEMENT_COLORS, PART_TYPES, ROUNDS_PER_LEVEL } from "./constants";
import type { RunState, Projectile, BurstEntity } from "./engine";
import type { ActiveMetamon } from "./metamon";
import { getMechaFigure } from "./spriteCache";

// ── Pixel sprite helpers ──────────────────────────────────────────────────────

function px(ctx: CanvasRenderingContext2D, x:number, y:number, w:number, h:number, color:string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function shade(hex:string, amt:number) {
  const n = parseInt(hex.slice(1),16);
  const r = Math.min(255,Math.max(0,((n>>16)&0xff)+amt));
  const g = Math.min(255,Math.max(0,((n>>8)&0xff)+amt));
  const b = Math.min(255,Math.max(0,(n&0xff)+amt));
  return `rgb(${r},${g},${b})`;
}

// Draw a Metamon at (cx, cy) using its samurai mecha portrait.
// Falls back to a simple colored chip if the image hasn't loaded yet.
const FIGURE_NATIVE_W = 168;
const FIGURE_NATIVE_H = 148;
const FIGURE_TARGET_H = 82; // on-canvas height; scale param applies on top

export function drawPixelMetamon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  mon: ActiveMetamon,
  scale = 1,
  flash = false,
  glow = false,
  time = 0,
  slotIndex = 0,
) {
  const img = getMechaFigure(mon.templateId);

  // Idle bob: each slot has a different phase so they don't all move in sync
  const bob = Math.sin(time * 2.4 + slotIndex * 1.1) * 4;
  // Leader breathes with a subtle scale pulse
  const s = glow ? scale * (1 + Math.sin(time * 3.2) * 0.025) : scale;
  const hpRatio = mon.currentHp / mon.maxHp;

  const h = FIGURE_TARGET_H * s;
  const w = h * (FIGURE_NATIVE_W / FIGURE_NATIVE_H);
  const drawX = Math.round(cx - w / 2);
  const drawY = Math.round(cy - h / 2 + bob);

  ctx.save();

  // ── Ground shadow ──────────────────────────────────────────────────────────
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0,0.30)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.44, w * 0.36, h * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Leader / glow pre-pass (drawn before sprite so glow sits behind it) ───
  if (glow) {
    const glowR = 28 + Math.sin(time * 3.2) * 7;
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.18 + Math.sin(time * 3.2) * 0.05;
    ctx.shadowBlur = glowR;
    ctx.shadowColor = mon.accentColor;
    ctx.fillStyle = mon.accentColor;
    ctx.beginPath();
    ctx.ellipse(cx, cy + bob * 0.5, w * 0.35, h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  // ── Sprite image ───────────────────────────────────────────────────────────
  if (img) {
    if (flash) {
      // Damage flash: draw white overlay on top via lighter blend
      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "brightness(3.5) saturate(0)";
      ctx.drawImage(img, drawX, drawY, w, h);
      ctx.filter = "none";
    } else {
      // Screen blend makes the dark-background PNGs look like true sprites —
      // black pixels become transparent against the dark canvas.
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(img, drawX, drawY, w, h);
      ctx.globalCompositeOperation = "source-over";

      // HP-critical red danger pulse
      if (hpRatio < 0.3) {
        const pulse = (Math.sin(time * 8) * 0.5 + 0.5) * 0.30;
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = pulse;
        ctx.fillStyle = "#ff3030";
        ctx.fillRect(drawX, drawY, w, h);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
    }
  } else {
    // Fallback chip while image loads
    ctx.fillStyle = flash ? "#fff" : mon.bodyColor;
    ctx.fillRect(drawX, drawY, w, h);
    ctx.strokeStyle = mon.accentColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(drawX, drawY, w, h);
  }

  // ── Name label + mini HP bar ───────────────────────────────────────────────
  const barW = Math.round(w * 0.78);
  const barH = 4;
  const barX = Math.round(cx - barW / 2);
  const barY = drawY - 16;

  // HP bar background
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
  // HP bar fill — colour shifts green → yellow → red
  const hpColor = hpRatio > 0.55 ? "#38e868" : hpRatio > 0.28 ? "#f0c040" : "#ff3030";
  ctx.fillStyle = hpColor;
  ctx.fillRect(barX, barY, Math.round(barW * hpRatio), barH);

  // Name tag
  const labelY = barY - 11;
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "center";
  const labelW = ctx.measureText(mon.name).width + 8;
  ctx.fillStyle = "rgba(0,0,0,0.60)";
  ctx.fillRect(cx - labelW / 2, labelY - 1, labelW, 10);
  ctx.fillStyle = glow ? mon.accentColor : "#ccd6ff";
  ctx.fillText(mon.name, cx, labelY + 8);

  ctx.restore();
}

// ── Enemy sprites ─────────────────────────────────────────────────────────────

function drawEnemy(ctx: CanvasRenderingContext2D, x:number, y:number, color:string, ac:string, radius:number, tier:number, isBoss:boolean, time:number) {
  const s = radius / 15;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  if (isBoss) {
    ctx.shadowBlur = 20 + Math.sin(time*4)*6;
    ctx.shadowColor = "#ff00ff";
  }

  // Soft 2-layer drop shadow for 3.5D grounding
  ctx.fillStyle = "rgba(0,0,0,0.14)";
  ctx.beginPath();
  ctx.ellipse(0, Math.round(23*s), Math.round(19*s), Math.round(6*s), 0, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.30)";
  ctx.beginPath();
  ctx.ellipse(0, Math.round(22*s), Math.round(13*s), Math.round(4*s), 0, 0, Math.PI*2);
  ctx.fill();

  if (isBoss) {
    // Boss: bigger, darker, spiky
    const bob = Math.sin(time*3)*2;
    px(ctx, -6*s, 14*s+bob, 5*s, 14*s, shade(color,20));
    px(ctx,  1*s, 14*s+bob, 5*s, 14*s, shade(color,20));
    px(ctx, -14*s, -6*s+bob, 28*s, 24*s, color);
    px(ctx, -12*s, -16*s+bob, 24*s, 14*s, ac);
    // spikes
    px(ctx, -16*s, -24*s+bob, 5*s, 10*s, shade(ac,-20));
    px(ctx, -6*s,  -26*s+bob, 5*s, 12*s, shade(ac,30));
    px(ctx,  4*s,  -26*s+bob, 5*s, 12*s, shade(ac,30));
    px(ctx,  11*s, -24*s+bob, 5*s, 10*s, shade(ac,-20));
    // eyes (menacing red glow)
    px(ctx, -8*s, -14*s+bob, 6*s, 6*s, "#ff0000");
    px(ctx,  2*s, -14*s+bob, 6*s, 6*s, "#ff0000");
    px(ctx, -7*s, -13*s+bob, 4*s, 4*s, "#ffffff");
    px(ctx,  3*s, -13*s+bob, 4*s, 4*s, "#ffffff");
    // body shading
    px(ctx, -14*s, -6*s+bob, 3*s, 24*s, shade(color,-35));      // left shadow
    px(ctx, -14*s, -6*s+bob, 28*s, 3*s, shade(color,40));        // top highlight
    // 3.5D additions
    px(ctx, -10*s, -3*s+bob, 3*s, 3*s, shade(color, 70));        // specular spot
    px(ctx, -10*s, -3*s+bob, 2*s, 2*s, "#ffffff");               // specular dot
    px(ctx,  13*s, -4*s+bob, 1*s, 22*s, shade(color, 70));       // rim light right
    px(ctx, -12*s, -5*s+bob, 24*s, 1*s, "rgba(0,0,0,0.35)");     // AO under head
    px(ctx, -12*s, 18*s+bob, 24*s, 1*s, "rgba(0,0,0,0.35)");     // AO under body
  } else {
    // Normal enemies by tier
    const bob = Math.sin(time*2.5+x)*1.5;
    // legs
    px(ctx, -7*s, 10*s+bob, 5*s, 10*s, shade(color,10));
    px(ctx,  2*s, 10*s+bob, 5*s, 10*s, shade(color,10));
    px(ctx, -7*s, 18*s+bob, 5*s, 2*s, shade(color,-30));   // foot shadow
    px(ctx,  2*s, 18*s+bob, 5*s, 2*s, shade(color,-30));
    // body
    px(ctx, -10*s, -6*s+bob, 20*s, 18*s, color);
    px(ctx, -10*s, -6*s+bob, 3*s, 18*s, shade(color,-20));    // left shadow band
    px(ctx, -10*s, -6*s+bob, 20*s, 3*s, shade(color,35));     // top highlight
    px(ctx,   9*s, -3*s+bob, 1*s, 14*s, shade(color, 70));     // rim light right
    px(ctx,  -8*s, -3*s+bob, 2*s, 2*s, "#ffffff");             // specular dot
    px(ctx, -10*s, 11*s+bob, 20*s, 1*s, "rgba(0,0,0,0.32)");   // AO under body
    // head
    px(ctx, -8*s, -16*s+bob, 16*s, 12*s, ac);
    px(ctx, -8*s, -16*s+bob, 16*s, 3*s, shade(ac,40));
    px(ctx,  7*s,-15*s+bob, 1*s,  9*s, shade(ac, 70));         // head rim right
    px(ctx, -8*s, -5*s+bob, 16*s, 1*s, "rgba(0,0,0,0.30)");    // AO under head
    if (tier >= 2) {
      // arms
      px(ctx, -16*s, -4*s+bob, 6*s, 8*s, shade(color,15));
      px(ctx,  10*s, -4*s+bob, 6*s, 8*s, shade(color,15));
      px(ctx, -16*s, -4*s+bob, 6*s, 2*s, shade(color, 50));
      px(ctx,  10*s, -4*s+bob, 6*s, 2*s, shade(color, 50));
    }
    if (tier >= 3) {
      // horns
      px(ctx, -5*s, -22*s+bob, 4*s, 8*s, shade(ac,-30));
      px(ctx,  1*s, -22*s+bob, 4*s, 8*s, shade(ac,-30));
      px(ctx, -5*s, -22*s+bob, 1*s, 8*s, shade(ac, 50));
      px(ctx,  1*s, -22*s+bob, 1*s, 8*s, shade(ac, 50));
    }
    if (tier >= 4) {
      // shoulder spikes
      px(ctx, -18*s, -8*s+bob, 4*s, 6*s, "#ffffff");
      px(ctx,  14*s, -8*s+bob, 4*s, 6*s, "#ffffff");
      px(ctx, -18*s, -8*s+bob, 1*s, 6*s, shade(color,-50));
      px(ctx,  17*s, -8*s+bob, 1*s, 6*s, shade(color,-50));
    }
    // eyes
    px(ctx, -6*s, -14*s+bob, 4*s, 4*s, "#ffffff");
    px(ctx,  2*s, -14*s+bob, 4*s, 4*s, "#ffffff");
    px(ctx, -5*s, -13*s+bob, 2*s, 2*s, "#000000");
    px(ctx,  3*s, -13*s+bob, 2*s, 2*s, "#000000");
    px(ctx, -4*s, -13*s+bob, 1*s, 1*s, "#ffffff");  // eye shine L
    px(ctx,  4*s, -13*s+bob, 1*s, 1*s, "#ffffff");  // eye shine R
  }

  ctx.restore();
}

// ── Background ────────────────────────────────────────────────────────────────

function drawBg(ctx: CanvasRenderingContext2D, bgScrollY: number, level: number) {
  // Horizon-graded base (darker at top, warmer at bottom for depth)
  const topCol = level >= 6 ? "#0a0010" : level >= 3 ? "#040614" : "#06081a";
  const botCol = level >= 6 ? "#1a0728" : level >= 3 ? "#0a1632" : "#10122e";
  const grd = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grd.addColorStop(0, topCol);
  grd.addColorStop(0.55, topCol);
  grd.addColorStop(1, botCol);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Distant horizon glow band (sets the perspective horizon line)
  const horizonY = CANVAS_HEIGHT * 0.32;
  const hgrd = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 40);
  const horizonCol = level >= 6 ? "rgba(180,40,255,0.10)" : level >= 3 ? "rgba(60,140,255,0.10)" : "rgba(120,140,255,0.07)";
  hgrd.addColorStop(0, "rgba(0,0,0,0)");
  hgrd.addColorStop(0.5, horizonCol);
  hgrd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = hgrd;
  ctx.fillRect(0, horizonY - 40, CANVAS_WIDTH, 80);

  // Perspective floor: rows that converge toward the horizon (transverse lines)
  const floorTop = horizonY + 6;
  const floorBottom = CANVAS_HEIGHT;
  const lineColor = level >= 6 ? "rgba(140,40,200,0.18)" : level >= 3 ? "rgba(40,120,200,0.18)" : "rgba(70,90,160,0.18)";
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  // Animated scrolling rows (use bgScrollY mod 1 to slide rows toward viewer)
  const rowCount = 14;
  const scrollFrac = (bgScrollY * 0.012) % 1;
  for (let i = 0; i < rowCount; i++) {
    // exponential spacing: rows packed at top, expanded toward bottom
    const t = ((i + scrollFrac) / rowCount);
    const tt = t * t; // quadratic to mimic perspective
    const y = floorTop + tt * (floorBottom - floorTop);
    ctx.globalAlpha = Math.min(1, t * 1.6);
    ctx.beginPath();
    ctx.moveTo(0, Math.round(y));
    ctx.lineTo(CANVAS_WIDTH, Math.round(y));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Perspective floor: longitudinal lines converging to the vanishing point
  const vanishX = CANVAS_WIDTH / 2;
  const lonCount = 13;
  for (let i = 0; i <= lonCount; i++) {
    const f = i / lonCount;        // 0 → 1
    const xBottom = f * CANVAS_WIDTH;
    const xTop = vanishX + (xBottom - vanishX) * 0.08; // narrow toward horizon
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.moveTo(xTop, floorTop);
    ctx.lineTo(xBottom, floorBottom);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Soft ambient glow spots floating in the lower scene for depth
  const glowColor = level >= 6 ? "rgba(160,0,255,0.05)" : level >= 3 ? "rgba(0,80,200,0.06)" : "rgba(30,30,120,0.07)";
  ctx.fillStyle = glowColor;
  for (let i=0; i<4; i++) {
    const gx = (CANVAS_WIDTH/4)*i + CANVAS_WIDTH/8;
    const gy = CANVAS_HEIGHT * 0.7;
    ctx.beginPath();
    ctx.arc(gx, gy, 90+i*22, 0, Math.PI*2);
    ctx.fill();
  }

  // Vignette: darken corners to focus attention
  const vGrd = ctx.createRadialGradient(
    CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH*0.25,
    CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH*0.7
  );
  vGrd.addColorStop(0, "rgba(0,0,0,0)");
  vGrd.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vGrd;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// ── Health bar ────────────────────────────────────────────────────────────────

function drawHPBar(ctx: CanvasRenderingContext2D, x:number, y:number, w:number, current:number, max:number) {
  const pct = Math.max(0, current/max);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  roundRect(ctx, x, y, w, 5, 2);
  const barColor = pct > 0.55 ? "#00ff9f" : pct > 0.25 ? "#ffe66d" : "#ff4757";
  ctx.fillStyle = barColor;
  roundRect(ctx, x, y, Math.max(2, w*pct), 5, 2);
}

function roundRect(ctx: CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number) {
  ctx.beginPath();
  ctx.roundRect(x,y,w,h,r);
  ctx.fill();
}

// ── HUD ───────────────────────────────────────────────────────────────────────

function drawHUD(ctx: CanvasRenderingContext2D, state: RunState) {
  // Top strip
  ctx.fillStyle = "rgba(5,5,18,0.78)";
  ctx.fillRect(0,0,CANVAS_WIDTH,46);
  // Bottom strip
  ctx.fillStyle = "rgba(5,5,18,0.82)";
  ctx.fillRect(0,CANVAS_HEIGHT-56,CANVAS_WIDTH,56);

  // Score
  ctx.fillStyle = COLORS.gold;
  ctx.font = "bold 15px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`SCORE: ${state.score}`, 10, 28);

  // Level / round
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(`LEVEL ${state.level}  •  ROUND ${state.round}/${ROUNDS_PER_LEVEL}`, CANVAS_WIDTH/2, 28);

  // Round pips
  for (let i=0; i<ROUNDS_PER_LEVEL; i++) {
    const filled = i < state.round;
    ctx.fillStyle = filled ? "#e94560" : "#333";
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH/2 - 12 + i*12, 38, 4, 0, Math.PI*2);
    ctx.fill();
  }

  // Timer
  const t = Math.max(0, Math.ceil(state.roundTimer));
  ctx.fillStyle = t < 8 ? "#ff4757" : COLORS.gold;
  ctx.textAlign = "right";
  ctx.font = `bold ${t < 8 ? 18 : 15}px monospace`;
  ctx.fillText(`${t}s`, CANVAS_WIDTH-10, 28);

  // XP bar under top strip
  const xpPct = state.xp / state.xpToNext;
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0,40,CANVAS_WIDTH,5);
  ctx.fillStyle = "#00ff9f";
  ctx.fillRect(0,40,CANVAS_WIDTH*xpPct,5);

  // Team panels
  const panelW = 186;
  const startX = (CANVAS_WIDTH - panelW*4 + 4) / 2;
  ctx.font = "bold 11px monospace";
  for (let i=0; i<4; i++) {
    const mon = state.team[i];
    const px = startX + i*panelW;
    const py = CANVAS_HEIGHT - 52;

    ctx.fillStyle = "rgba(8,8,22,0.88)";
    roundRect(ctx, px, py, panelW-4, 48, 4);
    ctx.strokeStyle = mon ? `${mon.accentColor}55` : "#222";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, py, panelW-4, 48, 4); ctx.stroke();

    if (mon && mon.currentHp > 0) {
      ctx.fillStyle = mon.accentColor;
      ctx.textAlign = "left";
      ctx.fillText(mon.name, px+6, py+14);

      // tiny element indicators
      const parts = Object.values(mon.parts);
      parts.forEach((p,j) => {
        const ec = (ELEMENT_COLORS as Record<string,string>)[p?.element ?? "normal"] ?? "#aaa";
        ctx.fillStyle = ec;
        ctx.beginPath(); ctx.arc(px+6+j*8, py+22, 3, 0, Math.PI*2); ctx.fill();
      });

      drawHPBar(ctx, px+6, py+28, panelW-16, mon.currentHp, mon.maxHp);
      ctx.fillStyle = "#555";
      ctx.font = "9px monospace";
      ctx.fillText(`${Math.ceil(mon.currentHp)}/${mon.maxHp} · ATK${mon.atk} SPD${mon.spd}`, px+6, py+44);
      ctx.font = "bold 11px monospace";
    } else if (!mon) {
      ctx.fillStyle = "#333";
      ctx.textAlign = "left";
      ctx.fillText("--- EMPTY ---", px+6, py+28);
    }
  }

  // Kills
  ctx.fillStyle = COLORS.gray;
  ctx.font = "10px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`Kills: ${state.kills}`, CANVAS_WIDTH-8, CANVAS_HEIGHT-4);
}

// ── Main render ───────────────────────────────────────────────────────────────

export function renderGame(ctx: CanvasRenderingContext2D, state: RunState, time: number) {
  ctx.save();
  // Screen shake
  if (state.screenShake.x !== 0 || state.screenShake.y !== 0) {
    ctx.translate(
      Math.round(state.screenShake.x * (Math.random()*2-1)),
      Math.round(state.screenShake.y * (Math.random()*2-1))
    );
  }

  // Background
  drawBg(ctx, state.bgScrollY, state.level);

  // Player area glow
  ctx.save();
  ctx.globalAlpha = 0.07;
  const grd = ctx.createRadialGradient(state.playerX,state.playerY,10,state.playerX,state.playerY,100);
  grd.addColorStop(0,"#ffffff");
  grd.addColorStop(1,"transparent");
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  ctx.restore();

  // Bursts (under projectiles so projectiles draw on top)
  for (const b of state.bursts) {
    if (!b.alive) continue;
    drawBurst(ctx, b, time);
  }

  // Projectiles — element-themed pixel sprites
  for (const p of state.projectiles) {
    if (!p.alive) continue;
    drawProjectileSprite(ctx, p, time);
  }

  // Enemies (back to front, sorted by y)
  const aliveEnemies = state.enemies
    .filter(e => e.alive)
    .sort((a,b) => a.y - b.y);
  for (const e of aliveEnemies) {
    drawEnemy(ctx, e.x, e.y, e.color, e.accentColor, e.radius, e.tier, e.isBoss, time);
    // HP bar
    if (e.hp < e.maxHp) {
      drawHPBar(ctx, e.x-e.radius, e.y-e.radius-10, e.radius*2, e.hp, e.maxHp);
      if (e.isBoss) {
        ctx.fillStyle = "#ff00ff";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText("BOSS", e.x, e.y-e.radius-13);
      }
    }
  }

  // Player team — depth-sorted back to front (higher Y = drawn on top)
  const isFlash = state.playerInvincible > 0 && Math.floor(time*14) % 2 === 0;
  const teamDrawOrder = [0,1,2,3]
    .filter(i => state.team[i] && state.team[i]!.currentHp > 0)
    .sort((a, b) => state.teamPositions[a].y - state.teamPositions[b].y);
  for (const i of teamDrawOrder) {
    const mon = state.team[i]!;
    const pos = state.teamPositions[i];
    drawPixelMetamon(ctx, pos.x, pos.y, mon, 1.0, isFlash, i === 0, time, i);
  }

  // Particles
  for (const p of state.particles) {
    if (!p.alive) continue;
    const alpha = Math.max(0, p.life/p.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 6;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, p.radius*alpha), 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  // Floating texts
  ctx.save();
  ctx.textAlign = "center";
  for (const f of state.floatingTexts) {
    if (!f.alive) continue;
    const alpha = Math.min(1, f.life*2.2);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.font = `bold 13px monospace`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = f.color;
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.restore();

  ctx.restore(); // screen shake

  // HUD drawn on top, unaffected by shake
  drawHUD(ctx, state);
}


// ── Element-themed projectile sprites ────────────────────────────────────────

function drawProjectileSprite(ctx: CanvasRenderingContext2D, p: Projectile, time: number) {
  const angle = Math.atan2(p.vy, p.vx);
  const size = Math.max(4, p.radius);
  ctx.save();
  ctx.translate(Math.round(p.x), Math.round(p.y));
  ctx.shadowBlur = 14;
  ctx.shadowColor = p.color;

  switch (p.element) {
    case "fire": {
      // Pixel fireball: dark red core, orange outer, yellow hot spot, flicker tail
      ctx.rotate(angle);
      const flick = Math.sin(time*40 + p.x*0.1) * 1;
      // tail
      ctx.fillStyle = shade(p.color, -30);
      px(ctx, -size*1.6, -size*0.5+flick, size*1.4, size, "rgba(255,80,0,0.4)");
      // outer flame
      ctx.fillStyle = p.color;
      px(ctx, -size*0.8, -size*0.7, size*1.6, size*1.4, p.color);
      // mid
      px(ctx, -size*0.5, -size*0.5, size, size, shade(p.color, 35));
      // hot core
      px(ctx, -size*0.2, -size*0.3, size*0.6, size*0.6, "#fff5cc");
      // top flame tip
      px(ctx, size*0.3, -size*0.6, size*0.4, size*0.4, "#ffdd55");
      break;
    }
    case "water": {
      // Teardrop bullet pointing forward, with droplet tail
      ctx.rotate(angle);
      px(ctx, -size*1.4, -size*0.3, size*0.6, size*0.6, "rgba(150,220,255,0.4)");
      px(ctx, -size, -size*0.5, size*1.4, size, p.color);
      px(ctx, -size, -size*0.5, size*1.4, size*0.3, shade(p.color, 50));
      // pointed tip
      px(ctx, size*0.4, -size*0.3, size*0.7, size*0.6, p.color);
      px(ctx, size*0.4, -size*0.3, size*0.7, size*0.2, shade(p.color, 60));
      // bright droplet
      px(ctx, -size*0.3, -size*0.2, size*0.5, size*0.4, "#ffffff");
      break;
    }
    case "electric": {
      // Lightning bolt zigzag oriented along direction
      ctx.rotate(angle);
      // glowing aura
      ctx.fillStyle = "rgba(255,240,100,0.3)";
      ctx.beginPath();
      ctx.arc(0, 0, size*1.4, 0, Math.PI*2);
      ctx.fill();
      // zigzag
      ctx.fillStyle = p.color;
      px(ctx, -size*1.2, -size*0.3, size*0.5, size*0.6, p.color);
      px(ctx, -size*0.7, -size*0.6, size*0.5, size*0.6, p.color);
      px(ctx, -size*0.3, -size*0.1, size*0.6, size*0.6, shade(p.color, 30));
      px(ctx,  size*0.3, -size*0.6, size*0.5, size*0.6, p.color);
      px(ctx,  size*0.7, -size*0.2, size*0.5, size*0.5, shade(p.color, 40));
      // bright core
      px(ctx, -size*0.2, -size*0.2, size*0.5, size*0.4, "#ffffff");
      break;
    }
    case "grass": {
      // Spinning leaf
      ctx.rotate(time*9 + angle);
      // leaf body (oval-ish)
      px(ctx, -size, -size*0.4, size*2, size*0.8, p.color);
      px(ctx, -size*0.8, -size*0.3, size*1.6, size*0.3, shade(p.color, 35));  // top half lighter
      px(ctx, -size*0.8,  size*0.1, size*1.6, size*0.3, shade(p.color,-25));  // bottom darker
      // veins
      px(ctx, -size*0.7,  0, size*1.4, 1, shade(p.color,-50));
      // leaf tip
      px(ctx, size, -size*0.2, size*0.5, size*0.4, shade(p.color, 50));
      break;
    }
    case "dark": {
      // Crescent shadow blade
      ctx.rotate(angle + Math.sin(time*8)*0.2);
      // outer crescent (bigger circle)
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, size*1.3, 0, Math.PI*2);
      ctx.fill();
      // cut out front (transparent oval)
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(size*0.7, 0, size*1.1, 0, Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      // bright edge
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(-size*0.4, 0, size*0.3, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    }
    case "psychic": {
      // 4-point crystal shard, slowly rotating
      ctx.rotate(time*4 + angle);
      // outer diamond
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(size*1.3, 0);
      ctx.lineTo(0, size*0.9);
      ctx.lineTo(-size*1.3, 0);
      ctx.lineTo(0, -size*0.9);
      ctx.closePath();
      ctx.fill();
      // inner highlight diamond
      ctx.fillStyle = shade(p.color, 50);
      ctx.beginPath();
      ctx.moveTo(size*0.7, 0);
      ctx.lineTo(0, size*0.5);
      ctx.lineTo(-size*0.7, 0);
      ctx.lineTo(0, -size*0.5);
      ctx.closePath();
      ctx.fill();
      // sparkle dot
      px(ctx, -size*0.15, -size*0.15, size*0.3, size*0.3, "#ffffff");
      // tiny sparkles
      px(ctx, size*0.9, 0, 1.5, 1.5, "#ffffff");
      px(ctx, -size*0.9, 0, 1.5, 1.5, "#ffffff");
      break;
    }
    default: {
      // Generic energy bullet — round with halo and trail
      // trail
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(-p.vx*0.04, -p.vy*0.04, size*0.7, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
      // outer
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI*2);
      ctx.fill();
      // mid
      ctx.fillStyle = shade(p.color, 40);
      ctx.beginPath();
      ctx.arc(0, 0, size*0.6, 0, Math.PI*2);
      ctx.fill();
      // core
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(0, 0, size*0.3, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
}

// ── Burst (melee impact) sprites ─────────────────────────────────────────────

function drawBurst(ctx: CanvasRenderingContext2D, b: BurstEntity, time: number) {
  const t = 1 - b.life / b.maxLife;       // 0 → 1 progression
  const alpha = Math.max(0, 1 - t);
  const r = b.radius * (0.4 + t * 0.7);    // expand outward
  ctx.save();
  ctx.translate(Math.round(b.x), Math.round(b.y));
  ctx.shadowBlur = 22;
  ctx.shadowColor = b.color;
  ctx.globalAlpha = alpha;

  if (b.kind === "slash") {
    // Diagonal blade arc
    ctx.rotate(b.angle);
    ctx.lineWidth = 5 + r * 0.05;
    ctx.strokeStyle = b.color;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.9, -Math.PI*0.45, Math.PI*0.45);
    ctx.stroke();
    // bright inner edge
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.globalAlpha = alpha * 0.9;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.9, -Math.PI*0.4, Math.PI*0.4);
    ctx.stroke();
    // sparks
    for (let i=0; i<3; i++) {
      const a = -Math.PI*0.4 + i*Math.PI*0.4;
      px(ctx, Math.cos(a)*r*0.95-1.5, Math.sin(a)*r*0.95-1.5, 3, 3, "#ffffff");
    }
  } else if (b.kind === "shockwave") {
    // Electric ring with crackle spokes
    ctx.lineWidth = 4;
    ctx.strokeStyle = b.color;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.stroke();
    // spokes
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.globalAlpha = alpha * 0.7;
    for (let i=0; i<8; i++) {
      const a = (i/8)*Math.PI*2 + time*2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a)*r*0.8, Math.sin(a)*r*0.8);
      ctx.lineTo(Math.cos(a)*r*1.05, Math.sin(a)*r*1.05);
      ctx.stroke();
    }
  } else if (b.kind === "fan") {
    // wide fan slash
    ctx.rotate(b.angle);
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, -Math.PI*0.6, Math.PI*0.6);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = alpha * 0.5;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r*0.7, -Math.PI*0.5, Math.PI*0.5);
    ctx.closePath();
    ctx.fill();
  } else {
    // ring (default) — expanding hollow ring with bright inner
    ctx.lineWidth = 6;
    ctx.strokeStyle = b.color;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI*2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.globalAlpha = alpha * 0.7;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.92, 0, Math.PI*2);
    ctx.stroke();
    // inner soft glow
    ctx.globalAlpha = alpha * 0.18;
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.restore();
}
