import { useState, useEffect } from "react";
import { SPRITE_SHEETS } from "../game/spriteManifest";
import { SimpleSprite } from "./SimpleSprite";
import { MechaPortrait } from "./SimpleSprite";

/**
 * SpritePipelineTest - Complete pipeline validation
 * 
 * Tests the entire sprite rendering pipeline from manifest to display.
 */
export function SpritePipelineTest() {
  const [testResults, setTestResults] = useState<Record<string, {
    loaded: boolean;
    error?: string;
    renderTime?: number;
  }>>({});

  // Test all sprite sheet types
  const spriteSheetTests = Object.entries(SPRITE_SHEETS).slice(0, 6); // Test first 6
  const mechaPortraitTests = ['kabuto', 'kagutsuchi', 'raijin', 'suzaku', 'kirin'];

  useEffect(() => {
    const runTests = async () => {
      const results: typeof testResults = {};

      // Test sprite sheets
      for (const [key, config] of spriteSheetTests) {
        const startTime = Date.now();
        try {
          console.log(`[PipelineTest] Testing sprite sheet: ${key}`);
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = config.url;
          });
          
          results[`sheet:${key}`] = {
            loaded: true,
            renderTime: Date.now() - startTime
          };
          console.log(`[PipelineTest] ✅ Sprite sheet loaded: ${key}`);
        } catch (error) {
          results[`sheet:${key}`] = {
            loaded: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            renderTime: Date.now() - startTime
          };
          console.error(`[PipelineTest] ❌ Sprite sheet failed: ${key}`, error);
        }
      }

      // Test mecha portraits
      for (const name of mechaPortraitTests) {
        const startTime = Date.now();
        try {
          console.log(`[PipelineTest] Testing mecha portrait: ${name}`);
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = `/assets/mecha/${name}.png`;
          });
          
          results[`portrait:${name}`] = {
            loaded: true,
            renderTime: Date.now() - startTime
          };
          console.log(`[PipelineTest] ✅ Mecha portrait loaded: ${name}`);
        } catch (error) {
          results[`portrait:${name}`] = {
            loaded: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            renderTime: Date.now() - startTime
          };
          console.error(`[PipelineTest] ❌ Mecha portrait failed: ${name}`, error);
        }
      }

      setTestResults(results);
    };

    runTests();
  }, []);

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
      <h1>🔧 Sprite Pipeline Test</h1>
      
      {/* Summary */}
      <div style={{
        display: "flex",
        gap: 20,
        marginBottom: 30,
        padding: 15,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 8,
      }}>
        <div>📊 Total: <strong>{totalCount}</strong></div>
        <div style={{ color: "#4ade80" }}>✅ Success: <strong>{successCount}</strong></div>
        <div style={{ color: "#f87171" }}>❌ Failed: <strong>{failCount}</strong></div>
        <div>📈 Success Rate: <strong>{totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0}%</strong></div>
      </div>

      {/* Sprite Sheets Test */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ borderBottom: "2px solid #60a5fa", paddingBottom: 10, marginBottom: 20 }}>
          Sprite Sheets ({spriteSheetTests.length} tests)
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 15 }}>
          {spriteSheetTests.map(([key, config]) => {
            const result = testResults[`sheet:${key}`];
            return (
              <div
                key={key}
                style={{
                  padding: 15,
                  background: result?.loaded ? "rgba(96,165,250,0.1)" : "rgba(248,113,113,0.1)",
                  borderRadius: 8,
                  border: `1px solid ${result?.loaded ? "rgba(96,165,250,0.3)" : "rgba(248,113,113,0.3)"}`,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 8 }}>
                  {key}
                </div>
                
                {/* Test actual rendering */}
                <div style={{ marginBottom: 10 }}>
                  <SimpleSprite
                    src={config.url}
                    alt={key}
                    size={80}
                  />
                </div>
                
                <div style={{ fontSize: 10, color: "#888" }}>
                  <div>Frames: {config.frames}</div>
                  <div>Size: {config.frameWidth}x{config.frameHeight}</div>
                  {result && (
                    <div>
                      <div style={{ color: result.loaded ? "#4ade80" : "#f87171" }}>
                        {result.loaded ? "✅ Loaded" : "❌ Failed"}
                      </div>
                      {result.renderTime && <div>Time: {result.renderTime}ms</div>}
                      {result.error && <div style={{ color: "#f87171" }}>Error: {result.error}</div>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mecha Portraits Test */}
      <section>
        <h2 style={{ borderBottom: "2px solid #4ade80", paddingBottom: 10, marginBottom: 20 }}>
          Mecha Portraits ({mechaPortraitTests.length} tests)
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 15 }}>
          {mechaPortraitTests.map(name => {
            const result = testResults[`portrait:${name}`];
            return (
              <div
                key={name}
                style={{
                  padding: 15,
                  background: result?.loaded ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                  borderRadius: 8,
                  border: `1px solid ${result?.loaded ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: "bold", marginBottom: 8 }}>
                  {name}
                </div>
                
                {/* Test actual rendering */}
                <div style={{ marginBottom: 10 }}>
                  <MechaPortrait name={name} size={60} />
                </div>
                
                <div style={{ fontSize: 9, color: "#888" }}>
                  {result && (
                    <div>
                      <div style={{ color: result.loaded ? "#4ade80" : "#f87171" }}>
                        {result.loaded ? "✅ Loaded" : "❌ Failed"}
                      </div>
                      {result.renderTime && <div>Time: {result.renderTime}ms</div>}
                      {result.error && <div style={{ color: "#f87171" }}>Error: {result.error}</div>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pipeline Status */}
      <div style={{ 
        marginTop: 40, 
        padding: 20, 
        background: "rgba(0,0,0,0.5)", 
        borderRadius: 8,
        textAlign: "center"
      }}>
        <h3>🎯 Pipeline Status</h3>
        <div style={{ fontSize: 14, marginTop: 10 }}>
          {totalCount === 0 ? "⏳ Testing..." : 
           failCount === 0 ? "✅ All assets loaded successfully!" :
           successCount > failCount ? "⚠️ Some assets failed" :
           "❌ Critical asset loading failures"}
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 5 }}>
          {totalCount > 0 && `Visual baseline: ${successCount}/${totalCount} assets working`}
        </div>
      </div>
    </div>
  );
}
