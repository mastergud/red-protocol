"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// Dynamic import of 3D Scene - SSR disabled to prevent hydration errors
// ═══════════════════════════════════════════════════════════════════════════════
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

// ═══════════════════════════════════════════════════════════════════════════════
// Loading Screen
// ═══════════════════════════════════════════════════════════════════════════════
function LoadingScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 border-2 border-red-900 border-t-red-500 rounded-full mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-xs text-slate-600 uppercase tracking-[0.3em]">
          Loading Case Files...
        </p>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI Overlay - Day Title and Hints
// ═══════════════════════════════════════════════════════════════════════════════
function UIOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top Left - Day & Case Title */}
      <motion.div
        className="absolute top-8 left-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* Day indicator */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-slate-600">
            Case Active
          </span>
        </div>

        {/* Main title */}
        <h1 className="text-3xl font-bold tracking-wider text-slate-100 mb-1">
          DAY 1
        </h1>
        <h2
          className="text-lg tracking-[0.2em] uppercase"
          style={{
            color: "#dc2626",
            textShadow: "0 0 20px rgba(220, 38, 38, 0.5)",
          }}
        >
          THE CRASH
        </h2>

        {/* Case number */}
        <p className="text-[10px] text-slate-700 mt-3 tracking-widest font-mono">
          CASE #RP-2024-1224
        </p>
      </motion.div>

      {/* Top Right - Time indicator */}
      <motion.div
        className="absolute top-8 right-8 text-right"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <p className="text-[10px] text-slate-700 uppercase tracking-widest">
          December 24, 1994
        </p>
        <p className="text-xs text-slate-600 font-mono mt-1">23:47</p>
      </motion.div>

      {/* Bottom Center - Hint text */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <p className="text-xs text-slate-600 uppercase tracking-[0.2em] mb-2">
          Examine the evidence on the desk
        </p>
        <motion.p
          className="text-[10px] text-slate-700 tracking-widest"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          [ Click objects to investigate ]
        </motion.p>
      </motion.div>

      {/* Bottom Left - Controls hint */}
      <motion.div
        className="absolute bottom-8 left-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <p className="text-[10px] text-slate-800 uppercase tracking-widest">
          Drag to look around
        </p>
      </motion.div>

      {/* Bottom Right - Protocol badge */}
      <motion.div
        className="absolute bottom-8 right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-red-900" />
          <div>
            <p
              className="text-xs font-bold tracking-widest"
              style={{ color: "#dc2626" }}
            >
              RED PROTOCOL
            </p>
            <p className="text-[8px] text-slate-700 tracking-widest">
              NOIR CHRISTMAS
            </p>
          </div>
        </div>
      </motion.div>

      {/* Decorative corner brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-slate-800/50" />
      <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-slate-800/50" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-slate-800/50" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-slate-800/50" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden">
      {/* 3D Canvas */}
      <Suspense fallback={<LoadingScreen />}>
        <Scene />
      </Suspense>

      {/* UI Overlay */}
      <UIOverlay />

      {/* Subtle scanline overlay on top of everything */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-[0.02]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.5) 2px,
            rgba(0, 0, 0, 0.5) 4px
          )`,
        }}
      />
    </div>
  );
}
