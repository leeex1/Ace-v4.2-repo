import { useEffect, useRef, useState } from "react";

interface BattleTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
  type: "battleStart" | "battleEnd" | "victory" | "defeat";
}

export function BattleTransition({ isActive, onComplete, type }: BattleTransitionProps) {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    let startTime = Date.now();
    const duration = type === "battleStart" ? 1500 : 2000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress >= 1) {
        onComplete?.();
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isActive, type, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (!isActive || progress === 0) return;

    // Draw transition effect based on type
    switch (type) {
      case "battleStart":
        drawBattleStartTransition(ctx, width, height, progress);
        break;
      case "battleEnd":
        drawBattleEndTransition(ctx, width, height, progress);
        break;
      case "victory":
        drawVictoryTransition(ctx, width, height, progress);
        break;
      case "defeat":
        drawDefeatTransition(ctx, width, height, progress);
        break;
    }
  }, [progress, type]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="max-w-full max-h-full"
      />
    </div>
  );
}

function drawBattleStartTransition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  // Flash effect
  const flashIntensity = Math.sin(progress * Math.PI) * 0.5 + 0.5;
  ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity * 0.8})`;
  ctx.fillRect(0, 0, width, height);

  // Energy swirl effect
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.max(width, height) * 0.8;
  const radius = maxRadius * progress;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  
  // Multiple rotating energy waves
  for (let i = 0; i < 3; i++) {
    const angle = (progress * Math.PI * 4) + (i * Math.PI * 2 / 3);
    const waveRadius = radius * (1 - i * 0.2);
    
    const gradient = ctx.createRadialGradient(
      centerX + Math.cos(angle) * 50,
      centerY + Math.sin(angle) * 50,
      0,
      centerX + Math.cos(angle) * 50,
      centerY + Math.sin(angle) * 50,
      waveRadius
    );
    
    gradient.addColorStop(0, `rgba(0, 255, 255, ${0.6 - progress * 0.4})`);
    gradient.addColorStop(0.5, `rgba(255, 100, 255, ${0.4 - progress * 0.3})`);
    gradient.addColorStop(1, `rgba(255, 0, 255, ${0.2 - progress * 0.2})`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
      centerX + Math.cos(angle) * 50,
      centerY + Math.sin(angle) * 50,
      waveRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  
  ctx.restore();

  // Battle text
  if (progress > 0.3) {
    const textAlpha = Math.min((progress - 0.3) / 0.7, 1);
    ctx.save();
    ctx.font = 'bold 48px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Text shadow
    ctx.fillStyle = `rgba(0, 0, 0, ${textAlpha * 0.8})`;
    ctx.fillText('BATTLE START!', centerX + 3, centerY + 3);
    
    // Main text with gradient
    const textGradient = ctx.createLinearGradient(0, centerY - 24, 0, centerY + 24);
    textGradient.addColorStop(0, `rgba(255, 100, 100, ${textAlpha})`);
    textGradient.addColorStop(0.5, `rgba(255, 255, 100, ${textAlpha})`);
    textGradient.addColorStop(1, `rgba(255, 100, 255, ${textAlpha})`);
    
    ctx.fillStyle = textGradient;
    ctx.fillText('BATTLE START!', centerX, centerY);
    
    ctx.restore();
  }
}

function drawBattleEndTransition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  // Fade to black
  ctx.fillStyle = `rgba(0, 0, 0, ${progress})`;
  ctx.fillRect(0, 0, width, height);
}

function drawVictoryTransition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  // Golden flash
  const flashIntensity = Math.sin(progress * Math.PI) * 0.3 + 0.7;
  ctx.fillStyle = `rgba(255, 215, 0, ${flashIntensity * 0.9})`;
  ctx.fillRect(0, 0, width, height);

  // Victory star burst
  const centerX = width / 2;
  const centerY = height / 2;
  
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const distance = progress * 200 * (1 + Math.sin(progress * Math.PI * 3) * 0.2);
    const starSize = 3 + progress * 5;
    
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    // Star gradient
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, starSize);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${1 - progress})`);
    gradient.addColorStop(0.5, `rgba(255, 215, 0, ${1 - progress})`);
    gradient.addColorStop(1, `rgba(255, 100, 0, ${0.5 - progress * 0.5})`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, starSize, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Victory text
  if (progress > 0.4) {
    const textAlpha = Math.min((progress - 0.4) / 0.6, 1);
    const textScale = 1 + Math.sin(progress * Math.PI) * 0.2;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(textScale, textScale);
    ctx.font = 'bold 56px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Text glow
    ctx.shadowColor = `rgba(255, 215, 0, ${textAlpha})`;
    ctx.shadowBlur = 20;
    ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
    ctx.fillText('VICTORY!', 0, 0);
    
    ctx.restore();
  }
  
  ctx.restore();
}

function drawDefeatTransition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number
) {
  // Dark fade
  ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.8})`;
  ctx.fillRect(0, 0, width, height);

  // Defeat effect
  const centerX = width / 2;
  const centerY = height / 2;
  
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  
  // Cracking effect
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const crackLength = progress * 150;
    
    ctx.strokeStyle = `rgba(255, 0, 0, ${progress * 0.6})`;
    ctx.lineWidth = 2 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(angle) * crackLength,
      centerY + Math.sin(angle) * crackLength
    );
    ctx.stroke();
  }
  
  // Defeat text
  if (progress > 0.5) {
    const textAlpha = Math.min((progress - 0.5) / 0.5, 1);
    const shakeX = Math.sin(progress * Math.PI * 10) * 3;
    const shakeY = Math.cos(progress * Math.PI * 10) * 3;
    
    ctx.save();
    ctx.translate(centerX + shakeX, centerY + shakeY);
    ctx.font = 'bold 56px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillStyle = `rgba(255, 0, 0, ${textAlpha})`;
    ctx.fillText('DEFEAT', 0, 0);
    
    ctx.restore();
  }
  
  ctx.restore();
}
