import { useEffect, useRef, useState } from "react";

interface ScreenShakeProps {
  shake: boolean;
  intensity?: number;
  duration?: number;
  onComplete?: () => void;
  children: React.ReactNode;
}

export function ScreenShake({ 
  shake, 
  intensity = 10, 
  duration = 500, 
  onComplete,
  children 
}: ScreenShakeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!shake || !containerRef.current) return;

    setIsShaking(true);
    const container = containerRef.current;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        container.style.transform = "translate(0, 0)";
        setIsShaking(false);
        onComplete?.();
        return;
      }

      // Decay intensity over time
      const currentIntensity = intensity * (1 - progress);
      const x = (Math.random() - 0.5) * 2 * currentIntensity;
      const y = (Math.random() - 0.5) * 2 * currentIntensity;
      const rotation = (Math.random() - 0.5) * currentIntensity * 0.5;

      container.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [shake, intensity, duration, onComplete]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        transform: "translate(0, 0)",
        transition: isShaking ? "none" : "transform 0.1s ease-out"
      }}
    >
      {children}
    </div>
  );
}

// Floating damage numbers component
interface FloatingNumberProps {
  value: number;
  x: number;
  y: number;
  type: "damage" | "heal" | "critical";
  onComplete?: () => void;
}

export function FloatingNumber({ value, x, y, type, onComplete }: FloatingNumberProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();

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
  }, [onComplete]);

  const colors = {
    damage: "#ff3333",
    heal: "#33ff33",
    critical: "#ffaa00"
  };

  const fontSize = type === "critical" ? 48 : 32;
  const yOffset = -progress * 80;
  const opacity = 1 - progress;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + yOffset,
        transform: "translate(-50%, -50%)",
        fontSize: `${fontSize}px`,
        fontWeight: "bold",
        color: colors[type],
        textShadow: `0 0 10px ${colors[type]}88, 0 0 20px ${colors[type]}44`,
        opacity,
        pointerEvents: "none",
        zIndex: 100,
        fontFamily: '"Press Start 2P", monospace'
      }}
    >
      {type === "critical" ? "CRIT! " : "+"}{value}
    </div>
  );
}

// Flash effect for impacts
interface FlashProps {
  active: boolean;
  color?: string;
  duration?: number;
  onComplete?: () => void;
}

export function Flash({ active, color = "#ff0000", duration = 200, onComplete }: FlashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();

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
  }, [active, duration, onComplete]);

  if (!active && progress === 0) return null;

  const flashIntensity = Math.sin(progress * Math.PI) * 0.6;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: color,
        opacity: flashIntensity,
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "overlay"
      }}
    />
  );
}

// Impact frame effect (like fighting games)
interface ImpactFrameProps {
  active: boolean;
  onComplete?: () => void;
}

export function ImpactFrame({ active, onComplete }: ImpactFrameProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!active) return;

    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 100);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000",
        opacity: 0.3,
        pointerEvents: "none",
        zIndex: 9998,
        mixBlendMode: "multiply"
      }}
    />
  );
}
