import { useEffect, useRef, useState } from "react";

type ElementType = "fire" | "water" | "grass" | "electric" | "psychic" | "dark" | "normal" | "ice" | "steel";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface ElementalEffectsProps {
  element: ElementType;
  x: number;
  y: number;
  intensity?: "low" | "medium" | "high";
  isActive?: boolean;
}

export function ElementalEffects({ 
  element, 
  x, 
  y, 
  intensity = "medium",
  isActive = true 
}: ElementalEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const idCounter = useRef(0);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const getElementColors = (el: ElementType): string[] => {
    const colors: Record<ElementType, string[]> = {
      fire: ["#ff6b35", "#f7c59f", "#ffaa00", "#ff4444"],
      water: ["#4ecdc4", "#a8e6cf", "#7fcdcd", "#5dade2"],
      grass: ["#95e277", "#c7f2b2", "#7ed321", "#5cb85c"],
      electric: ["#ffe66d", "#fff8dc", "#ffd700", "#ffeb3b"],
      psychic: ["#c77dff", "#e0b0ff", "#da70d6", "#dda0dd"],
      dark: ["#9b30c8", "#4a0080", "#6a0dad", "#8b008b"],
      normal: ["#aaaaaa", "#dddddd", "#999999", "#cccccc"],
      ice: ["#b8e6e6", "#e0ffff", "#afeeee", "#87ceeb"],
      steel: ["#b8b8d1", "#d3d3e7", "#a9a9b8", "#c0c0d4"],
    };
    return colors[el] || colors.normal;
  };

  const spawnParticles = () => {
    if (!isActiveRef.current) return;
    
    const spawnCount = intensity === "high" ? 3 : intensity === "medium" ? 2 : 1;
    const colors = getElementColors(element);
    
    for (let i = 0; i < spawnCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      
      particlesRef.current.push({
        id: idCounter.current++,
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        maxLife: 30 + Math.random() * 30,
        size: 3 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = getElementColors(element);
    let frameCount = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Spawn new particles
      if (frameCount % (intensity === "high" ? 2 : intensity === "medium" ? 3 : 5) === 0) {
        spawnParticles();
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.rotation += p.rotationSpeed;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) return false;

        const alpha = p.life;
        const color = colors[Math.floor(Math.random() * colors.length)];

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;

        // Draw particle based on element
        switch (element) {
          case "fire":
            // Fire spark
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowColor = color;
            ctx.shadowBlur = p.size * 2;
            break;

          case "water":
            // Water drop
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = alpha * 0.5;
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1;
            ctx.stroke();
            break;

          case "grass":
            // Leaf shape
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.4, p.size, p.rotation, 0, Math.PI * 2);
            ctx.fill();
            break;

          case "electric":
            // Lightning bolt
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(-p.size, -p.size);
            ctx.lineTo(0, 0);
            ctx.lineTo(p.size, -p.size);
            ctx.lineTo(0, p.size);
            ctx.stroke();
            break;

          case "psychic":
            // Star/orb
            const spikes = 5;
            ctx.fillStyle = color;
            ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
              const r = i % 2 === 0 ? p.size : p.size * 0.4;
              const a = (i / (spikes * 2)) * Math.PI * 2;
              const px = Math.cos(a) * r;
              const py = Math.sin(a) * r;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            break;

          default:
            // Default orb
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
        return true;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [element, x, y, intensity]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      style={{
        position: "absolute",
        left: x - 200,
        top: y - 200,
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}

// Impact burst effect for attacks
interface ImpactBurstProps {
  x: number;
  y: number;
  color?: string;
  onComplete?: () => void;
}

export function ImpactBurst({ x, y, color = "#ff6b35", onComplete }: ImpactBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let progress = 0;
    const duration = 30;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      progress++;

      if (progress >= duration) {
        setIsActive(false);
        onComplete?.();
        return;
      }

      const p = progress / duration;
      const size = p * 100;
      const alpha = 1 - p;

      // Draw expanding ring
      ctx.strokeStyle = color;
      ctx.lineWidth = 3 * (1 - p);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, size, 0, Math.PI * 2);
      ctx.stroke();

      // Draw star burst
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(p * Math.PI);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r1 = size * 0.5;
        const r2 = size;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
        ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();

      // Draw particles
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const dist = size * 0.8;
        const px = canvas.width / 2 + Math.cos(angle) * dist;
        const py = canvas.height / 2 + Math.sin(angle) * dist;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, 3 * (1 - p), 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [color, onComplete]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      style={{
        position: "absolute",
        left: x - 150,
        top: y - 150,
        pointerEvents: "none",
        zIndex: 100,
      }}
    />
  );
}
