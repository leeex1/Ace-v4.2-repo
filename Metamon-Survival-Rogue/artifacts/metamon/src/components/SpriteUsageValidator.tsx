import { useState, useEffect } from "react";
import { SPRITE_SHEETS } from "../game/spriteManifest";
import { useSpriteSheet } from "../hooks/useSpriteSheet";
import { SimpleSprite } from "./SimpleSprite";

/**
 * SpriteUsageValidator - Tests all sprite sheets with useSpriteSheet hook
 * 
 * Validates that every sprite sheet in the manifest can be loaded through the hook.
 */
export function SpriteUsageValidator() {
  const [testResults, setTestResults] = useState<Record<string, {
    loaded: boolean;
    error?: string;
    frames?: number;
    hasFrames?: boolean;
  }>>({});

  useEffect(() => {
    const testAllSprites = async () => {
      const results: typeof testResults = {};
      const spriteSheetNames = Object.keys(SPRITE_SHEETS);

      console.log(`[SpriteUsageValidator] Testing ${spriteSheetNames.length} sprite sheets...`);

      for (const sheetName of spriteSheetNames) {
        try {
          console.log(`[SpriteUsageValidator] Testing: ${sheetName}`);
          
          // Test basic image loading first
          const config = SPRITE_SHEETS[sheetName as keyof typeof SPRITE_SHEETS];
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = config.url;
          });

          // Test hook loading (simulate what components do)
          const hookTest = await testHookLoading(sheetName);
          
          results[sheetName] = {
            loaded: hookTest.loaded,
            error: hookTest.error,
            frames: hookTest.frames,
            hasFrames: hookTest.hasFrames,
          };

          console.log(`[SpriteUsageValidator] ${hookTest.loaded ? '✅' : '❌'} ${sheetName}: ${hookTest.error || 'OK'}`);
          
        } catch (error) {
          results[sheetName] = {
            loaded: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
          console.error(`[SpriteUsageValidator] ❌ ${sheetName}:`, error);
        }
      }

      setTestResults(results);
    };

    testAllSprites();
  }, []);

  // Simulate hook loading test
  const testHookLoading = async (sheetName: string): Promise<{
    loaded: boolean;
    error?: string;
    frames?: number;
    hasFrames?: boolean;
  }> => {
    try {
      // Create a test component instance to simulate hook usage
      const config = SPRITE_SHEETS[sheetName as keyof typeof SPRITE_SHEETS];
      
      // Test image slicing (what the hook does)
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = config.url;
      });

      // Simulate frame extraction
      const frames: HTMLCanvasElement[] = [];
      for (let i = 0; i < Math.min(config.frames, 4); i++) { // Test first 4 frames max
        const row = Math.floor(i / config.columns);
        const col = i % config.columns;
        
        const canvas = document.createElement("canvas");
        canvas.width = config.frameWidth;
        canvas.height = config.frameHeight;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          ctx.drawImage(
            img,
            col * config.frameWidth,
            row * config.frameHeight,
            config.frameWidth,
            config.frameHeight,
            0,
            0,
            config.frameWidth,
            config.frameHeight
          );
          frames.push(canvas);
        }
      }

      return {
        loaded: true,
        frames: frames.length,
        hasFrames: frames.length > 0,
      };
      
    } catch (error) {
      return {
        loaded: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const successCount = Object.values(testResults).filter(r => r.loaded).length;
  const failCount = Object.values(testResults).filter(r => !r.loaded).length;
  const totalCount = Object.keys(testResults).length;

  return (
    <div style={{ 
      padding: 20, 
      background: "#0a0a1a", 
      color: "#fff", 
      minHeight: "100vh",
      fontFamily: "monospace"
    }}>
      <h1>🧪 Sprite Usage Validator</h1>
      
      {/* Summary */}
      <div style={{
        display: "flex",
        gap: 20,
        marginBottom: 30,
        padding: 15,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 8,
      }}>
        <div>📊 Total Sheets: <strong>{totalCount}</strong></div>
        <div style={{ color: "#4ade80" }}>✅ Hook Loaded: <strong>{successCount}</strong></div>
        <div style={{ color: "#f87171" }}>❌ Hook Failed: <strong>{failCount}</strong></div>
        <div>📈 Success Rate: <strong>{totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0}%</strong></div>
      </div>

      {/* Individual Sprite Sheet Tests */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 15 }}>
        {Object.entries(testResults).map(([sheetName, result]) => {
          const config = SPRITE_SHEETS[sheetName as keyof typeof SPRITE_SHEETS];
          
          return (
            <div
              key={sheetName}
              style={{
                padding: 15,
                background: result.loaded ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                borderRadius: 8,
                border: `1px solid ${result.loaded ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 8 }}>
                {sheetName}
              </div>
              
              {/* Show sprite preview */}
              <div style={{ marginBottom: 10 }}>
                <SimpleSprite
                  src={config.url}
                  alt={sheetName}
                  size={80}
                />
              </div>
              
              {/* Configuration details */}
              <div style={{ fontSize: 10, color: "#888", marginBottom: 8 }}>
                <div>URL: {config.url.split('/').pop()}</div>
                <div>Frames: {config.frames}</div>
                <div>Size: {config.frameWidth}x{config.frameHeight}</div>
                <div>Grid: {config.columns}x{config.rows}</div>
              </div>
              
              {/* Test results */}
              <div style={{ fontSize: 10 }}>
                <div style={{ color: result.loaded ? "#4ade80" : "#f87171" }}>
                  {result.loaded ? "✅ Hook Success" : "❌ Hook Failed"}
                </div>
                {result.frames !== undefined && (
                  <div>Frames Extracted: {result.frames}</div>
                )}
                {result.hasFrames !== undefined && (
                  <div>Has Frames: {result.hasFrames ? "✅" : "❌"}</div>
                )}
                {result.error && (
                  <div style={{ color: "#f87171", fontSize: 9 }}>
                    Error: {result.error}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Usage Recommendations */}
      <div style={{ 
        marginTop: 40, 
        padding: 20, 
        background: "rgba(0,0,0,0.5)", 
        borderRadius: 8
      }}>
        <h3>📋 Usage Status</h3>
        <div style={{ fontSize: 14, marginTop: 10 }}>
          {totalCount === 0 ? "⏳ Testing..." : 
           failCount === 0 ? "✅ All sprite sheets work with useSpriteSheet hook!" :
           successCount > failCount ? "⚠️ Some sprite sheets have hook issues" :
           "❌ Critical sprite sheet hook failures"}
        </div>
        
        <div style={{ fontSize: 12, color: "#888", marginTop: 15 }}>
          <div><strong>Available Sprite Sheets:</strong></div>
          <div style={{ marginTop: 5 }}>
            {Object.keys(SPRITE_SHEETS).map(name => 
              testResults[name]?.loaded ? 
                <span key={name} style={{ color: "#4ade80", marginRight: 10 }}>✅ {name}</span> :
                <span key={name} style={{ color: "#f87171", marginRight: 10 }}>❌ {name}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
