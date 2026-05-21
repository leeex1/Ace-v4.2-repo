/**
 * SurvivorScene - Survivor-style roguelite gameplay loop
 * 
 * Implements core survivor mechanics: movement, enemy waves, auto-attacks, XP, level-ups
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { gameStateManager, updateRunData, updatePlayerData } from "../game/GameStateManager";
import { SimpleSprite } from "../components/SimpleSprite";
import { SPRITE_SHEETS } from "../game/spriteManifest";

/**
 * SurvivorScene component
 */
export function SurvivorScene() {
  const [playerPosition, setPlayerPosition] = useState({ x: 400, y: 300 });
  const [enemies, setEnemies] = useState<Array<{
    id: string;
    x: number;
    y: number;
    hp: number;
    maxHp: number;
    speed: number;
    type: "basic" | "fast" | "boss";
  }>>([]);
  
  const [gameStats, setGameStats] = useState({
    score: 0,
    wave: 1,
    enemiesDefeated: 0,
    gameTime: 0,
    isPaused: false,
    upgrades: [] as string[],
    selectedUpgrade: null as string | null,
  });

  const gameLoopRef = useRef<number | null>(null);
  const enemySpawnTimer = useRef(0);
  const autoAttackTimer = useRef(0);

  // Initialize survivor run
  useEffect(() => {
    console.log('[SurvivorScene] Initializing survivor run...');
    
    updateRunData({
      isActive: true,
      score: 0,
      wave: 1,
      enemiesDefeated: 0,
      startTime: Date.now(),
      upgrades: [],
    });

    // Spawn initial enemies
    spawnEnemyWave();
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStateManager.getGameData().currentRun.isActive) return;

    const gameLoop = (deltaTime: number) => {
      if (gameStats.isPaused) return;

      setGameStats(prev => ({
        ...prev,
        gameTime: prev.gameTime + deltaTime
      }));

      // Update enemy positions and AI
      updateEnemies(deltaTime);
      
      // Auto-attack nearby enemies
      autoAttackTimer.current += deltaTime;
      if (autoAttackTimer.current > 500) { // Attack every 500ms
        autoAttackNearbyEnemies();
        autoAttackTimer.current = 0;
      }

      // Spawn new waves
      enemySpawnTimer.current += deltaTime;
      if (enemySpawnTimer.current > 10000) { // New wave every 10 seconds
        spawnEnemyWave();
        enemySpawnTimer.current = 0;
        setGameStats(prev => ({
          ...prev,
          wave: prev.wave + 1
        }));
      }

      // Check game over conditions
      checkGameOverConditions();
    };

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = 16; // Target 60 FPS
      
      gameLoop(deltaTime);
      gameLoopRef.current = requestAnimationFrame(animate);
    };

    gameLoopRef.current = requestAnimationFrame(animate);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, []);

  // Enemy management
  const updateEnemies = (deltaTime: number) => {
    setEnemies(prevEnemies => 
      prevEnemies.map(enemy => {
        // Simple AI: move towards player
        const dx = playerPosition.x - enemy.x;
        const dy = playerPosition.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 50) { // Only move if not too close
          const moveSpeed = enemy.speed * (enemy.type === "fast" ? 1.5 : 1);
          const moveX = (dx / distance) * moveSpeed * deltaTime;
          const moveY = (dy / distance) * moveSpeed * deltaTime;
          
          return {
            ...enemy,
            x: enemy.x + moveX,
            y: enemy.y + moveY
          };
        }
        
        return enemy;
      })
    );
  };

  const spawnEnemyWave = () => {
    console.log(`[SurvivorScene] Spawning wave ${gameStats.wave}`);
    
    const waveSize = 3 + Math.floor(gameStats.wave / 2); // Increase difficulty
    const newEnemies: typeof enemies = [];
    
    for (let i = 0; i < waveSize; i++) {
      const side = i % 2 === 0 ? -1 : 1; // Alternate sides
      const enemyType = gameStats.wave > 5 ? "fast" : "basic";
      
      newEnemies.push({
        id: `enemy_${Date.now()}_${i}`,
        x: 200 + (i * 100),
        y: 100 + (side * 150),
        hp: 30 + (gameStats.wave * 5),
        maxHp: 30 + (gameStats.wave * 5),
        speed: enemyType === "fast" ? 3 : 2,
        type: enemyType
      });
    }
    
    setEnemies(prev => [...prev, ...newEnemies]);
  };

  const autoAttackNearbyEnemies = () => {
    const attackRange = 80;
    
    setEnemies(prevEnemies => 
      prevEnemies.map(enemy => {
        const dx = enemy.x - playerPosition.x;
        const dy = enemy.y - playerPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= attackRange && enemy.hp > 0) {
          // Deal damage to enemy
          const damage = 10;
          const newHp = Math.max(0, enemy.hp - damage);
          
          if (newHp <= 0) {
            // Enemy defeated - give XP and score
            setGameStats(prev => ({
              ...prev,
              score: prev.score + 100,
              enemiesDefeated: prev.enemiesDefeated + 1
            }));
            
            updatePlayerData({
              experience: gameStateManager.getGameData().player.experience + 25
            });
            
            console.log(`[SurvivorScene] Enemy ${enemy.id} defeated! +25 XP`);
          }
          
          return {
            ...enemy,
            hp: newHp
          };
        }
        
        return enemy;
      })
    );
  };

  // Player movement
  const handlePlayerMovement = useCallback((direction: "up" | "down" | "left" | "right") => {
    const moveSpeed = 5;
    
    setPlayerPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch (direction) {
        case "up":
          newY = Math.max(50, prev.y - moveSpeed);
          break;
        case "down":
          newY = Math.min(550, prev.y + moveSpeed);
          break;
        case "left":
          newX = Math.max(50, prev.x - moveSpeed);
          break;
        case "right":
          newX = Math.min(750, prev.x + moveSpeed);
          break;
      }
      
      return { x: newX, y: newY };
    });
  }, []);

  // Upgrade selection
  const selectUpgrade = (upgradeId: string) => {
    console.log(`[SurvivorScene] Selected upgrade: ${upgradeId}`);
    
    setGameStats(prev => ({
      ...prev,
      selectedUpgrade: upgradeId
    }));
  };

  const confirmUpgrade = () => {
    if (!gameStats.selectedUpgrade) return;
    
    console.log(`[SurvivorScene] Confirmed upgrade: ${gameStats.selectedUpgrade}`);
    
    setGameStats(prev => ({
      ...prev,
      upgrades: gameStats.selectedUpgrade ? [...prev.upgrades, gameStats.selectedUpgrade] : prev.upgrades,
      selectedUpgrade: null
    }));
    
    // Apply upgrade effects (simplified)
    switch (gameStats.selectedUpgrade) {
      case "attack_speed":
        // Increase auto-attack rate
        console.log('[SurvivorScene] Attack speed upgraded!');
        break;
      case "move_speed":
        // Increase player movement speed
        console.log('[SurvivorScene] Move speed upgraded!');
        break;
      case "health":
        // Increase player HP
        updatePlayerData({
          // TODO: Implement player HP system
        });
        console.log('[SurvivorScene] Health upgraded!');
        break;
    }
  };

  // Game conditions
  const checkGameOverConditions = () => {
    const activeEnemies = enemies.filter(e => e.hp > 0);
    
    if (activeEnemies.length === 0 && gameStats.wave > 1) {
      // Wave cleared - spawn next wave
      enemySpawnTimer.current = 0;
      return;
    }
    
    // Check if player is overwhelmed (simplified game over)
    if (activeEnemies.length > 10) {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    console.log('[SurvivorScene] Game Over!');
    
    // Update final stats
    const finalScore = gameStats.score + (gameStats.wave * 50);
    const survivalTime = Date.now() - gameStateManager.getGameData().currentRun.startTime;
    
    updateRunData({
      isActive: false,
      score: finalScore,
      wave: gameStats.wave,
      enemiesDefeated: gameStats.enemiesDefeated,
      startTime: gameStateManager.getGameData().currentRun.startTime,
    });
    
    // Transition to defeat screen
    setTimeout(() => {
      gameStateManager.transitionTo("DEFEAT", { 
        score: finalScore,
        survivalTime: survivalTime,
        wave: gameStats.wave
      });
    }, 1000);
  };

  const handlePause = () => {
    setGameStats(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleRestart = () => {
    console.log('[SurvivorScene] Restarting run...');
    gameStateManager.transitionTo("SURVIVOR_RUN");
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#0a0a1a",
      color: "#fff",
      fontFamily: "monospace",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Game Header */}
      <div style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "rgba(0,0,0,0.8)",
        padding: 10,
        borderRadius: 6,
        fontSize: 12,
        zIndex: 100
      }}>
        <div>Score: {gameStats.score}</div>
        <div>Wave: {gameStats.wave}</div>
        <div>Enemies: {enemies.filter(e => e.hp > 0).length}</div>
        <div>Time: {Math.round(gameStats.gameTime / 1000)}s</div>
        <div>
          <button onClick={handlePause} style={{ marginLeft: 10 }}>
            {gameStats.isPaused ? "▶️ RESUME" : "⏸️ PAUSE"}
          </button>
          <button onClick={handleRestart} style={{ marginLeft: 5 }}>
            🔄 RESTART
          </button>
        </div>
      </div>

      {/* Game Arena */}
      <div style={{
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        bottom: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {/* Player */}
        <div style={{
          position: "absolute",
          left: playerPosition.x - 20,
          top: playerPosition.y - 20,
          width: 40,
          height: 40,
          background: "#4ade80",
          borderRadius: 4,
          zIndex: 10
        }}>
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: "#fff"
          }}>
            🤖
          </div>
        </div>

        {/* Enemies */}
        {enemies.map(enemy => (
          <div
            key={enemy.id}
            style={{
              position: "absolute",
              left: enemy.x - 15,
              top: enemy.y - 15,
              width: 30,
              height: 30,
              background: enemy.hp > 0 ? "#f87171" : "#666",
              borderRadius: 4,
              zIndex: 5,
              transition: "all 0.2s"
            }}
          >
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: "#fff"
            }}>
              {enemy.type === "boss" ? "👹" : "👾"}
            </div>
          </div>
        ))}

        {/* Controls */}
        <div style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          display: "flex",
          gap: 10
        }}>
          <button
            onMouseDown={() => handlePlayerMovement("up")}
            onTouchStart={() => handlePlayerMovement("up")}
            style={{
              width: 50,
              height: 50,
              background: "#3b82f6",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              fontSize: 20
            }}
          >
            ⬆️
          </button>
          
          <button
            onMouseDown={() => handlePlayerMovement("down")}
            onTouchStart={() => handlePlayerMovement("down")}
            style={{
              width: 50,
              height: 50,
              background: "#3b82f6",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              fontSize: 20
            }}
          >
            ⬇️
          </button>
          
          <button
            onMouseDown={() => handlePlayerMovement("left")}
            onTouchStart={() => handlePlayerMovement("left")}
            style={{
              width: 50,
              height: 50,
              background: "#3b82f6",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              fontSize: 20
            }}
          >
            ⬅️
          </button>
          
          <button
            onMouseDown={() => handlePlayerMovement("right")}
            onTouchStart={() => handlePlayerMovement("right")}
            style={{
              width: 50,
              height: 50,
              background: "#3b82f6",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              fontSize: 20
            }}
          >
            ⬆️
          </button>
        </div>

        {/* Level Up Modal */}
        {gameStats.selectedUpgrade && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.9)",
            padding: 20,
            borderRadius: 8,
            zIndex: 200
          }}>
            <h3 style={{ marginBottom: 15 }}>Level Up!</h3>
            <p>Select an upgrade:</p>
            <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
              <button
                onClick={() => selectUpgrade("attack_speed")}
                style={{
                  padding: "10px",
                  background: gameStats.selectedUpgrade === "attack_speed" ? "#4ade80" : "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                ⚔️ Attack Speed
              </button>
              
              <button
                onClick={() => selectUpgrade("move_speed")}
                style={{
                  padding: "10px",
                  background: gameStats.selectedUpgrade === "move_speed" ? "#4ade80" : "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                👟 Move Speed
              </button>
              
              <button
                onClick={() => selectUpgrade("health")}
                style={{
                  padding: "10px",
                  background: gameStats.selectedUpgrade === "health" ? "#4ade80" : "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                ❤️ Health
              </button>
            </div>
            
            <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
              <button
                onClick={confirmUpgrade}
                style={{
                  padding: "10px 20px",
                  background: "#4ade80",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                ✅ CONFIRM
              </button>
              
              <button
                onClick={() => setGameStats(prev => ({ ...prev, selectedUpgrade: null }))}
                style={{
                  padding: "10px 20px",
                  background: "#6b7280",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                ❌ CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
