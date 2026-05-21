import { useEffect, useRef, useState } from "react";

interface AnimatedSpriteProps {
  src: string;
  alt?: string;
  size?: number;
  isEnemy?: boolean;
  animation?: "idle" | "attack" | "hit" | "victory" | "defeat";
  elementColor?: string;
  onAnimationComplete?: () => void;
}

export function AnimatedSprite({
  src,
  alt = "",
  size = 140,
  isEnemy = false,
  animation = "idle",
  elementColor = "#00ffff",
  onAnimationComplete,
}: AnimatedSpriteProps) {
  // Simple state for animations
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);
  const [shake, setShake] = useState(0);

  // Idle breathing animation
  useEffect(() => {
    if (animation !== "idle") return;
    
    let frame = 0;
    const animate = () => {
      frame++;
      const y = Math.sin(frame * 0.05) * 3;
      const s = 1 + Math.sin(frame * 0.03) * 0.02;
      setOffsetY(y);
      setScale(s);
    };
    
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [animation]);

  // Attack animation
  useEffect(() => {
    if (animation !== "attack") return;
    
    let phase = 0;
    const direction = isEnemy ? -1 : 1;
    
    const animate = () => {
      phase++;
      const progress = Math.min(phase / 25, 1); // ~400ms
      
      if (progress < 0.5) {
        // Lunge forward
        const t = progress * 2;
        setOffsetY(-t * 15);
        setScale(1 + t * 0.05);
      } else {
        // Return
        const t = (progress - 0.5) * 2;
        setOffsetY(-(1 - t) * 15);
        setScale(1.05 - t * 0.05);
      }
      
      if (progress >= 1) {
        setOffsetY(0);
        setScale(1);
        onAnimationComplete?.();
      }
    };
    
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [animation, isEnemy, onAnimationComplete]);

  // Hit animation
  useEffect(() => {
    if (animation !== "hit") return;
    
    let phase = 0;
    
    const animate = () => {
      phase++;
      const progress = Math.min(phase / 30, 1); // ~500ms
      
      if (progress < 1) {
        setShake(Math.sin(phase * 2) * 5 * (1 - progress));
      } else {
        setShake(0);
        onAnimationComplete?.();
      }
    };
    
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [animation, onAnimationComplete]);

  // Defeat animation
  useEffect(() => {
    if (animation !== "defeat") return;
    
    let phase = 0;
    
    const animate = () => {
      phase++;
      const progress = Math.min(phase / 60, 1); // ~1000ms
      
      setOffsetY(progress * 40);
      setScale(1 - progress * 0.2);
      
      if (progress >= 1) {
        onAnimationComplete?.();
      }
    };
    
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [animation, onAnimationComplete]);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `translate(${shake}px, ${offsetY}px) scale(${scale})`,
        transition: animation === "idle" ? "none" : "transform 0.1s ease-out",
        filter: `drop-shadow(0 0 8px ${elementColor}40)`,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          imageRendering: "pixelated",
        }}
        onError={(e) => {
          console.error("Sprite failed to load:", src);
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}
