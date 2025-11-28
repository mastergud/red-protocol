"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Puzzle Manager
// Dynamic component that renders the correct mini-game based on puzzle type
// ═══════════════════════════════════════════════════════════════════════════════

import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { DayData, PuzzleType } from "@/src/types/game.types";
import { useGameStore } from "@/src/store/gameStore";

// Lazy load puzzle components for code splitting
const VisualSearch3D = lazy(() => import("./puzzles/VisualSearch3D"));
const ScratchOverlay = lazy(() => import("./puzzles/ScratchOverlay"));
const UvReveal3D = lazy(() => import("./puzzles/UvReveal3D"));
const RadioTunerUI = lazy(() => import("./puzzles/RadioTunerUI"));
const PuzzleAssembly = lazy(() => import("./puzzles/PuzzleAssembly"));
const PasswordEntry = lazy(() => import("./puzzles/PasswordEntry"));

// ═══════════════════════════════════════════════════════════════════════════════
// Props Interface
// ═══════════════════════════════════════════════════════════════════════════════
interface PuzzleManagerProps {
  dayData: DayData;
  onSolve?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Loading Fallback
// ═══════════════════════════════════════════════════════════════════════════════
function PuzzleLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-12 h-12 border-2 border-red-900 border-t-red-500 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-xs text-slate-500 uppercase tracking-widest">
          Loading Evidence...
        </p>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Puzzle Not Found
// ═══════════════════════════════════════════════════════════════════════════════
function PuzzleNotImplemented({ type }: { type: PuzzleType }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90">
      <div className="text-center p-8 border border-slate-800 rounded-lg max-w-md">
        <div className="text-4xl mb-4">🔧</div>
        <h3 className="text-lg font-bold text-slate-300 mb-2">
          Puzzle In Development
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          The <span className="text-red-500">{type}</span> puzzle type
          is currently being implemented.
        </p>
        <p className="text-xs text-slate-600">
          Check back soon, detective.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Puzzle Manager Component
// ═══════════════════════════════════════════════════════════════════════════════
export function PuzzleManager({ dayData, onSolve }: PuzzleManagerProps) {
  const { currentPuzzleState, validateAnswer, solvePuzzle } = useGameStore();

  // Handle puzzle completion
  const handlePuzzleSolved = (answer?: string) => {
    if (answer) {
      const isCorrect = validateAnswer(dayData.day, answer);
      if (isCorrect) {
        onSolve?.();
      }
      return isCorrect;
    } else {
      // For interaction-only puzzles without typed answers
      solvePuzzle(dayData.day);
      onSolve?.();
      return true;
    }
  };

  // Render solved state overlay
  if (currentPuzzleState === "SOLVED") {
    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            ✅
          </motion.div>
          <h3 className="text-2xl font-bold text-green-500 mb-2">
            EVIDENCE SECURED
          </h3>
          <p className="text-sm text-slate-400">
            Day {dayData.day} Complete
          </p>
          {dayData.reward && (
            <p className="text-xs text-slate-500 mt-2">
              Collected: <span className="text-amber-500">{dayData.reward}</span>
            </p>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // Render puzzle based on type
  const renderPuzzle = () => {
    const commonProps = {
      dayData,
      onSolve: handlePuzzleSolved,
    };

    switch (dayData.type) {
      case "VISUAL_SEARCH":
        return <VisualSearch3D {...commonProps} />;

      case "SCRATCH":
        return <ScratchOverlay {...commonProps} />;

      case "UV_LIGHT":
        return <UvReveal3D {...commonProps} />;

      case "RADIO_TUNING":
        return <RadioTunerUI {...commonProps} />;

      case "PUZZLE_ASSEMBLY":
        return <PuzzleAssembly {...commonProps} />;

      case "PASSWORD":
        return <PasswordEntry {...commonProps} />;

      default:
        return <PuzzleNotImplemented type={dayData.type} />;
    }
  };

  return (
    <Suspense fallback={<PuzzleLoading />}>
      {renderPuzzle()}
    </Suspense>
  );
}

export default PuzzleManager;

