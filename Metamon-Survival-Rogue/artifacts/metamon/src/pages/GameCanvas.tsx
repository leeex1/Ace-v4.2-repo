import { useEffect, useRef, useCallback, useState } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../game/constants";
import { stepGame } from "../game/engine";
import type { RunState } from "../game/engine";
import { renderGame } from "../game/renderer";
import { TouchJoystick } from "./TouchJoystick";

interface GameCanvasProps {
  state: RunState;
  onStateChange: (s: RunState) => void;
}

export function GameCanvas({ state, onStateChange }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  // Local mirror of autoMove (state ref is mutated directly, but we need re-render for the button)
  const [autoOn, setAutoOn] = useState<boolean>(state.autoMove);

  stateRef.current = state;

  const loop = useCallback((time: number) => {
    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = time;
    const s = stateRef.current;
    if (s.phase === "playing") {
      stepGame(s, dt, 0, 0);
      if (s.phase !== "playing") {
        onStateChange({ ...s });
      }
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) renderGame(ctx, s, time / 1000);
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [onStateChange]);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  const handleJoystick = useCallback((x: number, y: number) => {
    stateRef.current.touchJoystick = { x, y };
  }, []);

  const toggleAuto = useCallback(() => {
    const next = !stateRef.current.autoMove;
    stateRef.current.autoMove = next;
    setAutoOn(next);
    // When entering auto mode, clear any manual joystick input so the AI takes over cleanly
    if (next) {
      stateRef.current.touchJoystick = { x: 0, y: 0 };
    }
  }, []);

  // Keyboard shortcut: press 'F' or 'Tab' to toggle auto
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F" || e.key === "Tab") {
        e.preventDefault();
        toggleAuto();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleAuto]);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ display: "block", width: "100%", height: "100%", imageRendering: "pixelated" }}
      />

      {/* AUTO toggle — top right, always visible during play */}
      <button
        onClick={toggleAuto}
        style={{
          position: "absolute",
          top: "1.5%",
          right: "1.5%",
          zIndex: 20,
          padding: "8px 14px",
          minWidth: 86,
          background: autoOn ? "#00ff9f" : "rgba(20,22,40,0.85)",
          color: autoOn ? "#001b13" : "#dcdcff",
          border: `2px solid ${autoOn ? "#00ff9f" : "#5a6080"}`,
          borderRadius: 8,
          fontFamily: "monospace",
          fontWeight: "bold",
          fontSize: 13,
          letterSpacing: 2,
          cursor: "pointer",
          boxShadow: autoOn
            ? "0 0 12px rgba(0,255,159,0.6), inset 0 0 6px rgba(255,255,255,0.3)"
            : "0 2px 6px rgba(0,0,0,0.6)",
          transition: "all 0.15s",
          touchAction: "manipulation",
          userSelect: "none",
        }}
        aria-pressed={autoOn}
        aria-label={autoOn ? "Auto-move is on. Press to switch to manual." : "Auto-move is off. Press to enable AI movement."}
        title="Toggle auto-move (hotkey: F)"
      >
        {autoOn ? "AUTO ●" : "AUTO ○"}
      </button>

      {/* Mobile touch joystick overlay (hidden in AUTO mode) */}
      {!autoOn && (
        <div style={{
          position: "absolute",
          bottom: 70,
          left: 24,
          zIndex: 10,
        }}>
          <TouchJoystick onMove={handleJoystick} />
        </div>
      )}
    </div>
  );
}
