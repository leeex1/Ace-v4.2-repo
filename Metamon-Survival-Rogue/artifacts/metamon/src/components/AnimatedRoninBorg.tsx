import { useEffect, useRef, useState } from "react";
import type { RoninBorg, RoninBorgPart } from "../game/roninBorgDatabase";
import { RONIN_BORG_PARTS, RONIN_BORG_SPECIES } from "../game/roninBorgDatabase";
import { useSpriteSheet, getFrame } from "../hooks/useSpriteSheet";
import { getMechaFigure } from "../game/spriteCache";

type AnimationState = "idle" | "attack" | "hit" | "victory" | "defeat";

interface PartConfig {
  id: string;
  type: "head" | "body" | "leftArm" | "rightArm" | "leftLeg" | "rightLeg" | "tail" | "weapon";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  glowColor?: string;
}

interface AnimatedRoninBorgProps {
  roninBorg: RoninBorg | null;
  size?: "small" | "medium" | "large";
  animation?: AnimationState;
  isEnemy?: boolean;
  onClick?: () => void;
  className?: string;
}

// Part positions relative to center (for medium size)
const PART_LAYOUTS: Record<string, PartConfig> = {
  head: { id: "head", type: "head", x: 0, y: -60, width: 50, height: 45, color: "#4a90d9" },
  body: { id: "body", type: "body", x: 0, y: 0, width: 60, height: 70, color: "#6b7280" },
  leftArm: { id: "leftArm", type: "leftArm", x: -45, y: -10, width: 25, height: 50, color: "#6b7280" },
  rightArm: { id: "rightArm", type: "rightArm", x: 45, y: -10, width: 25, height: 50, color: "#6b7280" },
  leftLeg: { id: "leftLeg", type: "leftLeg", x: -20, y: 50, width: 20, height: 45, color: "#4a5568" },
  rightLeg: { id: "rightLeg", type: "rightLeg", x: 20, y: 50, width: 20, height: 45, color: "#4a5568" },
  tail: { id: "tail", type: "tail", x: -35, y: 20, width: 30, height: 40, color: "#4a90d9" },
  weapon: { id: "weapon", type: "weapon", x: 55, y: 5, width: 35, height: 60, color: "#fbbf24" },
};

// Element colors for glow effects
const ELEMENT_COLORS: Record<string, { primary: string; glow: string; secondary: string }> = {
  electric: { primary: "#ffff00", glow: "#ffd700", secondary: "#00ffff" },
  water: { primary: "#00bfff", glow: "#1e90ff", secondary: "#0080ff" },
  fire: { primary: "#ff4500", glow: "#ff6347", secondary: "#ff8c00" },
  grass: { primary: "#32cd32", glow: "#228b22", secondary: "#90ee90" },
  psychic: { primary: "#ff69b4", glow: "#da70d6", secondary: "#dda0dd" },
  dark: { primary: "#4b0082", glow: "#8b008b", secondary: "#9400d3" },
  steel: { primary: "#a8a8a8", glow: "#c0c0c0", secondary: "#708090" },
  normal: { primary: "#a9a9a9", glow: "#808080", secondary: "#d3d3d3" },
};

export function AnimatedRoninBorg({
  roninBorg,
  size = "medium",
  animation = "idle",
  isEnemy = false,
  onClick,
  className = "",
}: AnimatedRoninBorgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number>();

  // Load sprite sheets
  const mixupSheet = useSpriteSheet("mixup");
  const samuraiSheet = useSpriteSheet("samurai");
  const mechaSheet = useSpriteSheet("mecha");
  const medabotSheet = useSpriteSheet("medabot");
  const chatgptSheet = useSpriteSheet("chatgpt_1");

  // Get mecha sprite for this Ronin Borg
  const mechaFigure = roninBorg ? getMechaFigure(roninBorg.speciesId) : null;

  // Size multipliers
  const sizeMult = size === "small" ? 0.6 : size === "large" ? 1.4 : 1;
  const canvasSize = size === "small" ? 120 : size === "large" ? 280 : 200;

  // Get element colors from species
  const species = roninBorg ? RONIN_BORG_SPECIES[roninBorg.speciesId] : null;
  const elementType = species?.baseElement || "normal";
  const colors = ELEMENT_COLORS[elementType] || ELEMENT_COLORS.normal;
  
  // Determine which frame to use based on speciesId
  const frameIndex = roninBorg ? (roninBorg.speciesId % 64) : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !roninBorg) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;

    // Animation loop
    const animate = () => {
      frame = (frame + 1) % 60;
      setCurrentFrame(frame);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Center point
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 20;

      // Choose sprite based on species ID for variety
      let spriteFrame: HTMLCanvasElement | null = null;
      let selectedSheet = mixupSheet;
      
      // Different sprite sheets for different species ranges
      if (roninBorg?.speciesId) {
        if (roninBorg.speciesId <= 5) {
          selectedSheet = samuraiSheet;
          spriteFrame = selectedSheet ? getFrame(selectedSheet, frame % 64) : null;
        } else if (roninBorg.speciesId <= 15) {
          selectedSheet = mixupSheet;
          spriteFrame = selectedSheet ? getFrame(selectedSheet, frame % 16) : null;
        } else if (roninBorg.speciesId <= 25) {
          selectedSheet = mechaSheet;
          spriteFrame = selectedSheet ? getFrame(selectedSheet, frame % 4) : null;
        } else if (roninBorg.speciesId <= 35) {
          selectedSheet = medabotSheet;
          spriteFrame = selectedSheet ? getFrame(selectedSheet, frame % 12) : null;
        } else {
          selectedSheet = chatgptSheet;
          spriteFrame = selectedSheet ? getFrame(selectedSheet, frame % 1) : null;
        }
      }
      
      if (mechaFigure && mechaFigure.complete) {
        // Use the loaded mecha sprite
        drawMechaSprite(ctx, centerX, centerY, sizeMult, animation, frame, mechaFigure, isEnemy);
      } else if (spriteFrame) {
        // Use sliced sprite sheet frame
        drawSlicedSprite(ctx, centerX, centerY, sizeMult, animation, frame, spriteFrame, isEnemy);
      } else {
        // Fallback to procedural drawing
        drawRoninBorg(ctx, centerX, centerY, sizeMult, animation, frame, colors, roninBorg, isEnemy);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [roninBorg, sizeMult, animation, colors, isEnemy, mechaFigure, samuraiSheet, mixupSheet, mechaSheet, medabotSheet, chatgptSheet]);

  if (!roninBorg) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-800 rounded-lg ${className}`}
        style={{ width: canvasSize, height: canvasSize }}
      >
        <span className="text-4xl">🤖</span>
      </div>
    );
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="rounded-lg"
        style={{
          imageRendering: "pixelated",
          filter: `
            drop-shadow(0 0 ${size === "large" ? 30 : 15}px ${colors.glow})
            drop-shadow(0 0 ${size === "large" ? 60 : 30}px ${colors.primary}40)
            brightness(${animation === "attack" ? "1.3" : "1.0"})
          `,
          transition: "filter 0.2s ease-out",
          transform: animation === "hit" ? "translateX(5px)" : "translateX(0)",
        }}
      />
      
      {/* Glow effect overlay */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${colors.glow}20 0%, transparent 70%)`,
          animation: "pulse 2s ease-in-out infinite",
        }}
      />

      {/* Evolution stage badge */}
      <div
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: colors.primary,
          color: "#000",
          boxShadow: `0 0 10px ${colors.glow}`,
        }}
      >
        {roninBorg.evolutionStage}
      </div>
    </div>
  );
}

function drawRoninBorg(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  sizeMult: number,
  animation: AnimationState,
  frame: number,
  colors: { primary: string; glow: string; secondary: string },
  roninBorg: RoninBorg,
  isEnemy: boolean
) {
  const time = frame / 60;
  
  // Animation offsets
  let offsetY = 0;
  let attackOffset = 0;
  let hitShake = 0;

  switch (animation) {
    case "idle":
      offsetY = Math.sin(time * Math.PI * 2) * 3 * sizeMult;
      break;
    case "attack":
      attackOffset = Math.sin(time * Math.PI * 4) * 15 * sizeMult;
      break;
    case "hit":
      hitShake = Math.sin(time * Math.PI * 8) * 5 * sizeMult;
      break;
    case "victory":
      offsetY = Math.sin(time * Math.PI * 3) * 8 * sizeMult;
      break;
    case "defeat":
      offsetY = 10 * sizeMult;
      break;
  }

  const totalOffsetY = centerY + offsetY + (isEnemy ? 0 : 0);
  const totalOffsetX = centerX + hitShake;

  // Draw shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(
    totalOffsetX,
    totalOffsetY + 70 * sizeMult,
    40 * sizeMult,
    10 * sizeMult,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Get parts from Ronin Borg
  const parts = roninBorg.parts;

  // Draw order: tail → legs → body → arms → head → weapon
  const drawOrder = ["tail", "leftLeg", "rightLeg", "body", "leftArm", "rightArm", "head", "weapon"];

  drawOrder.forEach((partType) => {
    const partId = parts[partType as keyof typeof parts];
    if (!partId) return;

    const part = RONIN_BORG_PARTS[partId];
    if (!part) return;

    const layout = PART_LAYOUTS[partType];
    if (!layout) return;

    // Calculate position with animation
    let partX = totalOffsetX + layout.x * sizeMult;
    let partY = totalOffsetY + layout.y * sizeMult;

    // Special animation for arms during attack
    if (animation === "attack" && (partType === "leftArm" || partType === "weapon")) {
      partX += attackOffset;
      partY -= Math.abs(attackOffset) * 0.5;
    }

    // Draw the part
    drawPart(ctx, partX, partY, layout.width * sizeMult, layout.height * sizeMult, partType, colors, part.rarity);
  });
}

function drawPart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  partType: string,
  colors: { primary: string; glow: string; secondary: string },
  rarity: string
) {
  ctx.save();

  // Rarity color
  const rarityColors: Record<string, string> = {
    common: "#9ca3af",
    uncommon: "#22c55e",
    rare: "#3b82f6",
    ultra_rare: "#06b6d4",
    super_rare: "#a855f7",
    mega_rare: "#ec4899",
    legendary: "#fbbf24",
  };
  const rarityColor = rarityColors[rarity] || rarityColors.common;

  // Part-specific drawing
  switch (partType) {
    case "head":
      drawHead(ctx, x, y, width, height, colors, rarityColor);
      break;
    case "body":
      drawBody(ctx, x, y, width, height, colors, rarityColor);
      break;
    case "leftArm":
    case "rightArm":
      drawArm(ctx, x, y, width, height, colors, rarityColor, partType === "leftArm");
      break;
    case "leftLeg":
    case "rightLeg":
      drawLeg(ctx, x, y, width, height, colors, rarityColor);
      break;
    case "tail":
      drawTail(ctx, x, y, width, height, colors, rarityColor);
      break;
    case "weapon":
      drawWeapon(ctx, x, y, width, height, colors, rarityColor);
      break;
  }

  ctx.restore();
}

function drawHead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colors: { primary: string; glow: string; secondary: string },
  rarityColor: string
) {
  // Main head shape
  const gradient = ctx.createLinearGradient(x - width / 2, y - height / 2, x + width / 2, y + height / 2);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(0.5, colors.secondary);
  gradient.addColorStop(1, colors.primary);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y - height / 2, width, height, 8);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#00ffff";
  ctx.shadowColor = "#00ffff";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(x - width / 4, y - height / 6, 4, 0, Math.PI * 2);
  ctx.arc(x + width / 4, y - height / 6, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Rarity accent
  ctx.strokeStyle = rarityColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Head crest
  ctx.fillStyle = colors.glow;
  ctx.beginPath();
  ctx.moveTo(x, y - height / 2 - 5);
  ctx.lineTo(x - 8, y - height / 2 + 5);
  ctx.lineTo(x + 8, y - height / 2 + 5);
  ctx.closePath();
  ctx.fill();
}

function drawBody(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colors: { primary: string; glow: string; secondary: string },
  rarityColor: string
) {
  const gradient = ctx.createLinearGradient(x - width / 2, y - height / 2, x + width / 2, y + height / 2);
  gradient.addColorStop(0, colors.secondary);
  gradient.addColorStop(0.5, "#4a5568");
  gradient.addColorStop(1, colors.secondary);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y - height / 2, width, height, 10);
  ctx.fill();

  // Chest core
  ctx.fillStyle = colors.primary;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(x, y - 5, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Panel lines
  ctx.strokeStyle = rarityColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - width / 3, y - height / 4);
  ctx.lineTo(x + width / 3, y - height / 4);
  ctx.moveTo(x - width / 3, y + height / 4);
  ctx.lineTo(x + width / 3, y + height / 4);
  ctx.stroke();

  // Border
  ctx.strokeStyle = rarityColor;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawArm(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colors: { primary: string; glow: string; secondary: string },
  rarityColor: string,
  isLeft: boolean
) {
  const gradient = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y + height);
  gradient.addColorStop(0, colors.secondary);
  gradient.addColorStop(1, colors.primary);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y - height / 2, width, height, 6);
  ctx.fill();

  // Shoulder joint
  ctx.fillStyle = rarityColor;
  ctx.beginPath();
  ctx.arc(x, y - height / 2 + 5, 6, 0, Math.PI * 2);
  ctx.fill();

  // Hand
  ctx.fillStyle = colors.glow;
  ctx.beginPath();
  ctx.arc(x, y + height / 2, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = rarityColor;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawLeg(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colors: { primary: string; glow: string; secondary: string },
  rarityColor: string
) {
  const gradient = ctx.createLinearGradient(x, y - height / 2, x, y + height / 2);
  gradient.addColorStop(0, colors.secondary);
  gradient.addColorStop(0.5, "#2d3748");
  gradient.addColorStop(1, colors.secondary);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y - height / 2, width, height, 5);
  ctx.fill();

  // Knee joint
  ctx.fillStyle = rarityColor;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();

  // Foot
  ctx.fillStyle = colors.glow;
  ctx.fillRect(x - width / 2 - 2, y + height / 2 - 3, width + 4, 6);

  ctx.strokeStyle = rarityColor;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawTail(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colors: { primary: string; glow: string; secondary: string },
  rarityColor: string
) {
  const gradient = ctx.createLinearGradient(x - width, y, x, y + height);
  gradient.addColorStop(0, colors.glow);
  gradient.addColorStop(0.5, colors.primary);
  gradient.addColorStop(1, colors.secondary);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  
  // Segmented tail
  for (let i = 0; i < 4; i++) {
    const segX = x - (width / 4) * i;
    const segY = y + (height / 4) * i;
    const segSize = 8 - i;
    ctx.moveTo(segX, segY);
    ctx.arc(segX, segY, segSize, 0, Math.PI * 2);
  }
  ctx.fill();

  // Tail tip glow
  ctx.fillStyle = colors.primary;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(x - width + 5, y + height - 5, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = rarityColor;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawWeapon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colors: { primary: string; glow: string; secondary: string },
  rarityColor: string
) {
  // Weapon handle
  ctx.fillStyle = "#4a5568";
  ctx.fillRect(x - 4, y - height / 2, 8, height / 2);

  // Weapon blade/head
  const gradient = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y - height / 2);
  gradient.addColorStop(0, colors.glow);
  gradient.addColorStop(0.5, colors.primary);
  gradient.addColorStop(1, "#ffffff");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(x, y - height / 2);
  ctx.lineTo(x + width / 2, y - height / 3);
  ctx.lineTo(x + width / 3, y);
  ctx.lineTo(x - width / 3, y);
  ctx.lineTo(x - width / 2, y - height / 3);
  ctx.closePath();
  ctx.fill();

  // Energy glow
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 2;
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 15;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Rarity gem
  ctx.fillStyle = rarityColor;
  ctx.beginPath();
  ctx.arc(x, y - height / 3, 3, 0, Math.PI * 2);
  ctx.fill();
}

// Draw using loaded mecha sprite image
function drawMechaSprite(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  sizeMult: number,
  animation: AnimationState,
  frame: number,
  mechaFigure: HTMLImageElement,
  isEnemy: boolean
) {
  const time = frame / 60;
  
  // Animation offsets
  let offsetY = 0;
  let scale = 1;
  
  switch (animation) {
    case "idle":
      offsetY = Math.sin(time * Math.PI * 2) * 3 * sizeMult;
      break;
    case "attack":
      offsetY = -Math.sin(time * Math.PI * 4) * 10 * sizeMult;
      scale = 1 + Math.sin(time * Math.PI * 4) * 0.1;
      break;
    case "hit":
      offsetY = Math.sin(time * Math.PI * 8) * 5 * sizeMult;
      break;
    case "victory":
      offsetY = Math.sin(time * Math.PI * 3) * 8 * sizeMult;
      break;
  }

  const size = 80 * sizeMult * scale;
  const x = centerX - size / 2;
  const y = centerY - size / 2 + offsetY;

  // Draw shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 50 * sizeMult, 30 * sizeMult, 8 * sizeMult, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw sprite with screen blend for transparency effect
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  
  if (isEnemy) {
    // Flip horizontally for enemy
    ctx.translate(centerX * 2, 0);
    ctx.scale(-1, 1);
  }
  
  ctx.drawImage(mechaFigure, x, y, size, size);
  ctx.restore();
}

// Draw using sliced sprite sheet canvas
function drawSlicedSprite(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  sizeMult: number,
  animation: AnimationState,
  frame: number,
  spriteFrame: HTMLCanvasElement,
  isEnemy: boolean
) {
  const time = frame / 60;
  
  // Animation offsets
  let offsetY = 0;
  let rotation = 0;
  
  switch (animation) {
    case "idle":
      offsetY = Math.sin(time * Math.PI * 2) * 3 * sizeMult;
      break;
    case "attack":
      offsetY = -Math.sin(time * Math.PI * 4) * 10 * sizeMult;
      rotation = Math.sin(time * Math.PI * 4) * 0.1;
      break;
    case "hit":
      offsetY = Math.sin(time * Math.PI * 8) * 5 * sizeMult;
      break;
    case "victory":
      offsetY = Math.sin(time * Math.PI * 3) * 8 * sizeMult;
      break;
  }

  const size = 100 * sizeMult;
  const x = centerX - size / 2;
  const y = centerY - size / 2 + offsetY;

  // Draw shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 50 * sizeMult, 30 * sizeMult, 8 * sizeMult, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw sliced sprite with glow effect
  ctx.save();
  
  // Add glow for attack animation
  if (animation === "attack") {
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 30;
  }
  
  if (isEnemy) {
    // Flip horizontally for enemy
    ctx.translate(centerX * 2, 0);
    ctx.scale(-1, 1);
  }
  
  ctx.translate(centerX, centerY + offsetY);
  ctx.rotate(rotation);
  ctx.translate(-centerX, -centerY);
  
  // Add screen blend for transparency effect
  if (animation === "attack") {
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.9;
  }
  
  ctx.drawImage(spriteFrame, x, y, size, size);
  
  // Add highlight overlay for victory
  if (animation === "victory") {
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = "rgba(255, 215, 0, 0.3)";
    ctx.fillRect(x, y, size, size);
  }
  
  ctx.restore();
}
