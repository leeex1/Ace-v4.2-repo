import { useEffect, useState } from "react";

interface DamageNumberProps {
  value: number;
  x: number;
  y: number;
  isCritical?: boolean;
  isHeal?: boolean;
  onComplete?: () => void;
}

export function DamageNumber({ value, x, y, isCritical, isHeal, onComplete }: DamageNumberProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (p >= 1) {
        onComplete?.();
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  const color = isHeal ? "#00ff88" : isCritical ? "#ff4444" : "#ffffff";
  const scale = isCritical ? 1.5 : 1;
  const offsetY = -progress * 80;
  const opacity = 1 - Math.pow(progress, 2);
  const shakeX = isCritical ? Math.sin(progress * Math.PI * 8) * 5 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, ${offsetY}px) scale(${scale}) translateX(${shakeX}px)`,
        opacity,
        pointerEvents: "none",
        zIndex: 100,
        fontFamily: '"Press Start 2P", monospace',
        fontWeight: "bold",
        fontSize: isCritical ? 32 : 24,
        color,
        textShadow: `
          0 0 10px ${color}80,
          0 0 20px ${color}60,
          0 0 30px ${color}40,
          -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000
        `,
        transition: "none",
      }}
    >
      {isHeal ? "+" : "-"}{value}
      {isCritical && (
        <div
          style={{
            fontSize: 12,
            color: "#ff8800",
            textAlign: "center",
            marginTop: 4,
            textShadow: "0 0 10px #ff8800",
          }}
        >
          CRITICAL!
        </div>
      )}
    </div>
  );
}
