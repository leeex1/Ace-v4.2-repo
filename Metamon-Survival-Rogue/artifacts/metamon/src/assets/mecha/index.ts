const modules = import.meta.glob<{ default: string }>("./*.png", { eager: true });

export const MECHA_PORTRAITS: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const key = path.replace(/^\.\//, "").replace(/\.png$/, "");
    return [key, mod.default];
  }),
);

export const MECHA_KEYS = Object.keys(MECHA_PORTRAITS).sort();

export function getPortrait(key: string | undefined): string | undefined {
  if (!key) return undefined;
  return MECHA_PORTRAITS[key];
}
