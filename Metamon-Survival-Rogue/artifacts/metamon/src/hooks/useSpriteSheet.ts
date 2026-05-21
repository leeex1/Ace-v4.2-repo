import { useState, useEffect, useRef } from "react";
import { SPRITE_SHEETS as CENTRAL_SPRITE_SHEETS } from "../game/spriteManifest";

export interface SpriteSheetConfig {
  url: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
  totalFrames: number;
}

export interface SlicedSprite {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export interface SpriteSheet {
  image: HTMLImageElement;
  frames: HTMLCanvasElement[];
  config: SpriteSheetConfig;
  isLoaded: boolean;
}

// Convert central manifest to hook format
export const SPRITE_SHEETS: Record<string, SpriteSheetConfig> = Object.fromEntries(
  Object.entries(CENTRAL_SPRITE_SHEETS).map(([key, config]) => [
    key,
    {
      url: config.url,
      frameWidth: config.frameWidth,
      frameHeight: config.frameHeight,
      columns: config.columns,
      rows: config.rows,
      totalFrames: config.frames,
    }
  ])
);

export function useSpriteSheet(sheetName: keyof typeof SPRITE_SHEETS) {
  const [spriteSheet, setSpriteSheet] = useState<SpriteSheet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const config = SPRITE_SHEETS[sheetName];
    if (!config) {
      setError(`Sprite sheet "${sheetName}" not found`);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const frames: HTMLCanvasElement[] = [];
      
      // Slice the sprite sheet into individual frames
      for (let i = 0; i < config.totalFrames; i++) {
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
        
        setProgress(Math.round(((i + 1) / config.totalFrames) * 100));
      }
      
      setSpriteSheet({
        image: img,
        frames,
        config,
        isLoaded: true,
      });
    };
    
    img.onerror = () => {
      setError(`Failed to load sprite sheet: ${config.url}`);
    };
    
    img.src = config.url;
  }, [sheetName]);

  return { spriteSheet, error, progress };
}

// Get a specific frame from a sprite sheet
export function getFrame(spriteSheet: SpriteSheet | null, frameIndex: number): HTMLCanvasElement | null {
  if (!spriteSheet || !spriteSheet.isLoaded) return null;
  return spriteSheet.frames[frameIndex] || null;
}

// Extract a region from a sprite (for part-based assembly)
export function extractRegion(
  sourceCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  
  if (ctx) {
    ctx.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);
  }
  
  return canvas;
}
