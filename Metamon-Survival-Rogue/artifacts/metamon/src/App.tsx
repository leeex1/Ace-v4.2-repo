console.log("📦 APP MODULE LOADED");
import React, { useState, useEffect, useCallback, useRef } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./game/constants";
import { initRunState } from "./game/engine";
import { MenuScreen } from "./pages/MenuScreen";
import { METAMON_TEMPLATES } from "./game/metamon";
import { getPortrait } from "./assets/mecha";

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('BOOTSTRAP ERROR:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: "100vw", height: "100vh",
          background: "#070712",
          color: "#ff4757",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "monospace", fontSize: "16px",
          flexDirection: "column", gap: "20px"
        }}>
          <div>🚨 BOOTSTRAP ERROR</div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            {this.state.error?.message}
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              background: "#ff4757",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            RELOAD
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  console.log("🎯 APP RENDER");
  const [mode, setMode] = useState("menu");
  
  return (
    <ErrorBoundary>
      <div style={{
        width: "100vw", height: "100vh",
        background: "#070712",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", touchAction: "none",
      }}>
        {mode === "menu" && (
          <MenuScreen
            onStart={() => console.log("Survival start")}
            onAdventure={() => console.log("Adventure start")}
            onContinue={(slot) => console.log("Continue slot", slot)}
            onSettings={() => console.log("Settings")}
            isMobile={false}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
