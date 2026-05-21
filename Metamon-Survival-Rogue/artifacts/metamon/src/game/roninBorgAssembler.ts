import { PART_TYPES, type PartType } from "./constants";
import { RONIN_BORG_PARTS, type RoninBorgPart, type RoninBorgParts } from "./roninBorgDatabase";

export interface AssembledRoninBorg {
  speciesId: number;
  speciesName: string;
  evolutionStage: number;
  level: number;
  experience: number;
  parts: RoninBorgParts;
  nickname?: string;
  stats: {
    hp: number;
    atk: number;
    def: number;
    spd: number;
  };
}

export class RoninBorgAssembler {
  private static readonly PART_ORDER: PartType[] = [
    "tail", // Tail/back goes first for layering
    "body", 
    "legs",
    "arms",
    "head", // Head goes last for top layer
  ];

  /**
   * Creates a complete Ronin Borg from individual parts
   */
  static assembleRoninBorg(
    speciesId: number,
    evolutionStage: number,
    level: number,
    experience: number,
    parts: RoninBorgParts,
    nickname?: string
  ): AssembledRoninBorg {
    const species = RONIN_BORG_SPECIES[speciesId];
    if (!species) {
      throw new Error(`Unknown species ID: ${speciesId}`);
    }

    // Calculate base stats from parts
    let totalHp = 50 + (level * 10);
    let totalAtk = 30 + (level * 5);
    let totalDef = 20 + (level * 3);
    let totalSpd = 15 + (level * 2);

    // Add individual part bonuses
    PART_TYPES.forEach(partType => {
      const partId = parts[partType];
      if (partId && RONIN_BORG_PARTS[partId]) {
        const part = RONIN_BORG_PARTS[partId];
        totalHp += part.hpBonus;
        totalAtk += part.atkBonus;
        totalDef += part.defBonus;
        totalSpd += part.spdBonus;
      }
    });

    return {
      speciesId,
      speciesName: species.speciesName,
      evolutionStage,
      level,
      experience,
      parts,
      nickname,
      stats: {
        hp: totalHp,
        atk: totalAtk,
        def: totalDef,
        spd: totalSpd
      }
    };
  }

  /**
   * Slices a sprite into individual parts for assembly
   */
  static sliceSpriteForAssembly(
    ctx: CanvasRenderingContext2D,
    sprite: HTMLImageElement,
    partRects: Record<PartType, { x: number; y: number; width: number; height: number }>
  ): Record<PartType, HTMLCanvasElement> {
    const slicedParts: Record<PartType, HTMLCanvasElement> = {} as Record<PartType, HTMLCanvasElement>;

    // Create temporary canvas for slicing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return slicedParts;

    // Set canvas size to match sprite
    tempCanvas.width = sprite.width;
    tempCanvas.height = sprite.height;
    tempCtx.drawImage(sprite, 0, 0);

    // Slice each part according to predefined rectangles
    this.PART_ORDER.forEach(partType => {
      const rect = partRects[partType];
      if (!rect) return;

      const partCanvas = document.createElement('canvas');
      const partCtx = partCanvas.getContext('2d');
      if (!partCtx) return;

      partCanvas.width = rect.width;
      partCanvas.height = rect.height;

      // Extract the part from the main sprite
      partCtx.drawImage(
        sprite,
        rect.x, rect.y, rect.width, rect.height,
        0, 0, rect.width, rect.height
      );

      // Create the sliced part canvas
      slicedParts[partType] = partCanvas;
    });

    return slicedParts;
  }

  /**
   * Generates part rectangles for standard Ronin Borg assembly
   * These are standardized positions for consistent assembly
   */
  static generateStandardPartRects(spriteWidth: number, spriteHeight: number): Record<PartType, { x: number; y: number; width: number; height: number }> {
    const centerX = spriteWidth / 2;
    const centerY = spriteHeight / 2;

    return {
      tail: { // Tail
        x: centerX - 15,
        y: centerY + 20,
        width: 30,
        height: 25
      },
      body: { // Main torso
        x: centerX - 20,
        y: centerY - 10,
        width: 40,
        height: 35
      },
      legs: { // Lower body
        x: centerX - 15,
        y: centerY + 5,
        width: 30,
        height: 20
      },
      arms: { // Upper body
        x: centerX + 15,
        y: centerY - 5,
        width: 25,
        height: 15
      },
      head: { // Top layer
        x: centerX,
        y: centerY - 25,
        width: 35,
        height: 20
      }
    };
  }

  /**
   * Draws an assembled Ronin Borg from sliced parts
   */
  static drawAssembledRoninBorg(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    assembledBorg: AssembledRoninBorg
  ): void {
    const { parts, stats } = assembledBorg;

    // Draw parts in correct order for proper layering
    this.PART_ORDER.forEach(partType => {
      const partId = parts[partType];
      if (!partId) return;

      const partCanvas = document.createElement('canvas') as HTMLCanvasElement;
      const partCtx = partCanvas.getContext('2d');
      if (!partCtx) return;

      // Get the actual part image from the part database
      const part = RONIN_BORG_PARTS[partId];
      
      // For now, we'll use colored rectangles as placeholders
      // In a full implementation, this would draw the actual sliced sprite parts
      ctx.fillStyle = this.getPartColor(part.rarity);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;

      // Draw a placeholder rectangle for each part
      switch (partType) {
        case 'back':
          ctx.fillRect(x - 10, y + 15, 20, 8);
          break;
        case 'body':
          ctx.fillRect(x - 15, y - 5, 30, 20);
          break;
        case 'legs':
          ctx.fillRect(x - 10, y + 5, 25, 15);
          break;
        case 'arms':
          ctx.fillRect(x + 15, y - 5, 25, 10);
          break;
        case 'head':
          ctx.fillRect(x, y - 20, 30, 15);
          break;
      }

      ctx.stroke();
    });

    // Draw stats overlay
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.fillText(`HP: ${stats.hp}`, x - 40, y + 30);
    ctx.fillText(`ATK: ${stats.atk}`, x - 40, y + 45);
    ctx.fillText(`DEF: ${stats.def}`, x - 40, y + 60);
    ctx.fillText(`SPD: ${stats.spd}`, x - 40, y + 75);

    // Draw nickname if present
    if (assembledBorg.nickname) {
      ctx.fillStyle = '#0ff';
      ctx.font = '12px monospace';
      ctx.fillText(`"${assembledBorg.nickname}"`, x - 40, y);
    }
  }

  /**
   * Gets color based on part rarity
   */
  private static getPartColor(rarity: string): string {
    const colors = {
      common: '#ccc',
      uncommon: '#4c8',
      rare: '#49e',
      ultra_rare: '#29f',
      super_rare: '#c4f',
      mega_rare: '#d4f',
      legendary: '#ffd700'
    };
    return colors[rarity as keyof typeof colors] || '#fff';
  }

  /**
   * Validates that all required parts are present
   */
  static validateRoninBorg(parts: RoninBorgParts): boolean {
    const requiredParts: PartType[] = ['head', 'body', 'arms', 'legs', 'tail', 'weapon'];
    return requiredParts.every(partType => parts[partType]);
  }
}
