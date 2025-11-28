"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Puzzle Assembly
// Drag and drop puzzle pieces to reveal the hidden message
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from "react";
import { motion, Reorder, useDragControls } from "framer-motion";
import { DayData } from "@/src/types/game.types";

interface PuzzleAssemblyProps {
  dayData: DayData;
  onSolve: (answer?: string) => boolean;
}

interface PuzzlePiece {
  id: string;
  correctPosition: number;
  currentPosition: number;
  content: string;
  gridArea: string;
}

// Initial puzzle pieces (shuffled)
const INITIAL_PIECES: PuzzlePiece[] = [
  { id: "piece-1", correctPosition: 0, currentPosition: 2, content: "SEC", gridArea: "1 / 1 / 2 / 2" },
  { id: "piece-2", correctPosition: 1, currentPosition: 0, content: "TOR", gridArea: "1 / 2 / 2 / 3" },
  { id: "piece-3", correctPosition: 2, currentPosition: 3, content: "9", gridArea: "2 / 1 / 3 / 2" },
  { id: "piece-4", correctPosition: 3, currentPosition: 1, content: "█", gridArea: "2 / 2 / 3 / 3" },
];

// Drop zones configuration
const DROP_ZONES = [
  { id: "zone-0", label: "Top Left" },
  { id: "zone-1", label: "Top Right" },
  { id: "zone-2", label: "Bottom Left" },
  { id: "zone-3", label: "Bottom Right" },
];

export function PuzzleAssembly({ dayData, onSolve }: PuzzleAssemblyProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>(INITIAL_PIECES);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Check if puzzle is solved
  const checkSolution = useCallback((currentPieces: PuzzlePiece[]) => {
    const isSolved = currentPieces.every(
      (piece) => piece.currentPosition === piece.correctPosition
    );

    if (isSolved && !isComplete) {
      setIsComplete(true);
      setTimeout(() => {
        onSolve("SECTOR 9");
      }, 1000);
    }

    return isSolved;
  }, [isComplete, onSolve]);

  // Handle piece drop
  const handleDrop = (zoneIndex: number) => {
    if (!draggedPiece) return;

    setPieces((prevPieces) => {
      const newPieces = [...prevPieces];
      const draggedIndex = newPieces.findIndex((p) => p.id === draggedPiece);
      const targetIndex = newPieces.findIndex((p) => p.currentPosition === zoneIndex);

      if (draggedIndex !== -1) {
        // Swap positions
        if (targetIndex !== -1 && targetIndex !== draggedIndex) {
          const temp = newPieces[draggedIndex].currentPosition;
          newPieces[draggedIndex].currentPosition = newPieces[targetIndex].currentPosition;
          newPieces[targetIndex].currentPosition = temp;
        } else {
          newPieces[draggedIndex].currentPosition = zoneIndex;
        }
      }

      checkSolution(newPieces);
      return newPieces;
    });

    setDraggedPiece(null);
  };

  // Get piece at position
  const getPieceAtPosition = (position: number) => {
    return pieces.find((p) => p.currentPosition === position);
  };

  // Check if piece is in correct position
  const isPieceCorrect = (piece: PuzzlePiece) => {
    return piece.currentPosition === piece.correctPosition;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/95 z-40">
      <motion.div
        className="relative max-w-lg w-full mx-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-slate-300 tracking-widest uppercase">
            Reassemble the Map
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Drag pieces to their correct positions
          </p>
        </div>

        {/* Puzzle Grid */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <div className="grid grid-cols-2 gap-2 aspect-square max-w-xs mx-auto">
            {DROP_ZONES.map((zone, index) => {
              const piece = getPieceAtPosition(index);
              const isCorrect = piece && isPieceCorrect(piece);

              return (
                <motion.div
                  key={zone.id}
                  className={`relative aspect-square rounded-lg border-2 border-dashed
                    ${draggedPiece ? "border-amber-500/50" : "border-slate-700"}
                    ${isCorrect ? "border-green-500 border-solid" : ""}
                    transition-colors duration-200`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                >
                  {piece && (
                    <motion.div
                      draggable
                      onDragStart={() => setDraggedPiece(piece.id)}
                      onDragEnd={() => setDraggedPiece(null)}
                      className={`absolute inset-1 rounded-md flex items-center justify-center
                        cursor-grab active:cursor-grabbing
                        ${isCorrect ? "bg-green-900/50" : "bg-slate-800"}
                        border ${isCorrect ? "border-green-600" : "border-slate-700"}
                        hover:border-amber-500 transition-colors`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      layout
                    >
                      {/* Map piece visual */}
                      <div className="text-center">
                        <span
                          className={`text-2xl font-bold font-mono
                            ${isCorrect ? "text-green-400" : "text-amber-500"}`}
                        >
                          {piece.content}
                        </span>

                        {/* Map lines decoration */}
                        <div className="absolute inset-2 opacity-20">
                          <div className="absolute top-1/3 left-0 right-0 h-px bg-slate-500" />
                          <div className="absolute top-2/3 left-0 right-0 h-px bg-slate-500" />
                          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-slate-500" />
                          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-slate-500" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Solution preview when complete */}
          {isComplete && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-green-500 font-bold text-xl tracking-widest">
                SECTOR 9
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Location revealed!
              </p>
            </motion.div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex justify-center gap-2">
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className={`w-3 h-3 rounded-full ${
                isPieceCorrect(piece) ? "bg-green-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Instructions */}
        <p className="text-center text-xs text-slate-600 mt-4">
          {isComplete
            ? "Map reassembled successfully!"
            : `${pieces.filter(isPieceCorrect).length}/4 pieces in place`}
        </p>
      </motion.div>
    </div>
  );
}

export default PuzzleAssembly;

