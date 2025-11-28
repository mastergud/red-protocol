import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════
interface Evidence {
  id: string;
  name: string;
  type: "document" | "photo" | "object" | "audio";
  discovered: boolean;
  description: string;
}

interface CaseState {
  // Case metadata
  caseId: string;
  caseName: string;
  classification: string;
  
  // Evidence tracking
  evidence: Evidence[];
  selectedEvidenceId: string | null;
  
  // UI state
  isTerminalOpen: boolean;
  isEvidenceDrawerOpen: boolean;
  currentView: "scene" | "evidence" | "timeline" | "suspects";
  
  // Audio/Visual settings
  effectsEnabled: boolean;
  audioEnabled: boolean;
  
  // Actions
  selectEvidence: (id: string | null) => void;
  discoverEvidence: (id: string) => void;
  toggleTerminal: () => void;
  toggleEvidenceDrawer: () => void;
  setCurrentView: (view: CaseState["currentView"]) => void;
  toggleEffects: () => void;
  toggleAudio: () => void;
  resetCase: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Initial State
// ═══════════════════════════════════════════════════════════════════════════════
const initialEvidence: Evidence[] = [
  {
    id: "ev-001",
    name: "Mysterious Box",
    type: "object",
    discovered: true,
    description: "A sealed evidence box found at the scene. Contents unknown.",
  },
  {
    id: "ev-002",
    name: "Torn Letter",
    type: "document",
    discovered: false,
    description: "A partially burned letter with cryptic holiday messages.",
  },
  {
    id: "ev-003",
    name: "Red Ornament Fragment",
    type: "object",
    discovered: false,
    description: "A shattered Christmas ornament with traces of an unknown substance.",
  },
  {
    id: "ev-004",
    name: "Security Footage",
    type: "audio",
    discovered: false,
    description: "Corrupted footage from the night of December 24th.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Store
// ═══════════════════════════════════════════════════════════════════════════════
export const useStore = create<CaseState>()(
  devtools(
    persist(
      (set) => ({
        // Initial case data
        caseId: `INV-2024-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
        caseName: "Red Protocol",
        classification: "NOIR-XMAS-2024",
        
        // Evidence
        evidence: initialEvidence,
        selectedEvidenceId: null,
        
        // UI
        isTerminalOpen: false,
        isEvidenceDrawerOpen: false,
        currentView: "scene",
        
        // Settings
        effectsEnabled: true,
        audioEnabled: false,
        
        // Actions
        selectEvidence: (id) =>
          set({ selectedEvidenceId: id }, false, "selectEvidence"),
        
        discoverEvidence: (id) =>
          set(
            (state) => ({
              evidence: state.evidence.map((ev) =>
                ev.id === id ? { ...ev, discovered: true } : ev
              ),
            }),
            false,
            "discoverEvidence"
          ),
        
        toggleTerminal: () =>
          set(
            (state) => ({ isTerminalOpen: !state.isTerminalOpen }),
            false,
            "toggleTerminal"
          ),
        
        toggleEvidenceDrawer: () =>
          set(
            (state) => ({ isEvidenceDrawerOpen: !state.isEvidenceDrawerOpen }),
            false,
            "toggleEvidenceDrawer"
          ),
        
        setCurrentView: (view) =>
          set({ currentView: view }, false, "setCurrentView"),
        
        toggleEffects: () =>
          set(
            (state) => ({ effectsEnabled: !state.effectsEnabled }),
            false,
            "toggleEffects"
          ),
        
        toggleAudio: () =>
          set(
            (state) => ({ audioEnabled: !state.audioEnabled }),
            false,
            "toggleAudio"
          ),
        
        resetCase: () =>
          set(
            {
              evidence: initialEvidence,
              selectedEvidenceId: null,
              isTerminalOpen: false,
              isEvidenceDrawerOpen: false,
              currentView: "scene",
            },
            false,
            "resetCase"
          ),
      }),
      {
        name: "red-protocol-storage",
        partialize: (state) => ({
          evidence: state.evidence,
          effectsEnabled: state.effectsEnabled,
          audioEnabled: state.audioEnabled,
        }),
      }
    ),
    { name: "RedProtocolStore" }
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// Selectors (for optimized re-renders)
// ═══════════════════════════════════════════════════════════════════════════════
export const selectDiscoveredEvidence = (state: CaseState) =>
  state.evidence.filter((ev) => ev.discovered);

export const selectUndiscoveredCount = (state: CaseState) =>
  state.evidence.filter((ev) => !ev.discovered).length;

export const selectSelectedEvidence = (state: CaseState) =>
  state.evidence.find((ev) => ev.id === state.selectedEvidenceId);

