/**
 * MinimalTest - Simple test component to bypass TypeScript issues
 */

import React from "react";

export function MinimalTest() {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#0a0a1a",
      color: "#fff",
      fontFamily: "monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }}>
      <h1>🎮 Minimal Test</h1>
      
      <div style={{
        background: "rgba(255,255,255,0.1)",
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        minWidth: 400
      }}>
        <h3>Test Component Working</h3>
        <p>This is a minimal test to verify React components work correctly.</p>
        <p>If you can see this, the basic React setup is working.</p>
      </div>
    </div>
  );
}
