/**
 * SimpleBattleTest - Minimal test component for BattleScene
 */

import React from "react";
import { gameStateManager } from "../game/GameStateManager";

export function SimpleBattleTest() {
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
      <h1>⚔️ Simple Battle Test</h1>
      
      <div style={{
        background: "rgba(255,255,255,0.1)",
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        minWidth: 400
      }}>
        <div>Game State: {gameStateManager.getCurrentState()}</div>
        <div>Player Level: {gameStateManager.getGameData().player.level}</div>
        <div>Player XP: {gameStateManager.getGameData().player.experience}</div>
        <div>Player Coins: {gameStateManager.getGameData().player.coins}</div>
      </div>
      
      <div style={{
        background: "rgba(0,255,0,0.2)",
        padding: 15,
        borderRadius: 8,
        marginTop: 20
      }}>
        <h3>Battle Scene Test</h3>
        <p>This is a minimal test to verify BattleScene works correctly.</p>
        <p>Current Battle Data:</p>
        <pre style={{
          background: "rgba(0,0,0,0.5)",
          padding: 10,
          borderRadius: 4,
          fontSize: 12,
          overflow: "auto",
          maxWidth: 400
        }}>
          {JSON.stringify(gameStateManager.getGameData().battle, null, 2)}
        </pre>
      </div>
    </div>
  );
}
