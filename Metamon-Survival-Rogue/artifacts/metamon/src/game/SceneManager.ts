/**
 * Scene Manager - Deterministic scene transition system
 * 
 * Handles all scene transitions with proper cleanup and initialization.
 */

import { gameStateManager, type GameState } from './GameStateManager';

// Scene interface
export interface Scene {
  id: string;
  initialize(): void | Promise<void>;
  update?(deltaTime: number): void;
  render?(): void;
  cleanup(): void;
  onEnter?(): void;
  onExit?(): void;
}

// Scene transition types
export type TransitionType = 
  | "instant"
  | "fade"
  | "slide_left"
  | "slide_right"
  | "scale";

// Scene transition data
export interface SceneTransition {
  from: string;
  to: string;
  type: TransitionType;
  duration: number;
  onStart?: () => void;
  onComplete?: () => void;
}

/**
 * SceneManager - Central scene authority
 */
class SceneManager {
  private static instance: SceneManager;
  private currentScene: Scene | null = null;
  private scenes: Map<string, Scene> = new Map();
  private transitionInProgress = false;
  private transitionQueue: SceneTransition[] = [];

  private constructor() {
    this.setupStateListener();
  }

  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }

  /**
   * Setup state change listener
   */
  private setupStateListener(): void {
    gameStateManager.addTransitionListener((from, to) => {
      this.handleStateTransition(from, to);
    });
  }

  /**
   * Register a scene
   */
  public registerScene(scene: Scene): void {
    console.log(`[SceneManager] Registering scene: ${scene.id}`);
    this.scenes.set(scene.id, scene);
  }

  /**
   * Unregister a scene
   */
  public unregisterScene(sceneId: string): void {
    console.log(`[SceneManager] Unregistering scene: ${sceneId}`);
    this.scenes.delete(sceneId);
  }

  /**
   * Get current scene
   */
  public getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  /**
   * Handle state transition
   */
  private handleStateTransition(from: GameState, to: GameState): void {
    const fromSceneId = this.gameStateToSceneId(from);
    const toSceneId = this.gameStateToSceneId(to);
    
    console.log(`[SceneManager] State transition: ${fromSceneId} → ${toSceneId}`);
    
    if (fromSceneId === toSceneId) {
      console.warn(`[SceneManager] No transition needed: ${fromSceneId} → ${toSceneId}`);
      return;
    }

    const nextScene = this.scenes.get(toSceneId);
    if (!nextScene) {
      console.error(`[SceneManager] Scene not found: ${toSceneId}`);
      return;
    }

    this.transitionToScene(nextScene, {
      from: fromSceneId,
      to: toSceneId,
      type: "fade",
      duration: 500,
    });
  }

  /**
   * Convert game state to scene ID
   */
  private gameStateToSceneId(state: GameState): string {
    const stateToSceneMap: Record<GameState, string> = {
      "BOOT": "boot",
      "MAIN_MENU": "main_menu",
      "HUB": "hub",
      "SURVIVOR_RUN": "survivor_run",
      "BATTLE": "battle",
      "VICTORY": "victory",
      "DEFEAT": "defeat",
      "REWARDS": "rewards",
      "TEAM_MANAGEMENT": "team_management",
      "GACHA_SUMMON": "gacha_summon",
      "INVENTORY": "inventory",
      "PAUSE": "pause",
      "SETTINGS": "settings",
    };
    return stateToSceneMap[state] || "unknown";
  }

  /**
   * Transition to new scene
   */
  public async transitionToScene(
    scene: Scene, 
    transition: Partial<SceneTransition> = {}
  ): Promise<void> {
    if (this.transitionInProgress) {
      console.warn('[SceneManager] Transition already in progress, queueing...');
      this.transitionQueue.push({
        from: this.currentScene?.id || 'unknown',
        to: scene.id,
        type: transition.type || 'fade',
        duration: transition.duration || 500,
        onStart: transition.onStart,
        onComplete: transition.onComplete,
      });
      return;
    }

    this.transitionInProgress = true;
    
    try {
      console.log(`[SceneManager] Starting transition to: ${scene.id}`);
      
      // Cleanup current scene
      if (this.currentScene) {
        console.log(`[SceneManager] Cleaning up scene: ${this.currentScene.id}`);
        this.currentScene.onExit?.();
        this.currentScene.cleanup();
      }

      // Start transition
      const transitionData: SceneTransition = {
        from: this.currentScene?.id || 'unknown',
        to: scene.id,
        type: transition.type || 'fade',
        duration: transition.duration || 500,
        onStart: transition.onStart,
        onComplete: transition.onComplete,
      };

      transitionData.onStart?.();
      
      // Initialize new scene
      console.log(`[SceneManager] Initializing scene: ${scene.id}`);
      await scene.initialize();
      
      // Set as current scene
      this.currentScene = scene;
      scene.onEnter?.();
      
      // Complete transition
      setTimeout(() => {
        transitionData.onComplete?.();
        this.transitionInProgress = false;
        
        // Process queued transitions
        if (this.transitionQueue.length > 0) {
          const next = this.transitionQueue.shift()!;
          this.transitionToScene(this.scenes.get(next.to)!, next);
        }
      }, transitionData.duration);
      
    } catch (error) {
      console.error(`[SceneManager] Failed to transition to ${scene.id}:`, error);
      this.transitionInProgress = false;
    }
  }

  /**
   * Update current scene
   */
  public update(deltaTime: number): void {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(deltaTime);
    }
  }

  /**
   * Render current scene
   */
  public render(): void {
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render();
    }
  }

  /**
   * Get scene status
   */
  public getStatus(): any {
    return {
      currentScene: this.currentScene?.id || null,
      registeredScenes: Array.from(this.scenes.keys()),
      transitionInProgress: this.transitionInProgress,
      queuedTransitions: this.transitionQueue.length,
    };
  }

  /**
   * Force transition to scene (bypass queue)
   */
  public async forceTransitionTo(scene: Scene, transition: Partial<SceneTransition> = {}): Promise<void> {
    this.transitionQueue = []; // Clear queue
    return this.transitionToScene(scene, transition);
  }

  /**
   * Clear all scenes
   */
  public clearAllScenes(): void {
    console.log('[SceneManager] Clearing all scenes');
    
    if (this.currentScene) {
      this.currentScene.cleanup();
      this.currentScene = null;
    }
    
    this.scenes.clear();
    this.transitionQueue = [];
    this.transitionInProgress = false;
  }
}

// Export singleton instance
export const sceneManager = SceneManager.getInstance();

// Export convenience functions
export const registerScene = (scene: Scene) => sceneManager.registerScene(scene);
export const unregisterScene = (sceneId: string) => sceneManager.unregisterScene(sceneId);
export const getCurrentScene = () => sceneManager.getCurrentScene();
export const transitionToScene = (scene: Scene, transition?: Partial<SceneTransition>) => sceneManager.transitionToScene(scene, transition);
export const forceTransitionToScene = (scene: Scene, transition?: Partial<SceneTransition>) => sceneManager.forceTransitionToScene(scene, transition);
export const updateScenes = (deltaTime: number) => sceneManager.update(deltaTime);
export const renderScenes = () => sceneManager.render();
export const getSceneStatus = () => sceneManager.getStatus();
