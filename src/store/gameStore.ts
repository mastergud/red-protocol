// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Game Store (Zustand)
// Complete state management for the investigation game
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getDay, validateDaySolution, GameDay } from "@/src/data/gameContent";

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════
export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  isAudio?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  dayFound: number;
  description?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// State Interface
// ═══════════════════════════════════════════════════════════════════════════════
interface GameState {
  // Core Progress
  currentDay: number;
  unlockedDays: number[];
  completedDays: number[];
  
  // Inventory
  inventory: InventoryItem[];
  
  // Tools
  isUvLightActive: boolean;
  isFlashlightActive: boolean;
  
  // Walkie-Talkie
  isWalkieTalkieOpen: boolean;
  chatHistory: ChatMessage[];
  isAgentSpeaking: boolean;
  isProcessing: boolean;
  
  // Audio
  isMuted: boolean;
  radioFrequency: number;
  
  // Puzzle State
  currentPuzzleProgress: number;
  scratchProgress: number;
  
  // UI
  showDayComplete: boolean;
  showInventory: boolean;

  // Actions - Progress
  setCurrentDay: (day: number) => void;
  completeDay: (day: number) => void;
  unlockDay: (day: number) => void;
  
  // Actions - Inventory
  addToInventory: (item: InventoryItem) => void;
  hasItem: (itemId: string) => boolean;
  
  // Actions - Tools
  toggleUv: () => void;
  toggleFlashlight: () => void;
  
  // Actions - Walkie-Talkie
  toggleWalkie: () => void;
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChat: () => void;
  setAgentSpeaking: (speaking: boolean) => void;
  setProcessing: (processing: boolean) => void;
  
  // Actions - Audio
  toggleMute: () => void;
  setRadioFrequency: (freq: number) => void;
  
  // Actions - Puzzle
  updateScratchProgress: (progress: number) => void;
  validateAnswer: (day: number, answer: string) => boolean;
  
  // Actions - UI
  setShowDayComplete: (show: boolean) => void;
  toggleInventoryUI: () => void;
  
  // Actions - Game
  resetGame: () => void;
  getCurrentDayData: () => GameDay | undefined;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Store
// ═══════════════════════════════════════════════════════════════════════════════
export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        currentDay: 1,
        unlockedDays: [1],
        completedDays: [],
        inventory: [],
        isUvLightActive: false,
        isFlashlightActive: false,
        isWalkieTalkieOpen: false,
        chatHistory: [],
        isAgentSpeaking: false,
        isProcessing: false,
        isMuted: false,
        radioFrequency: 88.0,
        currentPuzzleProgress: 0,
        scratchProgress: 0,
        showDayComplete: false,
        showInventory: false,

        // ─────────────────────────────────────────────────────────────────────
        // Progress Actions
        // ─────────────────────────────────────────────────────────────────────
        setCurrentDay: (day) => {
          if (get().unlockedDays.includes(day)) {
            set({ currentDay: day, scratchProgress: 0 }, false, "setCurrentDay");
          }
        },

        completeDay: (day) => {
          const state = get();
          if (state.completedDays.includes(day)) return;

          const dayData = getDay(day);
          const newInventory = [...state.inventory];

          // Add reward to inventory
          if (dayData?.reward) {
            newInventory.push({
              id: `reward_day_${day}`,
              name: dayData.reward,
              dayFound: day,
              description: `Evidence from Day ${day}: ${dayData.title}`,
            });
          }

          // Unlock next day
          const nextDay = day + 1;
          const newUnlocked = state.unlockedDays.includes(nextDay)
            ? state.unlockedDays
            : [...state.unlockedDays, nextDay].sort((a, b) => a - b);

          set(
            {
              completedDays: [...state.completedDays, day],
              unlockedDays: newUnlocked,
              inventory: newInventory,
              showDayComplete: true,
              scratchProgress: 0,
            },
            false,
            "completeDay"
          );
        },

        unlockDay: (day) => {
          const state = get();
          if (!state.unlockedDays.includes(day)) {
            set(
              { unlockedDays: [...state.unlockedDays, day].sort((a, b) => a - b) },
              false,
              "unlockDay"
            );
          }
        },

        // ─────────────────────────────────────────────────────────────────────
        // Inventory Actions
        // ─────────────────────────────────────────────────────────────────────
        addToInventory: (item) => {
          const state = get();
          if (!state.inventory.find((i) => i.id === item.id)) {
            set({ inventory: [...state.inventory, item] }, false, "addToInventory");
          }
        },

        hasItem: (itemId) => {
          return get().inventory.some((i) => i.id === itemId);
        },

        // ─────────────────────────────────────────────────────────────────────
        // Tool Actions
        // ─────────────────────────────────────────────────────────────────────
        toggleUv: () => {
          set(
            (state) => ({
              isUvLightActive: !state.isUvLightActive,
              isFlashlightActive: false, // Only one light at a time
            }),
            false,
            "toggleUv"
          );
        },

        toggleFlashlight: () => {
          set(
            (state) => ({
              isFlashlightActive: !state.isFlashlightActive,
              isUvLightActive: false,
            }),
            false,
            "toggleFlashlight"
          );
        },

        // ─────────────────────────────────────────────────────────────────────
        // Walkie-Talkie Actions
        // ─────────────────────────────────────────────────────────────────────
        toggleWalkie: () => {
          set((state) => ({ isWalkieTalkieOpen: !state.isWalkieTalkieOpen }), false, "toggleWalkie");
        },

        addChatMessage: (message) => {
          set(
            (state) => ({
              chatHistory: [
                ...state.chatHistory,
                {
                  ...message,
                  id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  timestamp: new Date(),
                },
              ],
            }),
            false,
            "addChatMessage"
          );
        },

        clearChat: () => {
          set({ chatHistory: [] }, false, "clearChat");
        },

        setAgentSpeaking: (speaking) => {
          set({ isAgentSpeaking: speaking }, false, "setAgentSpeaking");
        },

        setProcessing: (processing) => {
          set({ isProcessing: processing }, false, "setProcessing");
        },

        // ─────────────────────────────────────────────────────────────────────
        // Audio Actions
        // ─────────────────────────────────────────────────────────────────────
        toggleMute: () => {
          set((state) => ({ isMuted: !state.isMuted }), false, "toggleMute");
        },

        setRadioFrequency: (freq) => {
          set({ radioFrequency: freq }, false, "setRadioFrequency");
        },

        // ─────────────────────────────────────────────────────────────────────
        // Puzzle Actions
        // ─────────────────────────────────────────────────────────────────────
        updateScratchProgress: (progress) => {
          set({ scratchProgress: progress }, false, "updateScratchProgress");
        },

        validateAnswer: (day, answer) => {
          const isCorrect = validateDaySolution(day, answer);
          if (isCorrect) {
            get().completeDay(day);
          }
          return isCorrect;
        },

        // ─────────────────────────────────────────────────────────────────────
        // UI Actions
        // ─────────────────────────────────────────────────────────────────────
        setShowDayComplete: (show) => {
          set({ showDayComplete: show }, false, "setShowDayComplete");
        },

        toggleInventoryUI: () => {
          set((state) => ({ showInventory: !state.showInventory }), false, "toggleInventory");
        },

        // ─────────────────────────────────────────────────────────────────────
        // Game Actions
        // ─────────────────────────────────────────────────────────────────────
        resetGame: () => {
          set(
            {
              currentDay: 1,
              unlockedDays: [1],
              completedDays: [],
              inventory: [],
              isUvLightActive: false,
              isFlashlightActive: false,
              chatHistory: [],
              radioFrequency: 88.0,
              scratchProgress: 0,
              showDayComplete: false,
            },
            false,
            "resetGame"
          );
        },

        getCurrentDayData: () => {
          return getDay(get().currentDay);
        },
      }),
      {
        name: "red-protocol-save",
        partialize: (state) => ({
          currentDay: state.currentDay,
          unlockedDays: state.unlockedDays,
          completedDays: state.completedDays,
          inventory: state.inventory,
          isMuted: state.isMuted,
        }),
      }
    ),
    { name: "RedProtocolStore" }
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// Selectors
// ═══════════════════════════════════════════════════════════════════════════════
export const selectProgress = (state: GameState) => ({
  completed: state.completedDays.length,
  total: 24,
  percentage: Math.round((state.completedDays.length / 24) * 100),
});

export const selectIsDayCompleted = (day: number) => (state: GameState) =>
  state.completedDays.includes(day);

export const selectIsDayUnlocked = (day: number) => (state: GameState) =>
  state.unlockedDays.includes(day);

export const selectCurrentDayData = (state: GameState) =>
  getDay(state.currentDay);
