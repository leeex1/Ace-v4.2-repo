/**
 * GameState Manager - Centralized game state authority
 * 
 * Provides deterministic state management for all gameplay systems.
 * Prevents state coupling and enables reliable transitions.
 */

// Core game states
export type GameState = 
  | "BOOT"
  | "MAIN_MENU" 
  | "HUB"
  | "SURVIVOR_RUN"
  | "BATTLE"
  | "VICTORY"
  | "DEFEAT"
  | "REWARDS"
  | "TEAM_MANAGEMENT"
  | "GACHA_SUMMON"
  | "INVENTORY"
  | "PAUSE"
  | "SETTINGS";

// Game state data structure
export interface GameData {
  // Core state
  currentState: GameState;
  previousState: GameState;
  
  // Player data
  player: {
    level: number;
    experience: number;
    coins: number;
    gems: number;
    unlockedMecha: string[];
    ownedMecha: string[];
  };
  
  // Current run data (survivor mode)
  currentRun: {
    isActive: boolean;
    score: number;
    wave: number;
    enemiesDefeated: number;
    startTime: number;
    upgrades: string[];
  };
  
  // Battle data
  battle: {
    isActive: boolean;
    enemies: BattleEnemy[];
    playerParty: string[];
    turnOrder: string[];
    currentTurn: number;
    environment: string;
  };
  
  // Collection data
  collection: {
    mechaDatabase: Record<string, MechaData>;
    inventory: InventoryItem[];
    dropTables: DropTable[];
  };
  
  // Session data
  session: {
    sessionId: string;
    playTime: number;
    lastSave: number;
  };
}

// Supporting types
export interface BattleEnemy {
  id: string;
  speciesId: number;
  level: number;
  currentHp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  position: { x: number; y: number };
  status: "active" | "defeated" | "escaped";
}

export interface MechaData {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  type: "attacker" | "defender" | "support";
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  spriteSheet: string;
  portrait: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  type: "mecha" | "upgrade" | "consumable";
  quantity: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface DropTable {
  id: string;
  name: string;
  drops: DropEntry[];
  totalWeight: number;
}

export interface DropEntry {
  itemId: string;
  weight: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

/**
 * GameStateManager - Central state authority
 */
class GameStateManager {
  private static instance: GameStateManager;
  private state: GameData;
  private stateHistory: Array<{ state: GameState; timestamp: number }>;
  private transitionListeners: Array<(from: GameState, to: GameState) => void>;

  private constructor() {
    this.state = this.getInitialState();
    this.stateHistory = [];
    this.transitionListeners = [];
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  /**
   * Get initial game state
   */
  private getInitialState(): GameData {
    return {
      currentState: "BOOT",
      previousState: "BOOT",
      player: {
        level: 1,
        experience: 0,
        coins: 100,
        gems: 5,
        unlockedMecha: ["kabuto"],
        ownedMecha: ["kabuto"],
      },
      currentRun: {
        isActive: false,
        score: 0,
        wave: 1,
        enemiesDefeated: 0,
        startTime: 0,
        upgrades: [],
      },
      battle: {
        isActive: false,
        enemies: [],
        playerParty: ["kabuto"],
        turnOrder: [],
        currentTurn: 0,
        environment: "dojo",
      },
      collection: {
        mechaDatabase: {},
        inventory: [],
        dropTables: [],
      },
      session: {
        sessionId: this.generateSessionId(),
        playTime: 0,
        lastSave: Date.now(),
      },
    };
  }

  /**
   * Transition to new game state
   */
  public transitionTo(newState: GameState, context?: any): void {
    const oldState = this.state.currentState;
    
    console.log(`[GameState] Transition: ${oldState} → ${newState}`, context || '');
    
    // Record transition
    this.stateHistory.push({
      state: oldState,
      timestamp: Date.now(),
    });
    
    // Update state
    this.state.previousState = oldState;
    this.state.currentState = newState;
    
    // Notify listeners
    this.transitionListeners.forEach(listener => {
      listener(oldState, newState);
    });
    
    // Limit history size
    if (this.stateHistory.length > 50) {
      this.stateHistory = this.stateHistory.slice(-50);
    }
  }

  /**
   * Get current game state
   */
  public getCurrentState(): GameState {
    return this.state.currentState;
  }

  /**
   * Get previous game state
   */
  public getPreviousState(): GameState {
    return this.state.previousState;
  }

  /**
   * Get complete game data
   */
  public getGameData(): GameData {
    return { ...this.state };
  }

  /**
   * Update specific game data
   */
  public updateGameData(updates: Partial<GameData>): void {
    console.log(`[GameState] Updating:`, updates);
    this.state = { ...this.state, ...updates };
  }

  /**
   * Update player data
   */
  public updatePlayerData(updates: Partial<GameData['player']>): void {
    this.state.player = { ...this.state.player, ...updates };
    console.log(`[GameState] Player updated:`, this.state.player);
  }

  /**
   * Update current run data
   */
  public updateRunData(updates: Partial<GameData['currentRun']>): void {
    this.state.currentRun = { ...this.state.currentRun, ...updates };
    console.log(`[GameState] Run updated:`, this.state.currentRun);
  }

  /**
   * Update battle data
   */
  public updateBattleData(updates: Partial<GameData['battle']>): void {
    this.state.battle = { ...this.state.battle, ...updates };
    console.log(`[GameState] Battle updated:`, this.state.battle);
  }

  /**
   * Update collection data
   */
  public updateCollectionData(updates: Partial<GameData['collection']>): void {
    this.state.collection = { ...this.state.collection, ...updates };
    console.log(`[GameState] Collection updated:`, this.state.collection);
  }

  /**
   * Add state transition listener
   */
  public addTransitionListener(listener: (from: GameState, to: GameState) => void): void {
    this.transitionListeners.push(listener);
  }

  /**
   * Remove state transition listener
   */
  public removeTransitionListener(listener: (from: GameState, to: GameState) => void): void {
    const index = this.transitionListeners.indexOf(listener);
    if (index > -1) {
      this.transitionListeners.splice(index, 1);
    }
  }

  /**
   * Get state transition history
   */
  public getStateHistory(): Array<{ state: GameState; timestamp: number }> {
    return [...this.stateHistory];
  }

  /**
   * Reset game to initial state
   */
  public reset(): void {
    console.log('[GameState] Resetting to initial state');
    this.state = this.getInitialState();
    this.stateHistory = [];
  }

  /**
   * Save game state
   */
  public save(): string {
    const saveData = {
      gameData: this.state,
      timestamp: Date.now(),
      version: "1.0.0",
    };
    return JSON.stringify(saveData);
  }

  /**
   * Load game state
   */
  public load(saveData: string): boolean {
    try {
      const parsed = JSON.parse(saveData);
      if (this.validateSaveData(parsed)) {
        this.state = parsed.gameData;
        console.log('[GameState] Game loaded successfully');
        return true;
      }
    } catch (error) {
      console.error('[GameState] Failed to load game:', error);
    }
    return false;
  }

  /**
   * Validate save data structure
   */
  private validateSaveData(data: any): boolean {
    return (
      data &&
      data.gameData &&
      typeof data.gameData.currentState === 'string' &&
      data.gameData.player &&
      data.gameData.currentRun &&
      data.gameData.battle &&
      data.gameData.collection
    );
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Get debug info
   */
  public getDebugInfo(): any {
    return {
      currentState: this.state.currentState,
      previousState: this.state.previousState,
      stateHistory: this.stateHistory.slice(-10),
      playerStats: this.state.player,
      runStats: this.state.currentRun,
      battleStats: this.state.battle,
      collectionStats: {
        mechaCount: Object.keys(this.state.collection.mechaDatabase).length,
        inventoryCount: this.state.collection.inventory.length,
        dropTableCount: this.state.collection.dropTables.length,
      },
      sessionInfo: this.state.session,
    };
  }
}

// Export singleton instance
export const gameStateManager = GameStateManager.getInstance();

// Export convenience functions
export const getCurrentState = () => gameStateManager.getCurrentState();
export const transitionTo = (state: GameState, context?: any) => gameStateManager.transitionTo(state, context);
export const updatePlayerData = (updates: Partial<GameData['player']>) => gameStateManager.updatePlayerData(updates);
export const updateRunData = (updates: Partial<GameData['currentRun']>) => gameStateManager.updateRunData(updates);
export const updateBattleData = (updates: Partial<GameData['battle']>) => gameStateManager.updateBattleData(updates);
export const updateCollectionData = (updates: Partial<GameData['collection']>) => gameStateManager.updateCollectionData(updates);
