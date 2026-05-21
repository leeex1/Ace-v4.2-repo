import { useState, useEffect } from "react";

/**
 * SpriteTest - Simple sprite validation component
 * 
 * Tests basic sprite loading without any complex systems.
 */
export function SpriteTest() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  // Test a few key sprites
  const testSprites = [
    "/sprites/Samurai_pixel_sheet_1777559639868.jpg",
    "/sprites/mixup_pizel_sheet_1777560143589.png", 
    "/sprites/Gemini_Generated_Image_4ow4q94ow4q94ow4_1777560143587.png",
    new URL("../assets/mecha/kabuto.png", import.meta.url).href,
  ];

  useEffect(() => {
    const results: Record<string, boolean> = {};
    
    const testSprite = async (url: string) => {
      try {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });
        results[url] = true;
        console.log(`✅ Loaded: ${url}`);
      } catch (e) {
        results[url] = false;
        console.error(`❌ Failed: ${url}`, e);
      }
      
      setTestResults({...results});
    };

    testSprites.forEach(testSprite);
  }, []);

  return (
    <div style={{ padding: 20, background: "#0a0a1a", color: "#fff" }}>
      <h2>🧪 Sprite Loading Test</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 10, marginBottom: 20 }}>
        {testSprites.map((url, i) => (
          <div key={i} style={{ 
            padding: 10, 
            background: testResults[url] === true ? "rgba(74,222,128,0.1)" : 
                        testResults[url] === false ? "rgba(248,113,113,0.1)" : "rgba(255,255,255,0.05)",
            borderRadius: 8,
            border: `1px solid ${
              testResults[url] === true ? "rgba(74,222,128,0.3)" : 
              testResults[url] === false ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.1)"
            }`
          }}>
            <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              Sprite {i + 1}
            </div>
            <div style={{ fontSize: 10, color: "#888", wordBreak: "break-all" }}>
              {url}
            </div>
            <div style={{ marginTop: 5 }}>
              {testResults[url] === true && <span style={{ color: "#4ade80" }}>✅ Loaded</span>}
              {testResults[url] === false && <span style={{ color: "#f87171" }}>❌ Failed</span>}
              {testResults[url] === undefined && <span style={{ color: "#fbbf24" }}>⏳ Testing...</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(0,0,0,0.5)", padding: 15, borderRadius: 8 }}>
        <h3>Test Results:</h3>
        <pre style={{ fontSize: 11, color: "#aaa" }}>
          {JSON.stringify(testResults, null, 2)}
        </pre>
      </div>
    </div>
  );
}
