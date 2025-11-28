// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Game Type Definitions
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Mini-game types available in Red Protocol
 */
export type PuzzleType =
  | "VISUAL_SEARCH"    // 3D: Find hidden object in scene
  | "SCRATCH"          // 2D: Scratch overlay to reveal clue
  | "UV_LIGHT"         // 3D: Use UV light to reveal hidden text
  | "RADIO_TUNING"     // UI: Tune radio to correct frequency
  | "PUZZLE_ASSEMBLY"  // 2D: Drag and drop puzzle pieces
  | "PASSWORD"         // UI: Enter correct password/code
  | "CIPHER"           // UI: Decode encrypted message
  | "FINGERPRINT"      // 3D: Match fingerprint patterns
  | "AUDIO_ANALYSIS"   // UI: Analyze audio waveform
  | "PHOTOGRAPH"       // 3D: Take photo of specific element;

/**
 * Puzzle state machine
 */
export type PuzzleState = "LOCKED" | "ACTIVE" | "SOLVED";

/**
 * Day data structure - represents one day of investigation
 */
export interface DayData {
  day: number;
  title: string;
  type: PuzzleType;
  description: string;
  clueAsset: string;
  solution: string | null;
  aiContext: string;
  hints: string[];
  reward?: string;
  unlockRequirements?: {
    previousDay?: boolean;
    inventoryItem?: string;
  };
}

/**
 * Inventory item structure
 */
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  dayFound: number;
  isKeyItem: boolean;
}

/**
 * Chat message structure for Agent K
 */
export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  content: string;
  timestamp: Date;
  action?: {
    type: "TOGGLE_UV" | "VALIDATE_PUZZLE" | "GIVE_HINT" | "UNLOCK_ITEM";
    payload?: unknown;
  };
}

/**
 * Game progress structure
 */
export interface GameProgress {
  currentDay: number;
  unlockedDays: number[];
  solvedDays: number[];
  inventory: InventoryItem[];
  totalPlayTime: number;
  lastPlayed: Date;
}

/**
 * 3D Object interaction data
 */
export interface InteractableObject {
  id: string;
  meshName: string;
  dayRequired: number;
  interactionType: "click" | "hover" | "drag" | "uv_reveal";
  isDiscovered: boolean;
  position: [number, number, number];
}

