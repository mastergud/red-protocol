"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Radio Tuner Puzzle
// Tune a radio dial to find the correct frequency
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { DayData } from "@/src/types/game.types";
import { useGameStore } from "@/src/store/gameStore";

interface RadioTunerUIProps {
  dayData: DayData;
  onSolve: (answer?: string) => boolean;
}

// Target frequency for this puzzle
const TARGET_FREQUENCY = 94.5;
const FREQUENCY_TOLERANCE = 0.3;

export function RadioTunerUI({ dayData, onSolve }: RadioTunerUIProps) {
  const { radioFrequency, setRadioFrequency } = useGameStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFoundSignal, setHasFoundSignal] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Calculate if we're near the target frequency
  const isNearTarget = Math.abs(radioFrequency - TARGET_FREQUENCY) <= FREQUENCY_TOLERANCE;
  const isOnTarget = Math.abs(radioFrequency - TARGET_FREQUENCY) <= 0.1;

  // Generate static noise intensity based on distance from target
  const getStaticIntensity = useCallback(() => {
    const distance = Math.abs(radioFrequency - TARGET_FREQUENCY);
    return Math.min(1, distance / 10);
  }, [radioFrequency]);

  // Handle knob rotation
  const handleKnobDrag = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !knobRef.current) return;

    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const degrees = angle * (180 / Math.PI);

    // Map angle to frequency (88.0 - 108.0 FM range)
    const normalizedAngle = ((degrees + 180) / 360) * 20 + 88;
    const newFrequency = Math.max(88, Math.min(108, normalizedAngle));

    setRadioFrequency(Math.round(newFrequency * 10) / 10);
  }, [isDragging, setRadioFrequency]);

  // Check for successful tuning
  useEffect(() => {
    if (isOnTarget && !hasFoundSignal) {
      setHasFoundSignal(true);
      setIsPlaying(true);

      // Wait for voice message to "play", then solve
      setTimeout(() => {
        onSolve(TARGET_FREQUENCY.toString());
      }, 3000);
    }
  }, [isOnTarget, hasFoundSignal, onSolve]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/95 z-40">
      <motion.div
        className="relative bg-slate-900 rounded-xl p-8 border border-slate-800 max-w-md w-full mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Radio Title */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-slate-300 tracking-widest uppercase">
            Signal Interceptor
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Model RX-94 | Cold War Era
          </p>
        </div>

        {/* Frequency Display */}
        <div className="bg-slate-950 rounded-lg p-4 mb-6 border border-slate-800">
          <div className="flex items-center justify-center">
            <span className="text-4xl font-mono font-bold text-amber-500">
              {radioFrequency.toFixed(1)}
            </span>
            <span className="text-xl text-amber-600 ml-2">FM</span>
          </div>

          {/* Signal strength indicator */}
          <div className="flex justify-center gap-1 mt-3">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-6 rounded-sm ${
                  i < (1 - getStaticIntensity()) * 10
                    ? isOnTarget
                      ? "bg-green-500"
                      : "bg-amber-500"
                    : "bg-slate-800"
                }`}
                animate={
                  isOnTarget
                    ? { scaleY: [1, 1.2, 1] }
                    : { scaleY: 1 }
                }
                transition={{
                  duration: 0.3,
                  delay: i * 0.05,
                  repeat: isOnTarget ? Infinity : 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Static/Voice visualization */}
        <div className="bg-slate-950 rounded-lg p-4 mb-6 h-24 flex items-center justify-center border border-slate-800 overflow-hidden">
          {isOnTarget && isPlaying ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-green-500 text-sm font-mono mb-1">
                ▶ SIGNAL LOCKED
              </p>
              <p className="text-xs text-slate-500 italic">
                "...coordinates confirmed... Sector 9... midnight..."
              </p>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-slate-600 rounded-full"
                  animate={{
                    height: isNearTarget
                      ? [10, 30, 15, 25, 10]
                      : [5, 15, 8, 12, 5],
                  }}
                  transition={{
                    duration: 0.2,
                    delay: i * 0.02,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tuning Knob */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-slate-600 mb-3 uppercase tracking-widest">
            Rotate to Tune
          </p>

          <div
            ref={knobRef}
            className={`relative w-24 h-24 rounded-full cursor-grab active:cursor-grabbing
              ${isOnTarget ? "bg-green-900/30" : "bg-slate-800"}
              border-4 ${isOnTarget ? "border-green-600" : "border-slate-700"}
              transition-colors duration-300`}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerLeave={() => setIsDragging(false)}
            onPointerMove={handleKnobDrag}
            style={{ touchAction: "none" }}
          >
            {/* Knob indicator line */}
            <motion.div
              className="absolute top-2 left-1/2 w-1 h-8 bg-red-500 rounded-full origin-bottom"
              style={{
                transform: `translateX(-50%) rotate(${
                  ((radioFrequency - 88) / 20) * 360 - 180
                }deg)`,
              }}
            />

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-slate-600 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Frequency markers */}
          <div className="flex justify-between w-full mt-4 px-4">
            <span className="text-xs text-slate-600">88.0</span>
            <span className="text-xs text-red-500 font-bold">94.5</span>
            <span className="text-xs text-slate-600">108.0</span>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-slate-700 mt-6">
          {isOnTarget
            ? "Signal acquired!"
            : isNearTarget
            ? "Getting closer... fine-tune the dial"
            : "Search the FM band for the signal..."}
        </p>
      </motion.div>
    </div>
  );
}

export default RadioTunerUI;

