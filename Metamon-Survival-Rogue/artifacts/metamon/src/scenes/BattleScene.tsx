/**
 * BattleScene - Core battle gameplay implementation
 * 
 * Restores functional battle loop with proper state management.
 */

import React, { useState, useEffect, useRef } from "react";
import { gameStateManager, updateBattleData, updatePlayerData } from "../game/GameStateManager";
import { SimpleSprite } from "../components/SimpleSprite";
import { SPRITE_SHEETS } from "../game/spriteManifest";

/**
 * BattleScene component - React implementation
 */
export function BattleScene() {
  const [battleTimer, setBattleTimer] = useState(0);
  const [enemySpawnTimer, setEnemySpawnTimer] = useState(0);
  const battleLoopRef = useRef<number | null>(null);

  useEffect(() => {
    console.log('[BattleScene] Initializing battle...');
    
    // Initialize battle state
    updateBattleData({
      isActive: true,
      enemies: [
        {
          id: "enemy_1",
          speciesId: 1,
          level: 5,
          currentHp: 50,
          maxHp: 50,
          attack: 10,
          defense: 5,
          speed: 2,
          position: { x: 400, y: 200 },
          status: "active"
        }
      ],
      playerParty: ["kabuto"],
      turnOrder: ["kabuto", "enemy_1"],
      currentTurn: 0,
      environment: "dojo"
    });

    console.log('[BattleScene] Battle initialized');
  }, []);

  useEffect(() => {
    if (!gameStateManager.getGameData().battle.isActive) return;

    const gameLoop = (deltaTime: number) => {
      setBattleTimer(prev => prev + deltaTime);
      setEnemySpawnTimer(prev => prev + deltaTime);

      // Simple battle logic
      processBattleTurn();
      checkBattleConditions();
    };

    // Start game loop
    let lastTime = Date.now();
    const loop = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      gameLoop(deltaTime);
      battleLoopRef.current = requestAnimationFrame(loop);
    };

    battleLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (battleLoopRef.current) {
        cancelAnimationFrame(battleLoopRef.current);
        battleLoopRef.current = null;
      }
    };
  }, []);

  // Battle logic functions
  const processBattleTurn = () => {
    const battleData = gameStateManager.getGameData().battle;
    const currentTurn = battleData.currentTurn;
    
    // Simple turn-based logic
    if (currentTurn < battleData.turnOrder.length) {
      console.log(`[BattleScene] Processing turn ${currentTurn + 1}`);
      
      // Increment turn
      updateBattleData({
        currentTurn: currentTurn + 1
      });
      
      // Reset to first turn if we've gone through all
      if (currentTurn + 1 >= battleData.turnOrder.length) {
        updateBattleData({
          currentTurn: 0
        });
      }
    }
  };

  const checkBattleConditions = () => {
    const battleData = gameStateManager.getGameData().battle;
    const activeEnemies = battleData.enemies.filter(e => e.status === "active");
    
    // Check victory condition
    if (activeEnemies.length === 0) {
      handleVictory();
      return;
    }
    
    // Check defeat condition (simplified)
    const playerDefeated = false; // TODO: Implement player HP
    if (playerDefeated) {
      handleDefeat();
    }
  };

  const handlePlayerAttack = () => {
    console.log('[BattleScene] Player attacks!');
    
    const battleData = gameStateManager.getGameData().battle;
    const targetEnemy = battleData.enemies[0]; // First enemy for simplicity
    
    if (targetEnemy && targetEnemy.status === "active") {
      // Calculate damage (simplified)
      const damage = 15;
      const newHp = Math.max(0, targetEnemy.currentHp - damage);
      
      // Update enemy HP
      const updatedEnemies = battleData.enemies.map(enemy => 
        enemy.id === targetEnemy.id 
          ? { ...enemy, currentHp: newHp }
          : enemy
      );
      
      updateBattleData({
        enemies: updatedEnemies.map(enemy => 
          enemy.currentHp <= 0 
            ? { ...enemy, status: "defeated" as const }
            : enemy
        )
      });
      
      console.log(`[BattleScene] Dealt ${damage} damage to ${targetEnemy.id}. New HP: ${newHp}`);
    }
  };

  const handleDefend = () => {
    console.log('[BattleScene] Player defends!');
    // TODO: Implement defense logic
  };

  const handleFlee = () => {
    console.log('[BattleScene] Player flees!');
    handleDefeat(); // For now, treat flee as defeat
  };

  const handleVictory = () => {
    console.log('[BattleScene] Victory!');
    
    // Update player rewards
    updatePlayerData({
      experience: gameStateManager.getGameData().player.experience + 100,
      coins: gameStateManager.getGameData().player.coins + 50
    });
    
    // Transition to rewards scene
    setTimeout(() => {
      gameStateManager.transitionTo("REWARDS", { victory: true });
    }, 1000);
  };

  const handleDefeat = () => {
    console.log('[BattleScene] Defeat!');
    
    // Transition to defeat scene
    setTimeout(() => {
      gameStateManager.transitionTo("DEFEAT", { victory: false });
    }, 1000);
  };

  const battleData = gameStateManager.getGameData().battle;

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
      <h1 style={{ marginBottom: 20 }}>⚔️ BATTLE</h1>
      
      {/* Battle Status */}
      <div style={{
        background: "rgba(255,255,255,0.1)",
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        minWidth: 400
      }}>
        <div>Enemies: {battleData.enemies.length}</div>
        <div>Player Party: {battleData.playerParty.length}</div>
        <div>Current Turn: {battleData.currentTurn}</div>
        <div>Battle Time: {Math.round(battleTimer / 1000)}s</div>
      </div>

      {/* Battle Arena */}
      <div style={{
        display: "flex",
        gap: 40,
        alignItems: "center",
        marginBottom: 20
      }}>
        {/* Player Side */}
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 10, fontSize: 14 }}>PLAYER</div>
          <SimpleSprite
            src="/assets/mecha/kabuto.png"
            alt="Player"
            size={120}
          />
          <div style={{ marginTop: 10 }}>
            HP: {battleData.enemies[0]?.maxHp || 100}
          </div>
        </div>

        {/* VS */}
        <div style={{ fontSize: 24, color: "#f5a623" }}>VS</div>

        {/* Enemy Side */}
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 10, fontSize: 14 }}>ENEMY</div>
          <SimpleSprite
            src={SPRITE_SHEETS.medarot_ds.url}
            alt="Enemy"
            size={120}
          />
          <div style={{ marginTop: 10 }}>
            HP: {battleData.enemies[0]?.currentHp || 50}
          </div>
        </div>
      </div>

      {/* Battle Actions */}
      <div style={{
        display: "flex",
        gap: 10,
        justifyContent: "center",
        marginTop: 20
      }}>
        <button
          onClick={handlePlayerAttack}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            background: "#4ade80",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          ⚔️ ATTACK
        </button>
        
        <button
          onClick={handleDefend}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          🛡️ DEFEND
        </button>

        <button
          onClick={handleFlee}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            background: "#6b7280",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          🏃 FLEE
        </button>
      </div>

      {/* Debug Info */}
      <div style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "rgba(0,0,0,0.8)",
        padding: 10,
        borderRadius: 6,
        fontSize: 12,
        maxWidth: 300
      }}>
        <div>Battle Scene Active</div>
        <div>Timer: {Math.round(battleTimer / 1000)}s</div>
        <div>Enemies: {battleData.enemies.filter(e => e.status === "active").length}</div>
      </div>
    </div>
  );
}
