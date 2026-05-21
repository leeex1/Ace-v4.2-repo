import { RONIN_BORG_SPECIES, type RoninBorgSpecies } from "../../game/roninBorgDatabase";

// Cyberpunk-themed Ronin Borg portrait map
export const RONIN_BORG_PORTRAIT: Record<number, string> = {
  // Starter Ronin Borgs - Cyberpunk variants
  101: "ronin_neon_kensei",      // Neon Kensei - Electric starter
  102: "ronin_chrome_shogun",     // Chrome Shogun - Heavy starter  
  103: "ronin_phantom_strider",    // Phantom Strider - Fast starter
  
  // Basic cyberpunk Ronin Borgs
  201: "ronin_volt_basic",      // Basic electric Ronin
  202: "ronin_aqua_basic",       // Basic water Ronin
  203: "ronin_pyro_basic",       // Basic fire Ronin
  204: "ronin_terra_basic",      // Basic grass Ronin
  205: "ronin_cyber_basic",      // Basic psychic Ronin
  206: "ronin_shadow_basic",      // Basic dark Ronin
  207: "ronin_nova_basic",       // Basic normal Ronin
  
  // Evolved forms (Stage 1)
  211: "ronin_volt_stage1",    // Evolved electric
  212: "ronin_aqua_stage1",     // Evolved water
  213: "ronin_pyro_stage1",     // Evolved fire
  214: "ronin_terra_stage1",    // Evolved grass
  215: "ronin_cyber_stage1",   // Evolved psychic
  216: "ronin_shadow_stage1",    // Evolved dark
  217: "ronin_nova_stage1",     // Evolved normal
  
  // Evolved forms (Stage 2)
  221: "ronin_volt_stage2",    // Final electric form
  222: "ronin_aqua_stage2",     // Final water form
  223: "ronin_pyro_stage2",     // Final fire form
  224: "ronin_terra_stage2",    // Final grass form
  225: "ronin_cyber_stage2",   // Final psychic form
  226: "ronin_shadow_stage2",    // Final dark form
  227: "ronin_nova_stage2",     // Final normal form
  
  // Robo Olympians (Legendary bosses)
  301: "ronin_zeus_omega",      // Zeus - Electric/Lightning
  302: "ronin_poseidon_omega",   // Poseidon - Water/ice
  303: "ronin_hades_omega",      // Hades - Dark/fire
  304: "ronin_ares_omega",       // Ares - Fire/war
  305: "ronin_athena_omega",     // Athena - Psychic/wisdom
  306: "ronin_hermes_blink",     // Hermes - Speed/trickster
};

// Helper function to get Ronin Borg species info
export function getRoninBorgSpecies(speciesId: number) {
  return RONIN_BORG_SPECIES[speciesId];
}

// Helper function to check if a Ronin Borg is legendary
export function isLegendaryRoninBorg(speciesId: number): boolean {
  return speciesId >= 301 && speciesId <= 306;
}
