import { useState, useEffect } from "react";

/**
 * AssetValidator - Comprehensive asset path validation
 * 
 * Tests all asset paths and provides detailed feedback.
 */
export function AssetValidator() {
  const [validationResults, setValidationResults] = useState<Record<string, {
    status: 'pending' | 'loading' | 'success' | 'error';
    error?: string;
    loadTime?: number;
  }>>({});

  // Test assets from both categories
  const testAssets = [
    // Sprite sheets from public/sprites/
    { key: 'samurai_1', url: '/sprites/Samurai_pixel_sheet_1777559639868.jpg', type: 'spriteSheet' },
    { key: 'mixup', url: '/sprites/mixup_pizel_sheet_1777560143589.png', type: 'spriteSheet' },
    { key: 'mecha_standard', url: '/sprites/Gemini_Generated_Image_4ow4q94ow4q94ow4_1777560143587.png', type: 'spriteSheet' },
    { key: 'medarot_ds', url: '/sprites/DS___DSi_-_Medarot_DS_-_Miscellaneous_-_Medabots_1777559149405.png', type: 'spriteSheet' },
    
    // Mecha portraits from src/assets/mecha/ (need to check if accessible)
    { key: 'kabuto_portrait', url: '/assets/mecha/kabuto.png', type: 'portrait' },
    { key: 'kagutsuchi_portrait', url: '/assets/mecha/kagutsuchi.png', type: 'portrait' },
    { key: 'raijin_portrait', url: '/assets/mecha/raijin.png', type: 'portrait' },
  ];

  useEffect(() => {
    const validateAsset = async (asset: typeof testAssets[0]) => {
      const startTime = Date.now();
      
      setValidationResults(prev => ({
        ...prev,
        [asset.key]: { status: 'loading' }
      }));

      try {
        console.log(`[AssetValidator] Testing: ${asset.url}`);
        
        // Test with fetch first
        const response = await fetch(asset.url, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Then test with Image loading
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = asset.url;
        });

        const loadTime = Date.now() - startTime;
        
        setValidationResults(prev => ({
          ...prev,
          [asset.key]: { status: 'success', loadTime }
        }));
        
        console.log(`[AssetValidator] ✅ Success: ${asset.url} (${loadTime}ms)`);
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        const loadTime = Date.now() - startTime;
        
        setValidationResults(prev => ({
          ...prev,
          [asset.key]: { status: 'error', error: errorMsg, loadTime }
        }));
        
        console.error(`[AssetValidator] ❌ Failed: ${asset.url} - ${errorMsg}`);
      }
    };

    testAssets.forEach(validateAsset);
  }, []);

  const successCount = Object.values(validationResults).filter(r => r.status === 'success').length;
  const errorCount = Object.values(validationResults).filter(r => r.status === 'error').length;
  const loadingCount = Object.values(validationResults).filter(r => r.status === 'loading').length;

  return (
    <div style={{ padding: 20, background: '#0a0a1a', color: '#fff', minHeight: '100vh' }}>
      <h1>🔍 Asset Path Validator</h1>
      
      {/* Summary */}
      <div style={{
        display: 'flex',
        gap: 20,
        marginBottom: 30,
        padding: 15,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
      }}>
        <div>📊 Total: <strong>{testAssets.length}</strong></div>
        <div style={{ color: '#4ade80' }}>✅ Success: <strong>{successCount}</strong></div>
        <div style={{ color: '#f87171' }}>❌ Failed: <strong>{errorCount}</strong></div>
        <div style={{ color: '#fbbf24' }}>⏳ Loading: <strong>{loadingCount}</strong></div>
      </div>

      {/* Asset Results */}
      <div style={{ display: 'grid', gap: 15 }}>
        {testAssets.map(asset => {
          const result = validationResults[asset.key];
          const statusColor = result?.status === 'success' ? '#4ade80' : 
                           result?.status === 'error' ? '#f87171' : 
                           result?.status === 'loading' ? '#fbbf24' : '#666';
          
          return (
            <div
              key={asset.key}
              style={{
                padding: 15,
                background: result?.status === 'success' ? 'rgba(74,222,128,0.1)' : 
                          result?.status === 'error' ? 'rgba(248,113,113,0.1)' : 
                          'rgba(255,255,255,0.05)',
                borderRadius: 8,
                border: `1px solid ${statusColor}40`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: 5 }}>
                    {asset.key} ({asset.type})
                  </div>
                  <div style={{ fontSize: 12, color: '#888', wordBreak: 'break-all' }}>
                    {asset.url}
                  </div>
                  {result?.error && (
                    <div style={{ fontSize: 11, color: '#f87171', marginTop: 5 }}>
                      Error: {result.error}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: statusColor, fontWeight: 'bold' }}>
                    {result?.status === 'success' && '✅'}
                    {result?.status === 'error' && '❌'}
                    {result?.status === 'loading' && '⏳'}
                    {!result && '⏸️'}
                  </div>
                  {result?.loadTime && (
                    <div style={{ fontSize: 11, color: '#888' }}>
                      {result.loadTime}ms
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Debug Info */}
      <div style={{ marginTop: 30, background: 'rgba(0,0,0,0.5)', padding: 15, borderRadius: 8 }}>
        <h3>📋 Debug Information</h3>
        <pre style={{ fontSize: 11, color: '#aaa', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(validationResults, null, 2)}
        </pre>
      </div>
    </div>
  );
}
