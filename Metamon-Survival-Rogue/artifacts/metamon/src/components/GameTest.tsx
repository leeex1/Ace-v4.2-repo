/**
 * GameTest - Simple test component for both BattleScene and SurvivorScene
 */

import { useState } from "react";
import { gameStateManager } from "../game/GameStateManager";
import { BattleScene } from "../scenes/BattleScene";
import { SurvivorScene } from "../scenes/SurvivorScene";

export function GameTest() {
  const [testMode, setTestMode] = useState<"battle" | "survivor">("battle");

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
      <h1>🎮 Game Test</h1>
      
      <div style={{
        background: "rgba(255,255,255,0.1)",
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
        maxWidth: 400
      }}>
        <p>Test both BattleScene and SurvivorScene components:</p>
        
        <div style={{
          display: "flex",
          gap: 10,
          marginBottom: 20
        }}>
          <button
            onClick={() => setTestMode("battle")}
            style={{
              padding: "10px 20px",
              background: testMode === "battle" ? "#4ade80" : "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            ⚔️ Battle Scene
          </button>
          
          <button
            onClick={() => setTestMode("survivor")}
            style={{
              padding: "10px 20px",
              background: testMode === "survivor" ? "#4ade80" : "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            🎯 Survivor Scene
          </button>
        </div>

        <div style={{
          background: "rgba(0,0,0,0.8)",
          padding: 15,
          borderRadius: 6,
          fontSize: 12
        }}>
          <div>Current Mode: {testMode}</div>
          <div>Game State: {gameStateManager.getCurrentState()}</div>
          <div>Player Level: {gameStateManager.getGameData().player.level}</div>
          <div>Player XP: {gameStateManager.getGameData().player.experience}</div>
          <div>Player Coins: {gameStateManager.getGameData().player.coins}</div>
        </div>
      </div>

      {/* Render selected scene */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.9)",
        zIndex: 100
      }}>
        {testMode === "battle" ? (
          <div style={{
            width: "100%",
            height: "100%",
            maxWidth: 800,
            maxHeight: 600
          }}>
            <BattleScene />
          </div>
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            maxWidth: 800,
            maxHeight: 600
          }}>
            <SurvivorScene />
          </div>
        )}
      </div>
    </div>
  );
}
