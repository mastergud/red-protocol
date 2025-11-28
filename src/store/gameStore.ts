// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Game State Store (Zustand)
// Central state management for the investigation game
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  PuzzleState,
  InventoryItem,
  ChatMessage,
} from "@/src/types/game.types";
import { getDayData, validateSolution } from "@/src/data/gameData";

// ═══════════════════════════════════════════════════════════════════════════════
// State Interface
// ═══════════════════════════════════════════════════════════════════════════════
interface GameState {
  // Progress
  currentDay: number;
  unlockedDays: number[];
  solvedDays: number[];

  // Inventory
  inventory: InventoryItem[];

  // Puzzle State
  currentPuzzleState: PuzzleState;
  puzzleProgress: Record<number, number>; // day -> progress percentage

  // Tools
  isUvLightActive: boolean;
  isFlashlightActive: boolean;
  selectedTool: string | null;

  // Agent K Chat
  chatMessages: ChatMessage[];
  isChatOpen: boolean;

  // UI State
  isInventoryOpen: boolean;
  currentHintIndex: Record<number, number>; // day -> hint index shown

  // Audio
  isMuted: boolean;
  radioFrequency: number;

  // Actions - Progress
  setCurrentDay: (day: number) => void;
  unlockNextDay: () => void;
  unlockDay: (day: number) => void;
  solvePuzzle: (day: number) => void;

  // Actions - Inventory
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;

  // Actions - Tools
  toggleUvLight: () => void;
  toggleFlashlight: () => void;
  selectTool: (tool: string | null) => void;

  // Actions - Puzzle
  setPuzzleState: (state: PuzzleState) => void;
  updatePuzzleProgress: (day: number, progress: number) => void;
  validateAnswer: (day: number, answer: string) => boolean;

  // Actions - Chat
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  toggleChat: () => void;
  clearChat: () => void;

  // Actions - UI
  toggleInventory: () => void;
  getNextHint: (day: number) => string | null;

  // Actions - Audio
  toggleMute: () => void;
  setRadioFrequency: (freq: number) => void;

  // Actions - Game
  resetGame: () => void;
  loadProgress: (progress: Partial<GameState>) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Initial State
// ═══════════════════════════════════════════════════════════════════════════════
const initialState = {
  currentDay: 1,
  unlockedDays: [1],
  solvedDays: [],
  inventory: [],
  currentPuzzleState: "ACTIVE" as PuzzleState,
  puzzleProgress: {},
  isUvLightActive: false,
  isFlashlightActive: false,
  selectedTool: null,
  chatMessages: [],
  isChatOpen: false,
  isInventoryOpen: false,
  currentHintIndex: {},
  isMuted: false,
  radioFrequency: 88.0,
};

// ═══════════════════════════════════════════════════════════════════════════════
// Store Creation
// ═══════════════════════════════════════════════════════════════════════════════
export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ─────────────────────────────────────────────────────────────────────
        // Progress Actions
        // ─────────────────────────────────────────────────────────────────────
        setCurrentDay: (day) =>
          set(
            (state) => ({
              currentDay: day,
              currentPuzzleState: state.solvedDays.includes(day)
                ? "SOLVED"
                : "ACTIVE",
            }),
            false,
            "setCurrentDay"
          ),

        unlockNextDay: () =>
          set(
            (state) => {
              const nextDay = state.currentDay + 1;
              if (nextDay <= 24 && !state.unlockedDays.includes(nextDay)) {
                return {
                  unlockedDays: [...state.unlockedDays, nextDay],
                };
              }
              return state;
            },
            false,
            "unlockNextDay"
          ),

        unlockDay: (day) =>
          set(
            (state) => {
              if (!state.unlockedDays.includes(day)) {
                return {
                  unlockedDays: [...state.unlockedDays, day].sort((a, b) => a - b),
                };
              }
              return state;
            },
            false,
            "unlockDay"
          ),

        solvePuzzle: (day) =>
          set(
            (state) => {
              if (!state.solvedDays.includes(day)) {
                const dayData = getDayData(day);
                const newInventory = [...state.inventory];

                // Add reward to inventory if exists
                if (dayData?.reward) {
                  newInventory.push({
                    id: `reward_day_${day}`,
                    name: dayData.reward,
                    description: `Evidence from Day ${day}: ${dayData.title}`,
                    icon: "📦",
                    dayFound: day,
                    isKeyItem: true,
                  });
                }

                return {
                  solvedDays: [...state.solvedDays, day],
                  currentPuzzleState: "SOLVED",
                  inventory: newInventory,
                  puzzleProgress: { ...state.puzzleProgress, [day]: 100 },
                };
              }
              return state;
            },
            false,
            "solvePuzzle"
          ),

        // ─────────────────────────────────────────────────────────────────────
        // Inventory Actions
        // ─────────────────────────────────────────────────────────────────────
        addToInventory: (item) =>
          set(
            (state) => {
              if (!state.inventory.find((i) => i.id === item.id)) {
                return { inventory: [...state.inventory, item] };
              }
              return state;
            },
            false,
            "addToInventory"
          ),

        removeFromInventory: (itemId) =>
          set(
            (state) => ({
              inventory: state.inventory.filter((i) => i.id !== itemId),
            }),
            false,
            "removeFromInventory"
          ),

        hasItem: (itemId) => {
          return get().inventory.some((i) => i.id === itemId);
        },

        // ─────────────────────────────────────────────────────────────────────
        // Tool Actions
        // ─────────────────────────────────────────────────────────────────────
        toggleUvLight: () =>
          set(
            (state) => ({
              isUvLightActive: !state.isUvLightActive,
              selectedTool: !state.isUvLightActive ? "uv_light" : null,
            }),
            false,
            "toggleUvLight"
          ),

        toggleFlashlight: () =>
          set(
            (state) => ({
              isFlashlightActive: !state.isFlashlightActive,
              selectedTool: !state.isFlashlightActive ? "flashlight" : null,
            }),
            false,
            "toggleFlashlight"
          ),

        selectTool: (tool) =>
          set({ selectedTool: tool }, false, "selectTool"),

        // ─────────────────────────────────────────────────────────────────────
        // Puzzle Actions
        // ─────────────────────────────────────────────────────────────────────
        setPuzzleState: (state) =>
          set({ currentPuzzleState: state }, false, "setPuzzleState"),

        updatePuzzleProgress: (day, progress) =>
          set(
            (state) => ({
              puzzleProgress: { ...state.puzzleProgress, [day]: progress },
            }),
            false,
            "updatePuzzleProgress"
          ),

        validateAnswer: (day, answer) => {
          const isCorrect = validateSolution(day, answer);
          if (isCorrect) {
            get().solvePuzzle(day);
            get().unlockNextDay();
          }
          return isCorrect;
        },

        // ─────────────────────────────────────────────────────────────────────
        // Chat Actions
        // ─────────────────────────────────────────────────────────────────────
        addChatMessage: (message) =>
          set(
            (state) => ({
              chatMessages: [
                ...state.chatMessages,
                {
                  ...message,
                  id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  timestamp: new Date(),
                },
              ],
            }),
            false,
            "addChatMessage"
          ),

        toggleChat: () =>
          set((state) => ({ isChatOpen: !state.isChatOpen }), false, "toggleChat"),

        clearChat: () =>
          set({ chatMessages: [] }, false, "clearChat"),

        // ─────────────────────────────────────────────────────────────────────
        // UI Actions
        // ─────────────────────────────────────────────────────────────────────
        toggleInventory: () =>
          set(
            (state) => ({ isInventoryOpen: !state.isInventoryOpen }),
            false,
            "toggleInventory"
          ),

        getNextHint: (day) => {
          const state = get();
          const dayData = getDayData(day);
          if (!dayData) return null;

          const currentIndex = state.currentHintIndex[day] || 0;
          if (currentIndex >= dayData.hints.length) {
            return dayData.hints[dayData.hints.length - 1]; // Return last hint
          }

          // Update hint index
          set(
            (s) => ({
              currentHintIndex: {
                ...s.currentHintIndex,
                [day]: currentIndex + 1,
              },
            }),
            false,
            "getNextHint"
          );

          return dayData.hints[currentIndex];
        },

        // ─────────────────────────────────────────────────────────────────────
        // Audio Actions
        // ─────────────────────────────────────────────────────────────────────
        toggleMute: () =>
          set((state) => ({ isMuted: !state.isMuted }), false, "toggleMute"),

        setRadioFrequency: (freq) =>
          set({ radioFrequency: freq }, false, "setRadioFrequency"),

        // ─────────────────────────────────────────────────────────────────────
        // Game Actions
        // ─────────────────────────────────────────────────────────────────────
        resetGame: () =>
          set(initialState, false, "resetGame"),

        loadProgress: (progress) =>
          set((state) => ({ ...state, ...progress }), false, "loadProgress"),
      }),
      {
        name: "red-protocol-game-storage",
        partialize: (state) => ({
          currentDay: state.currentDay,
          unlockedDays: state.unlockedDays,
          solvedDays: state.solvedDays,
          inventory: state.inventory,
          puzzleProgress: state.puzzleProgress,
          currentHintIndex: state.currentHintIndex,
          isMuted: state.isMuted,
        }),
      }
    ),
    { name: "RedProtocolGameStore" }
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// Selectors (for optimized re-renders)
// ═══════════════════════════════════════════════════════════════════════════════
export const selectCurrentDayData = (state: GameState) =>
  getDayData(state.currentDay);

export const selectIsDaySolved = (day: number) => (state: GameState) =>
  state.solvedDays.includes(day);

export const selectIsDayUnlocked = (day: number) => (state: GameState) =>
  state.unlockedDays.includes(day);

export const selectProgress = (state: GameState) => ({
  solved: state.solvedDays.length,
  total: 24,
  percentage: Math.round((state.solvedDays.length / 24) * 100),
});

export const selectKeyItems = (state: GameState) =>
  state.inventory.filter((item) => item.isKeyItem);

