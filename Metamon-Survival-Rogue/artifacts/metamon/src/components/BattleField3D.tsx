import { useEffect, useRef, useState } from "react";

interface BattleField3DProps {
  children: React.ReactNode;
  background?: "forest" | "cave" | "city" | "arena";
}

export function BattleField3D({ children, background = "forest" }: BattleField3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setTime(t => t + 0.016);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    switch (background) {
      case "forest":
        skyGradient.addColorStop(0, "#1a1a3e");
        skyGradient.addColorStop(0.5, "#2d2d5a");
        skyGradient.addColorStop(1, "#0d3328");
        break;
      case "cave":
        skyGradient.addColorStop(0, "#0a0a15");
        skyGradient.addColorStop(0.5, "#1a1a2e");
        skyGradient.addColorStop(1, "#2d1f3d");
        break;
      case "city":
        skyGradient.addColorStop(0, "#0f1729");
        skyGradient.addColorStop(0.5, "#1e3a5f");
        skyGradient.addColorStop(1, "#2d1b69");
        break;
      case "arena":
        skyGradient.addColorStop(0, "#1a0a2e");
        skyGradient.addColorStop(0.5, "#3d1f5f");
        skyGradient.addColorStop(1, "#0f0a1a");
        break;
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw distant mountains/buildings
    ctx.fillStyle = background === "city" ? "#0a0a1a88" : "#0a0a1a66";
    for (let i = 0; i < 5; i++) {
      const x = (i / 5) * width + Math.sin(time * 0.1 + i) * 20;
      const h = 50 + Math.sin(i * 1.5) * 30;
      ctx.beginPath();
      ctx.moveTo(x, height * 0.5);
      ctx.lineTo(x + 100, height * 0.5 - h);
      ctx.lineTo(x + 200, height * 0.5);
      ctx.fill();
    }

    // Draw ground with perspective
    const groundGradient = ctx.createLinearGradient(0, height * 0.5, 0, height);
    switch (background) {
      case "forest":
        groundGradient.addColorStop(0, "#1a3d2e");
        groundGradient.addColorStop(0.5, "#0d281e");
        groundGradient.addColorStop(1, "#051a12");
        break;
      case "cave":
        groundGradient.addColorStop(0, "#2d1f3d");
        groundGradient.addColorStop(0.5, "#1a0f2e");
        groundGradient.addColorStop(1, "#0a0515");
        break;
      case "city":
        groundGradient.addColorStop(0, "#1e3a5f");
        groundGradient.addColorStop(0.5, "#0f1729");
        groundGradient.addColorStop(1, "#050a15");
        break;
      case "arena":
        groundGradient.addColorStop(0, "#3d1f5f");
        groundGradient.addColorStop(0.5, "#1a0a2e");
        groundGradient.addColorStop(1, "#0a0512");
        break;
    }
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, height * 0.5, width, height * 0.5);

    // Draw perspective grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
      const x = width / 2 + i * 80;
      ctx.beginPath();
      ctx.moveTo(width / 2, height * 0.5);
      ctx.lineTo(x + i * 30, height);
      ctx.stroke();
    }

    // Draw floating particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const px = ((i * 137.5 + time * 20) % width);
      const py = height * 0.3 + Math.sin(time * 2 + i) * 50;
      const size = 2 + Math.sin(time + i) * 1;
      const alpha = 0.3 + Math.sin(time * 3 + i) * 0.2;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw lighting effect
    const lightGradient = ctx.createRadialGradient(
      width * 0.5, height * 0.3, 0,
      width * 0.5, height * 0.3, width * 0.6
    );
    lightGradient.addColorStop(0, "rgba(255, 255, 255, 0.05)");
    lightGradient.addColorStop(1, "transparent");
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, width, height);
  }, [time, background]);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
    }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        height: "100%",
      }}>
        {children}
      </div>
    </div>
  );
}
