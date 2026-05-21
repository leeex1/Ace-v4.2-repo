import { useState, useEffect } from "react";
import { SPRITE_SHEETS, MECHA_PORTRAITS, getAllAssets } from "../game/spriteManifest";
import { SimpleSprite } from "../components/SimpleSprite";

/**
 * SpriteDebugGallery - Asset validation page
 * 
 * Renders ALL sprite assets in a grid to verify they load correctly.
 * Use this to debug missing assets, broken paths, or loading issues.
 */
export function SpriteDebugGallery() {
  const [assetStatus, setAssetStatus] = useState<Record<string, "loading" | "loaded" | "error">>({});
  const assets = getAllAssets();

  const handleAssetLoad = (key: string) => {
    setAssetStatus(prev => ({ ...prev, [key]: "loaded" }));
  };

  const handleAssetError = (key: string) => {
    setAssetStatus(prev => ({ ...prev, [key]: "error" }));
  };

  // Counts
  const loadedCount = Object.values(assetStatus).filter(s => s === "loaded").length;
  const errorCount = Object.values(assetStatus).filter(s => s === "error").length;
  const totalCount = assets.spriteSheets.length + assets.portraits.length;

  return (
    <div style={{
      padding: 20,
      background: "#0a0a1a",
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "monospace",
    }}>
      <h1 style={{ marginBottom: 10 }}>🎨 Sprite Debug Gallery</h1>
      
      {/* Status Summary */}
      <div style={{
        display: "flex",
        gap: 20,
        marginBottom: 20,
        padding: 15,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 8,
      }}>
        <div>📦 Total: <strong>{totalCount}</strong></div>
        <div style={{ color: "#4ade80" }}>✅ Loaded: <strong>{loadedCount}</strong></div>
        <div style={{ color: "#f87171" }}>❌ Failed: <strong>{errorCount}</strong></div>
        <div>⏳ Pending: <strong>{totalCount - loadedCount - errorCount}</strong></div>
      </div>

      {/* Mecha Portraits Section */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ 
          borderBottom: "2px solid #4ade80", 
          paddingBottom: 10,
          marginBottom: 20,
        }}>
          Mecha Portraits ({assets.portraits.length} assets)
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 15,
        }}>
          {assets.portraits.map((portrait) => {
            const status = assetStatus[`portrait:${portrait.key}`];
            return (
              <div
                key={portrait.key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                  background: status === "error" 
                    ? "rgba(248,113,113,0.1)" 
                    : status === "loaded"
                    ? "rgba(74,222,128,0.1)"
                    : "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                  border: `1px solid ${
                    status === "error" ? "rgba(248,113,113,0.3)" 
                    : status === "loaded" ? "rgba(74,222,128,0.3)"
                    : "rgba(255,255,255,0.1)"
                  }`,
                }}
              >
                <SimpleSprite
                  src={portrait.url}
                  alt={portrait.name}
                  size={80}
                  onLoad={() => handleAssetLoad(`portrait:${portrait.key}`)}
                  onError={() => handleAssetError(`portrait:${portrait.key}`)}
                />
                <div style={{ 
                  marginTop: 8, 
                  fontSize: 11,
                  textAlign: "center",
                  color: status === "error" ? "#f87171" : "#aaa",
                }}>
                  {portrait.key}
                  {status === "error" && <div style={{ fontSize: 9 }}>❌ Failed</div>}
                  {status === "loaded" && <div style={{ fontSize: 9, color: "#4ade80" }}>✅</div>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sprite Sheets Section */}
      <section>
        <h2 style={{ 
          borderBottom: "2px solid #60a5fa", 
          paddingBottom: 10,
          marginBottom: 20,
        }}>
          Sprite Sheets ({assets.spriteSheets.length} assets)
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 15,
        }}>
          {assets.spriteSheets.map((sheet) => {
            const status = assetStatus[`sheet:${sheet.key}`];
            return (
              <div
                key={sheet.key}
                style={{
                  padding: 15,
                  background: status === "error" 
                    ? "rgba(248,113,113,0.1)" 
                    : status === "loaded"
                    ? "rgba(96,165,250,0.1)"
                    : "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                  border: `1px solid ${
                    status === "error" ? "rgba(248,113,113,0.3)" 
                    : status === "loaded" ? "rgba(96,165,250,0.3)"
                    : "rgba(255,255,255,0.1)"
                  }`,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 8 }}>
                  {sheet.name}
                </div>
                
                <SimpleSprite
                  src={sheet.url}
                  alt={sheet.name}
                  size={150}
                  onLoad={() => handleAssetLoad(`sheet:${sheet.key}`)}
                  onError={() => handleAssetError(`sheet:${sheet.key}`)}
                />
                
                <div style={{ 
                  marginTop: 10, 
                  fontSize: 10,
                  color: "#888",
                }}>
                  <div>Key: {sheet.key}</div>
                  <div>Frames: {sheet.frames}</div>
                  <div>Size: {sheet.frameWidth}x{sheet.frameHeight}</div>
                  {status === "error" && <div style={{ color: "#f87171" }}>❌ Load Failed</div>}
                  {status === "loaded" && <div style={{ color: "#60a5fa" }}>✅ Loaded</div>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Log Section */}
      <section style={{ marginTop: 40 }}>
        <h2 style={{ borderBottom: "2px solid #fbbf24", paddingBottom: 10 }}>
          📋 Asset Log
        </h2>
        <pre style={{
          background: "rgba(0,0,0,0.5)",
          padding: 15,
          borderRadius: 8,
          fontSize: 11,
          maxHeight: 300,
          overflow: "auto",
        }}>
          {JSON.stringify({
            totalAssets: totalCount,
            loaded: loadedCount,
            errors: errorCount,
            pending: totalCount - loadedCount - errorCount,
            statusBreakdown: assetStatus,
          }, null, 2)}
        </pre>
      </section>
    </div>
  );
}
