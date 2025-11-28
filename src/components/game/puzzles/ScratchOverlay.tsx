"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Scratch Overlay Puzzle
// Scratch away frost/surface to reveal hidden clue using HTML5 Canvas
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { DayData } from "@/src/types/game.types";

interface ScratchOverlayProps {
  dayData: DayData;
  onSolve: (answer?: string) => boolean;
}

export function ScratchOverlay({ dayData, onSolve }: ScratchOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const REVEAL_THRESHOLD = 60; // Percentage needed to reveal

  // Initialize canvas with frost layer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 500;

    // Draw frost overlay
    ctx.fillStyle = "#a8d4e6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add frost texture
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 3;
      const alpha = Math.random() * 0.3 + 0.1;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    // Add ice crystal patterns
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      drawIceCrystal(ctx, x, y, 20 + Math.random() * 30);
    }
  }, []);

  // Draw ice crystal pattern
  const drawIceCrystal = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    const branches = 6;
    for (let i = 0; i < branches; i++) {
      const angle = (i * Math.PI * 2) / branches;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
      ctx.stroke();
    }
  };

  // Calculate scratch percentage
  const calculateScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    return (transparentPixels / (pixels.length / 4)) * 100;
  }, []);

  // Scratch function
  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Update percentage
    const newPercentage = calculateScratchPercentage();
    setScratchPercentage(newPercentage);

    // Check if revealed enough
    if (newPercentage >= REVEAL_THRESHOLD && !isRevealed) {
      setIsRevealed(true);
      setTimeout(() => {
        onSolve("4"); // 4-finger handprint
      }, 1000);
    }
  }, [calculateScratchPercentage, isRevealed, onSolve]);

  // Mouse/Touch handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-40">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background - Hidden content (handprint) */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-slate-800 rounded-lg"
          style={{ width: 400, height: 500 }}
        >
          {/* 4-Finger Handprint SVG */}
          <svg
            width="200"
            height="250"
            viewBox="0 0 200 250"
            className="opacity-80"
          >
            {/* Palm */}
            <ellipse cx="100" cy="150" rx="60" ry="70" fill="#8B0000" />
            {/* Finger 1 (Index) - normal */}
            <ellipse cx="50" cy="60" rx="15" ry="50" fill="#8B0000" />
            {/* Finger 2 (Middle) - normal */}
            <ellipse cx="80" cy="45" rx="15" ry="55" fill="#8B0000" />
            {/* Finger 3 (Ring) - normal */}
            <ellipse cx="115" cy="50" rx="14" ry="50" fill="#8B0000" />
            {/* Finger 4 (Pinky) - normal */}
            <ellipse cx="145" cy="70" rx="12" ry="40" fill="#8B0000" />
            {/* Missing thumb area - just a stump */}
            <ellipse cx="160" cy="130" rx="10" ry="15" fill="#5c0000" />
            {/* Text */}
            <text
              x="100"
              y="230"
              textAnchor="middle"
              fill="#dc2626"
              fontSize="14"
              fontFamily="monospace"
            >
              4 FINGERS
            </text>
          </svg>
        </div>

        {/* Scratch canvas overlay */}
        <canvas
          ref={canvasRef}
          className="relative rounded-lg cursor-crosshair touch-none"
          style={{ width: 400, height: 500 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-900/80 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-red-600"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(scratchPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">
            {scratchPercentage < REVEAL_THRESHOLD
              ? "Scratch the frost to reveal the clue..."
              : "Evidence revealed!"}
          </p>
        </div>

        {/* Instructions */}
        <div className="absolute -top-12 left-0 right-0 text-center">
          <p className="text-sm text-slate-400">
            Use your cursor to scratch away the frost
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default ScratchOverlay;

