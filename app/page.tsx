"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, selectProgress } from "@/src/store/gameStore";
import { getDay } from "@/src/data/gameContent";
import { Briefcase, Lightbulb } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// Dynamic imports - SSR disabled for 3D and heavy components
// ═══════════════════════════════════════════════════════════════════════════════
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

const WalkieTalkie = dynamic(
  () => import("@/src/components/ui/WalkieTalkie"),
  { ssr: false }
);

// ═══════════════════════════════════════════════════════════════════════════════
// Loading Screen
// ═══════════════════════════════════════════════════════════════════════════════
function LoadingScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950">
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
        <p className="text-xs text-zinc-600 uppercase tracking-[0.3em] font-mono">
          Loading Case Files...
        </p>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Day Complete Modal
// ═══════════════════════════════════════════════════════════════════════════════
function DayCompleteModal() {
  const { showDayComplete, setShowDayComplete, currentDay } = useGameStore();
  const dayData = getDay(currentDay);

  if (!showDayComplete) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowDayComplete(false)}
      >
        <motion.div
          className="bg-zinc-900 border-2 border-amber-600 rounded-xl p-8 max-w-md mx-4 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            ✅
          </motion.div>
          <h2 className="text-2xl font-bold text-amber-500 mb-2 font-mono">
            DAY {currentDay} COMPLETE
          </h2>
          <p className="text-zinc-400 mb-4">{dayData?.titleFr || dayData?.title}</p>
          
          {dayData?.rewardFr && (
            <div className="bg-zinc-800 rounded-lg p-3 mb-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Evidence Collected
              </p>
              <p className="text-amber-400 font-mono">{dayData.rewardFr}</p>
            </div>
          )}

          <button
            onClick={() => setShowDayComplete(false)}
            className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg font-mono transition-colors"
          >
            CONTINUE
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Inventory Panel
// ═══════════════════════════════════════════════════════════════════════════════
function InventoryPanel() {
  const { showInventory, toggleInventoryUI, inventory } = useGameStore();

  return (
    <>
      {/* Inventory Toggle Button */}
      <motion.button
        className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-zinc-800 
          border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleInventoryUI}
      >
        <Briefcase className="w-5 h-5 text-zinc-400" />
        {inventory.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 rounded-full 
            text-[10px] flex items-center justify-center text-white font-bold">
            {inventory.length}
          </span>
        )}
      </motion.button>

      {/* Inventory Drawer */}
      <AnimatePresence>
        {showInventory && (
          <motion.div
            className="fixed left-6 bottom-24 z-40 w-72 bg-zinc-900 border border-zinc-700 
              rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="bg-zinc-800 px-4 py-3 border-b border-zinc-700">
              <h3 className="text-sm font-bold text-amber-500 font-mono tracking-wider">
                EVIDENCE LOCKER
              </h3>
              <p className="text-[10px] text-zinc-600">{inventory.length} items collected</p>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              {inventory.length === 0 ? (
                <p className="text-xs text-zinc-600 text-center py-4">
                  No evidence collected yet.
                </p>
              ) : (
                inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg hover:bg-zinc-800 transition-colors mb-1"
                  >
                    <p className="text-sm text-zinc-200 font-mono">{item.name}</p>
                    <p className="text-[10px] text-zinc-600">Day {item.dayFound}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UV Light Toggle Button
// ═══════════════════════════════════════════════════════════════════════════════
function UVLightButton() {
  const { isUvLightActive, toggleUv } = useGameStore();

  return (
    <motion.button
      className={`fixed bottom-6 left-24 z-40 w-12 h-12 rounded-full 
        flex items-center justify-center transition-colors
        ${isUvLightActive 
          ? "bg-purple-600 border-2 border-purple-400" 
          : "bg-zinc-800 border border-zinc-700 hover:bg-zinc-700"
        }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleUv}
    >
      <Lightbulb className={`w-5 h-5 ${isUvLightActive ? "text-white" : "text-zinc-400"}`} />
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI Overlay - Dynamic Day Info
// ═══════════════════════════════════════════════════════════════════════════════
function UIOverlay() {
  const { currentDay, completedDays } = useGameStore();
  const progress = useGameStore(selectProgress);
  const dayData = getDay(currentDay);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top Left - Day & Case Title */}
      <motion.div
        className="absolute top-8 left-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-mono">
            Case Active • Act {dayData?.act || 1}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-wider text-zinc-100 mb-1 font-mono">
          DAY {currentDay}
        </h1>
        <h2
          className="text-lg tracking-[0.2em] uppercase font-mono"
          style={{
            color: "#f59e0b",
            textShadow: "0 0 20px rgba(245, 158, 11, 0.5)",
          }}
        >
          {dayData?.titleFr || dayData?.title || "THE INVESTIGATION"}
        </h2>

        <p className="text-[10px] text-zinc-700 mt-3 tracking-widest font-mono">
          CASE #RP-1998-TR25
        </p>
      </motion.div>

      {/* Top Right - Progress */}
      <motion.div
        className="absolute top-8 right-8 text-right"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-mono">
          December {currentDay}, 1998
        </p>
        <p className="text-xs text-zinc-600 font-mono mt-1">23:47</p>
        
        {/* Progress bar */}
        <div className="mt-3 w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-[9px] text-zinc-700 mt-1 font-mono">
          {progress.completed}/24 DAYS
        </p>
      </motion.div>

      {/* Bottom Center - Hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <p className="text-xs text-zinc-500 mb-2 font-mono">
          {dayData?.hintFr || "Examine the evidence on the desk"}
        </p>
        <motion.p
          className="text-[10px] text-zinc-700 tracking-widest font-mono"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          [ CLICK OBJECTS TO INVESTIGATE • USE WALKIE-TALKIE FOR HELP ]
        </motion.p>
      </motion.div>

      {/* Bottom Right - Protocol badge */}
      <motion.div
        className="absolute bottom-24 right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-red-900" />
          <div>
            <p className="text-xs font-bold tracking-widest text-red-600 font-mono">
              RED PROTOCOL
            </p>
            <p className="text-[8px] text-zinc-700 tracking-widest font-mono">
              L'AFFAIRE SILENT NIGHT
            </p>
          </div>
        </div>
      </motion.div>

      {/* Decorative corner brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-zinc-800/50" />
      <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-zinc-800/50" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-zinc-800/50" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-zinc-800/50" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  return (
    <div className="relative w-screen h-screen bg-zinc-950 overflow-hidden">
      {/* 3D Canvas */}
      <Suspense fallback={<LoadingScreen />}>
        <Scene />
      </Suspense>

      {/* UI Overlay */}
      <UIOverlay />

      {/* Inventory */}
      <InventoryPanel />

      {/* UV Light Button */}
      <UVLightButton />

      {/* Walkie-Talkie (Agent K) */}
      <WalkieTalkie />

      {/* Day Complete Modal */}
      <DayCompleteModal />

      {/* Subtle scanline overlay */}
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
