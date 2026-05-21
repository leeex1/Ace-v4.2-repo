import { TEMPLATE_PORTRAIT } from "../assets/mecha/portraitMap";

const figureModules = import.meta.glob<{ default: string }>(
  "../assets/mecha/*.png",
  { eager: true },
);

const FIGURE_SRC: Record<string, string> = Object.fromEntries(
  Object.entries(figureModules).map(([path, mod]) => {
    const key = path.split("/").pop()!.replace(/\.png$/, "");
    return [key, mod.default];
  }),
);

const cache = new Map<string, HTMLImageElement>();

function getOrLoad(key: string): HTMLImageElement | null {
  const cached = cache.get(key);
  if (cached) return cached;
  const src = FIGURE_SRC[key];
  if (!src) return null;
  const img = new Image();
  img.src = src;
  cache.set(key, img);
  return img;
}

// Preload everything at module load so frame 1 already has them
for (const key of Object.keys(FIGURE_SRC)) getOrLoad(key);

export function getFigureSrc(portraitKey: string): string {
  return FIGURE_SRC[portraitKey] ?? "";
}

export function getMechaFigure(templateId: number): HTMLImageElement | null {
  const key = TEMPLATE_PORTRAIT[templateId];
  if (!key) return null;
  const img = getOrLoad(key);
  return img && img.complete && img.naturalWidth > 0 ? img : null;
}
