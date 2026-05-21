import { playSound } from "./audioManager";

export interface VisualEffect {
  type: "neon" | "glitch" | "scanline" | "particle" | "glow";
  color: string;
  duration: number;
  intensity: number;
}

export interface AudioEffect {
  type: "cyber_ambient" | "glitch" | "neon_hum" | "mechanical" | "digital";
  volume: number;
  loop: boolean;
}

export const CYBERPUNK_COLORS = {
  neonBlue: "#00ffff",
  neonPink: "#ff00ff", 
  neonGreen: "#00ff00",
  neonYellow: "#ffff00",
  neonPurple: "#9d00ff",
  darkBackground: "#0a0a0f",
  gridLines: "#1a1a2e",
  terminalGreen: "#33ff33"
};

export function applyCyberpunkVisualEffect(
  ctx: CanvasRenderingContext2D,
  effect: VisualEffect,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  switch (effect.type) {
    case "neon":
      applyNeonEffect(ctx, x, y, width, height, effect.color, effect.intensity);
      break;
    case "glitch":
      applyGlitchEffect(ctx, x, y, width, height, effect.intensity);
      break;
    case "scanline":
      applyScanlineEffect(ctx, x, y, width, height, effect.intensity);
      break;
    case "particle":
      applyParticleEffect(ctx, x, y, width, height, effect.color, effect.intensity);
      break;
    case "glow":
      applyGlowEffect(ctx, x, y, width, height, effect.color, effect.intensity);
      break;
  }
}

function applyNeonEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  intensity: number
): void {
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.5, adjustColorBrightness(color, 50));
  gradient.addColorStop(1, color);
  
  ctx.fillStyle = gradient;
  ctx.globalAlpha = intensity * 0.3;
  ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
  ctx.globalAlpha = 1.0;
  
  // Add neon border
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
}

function applyGlitchEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  intensity: number
): void {
  const glitchCount = Math.floor(intensity * 10);
  
  for (let i = 0; i < glitchCount; i++) {
    const glitchX = x + Math.random() * width;
    const glitchY = y + Math.random() * height;
    const glitchWidth = Math.random() * 20 + 5;
    const glitchHeight = Math.random() * 5 + 2;
    
    ctx.fillStyle = Math.random() > 0.5 ? "#ff0000" : "#00ffff";
    ctx.globalAlpha = Math.random() * intensity;
    ctx.fillRect(glitchX, glitchY, glitchWidth, glitchHeight);
  }
  
  ctx.globalAlpha = 1.0;
}

function applyScanlineEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  intensity: number
): void {
  ctx.fillStyle = "#000000";
  ctx.globalAlpha = intensity * 0.1;
  
  for (let i = 0; i < height; i += 4) {
    ctx.fillRect(x, y + i, width, 1);
  }
  
  ctx.globalAlpha = 1.0;
}

function applyParticleEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  intensity: number
): void {
  const particleCount = Math.floor(intensity * 20);
  
  for (let i = 0; i < particleCount; i++) {
    const particleX = x + Math.random() * width;
    const particleY = y + Math.random() * height;
    const particleSize = Math.random() * 3 + 1;
    
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.random() * intensity;
    ctx.beginPath();
    ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.globalAlpha = 1.0;
}

function applyGlowEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  intensity: number
): void {
  const gradient = ctx.createRadialGradient(
    x + width / 2, y + height / 2, 0,
    x + width / 2, y + height / 2, Math.max(width, height)
  );
  
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "transparent");
  
  ctx.fillStyle = gradient;
  ctx.globalAlpha = intensity * 0.4;
  ctx.fillRect(x - 10, y - 10, width + 20, height + 20);
  ctx.globalAlpha = 1.0;
}

function adjustColorBrightness(color: string, amount: number): string {
  const hex = color.replace("#", "");
  const r = Math.min(255, Math.max(0, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.substring(4, 6), 16) + amount));
  
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Audio effect functions
export function playCyberpunkAmbient(): void {
  // Play cyberpunk ambient sound
  playSound("cyber_ambient", 0.3);
}

export function playGlitchSound(): void {
  playSound("glitch", 0.5);
}

export function playNeonHum(): void {
  playSound("neon_hum", 0.2);
}

export function playMechanicalSound(): void {
  playSound("mechanical", 0.4);
}

export function playDigitalSound(): void {
  playSound("digital", 0.3);
}

// Screen shake effect for impact
export function applyScreenShake(
  ctx: CanvasRenderingContext2D,
  intensity: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  const shakeX = (Math.random() - 0.5) * intensity;
  const shakeY = (Math.random() - 0.5) * intensity;
  
  ctx.save();
  ctx.translate(shakeX, shakeY);
  ctx.restore();
}

// Hologram effect for UI elements
export function applyHologramEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  color: string = CYBERPUNK_COLORS.neonBlue
): void {
  // Background glow
  const gradient = ctx.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, `${color}20`);
  gradient.addColorStop(0.5, `${color}40`);
  gradient.addColorStop(1, `${color}20`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
  
  // Border
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
  
  // Scanline effect
  ctx.fillStyle = "#000000";
  ctx.globalAlpha = 0.3;
  for (let i = y; i < y + height; i += 3) {
    ctx.fillRect(x, i, width, 1);
  }
  ctx.globalAlpha = 1.0;
  
  // Text with glow
  ctx.font = "14px monospace";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Text glow effect
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillText(text, x + width / 2, y + height / 2);
  ctx.shadowBlur = 0;
}

// Grid background for cyberpunk aesthetic
export function drawCyberpunkGrid(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  scrollY: number
): void {
  const gridSize = 40;
  const perspective = 0.8;
  
  ctx.strokeStyle = CYBERPUNK_COLORS.gridLines;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  
  // Vertical lines with perspective
  for (let x = 0; x <= canvasWidth; x += gridSize) {
    const perspectiveX = canvasWidth / 2 + (x - canvasWidth / 2) * perspective;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(perspectiveX, canvasHeight);
    ctx.stroke();
  }
  
  // Horizontal lines with scroll
  for (let y = -scrollY % gridSize; y < canvasHeight; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1.0;
}
