// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Asset Manifest
// Centralized configuration for all game textures and images
// ═══════════════════════════════════════════════════════════════════════════════

export interface TextureAsset {
  id: string;
  path: string;
  type: "texture" | "image" | "sprite";
  description: string;
  resolution: [number, number];
  seamless?: boolean;
}

export interface SuspectAsset {
  id: string;
  name: string;
  alias: string;
  mugshot: string;
  slateNumber: string;
  description: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Environment Textures
// ═══════════════════════════════════════════════════════════════════════════════
export const TEXTURES: Record<string, TextureAsset> = {
  DESK_WOOD: {
    id: "desk_wood",
    path: "/assets/textures/desk_wood.jpg",
    type: "texture",
    description: "Dark mahogany desk surface with wear and coffee stains",
    resolution: [2048, 2048],
    seamless: true,
  },
  FOLDER_MANILA: {
    id: "folder_manila",
    path: "/assets/textures/folder_manila.jpg",
    type: "texture",
    description: "Yellowed manila folder with TOP SECRET stamp",
    resolution: [1024, 1024],
  },
  MAP_NORTHPOLE: {
    id: "map_northpole",
    path: "/assets/textures/map_northpole.jpg",
    type: "texture",
    description: "Vintage North Pole map with Sector 9 marked",
    resolution: [2048, 1024],
  },
  LEATHER_PAD: {
    id: "leather_pad",
    path: "/assets/textures/leather_pad.jpg",
    type: "texture",
    description: "Worn black leather desk pad",
    resolution: [1024, 1024],
    seamless: true,
  },
  PAPER_NOTES: {
    id: "paper_notes",
    path: "/assets/textures/paper_notes.jpg",
    type: "texture",
    description: "Scattered paper notes texture",
    resolution: [1024, 1024],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// Suspects Database
// ═══════════════════════════════════════════════════════════════════════════════
export const SUSPECTS: SuspectAsset[] = [
  {
    id: "suspect_elf",
    name: "Jingle Skarsgård",
    alias: "The Elf Gangster",
    mugshot: "/assets/suspects/elf_gangster.jpg",
    slateNumber: "98-25",
    description: "Former toy assembly line supervisor. Scar over left eye. Known associate of underground Christmas operations.",
  },
  {
    id: "suspect_frost",
    name: "Jack Frost",
    alias: "The Cold One",
    mugshot: "/assets/suspects/jack_frost.jpg",
    slateNumber: "00-❄️",
    description: "Professional problem solver. Leaves no witnesses. Suspected in 12 cold cases - literally.",
  },
  {
    id: "suspect_rudolph",
    name: "Rudolph Reindeer",
    alias: "Red Nose",
    mugshot: "/assets/suspects/rudolph.jpg",
    slateNumber: "RD-01",
    description: "Former navigation specialist. Broke nose detected. Currently cooperating with investigation.",
  },
  {
    id: "suspect_mrs_claus",
    name: "Martha Claus",
    alias: "The Godmother",
    mugshot: "/assets/suspects/mrs_claus.jpg",
    slateNumber: "MRS-01",
    description: "Runs the North Pole with an iron fist in a velvet glove. Nothing happens without her approval.",
  },
  {
    id: "suspect_krampus",
    name: "Krampus",
    alias: "The Enforcer",
    mugshot: "/assets/suspects/krampus.jpg",
    slateNumber: "KR-666",
    description: "Handles 'discipline' for the organization. Last seen near Sector 9.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Day-specific Evidence Assets
// ═══════════════════════════════════════════════════════════════════════════════
export const DAY_ASSETS: Record<number, Record<string, TextureAsset>> = {
  1: {
    CRASH_POLAROID: {
      id: "crash_polaroid",
      path: "/assets/day1/crash_polaroid.jpg",
      type: "image",
      description: "Crime scene photo of sleigh crash",
      resolution: [1024, 1024],
    },
    CRASH_SCENE: {
      id: "crash_scene",
      path: "/assets/day1/crash_scene.glb",
      type: "texture",
      description: "3D model of crash scene",
      resolution: [0, 0],
    },
  },
  2: {
    FROZEN_HANDPRINT: {
      id: "frozen_handprint",
      path: "/assets/day2/frozen_handprint.jpg",
      type: "image",
      description: "4-finger handprint in frost",
      resolution: [1024, 1024],
    },
    FROST_OVERLAY: {
      id: "frost_overlay",
      path: "/assets/day2/frost_overlay.png",
      type: "sprite",
      description: "Scratchable frost layer",
      resolution: [1024, 1024],
    },
  },
  3: {
    MAP_PIECE_1: {
      id: "map_piece_1",
      path: "/assets/day3/map_piece_1.png",
      type: "sprite",
      description: "Top-left map fragment",
      resolution: [512, 512],
    },
    MAP_PIECE_2: {
      id: "map_piece_2",
      path: "/assets/day3/map_piece_2.png",
      type: "sprite",
      description: "Top-right map fragment",
      resolution: [512, 512],
    },
    MAP_PIECE_3: {
      id: "map_piece_3",
      path: "/assets/day3/map_piece_3.png",
      type: "sprite",
      description: "Bottom-left map fragment",
      resolution: [512, 512],
    },
    MAP_PIECE_4: {
      id: "map_piece_4",
      path: "/assets/day3/map_piece_4.png",
      type: "sprite",
      description: "Bottom-right map fragment",
      resolution: [512, 512],
    },
  },
  4: {
    CARD_NORMAL: {
      id: "card_normal",
      path: "/assets/day4/card_normal.jpg",
      type: "texture",
      description: "Blank white business card",
      resolution: [1024, 512],
    },
    CARD_UV: {
      id: "card_uv",
      path: "/assets/day4/card_uv.jpg",
      type: "texture",
      description: "Business card under UV light showing 8821",
      resolution: [1024, 512],
    },
  },
  5: {
    RADIO_VINTAGE: {
      id: "radio_vintage",
      path: "/assets/day5/radio_vintage.jpg",
      type: "image",
      description: "1960s military radio receiver",
      resolution: [1024, 768],
    },
  },
  6: {
    VIAL_BLUE: {
      id: "vial_blue",
      path: "/assets/day6/vial_blue.png",
      type: "sprite",
      description: "Glowing blue vial of unknown substance",
      resolution: [512, 512],
    },
  },
  9: {
    CCTV_FOOTAGE: {
      id: "cctv_footage",
      path: "/assets/day9/cctv_footage.jpg",
      type: "image",
      description: "Grainy security footage at 23:47",
      resolution: [1920, 1080],
    },
  },
  12: {
    RANSOM_NOTE: {
      id: "ransom_note",
      path: "/assets/day12/ransom_note.jpg",
      type: "texture",
      description: "Cut-out letter ransom note",
      resolution: [1024, 1024],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UI Assets
// ═══════════════════════════════════════════════════════════════════════════════
export const UI_ASSETS: Record<string, TextureAsset> = {
  CRT_TERMINAL: {
    id: "crt_terminal",
    path: "/assets/ui/crt_terminal.jpg",
    type: "image",
    description: "CRT monitor background with scanlines",
    resolution: [1920, 1080],
  },
  CASE_FILE_BG: {
    id: "case_file_bg",
    path: "/assets/ui/case_file_bg.jpg",
    type: "image",
    description: "Evidence box background for inventory",
    resolution: [1920, 1080],
  },
  LOADING_SCREEN: {
    id: "loading_screen",
    path: "/assets/ui/loading_screen.jpg",
    type: "image",
    description: "Noir desk loading screen",
    resolution: [1920, 1080],
  },
  MAIN_MENU_BG: {
    id: "main_menu_bg",
    path: "/assets/ui/main_menu_bg.jpg",
    type: "image",
    description: "Snowy crime scene main menu background",
    resolution: [1920, 1080],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all assets for a specific day
 */
export function getDayAssets(day: number): Record<string, TextureAsset> | undefined {
  return DAY_ASSETS[day];
}

/**
 * Get suspect by ID
 */
export function getSuspect(id: string): SuspectAsset | undefined {
  return SUSPECTS.find((s) => s.id === id);
}

/**
 * Get all texture paths for preloading
 */
export function getAllTexturePaths(): string[] {
  const paths: string[] = [];

  // Environment textures
  Object.values(TEXTURES).forEach((t) => paths.push(t.path));

  // UI assets
  Object.values(UI_ASSETS).forEach((t) => paths.push(t.path));

  // Day assets
  Object.values(DAY_ASSETS).forEach((dayAssets) => {
    Object.values(dayAssets).forEach((t) => paths.push(t.path));
  });

  // Suspect mugshots
  SUSPECTS.forEach((s) => paths.push(s.mugshot));

  return paths;
}

/**
 * Preload critical assets (returns promise)
 */
export async function preloadAssets(paths: string[]): Promise<void> {
  const promises = paths.map((path) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load: ${path}`));
      img.src = path;
    });
  });

  await Promise.all(promises);
}

