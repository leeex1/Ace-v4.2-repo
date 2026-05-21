import { useRef, useEffect, useCallback } from "react";

interface TouchJoystickProps {
  onMove: (x: number, y: number) => void;
}

const JOYSTICK_RADIUS = 52;
const KNOB_RADIUS = 24;

export function TouchJoystick({ onMove }: TouchJoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<{ x: number; y: number } | null>(null);
  const touchIdRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (touchIdRef.current !== null) return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    const rect = containerRef.current!.getBoundingClientRect();
    originRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    updateKnob(touch.clientX, touch.clientY);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateKnob(touch.clientX, touch.clientY);
        break;
      }
    }
  }, []);

  function updateKnob(cx: number, cy: number) {
    const origin = originRef.current;
    if (!origin) return;
    let dx = cx - origin.x;
    let dy = cy - origin.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > JOYSTICK_RADIUS) {
      dx = (dx / dist) * JOYSTICK_RADIUS;
      dy = (dy / dist) * JOYSTICK_RADIUS;
    }
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    const nx = dist < 6 ? 0 : dx / JOYSTICK_RADIUS;
    const ny = dist < 6 ? 0 : dy / JOYSTICK_RADIUS;
    onMove(nx, ny);
  }

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        originRef.current = null;
        if (knobRef.current) {
          knobRef.current.style.transform = "translate(0px, 0px)";
        }
        onMove(0, 0);
        break;
      }
    }
  }, [onMove]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: false });
    el.addEventListener("touchcancel", handleTouchEnd, { passive: false });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      style={{
        width: JOYSTICK_RADIUS * 2 + 10,
        height: JOYSTICK_RADIUS * 2 + 10,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.06)",
        border: "2px solid rgba(255,255,255,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        userSelect: "none",
        backdropFilter: "blur(4px)",
        position: "relative",
      }}
    >
      {/* Range indicator rings */}
      <div style={{
        position:"absolute", inset:8,
        borderRadius:"50%",
        border:"1px solid rgba(255,255,255,0.08)",
        pointerEvents:"none",
      }}/>
      {/* Knob */}
      <div
        ref={knobRef}
        style={{
          width: KNOB_RADIUS * 2,
          height: KNOB_RADIUS * 2,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5), rgba(233,69,96,0.7))",
          border: "2px solid rgba(255,255,255,0.35)",
          boxShadow: "0 0 12px rgba(233,69,96,0.5)",
          transition: "none",
          cursor: "grab",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
