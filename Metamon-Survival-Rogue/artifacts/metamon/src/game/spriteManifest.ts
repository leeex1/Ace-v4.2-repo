/**
 * SPRITE MANIFEST - Single Source of Truth
 * 
 * This file defines ALL sprite assets in the game.
 * Used for validation, loading, and debug gallery.
 */

// Sprite sheets from public/sprites/
export const SPRITE_SHEETS = {
  // Samurai pixel sheets (64 frames each, 8x8)
  samurai_1: {
    url: "/sprites/Samurai_pixel_sheet_1777559639868.jpg",
    name: "Samurai Pixel Sheet 1",
    frames: 64,
    columns: 8,
    rows: 8,
    frameWidth: 64,
    frameHeight: 64,
  },
  samurai_2: {
    url: "/sprites/Samurai_pixel_sheet_1777560143589.jpg",
    name: "Samurai Pixel Sheet 2",
    frames: 64,
    columns: 8,
    rows: 8,
    frameWidth: 64,
    frameHeight: 64,
  },
  
  // Mixup sheet (16 frames, 4x4)
  mixup: {
    url: "/sprites/mixup_pizel_sheet_1777560143589.png",
    name: "Mixup Pixel Sheet",
    frames: 16,
    columns: 4,
    rows: 4,
    frameWidth: 128,
    frameHeight: 128,
  },
  
  // Gemini mecha sheets
  mecha_standard: {
    url: "/sprites/Gemini_Generated_Image_4ow4q94ow4q94ow4_1777560143587.png",
    name: "Mecha Standard",
    frames: 4,
    columns: 2,
    rows: 2,
    frameWidth: 256,
    frameHeight: 256,
  },
  mecha_large_1: {
    url: "/sprites/Gemini_Generated_Image_x4p22xx4p22xx4p2_1777560143588.png",
    name: "Mecha Large 1",
    frames: 1,
    columns: 1,
    rows: 1,
    frameWidth: 512,
    frameHeight: 512,
  },
  mecha_large_2: {
    url: "/sprites/Gemini_Generated_Image_x4p22xx4p22xx4p2_(1)_1777560143588.png",
    name: "Mecha Large 2",
    frames: 1,
    columns: 1,
    rows: 1,
    frameWidth: 512,
    frameHeight: 512,
  },
  
  // Classic Medarot sheets
  medarot_ds: {
    url: "/sprites/DS___DSi_-_Medarot_DS_-_Miscellaneous_-_Medabots_1777559149405.png",
    name: "Medarot DS Sheet",
    frames: 12,
    columns: 4,
    rows: 3,
    frameWidth: 256,
    frameHeight: 192,
  },
  medarot_cardbot: {
    url: "/sprites/Game_Boy___GBC_-_Medarot_Cardrobottle__Kabuto_Version___Kuwaga_1777559149406.png",
    name: "Medarot Cardbot Sheet",
    frames: 64,
    columns: 8,
    rows: 8,
    frameWidth: 160,
    frameHeight: 144,
  },
  
  // ChatGPT generated sprites
  chatgpt_1: {
    url: "/sprites/ChatGPT_Image_Apr_30,_2026,_10_30_12_AM_1777559639866.png",
    name: "ChatGPT Sprite 1",
    frames: 1,
    columns: 1,
    rows: 1,
    frameWidth: 512,
    frameHeight: 512,
  },
  chatgpt_2: {
    url: "/sprites/ChatGPT_Image_Apr_30,_2026,_10_33_32_AM_1777559639867.png",
    name: "ChatGPT Sprite 2",
    frames: 1,
    columns: 1,
    rows: 1,
    frameWidth: 512,
    frameHeight: 512,
  },
  chatgpt_3: {
    url: "/sprites/ChatGPT_Image_Apr_30,_2026,_10_33_32_AM_1777560143586.png",
    name: "ChatGPT Sprite 3",
    frames: 1,
    columns: 1,
    rows: 1,
    frameWidth: 512,
    frameHeight: 512,
  },
  chatgpt_4: {
    url: "/sprites/ChatGPT_Image_Apr_30,_2026,_10_40_02_AM_1777560143587.png",
    name: "ChatGPT Sprite 4",
    frames: 1,
    columns: 1,
    rows: 1,
    frameWidth: 512,
    frameHeight: 512,
  },
  
  // Icon/misc
  icon: {
    url: "/sprites/image_1777181964712.png",
    name: "Icon Sprite",
    frames: 1,
    columns: 1,
    rows: 1,
    frameWidth: 64,
    frameHeight: 64,
  },
} as const;

// Mecha portraits from src/assets/mecha/
export const MECHA_PORTRAITS = [
  "bakun", "daitenku", "fubuki", "hachibee", "hanzo",
  "hebi", "inari", "kabuto", "kagutsuchi", "kaiju",
  "kame", "karasu", "kirin", "kitsune", "kogitsune",
  "kujaku", "kumo", "mantisu", "masamune", "neko",
  "okami", "oni", "raijin", "ryuen", "shaku",
  "suzaku", "tengu", "tora", "tsuchinoko", "ushi",
  "yamata", "yoroi"
] as const;

// Map species IDs to mecha portraits
export const SPECIES_TO_PORTRAIT: Record<number, string> = {
  // Tier 1 - Commons (1-30)
  1: "kagutsuchi", 2: "kame", 3: "raijin", 4: "mantisu", 5: "tengu",
  6: "yoroi", 7: "suzaku", 8: "kirin", 9: "fubuki", 10: "hebi",
  11: "tsuchinoko", 12: "kogitsune", 13: "ryuen", 14: "daitenku", 15: "bakun",
  16: "okami", 17: "masamune", 18: "karasu", 19: "kaiju", 20: "yamata",
  21: "hachibee", 22: "hanzo", 23: "ushi", 24: "shaku", 25: "kabuto",
  26: "kitsune", 27: "oni", 28: "neko", 29: "kumo", 30: "kujaku",
  
  // Tier 2 - Evolved (31-55)
  31: "kaiju", 32: "kame", 33: "raijin", 34: "mantisu", 35: "tengu",
  36: "yoroi", 37: "kagutsuchi", 38: "daitenku", 39: "okami", 40: "hebi",
  41: "tsuchinoko", 42: "kogitsune", 43: "bakun", 44: "karasu", 45: "yamata",
  46: "masamune", 47: "fubuki", 48: "oni", 49: "suzaku", 50: "kirin",
  51: "hachibee", 52: "hanzo", 53: "ushi", 54: "kumo", 55: "shaku",
  
  // Tier 3 - Hybrids (56-70)
  56: "inari", 57: "tora", 58: "ryuen", 59: "neko", 60: "kujaku",
  61: "kabuto", 62: "kitsune", 63: "kogitsune", 64: "kumo", 65: "hebi",
  66: "kagutsuchi", 67: "raijin", 68: "yamata", 69: "kaiju", 70: "yoroi",
  
  // Tier 4 - Legendaries (71-82)
  71: "kagutsuchi", 72: "yamata", 73: "mantisu", 74: "raijin", 75: "tengu",
  76: "kagutsuchi", 77: "daitenku", 78: "fubuki", 79: "suzaku", 80: "yoroi",
  81: "oni", 82: "suzaku",
};

// Utility to get all assets for validation
export function getAllAssets() {
  return {
    spriteSheets: Object.entries(SPRITE_SHEETS).map(([key, config]) => ({
      key,
      ...config,
      type: "spriteSheet" as const,
    })),
    portraits: MECHA_PORTRAITS.map(name => ({
      key: name,
      url: `/assets/mecha/${name}.png`,
      name,
      type: "portrait" as const,
    })),
  };
}

// Validate all assets are accessible
export async function validateAssets(): Promise<{
  valid: string[];
  failed: string[];
}> {
  const assets = getAllAssets();
  const results = { valid: [] as string[], failed: [] as string[] };
  
  // Check sprite sheets
  for (const sheet of assets.spriteSheets) {
    try {
      const response = await fetch(sheet.url, { method: "HEAD" });
      if (response.ok) {
        results.valid.push(`spriteSheet:${sheet.key}`);
      } else {
        results.failed.push(`spriteSheet:${sheet.key} (${response.status})`);
      }
    } catch (e) {
      results.failed.push(`spriteSheet:${sheet.key} (error)`);
    }
  }
  
  return results;
}
