// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Game Data
// The 24 Days of Noir Christmas Investigation
// ═══════════════════════════════════════════════════════════════════════════════

import { DayData } from "@/src/types/game.types";

/**
 * Complete game data for all 24 days of investigation
 * Each day represents a new puzzle/mini-game with narrative progression
 */
export const GAME_DAYS: DayData[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // WEEK 1: THE DISCOVERY (Days 1-7)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    day: 1,
    title: "The Crash",
    type: "VISUAL_SEARCH",
    description: `December 1st, 1994. 11:47 PM.
    
The call came in cold—like everything else that night. A delivery truck jackknifed on Route 9, 
spilling its cargo across the frozen highway. Standard accident report... until we found what 
wasn't on the manifest.

Hidden among the Christmas decorations: a small blue vial. No label. No explanation. 
Just frost and silence.

Find it, detective. Before someone else does.`,
    clueAsset: "/assets/day1/crash_scene.glb",
    solution: "BLUE_VIAL",
    aiContext: `Day 1 context: The player is investigating a crash scene in the snow. 
They need to find a hidden blue vial among debris. The vial contains an unknown substance 
and is the first piece of evidence in a larger conspiracy. Guide them to look carefully 
in the snow near the overturned crates. The vial glows faintly.`,
    hints: [
      "The cargo scattered everywhere... but something doesn't belong.",
      "Look where the snow meets the shadows. Something's glowing faint blue.",
      "Near the crates on the left side. It almost blends with the frost.",
    ],
    reward: "Blue Vial",
  },

  {
    day: 2,
    title: "Frozen Door",
    type: "SCRATCH",
    description: `December 2nd. The vial led us here—an abandoned warehouse on the edge of town.
    
The entrance is sealed. Not by locks, but by ice. Thick frost covers every surface, 
hiding what lies beneath. But frost tells stories too, if you know how to read it.

Someone touched this door recently. Their warmth left a mark.
Scratch away the frost. Find the handprint. Count the fingers.`,
    clueAsset: "/assets/day2/frozen_door.png",
    solution: "4",
    aiContext: `Day 2 context: The player must scratch away frost from a frozen door 
to reveal a handprint underneath. The handprint has only 4 fingers—someone is missing 
a finger. This is a key identifying feature of a suspect. The scratch mechanic uses 
the mouse/touch to "erase" the frost layer.`,
    hints: [
      "Use your cursor to scratch the frost. Someone touched this door.",
      "Focus on the center of the door. The warmth left a mark.",
      "Count carefully. How many fingers do you see?",
    ],
    reward: "Photograph: 4-Finger Print",
  },

  {
    day: 3,
    title: "Torn Map",
    type: "PUZZLE_ASSEMBLY",
    description: `December 3rd. Inside the warehouse, chaos.

Files scattered. Equipment destroyed. Someone left in a hurry—and they didn't 
want us following. But they missed something: a map, torn to pieces and 
thrown in the trash.

Four fragments. One destination.
Piece it together, detective. Where were they heading?`,
    clueAsset: "/assets/day3/map_pieces.png",
    solution: "SECTOR 9",
    aiContext: `Day 3 context: The player must drag and drop 4 map pieces to 
reassemble a torn map. When correctly assembled, the map reveals "Sector 9" 
as a location. This is a restricted industrial zone outside the city. 
Help them understand the drag-and-drop mechanics if needed.`,
    hints: [
      "Drag the pieces to their correct positions. Edges should align.",
      "Look for matching roads and contours between pieces.",
      "Once assembled, read the circled location. What sector is marked?",
    ],
    reward: "Map Fragment: Sector 9",
  },

  {
    day: 4,
    title: "Blank Card",
    type: "UV_LIGHT",
    description: `December 4th. The warehouse yielded more secrets.

In a locked drawer: a plain white business card. Blank on both sides.
No name. No number. Nothing visible to the naked eye.

But some messages aren't meant to be seen in daylight.
You'll need the UV light from your kit. Some truths only shine in the dark.`,
    clueAsset: "/assets/day4/blank_card.glb",
    solution: "8821",
    aiContext: `Day 4 context: The player must use a UV light tool to reveal 
hidden text on a white business card. When UV is activated, the numbers "8821" 
appear—this is an access code. Tell them to type "UV" or "light" to toggle 
the UV flashlight if they're stuck.`,
    hints: [
      "The card looks blank, but appearances deceive. Try the UV light.",
      "Type 'UV' or 'light' in the chat to toggle your ultraviolet flashlight.",
      "Four digits. A code for something. Write it down.",
    ],
    reward: "Access Code: 8821",
  },

  {
    day: 5,
    title: "The Signal",
    type: "RADIO_TUNING",
    description: `December 5th. Code 8821 opened a frequency-locked radio in the warehouse.

Static fills the air. Somewhere in the noise, a voice is trying to reach us.
An old numbers station—Cold War relic. Someone's still broadcasting.

Tune to the right frequency. Listen carefully.
The voice will tell you where to go next.`,
    clueAsset: "/assets/day5/radio.glb",
    solution: "94.5",
    aiContext: `Day 5 context: The player must tune a radio dial to frequency 94.5 FM. 
When tuned correctly, they hear a recorded voice message with coordinates. 
The UI shows a frequency display and a tuning knob. Help them understand 
they need to rotate the dial until they hear clear audio instead of static.`,
    hints: [
      "Rotate the dial slowly. Listen for when the static clears.",
      "The frequency is between 90 and 100 FM. A popular band.",
      "94.5. That's when the voice comes through.",
    ],
    reward: "Recording: Numbers Station",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DAYS 6-24: Placeholder structure (to be expanded)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    day: 6,
    title: "The Photograph",
    type: "VISUAL_SEARCH",
    description: `December 6th. The numbers station gave coordinates to an old photo lab.
Inside: hundreds of photographs, all seemingly ordinary Christmas scenes.
But one of them hides a face we need to find.`,
    clueAsset: "/assets/day6/photo_wall.glb",
    solution: "SUSPECT_FACE",
    aiContext: `Day 6: Find a specific photograph showing a suspicious figure 
in the background of a Christmas party. The figure has 4 fingers visible.`,
    hints: [
      "Look at the backgrounds, not the subjects.",
      "Someone wasn't supposed to be in frame.",
      "Check the photograph on the upper right.",
    ],
    reward: "Photograph: Unknown Subject",
  },

  {
    day: 7,
    title: "Chemical Analysis",
    type: "PASSWORD",
    description: `December 7th. Time to analyze the blue vial from Day 1.
The lab computer requires a password. Check your collected evidence.`,
    clueAsset: "/assets/day7/lab_terminal.png",
    solution: "8821",
    aiContext: `Day 7: The player needs to enter the code 8821 (from Day 4) 
to access the lab computer and analyze the vial contents.`,
    hints: [
      "You've seen this code before. Check your inventory.",
      "The blank card revealed numbers under UV light.",
      "8821 - your access code.",
    ],
    reward: "Lab Report: Compound X-24",
  },

  {
    day: 8,
    title: "Fingerprint Match",
    type: "FINGERPRINT",
    description: `December 8th. The 4-finger print needs identification.
Cross-reference with the police database.`,
    clueAsset: "/assets/day8/fingerprint_scanner.glb",
    solution: "VICTOR_CRANE",
    aiContext: `Day 8: Match the 4-finger print from Day 2 with database records.
The match reveals Victor Crane, a former chemical engineer.`,
    hints: [
      "Upload the print from your inventory.",
      "Only one record has a missing finger.",
      "Victor Crane. Remember that name.",
    ],
    reward: "Dossier: Victor Crane",
  },

  {
    day: 9,
    title: "Sector 9 Gate",
    type: "CIPHER",
    description: `December 9th. You've arrived at Sector 9.
The gate has a cipher lock. Decode the message to enter.`,
    clueAsset: "/assets/day9/cipher_lock.png",
    solution: "CHIMERA",
    aiContext: `Day 9: Decode a Caesar cipher to reveal the password "CHIMERA".
This is the codename for the operation.`,
    hints: [
      "It's a substitution cipher. Each letter is shifted.",
      "Try shifting by 3 positions.",
      "CHIMERA - a monster made of parts.",
    ],
    reward: "Codename: CHIMERA",
  },

  {
    day: 10,
    title: "Security Footage",
    type: "VISUAL_SEARCH",
    description: `December 10th. Inside Sector 9, security monitors still work.
Review the footage. Find the timestamp that matters.`,
    clueAsset: "/assets/day10/security_room.glb",
    solution: "23:47",
    aiContext: `Day 10: Scrub through security footage to find the moment 
a figure enters the facility at 23:47.`,
    hints: [
      "The footage spans midnight to 6 AM.",
      "Look for movement near the loading dock.",
      "23:47 - that's when it happens.",
    ],
    reward: "Timestamp: 23:47",
  },

  // Days 11-24: Minimal placeholders for now
  ...Array.from({ length: 14 }, (_, i) => ({
    day: 11 + i,
    title: `Investigation Day ${11 + i}`,
    type: (["VISUAL_SEARCH", "SCRATCH", "UV_LIGHT", "PUZZLE_ASSEMBLY", "PASSWORD", "RADIO_TUNING"] as const)[i % 6],
    description: `December ${11 + i}th. The investigation continues...
[Content to be revealed]`,
    clueAsset: `/assets/day${11 + i}/placeholder.glb`,
    solution: null,
    aiContext: `Day ${11 + i}: Placeholder context for future content.`,
    hints: ["Hint coming soon...", "Keep investigating...", "The truth awaits..."],
    reward: undefined,
  })),
];

/**
 * Get day data by day number
 */
export function getDayData(day: number): DayData | undefined {
  return GAME_DAYS.find((d) => d.day === day);
}

/**
 * Get all unlocked days based on progress
 */
export function getUnlockedDays(unlockedDays: number[]): DayData[] {
  return GAME_DAYS.filter((d) => unlockedDays.includes(d.day));
}

/**
 * Check if a solution is correct for a given day
 */
export function validateSolution(day: number, answer: string): boolean {
  const dayData = getDayData(day);
  if (!dayData || !dayData.solution) return false;
  return dayData.solution.toUpperCase() === answer.toUpperCase();
}

/**
 * Get puzzle type display name
 */
export function getPuzzleTypeName(type: string): string {
  const names: Record<string, string> = {
    VISUAL_SEARCH: "Visual Search",
    SCRATCH: "Scratch & Reveal",
    UV_LIGHT: "UV Analysis",
    RADIO_TUNING: "Radio Tuning",
    PUZZLE_ASSEMBLY: "Puzzle Assembly",
    PASSWORD: "Password Entry",
    CIPHER: "Cipher Decode",
    FINGERPRINT: "Fingerprint Analysis",
    AUDIO_ANALYSIS: "Audio Analysis",
    PHOTOGRAPH: "Photography",
  };
  return names[type] || type;
}

