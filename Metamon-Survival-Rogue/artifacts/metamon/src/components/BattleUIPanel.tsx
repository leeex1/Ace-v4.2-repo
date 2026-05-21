import { useState } from "react";

interface BattleUIPanelProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  title?: string;
  className?: string;
}

export function BattleUIPanel({ 
  children, 
  variant = "primary", 
  title,
  className = ""
}: BattleUIPanelProps) {
  const colors = {
    primary: { bg: "#1a1a3e", border: "#3d3d7a", glow: "#5a5aff" },
    secondary: { bg: "#0d281e", border: "#2d5a4a", glow: "#4affaa" },
    danger: { bg: "#3d1a1a", border: "#7a3d3d", glow: "#ff5a5a" },
    success: { bg: "#1a3d1a", border: "#4a7a3d", glow: "#5aff5a" },
  };

  const c = colors[variant];

  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(135deg, ${c.bg}ee 0%, ${c.bg}cc 100%)`,
        border: `2px solid ${c.border}`,
        borderRadius: 16,
        padding: "16px 20px",
        boxShadow: `
          0 0 20px ${c.glow}40,
          inset 0 1px 0 rgba(255,255,255,0.1),
          0 4px 20px rgba(0,0,0,0.4)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner accents */}
      <div style={{
        position: "absolute",
        top: 6,
        left: 6,
        width: 12,
        height: 12,
        borderLeft: `2px solid ${c.glow}`,
        borderTop: `2px solid ${c.glow}`,
      }} />
      <div style={{
        position: "absolute",
        top: 6,
        right: 6,
        width: 12,
        height: 12,
        borderRight: `2px solid ${c.glow}`,
        borderTop: `2px solid ${c.glow}`,
      }} />
      <div style={{
        position: "absolute",
        bottom: 6,
        left: 6,
        width: 12,
        height: 12,
        borderLeft: `2px solid ${c.glow}`,
        borderBottom: `2px solid ${c.glow}`,
      }} />
      <div style={{
        position: "absolute",
        bottom: 6,
        right: 6,
        width: 12,
        height: 12,
        borderRight: `2px solid ${c.glow}`,
        borderBottom: `2px solid ${c.glow}`,
      }} />

      {title && (
        <div style={{
          fontSize: 12,
          fontWeight: "bold",
          color: c.glow,
          letterSpacing: 2,
          marginBottom: 12,
          textTransform: "uppercase",
          textShadow: `0 0 10px ${c.glow}80`,
        }}>
          {title}
        </div>
      )}

      {children}
    </div>
  );
}

interface HPBarProps {
  current: number;
  max: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}

export function HPBar({ current, max, color = "#38e868", label, showValue = true }: HPBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const isLow = percentage < 25;
  const isMedium = percentage < 50;

  return (
    <div style={{ width: "100%" }}>
      {(label || showValue) && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#aaa",
          marginBottom: 4,
        }}>
          {label && <span>{label}</span>}
          {showValue && (
            <span style={{ color: isLow ? "#ff6b6b" : "#ccc" }}>
              {current}/{max}
            </span>
          )}
        </div>
      )}
      
      <div style={{
        height: 12,
        background: "rgba(0,0,0,0.5)",
        borderRadius: 6,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        position: "relative",
      }}>
        {/* Glow effect */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${color}40 0%, transparent 100%)`,
          opacity: isLow ? 0.8 : 0.4,
          animation: isLow ? "pulse 1s ease-in-out infinite" : "none",
        }} />
        
        {/* HP fill */}
        <div style={{
          height: "100%",
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${isLow ? "#ff6b6b" : isMedium ? "#f0c040" : color} 0%, ${isLow ? "#ff8e8e" : isMedium ? "#f5d060" : "#5aff88"} 100%)`,
          borderRadius: 5,
          transition: "width 0.5s ease-out",
          boxShadow: `0 0 10px ${isLow ? "#ff6b6b" : isMedium ? "#f0c040" : color}60`,
        }} />
        
        {/* Shine effect */}
        <div style={{
          position: "absolute",
          top: 1,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
          borderRadius: "5px 5px 0 0",
        }} />
      </div>
    </div>
  );
}

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  icon?: string;
}

export function ActionButton({ 
  children, 
  onClick, 
  variant = "primary",
  disabled = false,
  icon
}: ActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const colors = {
    primary: { bg: "#3d3d7a", hover: "#4a4a99", glow: "#5a5aff" },
    secondary: { bg: "#2d5a4a", hover: "#3d7a5a", glow: "#4affaa" },
    danger: { bg: "#7a3d3d", hover: "#994a4a", glow: "#ff5a5a" },
  };

  const c = colors[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        padding: "12px 20px",
        background: isHovered ? c.hover : c.bg,
        border: `2px solid ${isHovered ? c.glow : "transparent"}`,
        borderRadius: 12,
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transform: isPressed ? "scale(0.95)" : isHovered ? "scale(1.02)" : "scale(1)",
        transition: "all 0.15s ease-out",
        boxShadow: isHovered 
          ? `0 0 20px ${c.glow}60, inset 0 1px 0 rgba(255,255,255,0.2)` 
          : "0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        minWidth: 100,
        justifyContent: "center",
      }}
    >
      {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      {children}
    </button>
  );
}
