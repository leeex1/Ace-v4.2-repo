import { useEffect, useRef } from "react";

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "spark" | "energy" | "explosion" | "heal" | "damage";
}

interface ParticleEffectsProps {
  particles: Particle[];
  width: number;
  height: number;
}

export function ParticleEffects({ particles, width, height }: ParticleEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(particle => {
        const lifeRatio = particle.life / particle.maxLife;
        
        switch (particle.type) {
          case "spark":
            drawSpark(ctx, particle, lifeRatio);
            break;
          case "energy":
            drawEnergy(ctx, particle, lifeRatio);
            break;
          case "explosion":
            drawExplosion(ctx, particle, lifeRatio);
            break;
          case "heal":
            drawHeal(ctx, particle, lifeRatio);
            break;
          case "damage":
            drawDamage(ctx, particle, lifeRatio);
            break;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [particles, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

function drawSpark(ctx: CanvasRenderingContext2D, particle: Particle, lifeRatio: number) {
  const alpha = 1 - lifeRatio;
  const size = particle.size * (1 - lifeRatio * 0.5);
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = particle.color;
  ctx.shadowColor = particle.color;
  ctx.shadowBlur = 8;
  
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function drawEnergy(ctx: CanvasRenderingContext2D, particle: Particle, lifeRatio: number) {
  const alpha = 1 - lifeRatio;
  const size = particle.size * (1 + Math.sin(lifeRatio * Math.PI * 4) * 0.3);
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "screen";
  
  // Energy orb
  const gradient = ctx.createRadialGradient(
    particle.x, particle.y, 0,
    particle.x, particle.y, size
  );
  gradient.addColorStop(0, particle.color);
  gradient.addColorStop(0.5, particle.color + "88");
  gradient.addColorStop(1, "transparent");
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
  ctx.fill();
  
  // Energy trails
  ctx.strokeStyle = particle.color + "66";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const trailLife = Math.max(0, lifeRatio - i * 0.1);
    const trailAlpha = 1 - trailLife;
    const trailSize = size * (0.8 - i * 0.2);
    
    ctx.globalAlpha = trailAlpha * 0.5;
    ctx.beginPath();
    ctx.arc(
      particle.x - particle.vx * i * 5,
      particle.y - particle.vy * i * 5,
      trailSize,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawExplosion(ctx: CanvasRenderingContext2D, particle: Particle, lifeRatio: number) {
  const alpha = 1 - lifeRatio;
  const size = particle.size * (1 + lifeRatio * 2);
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "screen";
  
  // Explosion shockwave
  ctx.strokeStyle = particle.color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
  ctx.stroke();
  
  // Inner explosion
  const gradient = ctx.createRadialGradient(
    particle.x, particle.y, 0,
    particle.x, particle.y, size * 0.7
  );
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.3, particle.color);
  gradient.addColorStop(1, "transparent");
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, size * 0.7, 0, Math.PI * 2);
  ctx.fill();
  
  // Debris particles
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const distance = size * (0.5 + lifeRatio);
    const debrisX = particle.x + Math.cos(angle) * distance;
    const debrisY = particle.y + Math.sin(angle) * distance;
    const debrisSize = 2 * (1 - lifeRatio);
    
    ctx.fillStyle = particle.color;
    ctx.fillRect(debrisX - debrisSize/2, debrisY - debrisSize/2, debrisSize, debrisSize);
  }
  
  ctx.restore();
}

function drawHeal(ctx: CanvasRenderingContext2D, particle: Particle, lifeRatio: number) {
  const alpha = 1 - lifeRatio;
  const size = particle.size * (1 + Math.sin(lifeRatio * Math.PI * 2) * 0.2);
  
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "screen";
  
  // Heal cross
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(particle.x - size/2, particle.y);
  ctx.lineTo(particle.x + size/2, particle.y);
  ctx.moveTo(particle.x, particle.y - size/2);
  ctx.lineTo(particle.x, particle.y + size/2);
  ctx.stroke();
  
  // Healing glow
  const gradient = ctx.createRadialGradient(
    particle.x, particle.y, 0,
    particle.x, particle.y, size
  );
  gradient.addColorStop(0, "#00ff00");
  gradient.addColorStop(0.5, "#00ff0088");
  gradient.addColorStop(1, "transparent");
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function drawDamage(ctx: CanvasRenderingContext2D, particle: Particle, lifeRatio: number) {
  const alpha = 1 - lifeRatio;
  const size = particle.size * (1 + lifeRatio);
  
  ctx.save();
  ctx.globalAlpha = alpha;
  
  // Damage slash effect
  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  
  for (let i = 0; i < 3; i++) {
    const slashAlpha = alpha * (1 - i * 0.3);
    const slashSize = size * (1 - i * 0.2);
    const offset = i * 10;
    
    ctx.globalAlpha = slashAlpha;
    ctx.beginPath();
    ctx.moveTo(particle.x - slashSize/2 - offset, particle.y - slashSize/2);
    ctx.lineTo(particle.x + slashSize/2 - offset, particle.y + slashSize/2);
    ctx.stroke();
  }
  
  ctx.restore();
}

// Helper function to generate particles
export function createParticles(
  type: Particle["type"],
  x: number,
  y: number,
  count: number,
  color: string = "#ffff00"
): Particle[] {
  const particles: Particle[] = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 30 + Math.random() * 30,
      size: 2 + Math.random() * 4,
      color,
      type
    });
  }
  
  return particles;
}

// Update particle positions
export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      life: particle.life - 1/60,
      vy: particle.vy + 0.2 // gravity
    }))
    .filter(particle => particle.life > 0);
}
