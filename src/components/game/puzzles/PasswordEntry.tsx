"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Password Entry Puzzle
// Enter the correct code/password to unlock
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { DayData } from "@/src/types/game.types";

interface PasswordEntryProps {
  dayData: DayData;
  onSolve: (answer?: string) => boolean;
}

export function PasswordEntry({ dayData, onSolve }: PasswordEntryProps) {
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle input change
  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only keep last digit
    setCode(newCode);
    setError(false);

    // Auto-advance to next input
    if (value && index < 3) {
      setCurrentIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (index === 3 && value) {
      const fullCode = [...newCode.slice(0, 3), value.slice(-1)].join("");
      validateCode(fullCode);
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      setCurrentIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Validate the entered code
  const validateCode = (fullCode: string) => {
    const isCorrect = fullCode === dayData.solution;

    if (isCorrect) {
      setSuccess(true);
      setTimeout(() => {
        onSolve(fullCode);
      }, 1000);
    } else {
      setError(true);
      // Shake animation is handled by CSS
      setTimeout(() => {
        setCode(["", "", "", ""]);
        setCurrentIndex(0);
        inputRefs.current[0]?.focus();
      }, 500);
    }
  };

  // Handle numpad click
  const handleNumpadClick = (num: string) => {
    if (currentIndex < 4) {
      handleInput(currentIndex, num);
    }
  };

  // Clear all
  const handleClear = () => {
    setCode(["", "", "", ""]);
    setCurrentIndex(0);
    setError(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/95 z-40">
      <motion.div
        className="relative bg-slate-900 rounded-xl p-8 border border-slate-800 max-w-sm w-full mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-slate-600 ml-2 font-mono">
            ACCESS_TERMINAL_v2.1
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-slate-300 tracking-widest uppercase font-mono">
            Enter Access Code
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            4-digit authorization required
          </p>
        </div>

        {/* Code input display */}
        <motion.div
          className={`flex justify-center gap-3 mb-8 ${error ? "animate-shake" : ""}`}
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          {code.map((digit, index) => (
            <div
              key={index}
              className={`relative w-14 h-16 rounded-lg border-2 
                ${error ? "border-red-500 bg-red-950/30" : ""}
                ${success ? "border-green-500 bg-green-950/30" : ""}
                ${!error && !success ? "border-slate-700 bg-slate-800" : ""}
                ${currentIndex === index && !error && !success ? "border-amber-500" : ""}
                transition-colors duration-200`}
            >
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => setCurrentIndex(index)}
                className="w-full h-full bg-transparent text-center text-2xl font-mono font-bold
                  text-amber-500 focus:outline-none"
                disabled={success}
              />

              {/* Cursor blink effect */}
              {currentIndex === index && !digit && !success && (
                <motion.div
                  className="absolute bottom-3 left-1/2 w-4 h-0.5 bg-amber-500 -translate-x-1/2"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map(
            (num) => (
              <motion.button
                key={num}
                onClick={() => {
                  if (num === "C") {
                    handleClear();
                  } else if (num === "⌫") {
                    if (currentIndex > 0) {
                      const newCode = [...code];
                      const targetIndex = code[currentIndex] ? currentIndex : currentIndex - 1;
                      newCode[targetIndex] = "";
                      setCode(newCode);
                      setCurrentIndex(targetIndex);
                      inputRefs.current[targetIndex]?.focus();
                    }
                  } else {
                    handleNumpadClick(num);
                  }
                }}
                className={`h-12 rounded-lg font-mono font-bold text-lg
                  ${num === "C" ? "bg-red-900/50 text-red-400" : ""}
                  ${num === "⌫" ? "bg-amber-900/50 text-amber-400" : ""}
                  ${!["C", "⌫"].includes(num) ? "bg-slate-800 text-slate-300" : ""}
                  hover:bg-slate-700 transition-colors`}
                whileTap={{ scale: 0.95 }}
                disabled={success}
              >
                {num}
              </motion.button>
            )
          )}
        </div>

        {/* Status message */}
        <div className="mt-6 text-center h-6">
          {error && (
            <motion.p
              className="text-red-500 text-sm font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ACCESS DENIED
            </motion.p>
          )}
          {success && (
            <motion.p
              className="text-green-500 text-sm font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ACCESS GRANTED
            </motion.p>
          )}
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-slate-700 mt-4">
          Check your collected evidence for the code
        </p>
      </motion.div>
    </div>
  );
}

export default PasswordEntry;

