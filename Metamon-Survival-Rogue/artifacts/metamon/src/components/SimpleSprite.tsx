import { useState, useEffect } from "react";

interface SimpleSpriteProps {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * SimpleSprite - Reliable sprite renderer
 * 
 * Uses basic <img> tag with error handling and loading states.
 * No canvas complexity. No animation. Just reliable rendering.
 */
export function SimpleSprite({
  src,
  alt = "",
  size = 140,
  className = "",
  style = {},
  onLoad,
  onError,
}: SimpleSpriteProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [actualSrc, setActualSrc] = useState(src);

  // Reset when src changes
  useEffect(() => {
    setStatus("loading");
    setActualSrc(src);
  }, [src]);

  const handleLoad = () => {
    setStatus("loaded");
    onLoad?.();
  };

  const handleError = () => {
    console.error(`[SimpleSprite] Failed to load: ${actualSrc}`);
    setStatus("error");
    onError?.();
  };

  // Placeholder for loading/error states
  if (status === "error" || !actualSrc) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,0,0,0.1)",
          border: "1px dashed rgba(255,0,0,0.3)",
          borderRadius: 8,
          fontSize: size * 0.4,
          color: "rgba(255,0,0,0.5)",
          ...style,
        }}
        className={className}
        title={`Failed: ${actualSrc}`}
      >
        ❓
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-block",
        ...style,
      }}
      className={className}
    >
      {/* Loading placeholder */}
      {status === "loading" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.3)",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid #fff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={actualSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          imageRendering: "pixelated",
          opacity: status === "loaded" ? 1 : 0,
          transition: "opacity 0.2s ease-out",
        }}
      />
      
      {/* CSS for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * MechaPortrait - Render a mecha portrait by name
 */
interface MechaPortraitProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MechaPortrait({ name, size = 140, className, style }: MechaPortraitProps) {
  // Build the URL to mecha portrait using public path
  const src = `/assets/mecha/${name}.png`;
  
  console.log(`[MechaPortrait] Loading portrait: ${name} from ${src}`);
  
  return (
    <SimpleSprite
      src={src}
      alt={name}
      size={size}
      className={className}
      style={style}
    />
  );
}
